#!perl

use warnings;
use strict;
use Getopt::Std;
use vars qw($opt_f $opt_n $opt_d $opt_h );

getopt (':f:n:dh');

if ( $opt_h ) {
	usage();
	exit 1;
}

unless ( $opt_f && $opt_n && $opt_d ) {
	usage();
	exit 1;
}

my $file = $opt_f;
my $allowed_delim = $opt_n;
my $delim = $opt_d;

open ( FH, "< $file") or die "could not open $file : $!";

while (<FH> ) {
	my @line = split $delim, $_;
	my $found_delim = $#line;

	if ($found_delim > $allowed_delim ) {
		print "$found_delim $. : $_";
	}
}

sub usage {
	print "$0 -f file_name -d delimiter -n allowed number of fields\n";
	print "\tThis script is useful to diagnose csv file loading issues.\n";
	print "\tIt will print out any lines which have more than the allowed number of delimiters\n";
}
