#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh dbinfo.sql $@
exit $?
