set linesize 200
set pagesize 100
set wrap off

SELECT substr(ses.sid,0,5) "SID",
       ses.serial# "Serial#", 
       substr(ses.username,1,20) "Username", 
       substr(ses.osuser,0,12) "OS User",          
       ses.status "Status",
       substr(sql.sql_text,1,85) "SQL Text"
  FROM v$session ses,
       v$sqlarea sql
 WHERE sql.hash_value = ses.sql_hash_value
   AND ses.audsid <> userenv('SESSIONID')
   AND sql.users_executing > 0
 ORDER BY ses.status, substr(ses.sid,1,5), ses.serial# DESC
/
