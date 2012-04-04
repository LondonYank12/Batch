#!/usr/bin/ksh

if [ -z "$RUNENV" ] ||
   [ -z "$1" ] ||
   [ -z "$2" ]
then
  echo "Usage: $0 SID Serial#"
  echo "Please export RUNENV"
  exit 2
else
  echo "Running $0 $RUNENV $@"
fi

. $HOME/.explain_batch_profile
cd $EXPLAIN_HOME/bin

echo "You are about to kill an oracle session in $RUNENV. Do you want to proceed? [no] : \c"
read userinput

if [ "$userinput" != "yes" ] ||
   [ -z "$userinput" ]
then
  echo "Session was NOT killed"
  exit 1
else
  execute_sp2.pl -p "kill_session($1,$2)" 
fi

exit $? 


