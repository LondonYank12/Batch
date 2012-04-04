#
# FtpUtil.pm
#
# Author: Stephan Hein
#
# Purpose:
#
# Utility-Modul for ftp-transfer
#
# Description:
#
#
#
#
package FtpUtil;


use strict;

use lib "$ENV{EXPLAIN_HOME}/perlib";
use lib "$ENV{EXPLAIN_HOME}/conf";

use Net::FTP;
use File::Listing; # imports parse_dir(...)
use POSIX qw(strftime);

my $ftp;
my $host;		# ftp-host
my $home;		# ftp-home
my $logger;

sub new
{
	my $type = shift;		# shift first parameter into type and removes from param-list
	$host = shift;			# ftp-host
	my $uid = shift;		# ftp-uid
	my $pwd = shift;		# ftp-pwd
	$logger = shift;		# logging-handle
	my $self = {};

	#print "host: $host, uid: $uid\n";

	$ftp = Net::FTP->new($host, Debug => 0)
		or die "could not connect to ftp-server $host: $@\n";

	#print "logon...\n";

	unless ($ftp->login($uid, $pwd)) {
		Close();
		die "could not login to ftp-server $host: $@\n";
	} # endif

	#print "pwd...\n";
	#unless ($home = $ftp->pwd()) {
		#Close();
		#die "cannot get current directory: $@\n";
	#} # endif

	#print "home: $home\n";

	bless $self, $type;

	return $self;

} # end new

sub CopyAll
{
	my $self = shift;
	my $aTargetDirectory = shift;
	my $aFileSelector = shift;

	#my @files = $ftp->ls($aFileSelector)
	my @files = $self->ListFiles($aFileSelector)
		or die "cannot get files-list";
	$logger->WriteLog('INFO', "copy files to \'$aTargetDirectory\'...");
	foreach my $file (@files) {

		my $targetFile = $aTargetDirectory.$file;

		# @@@@@ S. Hein, 12.02.2003
		# remove VMS file version
		$targetFile =~ s/;\d$//g;

		#print "get file: $file\n";
		$logger->WriteLog('INFO', "copy file \'$file\'");
		unless ($ftp->get($file, $targetFile)) {
			$logger->WriteLog('ERROR', "get file \'$file\' to \'$targetFile\' failed: $@");
		} # endif
	} # end foreach
} # end  CopyAll

sub MoveAll
{
	my $self = shift;
	my $aTargetDirectory = shift;
	my $aFileSelector = shift;

	#my @files = $ftp->ls($aFileSelector)
	my $entry_ref = parse_dir($ftp->dir());
	my @files = $self->ListFiles($aFileSelector)
		or die "cannot get files-list";
	$logger->WriteLog('INFO', "move files to \'$aTargetDirectory\'...");
	foreach my $file (@files) {

		my $targetFile = $aTargetDirectory.$file;

		# @@@@@ S. Hein, 12.02.2003
		# remove VMS file version
		$targetFile =~ s/;\d$//g;

		#print "move $file to $targetFile\n";
		my $info = $self->getFileInfo($file, $entry_ref);
		if (defined($info)) {
			my ($name, $size, $datetime) = @$info;
			$logger->WriteLog('INFO', "move file \'$file $size $datetime\'");
		} else { # no additional file info
			$logger->WriteLog('INFO', "move file \'$file\'");
		} # endif
		unless ($ftp->get($file, $targetFile)) {
			$logger->WriteLog('ERROR', "get file \'$file\' to \'$targetFile\' failed: $@");
		} else {
			unless ($ftp->delete($file)) {
				$logger->WriteLog('ERROR', "delete file \'$file\' failed: $@");
			} # endif
		} # endif
	} # end foreach
} # end  MoveAll

sub LookUpForFiles
{
	my $self = shift;
	my $aFileSelector = shift;

	my @files = $self->ListFiles($aFileSelector)
		 or return undef;
	#print "LookUpForFiles: files: @files, files-elements: $#files\n";
	return $#files + 1;
} # end LookUpForFiles

