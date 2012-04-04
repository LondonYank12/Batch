select  substr(global_name,0,32) "Instance", 
        substr(banner,36,10) "Oracle Release:"  
  from v$version, global_name
 where rownum=1; 
