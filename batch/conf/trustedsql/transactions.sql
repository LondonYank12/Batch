set linesize 150
set pagesize 250

select load_process_short_name load_process, file_date_key, count(*)
  from tbl_transaction t, tbl_load_process p
 where system_of_record = upper('&1')
   and file_date_key = nvl('&2', file_date_key)
   and t.load_process_key = p.load_process_key
 group by load_process_short_name, file_date_key 
 order by 1,2
/
