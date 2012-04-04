#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh trace.sql $@
exit $?
