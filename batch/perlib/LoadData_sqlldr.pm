package LoadData_sqlldr;

use strict;
use warnings;

use File::Temp;
use File::Basename;
use DBI;
use DateTime;

use Logger;
use Application;
use File;

sub new {
	my $class = shift;
	my %attr = @_;
	my $self = {};

	bless $self, $class;

	$self->{debug} = $attr{DEBUG};

	if ( $attr{FILE} ) {
		$self->{file} = $attr{FILE};
	} else {
		die 'You must supply a file object throught the FILE attribute';
	}
	
	unless ( $self->{file}->file_type ) {
		die 'File object must have valid file type';
	}

	if ( $attr{DBH} ) {
		$self->{dbh} = $attr{DBH};
	} else {
		$self->{app} = new Application();
		$self->{dbh} = $self->{app}->getExplainDatabase();
	}

	if ( $attr{LOGGER} ) {
		$self->{logger} = $attr{LOGGER};
	} else {
		$self->{logger} = new Logger(system_name=>'LoadData_sqlldr',
				     log_root=>$ENV{EXPLAIN_LOG},
				     DBH=>$self->{dbh});
	}

	
	if ( $self->{debug} ) {
		$self->_write_log('DEBUG', 'Debugging has been turned on.  Additional information will be logged and some cleanup operations will be disabled.');
		$self->_write_log('DEBUG', 'Control files and temporary sequences will not be deleted.  They will need to be manually removed.');
	}

	return $self;
}

sub LoadData {
	my $self = shift;		

        $self->_write_log('INFO', 'starting sqlldr load process');

	if ( $self->{file}->file_layout() eq 'LOB' ) {
        	$self->_write_log('INFO', 'expecting to load 1 row containing XML payload');
	} else {
        	$self->_write_log('INFO', 'expecting to load ' . $self->{file}->records_in_file() . ' records in total');
	}

	$self->{load_id} = $self->_log_processing_started();

	$self->DeleteFileData();

	my $rtn = $self->_sqlldr();

	$self->_cleanup();

	return $rtn;
}

sub _sqlldr {
	my $self = shift;

	my $result;
	my $start_dt = DateTime->now;

	# save a timestamp for use elsewhere yyyymmddhhmmss
	$self->{timestamp} = $start_dt->strftime('%Y%m%d%H%M%S');

	my $file_layout = $self->{file}->file_layout();
	my $file_name;

	if ( $file_layout eq 'LOB' ) {
		$file_name = $self->_create_xml_data_file();
	} else {
		$file_name = $self->{file}->fully_qualified_file_name();
	}

	my $skip_rows = $self->{file}->GetHeaderCount();

	my $no_failed_recs_allowed = 0;

	if ( $self->{file}->raw_failure_tolerance() != 0 ) {
		my $failure_percent = $self->{file}->raw_failure_tolerance();

		$no_failed_recs_allowed = int( $self->{file}->records_in_file() * ( $failure_percent * .01 ) );
		$self->_write_log('INFO', "Raw failure tolerance set to $failure_percent percent.  Will fail after $no_failed_recs_allowed errors.");
	}

	my $control_file = $self->_control_file();

#	my $seq_name = $self->{row_id_seq_name};

        my $client=$self->{file}->GetClient();

	$self->{app} = new Application();

	my $credentials = $self->{app}->getCredentials(CLIENT => $self->{file}->GetClient());

	# strip password from credentials so we can pass to sqlldr from STDIN
	# hides password from ps -ef

	$credentials =~ s/(\w+)\/(\w+)\@(\w+)/$1\@$3/;
	my $password = $2;

	my $log_file = $self->_get_log_file();
	my $bad_file = $self->_get_bad_file();

	$self->_write_log('INFO',"sqlldr Bad file is $bad_file");
	$self->_write_log('INFO',"sqlldr Log file is $log_file");

	my $sqlldr = $ENV{ORACLE_HOME} . '/bin/sqlldr';
	my $options = "CONTROL=$control_file SKIP=$skip_rows DATA=$file_name LOG=$log_file BAD=$bad_file ERRORS=$no_failed_recs_allowed SILENT=(FEEDBACK)";
	my $cmd = "$sqlldr $credentials $options";

	if ( $self->{debug} ) {
		$self->_write_log('DEBUG', "sqlldr command line is $cmd");
	}

	$self->{file}->set_status('LOADING');

	my $msg;
	my $rtn = system("echo $password | $cmd > /dev/null 2>&1");
	my $exit = $? >> 8;

	$self->{records_loaded} = $self->_get_records_loaded();
	my $end_dt = DateTime->now;
	my $duration = $end_dt->subtract_datetime($start_dt);

	my $total_seconds = ($duration->hours * 3600) + ( $duration->minutes() * 60 ) + ( $duration->seconds );

	$self->{file}->set_last_load_date();

	if ( $exit == 0 ) {
		$self->{file}->set_status('ONLINE');
		$self->_write_log('OK', 'sucessfully loaded, sqlldr exited with 0 status');
		$result = 'RW_RAW_LOAD_SUCCESS';
		$self->_update_load_log($result);

	} else {

		if ( ( $self->{file}->records_in_file() - $no_failed_recs_allowed ) > $self->{records_loaded} ) {
			$self->{file}->set_status('FAILED');
			$result = 'FAIL_RW_TOO_MANY_BAD_RECORDS';
			$self->_update_load_log($result);
			$self->_write_log('INFO',"number of sucessful records outside defined tolerance so file load failed");
			die "sqlldr exited with status $exit. See log files\n";
		} else {
			$self->{file}->set_status('ONLINE');
			$result = 'RW_RAW_LOAD_PARTIAL_SUCCESS';
			$self->_update_load_log($result);
			$self->_write_log('INFO',"sqlldr exited with status $exit. See log files");
			$self->_write_log('INFO',"number of sucessful records within defined tolerance so file load succeeded");
			
		}
	}

	my $records_per_sec = int($self->{records_loaded} / $total_seconds);

	$self->_write_log('INFO', $self->{records_loaded} . " records actually loaded in $total_seconds seconds for $records_per_sec records per sec");

	my $ret = {file_id=>$self->{file}->file_id(),
		   load_id=>$self->{load_id},
		   load_result=>$result};

	return $ret;

}

