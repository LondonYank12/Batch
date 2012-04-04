package File;

use strict;

use DBI;
use DateTime;
use Digest::SHA1;
use File::Basename;

use Application;
use FileType;
use Logger;
use File::Copy;

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
		$self->{logger} = new Logger(system_name=>'File',
				     log_root=>$ENV{EXPLAIN_LOG},
				     DBH=>$self->{dbh});
	}

	$self->{file_name} = basename($attr{FILE_NAME});
	$self->{file_path} = dirname($attr{FILE_NAME});

	$self->{file_id} = $attr{FILE_ID};
	$self->{digest} = $attr{DIGEST};

	$self->_initialize();

	return $self;
}

sub file_id {
	my $self = shift;

	return $self->{file_id};
}

sub file_type {
	my $self = shift;

	return $self->{file_type_obj}->file_type();
}

sub crr_date {
	my $self = shift;

	return $self->{crr_date};
}

sub file_name {
	my $self = shift;

	return $self->{file_name};
}

sub file_path {
	my $self = shift;

	return $self->{file_path};
}

sub GetRawTable {
	my $self = shift;

	return $self->{file_type_obj}->RawTable();
}

sub digest {
	my $self = shift;

	return $self->{digest};
}

sub records_in_file {
	my $self = shift;

	return $self->{records_in_file};
}

sub last_load_date {
	my $self = shift;
 	$self->{last_load_date} = shift;

	$self->_save();
}

sub set_last_load_date {
	my $self = shift;

	my $sql = 'UPDATE tbl_file SET last_load_date = SYSDATE WHERE file_id = :file_id';
	my $sth = $self->{dbh}->prepare( $sql );
	$sth->bind_param(':file_id', $self->{file_id});
	$sth->execute();
	$self->{dbh}->commit;

	$self->_write_log('INFO', "last_load_date Status set to sysdate");
}

sub file_status {
	my $self = shift;

	return $self->{file_status};
}

sub file_layout {
	my $self = shift;

	return $self->{file_type_obj}->file_layout();
}

sub raw_failure_tolerance {
	my $self = shift;

	return $self->{file_type_obj}->raw_failure_tolerance();
}

sub oa_property_file {
	my $self = shift;

	return $self->{oa_property_file};
}

sub set_status {
	my $self = shift;
	$self->{file_status} = shift;	

	$self->_save();
	$self->_write_log('INFO', "File Status set to " . $self->{file_status});
}

sub fully_qualified_file_name {
	my $self = shift;

	return $self->{file_path} . '/' . $self->{file_name}; 
}

sub MoveFile {
	my $self = shift;
	my $new_location = shift;

	my $fully_qualified_file_name = $self->fully_qualified_file_name();

	die "Move operation failed as file is not in expected location.  Check if it has been moved or renamed.\n" unless ( -e $fully_qualified_file_name );

	die "Move failed as new location ( $new_location ) is not a directory\n" unless ( -d $new_location );	

	my $new_fully_qualified_file_name = $new_location . '/' . $self->{file_name}; 

	if ( -f $new_fully_qualified_file_name ) {
		my $msg = "Can not move file as duplicate file already exists at $new_location. Remove duplicate file and rerun.\n";
		$self->_write_log('ERROR',$msg);
		die $msg;
	}

	rename ( $fully_qualified_file_name, $new_fully_qualified_file_name )
		or die "Could not rename file: $!";

	$self->{file_path} = dirname( $new_fully_qualified_file_name );
	$self->{file_name} = basename( $new_fully_qualified_file_name );

	$self->_write_log('OK', "moved to $new_location");
	$self->_save;
}

sub CreateSymLink {
	my $self = shift;
	my $target = shift;

	my $fully_qualified_file_name = $self->fully_qualified_file_name();

	# automatically delete any pre-existing symlinks
	if ( -l $target ) {
		unlink $target;
	}

	symlink ($fully_qualified_file_name , $target) 
		or die "Could not create symlink for $self->{file_name} with target of $target: $!";

	$self->_write_log('OK', "symbolic link createed to $target");

}

