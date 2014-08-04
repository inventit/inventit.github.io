---
layout: post
title: "Error on installing Berkshelf 3.0.1+ with OpsWorks on Ubuntu box"
categories: blog aws opsworks chef berkshelf
posted_by: dbaba
---
As I wrote before, OpsWorks now only supports Berkshelf 3.0.0.beta7 and 2.0.14 for Ubuntu 12.04.
Here I describe my try-and-error report regarding the use of OpsWorks with Berkshelf on Ubuntu.

# OpsWorks error on installing Berkshelf 3.0.1
OpsWorks provides the way to specify the arbitrary version of Berkshelf when we choose Chef 11.10 in Stack Settings as the [blog article](http://aws.typepad.com/aws/2014/03/aws-opsworks-now-supports-chef-1110.html?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed:+AmazonWebServicesBlog+(Amazon+Web+Services+Blog) shows you. However, when I chose Berkshelf 3.0.1 along with Chef 11.10, I got an error in a log file under `/var/lib/aws/opsworks/chef` directory.

	[2014-04-20T23:51:37+00:00] INFO: Processing remote_file[/tmp/berkshelf_3.0.1.deb] action create (opsworks_custom_cookbooks::checkout line 96)
	[2014-04-20T23:51:37+00:00] INFO: remote_file[/tmp/berkshelf_3.0.1.deb] created file /tmp/berkshelf_3.0.1.deb
	[2014-04-20T23:51:37+00:00] INFO: HTTP Request Returned 403 Forbidden:
	[2014-04-20T23:51:37+00:00] ERROR: remote_file[/tmp/berkshelf_3.0.1.deb] (opsworks_custom_cookbooks::checkout line 96) had an error: 403 "Forbidden"; ignore_failure is set, continuing
 
	================================================================================
	^[[31mError executing action `create` on resource 'remote_file[/tmp/berkshelf_3.0.1.deb]'
	================================================================================
 
 
	Net::HTTPServerException
	------------------------
	403 "Forbidden"
 
 
	Resource Declaration:
	---------------------
	# In /var/lib/aws/opsworks/cache/cookbooks/opsworks_custom_cookbooks/recipes/checkout.rb
 
	 96: remote_file "/tmp/#{node[:opsworks_custom_cookbooks][:berkshelf_package_file]}" do
	 97:   source node[:opsworks_custom_cookbooks][:berkshelf_package_url]
	 98:   ignore_failure true
	 99:
	100:   only_if do
	101:     node[:opsworks_custom_cookbooks][:manage_berkshelf] && ::File.exists?(File.join(node[:opsworks_custom_cookbooks][:destination], 'Berksfile'))
	102:   end
	103: end

The error said `HTTP 403 Forbidden` for the access to the resource `node[:opsworks_custom_cookbooks][:berkshelf_package_url]`. I think it weird because the dumped source code declrared `ignore_failure true` but the error was NOT ignored.
Probably AWS guys are now investigating it but I cannot wait for them to address it.

### UPDATE

The symptom is already gone. You can change Berkshelf version without HTTP 403 error. But either 3.0.1 or 3.1.1 is recommended by an AWS guy.

# Trying to overwrite the package url

As the [source code](https://github.com/aws/opsworks-cookbooks/blob/release-chef-11.10/opsworks_custom_cookbooks/recipes/checkout.rb#L96-L103) shown above, the `node[:opsworks_custom_cookbooks][:berkshelf_package_url]` has the location to the Berkshelf package. So I tried to overwrite the attribute with a dummy URL in my own custom JSON like this.

	{
	  "opsworks_custom_cookbooks" : {
	    "berkshelf_package_file" : "https://dummy-s3-bucket.s3-region.amazonaws.com/path/to/my/berkshlef.deb"
	  },
	  (snip)
	}


When I launched a new instance, I found the dummy url worked, all opsworks cookbooks are successfully stored in the Chef's runtime cache withour stopping.

	[2014-04-29T05:07:56+00:00] INFO: HTTP Request Returned 404 Not Found: Object not found: /reports/nodes/akkorokamui.localdomain/runs
	[2014-04-29T05:08:17+00:00] INFO: Loading cookbooks [apache2, dependencies, deploy, gem_support, mod_php5_apache2, mysql, nginx, opsworks_agent_monit, opsworks_berkshelf, opsworks_bundler, opsworks_commons, opsworks_custom_cookbooks, opsworks_initial_setup, opsworks_java, opsworks_nodejs, opsworks_rubygems, packages, passenger_apache2, php, rails, ruby, scm_helper, ssh_users, unicorn]
	[2014-04-29T05:08:17+00:00] INFO: Storing updated cookbooks/opsworks_custom_cookbooks/recipes/execute.rb in the cache.
    (snip)

As the first line above shows, HTTP 404 was returned. This means the overwritten URL worked. So currently Chef's `remote` provider seems to ignore HTTP 404 error but not to ignore HTTP 403.

## UPDATE
Around April 30th, the updated version of OpsWorks seemed to be deployed. The information above is now obsolete. 

# Resolving Version Conflict
I still got an error though I could resolve the weird Chef's `remote` behavior. Here is the error portion of the log file.

	Building native extensions.  This could take a while...
	STDERR: 
	---- End output of /opt/aws/opsworks/local/bin/gem install berkshelf -q --no-rdoc --no-ri -v "3.1.1" --bindir /opt/aws/opsworks/local/bin --no-document --version '= 3.0.1'  ----
	Ran /opt/aws/opsworks/local/bin/gem install berkshelf -q --no-rdoc --no-ri -v "3.1.1" --bindir /opt/aws/opsworks/local/bin --no-document --version '= 3.0.1'  returned 
    
    (snip)
    
	Compiled Resource:
	------------------
	# Declared in /var/lib/aws/opsworks/cache/cookbooks/opsworks_berkshelf/recipes/install.rb:36:in `from_file'
    
	gem_package("berkshelf") do
	  provider Chef::Provider::Package::Rubygems
	  action [:install]
	  retries 0
	  retry_delay 2
	  options "--bindir /opt/aws/opsworks/local/bin --no-document --version '= 3.0.1' "
	  package_name "berkshelf"
	  version "3.1.1"
	  cookbook_name "opsworks_berkshelf"
	  recipe_name "install"
	  gem_binary "/opt/aws/opsworks/local/bin/gem"
	  not_if { #code block }
	end

This error seems to tell me the given version (3.0.1) doesn't match with the declared in the source code (3.1.1).
So I put 3.1.1 as the Berkshelf version.
Note that I cannot empty the Berkshelf version in Stack Settings as the blank will be translated into OpsWOrks's default version, 2.0.14.

I think the version mismatch shown above is an OpsWorks bug but I ignore it here as it is another story.

Things went well this time? No, I still got an error again.

# gecode library compilation error

	config.status: creating gecode/support/config.hpp
	-> make clean
	(cd . && autoconf)
	/bin/sh: 1: autoconf: not found
	make: *** [configure] Error 127
	extconf.rb:89:in `block in run': Failed to build gecode library. (GecodeBuild::BuildError)
		from extconf.rb:88:in `chdir'
		from extconf.rb:88:in `run'
		from extconf.rb:95:in `<main>'
    
	extconf failed, exit code 1
    
	Gem files will remain installed in /opt/aws/opsworks/local/lib/ruby/gems/2.0.0/gems/dep-selector-libgecode-1.0.0 for inspection.
	Results logged to /opt/aws/opsworks/local/lib/ruby/gems/2.0.0/extensions/x86_64-linux/2.0.0-static/dep-selector-libgecode-1.0.0/gem_make.out
	---- End output of /opt/aws/opsworks/local/bin/gem install berkshelf -q --no-rdoc --no-ri -v "3.1.1" --bindir /opt/aws/opsworks/local/bin --no-document --version '= 3.1.1'  ----
	Ran /opt/aws/opsworks/local/bin/gem install berkshelf -q --no-rdoc --no-ri -v "3.1.1" --bindir /opt/aws/opsworks/local/bin --no-document --version '= 3.1.1'  returned 1
	[2014-04-29T05:59:16+00:00] FATAL: Chef::Exceptions::ChildConvergeError: Chef run process exited unsuccessfully (exit code 1)
    
	---


I saw the similar [issue](https://forums.aws.amazon.com/thread.jspa?messageID=535762&#535762) in the AWS forum, but unfortunately the questioner failed to get any help.
I also found a [ticket](https://github.com/opscode/dep-selector-libgecode/issues/15) which was identical to mine. This suggested to set `USE_SYSTEM_GECODE=1` on gem installation. However, I didn't have any way to pass the environmental variable to the gem command. I gave up.

In the end, the only way left seems to be creating a pre-built Berkshelf package. I will try next.

### UPDATE

According to [requena@AWS](https://forums.aws.amazon.com/thread.jspa?threadID=150520&tstart=0), the error has occured on EC2 64 bit instances with less than 4 cores and suggested me to use 32 bit instances or 64 bit instances with 4 or more cores.

