package BatchProcessUtil;
#
# BatchProcessUtil.pm
#
# Purpose:
# Functions to set and check batch-process-entries
#
# Author: Stephan Hein
#
#
use strict;
use Sys::Hostname;
use DBI;

use MicroMuse;
use Application;

my $jobid;
my $hostname = hostname();
my $microMuseFailure=0;


sub new {

	my $class = shift;
	my %attr = @_;
	my $self = {};

	bless $self, $class;

	$self->{debug} = $attr{DEBUG};

	if ( $attr{DBH} ) {
		$self->{dbh} = $attr{DBH};
	} else {
		my $app = new Application;
		$self->{dbh} = $app->getExplainDatabase();
	}

	if ( $attr{logger} ) {
		# for backward compat with scripts that use old style
		# instantiation 
		$attr{LOGGER} = $attr{logger};
	}
	
	if ( $attr{LOGGER} ) {
		$self->{logger} = $attr{LOGGER};
	} else {
		$self->{logger} = new Logger(system_name=>'BatchProcessUtil', log_root=>$ENV{EXPLAIN_DATA});
	}

        return $self;

} # end new

sub BeginJob
{
        my $self = shift;
        my $job_name = shift;
        my $job_type = shift;
        my $proc_name = shift;
        my $call_desc = shift;

	my $job_id = $self->GetNewJobId();

	my $process = $job_name . '_' . $job_id;

	my $crr_date = $self->GetAsOfDate();

	my $as_box_name = $ENV{__box_name};
	my $as_job_name = $ENV{AUTO_JOB_NAME};

        my $sql = "INSERT into tbl_batch_process (job_id, process, autosys_box_name, autosys_job_name, job_name, status, startdt, touchdt, crr_date, job_type, proc_name, call_desc, os_pid, hostname) VALUES (?, ?, ?, ?, ?, 'RUNNING', SYSDATE, SYSDATE, TO_DATE(?, 'YYYYMMDD'), ?, ?, ?, ?, ?)";

	my @bind_params = ($job_id, $process, $as_box_name, $as_job_name, $job_name, $crr_date, $job_type, $proc_name, $call_desc, $$, $hostname);

        my $sth = $self->{dbh}->prepare($sql)
                or die "Could not prepare $sql : ". $self->{dbh}->errstr;

        $sth->execute(@bind_params)
                or die "Could not execute $sql : " . $self->{dbh}->errstr;


        $sth->finish();

	#
	# log job event to MicroMuse
	#
	if (!$microMuseFailure) {

		eval {
			if (MicroMuse->IsEnabled()) {
				#print "BatchProcessUtil::BeginJob, MicroMuse enabled\n";
				MicroMuse->GetObject()->logJob('BEGIN JOB: ',
							$job_id,
							$process,
							$job_name,
							$crr_date,
							$job_type,
							$proc_name,
							$call_desc,
							$$,
							$hostname);
			} # endif
		}; # eval
		if ($@) {
			$microMuseFailure = 1;
			$self->{logger}->WriteLog("ERROR", "BatchProcessUtil::BeginJob, MicroMuse failed: $@");
		} # endif

	} # endif

	return $job_id;

} # end BeginJob

sub EndJob
{
        my $self = shift;
        my $job_id = shift;
        my $result = shift;

	if (!defined($job_id)) {
		return;
	} # endif

        my $crr_date = $self->GetAsOfDate();
        my $sql = "UPDATE tbl_batch_process
                        SET status = 'ENDED',
                        result = ?,
                        touchdt = SYSDATE,
                        enddt = SYSDATE
                        WHERE job_id = ?";

	my @bind_params = ($result, $job_id);

        my $sth = $self->{dbh}->prepare($sql)
                or die "Could not prepare $sql : ". $self->{dbh}->errstr;

        $sth->execute(@bind_params)
                or die "Could not execute $sql : " . $self->{dbh}->errstr;

        $sth->finish();
	#
	# log job event to MicroMuse
	#

	if (!$microMuseFailure) {

		eval {


			if (MicroMuse->IsEnabled()) {
				my $rec = $self->GetJob($job_id);
				MicroMuse->GetObject()->logJob('END JOB: ',
						$rec->{job_id},
						$rec->{process},
						$rec->{job_name},
						$rec->{crr_date},
						$rec->{job_type},
						$rec->{proc_name},
						$rec->{call_desc},
						$rec->{os_pid},
						$rec->{hostname});
			} # endif
		}; # eval


		if ($@) {
			$microMuseFailure = 1;
			$self->{logger}->WriteLog("ERROR", "BatchProcessUtil::EndJob, MicroMuse failed: $@");
		} # endif

	} # endif

} # end EndJob


# used by check_explain.pl 
sub GetYesterdayDate()
{
	my $self = shift;
	#print "GetYesterdaysDate: start\n";
	my $sql = "SELECT TO_CHAR(SYSDATE - 1, 'YYYYMMDD')
		FROM dual";

	my $sth = $self->{dbh}->prepare($sql)
		or die "Could not prepare $sql : ". $self->{dbh}->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $self->{dbh}->errstr;


	my $yesterdayDate;
	# Read the matching records and print them out          
	if (my @data = $sth->fetchrow_array()) {
		$yesterdayDate = $data[0];
		#print "GetYesterdayDate: $yesterdayDate\n";
	}

	$sth->finish();
	#if ($yesterdayDate == undef)
	unless ($yesterdayDate)
	{
		die "Could not extract yesterdayDate";
	}

	return $yesterdayDate;

} # end GetYesterdayDate


