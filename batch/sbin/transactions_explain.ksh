#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh transactions.sql $@
exit $?
