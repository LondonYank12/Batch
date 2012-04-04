#

=head1 NAME

Loader.pm

=head1 PURPOSE

Control-Procedure to load a Flat-File via OpenAdaptor into the Explain-Database.

=head1 AUTHOR

Stephan Hein

=head1 DESCRIPTION

Process a Flat-File with OpenAdaptor (OA). OA is called
for this File with a temporary OA-File. The FileName is stored in a temporary OpenAdaptor Property-File
as a Property for the InputFile-Name of FileSource-Component. The temporary Property-File
is derived from a Property-File-Template for each Load-Type.

=cut


package LoadData_oa;


use strict;
use File::Basename;
use Date::Manip;
use LoadProperties qw($prop_info );
use FileUtil;
use Conf qw( %conf ); 

my $logger;
my $conf;
my $load_type;
my $load_info;
my $dbh;
my @lines;		# OpenAdaptor Property File Contents
my $systemOfRecord;
my $loadProperties;

=over 4

=item new()

The new() function is intended to initialise the module and acts like oo-constructor. Returns a reference to self (the module).

=back

=cut

sub new
{
        my $class = shift;
        my %attr = @_;
        my $self = {};

	if ( $attr{DBH} ) {
		$self->{dbh} = $attr{DBH};
	} else {
		my $app = new Application;
		$self->{dbh} = $app->getExplainDatabase();
	}

	if ( $attr{LOGGER} ) {
		$logger = $attr{LOGGER};
	} else {
        	$logger = new Logger (system_name=>'explain_load',
					system_prefix=> 'load_data_oa',
                              		log_root=>"$ENV{EXPLAIN_LOG}",
                              		message_level=>20);

	}

	$conf = \%conf;

	$loadProperties = LoadProperties->new($logger, $conf);
	$load_info = $loadProperties->getLoadInfo();

	bless $self, $class;

	return $self;

} # end new

=over 4

=item LoadFile()

LoadFile loads a file via OpenAdaptor into a specific EXPLAIN-Table.
Pre-condition: The filename has to be unique.

Param1: fileNameToLoad

Return: a non zero value if successful or undef value if the file was empty.

Exception: The functions dies if a FATAL-Error occurs.

=back

=cut

sub LoadFile
{
	my $self = shift;
	my $fileNameToLoad = shift;

	wait_for_growing_file($fileNameToLoad);

	$logger->WriteLog('INFO', "Loader::LoadFile, Converting file to Unix line endings");

	system("$ENV{PERL} -pi -e 's/\r\n/\n/' $fileNameToLoad");

	$logger->WriteLog('INFO', "Loader::LoadFile, file to load: $fileNameToLoad\n");

	$load_type = $self->GetLoadType($fileNameToLoad);
	$logger->WriteLog('INFO', "Loader::LoadFile, load_type: <$load_type>\n");
	unless ( exists( $load_info->{$load_type} ) ) {
		die "Unknown load type $load_type\n";
	} # end unless


	my $propFileName = $loadProperties->getPropertyFileName($load_type, $fileNameToLoad, $load_info->{$load_type}->{dateFormat});
	#print "Loader: propFileName \'$propFileName\'\n";
	if (!defined($propFileName)) {
		die "no propFileName present";
	} # endif

	$propFileName = $conf->{oa_properties_dir}.$propFileName;

	unless (exists($load_info->{$load_type}->{systemOfRecord})) {
		die "SystemOfRecord not found in LoadProperties for load type $load_type\n";
	}
	else {
		$systemOfRecord = $load_info->{$load_type}->{systemOfRecord};
	} # endif


	$logger->WriteLog('INFO', "Loader::LoadFile, PropFileName: $propFileName\n");
	if ($self->_loadPropertyFileTemplate($propFileName, $load_type) == 0)
	{
		die "Loader::LoadFile: _loadPropertyFileTemplate failed...";	# failed
	}

	unless ($self->_loadFile($fileNameToLoad))
	{
		return undef; # empty file
	}

	return 1; # successful

} # end LoadFile

=over 4

=item TruncateTable()

truncates a specific EXPLAIN-Table that is associated with a load_type.

Param1: -

Return: -

Exception: The functions dies if a FATAL-Error occurs.

=back

=cut

sub TruncateTable
{
	my $self = shift;
	my $aLoadType = shift;
	my $aFileName = shift;

	my $file_id = $self->AlreadyLoaded($aFileName);
	if (!defined($file_id)) {
		return;
	}
	$logger->WriteLog('INFO', "Loader::_loadFile, delete RAW-Table for FILE_ID $file_id\n");

        my $sql = "BEGIN\n sp_cleardown_raw_data(\'$load_info->{$aLoadType}->{tableName}\', $file_id); END;\n";

	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;

	$sth->finish();
	$logger->WriteLog('INFO', "Loader::_loadFile, RAW-Table deleted for FILE_ID $file_id\n");

} # end TruncateTable

