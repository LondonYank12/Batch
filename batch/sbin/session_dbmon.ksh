#!/bin/ksh

usage() (
     print session_dbmon.ksh - lists current database sessions on Explain or Gpas
     print "Usage: session_dbmon.ksh [-e] [-g]"
     print "  -e lists sessions on Explain"
     print "  -g lists sessions on Gpas"
)

while getopts "egh" opt
do
case $opt in
  e)
     target='EXPLAIN'
     ;;
  g)
     target='GPAS'
     ;;
  h)
     usage
     exit 1
     ;;
  esac
done

shift $(($OPTIND -1))

if [[ $target = '' ]]
then
   usage
fi

if [[ $target = 'EXPLAIN' ]]
then
   $EXPLAIN_HOME/sbin/runsql.ksh session.sql $@
fi

if [[ $target = 'GPAS' ]]
then
   $EXPLAIN_HOME/sbin/runsql_gpas.ksh session.sql $@
fi

exit $?
