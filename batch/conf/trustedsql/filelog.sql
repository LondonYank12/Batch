set linesize 150
set pagesize 250

select substr(system_of_record,0,6) sor,
       substr(file_type,0,16) file_type,
       crr_date,
       file_id,
       substr(file_name,0,32) file_name,
       records_in_file recs,
       records_loaded loaded,
       load_status,
       substr(file_status, 0, 8) file_status,
       to_char(load_date, 'DD-MON-YYYY hh24:mi:ss') load_date
  from vw_file_log
 where file_type = nvl('&1', file_type)
   and crr_date = nvl('&2', sf_get_crr_date)
order by system_of_record, file_type, crr_date, load_date;


