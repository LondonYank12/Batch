set linesize 150
set pagesize 250

select load_process_short_name load_process, crr_date, count(*)
from tbl_position po, tbl_load_process pr
where system_of_record = upper('&1')
 and crr_date = nvl('&2', crr_date)
 and pr.load_process_key = po.load_process_key
group by load_process_short_name, crr_date
order by 1, 2
/
