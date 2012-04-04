#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh batchstat.sql $@
exit $?