sub CopyFile {
        my $self = shift;
        my $target = shift;

        my $fully_qualified_file_name = $self->fully_qualified_file_name();

        # automatically delete any pre-existing file
        if ( -l $target ) {
                unlink $target;
        }

        copy ($fully_qualified_file_name , $target)
                or die "Could not copy file from $self->{file_name} to $target: $!";

        $self->_write_log('OK', "File has been copied to $target");

}

sub DeleteFile {
        my $self = shift;
        my $target = shift;

        # Delete file if exists

        unlink $target or die "Could not delete copy of the file: $!";

        $self->_write_log('OK', "Copy of data file has been deleted");
}


sub GetOriginalFileName {
	my $self = shift;

	return $self->{original_file_name};
}

sub SetOriginalFileName {
	my $self = shift;

	$self->{original_file_name} = shift;
	$self->_save();
}

sub GetLoadMethodType {
	my $self = shift;

	return $self->{file_type_obj}->LoadMethodType();
}

sub asi_file_type {
	my $self = shift;

	return $self->{file_type_obj}->asi_file_type();
}

sub GetHeaderCount {
	my $self = shift;

	return $self->{file_type_obj}->HeaderCount();
}

sub GetFieldDelimiter {
	my $self = shift;

	return $self->{file_type_obj}->FieldDelimiter();
}

sub GetClient {
	my $self = shift;

	return $self->{file_type_obj}->Client();

}

sub date_format {
	my $self = shift;

	return $self->{file_type_obj}->date_format();
}

sub send_method {
	my $self = shift;

	return $self->{file_type_obj}->send_method();
}

sub _initialize {
	my $self = shift;
	my $sql;
	my $sth;

	if ( $self->{file_id} ) {
		$sql = "SELECT * FROM tbl_file WHERE file_id = ?";
		$sth = $self->{dbh}->prepare($sql);
		$sth->execute($self->{file_id});

	} elsif ( $self->{file_name} ) {
		$sql = "SELECT * FROM tbl_file WHERE file_name = ?";
		$sth = $self->{dbh}->prepare($sql);
		$sth->execute( $self->{file_name} );

	} elsif ( $self->{digest} ) {
		$sql = "SELECT * FROM tbl_file WHERE digest = ?";
		$sth = $self->{dbh}->prepare($sql);
		$sth->execute($self->{digest});
	} else {
		die "Could not initialize file object as there is no way to indentify record.  Neet either file_name, file_id or digest of file.\n";
	}

	my $file_rec = $sth->fetchrow_hashref();

	if ( $file_rec ) {
		$self->{file_id} = $file_rec->{FILE_ID};
		$self->{file_type} = $file_rec->{FILE_TYPE};
		$self->{file_name} = $file_rec->{FILE_NAME};
		$self->{crr_date} = $file_rec->{CRR_DATE};
		$self->{digest} = $file_rec->{DIGEST};
		$self->{records_in_file} = $file_rec->{RECORDS_IN_FILE};
		$self->{last_load_date} = $file_rec->{LAST_LOAD_DATE};
		$self->{file_status} = $file_rec->{FILE_STATUS};
		$self->{original_file_name} = $file_rec->{ORIGINAL_FILE_NAME};
		$self->{oa_property_file} = $file_rec->{OA_PROPERTY_FILE};

		if ( $file_rec->{DIGEST} ) {
;			$self->{digest} = $file_rec->{DIGEST};
			$self->_check_digest();
		} else {
			$self->{digest} = $self->_get_file_digest();
			$self->_save();
		}
	
	} else { 
		# new file

		# get file type from file_name
		$self->{file_type} = $self->_get_file_type;

		# get crr_Date
		$self->{crr_date} = $self->_get_crr_date;

		# get digest
		$self->{digest} = $self->_get_file_digest;

		# get records in file
		$self->{records_in_file} = $self->_get_records_in_file;

		$self->{file_status} = 'UNPROCESSED';

		# save & get file_id
		$self->{file_id} = $self->_save;
	}

	$sth->finish;

	if ( $self->{file_type} ) {
		$self->{file_type_obj} = new FileType( DBH => $self->{dbh},
				    LOGGER => $self->{logger},
				    FILE_TYPE=>$self->{file_type} );

		$self->{file_type} = $self->{file_type};

		# get records in file
		$self->{records_in_file} = $self->_get_records_in_file;

	}
}

