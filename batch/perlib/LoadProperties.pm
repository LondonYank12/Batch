package LoadProperties;

use strict;
require Exporter;

use vars qw($VERSION @ISA @EXPORT @EXPORT_OK @EXPORT_TAGS );

$VERSION = 0.01;
@ISA = qw(Exporter);
@EXPORT = qw();
@EXPORT_TAGS = ();

#@EXPORT_OK = qw($load_info $prop_info);
#use vars qw( $load_info $prop_info);
@EXPORT_OK = qw($prop_info);
use vars qw($prop_info);

use Logger;
use DBI;
use File::Basename;

my $logger;
my $conf;
my $dbh;

my $load_info;

$prop_info = {	dataInputFile => { propertyText => "A.C1.InputFileName = " },
		systemOfRecord => { propertyText => "A.SystemOfRecord = " },
		sinkComponent => { propertyText => "A.LinkedOracleSinkComponent = " },
		batchSize => { propertyText => "A.C1.BatchSize = " },
		ignoreHeaderLines => { propertyText => "A.C1.IgnoreHeaderLines = " },
		uid => { propertyText => "UserName = " },
		pwd => { propertyText => "Password = " },
		jdbcUrl => { propertyText => "JdbcUrl = " },
		estimatedRecords => { propertyText => "A.EstimatedRecords = "}
}; # end prop_info

					

sub new
{
	my $type = shift;		# shift first parameter into type and removes from param-list
	$logger = shift;
	$conf = shift;
	my $self = {};


	$dbh = Application->getDatabase($logger, $conf);


	fillLoadInfoFromFileType();

	bless $self, $type;

	return $self;

} # end new

sub fillLoadInfoFromFileType
{
	my $self = shift;
	#print "LoadProperties::fillLoadInfoFromFileType: start\n";

	my @data;

	my $sql = "SELECT FILE_TYPE, DATE_FORMAT, SYSTEM_OF_RECORD, FILE_PREFIX, FILE_HEADER, RAW_TABLE, FILE_LAYOUT, CLIENT, FILE_SUFFIX FROM TBL_FILE_TYPE";

	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;

	# Read the matching records and print them out
	while (@data = $sth->fetchrow_array()) {
		#$asOfDate = $data[0];
		#print "LoadProperties::fillLoadInfoFromFileType: @data\n";
		#$load_info->{$load_type}->{propertyFileName}
		$load_info->{$data[0]}->{dateFormat} = $data[1];
		$load_info->{$data[0]}->{systemOfRecord} = $data[2];
		$load_info->{$data[0]}->{filePrefix} = $data[3];
		$load_info->{$data[0]}->{fileHeader} = $data[4];
		$load_info->{$data[0]}->{tableName} = $data[5];
		$load_info->{$data[0]}->{fileLayout} = $data[6];
		$load_info->{$data[0]}->{truncateTable} = "N";
		$load_info->{$data[0]}->{client} = $data[7];
		$load_info->{$data[0]}->{fileSuffix} = $data[8];

	} # endif

        $sth->finish();


} # end fillLoadInfoFromFileType


sub getDir
{
	my $self = shift;
	my $aFileType = shift;
	my $client = shift;
	my $system_of_record = shift;
	my $aDirname = shift;

	#print "LoadProperties::getDir, aFileType $aFileType\n";
	if (defined($aFileType)) {
		$system_of_record = "\L$load_info->{$aFileType}->{systemOfRecord}";
		$client = "\L$load_info->{$aFileType}->{client}";
	} # endif

	if (!defined($system_of_record) || !defined($client)) {
		die "LoadProperties::getDir, either client or system of record not defined\n";
	} # endif

	my $root_dir = $ENV{EXPLAIN_DATA};
	#print "root_dir: $root_dir\n";

	my $dir = "$root_dir/$client/$aDirname/$system_of_record/";

	#print "getDir: $dir\n";

	return $dir;

}



sub getUnprocessedDir
{
	my $self = shift;
	my $aFileType;
        my $aSystemOfRecord;
        my $aClient;

	if(@_ == 1) { # process FileType parameter
		$aFileType = $_[0];
	} elsif (@_ == 2) { # process client and system of record
		$aSystemOfRecord = $_[0];
		$aClient = $_[1];
	} else {
		die "LoadProperties::getUnprocessedDir, expect either 1 (filetype) or 2 (client, sor) parameter(s)\n";
	} # endif

	return $self->getDir($aFileType, $aClient, $aSystemOfRecord, 'unprocessed');
}


sub getFailedDir
{
	my $self = shift;
	my $aFileType;
        my $aSystemOfRecord;
        my $aClient;
	if(@_ == 1) { # process FileType parameter
		$aFileType = $_[0];
	} elsif (@_ == 2) { # process client and system of record
		$aSystemOfRecord = $_[0];
		$aClient = $_[1];
	} else {
		die "LoadProperties::getFailedDir, expect either 1 (filetype) or 2 (client, sor) parameter(s)\n";
	} # endif
	return $self->getDir($aFileType, $aClient, $aSystemOfRecord, 'failed');
}