sub _control_file {
	my $self = shift;

	my $control_file;
	my $file_layout =  $self->{file}->file_layout();

	if ( $file_layout eq 'LOB' ) {

		# build LOB control file dynamically	
		$control_file = $self->_get_xml_control_file();

	} elsif ( $file_layout eq 'FLAT' ) {
		# all other types of SQLLDR loads.  
		# CSV dynamically created by default and FIXED WIDTH if ctl file is provided

		# get control file from conf dir or env var override
		$control_file = $self->_get_control_file();

		# if control file isn't obtained from above then build one dynamically
		unless ( defined($control_file) ) {
	 		$control_file =	$self->_create_ctl_file();
		}
	} else {
		die "Unexpected value of '$file_layout' in tbl_file_type.file_layout. Supported types are 'LOB' and 'FLAT'\n";
	}	

	# keep track of temp files so we can clean them up later
	push @{ $self->{temp_files} }, $control_file;

	return $control_file;

}

sub _get_xml_control_file {
	my $self = shift;

	my $raw_table = $self->{file}->GetRawTable();
	my $file_id = $self->{file}->file_id();

	my $tmp = new File::Temp( UNLINK =>0,
                                  TEMPLATE => 'tempXXXXX',
                                  DIR => '/tmp/',
                                  SUFFIX => '.ctl');

	my $control_file = $tmp->filename;

	print $tmp "LOAD DATA APPEND INTO TABLE $raw_table\n";
	print $tmp "FIELDS TERMINATED BY ','\n";
	print $tmp "(file_id, xml_file_name FILLER,\n";
	print $tmp "file_content LOBFILE( xml_file_name ) TERMINATED BY EOF)\n";

	return $control_file;
}

sub _create_xml_data_file {
	my $self = shift;

	my $tmp = new File::Temp( UNLINK =>0,
                                  TEMPLATE => 'tempXXXXX',
                                  DIR => '/tmp/',
                                  SUFFIX => '.dat');

	my $file_name = $self->{file}->fully_qualified_file_name();
	my $file_id = $self->{file}->file_id();

	print $tmp "$file_id,$file_name\n";

	my $dat_file = $tmp->filename();

	# keep track of temp files so we can clean them up later
	push @{ $self->{temp_files} }, $dat_file;

	return $dat_file;
}

sub _get_control_file {
	my $self = shift;
	
	my $control_file;

	# control file can be overriden through specifying a env var in <file_type>_CTL format
	my $env_var = $self->{file}->file_type() . '_CTL';
	if ( $ENV{$env_var} ) {

		if  ( -f $ENV{$env_var} ) {
			$control_file = $self->_rewrite_static_ctl_file( $ENV{$env_var} );
			$self->_write_log('INFO',"sqlldr control file overridden through UNIX environment varible $env_var");
		} else {
			my $msg =  "The control file lookup was overriden through the setting of the env var $env_var, but the file $ENV{$env_var} does not exist\n";
			die $msg;
		}

	} else {

		my $conf_control_file = $ENV{EXPLAIN_HOME} . '/conf/' . $self->{file}->file_type() . '.ctl';
		# if control file isn't set yet, check if one exits in the conf dif and use that

		if ( -e $conf_control_file ) {
			$control_file = $self->_rewrite_static_ctl_file( $conf_control_file );
		}			

	}

	return $control_file;
}