sub _get_crr_date {
	my $self = shift;

	if ( $self->{file_type} ) {
	my $prefix = $self->{file_type_obj}->FilePrefix();
	my $suffix = $self->{file_type_obj}->FileSuffix();
	my $crr_date_format = $self->{file_type_obj}->crr_date_format();

	my $file_name = $self->{file_name};

	my $y;
	my $m;
	my $d;

	eval ( '$file_name =~ ' . $crr_date_format );

	if ( $@ ) {
		die $@;
	}

	die "Could not parse date in $self->{file_name} using $crr_date_format" unless ( $y && $m && $d );

	my $dt;
	eval { $dt = new DateTime( year=> $y, month=> $m, day=> $d) };

	die "Could not parse date in $self->{file_name}. $@" if ( $@ );

	return $dt->strftime('%d-%b-%Y');
	}
}

sub _get_file_digest {
	my $self = shift;

	my $file_name = $self->{file_path} . '/' . $self->{file_name};

	open( FH , $file_name ) 
		or die "Could not open $file_name : $!\n";

	my $sha1 = Digest::SHA1->new;
	while ( <FH> ) {
		$sha1->add( $_ ); 
	}	
	close FH;

	return $sha1->b64digest;
	
}

sub _check_digest {
	my $self = shift;

	my $file_digest = $self->_get_file_digest();
	
	if ( $self->{digest} ne $file_digest ) {
		if ( $self->{ignore_digest} ) {
			$self->_write_log('WARN', 'Digest has change, ignore digest set so allowing file object creation');
		} else {
			my $msg = "File digest on $self->{file_name} has changed.  File object will not be created";
			$self->_write_log('ERROR', $msg);
			die "$msg";
		}
	}

}

sub _check_for_duplicate_digest {
	my $self = shift;

	my $sql = 'SELECT * FROM tbl_file WHERE digest = :digest';
	my $sth = $self->{dbh}->prepare($sql);

	$sth->bind_param(':digest',$self->{digest});
	$sth->execute();

	while ( my $file_rec = $sth->fetchrow_hashref() ) {
		die "Can't create new file record for $self->{file_name} as record already exists with the same digest. Existing record file_id is $file_rec->{FILE_ID}\n";	
	}

	$sth->finish;
}

sub _get_file_type {
	my $self = shift;
	my $file_type;

	unless ( $self->{file_type_obj} ) { 
		$self->{file_type_obj} = new FileType( DBH=>$self->{dbh}, LOGGER=>$self->{logger} ) 
	};

	my $ft_recs = $self->{file_type_obj}->GetFileTypeRecs();

	foreach my $key ( keys %$ft_recs ) {
		my $prefix = $ft_recs->{$key}->{FILE_PREFIX};
		my $suffix = $ft_recs->{$key}->{FILE_SUFFIX};

		if ( $self->{file_name} =~ /^$prefix.*$suffix$/ ) {
			$file_type = $ft_recs->{$key}->{FILE_TYPE};	
			$self->_write_log('INFO', "file type is $file_type");
			last;
		}
	} 

	unless ( $file_type ) {
		$self->_write_log('WARN', 'could not identify file type');
	}

	$self->{file_type_obj} = new FileType( DBH=> $self->{dbh}, FILE_TYPE=>$file_type);

	return $file_type;
}

