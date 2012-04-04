select tablespace_name "Tablespace", 
       to_char(sum(bytes/(1024*1024)),'99G999G990') "Free space (KB)"
from dba_free_space
group by tablespace_name
/
