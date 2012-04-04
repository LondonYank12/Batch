package Util;

use strict;
use POSIX;
use Time::Local;
use Date::Manip;
use Date::Calc qw(Add_Delta_Days);



sub getDeltaDate
{
	my $class = shift;
	my $date = shift;
	my $offset = shift;


	my @tm = localtime($date);
	#print "Util::getDeltaDate, offset: $offset, tm: @tm\n";

	(my $y, my $m, my $d) = Add_Delta_Days($tm[5] + 1900, $tm[4] + 1, $tm[3], $offset);
	#print "Util::getDeltaDate, y = $y, m = $m, d = $d\n";
	$tm[5] = $y - 1900;
	$tm[4] = $m - 1;
	$tm[3] = $d;
	my $new_date = timelocal($tm[0], $tm[1], $tm[2], $tm[3], $tm[4], $tm[5]);

	return $new_date;


} # end getDeltaDate



sub getWeekday
{
	my $class = shift;
	my $date = shift;

	my $weekday;
	($weekday) = (localtime($date))[6];

	return $weekday;

} # end getWeekday

sub getFormattedDate
{
	my $class = shift;
	my $date = shift;
	my $format_str = shift;

	my $date_stamp = strftime($format_str, localtime($date));

	#print "Util::getFormattedDate, date: $date_stamp\n";

	return $date_stamp;

} # end getFormattedDate


sub getParsedFormattedDate
{
	my $class = shift;
	my $date_str = shift;
	my $format_str = shift;

	#print "getParsedFormattedDate: date_str: \'$date_str\', format_str: \'$format_str\'\n";
	$format_str =~ s/%Y/%YYY/g;

	my $Y = $class->getValue($date_str, $format_str, "%Y");
	my $y = $class->getValue($date_str, $format_str, "%y");
	my $m = $class->getValue($date_str, $format_str, "%m");
	my $d = $class->getValue($date_str, $format_str, "%d");

	my $date;

	if (defined($Y)) {
		$date = $Y;
	}
	elsif (defined($y)) {
		$date = $y;
	}
	else {
		die "no Year defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	if (defined($m)) {
		$date = $date.$m;
	} else {
		die "no Month defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	if (defined($d)) {
		$date = $date.$d;
	} else {
		die "no Day defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	#print "getParsedFormattedDate: date: $date\n";
	return $date;
}



sub getParsedDate
{
	my $class = shift;
	my $date_str = shift;
	my $format_str = shift;


	if (!defined($date_str)) {
		return undef;
	} # endif
	#print "getParsedDate: date_str: \'$date_str\', format_str: \'$format_str\'\n";
	$format_str =~ s/%Y/%YYY/g;

	my $Y = $class->getValue($date_str, $format_str, "%Y");
	my $y = $class->getValue($date_str, $format_str, "%y");
	my $m = $class->getValue($date_str, $format_str, "%m");
	my $d = $class->getValue($date_str, $format_str, "%d");

	my $date;
	my $year;

	if (defined($Y)) {
		$date = $Y;
		$year = $Y;
	}
	elsif (defined($y)) {
		$date = $y;
		$year = $y;
	}
	else {
		die "no Year defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	if (defined($m)) {
		$date = $date.$m;
	} else {
		die "no Month defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	if (defined($d)) {
		$date = $date.$d;
	} else {
		die "no Day defined in file format, date_string: \'$date_str\', format_string: \'$format_str\'";
	}

	#print "getParsedDate: date: $date\n";

	my $time = timelocal(0, 0, 0, $d, $m - 1, $year - 1900);

	#print "getParsedDate: time: $time\n";

	return $time;
}



sub getValue
{
	my $class = shift;
	my $date_str = shift;
	my $format = shift;
	my $token = shift;

	#print "LoadProperties::getValue: date_str: $date_str, format $format, token $token\n";

	my $i = index($format, $token);
	#print "LoadProperties::getValue: index: $i\n";

	if ($i < 0) { # not found
		return undef;
	}

	my $len = length($token);
	# %Y 4 digits
	if ($token eq "%Y") {
		$len = 4;
	}
	#print "token.length: $len\n";


	my $n = substr($date_str, $i, $len);
	if (!defined($n)) {
		return $n;
	} # endif
	if ($n =~ /\D/) { # non numeric
		return undef;
	} # endif
	#print "LoadProperties::substring: \'$n\'\n";
	if ($token eq "%y") {
		$n = $n + 2000;
	}
	#print "LoadProperties::result: $n\n";

	return $n;

}


sub getCRR_DATE
{
        my $self = shift;
	my $logger = shift;
	my $conf = shift;


        #print "GetAsOfDate: start\n";
        my $sql = "SELECT TO_CHAR(CRR_DATE, 'YYYYMMDD')
                FROM tbl_sys_control";

	my $dbh = Application->getDatabase($logger, $conf);

        my $sth = $dbh->prepare($sql)
                or die "Could not prepare $sql : ". $dbh->errstr;

        $sth->execute()
                or die "Could not execute $sql : " . $dbh->errstr;


        my $asOfDate;
        # Read the matching records and print them out          
        my @data;
        if (@data = $sth->fetchrow_array()) {
                $asOfDate = $data[0];
                #print "GetAsOfDate: $asOfDate\n";
        }

        $sth->finish();
        #if ($asOfDate == undef)
        unless ($asOfDate)
        {
                die "Could not extract CRR_DATE";
        }

	#print "Util::getCRR_DATE, crr_date: $asOfDate\n";

	my $date = $self->getParsedDate($asOfDate, "%Y%m%d");
        return $date;

} # end getCRR_DATE


1;