sub GetDiskPercentage()
{
	my $self = shift;
	my $path = shift;

	my $cmd = "df -k $path";
        #print "cmd: $cmd\n";

        my @output = `$cmd`;
        my $rc = ($? >> 8);
        if ($rc) {
                return undef; # df failed
        }

	my $str = $output[1];

	# extract percentage value from df output
        if ($str =~ /(\d+%)/) {
		#print "regexp \'$1\' found\n";
		$1 =~ /(\d+)/;
		#print "final regexp \'$1\'\n";
		return $1;
	} # endif


	return undef; # regexp not found

} # end GetDiskPercentage()


sub GetJobId
{
	my $self = shift;
	my $jobid;
	my $sql = "select tbl_batch_process_seq.currval from dual";

	#print ": GetJobId, sql: \'$sql\'\n";

	my $sth = $self->{dbh}->prepare($sql)
		or die "Could not prepare $sql : ". $self->{dbh}->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $self->{dbh}->errstr;

	if (my @data = $sth->fetchrow_array()) {
		$jobid = $data[0];
	} # endif


	$sth->finish();

	return $jobid;

} # GetJobId


sub GetNewJobId
{
	my $self = shift;
	my $jobid;
	my $sql = "select tbl_batch_process_seq.nextval from dual";

	#print ": GetJobId, sql: \'$sql\'\n";

	my $sth = $self->{dbh}->prepare($sql)
		or die "Could not prepare $sql : ". $self->{dbh}->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $self->{dbh}->errstr;

	# Read the matching records and print them out
	if (my @data = $sth->fetchrow_array()) {
		$jobid = $data[0];
		#print "BatchProcessUtil::GetJobId: $jobid\n";

	} # endif


	$sth->finish();

	return $jobid;

} # GetNewJobId


sub GetJob
{
	my $self = shift;
	my $jobid = shift;
	my $job_data;

	my $sql = "select job_id, process, job_name, job_type, proc_name, call_desc, crr_date, status, result, rc, startdt, enddt, touchdt, os_pid, hostname from tbl_batch_process where job_id = $jobid";

	#print "BatchProcessUtil::GetJob, sql: \'$sql\'\n";

	my $sth = $self->{dbh}->prepare($sql)
		or die "Could not prepare $sql : ". $self->{dbh}->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $self->{dbh}->errstr;

	# Read the matching records and print them out
	if (my @data = $sth->fetchrow_array()) {
		$job_data->{job_id} = $data[0];
		$job_data->{process} = $data[1];
		$job_data->{job_name} = $data[2];
		$job_data->{job_type} = $data[3];
		$job_data->{proc_name} = $data[4];
		$job_data->{call_desc} = $data[5];
		$job_data->{crr_date} = $data[6];
		$job_data->{status} = $data[7];
		$job_data->{result} = $data[8];
		$job_data->{rc} = $data[9];
		$job_data->{startdt} = $data[10];
		$job_data->{enddt} = $data[11];
		$job_data->{touchdt} = $data[12];
		$job_data->{os_pid} = $data[13];
		$job_data->{hostname} = $data[14];
		#print "BatchProcessUtil::GetJobId: $jobid\n";

	} # endif


	$sth->finish();

	return $job_data;

} # GetJob


sub IsDeadlineReached
{
	my $self = shift;

	(my $sec,my $min,my $hour,my $mday,my $mon,my $year,my $wday,my $yday,my $isdst) = localtime(time);
	$year += 1900;
	$mon += 1;


	my $deadline = $self->GetDeadline();
	if (!$deadline) { # no deadline set
		return 0;
	} # endif

	$deadline =~ /(\w+):(\w+)/;
	#print "word: \'$1\'\n";
	#print "2. word: \'$2\'\n";
	my $deadline_hour = $1;
	my $deadline_min = $2;

	if (($hour > $deadline_hour) || (($hour == $deadline_hour) && ($min > $deadline_min))) {
		return 1;
	} # endif

	return 0;

} # IsDeadlineReached()


sub GetDeadline
{
	my $self = shift;
	unless ($ENV{EXPLAIN_BATCH_DEADLINE}) {
		$self->{logger}->WriteLog('WARN', "no DEADLINE ENV set\n");
		return "";

	} # end unless

	my $deadline = $ENV{EXPLAIN_BATCH_DEADLINE};

	return $deadline;

}

sub GetAsOfDate
{
	my $self = shift;
	my $date_format = shift;

	my $sql;

	if (defined($date_format)) {
		$sql = "SELECT TO_CHAR(CRR_DATE, \'$date_format\')
			FROM tbl_sys_control";
	} else {
		$sql = "SELECT TO_CHAR(CRR_DATE, 'YYYYMMDD')
			FROM tbl_sys_control";
	} # endif


	my $sth = $self->{dbh}->prepare($sql)
		or die "Could not prepare $sql : ". $self->{dbh}->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $self->{dbh}->errstr;


	my $asOfDate;
	# Read the matching records and print them out          
	if (my @data = $sth->fetchrow_array()) {
		$asOfDate = $data[0];
		#print "GetAsOfDate: $asOfDate\n";
	}

	$sth->finish();

	unless ($asOfDate) {
		die "Could not extract AsOfDate";
	}

	return $asOfDate;

} # end GetAsOfDate

sub DESTROY
{
	my $self = shift;

	# disconnect DB
	if (defined($self->{dbh})) {
		$self->{dbh}->disconnect();
	} # endif
}

1;
