#!/bin/ksh
$EXPLAIN_HOME/sbin/runsql.ksh redofiles.sql $@
exit $?
