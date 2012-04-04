#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh batchrun.sql $@
exit $?
