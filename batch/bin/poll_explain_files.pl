#!perl -w

use strict;
use English;
use Getopt::Std;
use DBI;
use File::Basename;

use Conf qw( %conf );
use Logger;
use BatchProcessUtil;
use LoadProperties qw($prop_info );
use Application;
use FileUtil;
use Extractor;

use vars qw($opt_h $opt_i $opt_r);

$SIG{TERM} = 'IGNORE';


my $argc = $#ARGV + 1;
my $local_name;
my $base_local_name;
my $check_crr_date = 1;
my $conv_to_unix;
my $regex;

getopts("chir:");
if (defined($opt_h)) {
	usage();
	exit 1;
} # endif
if (defined($opt_i)) {
	$check_crr_date = 0;	# ignore checking crr_date
} # endif
if (defined($opt_r)) {
	#print "$0: -r set\n";
	$regex = $opt_r;
} # endif


my $logger = new Logger (system_name=>'poll_explain_files',
			 log_root=>"$ENV{EXPLAIN_LOG}/",
			 message_level=>20);

my $jobUtil = BatchProcessUtil->new($logger, \%conf);


unless (@ARGV && $#ARGV >= 2) {
	usage();
	$logger->WriteLog('ERROR', "poll_explain_files: unsufficient parameter \'@ARGV\' provided, use: poll_explain_files <EXPLAIN-filetype> <system-of-record> <files-count>");
	exit 1;
} # endif

my $fetch_cmd;
my $fileprefix = "\U$ARGV[0]";

if (!defined($regex)) { # if no regular expression provided
	$regex = "^($fileprefix)_";
} # endif

if ($#ARGV >= 3) { #parameter for fetch-method provided
	$fetch_cmd = $ARGV[3];
	$logger->WriteLog('INFO', "checking for filetype: \'$ARGV[0]\', regex: \'$regex\', systemOfRecord: \'\L$ARGV[1]\', file-count: \'$ARGV[2]\', fetch-method: \'$ARGV[3]\'");
} else {
	$logger->WriteLog('INFO', "checking for filetype: \'$ARGV[0]\', regex: \'$regex\', systemOfRecord: \'\L$ARGV[1]\', file-count: \'$ARGV[2]\'");
} # endif

my $filetype;
my $systemOfRecord = "\L$ARGV[1]";
my $filecount = $ARGV[2];
my $crr_date;

