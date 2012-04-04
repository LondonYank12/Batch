#!perl -w

use strict;

use lib "$ENV{EXPLAIN_HOME}/perlib";
use lib "$ENV{EXPLAIN_HOME}/conf";

use Conf qw( %conf );
use ExtractProperties qw( $extract_info );
use Extractor;
use LoadProperties; 
use File::Basename;
use DBI;
use Logger;
use BatchProcessUtil;
use English;
use Application;

$SIG{TERM} = 'IGNORE';
$SIG{INT} = 'IGNORE'; # Ignore Ctrl-C


my $argc = $#ARGV + 1; # allow termination only during extraction process (see below)

my $logger;

if ($argc != 1) { # no load_type provided
	$logger = new Logger (system_name=>'explain_extract',
                         log_root=>"$ENV{EXPLAIN_LOG}/",
                         message_level=>20);
} else {
	$logger = new Logger (system_name=>'explain_extract',
			 system_prefix=> $ARGV[0],
			 log_root=>"$ENV{EXPLAIN_LOG}",
			 message_level=>20);
} # endif


my $jobUtil;
my $extractor;
my $loadProperties;
eval {

	$jobUtil = BatchProcessUtil->new($logger, \%conf);

	$extractor = new Extractor(logger => $logger,
                                conf => \%conf);

	$loadProperties = LoadProperties->new($logger, \%conf);


}; # end eval
if ( $@ ) {
	$logger->WriteLog('ERROR', "extract_data failed".$@);
	exit 1;

} # endif

if ($argc != 1) { # only 1 filetype allowed, 1 parameter required
	if ($argc <= 0) { # parameter required
		$logger->WriteLog('ERROR', "extract_data requires an extract_type parameter. Use: extract_data <extract_type>");
	} else {
		$logger->WriteLog('ERROR', "extract_data allows only 1 extract_type. ARGV: \'@ARGV\'. Use: extract_data <extract_type>");
	} # endif

	exit 1;
} # endif

my @extractTypes = keys(%$extract_info);
#print "extractTypes: @extractTypes\n";

my $job_id = $jobUtil->BeginJob($ARGV[0], "EXTRACT", "", "$PROGRAM_NAME @ARGV");
$logger->WriteLog('INFO', "Extract started...");

my $asofdate;
eval {
	$asofdate = $extractor->GetAsOfDate();
};

if ( $@ ) {
	$logger->WriteLog('ERROR', "GetAsOfDate() failed");
	$logger->WriteLog('ERROR', $@);
	$jobUtil->EndJob($job_id, "FAILED");
	exit 1;

} # endif


# create a filtered set of extract types according given parameters
my @param_types;
my $extractTypesRef;
if ($argc > 0) {
	foreach my $extractType (@extractTypes) {
		foreach my $arg (@ARGV) {
			#print "check type $arg for $extractType\n";
			if ("\U$arg" eq "\U$extractType") {
				@param_types = (@param_types, $extractType);
				#print "param_types: @param_types\n";
			} # endif
		} # end foreach
	} # end foreach
	$extractTypesRef = \@param_types;
} else {
	$extractTypesRef = \@extractTypes;
} # endif

if ($#{ $extractTypesRef } < 0) {
	$logger->WriteLog('ERROR', "No valid Extract type, found @ARGV");
	$jobUtil->EndJob($job_id, "FAILED");
	exit 1;
} # endif

my $extract_failed = 0;
my $fileName;

foreach my $extractType (@$extractTypesRef) {

	eval {
		#print "$0: extractType $extractType\n";
		my $target_dir = $loadProperties->getUnprocessedDir($extractType);
		#print "$0: target_dir $target_dir\n";

		$fileName = "$target_dir"."/"."$extractType"."_"."$asofdate".".TXT";
		#print "$0: file $fileName\n";
		$SIG{TERM} = sub {  Application->sigterm_rule();  }; # allow termination only in the eval block
		#print "$0: sigterm stmt \n";		
		#print "$0: ExtractFile $extractType "." $fileName \n";
		$extractor->ExtractFile($extractType, $fileName);
		#print "$0: ExtractFile $extractType "." $fileName \n";
		#print "$0: $extractor \n";
	};
	unless ( $@ ) {
		#$jobUtil->EndJob($job_id, "OK");
		$logger->WriteLog('OK', "Successfully extracted to: \'$fileName\'");
	}
	else
	{
		$logger->WriteLog('ERROR', $@);
		$logger->WriteLog('ERROR', "Failed extracting for type: $extractType");
		# Extract failed
		# delete file
	    
		if (defined($fileName) && -e $fileName) {
			unlink $fileName
				or $logger->WriteLog('ERROR', "Could not delete file $fileName!");
		} # endif

		$extract_failed = 1;
		#$jobUtil->EndJob($job_id, "FAILED");

	} # endif
} # end foreach

if (!$extract_failed) {
	$jobUtil->EndJob($job_id, "OK");
} else {
	$jobUtil->EndJob($job_id, "FAILED");
	exit 1;
} # endif

exit 0;
1;

