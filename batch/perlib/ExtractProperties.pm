package ExtractProperties;
#
# ExtractProperties.pm
#
# Purpose:
# Module that deals with OpenAdaptor-specific Properties for extraction of data from external EXPLAIN-Sources (SystemOfRecord).
#
# Author: Stephan Hein
#
#
use strict;
require Exporter;

use vars qw($VERSION @ISA @EXPORT @EXPORT_OK @EXPORT_TAGS );

$VERSION = 0.01;
@ISA = qw(Exporter);
@EXPORT = qw();
@EXPORT_TAGS = ();

@EXPORT_OK = qw($extract_info $prop_info);
use vars qw($extract_info $prop_info);

my @properties;		# Array to keep the temp property file
my $propertiesRef;

my $asofdate;
my $dbh;

#
# $extract_info
#
# Purpose:
# Reference to a hashtable that stores information (e.g. Property-Filename) about an extract-type.
# The extract-type is the hashkey.
#
#$extract_info;



#
# $prop_info
#
# Purpose:
# Reference to a hashtable of configurable OpenAdaptor Properties.
# See also: sub LoadPropertyFileTemplate.
#
#
$prop_info = {
		uid => { propertyText => "A.C1.UserName = " },
		pwd => { propertyText => "A.C1.Password = " },
		jdbcUrl => { propertyText => "A.C1.JdbcUrl = " },
		asOfDate => { propertyText => "A.AsOfDate = " },
		sqlString => { propertyText => "A.C1.SQLString = " },
		database => { propertyText => "A.C1.Database = " },
		outputFileName => { propertyText => "A.C2.OutputFileName = " }
}; # end extract_prop_info

					
#
# new
#
# Purpose:
# "Constructs" the module and returns a reference to self (the module)
#
#
sub new
{
	my $type = shift;		# shift first parameter into type and removes from param-list
	my $logger = shift;
	my $conf = shift;
	$asofdate = shift;

	#my %params = @_;	# assign remaining parameters
	my $self = {};

	$dbh = Application->getDatabase($logger, $conf);

	#print "ExtractProperties::new, asofdate: $asofdate\n";

	fillExtractInfoFromFileType();


	bless $self, $type;

	return $self;

} # end new

#
# LoadPropertyFileTemplate
#
# Purpose:
# Loads a OpenAdaptor-Property-File in an array, finds configured properties and stores their location in the prop_info hashtable.
#
# Param In: Property-Filename
#
sub LoadPropertyFileTemplate
{
	my $self = shift;
	my $file= shift;		# Property-File-Name

	# reading Property-File-Template ########################################

	#print "LoadPropertyFileTemplate: file: $file\n";

	my $i = 0;
	my $line;
	open(PROPS_FILE_HANDLE, $file);
	while (defined($line = <PROPS_FILE_HANDLE>)) {
		if ($line =~ s/\\\n$//) {
			$line .= <PROPS_FILE_HANDLE>;
			redo unless eof(PROPS_FILE_HANDLE);
		} # endif
		$properties[$i++] = $line;
	} # end while

	close(PROPS_FILE_HANDLE);

	$i = 0;

	# searching for Input-File-Name Property ################################

	foreach $line (@properties) {
		#print $properties[$i];
		if ($line =~ /^$prop_info->{outputFileName}->{propertyText}/) {
			#print "LoadPropertyFileTemplate, outputFileText: $line\n";
			$prop_info->{outputFileName}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{uid}->{propertyText}/) {
			$prop_info->{uid}->{lineIndex} = $i;
			#print "LoadPropertyFileTemplate, uid: $line\n";
		} # endif
		if ($line =~ /^$prop_info->{pwd}->{propertyText}/) {
			$prop_info->{pwd}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{jdbcUrl}->{propertyText}/) {
			$prop_info->{jdbcUrl}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{asOfDate}->{propertyText}/) {
			$prop_info->{asOfDate}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{sqlString}->{propertyText}/) {
			$prop_info->{sqlString}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{database}->{propertyText}/) {
			$prop_info->{database}->{lineIndex} = $i;
		} # endif
		$i++;
	} # end foreach


	$propertiesRef = \@properties;

	return  $propertiesRef; # successful

} # end LoadPropertyFileTemplate


sub fillExtractInfoFromFileType
{
	my $self = shift;
	#print "LoadProperties::fillLoadInfoFromFileType: start\n";

	my @data;

	my $sql = "SELECT A.FILE_TYPE, LOWER(A.SYSTEM_OF_RECORD), B.OA_EXTRACT_PROPERTY_FILE FROM TBL_FILE_TYPE A, TBL_FILE_VERSION B WHERE A.FILE_TYPE = B.FILE_TYPE AND BEGIN_DATE <= TO_DATE(\'$asofdate\', \'YYYYMMDD\') AND END_DATE >= TO_DATE(\'$asofdate\', \'YYYYMMDD\') ";

	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;

	# Read the matching records and print them out
	while (@data = $sth->fetchrow_array()) {
		#print "LoadProperties::fillLoadInfoFromFileType: @data\n";
		$extract_info->{$data[0]}->{outputSubDir} = $data[1];	# system of record
		$extract_info->{$data[0]}->{propertyFileName} = $data[2];

	} # endif

        $sth->finish();


} # end fillExtractInfoFromFileType


sub getExtractInfo
{
	my $self = shift;

	return $extract_info;
} # end getExtractInfo

1;
