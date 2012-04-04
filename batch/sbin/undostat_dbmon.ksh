#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh undostat.sql $@
exit $?
