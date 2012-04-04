#!/sbcimp/run/pd/perl/prod/bin/perl

# dfk.pl
# by Brian Peasland
# 26 February 2003
# This program was written to make a better "df -k" command. The
# current command produces a listing with columns of varying 
# width, and the disk devices are unsorted. This perl script will
# execute the "df -k" command and make the output more readable.
#
# To use this script, it is probably best to make an alias which
# invokes this script. My alias in my .cshrc looks like:
#
#     alias dfk "$HOME/edc/scripts/dfk.pl"
#
# Feel free to make changes to this program to suit your needs.
#
# Initialize Variables
# 

@vol_list = ();               # Array to hold list of volumes
@head_list = qw(Volume Kbytes Used Avail Capacity); # Array to hold header information

#Set up lengths of columns and format mask for output
#If the column needs more room (for instance, you just added a 1TB volume), then
#just increase the variable below and all formatting will hold. 
$vol_len = 20;
$byte_len = 11;
$cap_len = 8;
$fs_len = 0;
#All output uses this format mask. This makes life nice and formatted for 
#better readability.
$format_mask = "%-".$vol_len."s %".$byte_len."s  %".$byte_len."s  %".$byte_len."s %"
                .$cap_len."s %-".$fs_len."s\n";

#
# Get output from "df -k" command
#

$loop_ctr = 0;
foreach $_ (`df -lk`) {
   $loop_ctr = $loop_ctr+1;
   #Skip the first line of header information
   if ($loop_ctr > 1) {
      #parse out fields from input stream
      ($filesystem,$kbytes,$used,$avail,$capacity,$volume) = split (/ +/,$_);
      chomp $volume;
      #add volume to list of volumes
      @vol_list = (@vol_list, $volume); 
      #add information to appropriate hashes
      #$fs_hash{$volume} = $filesystem;
      $kb_hash{$volume} = comma_int($kbytes);   #Change output to numbers with commas
      $used_hash{$volume} = comma_int($used);   #Change output to numbers with commas
      $avail_hash{$volume} = comma_int($avail); #Change output to numbers with commas
      $cap_hash{$volume} = $capacity; 
      } #if
   } #foreach

#
# Sort the list of volumes
#
@vol_list = sort(@vol_list);

#
# Print output
#
printf "$format_mask",@head_list;
printf "$format_mask","-" x $vol_len,"-" x $byte_len,"-" x $byte_len,
                      "-" x $byte_len,"-" x $cap_len;
foreach $volume (@vol_list) {
   printf "$format_mask",$volume,$kb_hash{$volume},$used_hash{$volume},
                             $avail_hash{$volume},$cap_hash{$volume};
   } #foreach

#
# Subroutines
#
sub comma_int  {
   #
   # Subroutine: comma_int
   #    Purpose: To change a number values into a string
   #             with commas seperating groups of three
   #             numbers. For instance, if the input is
   #             '123456789' then the output will be
   #             '123,456,789'.
   #

   $in_string = $_[0];    #get number passed to subroutine
   $loop_count = 0;       #loop counter
   $out_string = "";      #output string will be built and returned to caller

   while( $in_string ne "" ) {    #repeat until no more chars to process
      $loop_count++;
      #Insert comma every third character
      if ( $loop_count%3 eq 1 && $loop_count ne 1 ) {
         $out_string = "," . $out_string;
         } #if
      #add last char to output and remove from input
      $out_string = chop($in_string) . $out_string; 
   } #while
   return $out_string;
} #comma_int