sub _get_records_in_file {
	my $self = shift;

	my $record_count = 0;

	if ( $self->{file_type} eq 'XML' ) {
		$record_count = 1;
	} else {

		my $header_row_count = $self->GetHeaderCount();
	
		my $file_name = $self->{file_path} . '/' . $self->{file_name};
	
		open(FH, $file_name)
			or die "Could not open $file_name : $!";
	
		while ( <FH> ) {
			$record_count++;
		}
		close FH;
	
		$record_count = $record_count - $header_row_count;
	
		if ( $self->{records_in_file} ) {
			if ( $self->{records_in_file} != $record_count ) {
				$self->_write_log('WARN', 'record count has changed since last file load. Was ' . $self->{records_in_file} . " now $record_count");
	
			}
		}	
	}
	return $record_count;
}

sub _save {
	my $self = shift;

	my $sth;
	my $sql;

	if ( $self->{file_id} ) {
		$sql = "UPDATE tbl_file SET
				update_date_time = SYSDATE,
				file_status = :file_status,
				file_name = :file_name,
				file_path = :file_path,
				records_in_file = :records_in_file,
				original_file_name = :original_file_name,
				digest = :digest
			WHERE file_id = :file_id";

		$sth = $self->{dbh}->prepare($sql);
		$sth->bind_param(':file_name', $self->{file_name});
		$sth->bind_param(':file_path', $self->{file_path});
		$sth->bind_param(':records_in_file', $self->{records_in_file});
		$sth->bind_param(':file_status', $self->{file_status});
		$sth->bind_param(':file_id', $self->{file_id});
		$sth->bind_param(':original_file_name', $self->{original_file_name});
		$sth->bind_param(':digest', $self->{digest});
	
		$sth->execute;	
		$self->{dbh}->commit;
	} elsif ( $self->{file_type} ) {
	# only INSERT new file if we have been able to identify the file_type

		#print "records in file " . $self->{records_in_file} . "\n";

		unless ( $self->{ignore_digest} ) {
			# before creating new file record 
			# check to ensure that record does not exist with same digest;

			# don't bother checking if file is zero length
			if ( $self->{records_in_file} > 0 ) {
				$self->_check_for_duplicate_digest();
			}
		}

		$sql = qq{
			INSERT INTO tbl_file (
			file_id,
			file_type,
			crr_date,
			file_name,
			file_path,
			digest,
			records_in_file,
			file_status,
			original_file_name,
			creation_date_time)
			VALUES (
			TBL_FILE_SEQ.nextval,
			:file_type,
			:crr_date,
			:file_name,
			:file_path,
			:digest,
			:records_in_file,
			:file_status,
			:original_file_name,
			SYSDATE) };

		$sth = $self->{dbh}->prepare($sql);

		$sth->bind_param(':file_type', $self->{file_type});
		$sth->bind_param(':crr_date', $self->{crr_date});
		$sth->bind_param(':file_name', $self->{file_name});
		$sth->bind_param(':file_path', $self->{file_path});
		$sth->bind_param(':digest', $self->{digest});
		$sth->bind_param(':records_in_file', $self->{records_in_file});
		$sth->bind_param(':file_status', $self->{file_status});
		$sth->bind_param(':original_file_name', $self->{original_file_name});

		$sth->execute;	
		$self->{dbh}->commit;
	}


	$sql = qq{SELECT file_id FROM tbl_file WHERE file_name = :file_name};
	$sth = $self->{dbh}->prepare($sql);
	$sth->bind_param(':file_name', $self->{file_name});
	$sth->execute;

	my $file_id_rec = $sth->fetchrow_hashref();

	$sth->finish;

	$self->{file_id} = $file_id_rec->{FILE_ID};
	return $self->{file_id};
}

sub _write_log {
	my $self = shift;
	my $status = shift;
	my $msg = shift;

	$msg = $self->file_name() . ' : ' . $msg;
	$self->{logger}->WriteLog($status,$msg,'File.pm');
	
}

sub DESTROY {

}
1;