my $arrived=0;
my $job_id;
eval {
	$SIG{TERM} = sub {  Application->sigterm_rule();  }; # allow termination only in the eval block

	my $loadProperties = LoadProperties->new($logger, \%conf);
	my $load_info = $loadProperties->getLoadInfo();
	$filetype = getLoadType($load_info, $fileprefix);
	if (!defined($filetype)) {
		die "no FileType/LoadType defined for prefix \'$fileprefix\'\n";
	} # endif
	#unless ( exists( $load_info->{$filetype} ) ) {
		#die "Unknown file type \'$filetype\'\n";
	#} # end unless
	$job_id = $jobUtil->BeginJob("\U$filetype", "POLLING", "", "$PROGRAM_NAME @ARGV");
	my $extractor = new Extractor(logger => $logger,
                                conf => \%conf);
	my @matched_files;
	while (!$arrived) {
		if ($check_crr_date) {
			$crr_date = $extractor->GetAsOfDate(); # get CRR_DATE from TBL_SYS_CONTROL
			$logger->WriteLog('INFO', "poll_explain_files: check files for CRR_DATE \'$crr_date\'");
		} else {
			$logger->WriteLog('INFO', "poll_explain_files: ignore CRR_DATE");
		} # endif

		# @@@@@ S. Hein, 06.02.2003, fetch files first
		if ($fetch_cmd) {
			$logger->WriteLog('INFO', "poll_explain_files: fetch files with fetch-cmd \'$fetch_cmd\'");
			fetch_files("$fetch_cmd");

		} # endif

		my $unprocessed_dir = $loadProperties->getUnprocessedDir($filetype);

		opendir(DIR, $unprocessed_dir);
		my @tmp = grep !/^\.\.?$/, readdir(DIR);
		#print "temp files : @tmp\n";
		my $files = 0;
		foreach my $file (@tmp) {
			#print "check type $filetype for $file\n";

			# remove VMS file version
			# @@@@@ S. Hein, 10.02.2003, non-case-sensitive
			$local_name = "\U$file";
			$local_name =~ s/;\d$//g;
    
			# @@@@@ S. Hein, 05.02.2003, process pgp-files
			# only interested in .TXT files, .DAT files or .pgp 
			if (($local_name =~ /.TXT$/) || ($local_name =~ /.DAT$/) || ($local_name =~ /.PGP$/)) {
				if ($local_name =~ /$regex/) {
					
					#print "regex: $regex, file_prefix: $fileprefix, local_name: $local_name, dateFormat ".$load_info->{$filetype}->{dateFormat}."\n";

					if ($check_crr_date) {
						my $basename = $local_name;
						# remove file-extension .pgp .dat and .txt
						$basename =~ s/.PGP$//g;
						$basename =~ s/.DAT$//g;
						$basename =~ s/.TXT$//g;

						# remove prefix
						#$basename =~ s/^($fileprefix)_//g;
						$basename =~ s/$regex//g;

						# assemble explain-filename
						my $explainFileName = $filetype."_".$basename.".TXT";
						#print "assembled filename: $explainFileName\n";

						my $aLocalCrrDate = $loadProperties->getFormattedDate($explainFileName, $load_info->{$filetype}->{dateFormat});
						if ($crr_date eq $aLocalCrrDate) {
							#$files++;
							$matched_files[$files++] = $unprocessed_dir.$file;
							#print "files: $files\n";

						} # endif
					} else {
						$matched_files[$files++] = $unprocessed_dir.$file;
						#$files++;
						#print "files: $files\n";
					} # endif
				} # endif
			} # endif
		} # end foreach
		closedir(DIR);
		#print "files: $files\n";
		if ($files >= $filecount) {
			#print "files completed: $files\n";
			$arrived = 1;
			if ($files > $filecount) {
				$logger->WriteLog('ERROR', "poll_explain_files: detected files ($files) > files-count ($filecount), poll_explain_files called with: \'@ARGV\'");
			} # endif
			last; # break;
		} # endif

		if ($check_crr_date) {
			$logger->WriteLog('INFO', "poll_explain_files: files not available for filetype \'$ARGV[0]\' and CRR_DATE \'$crr_date\', retry in 5 minutes");
		} else {
			$logger->WriteLog('INFO', "poll_explain_files: files not available for filetype \'$ARGV[0]\', retry in 5 minutes");
		} # endif

		# Check DEADLINE to avoid endless polling
		if ($jobUtil->IsDeadlineReached()) {
			my $deadline = $jobUtil->GetDeadline();
			die "Deadline reached, Deadline: $deadline\n";
		}

		
		sleep 300; # seconds - 5 min


	} # end while

}; # end eval

unless ( $@ ) {

	$jobUtil->EndJob($job_id, "OK");
	if ($check_crr_date) {
		$logger->WriteLog('OK', "Successfully polled for files with: \'@ARGV\' and CRR_DATE \'$crr_date\'");
	} else {
		$logger->WriteLog('OK', "Successfully polled for files with: \'@ARGV\'");
	} # endif
} else {
	$logger->WriteLog('ERROR', $@);
	$logger->WriteLog('ERROR', "poll_explain_files failed, called for: \'@ARGV\'");
	$jobUtil->EndJob($job_id, "FAILED");
	exit 1;

} # endif

sub fetch_files
{
	for (my $i=0; $i < 3; $i++) {
		my $rc = 0xffff & system($_[0]);
		if ($rc != 0) {
			$logger->WriteLog('WARN', "poll_explain_files, fetch-method \'$_[0]\' failed, retry in 30 seconds");
		} else {
			return;
		} # endif
		sleep(30);
	} # end for
} # end fetch_files

sub getLoadType
{
	my $load_info = $_[0];
	my $prefix = $_[1];
 	while ((my $explainType, my $explainTypeRef) = each(%$load_info)) {
		#print "getFileType: explainType $explainType, prefix ".$explainTypeRef->{filePrefix}."\n";
		if ("\L$explainTypeRef->{filePrefix}" eq "\L$prefix") {
			#print "getFileType: found\n";
			return $explainType;
		} # endif
	} # end while
	return undef;
}


sub usage
{
	# system_of _record, client, help/usage
	print "usage: $0 [-c] [-i] [-r <Reg Expr>] <fileprefix> <system-of-record> <files-count> [fetch-method]\n";
        print "-i - no usage of CRR Date to compare files\n";
        print "-c - convert matched files to UNIX\n";
        print "-r <regex> - optional regular expression to match prefix of files.\n";
        print "-h - help\n";
} # end usage

1;
