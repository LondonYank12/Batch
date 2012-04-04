#
# Extractor.pm
#
# Control-Procedure for extracting data from GPAS
#
# Author: Stephan Hein
#
# Purpose:
#
#
# Description:
#
#
#
#
package Extractor;


use File::Basename;
use Application;
use ExtractProperties qw( $extract_info $prop_info );
#use BSD::Resource;
use POSIX ":sys_wait_h";



my $logger;
my $conf;
my $extract_type;
my $dbh;
my @properties;		# OpenAdaptor Property File Contents
my $propertiesModule;	# Reference to Properties Module	
my $properties;		# Reference to OpenAdaptor Property File Contents
my $systemOfRecord;
#my $extract_info;

sub new
{
	my $type = shift;		# shift first parameter into type and removes from param-list
	my %params = @_;	# assign remaining parameters
	my $self = {};

	$logger = $params{logger};
	$conf = $params{conf};

	$dbh = Application->getDatabase($logger, $conf);

	bless $self, $type;

	$asofdate = $self->GetAsOfDate();
	$propertiesModule = ExtractProperties->new($logger, $conf, $asofdate);
	#$extract_info = $propertiesModule->getExtractInfo();


	return $self;

} # end new



####################################################################
# Interface Implementation
# High-Level function to load a file via OpenAdaptor into EXPLAIN
# Pre-condition: The filename has to be unique.
#
# Param1: extractType
# Return: a non zero value if successful or undef value if not
#
####################################################################

sub ExtractFile
{
	my $self = shift;
	my $extract_type = shift;
	my $extract_file = shift;

	$logger->WriteLog('INFO', "Extractor::ExtractFile, extract_type: $extract_type\n");

	my $propFileName = $conf->{oa_properties_dir}.$extract_info->{$extract_type}->{propertyFileName};


	$logger->WriteLog('INFO', "Extractor::ExtractFile, PropFileName: $propFileName\n");
	#print "Extractor::ExtractFile, PropFileName: $propFileName\n";
	$properties = $propertiesModule->LoadPropertyFileTemplate($propFileName);
	unless ($properties)
	{
		die "Extractor::ExtractFile: LoadPropertyFileTemplate failed...";	# failed
	}

	$self->_extractFile($extract_type, $extract_file);
	return 1; # successful

} # end ExtractFile


