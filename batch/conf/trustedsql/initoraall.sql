set pagesize 500

select substr(name,1,40) "init.ora parameter name", 
       substr(value,1,20) "Value" 
  from v$parameter
  order by 1 asc;


