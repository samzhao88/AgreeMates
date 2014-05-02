# AgreeMates

A mobile-friendly web application designed to make living with roommates easier.

## Team
Aengus McMillin (aengusm@uw)  
Amit Burstein (bursta@uw)  
Nickolas Evans (evansn3@uw)  
Jordan Heier (heierj@uw)  
William McNamara (mcnawi11@uw)  
Lukas Bischofberger (lukasbi@uw)  
Dennis Ding (dennisd7@uw)  
Haocheng Zhao (samzhao@uw)

## Resources
[Node.js](http://nodejs.org/)  
[Express framework](http://expressjs.com/)  
[Angular](http://angularjs.org/)  
[MongoDB](https://www.mongodb.org/)  
[PostgreSQL](http://www.postgresql.org/)

## Installation
Use the included vagrant configuration to setup a custom AgreeMates server.
First, install vagrant from http://www.vagrantup.com/downloads, and VirtualBox from https://www.virtualbox.org/wiki/Downloads.

Then once those are installed, in the AgreeMates folder run the following commands from the terminal/shell:

```
cd installation
vagrant up
vagrant ssh
```

'vagrant up' may take a while to complete, but unless it throws an error it is still working.
Once setup, AgreeMates will be installed at '~/AgreeMates' in the virtual machine
