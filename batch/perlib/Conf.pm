package Conf;

use strict;
require Exporter;

use vars qw(%conf $VERSION @ISA @EXPORT @EXPORT_OK @EXPORT_TAGS );

$VERSION = 0.01;
@ISA = qw(Exporter);
@EXPORT = qw();
@EXPORT_TAGS = ();

@EXPORT_OK = qw( %conf );

$conf{root_dir} = $ENV{EXPLAIN_HOME};
my $root_dir = $conf{root_dir};

$conf{java} = "/sbcimp/run/tp/sun/jdk/v1.3.0/jre/bin/java";
$conf{incoming_dir} = "$root_dir/data/incoming/";
$conf{failed_dir} = "$root_dir/data/failed/";
$conf{duplicate_dir} = "$root_dir/data/duplicates/";
$conf{processed_dir} = "$root_dir/data/processed/";
$conf{oa_properties_dir} = "$root_dir/conf/";
$conf{tmp_dir} = $ENV{EXPLAIN_BATCH_TMP};
$conf{CLASS_PATH} = $ENV{EXPLAIN_BATCH_CLASS_PATH};
$conf{ORACLE_SID} = $ENV{EXPLAIN_BATCH_ORACLE_SID};

$conf{ORACLE_GPAS_EXTRACT_URL} = $ENV{EXPLAIN_BATCH_ORACLE_GPAS_EXTRACT_URL};
$conf{ORACLE_GPAS_EXTRACT_UID} = $ENV{EXPLAIN_BATCH_ORACLE_GPAS_EXTRACT_UID};
$conf{ORACLE_GPAS_EXTRACT_PWD} = $ENV{EXPLAIN_BATCH_ORACLE_GPAS_EXTRACT_PWD};

$conf{ORACLE_URL} = $ENV{EXPLAIN_BATCH_ORACLE_URL};
$conf{ORACLE_UID} = $ENV{EXPLAIN_BATCH_ORACLE_UID};
$conf{ORACLE_PWD} = $ENV{EXPLAIN_BATCH_ORACLE_PWD};

$conf{CEFSUS_FTP_HOST} = $ENV{EXPLAIN_BATCH_CEFSUS_FTP_HOST};
$conf{CEFSUS_FTP_UID} = $ENV{EXPLAIN_BATCH_CEFSUS_FTP_UID};
$conf{CEFSUS_FTP_PWD} = $ENV{EXPLAIN_BATCH_CEFSUS_FTP_PWD};
$conf{CEFSUS_FTP_PATH} = $ENV{EXPLAIN_BATCH_CEFSUS_FTP_PATH};

$conf{ABACUS_FTP_HOST} = $ENV{EXPLAIN_BATCH_ABACUS_FTP_HOST};
$conf{ABACUS_FTP_UID} = $ENV{EXPLAIN_BATCH_ABACUS_FTP_UID};
$conf{ABACUS_FTP_PWD} = $ENV{EXPLAIN_BATCH_ABACUS_FTP_PWD};
$conf{ABACUS_FTP_PATH} = $ENV{EXPLAIN_BATCH_ABACUS_FTP_PATH};

$conf{notification_email} = $ENV{EXPLAIN_BATCH_NOTIFICATION_EMAIL};
$conf{error_level} = $ENV{EXPLAIN_BATCH_ERROR_LEVEL};


					

1;
