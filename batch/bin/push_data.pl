#!perl -w

use strict;

use lib "$ENV{EXPLAIN_HOME}/perlib";
use lib "$ENV{EXPLAIN_HOME}/conf";

use Conf qw( %conf );
use Loader;
use File::Basename;
use DBI;
use Logger;
use LoadProperties qw($prop_info );
use BatchProcessUtil;
use English;
# binary type, ftp directory, help, password env, reg expression, data type, user env, Proxy
use vars qw($opt_b $opt_d $opt_h $opt_m $opt_p $opt_r $opt_t $opt_u $opt_x); # vars for getopt
use Getopt::Std;
use FtpUtil;


use Application;


my $argc = $#ARGV + 1;

my $logger;
my $data_type;
my $job_id;
my $jobUtil;
my $ftp;
my $push_data_failed = 0;
my $regex;
my $dir_env;
my $machine_env;
my $uid_env;
my $pwd_env;
my $proxy;
my $binary;


eval {
	$SIG{TERM} = sub {  Application->sigterm_rule();  }; # allow termination only in the eval block

	if (!$argc) { # no parameters provided
		usage();
		exit 1;
	} # endif
	getopts('bd:m:p:r:t:u:x');

	if (defined($opt_h)) {
		usage();
		exit;
	} # endif

	if (defined($opt_d)) {
		#print "$0: -d set\n";
		$dir_env = $opt_d;
	} else {
		print "$0: -d <dir_env> not set\n";
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

	if (defined($opt_p)) {
		#print "$0: -p set\n";
		$pwd_env = $opt_p;
	} else {
		print "$0: -p <password env> not set\n";
		usage();
		exit;
	} # endif

        if (defined($opt_r)) {
                #print "$0: -r set\n";
                $regex = $opt_r;
	} # endif
        if (defined($opt_t)) {
                #print "$0: -t set\n";
                $data_type = $opt_t;
	} else {
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
        if (defined($opt_x)) {		# FTP Proxy
                #print "$0: -x set\n";
                $proxy = 1;
	} # endif

        if (defined($opt_b)) {		# FTP binary type
                #print "$0: -b set\n";
                $binary = 1;
	} # endif


	if (!defined($regex)) { # set default reg expression
		$regex = '(.*)_.*\.TXT$';
	} # endif


	#print "$0: Args processed\n";

	$logger = new Logger(system_name=>'push_data', log_root=>"$ENV{EXPLAIN_LOG}/");

	$jobUtil = BatchProcessUtil->new($logger, \%conf);
	$job_id = $jobUtil->BeginJob("PUSH_DATA", "PUSH", "", "$PROGRAM_NAME @ARGV");

	my $conf = \%conf;

	# Get Explain Loader for utility functions
	my $loader = new Loader(logger => $logger, conf => $conf);

	# Get Explain Load Properties for utility functions
	my $load_props = LoadProperties->new($logger, $conf);
	my $load_info = $load_props->getLoadInfo();
	my $prefix = $load_info->{$data_type}->{filePrefix};
	#print "Prefix: $prefix\n";


	my $unprocessed_dir = $load_props->getUnprocessedDir($data_type);
	my $failed_dir = $load_props->getFailedDir($data_type);
	my $processed_dir = $load_props->getProcessedDir($data_type);



	#
	# Read files from directory
	#
	my @incoming_files;
	opendir(DIR, $unprocessed_dir);
	my @tmp = grep !/^\.\.?$/, readdir(DIR);
	#print "temp files : @tmp\n";
	foreach my $file (@tmp) {
		#print "check type $data_type for $file\n";

		my $local_name = $file;
    
		# only interested in particular files
		if ($local_name =~ /$regex/) {

			if ($1 eq $prefix) {
				#print "file matched: $file\n";
				push(@incoming_files, $unprocessed_dir."/".$file);
			} # endif
		} # endif
	} # end foreach
	closedir(DIR);

	#print "files to push: @incoming_files\n";

	my $pushed = 0;
	while (!$pushed) {
		$pushed = 1;
		$push_data_failed = 0;
		eval {
			#
			# Open FTP connection
			#
			if (defined($proxy)) {
				#print "proxy used\n";
				$ftp = new FtpUtil($ENV{EXPLAIN_BATCH_PROXY_FTP_HOST}, $ENV{EXPLAIN_BATCH_PROXY_FTP_UID}, $ENV{EXPLAIN_BATCH_PROXY_FTP_PWD}, $logger);
				#print "separate logon\n";
				$ftp->Login($ENV{$uid_env}."@".$ENV{$machine_env}, $ENV{$pwd_env});
			} else {
				$ftp = new FtpUtil($ENV{$machine_env}, $ENV{$uid_env}, $ENV{$pwd_env}, $logger);
			} # endif
			#print "FTP DISABLED!\n";

			if (defined($binary)) {		# set binary type
				$ftp->Binary();
			} # endif

			$ftp->Cd($ENV{$dir_env});
			#
			# process all matched files
			#
			foreach my $file (@incoming_files) {

				my $base_file_name = basename($file);

				# only interested in files that exist
				next unless -e $file;

				#print "process file $file\n";
				eval {
					$ftp->Put($file);
				};
				if ($@) { # Put failed !
					$pushed = 0;	# force retry
					$push_data_failed = 1;
					$logger->WriteLog('ERROR', "FTP-PUT failed for $file: $@");
					#rename "$file", "$failed_dir$base_file_name"
						#or die "Could not move $file to $failed_dir directory: $!";

				} else {
					rename "$file", "$processed_dir$base_file_name"
						or die "Could not move $file to $processed_dir directory: $!";

				} # endif

			} # end foreach
		}; # end eval
		if ($@ || $push_data_failed) # handle FTP problems, try again
		{
			$pushed = 0;	# force retry
			if ($@) {
				$logger->WriteLog('ERROR', "Unexpected error, retry in 30 minutes. Reason: $@");
			} else {
				$logger->WriteLog('ERROR', "At least one file could not be sent, retry in 30 minutes.");
			} # endif

			if (defined($ftp)) {
				$ftp->Close();
			} # endif

			# Check DEADLINE to avoid endless polling
			if ($jobUtil->IsDeadlineReached()) {
				my $deadline = $jobUtil->GetDeadline();
				die "Deadline reached, Deadline: $deadline\n";
			} # endif

			sleep 1800; # seconds

		} # end eval
	} # end while


}; # end eval

my $rc = 0;

if ($@ || $push_data_failed)
{
	if (defined($logger)) {
		if ($@) {
			$logger->WriteLog('ERROR', $@);
		} # endif
		$logger->WriteLog('ERROR', "push data files failed");
	} # endif
	if (defined($job_id)) {
		$jobUtil->EndJob($job_id, "FAILED");
	} # endif
	$rc = 1;

} else {
	$jobUtil->EndJob($job_id, "OK");
	$logger->WriteLog('OK', "data files have been pushed");
} # end if

if (defined($ftp)) {
	$ftp->Close();
} # endif

exit $rc;


sub usage
{
	print "usage: $0 -d <ftp dir> -m <machine env> -p <password env> [-r <Regular Expression>] -t <Data-Type> -u <user env> [-x] [-b]\n";
	print "-x - use FTP Proxy\n";
	print "-b - use binary send mode\n";
	print "-h - help\n";
} # end usage
