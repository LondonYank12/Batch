package FileType;

use strict;
use warnings;

use DBI;

use Application;
use Logger;

my $data_root;

sub new
{
	my $class = shift;
	my %attr = @_;
	my $self = {};

	bless $self, $class;

	$self->{debug} = $attr{DEBUG};

	$self->{FILE_TYPE} = $attr{FILE_TYPE};

	my $app = new Application;

	if ( $attr{DBH} ) {
		$self->{DBH} = $attr{DBH};
	} else {
		$self->{DBH} = $app->getExplainDatabase();
	}
	
	if ( $attr{LOGGER} ) {
		$self->{logger} = $attr{LOGGER};
	} else {
		$self->{logger} = new Logger( DBH=>$self->{DBH},
				      log_root=>$ENV{EXPLAIN_LOG},
				      system_name=>'FileType');
	}

	$self->_initialize();

	return $self;

}

sub _initialize {
	my $self = shift;

	$data_root = $ENV{EXPLAIN_DATA};

	if ( $self->{FILE_TYPE} ) {
		my $sth = $self->{DBH}->prepare(qq{SELECT * FROM tbl_file_type WHERE UPPER(file_type) = UPPER(?)});
		$sth->execute($self->{FILE_TYPE}); 

		$self->{ft_rec} = $sth->fetchrow_hashref();
		$sth->finish;

		die "Unable to lookup $self->{FILE_TYPE} in database.\n" unless ( $self->{ft_rec} );
	}
}

sub file_type {
	my $self = shift;
	return $self->{ft_rec}->{FILE_TYPE};
}

sub FileSuffix {
	my $self = shift;
	return $self->{ft_rec}->{FILE_SUFFIX};
}

sub FilePrefix {
	my $self = shift;
	return $self->{ft_rec}->{FILE_PREFIX};
}

sub LoadMethodType {
	my $self = shift;
	return $self->{ft_rec}->{LOAD_METHOD_TYPE};
}

sub file_layout {
	my $self = shift;
	return $self->{ft_rec}->{FILE_LAYOUT};
}

sub RawTable {
	my $self = shift;
	return $self->{ft_rec}->{RAW_TABLE};
}

sub HeaderCount {
	my $self = shift;
	return $self->{ft_rec}->{FILE_HEADER_COUNT};
}

sub FooterCount {
	my $self = shift;
	return $self->{ft_rec}->{FILE_FOOTER_COUNT};
}

sub FieldDelimiter {
	my $self = shift;
	return $self->{ft_rec}->{FIELD_DELIMITER};
}

sub Client {
	my $self = shift;
	return $self->{ft_rec}->{CLIENT};
}
 
sub date_format {
	my $self = shift;

	return $self->{ft_rec}->{DATE_FORMAT};
}

sub crr_date_format {
	my $self = shift;

	return $self->{ft_rec}->{CRR_DATE_FORMAT};
}

sub raw_failure_tolerance {
	my $self = shift;

	return $self->{ft_rec}->{RAW_FAILURE_TOLERANCE};
}

sub load_failure_tolerance {
	my $self = shift;

	return $self->{ft_rec}->{LOAD_FAILURE_TOLERANCE};
}

sub asi_file_type {
	my $self = shift;

	return $self->{ft_rec}->{ASI_FILE_TYPE};
}

sub send_method {
	my $self = shift;

	return $self->{ft_rec}->{SEND_METHOD};
}

sub GetFileTypeRec {
	my $self = shift;

	return $self->{ft_rec};
}

sub GetFileTypeRecs {
	my $self = shift;
	my $file_type = shift;

	my $ft_props = $self->{DBH}->selectall_hashref('SELECT * FROM tbl_file_type', 'FILE_TYPE');

	return $ft_props;
}

sub DESTROY {
}
1;
