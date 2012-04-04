set linesize 160
set pagesize 250

select substr(load_process_key, 0, 3) key,
       substr(load_process_name, 0, 35) load_process_name,
       substr(load_process_short_name,0,24) load_process_short_name,
       load_process_type,
       substr(staging_table,  0, 30) staging_table,
       update_date
 from tbl_load_process
/
