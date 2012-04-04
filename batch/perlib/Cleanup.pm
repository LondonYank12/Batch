package Cleanup;

use strict;


use FileUtil;
use Application;


my $dbh;
my $logger;


sub new
{
	my $type = shift;		# shift first parameter into type and removes from param-list
	$logger = shift;
	my $conf = shift;
	my $self = {};

	$dbh = Application->getDatabase($logger, $conf);


	bless $self, $type;


	return $self;

} # end new


sub CompressFiles
{
	my $self = shift;
	my $dir = shift;
	my $days = shift;
	my $filetype = shift;


	opendir(DIR, $dir);
	my @files = grep !/^\.\.?$/, readdir(DIR);
	closedir(DIR);
	foreach my $eachfile (@files) {

		#print "file to compress\'$dir$eachfile\'\n";
		my $file = FileUtil->new($logger, $dir.$eachfile);
		if ($file->OlderThan($days)) {
			#print "older than 2 days, ";
			unless ($file->IsZipped()) {
				#print "... compress\n";
				$logger->WriteLog('INFO', "compress file ".$file->GetName());
				$file->Compress();
			} else {
				#print "already compressed\n";
			} # endif
		} # endif

	} # end foreach
} # end CompressFiles


sub DeleteFiles
{
	my $self = shift;
	my $dir = shift;
	my $days = shift;
	my $filetype = shift;


	opendir(DIR, $dir);
	my @files = grep !/^\.\.?$/, readdir(DIR);
	closedir(DIR);
	foreach my $eachfile (@files) {

		if ($filetype) {
			#print "filetype \'$filetype\'\n";
			$eachfile =~ m/(.*?)_/;
			my $prefix = $1;

			unless ("\L$filetype" eq "\L$prefix") {
				next; # continue
			} # endif
		} # endif
		#print "file to delete: \'$dir$eachfile\'\n";
		my $file = FileUtil->new($logger, $dir.$eachfile);

		if ($file->OlderThan($days)) {
			#print "older than $days days, deleting \'$eachfile\'\n";
			$logger->WriteLog('INFO', "delete file ".$file->GetName());
			$file->Delete();
		} # endif

	} # end foreach

} # end DeleteFiles


sub SetWriteProtection
{
	my $self = shift;
	my $dir = shift;


	opendir(DIR, $dir);
	my @files = grep !/^\.\.?$/, readdir(DIR);
	closedir(DIR);
	foreach my $eachfile (@files) {

		#print "file to chmod: \'$dir$eachfile\'\n";
		my $file = FileUtil->new($logger, $dir.$eachfile);

		$file->SetReadPermission();

	} # end foreach

} # end SetWriteProtection

sub ClearDownAllRawData
{
	my $self = shift;

        my $sql = "BEGIN\n sp_cleardown_all_raw_data();\nEND;\n";
	#print "sql: \'$sql\'\n";

	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;

	$sth->finish();

} # end ClearDownAllRawData
1;
