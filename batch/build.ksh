#!/usr/bin/ksh

# check arguments
if [ -z "$1" ] 
then
  echo "Usage: $0 [dist]"
  exit 2
else
  echo "Running $0 $@"
fi

# Set ANT_OPTS to increase memory for VM
export ANT_OPTS=-Xmx128m

# Set ANT_HOME correctly
export ANT_HOME=/sbcimp/run/pd/jakarta-ant/1.5

export VOB_DIR=/vobs/ZUR_GCOMP_EXPLAIN

OS=`/bin/uname -s`
export JAVA_HOME=/sbcimp/run/tp/sun/jdk/v1.3.1_09

$ANT_HOME/bin/ant $*

exit $?

