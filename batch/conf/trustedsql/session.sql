set linesize 150
set pagesize 100

select substr(global_name,0,32) "Instance",
       substr(banner,36,10) "Oracle Release" 
from global_name, v$version 
where rownum=1;

select   substr(si.SID,0,5) "SID", 
         s.serial# "Serial#", 
         s.status "Status", 
         s.type "Type",
         DECODE(s.type, 'BACKGROUND', substr(p.program, length(p.program)-5, 6), substr(s.username,0,15)) "DB User", 
         substr(s.osuser,0,12) "OS User",          
         substr(s.machine,0,20) "Machine", 
         DECODE(s.type, 'BACKGROUND', 'Internal', substr(s.module,0,30)) "Module",
         to_char(s.logon_time, 'dd/mm hh24:mi:ss') "Connect Time"
    from v$session s, v$process p, SYS.v_$sess_io si
   where s.paddr = p.addr(+) AND si.SID(+) = s.SID
     and s.audsid <> userenv('SESSIONID')
order by s.type, s.status, si.SID, s.serial# DESC; 


