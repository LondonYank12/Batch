select to_number(substr(value, 0, 20))/3600 "Undo retention (hours)"
  from v$parameter
 where name = 'undo_retention'
/

select status "Status", 
       round(SUM(BYTES)/(1024*1024),2) "Used (Mb)"
  from dba_undo_extents
 group by status
/
