#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh rollbackseg.sql $@
exit $?