sub _extractFile
{
	my $self = shift;
	my $extract_type = shift;
	my $extract_file = shift;
	$logger->WriteLog('INFO', "Extractor::_extractFile, load_type: $extract_type\n");
	

	my $asofdate = GetAsOfDate();

	#print "_extractFile: outPutFile-PropertyText: $prop_info->{outputFileName}->{propertyText}\n";	# FileName eintragen
	#print "_extractFile: outPutFile-Property-LineIndex: $prop_info->{outputFileName}->{lineIndex}\n";	# FileName eintragen

	$properties->[$prop_info->{outputFileName}->{lineIndex}] = "$prop_info->{outputFileName}->{propertyText} $extract_file\n";	# FileName eintragen

	#print "_extractFile: outPutFile-Property eingetragen: $properties->[$prop_info->{outputFileName}->{lineIndex}]\n";	# FileName eintragen

	$properties->[$prop_info->{uid}->{lineIndex}] = "$prop_info->{uid}->{propertyText} $conf->{ORACLE_GPAS_EXTRACT_UID}\n";	# UserId eintragen
	$properties->[$prop_info->{pwd}->{lineIndex}] = "$prop_info->{pwd}->{propertyText} $conf->{ORACLE_GPAS_EXTRACT_PWD}\n";	# Password eintragen
	$properties->[$prop_info->{jdbcUrl}->{lineIndex}] = "$prop_info->{jdbcUrl}->{propertyText} $conf->{ORACLE_GPAS_EXTRACT_URL}\n";	# URL eintragen


	my $sqlString = $properties->[$prop_info->{sqlString}->{lineIndex}];
	#print "sqlString: $sqlString\n";
	#print "Extractor::_extractFile, Asofdate: $asofdate\n";
	$sqlString =~ s/<ASOFDATE>/$asofdate/g;
	#print "Extractor::_extractFile, sqlString: $sqlString\n";

	$properties->[$prop_info->{sqlString}->{lineIndex}] = $sqlString;

	#$properties->[$prop_info->{asOfDate}->{lineIndex}] = "$prop_info->{asOfDate}->{propertyText} $asofdate\n"; # AsOfDate eintragen

	my $temporaryPropertyFile =  $conf->{tmp_dir}.basename($extract_type).".props"; # File-Namen zuweisen

	$logger->WriteLog('INFO', "Extractor::_extractFile, process for $extract_type, temporary Property-File: $temporaryPropertyFile\n");

	open(PROPS_FILE_HANDLE, ">$temporaryPropertyFile");	# outputFile generieren

	foreach $line (@$properties) {
		print PROPS_FILE_HANDLE $line;
	} # end foreach
	close(PROPS_FILE_HANDLE);

	my $pid;
	my $child_exit_status;
	my @output;

	my $pipe_name = "/tmp/".$0."_".$$;
	#system("mkfifo $pipe_name");

	eval { # Child exceptions

		if ($pid = fork()) { # fork a child process

			# parent branch
			local $SIG{TERM} = sub { kill 9, $pid; die "got SIGTERM, going to kill child process and exiting...\n"; };

			#open(FIFO, "< $pipe_name");	# create pipe to get stdout/stderr output from child process
			my $waitpid_rc = $waitpid_rc = waitpid($pid, 0);


			$child_exit_status = ($? >> 8);
			#print "nach waitpid, child_exit_status: $child_exit_status\n";

		} else { # child branch

			die "cannot fork: $!" unless defined $pid;
			$SIG{INT} = "IGNORE";	# ignore Ctrl-C for OA child process
			$SIG{TERM} = "IGNORE";  # ignore kill

			open(FIFO, "> $pipe_name");	# create pipe to get stdout/stderr output from child process

			open(STDOUT, ">&=FIFO");	# open pipe for stdout
			open(STDERR, ">&STDOUT");	# redirect stderr to stdout
			select STDERR; $| = 1;		# disable blocking
			select STDOUT; $| = 1;

			exec("java", $ENV{JVM_PARAM}, "org.openadaptor.adaptor.RunAdaptor", $temporaryPropertyFile, "A")	# execute OA prog
				or die "exec failed: $!";
			print "exec failed: $!";
			exit 1;

		} # endif

	}; # end eval
	my $eval_msg = $@;

	open(FIFO, "< $pipe_name");	# open file to get stdout/stderr output from child process
	#while (<FIFO>) { 		# get child process output
		#push(@output, $_);
	#} # end while
	@output = <FIFO>;		# read whole file to get stdout/stderr output from child process

	unlink($temporaryPropertyFile);
	unlink($pipe_name);

	if ($eval_msg) { 		# evaluate fork/exec
		die "Loader::_loadFile, fork/exec exception: $eval_msg\n";
	} # endif



	$rc = $child_exit_status;
	foreach $line (@output)
	{
		if ($line =~ /ERROR:/ || $line =~ /FATAL:/) {
			$rc = 1;
		} # endif
		$logger->WriteLog('OA', $line);
	} # end foreach
	if ($rc != 0) {
		die "Extractor::_extractFile,  OpenAdaptor failed for $extract_type\n";
	} # endif

	return 1;

} # end _extractFile


sub GetAsOfDate
{
	my $self = shift;
	my $date_format = shift;

	#print "GetAsOfDate: start\n";
	my $sql;

	if (defined($date_format)) {
		$sql = "SELECT TO_CHAR(CRR_DATE, \'$date_format\')
			FROM tbl_sys_control";
	} else {
		$sql = "SELECT TO_CHAR(CRR_DATE, 'YYYYMMDD')
			FROM tbl_sys_control";
	} # endif


	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;


	my $asOfDate;
	# Read the matching records and print them out          
	if (@data = $sth->fetchrow_array()) {
		$asOfDate = $data[0];
		#print "GetAsOfDate: $asOfDate\n";
	}

	$sth->finish();
	#if ($asOfDate == undef)
	unless ($asOfDate)
	{
		die "Could not extract AsOfDate";
	}

	return $asOfDate;

} # end GetAsOfDate


#sub getExtractInfo
#{
	#my $self = shift;

	#return $extract_info;
#} # end getExtractInfo

1;
