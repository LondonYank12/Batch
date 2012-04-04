#!/bin/ksh
#---------------------------------------------------
# PURPOSE: Execute trusted SQL script in SQL*Plus
#          Examples: session.sql, freespace.sql 
# AUTHOR:  Björn Martensson (martenbj)
# DATE:    25.02.2004
#---------------------------------------------------

# check arguments
if [ -z $1 ]
then
  echo "Usage: $0 script [sql args]"
  exit 2
else
  script=$1
fi

# remove first user argument 
shift

# verify that script is trusted 
trusted=no

for file in `cat $EXPLAIN_HOME/conf/trustedsql/trustedsql`  
do
  if [[ $file = $script ]]
   then
    trusted=yes
    break
  fi 
done

if [[ $trusted = "no" ]]
then 
 echo "$script is not a trusted script" 
 exit 1
fi 

# declare and set variables
ora_sid=$EXPLAIN_BATCH_ORACLE_SID
ora_usr=$EXPLAIN_BATCH_ORACLE_UID
ora_pwd=$EXPLAIN_BATCH_ORACLE_PWD
basedir=$EXPLAIN_HOME/conf/trustedsql

echo "Connecting as $ora_usr@$ora_sid"
echo "Executing $basedir/$script"
date

# launch sql*plus silently and execute script
$ORACLE_HOME/bin/sqlplus -s $ora_usr/$ora_pwd@$ora_sid << EOF
whenever sqlerror exit failure rollback
whenever oserror exit failure rollback
set verify off

@$basedir/$script $@

exit
EOF

if (( $? != 0 ))
then
  echo "Error while executing $basedir/$script"
  exit 1
else
  exit 0
fi
