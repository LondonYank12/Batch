#!/usr/bin/ksh
cd $3
tar -cvf ${1}/${2} *

#find . | cpio -oc >${1}/${2}
