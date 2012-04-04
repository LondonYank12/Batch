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
use BatchProcessUtil;
use Application;
use Getopt::Std;

# system_of _record, client, help, Reg Expression, preserve file name
use vars qw($opt_s $opt_t $opt_c $opt_h $opt_r $opt_p);


$SIG{TERM} = 'IGNORE';


my $system_of_record;
my $client;
my $preserve_file_name = 0;
my $load_info;
my $gpg;
my $regex='.*\.pgp$';
my $file_type;
my $argc = $#ARGV + 1;

# system_of _record, client, help/usage

if (!$argc) { # no parameters provided
	usage();
	exit 1;
} # endif

getopts("s:t:c:hn:p");

if (defined($opt_h)) {
	usage();
	exit;
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
	print "$0: -r set\n";
	$regex = $opt_r;
} # endif
if (defined($opt_p)) {
	$preserve_file_name = 1;
} # endif


my $logger = new Logger (system_name=>'decrypt',
                         log_root=>"$ENV{EXPLAIN_LOG}/",
                         message_level=>20);

my $jobUtil;
my $job_id;

eval {
	$SIG{TERM} = sub {  Application->sigterm_rule();  }; # allow termination only in the eval block
	$jobUtil = BatchProcessUtil->new($logger, \%conf);
	$job_id = $jobUtil->BeginJob("DECRYPT", "PGP", "", "$PROGRAM_NAME @ARGV");

	my $loadProperties = LoadProperties->new($logger, \%conf);
	$load_info = $loadProperties->getLoadInfo();
	#my $target_dir = $loadProperties->getUnprocessedDir('cefsus', 'explain');

	my $target_dir = $loadProperties->getUnprocessedDir($system_of_record, $client);


	if (defined($file_type)) {
		$logger->WriteLog('INFO', "decrypt files for client \'$client\', system of record \'$system_of_record\' from \'$target_dir\', regular expression: \'$regex\', decrypt only for file type \'$file_type\'");
	} else {
		$logger->WriteLog('INFO', "decrypt files for client \'$client\', system of record \'$system_of_record\' from \'$target_dir\', regular expression: \'$regex\'");
	} # endif

        opendir(DIR, $target_dir);
        my @dirlist = grep !/^\.\.?$/, readdir(DIR);
        closedir(DIR);
	#print "dirlist: @dirlist\n";

	my $explainType; my $explainTypeRef;
	while (($explainType, $explainTypeRef) = each(%$load_info)) {
		#print "explainType $explainType, $explainTypeRef->{systemOfRecord}\n";
#=begin
		if ($explainTypeRef->{systemOfRecord} eq "\U$system_of_record" ) {
			if (defined($file_type)) {
				next unless ("\U$explainType" eq "\U$file_type");
			} # endif
			foreach my $file (@dirlist) {
				#print "file $file: \n";

				# only interested in files that exist
				next unless -e $target_dir.$file;
				#print "file $file existiert: \n";

				my $basename = basename($file);
				# @@@@@ S. Hein, 10.02.2003, change to non-case-sensitive
				$basename = "\L$basename";

				# only interested in files that match reg expression mask
				next unless ($basename =~ /(.*)$regex/);

				# extract the prefix
				my $prefix = $1;
				#print "file-prefix: \'$prefix\' \n";

				# compare prefix and decrypt if it is defined
				if ("$prefix" eq "\L$explainTypeRef->{filePrefix}") {
					#print "file found: \'$file\'\n";

					# remove file-extension .pgp and .dat
					$basename =~ s/.pgp$//g;
					my $output_file = $basename;
					if ($preserve_file_name) {
						$output_file = $output_file.".dat";
					} else {
						$basename =~ s/.dat$//g;

						# remove prefix
						$basename =~ s/^$prefix//g;

						# assemble output-filename
						$output_file = $explainType.$basename.".TXT";
					} # endif
					#print "output file: \'$output_file\'\n";

					# assemble gpg-comand
					my $cmd = "gpg --batch -d -o $target_dir"."$output_file $target_dir"."$file 2>&1";
					# execute gpg-comand
					my @output = `$cmd`;
        				my $rc = ($? >> 8);
					if ($rc) {
						# @@@@@ S. Hein, 17.03.2003, change err handling
						#die "decrypt_cefsus: gpg failed: @output";
						$logger->WriteLog('ERROR', "decryption failed for \'$file\', gpg failed: @output");
					} else {
						$logger->WriteLog('INFO', "file \'$file\' decrypted to \'$output_file\'");
						#print "file $file decrypted\n";
						unlink "$target_dir$file"
							or  $logger->WriteLog('ERROR', "cannot delete file \'$target_dir$file\'");
					} # endif


				} # endif 

			} # end foreach
		} # endif
#=end
#=cut
	} # end while


}; # end eval

unless ( $@ ) {
	$jobUtil->EndJob($job_id, "OK");
	$logger->WriteLog('OK', "files have been decrypted successfully");
}
else
{
	if (defined($job_id)) {
		$jobUtil->EndJob($job_id, "FAILED");
	} # endif

	$logger->WriteLog('ERROR', $@);
	$logger->WriteLog('ERROR', "decryption failed");

} # end unless


sub usage
{
	# system_of _record, client, help/usage
        print "usage: $0 -s <system of record> [-t <file type>] -c <client> [-r <regular expression>] [-p]  [-h]\n";
        print "-p - preserve filename\n";
        print "-r <regex> - optional regular expression to match files to decrypt.\n";
        print "-t <file type> - optional, decrypt only particular File Types.\n";
        print "-h - help\n";
} # end usage


1;

