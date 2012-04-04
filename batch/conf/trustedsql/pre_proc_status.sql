set heading off

select trim(count(*))
from tbl_catch_up
where status = 'N'
/