set linesize 150
select  substr(name,1,30) "Parameter", substr(value,1,75) "arch/trc Destination"
        from v$parameter
        where name = 'log_archive_dest'
        or name = 'user_dump_dest'
        or name = 'background_dump_dest'
        or name = 'core_dump_dest';

