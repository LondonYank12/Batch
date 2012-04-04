package LoadData;

use strict;
use warnings;
use DBI;

use Application;
use FileType;
use Logger;

use LoadData_sqlldr;
use LoadData_oa;
use LoadData_ext;

sub new {
	my $class = shift;
	my %attr = @_;
	my $self = {};

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
		my $app = new Application;
		$self->{dbh} = $app->getExplainDatabase();
	}

	if ( $attr{LOGGER} ) {
		$self->{logger} = $attr{LOGGER};
	} else {
		$self->{logger} = new Logger(system_name=>'LoadData', log_root=>$ENV{EXPLAIN_DATA});
	}

	bless $self, $class;

	return $self;
}

sub _move_file {
   my $move_from = shift;
   my $move_to = shift;

   rename($move_from, $move_to)
        or die "Could not rename file : $!";
}

sub rename_and_move_associated_files {
   my $self = shift;
   my %attr = @_;
   # check out whether we need to create a file in associated directory
   # or file will be created in log directory

   my $associated_file_dir = $attr{ASSOCIATED_FILES_DIR};
   my $load_id = $attr{LOAD_ID};
   my $log_dir = $attr{LOG_DIR};
   my $move_from;
   my $move_to;
   opendir(DIR, $associated_file_dir);
   my @files = grep !/^\.\.?$/, readdir(DIR);
   closedir(DIR);

   foreach my $eachfile (@files) {
        my $file_extension_position=index $eachfile,".";
        my $original_file_extension_position=index $self->{file}->file_name() ,".";

        my $file_name_without_extension=substr($eachfile,0,$file_extension_position);
        my $original_file_name_without_extension=substr($self->{file}->file_name() ,0,$original_file_extension_position);

        my $file_extension=substr($eachfile,$file_extension_position);

        if ($file_name_without_extension eq $self->{file}->file_type() ) {

           $move_from=$associated_file_dir.$eachfile;

           $move_to= $log_dir.$original_file_name_without_extension.'_'.$load_id.$file_extension;
           _move_file($move_from,$move_to);
           $self->{logger}->WriteLog('INFO', $self->{file}->file_name() . ' : Associated file '.$move_from. ' has been moved to '. $move_to.' directory');
        }
    } #  end foreach

}

sub LoadData {
	my $self = shift;		

	my $ldr;
	my $load_method = $self->{file}->GetLoadMethodType();
	my $result_hashref;

	if ( $load_method eq 'SQLLDR' ) {

		$ldr = new LoadData_sqlldr( FILE=>$self->{file},
					   LOGGER=>$self->{logger},
					   DBH=> $self->{dbh},
					   DEBUG=>$self->{debug} );


		$result_hashref = $ldr->LoadData();


	}
	elsif ( $load_method eq 'OA' ) {

		$ldr = new LoadData_oa( DBH=> $self->{dbh},
					LOGGER=>$self->{logger} );

		my $ret = $ldr->LoadFile( $self->{file}->fully_qualified_file_name() );

		$result_hashref = {load_id=>undef, load_result=>$ret};	

	}
	elsif ( $load_method eq 'EXT' ) {

		$ldr = new LoadData_ext( FILE=>$self->{file},
					 LOGGER=>$self->{logger},
					 DBH=> $self->{dbh},
					 DEBUG=>$self->{debug} );

		$result_hashref = $ldr->LoadData();

	}
	else {
		die "'$load_method' is not a valid Load Method\n";
	}


	return $result_hashref;
}
1;
