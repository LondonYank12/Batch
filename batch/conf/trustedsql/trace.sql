set linesize 150
set pagesize 250

select * 
  from tbl_trace
 where lower(user_mnemonic) = lower(nvl('&1', user_mnemonic))
order by stamp; 
