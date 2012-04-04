set linesize 150
set pagesize 250

select crr_date,
       substr(autosys_job_name, 0, 30) autosys_job_name,
       substr(job_name, 0, 20) job_name,
       substr(job_type, 0 ,10) job_type,
       substr(status,0,7) status,
       substr(result,0,6) result,
       to_char(startdt, 'hh24:mi:ss') startdt,
       to_char(enddt, 'hh24:mi:ss') enddt,
       round((enddt-startdt)*1440,2) runtime
  from gc_external.tbl_batch_process bp
 where crr_date = nvl('&1', sf_get_crr_date)
   and not exists
   	   (
	   SELECT 'x'
	   FROM gc_external.tbl_batch_process bp2
	   WHERE bp2.crr_date = bp.crr_date
	     AND bp2.job_id = bp.job_id
	     AND ((job_name LIKE '%FIVEREFRESH%' AND result = 'OK')
		   OR (job_name LIKE '%MULTILINGUAL_RESOURCES.SY%' and result = 'OK')
		   )
	   )
  order by 1,8,3
/
