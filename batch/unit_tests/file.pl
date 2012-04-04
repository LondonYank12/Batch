#!/sbcimp/run/pd/perl/5.8.8/bin/perl

use strict;
use warnings;
use File;

my $f = new File(FILE_NAME=>$ARGV[0]);

$f->CreateSymLink( '/home/singleow/myfile.dat');

#$f->SetOriginalFileName('myfile.txt');

print "File_ID: " .  $f->file_id;
print "\n";

print "File_Type: " . $f->file_type;
print "\n";

print "Crr_Date: " . $f->crr_date;
print "\n";

print "File_Name: " . $f->file_name;
print "\n";

print "File_Path: " . $f->file_path;
print "\n";

print "Digest: " . $f->digest;
print "\n";

print "Records_In_File: " . $f->records_in_file;
print "\n";

print "Last_Load_Date: " . $f->last_load_date;
print "\n";

print "File_Status: " . $f->file_status;
print "\n";

print "Original File Name: " . $f->GetOriginalFileName;
print "\n";

print "Load Method Type : " . $f->GetLoadMethodType;
print "\n";
