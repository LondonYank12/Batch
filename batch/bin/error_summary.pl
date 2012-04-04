#!perl -w

use strict;

use lib "$ENV{EXPLAIN_HOME}/perlib";
use lib "$ENV{EXPLAIN_HOME}/conf";

use Conf qw( %conf );

use Logger;
use MIME::Lite;
use Env;

use Date::Manip qw(UnixDate Date_Init);
use POSIX;

#
# Author - Anuj Parashar
# Version 1.0
# Change history:
# Version    Date      Who         Description
# 1.0        21.02.07  parashan    Initial version. 
#

# email address, help, subject, no send no results, path
use vars qw($opt_a $opt_h $opt_s $opt_n $opt_p);
use Getopt::Std;
use Sys::Hostname;
use Application;
use Util;

my $dbh_explain = new Application->getExplainDatabase();

my $logger = new Logger(system_name=>'error_summary', log_root=>"$ENV{EXPLAIN_LOG}/");

my $from_address = "gcomp\@ubs.com";
my @to_address = "$ENV{EXPLAIN_BATCH_NOTIFICATION_EMAIL}";
my $date_stamp = strftime("%y%m%d", localtime());

my $subject = "Batch Error Summary for $date_stamp";

# Defaults to log file path
#
my $logfile_path = "$ENV{EXPLAIN_LOG}/*$date_stamp.log";

#
# Handle Arguments
#
my $argc = $#ARGV + 1;
my $no_send_if_no_results = undef;
if (@ARGV) { # args
	getopts('a:hnp:s:');
	if (defined($opt_a)) {
		#print "-a set, address: $opt_a\n";
		@to_address = ($opt_a);
	} # endif
	if (defined($opt_h)) {
		#print "-h set\n";
		usage();
		exit 1;
	} # endif
	if (defined($opt_n)) {
		#print "-n set\n";
		$no_send_if_no_results = 1;
	} # endif
	if (defined($opt_p)) {
		#print "-p set, path: $opt_p\n";
		$logfile_path = $opt_p;
	} # endif
	if (defined($opt_s)) {
	#if (defined($opt_s) && $opt_s != 1) {
		#print "-s set, subject: $opt_s\n";
		$subject = $opt_s;
	} # endif
} # endif

my @body;

$logger->WriteLog('INFO', "error_summary started");

if (defined($opt_a)) {
	$logger->WriteLog('INFO', "-a option set, email address: \'$opt_a\'");
} # endif
if (defined($opt_n)) {
	$logger->WriteLog('INFO', "-n \'no_send_if_no_results\' option set");
	#print "-n set\n";
} # endif
if (defined($opt_p)) {
	$logger->WriteLog('INFO', "-p option set, path: \'$opt_p\'");
} # endif
if (defined($opt_s)) {
	$logger->WriteLog('INFO', "-s option set, subject: \'$opt_s\'");
} # endif

my $index=0;
my $body_index=0;
my $no_results_found=0;

$body[$body_index++] = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Frameset//EN\" \"http://www.w3.org/TR/REC-html40/frameset.dtd\">\n";
$body[$body_index++] = "<HTML>\n";
$body[$body_index++] = "<head>\n";
$body[$body_index++] = "</head>\n";
$body[$body_index++] = "<body bgcolor=#EBE8A1>\n";

addErrorSummaryTable(\@body, $logger, "Explain");

addErrorSummaryTable(\@body, $logger, "Gpas");

$body_index = $#body + 1;
$body[$body_index++] = "</body>\n";
$body[$body_index++] = "</HTML>\n";

unless (!$no_results_found && $no_send_if_no_results) {
	my $mime_mailer = MIME::Lite->new(
		From => $from_address,
		To => @to_address,
		Subject => $subject,
		Type => 'text/html',
		Data => \@body
	        );

	$mime_mailer->send()
	or die "Could not send email.\n";
} # endif

$logger->WriteLog('OK', "error_summary finished");

sub GetEnvString
{
	my $envstr;
	my $runenv = "n/a";
	if (defined($ENV{RUNENV})) {
		$runenv = $ENV{RUNENV};
	} # endif
	my $hostname = hostname();
	$envstr = "RUNENV = \'$runenv\' on HOST \'$hostname\'";

	return $envstr;

} # GetEnvString

