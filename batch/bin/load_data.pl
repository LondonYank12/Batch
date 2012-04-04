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
use Application;
use Getopt::Std;

use vars qw($opt_h $opt_n);

$SIG{INT} = 'IGNORE'; # ignore Ctrl-C
$SIG{TERM} = 'IGNORE'; # termination is only allowed during truncate and load a raw table (see below)

my $logger;
my $load_type;
my $no_move;

getopts("hn");
if (defined($opt_h)) {
	usage();
	exit 1;
} # endif
if (defined($opt_n)) {
	$no_move = 1;	# no file move to processed
} # endif


my $argc = $#ARGV + 1;	# get amount of remaining regular parameters

if ($argc != 1) { # no load_type provided
	$logger = new Logger (system_name=>'explain_load',
			 log_root=>"$ENV{EXPLAIN_LOG}/",
			 message_level=>20);
} else {
	$logger = new Logger (system_name=>'explain_load',
			 system_prefix=> $ARGV[0],
			 log_root=>"$ENV{EXPLAIN_LOG}",
			 message_level=>20);
} # endif



my $jobUtil;
eval {
	$jobUtil = BatchProcessUtil->new($logger, \%conf);
};
if ( $@ ) {
	$logger->WriteLog('ERROR', "load_data failed, cannot create BatchProcessUtil".$@);
	exit 1;
} # endif


my $loader;
eval {
	$loader = new Loader(logger => $logger,
                                conf => \%conf);

};
if ( $@ ) {
	$logger->WriteLog('ERROR', "load_data failed, cannot create loader".$@);
	exit 1;
} # endif


my $loadProperties = LoadProperties->new($logger, \%conf);
my $load_info = $loader->getLoadInfo();

my $local_name;
my $base_local_name;

my @incoming_files;
my $systemOfRecordList = $loadProperties->getSystemOfRecordList();


if ($argc != 1) { # only 1 filetype allowed, 1 parameter required
	if ($argc <= 0) { # parameter required
		$logger->WriteLog('ERROR', "load_data requires a load_type parameter.");
		print "load_data requires a load_type parameter.\n";
		usage();
	} else {
		$logger->WriteLog('ERROR', "load_data allows only 1 load_type. ARGV: \'@ARGV\'.");
		print "load_data allows only 1 load_type. ARGV: \'@ARGV\'.\n";
		usage();
	} # endif

	exit 1;
} # endif

$load_type = $ARGV[0];

my $job_id = $jobUtil->BeginJob($ARGV[0], "LOAD", "", "$PROGRAM_NAME @ARGV");


my $unprocessed_dir = $loadProperties->getUnprocessedDir($load_type);
my $failed_dir = $loadProperties->getFailedDir($load_type);
my $processed_dir = $loadProperties->getProcessedDir($load_type);


opendir(DIR, $unprocessed_dir);
my @tmp = grep !/^\.\.?$/, readdir(DIR);
#print "temp files : @tmp\n";
foreach my $file (@tmp) {
	#print "check type $arg for $file\n";

	# remove VMS file version
	$local_name = $file;
	$local_name =~ s/;\d$//g;
    
	# only interested in .TXT files or .DAT files
	if (($local_name =~ /.TXT$/) || ($local_name =~ /.DAT$/)) {

		my $type =$loader->GetLoadType($file);
		if ("\U$load_type" eq "\U$type") {
			#print "load for file $file\n";
			push(@incoming_files, $unprocessed_dir.$file);
		} # endif
	} # endif
} # end foreach
#print "files to load: @incoming_files\n";
closedir(DIR);



my %loaded_files;
my %duplicate_files;
my %error_files;

unless (@incoming_files) {
	$logger->WriteLog('ERROR', "no files to load for load_type \'@ARGV\' in systemOfRecord-list \'@{$systemOfRecordList}\', expecting files with file-name-format <load_type>_*.TXT or <load_type>_*.DAT");
	$jobUtil->EndJob($job_id, "FAILED");
	exit 1;
} # endif


my $load_failed = 0;

foreach my $file (@incoming_files) {

    # only interested in files that exist
    next unless -e $file;

    # remove VMS file version
    $local_name = $file;
    $local_name =~ s/;\d$//g;
    
    # only interested in .TXT files or .DAT files
    next unless ($local_name =~ /.TXT$/) || ($local_name =~ /.DAT$/);
    
    unless ( $local_name eq $file ) {
	unlink $local_name;
	
	rename $file, $local_name
	    or die "Could not rename $file to $local_name: $!";
	
	$logger->WriteLog('OK',"Renamed $file to $local_name", 20);
    }
    
	# trim off the full path leaving just the file name
	$base_local_name = basename($local_name);
	my $systemOfRecord = $loader->GetSystemOfRecord($load_type);
	$systemOfRecord = "\L$systemOfRecord"; # Lowercase
	my $processed_file_name = $processed_dir."/".$base_local_name;

	my $load_type = $loader->GetLoadType($base_local_name);
	# my $job_id = $jobUtil->BeginJob($load_type, "LOAD", "", "$PROGRAM_NAME @ARGV");

	eval {
		#$SIG{TERM} = sub {  Application->sigterm_rule();  }; # allow termination only in the eval block

		$loader->TruncateTable($load_type, $base_local_name);
		$loader->LoadFile("$local_name");
	}; # end eval

	unless ( $@ ) {
		# loaded sucessfully
		# move file into processed directory
	    
		if (!defined($no_move)) {
			rename "$local_name", "$processed_file_name";
		} # endif

	#	or die "Could not move $local_name to $processed_file_name: $!";
	    
		#$jobUtil->EndJob($job_id, "OK");
		$logger->WriteLog('OK', "Sucessfully loaded: $base_local_name");
	    
	} else {
		$logger->WriteLog('ERROR', $@);
		$logger->WriteLog('ERROR', "Failed loading: $base_local_name");

		# Load failed
		# set file_status to OFFLINE
		# move file into failed directory
		$loader->setFileStatus($base_local_name, "OFFLINE");
 
		rename "$local_name", "$failed_dir$base_local_name"
			or die "Could not move $local_name to $failed_dir directory: $!";
	    
		# $jobUtil->EndJob($job_id, "FAILED");
		$load_failed = 1;

	} # endif
	
	
} # end foreach

if (!$load_failed) { # at least 1 load has been failed
	$jobUtil->EndJob($job_id, "OK");
} else {
	$jobUtil->EndJob($job_id, "FAILED");
} # endif

exit $load_failed;

sub usage
{
	# usage
	print "usage: $0 [-n] <load_type>\n";
        print "-n - no move of files to processed folder\n";
        print "-h - help\n";
} # end usage

