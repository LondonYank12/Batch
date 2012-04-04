#!perl -w

use strict;

use lib "$ENV{EXPLAIN_HOME}/perlib";
use lib "$ENV{EXPLAIN_HOME}/conf";

use Conf qw( %conf );
use File::Basename;
use DBI;
use English;

use Logger;
use LoadProperties;
use Application;
use BatchProcessUtil;
use Getopt::Std;

# system_of _record, client, help, Reg Expression, preserve file name
use vars qw($opt_d $opt_e $opt_k $opt_m $opt_s $opt_t $opt_c $opt_h $opt_r);

$SIG{TERM} = 'IGNORE';

my $system_of_record;
my $client;
my $delete_input_file = 0;
my $keep_file_name;
my $move_encrypted_file = 0;
my $load_info;
my $gpg;
my $regex='(.*)(_.*)\.TXT$';
my $file_type;
my $recipient;
my $argc = $#ARGV + 1;

# system_of _record, client, help/usage

if (!$argc) { # no parameters provided
	usage();
	exit 1;
} # endif

getopts("de:kmr:s:t:c:hn:");

if (defined($opt_d)) {
	$delete_input_file = 1;
} # endif
if (defined($opt_h)) {
	usage();
	exit;
} # endif
if (defined($opt_e)) {
	#print "$0: -e set\n";
	$recipient = $opt_e;
} else {
	usage();
	exit;
} # endif
if (defined($opt_k)) {
	$keep_file_name = 1;
} # endif
if (defined($opt_m)) {
	$move_encrypted_file = 1;
} # endif
if (defined($opt_s)) {
	#print "$0: -s set\n";
	$system_of_record = "\L$opt_s";
} else {
	usage();
	exit;
} # endif
if (defined($opt_t)) {
	#print "$0: -t set\n";
	$file_type = $opt_t;
} # endif
if (defined($opt_c)) {
	#print "$0: -c set\n";
	$client = "\L$opt_c";
} else {
	print "$0: -c <client> not set\n";
	usage();
	exit;
} # endif
if (defined($opt_r)) {
	#print "$0: -r set\n";
	$regex = $opt_r;
} # endif


my $logger = new Logger (system_name=>'encrypt',
                         log_root=>"$ENV{EXPLAIN_LOG}/",
                         message_level=>20);

my $jobUtil;
my $job_id;
my $encryption_failed = 0;

