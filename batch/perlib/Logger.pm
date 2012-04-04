
=head1 NAME

Logger.pm - Generic Logger class for Perl

=head1 VERSION

1.0

=head1 SYNOPSIS

  use Logger;
  
  # Create a logger object
  my $logger = new Logger(system_name=>'intmm', log_root=>'/app/intrec/log');


  # Write a message to the log
  $logger->WriteLog('OK','Everything looks okay so far.');


  # Create logs with a specific business date used in
file name
  my $logger = new Logger(business_date='22 March 2002', system_name=>'intmm', log_root=>'/app/intrec/log');   

The Logger class provides a very simple and configuable way to
write messages to a log file.  It is intended to be
light weight and simple, which it is.

=head1 OUTPUT

All messages are witten to the log file in the
following format:

DATE : STATUS : MESSAGE

Example Log Entry

Thu Apr 18 16:53:17 2002 : OK : Parsing InternalTrades
XML file InternalTrades_020417.xml

=head1 AUTHORS

Owen Singleton
Stephan Hein

=cut

package Logger;

use strict;
use Application;

use DBI;
use Date::Manip qw(UnixDate Date_Init);
use POSIX;
use MicroMuse;

my $dbh;
my $app;
my $microMuseFailure=0;

sub new {
    my $type = shift;
    my %params = @_;
    my $self = {};

    if ($params{business_date}) {
        $self->{business_date} = $params{business_date}
    }

    if ($params{log_root}) {
        $self->{log_root} = $params{log_root}
    }

    if ($params{system_name}) {
        $self->{system_name} = $params{system_name}
    }

    if ($params{system_prefix}) {
        $self->{system_prefix} = $params{system_prefix}
    }

    if ($params{error_level}) {
        $self->{error_level} = $params{error_level};
    } else {
	$self->{error_level} = 0;
    }

    if ( $params{DBH} ) {
		$dbh = $params{DBH};
    } else {
	$app = new Application();
	$dbh = $app->getExplainDatabase();
	}	

    bless $self, $type;

	unless ($dbh) {
		$self->WriteLog('FATAL', "Could not connect to $ENV{EXPLAIN_BATCH_ORACLE_SID} as $ENV{EXPLAIN_BATCH_ORACLE_UID} : $DBI::errstr");
	} # endif

    return $self;    
}

sub WriteLog {
   my $self = shift;

   my $state = shift;
   my $message = shift;
   my $proc_name = shift;
   my $message_level;
   my $date_stamp;
   
	$state = "\U$state"; # Uppercase
	if (defined($proc_name)) { # Uppercase
		$proc_name = "\U$proc_name";
	} # endif

    $message_level = 0;
    #ignore messages 
   if ( $message_level <= $self->{error_level} ) {
       
       
       my $logfile = $self->GetLogFilename();
       
	$self->WriteLogToFile($logfile, $message, $state);


	#
	# LOG Messages on DB
	#
	# Filter Messages from OpenAdaptor for DB logging, allow only ERROR, FAULT, FATAL Messages
	if ($state eq "OA") {
		if ($message !~ /ERROR:|FAULT:|FATAL:/) {
			return;
		} # endif
	} # endif

	# store message
	my $message_orig = $message;

	#
	# Check DB handle for availability
	#
	if ($dbh) {

	# Filter String delimiter for ORACLE
	$message =~ s/\'/\'\'/g;

	my $sql = "BEGIN PKG_MESSAGE.SP_INSRT_MESSAGE(?,?,?,?); END;";
	my @bindparams = ($message,$state,$$,$proc_name);

	my $sp = $dbh->prepare($sql)
		or print "Logger: Could not prepare $sql : ".$dbh->errstr."\n";
	$sp->execute(@bindparams)
		or print "Logger: Could not execute $sql : ".$dbh->errstr."\n";

	} # endif, Check DB handle

	#
	# log messages to Micromuse
	#

	if (!$microMuseFailure) {
		eval {
		if (MicroMuse->IsEnabled()) {
			#print "Logger::WriteLog, MicroMuse enabled\n";
			my $mm = MicroMuse->GetObject();
			#print "Logger::WriteLog, nach getObject\n";
			if (defined($proc_name)) {
				$mm->logMessage($state, $message_orig, $$, $proc_name);
			} else {
				$mm->logMessage($state, $message_orig, $$);
			} # endif
		} # endif
		}; # eval
		if ($@) {
			$microMuseFailure = 1;
			$self->WriteLogToFile($logfile, "Logger::WriteLog, MicroMuse failed: $@", "ERROR");
			#print "Logger::WriteLog, MicroMuse failed: $@\n";
		} # endif
	} # endif
   }
}

