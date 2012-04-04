set linesize 150
set pagesize 100

select lf.GROUP# "Group",
       substr(lf.member,1,70) "Redolog Filename", 
       l.BYTES "Bytes" 
  from v$logfile lf, v$log l
 where lf.GROUP# = l.GROUP# 
order by l.GROUP#, lf.MEMBER;