sub _create_ctl_file {
	my $self = shift;

	$self->_write_log('INFO', 'Using dynamically generated sqlldr control file' );
	my $raw_table = $self->{file}->GetRawTable();
	my $file_id = $self->{file}->file_id();
	$self->{row_id_seq_name} = $self->_get_temp_seq_name();

	my $field_delimiter = $self->{file}->GetFieldDelimiter();

	die 'Must not have NULL delimiter column in TBL_FILE_TYPE ' . $self->{file_type}
		unless ( $field_delimiter );

	my $date_format = $self->{file}->date_format();

	die 'Must not have NULL date_format column in TBL_FILE_TYPE for ' . $self->{file_type} 
		unless ( $date_format );

	my $tmp = new File::Temp( UNLINK =>0,
                                  TEMPLATE => 'tempXXXXX',
                                  DIR => '/tmp/',
                                  SUFFIX => '.ctl');

	my $control_file = $tmp->filename;

	if ( $self->{debug} ) {
		$self->_write_log('DEBUG', "sqlldr control file is $control_file");	
	}

	my $sql = qq{SELECT RPAD('"'||column_name||'"',33,' ') || 
DECODE (data_type,'VARCHAR2', 'CHAR('||DATA_LENGTH||') NULLIF "'||column_name||'"=BLANKS',
'FLOAT', 'DECIMAL EXTERNAL NULLIF "'||column_name||'"=BLANKS',
'NUMBER', DECODE (data_precision, 0, 'INTEGER EXTERNAL NULLIF "'||column_name||'"=BLANKS', 
decode (data_scale, 0, 'INTEGER EXTERNAL NULLIF "'||column_name||'"=BLANKS',
'DECIMAL EXTERNAL NULLIF "'||column_name||'"=BLANKS')),'DATE', 
'DATE "$date_format" NULLIF "'||column_name||'"=BLANKS', NULL) sqlldr_line
FROM all_tab_columns
WHERE column_name NOT IN ('FILE_ID','ROW_ID')
AND table_name = upper(:table_name)
AND owner = upper(:owner)
ORDER BY column_id};

	my $sth = $self->{dbh}->prepare($sql);

	my $owner = 'GC_EXTERNAL';

	$sth->bind_param(':table_name', $raw_table);
	$sth->bind_param(':owner', $owner);

	$sth->execute();

	print $tmp "LOAD DATA APPEND INTO TABLE $raw_table\n";
	print $tmp "FIELDS TERMINATED BY '$field_delimiter' TRAILING NULLCOLS\n";
	print $tmp "(\n";

	my $delim = '';
	while (my $hashref = $sth->fetchrow_hashref() ) {
		print $tmp "$delim $hashref->{SQLLDR_LINE}\n";
		$delim = ',';
	}

	if ( $delim eq '' ) {
		# looks like no data was found in data dictionary so die here
		my $msg = "Could not find $owner.$raw_table in Oracle data dictionary.  Was not able to dynamically construct sqlldr CTL file\n";
		$self->_write_log('ERROR',$msg);
		die $msg;
	}

	print $tmp qq{,file_id "$file_id", row_id "$self->{row_id_seq_name}.nextval")};

	return $control_file;
}

sub _rewrite_static_ctl_file {
	my $self = shift;
	my $ctl_file = shift;

	my $tmp = new File::Temp( UNLINK =>0,
                                  TEMPLATE => 'tempXXXXX',
                                  DIR => '/tmp/',
                                  SUFFIX => '.ctl');

	open FH, $ctl_file 
		or die "Could not open $ctl_file for reading : $!";

	my $control_file = $tmp->filename;
	$self->{row_id_seq_name} = $self->_get_temp_seq_name();

	my $file_id = $self->{file}->file_id();
	my $row_id_seq = $self->{row_id_seq_name} . '.nextval';
	my $raw_table = $self->{file}->GetRawTable();

	while ( <FH> ) {
		my $line = $_;
		$line =~ s/<file_id>/$file_id/;
		$line =~ s/<row_id_sequence>/$row_id_seq/;
		$line =~ s/<raw_table>/$raw_table/;

		print $tmp "$line";

	}

	close FH;
	return $control_file;
	
}

