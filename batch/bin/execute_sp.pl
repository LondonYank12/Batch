#!perl -w

use strict;

use lib "$ENV{EXPLAIN_HOME}/perlib";
use lib "$ENV{EXPLAIN_HOME}/conf";

use Conf qw( %conf );
use File::Basename;
use DBI;
use Logger;
use BatchProcessUtil;
use English;
use Application;

$SIG{TERM} = 'IGNORE';


my $dbh;
my $confref = \%conf;
my $logger;
my $jobUtil;
my $sp_name;
my $job_id;
my $paramstring = "";

eval {
	$SIG{TERM} = sub {  Application->sigterm_rule();  }; # allow termination only in the eval block
	my $s;
	my $i = 0;
	my $argc = $#ARGV + 1;
	if ($argc <= 0) { # no parameters provided
		print "usage: execute_sp Sp_Name \n";
		die "no parameters provided";
	} # endif
	$sp_name = "\U$ARGV[0]";

	for (my $i=1, my $separator=""; $i < $argc; $i++) {
		$paramstring = $paramstring.$separator."\'$ARGV[$i]\'";
		$separator=",";
	} # endfor

	#print "paramstring: $paramstring\n";

	$logger = new Logger (system_name=>'execute_sp',
			 log_root=>"$ENV{EXPLAIN_LOG}/",
			 message_level=>20);

	$logger->WriteLog('INFO', "execute_sp called for: \'@ARGV\' with SID \'$confref->{ORACLE_SID}\' and UID \'$confref->{ORACLE_UID}\'", $sp_name);
	$jobUtil = BatchProcessUtil->new($logger, \%conf);

	#print "nach logger\n";
	$dbh = DBI->connect("DBI:Oracle:" . $confref->{ORACLE_SID}, $confref->{ORACLE_UID}, $confref->{ORACLE_PWD}, {AutoCommit=>0, RaiseError=>0 }) 
		or die "Could not connect to $confref->{ORACLE_SID} as $confref->{ORACLE_UID} : $DBI::errstr";
	#print "nach connect\n";
	$job_id = $jobUtil->BeginJob($sp_name, "SP", $sp_name, "$PROGRAM_NAME @ARGV");

	if ($ENV{EXPLAIN_BATCH_TRACE}) {
		$s = "BEGIN\n pkg_trace.set_level(pkg_trace.".$ENV{EXPLAIN_BATCH_TRACE}."); $sp_name($paramstring);\nEND;\n";
	} else {
		$s = "BEGIN\n $sp_name($paramstring);\nEND;\n";
	} # endif
	#print "prepare: \'$s\'\n";
	my $sp = $dbh->prepare($s)
		or die "Could not prepare \'$s\' : ". $dbh->errstr."\n";
	if (!$sp->execute) {
		my $errmsg = $dbh->errstr;
		$errmsg =~ s/\n//g;
		$errmsg =~ s/(.+)(ORA-.*$)/$1/g;
		die $errmsg."\n";
	} # endif
	$dbh->commit;
				
					
};

unless ( $@ ) {
	    
	    
	$jobUtil->EndJob($job_id, "OK");
	$logger->WriteLog('OK', "Sucessfully executed: \'$sp_name($paramstring)\'", $sp_name);
	    
} else {
	    
	    
	$logger->WriteLog('ERROR', "Failed executing procedure $sp_name: \'$@\'", $sp_name);
	if (defined($job_id)) {
		$jobUtil->EndJob($job_id, "FAILED");
	} # endif
	if (defined($dbh)) {
		$dbh->rollback;
	} # endif
	
	die "Failed executing $sp_name.  See logs for details\n";

}
	
sub DESTROY {
	$dbh->disconnect;
}
1;
