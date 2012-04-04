set linesize 150
set pagesize 300

select   substr(si.SID,0,5) "SID", 
         s.serial# "Serial#", 
         s.status "Status",
         to_char((SYSDATE - (s.last_call_et / 86400)), 'dd/mm hh24:mi:ss') "Last Call",
         p.spid "Server Pid", 
         s.audsid "Audsid",
         substr(lockwait,0,10) "Lock Wait",
         si.physical_reads "Ph.Reads", 
         si.block_gets "Bl.Gets",
         si.consistent_gets "Con.Gets",
         si.block_changes "Bl.Changes",
         si.consistent_changes "Con.Changes"
    from v$session s, v$process p, SYS.v_$sess_io si
   where s.paddr = p.addr(+) AND si.SID(+) = s.SID
     and s.audsid <> userenv('SESSIONID')
     and s.type <> 'BACKGROUND'
order by s.type, s.status, si.SID, s.serial# DESC; 