sub _get_temp_seq_name {
	my $self = shift;

	my $time = time();
	my $seq_name = "tmp_seq_$time";

	$self->{dbh}->do(qq{CREATE SEQUENCE $seq_name START WITH 1 CACHE 10000000})
		or die "Could name create $seq_name : $DBI::errstr";

	$self->{temp_sequence} = $seq_name;

	return $seq_name;
}

sub DeleteFileData {
	my $self = shift;
	my %attr = @_;

	my $raw_table = $self->{file}->GetRawTable;
	my $sth = $self->{dbh}->prepare("DELETE FROM $raw_table WHERE file_id = ?");
	$sth->execute( $self->{file}->file_id );
	$self->{dbh}->commit;

	$self->_write_log('INFO',"Deleted all records from $raw_table for file_id " . $self->{file}->file_id() );
}

sub _write_load_log {
	my $self = shift;

	my $sql = 'INSERT INTO tbl_load_log ( load_id, file_id, load_date, records_loaded, load_status_dt)';
	$sql .= 'VALUES ( :load_id, :file_id, :load_date, :records_loaded, SYSDATE)';

	my $sth = $self->{dbh}->prepare($sql);
	$sth->bind_param(':load_id', $self->{load_id});
	$sth->bind_param(':file_id', $self->{file_id});
	$sth->bind_param(':load_date', '1-JAN-1900'); # this value gets overwritten later.
	$sth->bind_param(':records_loaded', $self->{records_loaded});

	$sth->execute();
}

sub _get_records_loaded {
	my $self = shift;

	my $sql = 'SELECT count(*) records_loaded FROM ' . $self->{file}->GetRawTable() . ' WHERE file_id = :file_id';

	my $sth = $self->{dbh}->prepare($sql);
	$sth->bind_param(':file_id', $self->{file}->file_id);
	$sth->execute();

	my $hash_ref = $sth->fetchrow_hashref();
	$sth->finish();

	my $records_loaded = $hash_ref->{RECORDS_LOADED};
	
	return $records_loaded;
}

sub _log_processing_started {

        my $self = shift;

        my $sth = $self->{dbh}->prepare(q{
               BEGIN
                  :load_id:= PKG_FILE_FEED.FILE_LOG_PROCESSING_STARTED(:file_id,:records_in_file,:digest);
               END;
         });

         $sth->bind_param(":records_in_file", $self->{file}->records_in_file() );
         $sth->bind_param(":file_id", $self->{file}->file_id );
         $sth->bind_param(":digest", $self->{file}->digest );

	 my $load_id;
         $sth->bind_param_inout(":load_id", \$load_id,1);

         $sth->execute;

         return $load_id;

}

sub _update_load_log {
	my $self = shift;
	my $load_status = shift;

	my $sql = 'BEGIN pkg_file_logger.update_log(:load_id, :load_status, :records_loaded, :records_in_file, :digest, :error_text); END;';

	my $sth = $self->{dbh}->prepare($sql);

	$sth->bind_param(':load_id', $self->{load_id} );
	$sth->bind_param(':load_status', $load_status );
	$sth->bind_param(':records_loaded', $self->{records_loaded} );
	$sth->bind_param(':records_in_file', $self->{file}->records_in_file() );
	$sth->bind_param(':digest', $self->{file}->digest() );
	$sth->bind_param(':error_text', $self->{error_text} );

	$sth->execute();

}

sub _get_bad_file {
	my $self = shift;

	return $ENV{EXPLAIN_LOG} . '/' . $self->{file}->file_name . '_' . $self->{load_id} . '.bad';
}

sub _get_log_file {
	my $self = shift;

	return $ENV{EXPLAIN_LOG} . '/' . $self->{file}->file_name . '_' . $self->{load_id} .  '.log';
}

sub _cleanup {
	my $self = shift;
	
	if ( $self->{temp_sequence} ) {
		unless ( $self->{debug} ) {	
			$self->{dbh}->do("DROP SEQUENCE $self->{temp_sequence}")
				or warn 'Could not drop sequence ' . $self->{temp_sequence} . ' : ' . $self->{dbh}->errstr(); 
		}
	}	
	
	foreach my $file ( @{ $self->{temp_files} } ) {
		unless ( $self->{debug} ) {	
			unlink $file
				or warn "Could not delete temp file $file : $!";
		}
	}

}

sub _write_log {
	my $self = shift;
	my $status = shift;
	my $msg = shift;

	$msg = $self->{file}->file_name() . ' : ' . $msg;
	$self->{logger}->WriteLog($status,$msg,'LoadData_sqlldr.pm');
	
}
1;
