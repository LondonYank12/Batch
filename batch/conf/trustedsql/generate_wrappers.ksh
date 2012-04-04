#!/bin/ksh
#------------------------------------------------------------------
# generate the shell script wrappers for the sql scripts
#------------------------------------------------------------------

if [ -z $1 ]
then
  echo "Usage: $0 file-suffix (e.g. dbmon) [script]"
  exit 2
else 
  suffix=_$1.ksh
  if [ -z $2 ]
  then
    script=.sql
  else
    script=$2
  fi
fi

echo "Generating..."

for file in `cat trustedsql | grep $script` 
do
 echo "  `echo $file | cut -d"." -f1`$suffix"
 echo "#!/bin/ksh" > `echo $file | cut -d"." -f1`$suffix
 echo ./runsql.ksh $file >> `echo $file | cut -d"." -f1`$suffix "\$@"
 echo "exit \$?"  >> `echo $file | cut -d"." -f1`$suffix
 chmod 755 `echo $file | cut -d"." -f1`$suffix
done

exit 0
