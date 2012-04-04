#!perl -w

use strict;

use Logger;
use Getopt::Std;
use Term::ReadKey;
use FindBin qw($Bin);
use DBI;
use DBD::Oracle qw(:ora_types);

use vars qw($opt_h $opt_S $opt_U $opt_P $opt_p $opt_f $opt_C $opt_o $opt_N $opt_F $sth $sth2 $dbh $outfile $data_root $sql);

getopts("U:P:p:S:o:f:Ch:NF:");

if ( $opt_h ) {
	usage();
	exit 1;
}

my $uid;
my $sid;
my $pwd;

$sid = $opt_S;
$uid = $opt_U;

if ( $opt_P ) {
	$pwd = $opt_P;
}

if ( $opt_p ) {
	$pwd = $ENV{$opt_p};
}


# If not explicitly defined with -N it will set NLS_LANG. To skip this pass -N option
unless ( $opt_N ){
	$ENV{'NLS_LANG'} = 'AMERICAN_AMERICA.WE8ISO8859P1';	
}

unless ( $sid ) {
	$sid = $ENV{GPAS_EXTRACT_SID};
}
unless ( $uid ) {
	$uid = $ENV{GPAS_EXTRACT_UID};
}
unless ( $pwd ) {
	$pwd = $ENV{GPAS_EXTRACT_PWD};

	unless ( $pwd ) {
		# password not given in command line or env
		# prompt for it and hide input
		print STDERR "password: ";
		ReadMode 'noecho';
		$pwd = ReadLine 0;
		chomp $pwd;
		ReadMode 'normal';
		print STDERR "\n";
	}
}

my $sql_file = $opt_f;

$outfile = $opt_o;

unless ( $sid && $uid && $pwd && $sql_file ) {
	usage();
	exit 1;	
}

open(FH, $sql_file )
	or die "Could not open $sql_file: $!\n";

print STDERR "Extracting data to csv using $sql_file\n";

while (<FH>) {
 $sql .= $_;
}
close FH;

my $template_file = $sql_file;
$template_file =~ s/sql$/fmt/;

open(FH, $template_file )
	or die "Could not open $template_file: $!\n";

my $template = join('', <FH>);
close FH;

eval {
	$dbh = DBI->connect("DBI:Oracle:$sid" , $uid, $pwd, {AutoCommit=>0, RaiseError=>1});
	$dbh->do("ALTER SESSION DISABLE PARALLEL QUERY");
};

if ( $@ ) {
	my $err = $@;
	print STDERR 'ERROR',"Failed to connect to $sid using $uid: $err\n";
	die $err;
}

print STDERR "Connected to $sid using $uid.\n";

if ( $opt_F ) {
        $dbh->do(qq{ALTER SESSION SET NLS_DATE_FORMAT='$opt_F'})
                or die "Could not set date format : $DBI::errstr";
}

eval {

	if ($opt_C) { 
		# ref cursor
		$sth = $dbh->prepare($sql);
		$sth->bind_param_inout(":cursor", \$sth2, 0, { ora_type => ORA_RSET } ); 
		$sth->execute;
		$sth->finish;
	} else {
		# normal, simple SELECT
		$sth2 = $dbh->prepare($sql);
		$sth2->execute;
	}
};

if ( $@ ) {
	my $err = $@;
	print STDERR 'ERROR',"Could not execute SQL : $err\n";
	die $err;
}

my $output_fh;
if ( $opt_o ) {
	open ( FH, ">$outfile")
		or die "Could not open $outfile for writing\n";
	$output_fh = *FH;
	print STDERR "Destination file is $outfile\n";
} else {
	$output_fh = *STDOUT;
	print STDERR "Destination file is STDOUT\n";
}


my @row;

my $rowcount = 0;

while ( @row = $sth2->fetchrow_array() ) {
	for ( my $i =0; $i <= $#row; $i++) {
		unless ( defined($row[$i]) ) {
			$row[$i] = '';
		}
	}
	print $output_fh pack $template, @row; 
	print $output_fh "\n";
	$rowcount++;
}

close FH;
print STDERR "$rowcount rows written to destination file.\n";

$sth2->finish;
$dbh->disconnect();

sub usage {
	print "Usage\n";
	print "$0 is a simple utility that writes properly formatted fixed width files from an SQL statement and standard UNIX pack formatfile.  The SQL can either be a straight SQL statement or a function that returns a ref cursor.\n";
	print "Options are:\n";
	print "\t-U Oracle User\n";
	print "\t-S Oracle Server\n";
	print "\t-o Output file.  If output file is not specified then output is STDOUT\n";
        print "\t[-F] Sets NLS_DATE_FORMAT with supplied value.  All date columns will be exported using this format.\n";
	print "\t[-P] Oracle Password.  If omitted, a password prompt will be given.\n";
	print "\t[-p] Oracle Password Environment variable.  Takes name of env var and pulls password from that\n";
	print "\t[-f] SQL file\n";
	print "\t[-N] Specified if you need to bypass setting up NLS_LANG.";
	print "\n";
	print "Examples\n";
	print "--------------------------------------------------------------------\n";
	print "Use sql in test.sql, format file will be test.fmt; output to STDOUT; password being entered on the prompt.\n";
	print "\n";
	print "\t$0 -U gc_explain -S OPGCEXD1 -f test.sql\n";
	print "\n";
	print "Using a ref cursor\n";
	print "Create a file with an anonymous PL/SQL block like below.  ':cursor' is used as an OUT bind variable.\n";
	print "\tBEGIN :cursor := pkg_forms.getallformscursor('00222386'); END;";
	print "\n";
}
1;
