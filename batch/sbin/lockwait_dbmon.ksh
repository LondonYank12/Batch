#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh lockwait.sql $@
exit $?
