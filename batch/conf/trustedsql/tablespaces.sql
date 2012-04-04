set linesize 150
set pagesize 100

SELECT 	t.tablespace_name "Tablespace",
        DECODE(t.status, 'ONLINE',  
        t.status, NLS_INITCAP(t.status)) "Status ",
	TO_CHAR(tsa.bytes / 1024, '999G999G990') "Size (KB)", 
        TO_CHAR((tsa.bytes - DECODE(tsf.bytes,
	NULL, 0, tsf.bytes)) / 1024, '99G999G990') "Used (KB)", 
        TO_CHAR(DECODE(tsf.bytes, NULL, 0,
	tsf.bytes) / 1024, '99G999G990') "Free (KB)", 
        TO_CHAR((1 - DECODE(tsf.bytes, NULL, 0,	tsf.bytes) / tsa.bytes) * 100, '990') "% Used" 
   FROM sys.dba_tablespaces t,
	sys.sm$ts_avail tsa, 
        sys.sm$ts_free tsf 
  WHERE t.tablespace_name = tsa.tablespace_name 
    AND t.tablespace_name = tsf.tablespace_name (+)
  ORDER BY t.tablespace_name;

