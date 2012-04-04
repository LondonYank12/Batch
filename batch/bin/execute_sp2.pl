#!perl 

use lib "$ENV{EXPLAIN_HOME}/perlib"; 
use lib "$ENV{EXPLAIN_HOME}/conf";

use strict;
use warnings;
use English;

use Conf qw( %conf );
use Getopt::Std;
use DBI;
use Logger;
use BatchProcessUtil;
use vars qw( $opt_p $opt_d $opt_J $opt_C $opt_T $opt_P $opt_N $opt_h $opt_X);

my $call_desc = $0 . ' ' . join(' ',@ARGV);

getopts('p:d:J:C:T:PNXh');

if ( $opt_h || ! defined($opt_p)  ) {
	usage();
	exit 0;
}

my $sp_name = uc($opt_p);

my $ORACLE_SID;
my $ORACLE_UID;
my $ORACLE_PWD;

if ( defined($opt_C) ) {
	$call_desc = $opt_C;
}

my $job_name = $sp_name;
if ( defined($opt_J) ) {
	$job_name = $opt_J;
}

unless ( defined($opt_d) ) { $opt_d = 'EXPLAIN'; };

if ( $opt_d eq 'EXPLAIN' ) {
	$ORACLE_SID = $ENV{EXPLAIN_BATCH_ORACLE_SID};
	$ORACLE_UID = $ENV{EXPLAIN_BATCH_ORACLE_UID};
	$ORACLE_PWD = $ENV{EXPLAIN_BATCH_ORACLE_PWD};
} elsif ( $opt_d eq 'GPAS' ) {
	$ORACLE_SID = $ENV{EXPLAIN_BATCH_ORACLE_GPAS_EXTRACT_SID};
	$ORACLE_UID = $ENV{EXPLAIN_BATCH_ORACLE_GPAS_EXTRACT_UID};
	$ORACLE_PWD = $ENV{EXPLAIN_BATCH_ORACLE_GPAS_EXTRACT_PWD};
} else {
	die "Target database $opt_d not supported!\n";	

}

my $job_type = 'SP_' . $opt_d;
if ( defined($opt_T) ) {
	$job_type = $opt_T . "_" . $opt_d;
}

my $logger = new Logger (system_name=>'execute_sp2_' . lc($opt_d),
		      	 log_root=>$ENV{EXPLAIN_LOG});

my $dbh = DBI->connect("DBI:Oracle: $ORACLE_SID", $ORACLE_UID, $ORACLE_PWD, {AutoCommit=>0, PrintError=>0, RaiseError=>0 })
		or die "Could not connect to $ORACLE_SID as $ORACLE_UID : $DBI::errstr\n";

if ( $opt_P ) {
	WriteLog('INFO', "Enabled parallel query for: $sp_name with SID $ORACLE_SID and UID $ORACLE_UID", $sp_name);
	$dbh->do('alter session enable parallel query')
		or die "Could not enable parallel query : $DBI::errstr\n";
} else {
	$dbh->do('alter session disable parallel query')
		or die "Could not disable parallel query : $DBI::errstr\n";
};#

my $jobUtil = BatchProcessUtil->new($logger, \%conf);

WriteLog('INFO', "execute_sp called for: $sp_name with SID $ORACLE_SID and UID $ORACLE_UID", $sp_name);

my $job_id = $jobUtil->BeginJob($job_name, $job_type, $sp_name, $call_desc);#

$dbh->do("BEGIN $sp_name; END;");

if ( $dbh->errstr ) {
	my $errmsg = $dbh->errstr;
	$errmsg =~ s/\n//g;
	$errmsg =~ s/(.+)(ORA-.*$)/$1/g;

	WriteLog('ERROR', "Failed executing $sp_name", $sp_name);
	WriteLog('ERROR', $errmsg, $sp_name);

	if (defined($job_id)) {#
		$jobUtil->EndJob($job_id, "FAILED");
	} # endif

	$dbh->rollback;
	$dbh->disconnect;
	die $errmsg."\n";
} else {
	$dbh->commit;
}				

$jobUtil->EndJob($job_id, "OK");

WriteLog('OK', "Sucessfully executed: $sp_name", $sp_name);
	
$dbh->disconnect;

sub WriteLog {
	my $status = shift;
	my $message = shift;#
	my $log = shift;
	
	return unless ( ! defined ($opt_X) );

	if ( ! defined($opt_N) || $status eq 'ERROR' ) {
		$logger->WriteLog($status, $message, $log);
	}
}

sub usage {
	print "Usage:\n";
	print "\t-p Procedure name and any parameters using standard Oracle syntax.\n";
	print "\t-d Target Database. (GPAS or Explain). Defaults to Explain.\n";
	print "\t-J Job Name. Defaults to procedure name (ie option p)\n";
	print "\t-C Call Description.  Defaults to script name and parameters.\n";
	print "\t-T Job Type (SP,  REC, MVW, etc ) Defaults to SP. Will have target database appended\n";
	print "\t-P Turn Parallel Query On. Default Off.\n";
	print "\t-N No logging unless failure.\n";
	print "\t-X No logging at all, not even failures.\n";
        print "Examples\n";
	print "Execute Explain procedure\n";
	print "./execute_sp2.pl -p 'pkg_vehicle.is_price_avail(218, pkg_vehicle.get_current_market_date)'\n";
}

sub DESTROY {
	if ( defined($dbh) ) {
		$dbh->disconnect();
	}
}

1;
