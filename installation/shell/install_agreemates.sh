#!/bin/sh

AGREEMATES_DIR=/home/vagrant/AgreeMates

if [ ! -d "$AGREEMATES_DIR" ]; then
	cd /home/vagrant
	git clone -b master https://github.com/AgreeMates/AgreeMates.git
	cd AgreeMates
	npm install
	chown -R vagrant $AGREEMATES_DIR
fi

