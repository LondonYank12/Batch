#!/sbcimp/run/pd/perl/5.8.8/bin/perl

use strict;
use warnings;

use FileHandler;
use LoadData_sqlldr;

#my $fh = new FileHandler( CLIENT=>'PORTAL');

my $fh = new FileHandler( CLIENT=>'EXPLAIN', SYSTEM_OF_RECORD=>'CEFSEU');
#my $fh = new FileHandler( CLIENT=>'EXPLAIN', SYSTEM_OF_RECORD=>'CEFSEU', FILE_TYPE=>'CEFSEUTRANSACTION');

my $files = $fh->getUnprocessedFiles();

my $unprocess_dir = $fh->getUnprocessedDir();
my $processed_dir = $fh->getProcessedDir();
my $failed_dir = $fh->getFailedDir();


my $associated_files = $fh->getAssociatedFilesDir();

foreach my $file ( @$files ) {
	print $file->file_id;
	print "\t";
	print $file->file_name;
	print "\t";
	print $file->file_type;
	print "\t";
	print $file->digest;
	print "\t";
	print $file->records_in_file;
	print "\n";

	if ( $file->file_type ) {
		my $ld = new LoadData_sqlldr(FILE=>$file);

		my $load_id;

		$load_id = $ld->LoadData( $file );

		if ( $load_id ) {
			$file->MoveFile( $processed_dir );
		} else {
			$file->MoveFile( $failed_dir );
		}
	}
}
