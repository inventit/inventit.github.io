---
layout: post
title: "Local OpsWorks testing with Vagrant, Berkshelf 3.0 and Chef 11.10"
categories: blog aws opsworks vagrant chef berkshelf
posted_by: dbaba
---
As of Mar. 27, [AWS announced OpsWorks started to support Chef 11.10](http://aws.typepad.com/aws/2014/03/aws-opsworks-now-supports-chef-1110.html?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed:+AmazonWebServicesBlog+(Amazon+Web+Services+Blog)). With the release, Berkshelf was supported as well. This is a very good news for OpsWorks users because they, including me, no longer need to copy public cookbooks into their private cookbook.

Since I was already an OpsWorks user, I'd started to migrate to Chef 11.10 with Berkshelf from Chef 11.04. However, things didn't go well.
I'm now still getting stuck because of OpsWorks issue. So here I describe the way to prepare the local OpsWorks test environment with Chef 11.10, Berkshelf 3.0.1+ and Vagrant 1.5.2+.

I will post a new article when OpsWorks with Chef 11.10 and Berkshelf 3.0.0+ works with success.

# Creating Local OpsWorks Test Environment with Vagrant
Testing recipes on OpsWorks takes long time. I usually test our recipes with Vagrant prior to uploading them. So I created Vagrant environment on my local machine.

In order for you to create the environment, you need to install the following:

 1. The latest version of Vagrant (1.5.2+)
 1. The latest version of Berkshelf (3.0.1+)
 1. Several Vagrant plugins (described later)

Chef will be installed by a Vagrant plugin. So you don't have to install it manually.

## Migrating to Chef 11.10
Our `Vagrantfile` used [Bento](http://opscode.github.io/bento/) for downloading virtual box image files. I had the first difficulty when I tried to look for Chef 11.10 version of image files. The problem was there was no images for Chef 11.10. Chef was no longer included in the Bento image files but would be installed with [vagrant-omnibus](https://github.com/schisamo/vagrant-omnibus) plugin.

In order to install [vagrant-omnibus](https://github.com/schisamo/vagrant-omnibus) plugin, I ran the following command as described [here](https://github.com/schisamo/vagrant-omnibus#installation).

    $ vagrant plugin install vagrant-omnibus

Then I changed our `Vagrantfile` as follows:

	Vagrant.configure("2") do |config|
	  # This is virtualbox specific memory allocation option.
	  config.vm.provider :virtualbox do |vb|
	    vb.customize ["modifyvm", :id, "--memory", 1024]
	  end
	  
	  config.omnibus.chef_version = CHEF_VERSION

where `CHEF_VERSION` is a constant at the beginning of the `Vagrantfile`. Currently the definition is as follows.

	CHEF_VERSION = "11.10.4"

And I also changed the image file URL so that the latest version of Bento images would be downloaded.

	def select_vmbox(config, os)
	  suffix = (ARCH == 32 ? '-i386' : '')
	  case os
	  when "ubuntu"
	    config.vm.box = "opscode_ubuntu-12.04#{suffix}_chef-provisionerless"
	    config.vm.box_url = "https://opscode-vm-bento.s3.amazonaws.com/vagrant/virtualbox/opscode_ubuntu-12.04#{suffix}_chef-provisionerless.box"
    
	  when "centos"
	    version = "v20140110"
	    config.vm.box = "CentOS-6.5-#{suffix}-#{version}"
	    config.vm.box_url = "http://opscode-vm-bento.s3.amazonaws.com/vagrant/virtualbox/opscode_centos-6.5#{suffix}_chef-provisionerless.box"
	  end
	end

This is a convenient method to configure Bento image URL to be donwloaded selectively. In this case, we can choose Ubuntu 12.04 or Cent OS 6.5.

## Working with Berkshelf
### OpsWorks issue
Next, I installed Berkshelf. I used Berkshelf 3.0.1 (the latest version of Berkshelf is now [3.1.1](https://github.com/berkshelf/berkshelf/releases)).
However, unfortunately, Opsworks haven't support 3.0.0 or newer on Ubuntu box but supports only 3.0.0.beta7 and 2.14 for Ubuntu :-(

I posted a new [thread](https://forums.aws.amazon.com/thread.jspa?threadID=150520&tstart=0) in order to ask AWS to support 3.0.0 or newer version of Berkshelf and am still waiting for it to be addressed.

### Vagrant plugin
Back to Vagrant, I installed [vagrant-berkshelf](https://github.com/berkshelf/vagrant-berkshelf) plugin by the following command so that I could use Berkshelf with Vagrant.

	$ vagrant plugin install vagrant-berkshelf --plugin-version 2.0.0 # This version won't work.

This seemed to work fine but I got stuck again after installing the plugin when starting Vagrant by `vagrant up`. Vagrant complained that there was a version conflict regarding `celluloid` gem. I also reported the issue [here](https://github.com/berkshelf/vagrant-berkshelf/issues/174) and was resolved at the version 2.0.1.

So I recommend to use 2.0.1 or later of vagrant-berkshelf plugin.

	$ vagrant plugin install vagrant-berkshelf --plugin-version 2.0.1

And I added the following line in the `Vagrantfile`.

	config.berkshelf.enabled = true

### Berksfile
At last, I reached Bekshelf stuff. The only thing I needed to prepare for Berkshelf was `Berksfile`.

The following snippet is a part of our `Berksfile`. We use our own private cookbook as well as opscode's public cookbooks. We also use a cookbook available at GitHub.

	#!/usr/bin/env ruby
	# -*- encoding : utf-8 -*-
	source "https://api.berkshelf.com"
	
	cookbook 'cassandra', path: "cassandra"
	
	cookbook 'some-cookbook', github: "user/cookbook-name"
	
	cookbook 'memcached'

You can use `path:` directive for your own private cookbooks under the OpsWorks directory structure (see below).
In order to use GitHub cookbooks, `github:` is helpful. This option is useful when you need a patched version of cookbook.
Regarding other public cookbooks, you can just put the cookbook name with `cookbook` method.

### Directory Structure for OpsWorks
Opsworks requires the following structure for a private cookbook. So both `Vagrantfile` and `Berksfile` should be put the root directory of the cookbook.

	your-cookbook-root ... where Vagrantfile and Berksfile are placed.
	  +- cookbookA ... your own private cookbook
	  +- cookbookB ... another your own private cookbook

### Launching Vagrant

Then I ran the command to start Vagrant:

	$ vagrant up

The output was as follows:

	Configuring [default]...
	Done.
	Bringing machine 'ubuntu' up with 'virtualbox' provider...
	==> ubuntu: Importing base box 'opscode_ubuntu-12.04_chef-provisionerless'...
	==> ubuntu: Matching MAC address for NAT networking...
	==> ubuntu: Setting the name of the VM: private-cookbooks_ubuntu_1398600277996_18138
	Updating Vagrant's berkshelf: '/Users/dede/.berkshelf/ubuntu/vagrant/berkshelf-20140427-52693-1y2yx06-ubuntu'
	Resolving cookbook dependencies...
	Fetching 'cassandra' from source at cassandra
    (snip)

Downloading a Bento image file was skipped as it was already downloaded before in this case.

### Where are the downloaded cookbooks?
By default, the downloaded cookbooks are placed under `~/.berkshelf/{:vmname}/cookbooks`. The {:vmname} can be set by `config.vm.define` method.

## Vagrantfile example

This is a Vagrantfile example using vagrant-omnibus plugin and vagrant-berkshelf plugin with Chef 11.10.

	ARCH = 64
	CHEF_VERSION = "11.10.4"
	OS = "ubuntu"
	# OS = "centos"
	
	def select_vmbox(config, os)
	  suffix = (ARCH == 32 ? '-i386' : '')
	  case os
	  when "ubuntu"
	    # Chef 11 support with opscode bento
	    config.vm.box = "opscode_ubuntu-12.04#{suffix}_chef-provisionerless"
	    # from https://github.com/opscode/bento
	    config.vm.box_url = "https://opscode-vm-bento.s3.amazonaws.com/vagrant/virtualbox/opscode_ubuntu-12.04#{suffix}_chef-provisionerless.box"
    
	  when "centos"
	    version = "v20140110"
	    config.vm.box = "CentOS-6.5-#{suffix}-#{version}"
	    config.vm.box_url = "http://opscode-vm-bento.s3.amazonaws.com/vagrant/virtualbox/opscode_centos-6.5#{suffix}_chef-provisionerless.box"
	  end
	end
	
	Vagrant.configure("2") do |config|
	  config.vm.provider :virtualbox do |vb|
	    vb.customize ["modifyvm", :id, "--memory", 1024]
	  end
	  config.omnibus.chef_version = CHEF_VERSION
	  config.berkshelf.enabled = true
	  select_vmbox config, OS
	  config.vm.define OS do |c|
	    c.vm.provision :chef_solo do |chef|
	      chef.add_recipe("cassandra::tarball")
	      chef.add_recipe("memcached::default")
	      chef.json = {
	        :memcached => {
	          :memory => 512
	        },
	        :cassandra => {
	          :rpc_address => '0.0.0.0'
	        }
	      }
	    end
	    c.vm.network :forwarded_port, guest: 11211, host: 11211
	    c.vm.network :forwarded_port, guest: 9160, host: 9160
	    c.vm.network :forwarded_port, guest: 9042, host: 9042
	  end
	  
	  puts "Done."
	end