sub addErrorSummaryTable {
	my $body = $_[0]; # reference to body array
	my $logger = $_[1]; # reference to logger
	my $source = $_[2]; 
	
        my @data;
	my @querydata;
        my $crr_date;
        my $sql=""; 
  eval { my $func = $dbh_explain->prepare
         (q { BEGIN
                  :crr_date := sf_get_crr_date;
              END; 
            } 
         );
         $func->bind_param_inout(":crr_date", \$crr_date, 19);
         $func->execute()
         or die "Execution of function failed:" . $dbh_explain->errstr,"\n"; 
       };
    
  if ($source eq "Explain") {
  $sql = "SELECT TO_CHAR(l.log_timestamp,'YYYY-MM-DD HH24:MI:SS') touch_dt,
	            NVL(bp.autosys_box_name,'NA') box_name, 
	            NVL(bp.autosys_job_name,'NA') job_name, 
	            bp.job_type object_type,
	            l.message message_text
  	       FROM gc_external.tbl_batch_process bp,
	            gc_external.vw_explain_log l
 	      WHERE l.os_pid_id = bp.os_pid
                AND l.log_type IN ('ERROR','FATAL')
                AND bp.crr_date = l.crr_date
                AND bp.crr_date = SF_GET_CRR_DATE
                AND bp.job_type <> 'SP_GPAS'
              ORDER BY l.log_timestamp ASC";
  }
  
  if ($source eq "Gpas") {
  $sql = "SELECT TO_CHAR(l.log_timestamp,'YYYY-MM-DD HH24:MI:SS') touch_dt,
	            NVL(bp.autosys_box_name,'NA') box_name, 
	            NVL(bp.autosys_job_name,'NA') job_name, 
	            bp.job_type object_type,
	            l.message message_text
  	       FROM gc_external.tbl_batch_process bp,
	            gc_external.vw_explain_log l
 	      WHERE l.os_pid_id = bp.os_pid
                AND l.log_type IN ('ERROR','FATAL')
                AND bp.crr_date = l.crr_date
                AND bp.crr_date = SF_GET_CRR_DATE
                AND bp.job_type = 'SP_GPAS'
              ORDER BY l.log_timestamp ASC";
  }     
             
	my $sth = $dbh_explain->prepare($sql)
		or die "Could not prepare $sql : " . $dbh_explain->errstr;

	$sth->execute()
		or die "Could not execute $sql : " . $dbh_explain->errstr;

	my $body_index=$#{$body} + 1;

  my $no_results_found = 0;
  
  if ($source eq "Explain") {
		$body->[$body_index++] = "<p><u><b>Explain Error Table ($ENV{EXPLAIN_BATCH_ORACLE_SID}) for CRR date $crr_date</b></u></p>\n";
  }
  
  if ($source eq "Gpas") {
		$body->[$body_index++] = "<p><u><b>GPAS Error Table ($ENV{EXPLAIN_BATCH_ORACLE_GPAS_EXTRACT_SID}) for CRR date $crr_date</b></u></p>\n";
  }
  
	$body->[$body_index++] = "<table border=\"1\">\n";

	$body->[$body_index++] = "<COLGROUP>\n";
	$body->[$body_index++] = "<COL width=\"100\">\n";
        $body->[$body_index++] = "<COL width=\"100\">\n";
        $body->[$body_index++] = "<COL width=\"80\">\n";
        $body->[$body_index++] = "<COL width=\"80\">\n";
	$body->[$body_index++] = "<COL>\n";
	$body->[$body_index++] = "</COLGROUP>\n";

	$body->[$body_index++] = "<TR>\n";
	$body->[$body_index++] = "<TH>Time Stamp</TH>\n";
	$body->[$body_index++] = "<TH>Autosys Box Name</TH>\n";
	$body->[$body_index++] = "<TH>Autosys Job Name</TH>\n";
	$body->[$body_index++] = "<TH>Object Type</TH>\n";
	$body->[$body_index++] = "<TH>Message Text</TH>\n";
	$body->[$body_index++] = "</TR>\n";

	while ( my $row = $sth->fetchrow_hashref() ) {

		$no_results_found++;
		$body->[$body_index++] = "<TR>\n";
		$body->[$body_index++] = "<TD>" . $row->{TOUCH_DT} . "</TD>\n";
		$body->[$body_index++] = "<TD>" . $row->{BOX_NAME} . "</TD>\n";
		$body->[$body_index++] = "<TD>" . $row->{JOB_NAME} . "</TD>\n";
		$body->[$body_index++] = "<TD>" . $row->{OBJECT_TYPE} . "</TD>\n";
		$body->[$body_index++] = "<TD>" . $row->{MESSAGE_TEXT} . "</TD>\n";
		$body->[$body_index++] = "</TR>\n";
	}
	$body->[$body_index++] = "</table>\n";

	$sth->finish();
}

sub usage {
	# system_of _record, client, help/usage
        print "usage: $0 [-a <e-mail address>] [-h(elp)] [-n(o send if no results)] [-p <logfile path>] [-s <subject>]\n";
} # end usage

sub DESTORY {
	if ( defined($dbh_explain) ) {
		$dbh_explain->finish();
	}
} # end DESTROY
