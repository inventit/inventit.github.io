---
layout: post
title: "Using the latest prebuilt Berkshelf package with OpsWorks on Ubuntu box"
category: posts
posted_by: dbaba
---
OpsWorks with Chef 11.10 + Berkshelf 3.1.1 worked for me with c3.xlarge instances on Ubuntu box. However, I'd like to launch smaller instances.

Today I was finally succeeded in launching a small instance with Chef 11.10 + Berkshelf 3.1.1.

According to [DanielH@AWS's reply](https://forums.aws.amazon.com/thread.jspa?messageID=540574&tstart=0), we can use the prebuilt packages by modifying the custom json as shown below.

	{
	  "opsworks_berkshelf": {
	    "prebuilt_versions": ["3.0.0.beta7", "2.0.14"]
	  }
	}

So I chagned the `prebuilt_versions` to `["3.1.1"]`.

	{
	  "opsworks_berkshelf": {
	    "prebuilt_versions": ["3.1.1"]
	  }
	}

And make sure that you put `3.1.1` as `Berkshelf version` in the Stack Settings.