sub GetLogFilename()
{
	my $self = shift;
	my $logfile;
	my $date_stamp;
       if ( $self->{business_date} ) {
	   $date_stamp = UnixDate( $self->{business_date}, '%y%m%d');
       }
       else {
	   $date_stamp = strftime("%y%m%d", localtime());
       }
       
	if (defined($self->{system_prefix})) {
	       $logfile = "$self->{log_root}/$self->{system_prefix}_$self->{system_name}_$date_stamp.log";
	} else {
	       $logfile = "$self->{log_root}/$self->{system_name}_$date_stamp.log";
	} # endif

	return $logfile;

} # end GetLogFilename()


sub WriteLogToFile()
{
	my $self = shift;
	my $logfile = shift;
	my $message = shift;
	my $state = shift;

       open LOG, ">> $logfile" 
	   or die "could not open log $logfile";
       
       $| = 1; # diable output buffer;
       
       chomp($message); # remove any newlines - we only want one per message!
       
       # remove leading and trailing whitespace from $state
       $state =~ s/^\s+//;
       $state =~ s/\s+$//;
       
       # remove leading and trailing whitespace from $message
       $message =~ s/^\s+//;
       $message =~ s/\s+$//;
       
	# Filter Messages from OpenAdaptor, allow only INFO, WARN, ERROR, FAULT, FATAL Messages
	if ($state eq "OA") {
		if ($message !~ /ORA\-\d+:|INFO:|WARN:|ERROR:|FAULT:|FATAL:/) {
			return;
		} # endif
	} # endif

       print LOG scalar(localtime()) . " : $state : $message\n";
       close LOG;
} # WriteLogToFile()


sub getErrMessagesOfActualCrrDate
{
	my $self = shift;

	my @data;
	my @err_messages;

	my $sql ="SELECT TO_CHAR(crr_date, 'YYYY-MM-DD') crr_date, TO_CHAR(touch_dt,'YYYY-MM-DD HH24:MI:SS') touch_dt, message_text, program FROM tbl_message WHERE crr_date = SF_GET_CRR_DATE AND category = 'ERROR' ORDER BY msg_id DESC";



	#my $dbh = Application->getDatabase($self, $conf);

	my $sth = $dbh->prepare($sql)
		or die "Could not prepare $sql : ". $dbh->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh->errstr;

	# Read the matching records and print them out
	my $i=0; # record index
	while (@data = $sth->fetchrow_array()) {
		my $err_msg;
		#print "Logger::getErrMessagesOfActualCrrDate: i: $i, @data\n";
		$err_msg->{$i}->{crr_date} = $data[0];
		$err_msg->{$i}->{touch_dt} = $data[1];
		my $msg_text = $data[2];
		$msg_text =~ s/\n//g;		# filter linefeeds

		$err_msg->{$i}->{message_text} = "$msg_text\n";
		$data[3] =~ s/ \(TNS.*$//g;		# filter TNS version
		$err_msg->{$i}->{program} = $data[3];
		$err_messages[$i] = $err_msg;
		$i++;

	} # endif
	#if (!($i)) {	# record index not set, no records found
		#die "Logger::getErrMessagesOfActualCrrDate, No data found for \'$sql\'\n";
	#} # endif

        $sth->finish();


	return \@err_messages;




} # getErrMessages


1;
