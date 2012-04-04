set linesize 150
set pagesize 250

select crr_date, 
       category, 
       substr(message_text,0,100) message, 
       to_char(touch_dt,'hh24:mi:ss') touch_dt
  from tbl_message
 where crr_date = nvl('&1', sf_get_crr_date)
   and category = upper(nvl('&2', category))
 order by crr_date, touch_dt asc
/
