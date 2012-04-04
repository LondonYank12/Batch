#!perl -w

use strict;

use FindBin qw($Bin);
use lib "$ENV{EXPLAIN_HOME}/perlib";
use lib "$ENV{EXPLAIN_HOME}/conf";

use Conf qw( %conf );
use File::Basename;
use DBI;
use Net::FTP;
use Logger;
use FtpUtil;
use BatchProcessUtil;
use English;
use Application;
use LoadProperties;
use Getopt::Std;

# system_of _record, client, machine/host, reg expression, user-id, password, help/usage, directory, proxy
use vars qw($opt_s $opt_c $opt_m $opt_r $opt_u $opt_p $opt_h $opt_d $opt_x);

$SIG{TERM} = 'IGNORE';


my $ftp;
my $argc = $#ARGV + 1;
my $system_of_record;
my $client;
my $machine_env;
my $regex = "";
my $uid_env;
my $pwd_env;
my $dir_env;
my $proxy;


# system_of _record, client, machine/host, reg expression, user-id, password, help/usage

if (!$argc) { # no parameters provided
	usage();
	exit 1;
} # endif

getopts("s:c:m:r:u:p:h:d:x");

if (defined($opt_h)) {
	usage();
	exit;
} # endif
if (defined($opt_s)) {
	#print "$0: -s set\n";
	$system_of_record = $opt_s;
} else {
	usage();
	exit;
} # endif
if (defined($opt_c)) {
	#print "$0: -c set\n";
	$client = $opt_c;
} else {
	print "$0: -c <client> not set\n";
	usage();
	exit;
} # endif
if (defined($opt_m)) {
	#print "$0: -m set\n";
	$machine_env = $opt_m;
} else {
	print "$0: -m <machine_env> not set\n";
	usage();
	exit;
} # endif
if (defined($opt_r)) {
	#print "$0: -r set\n";
	$regex = $opt_r;
} else {
	print "$0: -r <reg expression env> not set\n";
	usage();
	exit;
} # endif
if (defined($opt_u)) {
	#print "$0: -u set\n";
	$uid_env = $opt_u;
} else {
	print "$0: -u <user env> not set\n";
	usage();
	exit;
} # endif
if (defined($opt_p)) {
	#print "$0: -p set\n";
	$pwd_env = $opt_p;
} else {
	print "$0: -p <password env> not set\n";
	usage();
	exit;
} # endif
if (defined($opt_d)) {
	#print "$0: -d set\n";
	$dir_env = $opt_d;
} else {
	print "$0: -d <dir env> not set\n";
	usage();
	exit;
} # endif
if (defined($opt_x)) {		# FTP Proxy
	#print "$0: -x set\n";
	$proxy = 1;
} # endif




my $logger = new Logger (system_name=>'fetch_ftp',
                         log_root=>"$ENV{EXPLAIN_LOG}/",
                         message_level=>20);


$logger->WriteLog('INFO', "move files from ftp-site \'$ENV{$machine_env}\', SELECT expr: \'$regex\'");

my $jobUtil = BatchProcessUtil->new($logger, \%conf);


my $job_id = $jobUtil->BeginJob("FETCH_FTP", "FETCH", "", "$PROGRAM_NAME @ARGV");
eval {
	$SIG{TERM} = sub {  Application->sigterm_rule();  }; # allow termination only in the eval block

	my $load_props = LoadProperties->new($logger, \%conf);

	my $target_dir = $load_props->getUnprocessedDir($system_of_record, $client);

	if (defined($proxy)) {
		#print "proxy used\n";
		$ftp = new FtpUtil($ENV{EXPLAIN_BATCH_PROXY_FTP_HOST}, $ENV{EXPLAIN_BATCH_PROXY_FTP_UID}, $ENV{EXPLAIN_BATCH_PROXY_FTP_PWD}, $logger);
		#print "separate logon\n";
		$ftp->Login($ENV{$uid_env}."@".$ENV{$machine_env}, $ENV{$pwd_env});
	} else {
		$ftp = new FtpUtil($ENV{$machine_env}, $ENV{$uid_env}, $ENV{$pwd_env}, $logger);
	} # endif



	$ftp->Cd($ENV{$dir_env});
	#my $regex = '\.pgp$';
	#my $regex = $ENV{$regex_env};
	if ($ftp->LookUpForFiles($regex)) {
		$ftp->MoveAll($target_dir, $regex);
	} # endif
	$ftp->Close();
};

unless ( $@ ) {
	$jobUtil->EndJob($job_id, "OK");
	$logger->WriteLog('OK', "files have been moved from ftp-site \'$ENV{$machine_env}\'");
}
else
{
	$logger->WriteLog('ERROR', $@);
	$logger->WriteLog('ERROR', "fetch FTP files failed");
	$jobUtil->EndJob($job_id, "FAILED");
	exit 1;

} # end unless

exit 0;


sub usage
{
	# system_of _record, client, machine/host, reg expression, user-id, password, help/usage, directory
        print "usage: $0 -s <system of record> -c <client> -m <machine env> -r <reg expr env> -u <uid env> -p <pwd env> -d <directory env> [-h <help>] [-x]\n";
} # end usage


