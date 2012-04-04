
use DateTime;

my $file_name = 'CEFSEUTRANSACTION_2007-12-09_99999.TXT' ;

$file_name =~ /CEFSEUTRANSACTION.*(\d{4})-(\d{2})-(\d{2}).*TXT/;
#$file_name =~ /(\d\d\d\d)-(\d\d)-(\d\d)/;

my $year = $1;
my $month = $2;
my $day = $3;

my $dt = new DateTime( year=> $year, month=> $month, day=> $day);

print $dt->strftime('%d-%b-%Y');
