#!perl -w

use lib '/sbcimp/run/pd/cpan/5.8.8-2006.03/lib';
# Requires ORACLE_HOME=/sbcimp/run/tp/oracle/client/v10.1.0.4.0-32bit

use strict;

use Getopt::Std;
use Term::ReadKey;
use DBI;
use DBD::Oracle qw(:ora_types);
use DateTime;
use DateTime::Duration;

use vars qw($opt_S $opt_U $opt_P $opt_f $opt_C $opt_o $opt_D $opt_E $opt_H $opt_T $opt_F $opt_N $sth $sth2 $dbh $outfile $data_root $seperator $sql);

getopts("U:P:S:o:f:E:F:CHD:T:N");

my $sid = $opt_S;
my $uid = $opt_U;
my $pwd = $opt_P;

$seperator = $opt_D;

unless ( $seperator ) {
	$seperator = ',';
} else {
	$seperator =~ s/'//g;	
}

unless ( $opt_U && $opt_S && ( $opt_f || $opt_E ) ) {
	usage();
	exit 1;
}

unless ( $pwd ) {
	unless ( $pwd ) {
		# password not given in command line or env
		# prompt for it and hide input
		print "password: ";
		ReadMode 'noecho';
		$pwd = ReadLine 0;
		chomp $pwd;
		ReadMode 'normal';
		print "\n";
	}
}
# If not explicitly defined with -N it will set NLS_LANG. To skip this pass -N option
unless ( $opt_N ){
        $ENV{'NLS_LANG'} = 'AMERICAN_AMERICA.WE8ISO8859P1';
}


$outfile = $opt_o;

if ( $opt_T ) {
	print STDERR "Triming leading and trailing whitespace from all values\n";
}

if ( $opt_f ) {

     my $sql_file = $opt_f;
     open(FH, $sql_file)
     	or die "Could not open $sql_file: $!\n";
     
     print STDERR "Extracting data to csv using $sql_file\n";
     print STDERR "Using '$seperator' as column deliminator\n";
     
     while (<FH>) {
      $sql .= $_;
     }
     close FH;
} elsif ( $opt_E ) {

	$sql = "SELECT * FROM $opt_E";

}

unless ( $sid && $uid && $pwd && $sql && $outfile ) {
	usage();
	exit 1;
}

eval {
	#print STDERR "connect to ORACLE with sid \'$sid\' uid \'$uid\' pwd \'$pwd\'\n";
	$dbh = DBI->connect("DBI:Oracle:".$sid , $uid, $pwd, {AutoCommit=>0, RaiseError=>1});
};

if ( $@ ) {
	die $@;
}

print STDERR "Connected to $sid using $uid.\n";

$dbh->do('ALTER SESSION DISABLE PARALLEL QUERY');

if ( $opt_F ) {
	$dbh->do(qq{ALTER SESSION SET NLS_DATE_FORMAT='$opt_F'})
		or die "Could not set date format : $DBI::errstr";
}

my $start_dt = DateTime->now;

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
	die $@;
}

open ( FH, ">$outfile")
	or die "Could not open $outfile for writing\n";

print STDERR "Destination file is $outfile\n";

my @row;
my $rowRef;

my $rowcount = 0;
my $firstTimePrintHeader = 1;

while ( @row = $sth2->fetchrow_array() ) {
	my $namesRef = $sth2->{NAME};
	if ($firstTimePrintHeader && $opt_H) {
		#print STDERR "Column Names: @$namesRef\n";
		$firstTimePrintHeader = 0;
		my $header = make_header($namesRef, $seperator);
		print STDERR FH $header . "\n";

	} # endif
	for(my $field = 0; $field <= $#row; $field++) {

           if ( $opt_T && $row[$field] ) {
		# trim field
	  	$row[$field] =~ s/^\s+//;
		$row[$field] =~ s/\s+$//;
	   }

	   my $val = make_csv_field($row[$field]);

	   if ( defined($val) ) {
		print FH $val
	   }
	   print FH $seperator unless ( $field == $#row );
	}
	print FH "\n";

	$rowcount++;
}

close FH;

my $end_dt = DateTime->now;
my $duration = $end_dt->delta_ms($start_dt);


my $total_seconds = ($duration->hours * 3600) + ( $duration->minutes() * 60 ) + ( $duration->seconds );

print STDERR "$rowcount rows written to destination file in $total_seconds seconds.\n";

$sth2->finish;
$dbh->disconnect();

sub make_header
{
	my $columnNamesRef = shift;
	my $separator = shift;

	my $header;

	foreach my $each (@$columnNamesRef) {
		$header .= $each . $separator;
		
	} # end foreach
	$header =~ s/$separator$//; # remove separator at line end

return $header;
} # end make_header

sub make_csv_field {

    my $field         = shift;
    my $quote         = '"';
    my $esc           = '"';
    my $sep           = $seperator;

    my $csv_field;

    $field = '' unless defined $field;

    # Escape any quoting characters
    $field =~ s/$quote/$esc$quote/gs;           

    # Replace CR LF within data for just LF for correct 
    # Excel line breaks
    $field =~ s/\n/\cJ/gs;

    # Assemble CSV string
    if ($field =~ /[$sep\n\r\t\f\b\a\e$esc$quote]/s) {
        # $field contains special character`!
        # Must add escape chars to front and end of data
        $csv_field = $esc . $field . $esc;
    }
    else {
        $csv_field = $field;
    }
return $csv_field;
}

sub usage {
	print "Usage\n";
	print "spool_csv.pl is a simple utility that writes properly formatted CSV files from an SQL statement.  The SQL can either be a straight SQL statement or a function that returns a ref cursor.\n";
	print "Options are:\n";
	print "\t-U Oracle User\n";
	print "\t-S Oracle Server\n";
	print "\t-o Output file\n";
	print "\t[-P] Oracle Password.  If omitted, a password prompt will be given.\n";
	print "\t[-T] trim all leading and trailing spaces.\n";
	print "\t[-D] Specify the delimiter.  Defaults to ','\n";
	print "\t[-H] produce optional header containing column names\n";
	print "\t[-f] SQL file\n";
	print "\t[-F] Sets NLS_DATE_FORMAT with supplied value.  All date columns will be exported using this format.\n";
	print "\t[-E] Oracle table or view to export.  Simply selects * from object and writes all rows to output file\n";
	print "\t[-N] Specified if you need to bypass setting up NLS_LANG.";
	print "\n";
	print "Examples\n";
	print "--------------------------------------------------------------------\n";
	print "Export all data from the wmusa table using | as the delimeter with password being entered on the prompt.\n";
	print "Dates will be written in American style dd-mm-yyyy format.\n";
	print "\tspool_csv.pl -D'|' -U gc_explain -S OPGCEXD1 -O wmusa  -o wmusa.out -F dd-mm-yyyy\n";
	print "\n";
	print "Using a ref cursor\n";
	print "Create a file with an anonymous PL/SQL block like below.  ':cursor' is used as an OUT bind variable.\n";
	print "\tBEGIN :cursor := pkg_forms.getallformscursor('00222386'); END;";
	print "\n";
}
1;
