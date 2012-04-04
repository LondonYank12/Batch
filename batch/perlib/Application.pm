package Application;

use strict;

use DBI;

my $dbh;

sub new
{
	my $class = shift;		# Class name
	my $self = {};
	bless $self, $class;
        
        #Explain
	$self->{oracle_explain_sid} = $ENV{EXPLAIN_BATCH_ORACLE_SID};
	$self->{oracle_explain_uid} = $ENV{EXPLAIN_BATCH_ORACLE_UID};
	$self->{oracle_explain_pwd} = $ENV{EXPLAIN_BATCH_ORACLE_PWD};

        #Gpas
        $self->{oracle_gpas_sid} = $ENV{GPAS_BATCH_ORACLE_SID};
        $self->{oracle_gpas_uid} = $ENV{GPAS_BATCH_ORACLE_UID};
        $self->{oracle_gpas_pwd} = $ENV{GPAS_BATCH_ORACLE_PWD};

        #Portal
        $self->{oracle_portal_sid} = $ENV{PORTAL_BATCH_ORACLE_SID};
        $self->{oracle_portal_uid} = $ENV{PORTAL_BATCH_ORACLE_UID};
        $self->{oracle_portal_pwd} = $ENV{PORTAL_BATCH_ORACLE_PWD};

	$self->{log_dir} = $ENV{EXPLAIN_LOG} . '/';
	$self->{data_dir} = $ENV{EXPLAIN_DATA} . '/';

	return $self;

} # end new


sub getExplainDatabase
{
	my $self = shift;

	if (!defined($dbh)) { # if not already assigned
		$dbh = DBI->connect("DBI:Oracle:" . $self->{oracle_explain_sid},$self->{oracle_explain_uid},$self->{oracle_explain_pwd}, {AutoCommit=>0, RaiseError=>0 })
		or die "Could not connect to $self->{oracle_explain_sid} as $self->{oracle_explain_uid} : $DBI::errstr";
	} # endif

	if ($ENV{EXPLAIN_BATCH_TRACE}) {
        	my $s = "BEGIN\n pkg_trace.set_level(pkg_trace.LEVEL_DEBUG)";
                my $sp = $dbh->prepare($s);
                $sp->execute;
	}

	return $dbh;

} # end getExplainDatabase

sub getExplainCredentials {
	my $self = shift;

	return $self->{oracle_explain_uid}. '/' . $self->{oracle_explain_pwd} . '@' . $self->{oracle_explain_sid};
}

sub getCredentials
{
       my $self = shift;
       my %attr = @_;

       if ( $attr{CLIENT})
       {
       		if ($attr{CLIENT} eq 'PORTAL')
       		{
			return $self->{oracle_portal_uid}. '/' . $self->{oracle_portal_pwd} . '@' . $self->{oracle_portal_sid};
       		}

       		if($attr{CLIENT} eq 'EXPLAIN')
       		{
                	return $self->{oracle_explain_uid}. '/' . $self->{oracle_explain_pwd} . '@' . $self->{oracle_explain_sid};
       		}

      		if($attr{CLIENT} eq 'GPAS')
       		{
                	return $self->{oracle_gpas_uid}. '/' . $self->{oracle_gpas_pwd} . '@' . $self->{oracle_gpas_sid};
       		}

                return $self->{oracle_explain_uid}. '/' . $self->{oracle_explain_pwd} . '@' . $self->{oracle_explain_sid};
       }
       else
       {
                return $self->{oracle_explain_uid}. '/' . $self->{oracle_explain_pwd} . '@' . $self->{oracle_explain_sid};
       }

        
}

sub getGpasDatabase
{
        my $self = shift;

        if (!defined($dbh)) { # if not already assigned
                $dbh = DBI->connect("DBI:Oracle:" . $self->{oracle_gpas_sid},$self->{oracle_gpas_uid},$self->{oracle_gpas_pwd}, {AutoCommit=>0, RaiseError=>0 })
                or die "Could not connect to $self->{oracle_gpas_sid} as $self->{oracle_gpas_uid} : $DBI::errstr";
        } # endif

        if ($ENV{EXPLAIN_BATCH_TRACE}) {
                my $s = "BEGIN\n pkg_trace.set_level(pkg_trace.LEVEL_DEBUG)";
                my $sp = $dbh->prepare($s);
                $sp->execute;
        }

        return $dbh;

} # end getGpasDatabase

sub getPortalDatabase
{
        my $self = shift;

        if (!defined($dbh)) { # if not already assigned
                $dbh = DBI->connect("DBI:Oracle:" . $self->{oracle_portal_sid},$self->{oracle_portal_uid},$self->{oracle_portal_pwd}, {AutoCommit=>0, RaiseError=>0 })
                or die "Could not connect to $self->{oracle_portal_sid} as $self->{oracle_portal_uid} : $DBI::errstr";
        } # endif

        if ($ENV{EXPLAIN_BATCH_TRACE}) {
                my $s = "BEGIN\n pkg_trace.set_level(pkg_trace.LEVEL_DEBUG)";
                my $sp = $dbh->prepare($s);
                $sp->execute;
        }

        return $dbh;

} # end getPortalDatabase


sub getDatabase
{
	my $self = shift;

        my $dbh = $self->getExplainDatabase;
        return $dbh;

} # end getDatabase

sub sigint_rule
{
	my $class = shift;

	#$SIG{INT} = 'DEFAULT';
	die "$0 got SIGINT Signal, PID = $$\n";

} # end sigint_rule


sub sigterm_rule
{
	my $class = shift;

	$SIG{TERM} = 'IGNORE';
	die "$0 got SIGTERM Signal, PID = $$\n";

} # end sigterm_rule


sub sighup_rule
{
	my $class = shift;

	#$SIG{HUP} = 'DEFAULT';
	die "$0 got SIGHUP Signal, PID = $$\n";

} # end sighup_rule

1;
