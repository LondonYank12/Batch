select substr(name,1,40) "SGA init.ora parameter name", 
       to_char(to_number(value) / 1024,  '99G999G990') "Value (KB)" 
  from v$parameter 
 where name = 'shared_pool_size'
    or name = 'db_cache_size'
    or name = 'db_block_size'
    or name = 'sga_max_size'
    or name = 'java_pool_size'
    or name = 'sort_area_size'
    or name = 'large_pool_size';

