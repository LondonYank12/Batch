package LoadData_ext;

use strict;
use warnings;

use File::Temp;
use File::Basename;
use DateTime;
use DBI;

use Application;
use File;
use Logger;

#
# Author - M.H.Raza
# Version 1.0
# Change history:
# Version    Date      Who         Descriptiom
# 1.0        20.02.07  M.H.Raza    Initial version. 
#
#

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

        if ( $attr{DBH} ) {
                $self->{dbh} = $attr{DBH};
        } else {
		my $app = new Application;
                $self->{dbh} = $app->getDatabase();
        }

        if ( $attr{LOGGER} ) {
                $self->{logger} = $attr{LOGGER};
        } else {
                $self->{logger} = new Logger(system_name=>'File_loader',
                                     log_root=>$ENV{EXPLAIN_LOG},
                                     DBH=>$self->{dbh});
        }

	return $self;
}

sub LoadData {
	my $self = shift;	

        $self->{load_id} = $self->_log_processing_started();
       
        $self->_writelog('INFO', 'Verifying file type');
        my $known_file_type_result = $self->_check_known_file_type();

        $self->_writelog('INFO', 'Verifying file is not empty');
        my $empty_file_check_result = $self->_check_empty_file();

	$self->_extable();
}

sub _log_processing_started {
        my $self = shift;


        $self->_writelog('INFO', 'Logging into the database that processing has been started');

        my $csr = $self->{dbh}->prepare(q{
               BEGIN
                  :load_id:= PKG_FILE_FEED.FILE_LOG_PROCESSING_STARTED(:file_id,:records_in_file,:digest);
               END;
         });

         $csr->bind_param(':records_in_file', $self->{file}->records_in_file() );
         $csr->bind_param(':file_id', $self->{file}->file_id() );
         $csr->bind_param(':digest', $self->{file}->digest() );

         $csr->bind_param_inout(':load_id', \$self->{load_id} , 1);

         $csr->execute;

         return $self->{load_id};

}

sub _check_known_file_type {
	my $self = shift;	
	
        if ( $self->{file}->file_type() ) {
           return 'SUCCESS'
	} else {
           my $csr = $self->{dbh}->prepare(q{
                    BEGIN
                        PKG_FILE_FEED.FILE_LOG_UNKNOWN_FILE_TYPE(:load_id);
                    END;
                });

        	$csr->bind_param(':load_id', $self->{load_id} );
        	$csr->execute;
        	$self->{logger}->WriteLog('ERROR', $self->{file}->file_name() . ' : File type is NULL');

        	die "Unknow File Type";
       }
}

sub _check_empty_file {
        my $self = shift;

	if ( $self->{file}->records_in_file() ) {
        	return 'SUCCESS'
        } else {
           	my $csr = $self->{dbh}->prepare(q{
                    BEGIN
                        PKG_FILE_FEED.FILE_LOG_EMPTY_FILE(:load_id);
                    END;
                });

           	# The value of $test_num is _copied_ here
           	$csr->bind_param(":load_id", $self->{load_id});

           	$csr->execute;

           	$self->_writelog("ERROR", 'Fail - Loading failed because file is empty');

   	        die "Empty File";
        }
}


sub _extable {
	my $self = shift;
        my %load_result;

        $load_result{load_id} = $self->{load_id};
	$load_result{file_id} = $self->{file}->file_id();

        # Now calling database package to load data in external table

         $self->_writelog('INFO', 'Calling database package to load data into RAW area');
         my $csr = $self->{dbh}->prepare(q{
               BEGIN
                  :load_result := PKG_FILE_FEED.LOAD_DATA_FILE(:file_name,:file_type,:load_id);
               END;
         });

         $csr->bind_param(":file_name", $self->{file}->file_name() );
         $csr->bind_param(":file_type", $self->{file}->file_type() );
         $csr->bind_param(":load_id", $self->{load_id});


         $csr->bind_param_inout(":load_result", \$load_result{load_result},1);

         $csr->execute();

         if ( $load_result{load_result} eq "FAIL") {
            die "Load from file to RAW failed";
         }
         
         $self->_writelog('INFO', 'RAW Load result is ' . $load_result{load_result});
         return \%load_result;
}

sub _writelog {
	my $self = shift;
	my $category = shift;
	my $msg = shift;

        $self->{logger}->WriteLog($category, $self->{file}->file_name() . ' : ' . $msg,'LoadData_ext.pm' );

}

1;