=over 4

=item AlreadyLoaded()

determines whether a file is already loaded into the EXPLAIN-database.
Pre-condition: The filename and system-of-record has to be unique.

Param1: fileName

Return: a non zero value if file is already loaded or undef value if not

Exception: The functions dies if a FATAL-Error occurs.

=back

=cut

sub AlreadyLoaded {
    my $self = shift;
    my $file = shift;

    my $sql = "SELECT FILE_ID 
               FROM tbl_file
               WHERE file_name = '$file'";

    my $sth = $dbh->prepare($sql)
	or die "Could not prepare $sql : ". $dbh->errstr;

    $sth->execute()
	or die "Could not execute $sql : " . $dbh->errstr;

    my @data;
    @data = $sth->fetchrow_array();

    $sth->finish();
    if (@data) {
	return $data[0]; # return file_id
    } # endif
	return undef;
}

=over 4

=item _loadFile()


Param1: fileName

Return: a non zero value 

Exception: The functions dies if a FATAL-Error occurs.

=back

=cut

sub _loadFile
{
	my $self = shift;
	my $fileNameToLoad = shift;
	$logger->WriteLog('INFO', "Loader::_loadFile,  fileName: $fileNameToLoad, load_type: $load_type, systemOfRecord: \'$systemOfRecord\'\n");
	

	my $util;
	my $numLines = $self->getNumLines($fileNameToLoad, $load_type, $load_info);

	if ($numLines < 0) {
		die "Loader::_loadFile,  file $fileNameToLoad not present, proceed next file\n";
	} # endif
	$logger->WriteLog('INFO', "Loader::_loadFile, Number of Records to load: $numLines\n");

	$lines[$prop_info->{dataInputFile}->{lineIndex}] = "$prop_info->{dataInputFile}->{propertyText} $fileNameToLoad\n";	# FileName eintragen

	$lines[$prop_info->{ignoreHeaderLines}->{lineIndex}] = "$prop_info->{ignoreHeaderLines}->{propertyText} ".$loadProperties->getHeaderLinesProperty($load_type)."\n";	# No of headerLines eintragen

	$lines[$prop_info->{estimatedRecords}->{lineIndex}] = "$prop_info->{estimatedRecords}->{propertyText} $numLines\n";	# EstimatedRecords eintragen
	$lines[$prop_info->{uid}->{lineIndex}] = "$prop_info->{uid}->{propertyText} $conf->{ORACLE_UID}\n";	# UserId eintragen
	$lines[$prop_info->{pwd}->{lineIndex}] = "$prop_info->{pwd}->{propertyText} $conf->{ORACLE_PWD}\n";	# Password eintragen
	$lines[$prop_info->{jdbcUrl}->{lineIndex}] = "$prop_info->{jdbcUrl}->{propertyText} $conf->{ORACLE_URL}\n";	# URL eintragen

	my $temporaryPropertyFile =  $conf->{tmp_dir}.basename($fileNameToLoad).".props"; # File-Namen zuweisen

	$logger->WriteLog('INFO', "Loader::_loadFile, process for $fileNameToLoad, temporary Property-File: $temporaryPropertyFile\n");

	open(ABACUS_PROPS_FILE_HANDLE, ">$temporaryPropertyFile");	# outputFile generieren

	foreach my $line (@lines) {
		print ABACUS_PROPS_FILE_HANDLE $line;
	} # end foreach
	close(ABACUS_PROPS_FILE_HANDLE);

	my $pid;
	my $child_exit_status;
	my @output;

	my $pipe_name = "/tmp/".$0."_".$$;
	#system("mkfifo $pipe_name");			# create temporary named pipe for child output


	eval { # Child exceptions

		if ($pid = fork()) { # fork a child process

			# parent branch
			local $SIG{TERM} = sub { kill 9, $pid; die "got SIGTERM, going to kill child process and exiting...\n"; };

			#open(FIFO, "< $pipe_name");	# open named pipe to read child output

			my $waitpid_rc = waitpid($pid, 0);
			$child_exit_status = ($? >> 8);
			#print "nach waitpid, child_exit_status: $child_exit_status\n";

		} else { # child branch

			die "cannot fork: $!" unless defined $pid;
			$SIG{INT} = "IGNORE";	# ignore Ctrl-C for OA child process
			$SIG{TERM} = "IGNORE";  # ignore kill

			open(FIFO, "> $pipe_name");	# open named pipe to write OA output to parent

			open(STDOUT, ">&=FIFO");	# open pipe for stdout
			open(STDERR, ">&STDOUT");	# redirect stderr to stdout
			select STDERR; $| = 1;		# disable blocking
			select STDOUT; $| = 1;

			exec("java", $ENV{JVM_PARAM}, "org.openadaptor.adaptor.RunAdaptor", $temporaryPropertyFile, "A");	# execute OA prog

		} # endif

	}; # end eval
	my $eval_msg = $@;

	open(FIFO, "< $pipe_name");	# open named pipe to read child output
	#while (<FIFO>) { 		# get child process output
		#push(@output, $_);
	#} # end while
	@output = <FIFO>;		# read whole file


	unlink($temporaryPropertyFile);
	unlink($pipe_name);		# delete temp named pipe


	if ($eval_msg) { 		# evaluate fork/exec
		die "Loader::_loadFile, fork/exec exception: $eval_msg\n";
	} # endif


	#my $rc = ($? >> 8);
	foreach my $line (@output)
	{
		$logger->WriteLog('OA', $line);
	} # end foreach



	if ($child_exit_status != 0) {
		die "Loader::_loadFile,  OpenAdaptor failed for $fileNameToLoad\n";
	} # endif

	return 1;

} # end _loadFile


