package ConnectDirectASI; 

use strict;
use warnings;

use File::Temp;
use File::Basename;
use DBI;
use DateTime;

use Logger;
use Application;
use File;

my $MODULE = 'ConnectDirectASI.pm';

my $CONNECT_DIRECT_CMD = '/sbclocal/ConnectDirect/go2ubsnnc';
my $SEND_METHOD = 'CONNECT_DIRECT_ASI';

sub new {
	my $class = shift;
	my %attr = @_;
	my $self = {};

	bless $self, $class;

	$self->{debug} = $attr{DEBUG};

	# get the necessary attributes from the passed in values
	$self->{file_name} = $attr{FILE_NAME};
	$self->{file_id} = $attr{FILE_ID};
	$self->{asi_file_type} = $attr{ASI_FILE_TYPE};
	$self->{spoof_cd_install} = $attr{SPOOF_CD_INSTALL};

	my $app = new Application;

	if ( $attr{DBH} ) {
		$self->{DBH} = $attr{DBH};
	} else {
		$self->{DBH} = $app->getExplainDatabase();
	}

	if ( $attr{LOGGER} ) {
		$self->{logger} = $attr{LOGGER};
	} else {
		$self->{logger} = new Logger(system_name=>'ConnectDirect',
				     log_root=>$ENV{EXPLAIN_LOG},
				     DBH=>$self->{dbh});
	}
	
	if ( $self->{debug} ) {
		$self->_write_log('DEBUG', 'Debugging has been turned on.  Additional information will be logged and some cleanup operations will be disabled.', $MODULE);
	}

	return $self;
}

sub send {
	my $self = shift;
	my %params = @_;

	$params{FORCE_RESEND} = 'N' unless ( $params{FORCE_RESEND} );

	if ( defined($self->{file_id}) ) {
	if ( $self->_already_sent() eq 'Y'  ) {

		if ( $params{FORCE_RESEND} eq 'Y' ) {
			my $msg = $self->{file_name} . ' has already been sent and FORCE_RESEND is set to Y.  Resending file.';
			$self->{logger}->WriteLog('INFO', $msg, $MODULE);
		} else {
			my $msg = $self->{file_name} . ' has already been sent and FORCE_RESEND has not been set to Y.';
			$self->{logger}->WriteLog('INFO', $msg, $MODULE);
			die $msg . "\n";
		}

	}
	}

	my $asi_file_type = $self->{asi_file_type};

	unless ( defined($asi_file_type) ) {
		die "The ASI_FILE_TYPE has not been specified\n";
	}

	$self->{logger}->WriteLog('INFO', "ASI file type is $asi_file_type", $MODULE);	

	my $local_file_name = $self->{file_name};
	my $remote_file_name = basename($local_file_name);

	my $node_name = $ENV{CONNECT_DIRECT_ASI_NODE};

	unless ( $node_name ) {
		die "Connect Direct ASI node_name not specified in UNIX environment variable CONNECT_DIRECT_ASI_NODE\n";
	}

	my $parameters = "$node_name notdef notdef binary";

	my $cmd = "$CONNECT_DIRECT_CMD put $asi_file_type $local_file_name $remote_file_name $parameters";

	$self->{logger}->WriteLog('INFO', "Command line is : $cmd", $MODULE);

	if ( defined($self->{spoof_cd_install}) ) {
		# connect direct not installed
		# for testing purposes use value of SPOOF_CD_INSTALL
		# as C:D exit value

		$self->{logger}->WriteLog('INFO', '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		$self->{logger}->WriteLog('INFO', 'C:D installation is being spoofed!! Exit status will be ' . $self->{spoof_cd_install});
		$self->{logger}->WriteLog('INFO', '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		$cmd = '`exit ' . $self->{spoof_cd_install} .'`';	

	} else {
		unless ( -x $CONNECT_DIRECT_CMD ) {
			die "$CONNECT_DIRECT_CMD does not appear to be executable.  Please check your C:D installation\n";
		}

	}

	my $ret = system( $cmd );
	my $exit = $ret >> 8;

	# handle C:D return status
	if ( $exit == 0 ) {
		$self->{logger}->WriteLog('OK', $self->{file_name} . " sucessfully sent via $SEND_METHOD", $MODULE);
		$self->_log_file_send( SEND_STATUS=>'SEND_OK', DESTINATION=>$node_name);
	} else {
		$self->{logger}->WriteLog('ERROR', $self->{file_name} . " failed to send via $SEND_METHOD",$MODULE);
		$self->_log_file_send( SEND_STATUS=>'SEND_FAIL', DESTINATION=>$node_name);
		die "Could not send file....\n";
	}
}

sub _log_file_send {
	my $self = shift;
	my %params = @_;

	if ( $self->{file_id} ) {;

	my $sql = qq{INSERT INTO tbl_file_send_log (file_send_id, file_id, send_status, send_method, destination, update_date_time, creation_date_time ) VALUES ( tbl_file_send_id.nextval, :file_id, :send_status, :send_method, :destination, SYSDATE, SYSDATE)};

	my $sth = $self->{DBH}->prepare($sql);

	$sth->bind_param(':file_id', $self->{file_id} );
	$sth->bind_param(':send_status', $params{SEND_STATUS} );
	$sth->bind_param(':send_method', $SEND_METHOD );
	$sth->bind_param(':destination', $params{DESTINATION} );

	$sth->execute();
	$self->{DBH}->commit();
	}
}

sub _already_sent {
	my $self = shift;
	my %params = @_;
	my $ret = 'Y'; 
	# assign return status to Yes already sent in case something doesn't work correctly.
	# Better off not to send if any doubt;

	my $sql = qq{SELECT send_status FROM tbl_file_send_log WHERE file_id = :file_id AND send_status = 'SEND_OK' ORDER BY update_date_time DESC}; 

	my $sth = $self->{DBH}->prepare($sql);
	
	$sth->bind_param(':file_id',  $self->{file_id} );
	$sth->execute();

	my $row_hash = $sth->fetchrow_hashref();

	if ( defined($row_hash->{SEND_STATUS}) ) {
		$ret = 'Y';
	} else {
		$ret = 'N';
	}

	return $ret; 
}
1;
