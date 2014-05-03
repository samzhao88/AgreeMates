exec { 'apt-get update':
	path => '/usr/bin',
}

package { 'vim':
	ensure => present,
}

class { 'nodejs':
	version => 'v0.10.26'
}

class { 'postgresql::server': }

postgresql::server::role { 'vagrant':
	createdb		=> true,
	login			=> true,
	password_hash 	=> postgresql_password("vagrant", "vagrant"),
}

package { 'express':
	ensure	=> present,
	provider => 'npm',
}

package { 'gulp':
	ensure => present,
	provider => 'npm',
}

package { 'mocha':
	ensure => present,
	provider => 'npm',
}

package { 'bower':
	ensure => present,
	provider => 'npm',
}

package { 'karma-cli':
	ensure => present,
	provider => 'npm',
}

package { 'istanbul':
	ensure => present,
	provider => 'npm',
}

