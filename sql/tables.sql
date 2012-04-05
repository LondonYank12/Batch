--------------------------------------------------------
--  DDL for Table TBL_FILE
--------------------------------------------------------

  CREATE TABLE "TBL_FILE" 
   (	"FILE_ID" NUMBER, 
	"FILE_TYPE" VARCHAR2(30), 
	"CRR_DATE" DATE, 
	"FILE_NAME" VARCHAR2(100), 
	"FILE_PATH" VARCHAR2(200), 
	"MD5_SUM" VARCHAR2(32), 
	"RECORDS_IN_FILE" NUMBER, 
	"LAST_LOAD_DATE" DATE, 
	"FILE_STATUS" VARCHAR2(20), 
	"DIGEST" VARCHAR2(100), 
	"LOAD_ATTEMPTS" NUMBER(*,0) DEFAULT 0, 
	"ORIGINAL_FILE_NAME" VARCHAR2(100), 
	"CREATION_DATE_TIME" DATE DEFAULT SYSDATE, 
	"UPDATE_DATE_TIME" DATE
   ) TABLESPACE "EXPLAIN_01" 

   COMMENT ON COLUMN "TBL_FILE"."RECORDS_IN_FILE" IS 'Total number of records in the file during the last load'
   COMMENT ON COLUMN "TBL_FILE"."DIGEST" IS 'This is hash total associated with a file. This will give you the current hash total for the last load of this file'
   COMMENT ON COLUMN "TBL_FILE"."LOAD_ATTEMPTS" IS 'Number of times a file was attempted to load. Default 1'
   COMMENT ON COLUMN "TBL_FILE"."ORIGINAL_FILE_NAME" IS 'This is the orignial name of the file supplied by vendor'

--------------------------------------------------------
--  DDL for Table TBL_BATCH_PROCESS
--------------------------------------------------------

  CREATE TABLE "TBL_BATCH_PROCESS" 
   (	"JOB_ID" NUMBER(*,0), 
	"PROCESS" VARCHAR2(110), 
	"JOB_NAME" VARCHAR2(100), 
	"JOB_TYPE" VARCHAR2(30), 
	"PROC_NAME" VARCHAR2(100), 
	"CALL_DESC" VARCHAR2(500), 
	"CRR_DATE" DATE, 
	"STATUS" VARCHAR2(10), 
	"RESULT" VARCHAR2(10), 
	"RC" VARCHAR2(10), 
	"STARTDT" DATE, 
	"ENDDT" DATE, 
	"TOUCHDT" DATE, 
	"OS_PID" NUMBER(*,0), 
	"HOSTNAME" VARCHAR2(100), 
	"AUTOSYS_BOX_NAME" VARCHAR2(30), 
	"AUTOSYS_JOB_NAME" VARCHAR2(30)
   ) TABLESPACE "EXPLAIN_01"
