set linesize 150
set pagesize 250

select substr(job_name, 0, 40) job_name,
       job_type, 
       round(min(enddt - startdt)*1440, 2) minrun, 
       round(max(enddt - startdt)*1440, 2) maxrun, 
       round(avg(enddt - startdt)*1440, 2) avgrun
  from tbl_batch_process
 where crr_date between nvl('&1', '1-JAN-1900') and nvl('&2', sysdate)
 group by job_name,job_type
 order by 2,1 
/

