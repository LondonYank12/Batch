set linesize 150

select substr(a.SEGMENT_NAME,1,15) "RBSG Name", substr(a.TABLESPACE_NAME,1,20) "Rollback Tablespace", 
	substr(a.STATUS,1,10) "Status",
        substr(a.MIN_EXTENTS,1,4) "Min Ext", substr(a.MAX_EXTENTS,1,4) "Max Ext", 
	substr(a.INITIAL_EXTENT,1,10) "Init Ext", substr(a.NEXT_EXTENT,1,10) "Next Ext", 
	substr(b.OPTSIZE,1,10) "Optimal"
  from sys.dba_rollback_segs a, v$rollstat b
 where a.SEGMENT_ID = b.usn;