sub getProcessedDir
{
	my $self = shift;
	my $aFileType;
        my $aSystemOfRecord;
        my $aClient;
	if(@_ == 1) { # process FileType parameter
		$aFileType = $_[0];
	} elsif (@_ == 2) { # process client and system of record
		$aSystemOfRecord = $_[0];
		$aClient = $_[1];
	} else {
		die "LoadProperties::getProcessedDir, expect either 1 (filetype) or 2 (client, sor) parameter(s)\n";
	} # endif
	return $self->getDir($aFileType, $aClient, $aSystemOfRecord, 'processed');
}


sub getLoadInfo
{
	my $self = shift;

	return $load_info;
} # end getLoadProperties


sub getHeaderLinesProperty
{
	my $self = shift;
	my $aFileType = shift;
	my $numberOfHeaderLines;


	#print "LoadProperties::getHeaderLinesProperty, fileType: \'$aFileType\', fileHeader-Property: \'".$load_info->{$aFileType}->{fileHeader}."\'\n";

	if ($load_info->{$aFileType}->{fileHeader} eq 'Y') {
		$numberOfHeaderLines = 1;
	}
	elsif ($load_info->{$aFileType}->{fileHeader} eq 'N') {
		$numberOfHeaderLines = 0;
	}
	else {
		die "LoadProperties::getHeaderLinesProperty, invalid fileHeader-Property: \'".$load_info->{$aFileType}->{fileHeader}."\'";
	} # endif

	return $numberOfHeaderLines;
} # end getHeaderLinesProperty

sub getPropertyFileName
{
	my $self = shift;
	my $aFileType = shift;
	my $aFileName = shift;
	my $aFileFormat = shift;

	my $propName;
	my @data;

	my $aCrrDate = $self->getFormattedDate(basename($aFileName), $aFileFormat);

	my $sql = "SELECT OA_PROPERTY_FILE FROM TBL_FILE_VERSION WHERE FILE_TYPE = \'$aFileType\' AND BEGIN_DATE <= TO_DATE(\'$aCrrDate\', \'YYYYMMDD\') AND END_DATE >= TO_DATE(\'$aCrrDate\', \'YYYYMMDD\')";

	#print "LoadProperties: sql \'$sql\'\n";
	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;

	# Read the matching records and print them out
	if (@data = $sth->fetchrow_array()) {
		$propName = $data[0];
		#print "LoadProperties::propName: $propName\n";

	} # endif

        $sth->finish();

	return $propName
} # end getPropertyFileName


sub getSystemOfRecordList
{
	my $self = shift;
	#print "LoadProperties::getSystemOfRecordList: start\n";

	my @data;
	my @system_of_record_list;

	my $sql = "SELECT DISTINCT(LOWER(SYSTEM_OF_RECORD)) SYSTEM_OF_RECORD FROM TBL_FILE_TYPE";

	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;

	# Read the matching records and print them out
	my $i=0; # record index

	while (@data = $sth->fetchrow_array()) {
		#print "LoadProperties::getSystemOfRecordList: @data\n";
		$system_of_record_list[$i] = $data[0];
		$i++;

	} # endif

        $sth->finish();

	#print "LoadProperties::getSystemOfRecordList: @system_of_record_list\n";

	return \@system_of_record_list;

} # end getSystemOfRecordList


sub getFormattedDate
{
	my $self = shift;
	my $date_str = shift;
	my $format_str = shift;

	#print "getFormattedDate: date_str: \'$date_str\', format_str: \'$format_str\'\n";
	$format_str =~ s/%Y/%YYY/g;

	my $Y = getValue($date_str, $format_str, "%Y");
	my $y = getValue($date_str, $format_str, "%y");
	my $m = getValue($date_str, $format_str, "%m");
	my $d = getValue($date_str, $format_str, "%d");

	my $date;

	if (defined($Y)) {
		$date = $Y;
	}
	elsif (defined($y)) {
		$date = $y;
	}
	else {
		die "no Year defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	if (defined($m)) {
		$date = $date.$m;
	} else {
		die "no Month defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	if (defined($m)) {
		$date = $date.$d;
	} else {
		die "no Day defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	#print "getFormattedDate: date: $date\n";
	return $date;
}


sub getValue
{
	my $date_str = $_[0];
	my $format = $_[1];
	my $token = $_[2];
	#print "LoadProperties::getValue: date_str: $date_str, format $format, token $token\n";

	my $i = index($format, $token);
	#print "LoadProperties::getValue: index: $i\n";

	if ($i < 0) { # not found
		return undef;
	}

	my $len = length($token);
	# %Y 4 digits
	if ($token eq "%Y") {
		$len = 4;
	}
	#print "token.length: $len\n";


	my $n = substr($date_str, $i, $len);
	if (!defined($n)) {
		return $n;
	} # endif
	if ($n =~ /\D/) { # non numeric
		return undef;
	} # endif
	#print "LoadProperties::substring: \'$n\'\n";
	if ($token eq "%y") {
		$n = $n + 2000;
	}
	#print "LoadProperties::result: $n\n";

	return $n;

}

1;
