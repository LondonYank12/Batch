package FileHandler;

use strict;
use DBI;
use Application;
use File;
use Logger;

sub new {
	my $class = shift;
	my %attr = @_;
	my $self = {};
	bless $self, $class;

	my $app = new Application;

	$self->{debug} = $attr{DEBUG};

	if ( $attr{IGNORE_DIGEST} ) {
		$self->{ignore_digest} = 1;
	}
	
	if ( $attr{DBH} ) {
		$self->{dbh} = $attr{DBH};
	} else {
		$self->{dbh} = $app->getExplainDatabase();
	}

	if ( $attr{LOGGER} ) {
		$self->{logger} = $attr{LOGGER};
	} else {
		$self->{logger} = new Logger( log_root=>$ENV{EXPLAIN_LOG}, 
				              system_name=>'FileHandler',
				              DBH=>$self->{dbh});
	}

	$self->{client} = $attr{CLIENT};
	$self->{system_of_record} = $attr{SYSTEM_OF_RECORD};
	$self->{file_type} = $attr{FILE_TYPE};

	$self->_initialize();

	return $self;
}

sub _initialize {
	my $self = shift;

	if ( $self->{file_type} ) {
		my $sql = 'SELECT system_of_record, client FROM tbl_file_type WHERE file_type = :file_type';

		my $sth = $self->{dbh}->prepare($sql);

		$sth->bind_param( ':file_type', $self->{file_type} );
		$sth->execute();

		my $hash_ref = $sth->fetchrow_hashref();
		$sth->finish;

		$self->{system_of_record} = $hash_ref->{SYSTEM_OF_RECORD};
		$self->{client} = $hash_ref->{CLIENT};
	}

	$self->{data_root} = $ENV{EXPLAIN_DATA};	
}

sub getUnprocessedDir {
	my $self = shift;
	my $path = $self->{data_root} . '/' . $self->{client} . '/unprocessed/'; 
	
	if ( $self->{system_of_record} ) {
		$path .= $self->{system_of_record} . '/';
	}

	$path = lc($path);

	die "$path is not a valid directory" unless ( -d $path );

	return $path;
}

sub getUnprocessedFiles {
	my $self = shift;

	my @files;
	my @file_objects;

	my $glob_dir =  $self->getUnprocessedDir . '*';
	@files = glob( $glob_dir );

	$self->_write_log('INFO','looking for unprocessed files in ' . $glob_dir ); 

	my $file_objects = $self->_get_file_obj( \@files );

	return $file_objects;
}

sub getFailedDir {
	my $self = shift;
	my $path = $self->{data_root} . '/' . $self->{client} . '/failed/'; 

	if ( $self->{system_of_record} ) {
		$path .= $self->{system_of_record} . '/';
	}

	$path = lc($path);

	die "$path is not a valid directory" unless ( -d $path );
 	
	return $path;
}


sub getProcessedDir {
	my $self = shift;
	my $path = $self->{data_root} . '/' . $self->{client} . '/processed/'; 

	if ( $self->{system_of_record} ) {
		$path .= $self->{system_of_record} . '/';
	}
	
	$path = lc($path);

	die "$path is not a valid directory" unless ( -d $path );

	return $path;
}

sub getLoadingDir {
	my $self = shift;
	my $path = $self->{data_root} . '/' . $self->{client} . '/loading/'; 

	if ( $self->{system_of_record} ) {
		$path .= $self->{system_of_record} . '/';
	}
	
	$path = lc($path);

	die "$path is not a valid directory" unless ( -d $path );

	return $path;
}

sub getAssociatedFilesDir
{
	my $self = shift;
	my $path = $self->{data_root} . '/' . $self->{client} . '/associated_files/'; 

	if ( $self->{system_of_record} ) {
		$path .= $self->{system_of_record} . '/';
	}
	
	$path = lc($path);

	die "$path is not a valid directory" unless ( -d $path );

	return $path;
}

sub _get_file_obj {
	my $self = shift;
	my $file_list = shift;

	my @file_objects;

	foreach my $file_name ( sort @$file_list ) {

		# we only want .TXT , .DAT and .XML files
		# do it case insenitively
		next unless ( $file_name =~ /\.TXT$|\.DAT$|\.XML$/i  );

		my $file_obj;

		eval {
			$file_obj = new File ( DBH=>$self->{dbh},
						FILE_NAME=>$file_name ,
						IGNORE_DIGEST=>$self->{ignore_digest},
						LOGGER=>$self->{logger},
						DEBUG=>$self->{debug} );
		};

		if ( $@ ) {
			# eval block failed 
			# log the error and go to next record
			$self->_write_log('WARN', "Tried to create File object for $file_name but failed with '$@'");
			next;
		}

		# check if file_obj has same client as $self->{client}

		if ( $self->{file_type} ) {
			if ( $self->{file_type} eq $file_obj->file_type() ) {
				push @file_objects, $file_obj;
			}
		} else { 
			push @file_objects, $file_obj;
		}	
	}

	return \@file_objects;

}

sub _write_log {
	my $self = shift;
	my $status = shift;
	my $msg = shift;

	$self->{logger}->WriteLog($status,$msg,'FileHandler.pm');
	
}

sub DESTROY {
}
1;
