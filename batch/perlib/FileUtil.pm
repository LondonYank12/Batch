package FileUtil;
#
# FileUtil.pm
#
# Purpose:
# Functions to check and manipulate explain files
#
# Author: Stephan Hein
#
#
use strict;

use File::Basename;


my $logger;
my $m_filename;



sub new
{
        my $type = shift;   # shift first parameter into type and removes from param-list
        $logger = shift;
        #my $conf = shift;
        $m_filename = shift;
        my $self = {};



        bless $self, $type;

        return $self;

} # end new

#
# delete self physically
#
sub Delete
{
        my $self = shift;
	unless (Exists()) {
		unless (IsDir()) {
			$logger->WriteLog('ERROR',"file \'$m_filename\' is not a plain file or does not exist");
		} # endif
		return undef;
	} # endif
	unlink $m_filename
		or $logger->WriteLog('ERROR',"Cannot delete file \'$m_filename\'");


} # end Delete




#
# compare self's date
# return true, if older than given days
#
sub OlderThan
{
        my $self = shift;
        my $days = shift;

	unless (Exists()) {
		unless (IsDir()) {
			$logger->WriteLog('ERROR',"file \'$m_filename\' is not a plain file or does not exist");
		} # endif
		return undef;
	} # endif

	stat $m_filename;
	my $mdate = -M _;
	$mdate = int($mdate);
	#print "OlderThan: mdate: $mdate, days: $days\n";
	if ($mdate >= $days) {
		return 1;
	} # endif
	return undef;
	
} # end OlderThan


#
# compress self with gzip
#
sub Compress
{
        my $self = shift;
	unless (Exists()) {
		unless (IsDir()) {
			$logger->WriteLog('ERROR',"file \'$m_filename\' is not a plain file or does not exist");
		} # endif
		return undef;
	} # endif

	# @@@@@ S. Hein, 13.02.2003, force gzip
	my $cmd = "gzip -f $m_filename";
        my @output = `$cmd`;
        my $rc = ($? >> 8);
        if ($rc) {
                $logger->WriteLog('ERROR',"cannot zip file \'$m_filename\': \'@output\'");
                return undef; # failed
        }
	return 1;

} # end Compress

#
# check self's physical presence
# return true, if present
#
sub Exists
{
        my $self = shift;

	stat($m_filename);
	return -f _;
} # end Exists


#
# return true, if file is directory
#
sub IsDir
{
        my $self = shift;

	stat($m_filename);
	return -d _;
} # end IsDir

#
# Checks file ending for ZIP-File
# return true, if it's a zip-file
#
sub IsZipped
{
        my $self = shift;

	return ($m_filename =~ /.gz$/) || ($m_filename =~ /.Z$/);
} # end IsZipped


#
# Get FileName
#
sub GetName
{
        my $self = shift;

	return $m_filename;
} # end GetName
#
# Get FileName
#


sub SetReadPermission
{
        my $self = shift;

	chmod 0440, $m_filename;
} # end SetReadPermission


# Class method to convert a Unix file to a Dos file
sub unix2dos
{
        my $class = shift;
        my $file1 = shift;
        my $file2 = shift;

	FileUtil->fileconv($file1, $file2, '$', "\r");

} # end unix2dos

# Class method to convert a Dos file to a Unix file
sub dos2unix
{
        my $class = shift;
        my $file1 = shift;
        my $file2 = shift;

	FileUtil->fileconv($file1, $file2, '\r$', "");


} # end dos2unix

# Class method to convert a file
sub fileconv
{
        my $class = shift;
        my $file1 = shift;
        my $file2 = shift;
        my $pattern1 = shift;
        my $pattern2 = shift;

	my $line;
	my $tmpfile;

	
	if (!defined($file1) || !defined($file2)) {
		die "FileUtil::fileconv, missing file1 '". $file1."' or file2 '".$file2."'\n";
	} # endif

	#print "FileUtil::fileconv, file1 $file1, file2 $file2\n";

	$tmpfile = "/tmp/".basename($file2);
	#print "FileUtil::fileconv, tmpfile $tmpfile\n";

	open(IN, "< $file1")
		or die "FileUtil::fileconv, cannot open file1 $file1 for reading.\n";
	open(TMP, "> $tmpfile")
		or die "FileUtil::fileconv, cannot open tmpfile $tmpfile for writing.\n";
	while ($line = <IN>) {
		$line =~ s/$pattern1/$pattern2/;

		print TMP $line;
	}
	close(IN);
	close(TMP);

	open(TMP, "< $tmpfile")
		or die "FileUtil::fileconv, cannot open file1 $tmpfile for reading.\n";
	open(OUT, "> $file2")
		or die "FileUtil::fileconv, cannot open file2 $file2 for writing.\n";
	while ($line = <TMP>) {
		print OUT $line;
	} # end while

	close(TMP);
	close(OUT);

	unlink $tmpfile;



} # end fileconv

sub wait_for_growing_file {
        my $filename = shift;
        my $growing = 1;

        die "$filename does not exist" unless ( -e $filename );

        my @wc_res = split (' ', `wc -l $filename`);
        my $orig_records = $wc_res[0];

        while ( $growing == 1) {
                my @wc_orig = split (' ', `wc -l $filename`);
                my $orig_records = $wc_orig[0];

                sleep 2;

                my @wc_res = split (' ', `wc -l $filename`);
                my $records = $wc_res[0];

                if ( $records == $orig_records ) {
                        $growing = 0;
                } else {
                         $logger->WriteLog( 'INFO', "$filename is growing. Waiting..");
                }
        }
}
1;

