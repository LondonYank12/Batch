set linesize 150
set pagesize 100
select
	substr(tablespace_name,1,20) "Tablespace",
	substr(file_id,1,4) "Id",
	substr(file_name,1,75) "Filename",
	to_char(bytes / (1024 ), '99G999G990') "Size in KB"
	from sys.dba_data_files
	order by tablespace_name, file_id ;