=over 4

=item _loadPropertyFileTemplate()

Param1: fileName

Param2: load_type

Return: a non zero value if successful or undef if failed

Exception: -

=back

=cut

sub _loadPropertyFileTemplate
{
	my $self = shift;
	my $file= shift;		# Property-File-Name
	$load_type = shift;		# Hash-Reference to Load-Properties for this propFile

	#print "_loadPropertyFileTemplate: file: $file, load_type: $load_type\n";
	# reading Property-File-Template ########################################

	open(ABACUS_PROPS_FILE_HANDLE, $file);
	@lines = <ABACUS_PROPS_FILE_HANDLE>;
	#print @lines;
	close(ABACUS_PROPS_FILE_HANDLE);


	# searching for Input-File-Name Property ################################

	my $defaultSinkComponent = "C2";
	foreach my $line (@lines) {
		if ($line =~ /^$prop_info->{sinkComponent}->{propertyText}/) { # Explain Property present ?
			if ($line =~ /(\w+)$/) { # get ComponentName
				$defaultSinkComponent = $1; # change Component name
			} # endif
		} # endif
	} # end foreach

	my $i = 0;
	foreach my $line (@lines) {
		#print $lines[$i];
		if ($line =~ /^$prop_info->{dataInputFile}->{propertyText}/) {
			#print "_loadPropertyFileTemplate: dataInputFile property $prop_info->{dataInputFile}->{propertyText} found\n";
			$prop_info->{dataInputFile}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{batchSize}->{propertyText}/) {
			$prop_info->{batchSize}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{ignoreHeaderLines}->{propertyText}/) {
			$prop_info->{ignoreHeaderLines}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{systemOfRecord}->{propertyText}/) {
			my @splitted = split(/ /, $line);
			chomp($splitted[2]);
			$systemOfRecord = $splitted[2];

		} # endif
		if ($line =~ /^A\.$defaultSinkComponent\.$prop_info->{uid}->{propertyText}/) {
			$prop_info->{uid}->{propertyText} = "A.".$defaultSinkComponent.".".$prop_info->{uid}->{propertyText};
			$prop_info->{uid}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^A\.$defaultSinkComponent\.$prop_info->{pwd}->{propertyText}/) {
			$prop_info->{pwd}->{propertyText} = "A.".$defaultSinkComponent.".".$prop_info->{pwd}->{propertyText};
			$prop_info->{pwd}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^A\.$defaultSinkComponent\.$prop_info->{jdbcUrl}->{propertyText}/) {
			$prop_info->{jdbcUrl}->{propertyText} = "A.".$defaultSinkComponent.".".$prop_info->{jdbcUrl}->{propertyText};
			$prop_info->{jdbcUrl}->{lineIndex} = $i;
		} # endif
		if ($line =~ /^$prop_info->{estimatedRecords}->{propertyText}/) {
			$prop_info->{estimatedRecords}->{lineIndex} = $i;
		} # endif
		$i++;
	} # end foreach

	unless ($prop_info->{dataInputFile}->{lineIndex}) {
		return undef;
	} # endif

	return 1; # successful

} # end _getPropertyFile

=over 4

=item GetLoadType()

evaluates a LoadType from a fileName.
The function uses a regular expression to extract a prefix separated with an underscore from the remainder of the filename.

Param1: fileName

Return: load_type

Exception: -

=back

=cut

sub GetLoadType
{
        my $self = shift;
        my $file= shift;                # Property-File-Name

        my $basename = basename($file);
        $basename =~ m/(.*?)_/;

        return $1;
} # end GetLoadType



=over 4

=item IsLoadType()

compares a LoadType against the defined Load-Types in the LoadProperties.
The compare is NOT case-sensitive.

Param1: aLoadType

Return: 1 = success, undef = not a defined type

