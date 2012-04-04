set linesize 200
set pagesize 100
set wrap off

SELECT substr(ses.sid,0,5) "SID",
       ses.serial# "Serial#", 
       substr(ses.username,1,20) "Username", 
       substr(ses.osuser,0,12) "OS User",          
       ses.status "Status",
       substr(sql.sql_text,1,150) "SQL Text"
  FROM v$session ses,
       v$open_cursor sql
 WHERE sql.saddr = ses.saddr
   AND ses.audsid <> userenv('SESSIONID')
   AND ses.serial# <> 1
 ORDER BY ses.status, substr(ses.sid,0,5), ses.serial# DESC
/