eval {
	$SIG{TERM} = sub {  Application->sigterm_rule();  }; # allow termination only in the eval block
	$jobUtil = BatchProcessUtil->new($logger, \%conf);
	$job_id = $jobUtil->BeginJob("ENCRYPT", "PGP", "", "$PROGRAM_NAME @ARGV");

	my $loadProperties = LoadProperties->new($logger, \%conf);
	$load_info = $loadProperties->getLoadInfo();
	#my $target_dir = $loadProperties->getUnprocessedDir('cefsus', 'explain');

	my $target_dir = $loadProperties->getUnprocessedDir($system_of_record, $client);
	my $processed_dir = $loadProperties->getProcessedDir($system_of_record, $client);
	my $failed_dir = $loadProperties->getFailedDir($system_of_record, $client);



	if (defined($file_type)) {
		$logger->WriteLog('INFO', "encrypt files for client \'$client\', system of record \'$system_of_record\' from \'$target_dir\', regular expression: \'$regex\', encrypt only for file type \'$file_type\'");
	} else {
		$logger->WriteLog('INFO', "encrypt files for client \'$client\', system of record \'$system_of_record\' from \'$target_dir\', regular expression: \'$regex\'");
	} # endif

        opendir(DIR, $target_dir);
        my @dirlist = grep !/^\.\.?$/, readdir(DIR);
        closedir(DIR);
	#print "dirlist: @dirlist\n";

	#print "regex: \'$regex\'\n";

	my $explainType; my $explainTypeRef;
	while (($explainType, $explainTypeRef) = each(%$load_info)) {
		#print "explainType $explainType, $explainTypeRef->{systemOfRecord}\n";
#=begin
		if ($explainTypeRef->{systemOfRecord} eq "\U$system_of_record" ) {
			if (defined($file_type)) {
				next unless ("\U$explainType" eq "\U$file_type");
			} # endif
			foreach my $file (@dirlist) {
				#print "file: $file \n";

				# only interested in files that exist
				next unless -e $target_dir.$file;
				#print "file $file existiert: \n";

				my $basename = basename($file);
				#print "basename: \'$basename\' \n";

				# only interested in files that match reg expression mask
				next unless ($basename =~ /$regex/);

				# extract the prefix
				my $prefix = $1;
				my $remainder = $2;
				#print "file-prefix: \'$prefix\', remainder: \'$remainder\' \n";

				# compare prefix and encrypt if it is defined
				if ("\L$prefix" eq "\L$explainTypeRef->{filePrefix}") {
					#print "file found: \'$file\'\n";

					my $output_file;
					if (defined($keep_file_name)) {
						$output_file = $file.".pgp";
					}
					else {
						# create output filename
						$output_file = $explainTypeRef->{filePrefix}.$remainder.".pgp";
					} # endif
					#print "output file: \'$output_file\'\n";
					if (-e $target_dir.$output_file) { 		# existing file
						unlink $target_dir.$output_file;	# delete existing file
					} # endif

					# assemble gpg-comand
					my $cmd = "gpg --batch --encrypt --recipient \"$recipient\" -o $target_dir"."$output_file $target_dir"."$file 2>&1";
					#print "gpg cmd: $cmd\n";
					# execute gpg-comand
					#my @output;
					#print "Encryption DISABLED!\n";
					my @output = `$cmd`;
        				my $rc = ($? >> 8);
					if ($rc) {
						$logger->WriteLog('ERROR', "encryption failed for \'$file\', gpg failed: @output");
						if ($delete_input_file) {
							unlink "$target_dir$file"
								or  $logger->WriteLog('ERROR', "cannot delete file \'$target_dir$file\'");
						} else {
							rename "$target_dir$file", "$failed_dir$basename"
								or die "Can not move $file to $failed_dir directory: $!\n";
						} # endif
						$encryption_failed = 1;
					} else {
						$logger->WriteLog('INFO', "file \'$file\' encrypted to \'$output_file\'");
						#print "file $file encrypted\n";
						if ($move_encrypted_file) {
							rename "$target_dir$output_file", "$processed_dir$output_file"
								or die "Can not move $output_file to $processed_dir directory: $!\n";
						} # endif
						if ($delete_input_file) {
							unlink "$target_dir$file"
								or  $logger->WriteLog('ERROR', "cannot delete file \'$target_dir$file\'");
						} else {
							rename "$target_dir$file", "$processed_dir$basename"
								or die "Can not move $file to $processed_dir directory: $!\n";
						} # endif

					} # endif


				} # endif

			} # end foreach
		} # endif
#=end
#=cut
	} # end while


}; # end eval

unless ( $@ || $encryption_failed ) {
	$jobUtil->EndJob($job_id, "OK");
	$logger->WriteLog('OK', "files have been encrypted successfully");
}
else
{
	if (defined($job_id)) {
		$jobUtil->EndJob($job_id, "FAILED");
	} # endif

	if ($@) {
		$logger->WriteLog('ERROR', $@);
	} # endif
	$logger->WriteLog('ERROR', "encryption failed");

} # end unless


sub usage
{
	# system_of _record, client, help/usage
        print "usage: $0 -e <Recipient> [-k] -s <system of record> [-t <file type>] -c <client> [-r <regular expression>] [-p]  [-h]\n";
        print "-d - delete input file\n";
        print "-k - keep original filename\n";
        print "-m - move encrypted file to processed\n";
        print "-r <regex> - optional regular expression to match files to encrypt.\n";
        print "-t <file type> - optional, encrypts only particular File Types.\n";
        print "-h - help\n";
} # end usage


1;