Exception: -

=back

=cut

sub IsLoadType
{
        my $self = shift;
        my $aType= shift;                # a Load-Type

	foreach my $type (keys(%$load_info)) {
		if ("\U$type" eq "\U$aType") {
			#print "type $aType is defined\n";
			return 1; # Type is defined
		} # endif
	} # end foreach

        return undef;
} # end IsLoadType


sub GetSystemOfRecord {
        my $self = shift;
        my $aType= shift;                # a Load-Type

        unless (exists($load_info->{$aType}->{systemOfRecord})) {
                die "SystemOfRecord not found in LoadProperties for load type $load_type\n";
        }
	return $load_info->{$aType}->{systemOfRecord};

} # end GetSystemOfRecord

sub getLoadInfo
{
	return $load_info;
} # end getLoadProperties


sub setFileStatus {
	my $self = shift;
	my $file = shift;
	my $status = shift;


	my $sql = "UPDATE TBL_FILE SET FILE_STATUS=\'$status\' WHERE FILE_NAME=\'$file\'";

	#print "Loader::setFileStatus, sql: \'$sql\'\n";

	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;


	$dbh->commit();
	$sth->finish();

	my $file_id = $self->getFileId($file);
	#print "Loader: file_id $file_id\n";

	if (!defined($file_id)) {
		return;
	}

	$self->setLoadStatus($file_id, "FAILED");
}


sub setLoadStatus {
	my $self = shift;
	my $file_id = shift;
	my $status = shift;


	my $sql = "UPDATE TBL_FILE_LOAD_LOG SET LOAD_STATUS=\'$status\' WHERE FILE_ID=$file_id AND LOAD_STATUS_DT IN (SELECT MAX(LOAD_STATUS_DT) FROM TBL_FILE_LOAD_LOG WHERE FILE_ID=$file_id)";

	#print "Loader::setLoadStatus, sql: \'$sql\'\n";

	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;


	$dbh->commit();
	$sth->finish();


}

sub getFileId {
    my $self = shift;
    my $file = shift;

    my $sql = "SELECT FILE_ID 
               FROM tbl_file
               WHERE file_name = '$file'";

    my $sth = $dbh->prepare($sql)
	or die "Could not prepare $sql : ". $dbh->errstr;

    $sth->execute()
	or die "Could not execute $sql : " . $dbh->errstr;

    my @data;
    @data = $sth->fetchrow_array();

    $sth->finish();
    if (@data) {
	#print "getFileId: file_id: \'$data[0]\'\n";
	return $data[0]; # return file_id
    } # endif

	#print "getFileIgetFileId: keine file_id\n";
	return undef;
}


sub getNumLines
{
        my $self = shift;
        my $fileName = shift;
        my $aLoadType = shift;
        my $aLoadInfo = shift;


	# file exists?
	if (! -e $fileName) {
		#print "File $_[0] doesn\'t exist\n";
		return -1;
	} # endif

        my $cmd = "wc  $fileName"; # Default calculation method

	my $fileLayout = $aLoadInfo->{$aLoadType}->{fileLayout};
	if ("\U$fileLayout" eq "XML") {
		$cmd = "grep \'<ElementDef Name=\"$aLoadType\">\' $fileName | wc "; # calculation for XML files
	} # endif


        my @output = `$cmd`;
        my $rc = ($? >> 8);
        if ($rc) {
                return -1; # failed
        }
        $output[0] =~ /(\w+)/;

	my $count = $1;
	if ($count <= 0) {
		return 0;
	} # endif
	my $fileHeaderProp = $aLoadInfo->{$aLoadType}->{fileHeader};
	if ("\U$fileHeaderProp" eq "Y") {
		$count = $count - 1; # decrease count due to header record
	} # endif
	return $count;
}

sub check_cefs_record_count {
        my $filename = shift;

        die "$filename does not exist" unless ( -e $filename);

        # get the number of records in file through call to UNIX command wc
        my @wc_rec = split (' ', `wc -l $filename`);
        # set record count from wc result.  subtract one as we don't count header
        my $record_count = $wc_rec[0]-1;
        chomp $record_count;

        # get the records as indicated by header
        my @header_rec = split(/\|/, `head -1 $filename`);
        my $expected_records = $header_rec[2];
        chomp $expected_records;

        if ( $record_count == $expected_records ) {
                my $msg = basename($filename) . " expected record count ($expected_records) matches actual record count ($record_count)";
                $logger->WriteLog( 'INFO', $msg);
        } else {
                my $msg = basename($filename) . " expected record count ($expected_records) does **NOT** match actual record count ($record_count)";
                $logger->WriteLog( 'ERROR', $msg);
                die $msg;


        }

}
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
                        $logger->WriteLog('INFO',"$filename is growing. waiting...");
                }
        }
}
1;
