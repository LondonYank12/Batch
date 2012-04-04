###############################################
# Makefile for SSA Castanet builds
# Please ssa ssa_start.pl documentation
###############################################

VERSION=1.38.1

# get the build version from the official place.
SRC=/vobs/ZUR_GCOMP_EXPLAIN/batch
DIST=explain_dist
EXPLAIN_TARFILE=explain.tar
INSDIR=$(INSROOT)/sbcimp/run/pkgs/gc_explain/v$(VERSION)
BUILD_CMD=build.ksh

install: build
	if [ ! -d $(INSDIR) ]; then mkdir -p $(INSDIR); fi
	cp $(SRC)/$(DIST)/$(EXPLAIN_TARFILE) $(INSDIR)
	tar xvf  $(INSDIR)/$(EXPLAIN_TARFILE) -C $(INSDIR)
	rm $(INSDIR)/$(EXPLAIN_TARFILE)
	echo "Installed to $(INSDIR) finished"

build:
	cd $(SRC); ./$(BUILD_CMD) dist;

clean: 
	/bin/rm $(INSDIR)