sub ListFiles
{
	my $self = shift;
	my $aFileSelector = shift;

	#print "ListFiles: FileSelector: \'$aFileSelector\'\n";
        my @temp_list = $ftp->ls();
	#print "ListFiles: FTP entities: \'@temp_list\'\n";
	my @list;
	foreach my $entry (@temp_list) {
		#print "ListFiles: FTP entity found: \'$entry\'\n";
		if ($entry =~ /$aFileSelector/) {
			push(@list, $entry);
			#print "ListFiles: FTP entity added: \'$entry\'\n";
		} # endif
	} # end for each

        return @list;

} # end ListFiles


sub Put
{
	my $self = shift;
	my $file = shift;

	my $cwd = $ftp->pwd();

	$logger->WriteLog('INFO', "put file \'$file\' to \'$cwd\'");
	$ftp->put($file)
		or die "cannot put file $file: $@\n";


} # end Put(...)


sub Cd
{
	my $self = shift;
	my $aSourceDirectory = shift;
	#print "cwd to $aSourceDirectory\n";
	$ftp->cwd($aSourceDirectory)
		or die "cannot change to directory $aSourceDirectory: $@\n";
	
	my $cwd = $ftp->pwd();
	$logger->WriteLog('INFO', "directory changed to \'$cwd\'");
} # end Cd()

sub Close
{
	my $self = shift;
	$ftp->quit  
		or die "cannot close connection to ftp-site $host: $@\n";
} # end Close()


sub getFileInfo
{
	my $self = shift;
	my $aFileName = shift;
	my $aDirArrayRef = shift;
	
	my $entry_ref;
	if (!defined($aDirArrayRef)) {
		$entry_ref = parse_dir($ftp->dir());
	} else {
		$entry_ref = $aDirArrayRef;
	} # endif
	#my $entry_ref = parse_dir($ftp->dir());
	foreach my $entry (@$entry_ref) {
		my ($name, $type, $size, $mtime, $mode) = @$entry;

				# keine PunktDateien
		next if ($name =~ /^\./);

		#if ($type eq 'd') {
			#print "Directory: $name\n";
		if ($type eq 'f') {
			#print "name: $name, type: $type, size: $size, mtime: $mtime, mode: $mode\n";
			if ($name eq $aFileName) { # file entry found
				my @info;
				@info = ($name, $size, strftime("%Y-%m-%d %H:%M:%S", localtime($mtime)));
				#print "FtpUtil::getFileInfo: @info\n";
				return \@info;
			} # endif
		#} elsif ($type =~ s/^l//) {
			#print "$name  ->  $type\n";
		#} elsif ($type eq '?') {
			#print "Unknown type for $name\n";
		} # endif
	} ## foreach

	#print "ListFiles: files: @files\n";
	return undef;
}


sub Login
{
	my $self = shift;		# self object
	my $uid = shift;		# ftp-uid
	my $pwd = shift;		# ftp-pwd

	#print "Login, uid: $uid\n";

	unless ($ftp->login($uid, $pwd)) {
		Close();
		die "could not login to ftp-server $host: $@\n";
	} # endif

	#unless ($home = $ftp->pwd()) {
		#Close();
		#die "cannot get current directory: $@\n";
	#} # endif

	#print "home: $home\n";


} # end Login


sub Binary
{
	my $self = shift;		# self object


	unless ($ftp->type("I")) {
		Close();
		die "could not change transfer type to binary: $@\n";
	} # endif

	#unless ($ftp->login($uid, $pwd)) {
		#Close();
		#die "could not login to ftp-server $host: $@\n";
	#} # endif

	#unless ($home = $ftp->pwd()) {
		#Close();
		#die "cannot get current directory: $@\n";
	#} # endif

	#print "home: $home\n";


} # end Login



1;

