set linesize 150
select substr(name,1,70) "Control Files" from v$controlfile;
