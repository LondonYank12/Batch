select substr(ws.sid, 0,5) "Wait SID",
       ws.serial# "Wait Serial#",
       ws.username "Wait db user",
       substr(ws.osuser,0,12) "Wait os user",          
       substr(hs.sid, 0,5) "Hold SID",
       hs.serial# "Hold Serial#",
       hs.username "Hold db user",
       substr(hs.osuser,0,12) "Hold os user"
 from  dba_waiters,
       sys.v_$session ws,
       sys.v_$session hs
where  ws.sid=waiting_session and
       hs.sid=holding_session 
/

