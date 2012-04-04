#!perl

use strict;
use warnings;
use Getopt::Std;

use LoadData;
use FileType;
use BatchProcessUtil;
use FileHandler;

use vars qw( $opt_t $opt_h $opt_l $opt_D);
getopts('t:hlD');

my $failed_count = 0;

if ( $opt_h ) {
	Usage();
	exit 0;
}
my $file_type = $opt_t;

if ( $opt_l ) {
	ListFileTypes();
	exit 0;
}

unless ( $opt_t ) {
	Usage();
	exit 1;
}

my $logger = new Logger (system_name=>$file_type . '_load',
		         log_root=>$ENV{EXPLAIN_LOG});

my $fh = new FileHandler( FILE_TYPE => $opt_t, LOGGER=>$logger, IGNORE_DIGEST=>1, DEBUG=>$opt_D);

my $jobUtil = new BatchProcessUtil(logger=>$logger);

_write_log('INFO',"Starting load process for $opt_t");

my @files = @{ $fh->getUnprocessedFiles() };
my $processed_dir = $fh->getProcessedDir();
my $failed_dir = $fh->getFailedDir();

unless ( $#files >= 0 ) {
	_write_log('INFO', "No files to process for $opt_t");
}

foreach my $file (@files) {

	my $result; 

	my $ld = LoadData->new( FILE=>$file,
				LOGGER=>$logger,
				DEBUG=>$opt_D);

	eval {
		$result = $ld->LoadData();
	};

	if ( $@ ) {
		_write_log('ERROR', $file->file_name . ' : ' . $@ );
		$file->MoveFile( $failed_dir ); 

		$failed_count++;

	} else {
		$file->MoveFile( $processed_dir );
	}
}

_write_log('INFO',"Finished load process for $opt_t");

if ( $failed_count > 0 ) {
	# ensure that the script exits with non zero status if any files failed to load
	my $msg = "$failed_count files failed to load sucessfully";
	_write_log('INFO', $msg);
	die $msg;
}

sub ListFileTypes {

	my $ft = FileType->new();

	my $hashref = $ft->GetFileTypeRecs();
	foreach my $key ( sort keys %$hashref ) {
		print "$hashref->{$key}->{FILE_TYPE}\t$hashref->{$key}->{SYSTEM_OF_RECORD}\t$hashref->{$key}->{CLIENT}\t";

		if ($hashref->{$key}->{RAW_TABLE} ) {
			print $hashref->{$key}->{RAW_TABLE};
		}
		print "\n";
	}
}

sub Usage {
	print "usage: load_data.pl -lt [filetype]\n";
	print "load specified filetype into database\n";	
	print "\t-t filetype\n";
	print "\t-l list available file types\n";
}


sub _write_log {
	my $status = shift;
	my $msg = shift;

	$logger->WriteLog($status,$msg,$0);
}
