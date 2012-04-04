set linesize 150
set pagesize 250

 select reconcilation_id rec_id,
        substr(system_of_record, 0, 8) sor,
        rec_start_date rec_start,
        rec_end_date rec_end,
        to_char(run_date, 'DD-MON-YY HH24:MI:SS') rec_run,        
        number_of_transactions trx,
        number_of_positions pos,        
        number_of_breaks breaks,
        position_quantity_start pos_start,
        position_quantity_end pos_end,
        transaction_quantity trx_qty,
        material_quantity_difference diff
   from tbl_reconcilation
  where trunc(run_date) = nvl('&2',run_date)
    and system_of_record = nvl(upper('&1'), system_of_record)
  order by system_of_record, run_date asc
/
