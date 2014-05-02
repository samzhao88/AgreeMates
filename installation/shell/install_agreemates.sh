#!/bin/sh

AGREEMATES_DIR=~/AgreeMates

if [ ! -d "$AGREEMATES_DIR" ]; then
	cd ~
	git clone https://github.com/AgreeMates/AgreeMates.git
	cd $AGREEMATES_DIR
	npm install
fi

