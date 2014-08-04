---
layout: post
title: "Running Apache Storm on Docker"
categories: blog storm docker
posted_by: dbaba
---
With [storm-docker](https://github.com/wurstmeister/storm-docker) script, you can setup Apache Storm easily.
I describe here how to install Apache Storm and how to deploy a topology on the running containers.

I also forked the wurstmeister's project and customized it (found [here](https://github.com/inventit/storm-docker)). I will create a new post at another time.

## Docker 1.0.1 installation

At first, install Docker. Read the [page](https://docs.docker.com/installation/#installation) for the instllation instruction.

As described above page, OS X and Windows requires Boot2docker, a tiny Linux VM for Docker, which includes Docker as well.

## Boot2docker

    host $ boot2docker init

This may take a couple of minutes or more as an ISO image is downloaded to `~/.boot2docker` directory.
After the command completes, run the following command to start a new image.

    host $ boot2docker up

Then for OSX users run:

    host $ boot2docker ssh

or for Windows users, use putty or your favorite SSH client instead of the above command line to ssh the boot2docker instance.

## Installing bash

    boot2docker $ tce-load -wi bash.tcz

## Cloning a docker script

Now you can clone [storm-docker](https://github.com/wurstmeister/storm-docker) with `git` command, which is installed by default.

    boot2docker $ git clone https://github.com/wurstmeister/storm-docker.git

In order to preserve these changes, exit the ssh session.

    boot2docker $ exit

And run the command on the host.

    host $ boot2docker save

After saving is finished, the instance is down. Use `boot2docker up` to re-launch the image.

## Starting Apache Storm
Start the boot2docker isntance.

    host $ boot2docker up

SSH to the instance.

    host $ boot2docker ssh

Or use Windows SSH client to connect to the instance.

    boot2docker $ cd ~/storm-docker
    boot2docker $ ./start-storm.sh 

This will download dependent containers if they aren't yet stored locally.

When the command is completed, you can check the running docker containers.

    boot2docker $ docker ps

    CONTAINER ID        IMAGE                                  COMMAND                CREATED             STATUS              PORTS                                                                       NAMES
    889d11b18998        wurstmeister/storm-ui:latest           /bin/sh -c /usr/bin/   5 seconds ago       Up 4 seconds        0.0.0.0:49080->8080/tcp                                                     ui                                                                          
    63dcd1ef7e85        wurstmeister/storm-supervisor:latest   /bin/sh -c /usr/bin/   5 seconds ago       Up 4 seconds        6700/tcp, 6701/tcp, 6702/tcp, 6703/tcp, 0.0.0.0:49000->8000/tcp             supervisor                                                                  
    d4076c5fa1a5        wurstmeister/storm-nimbus:latest       /bin/sh -c /usr/bin/   6 seconds ago       Up 5 seconds        0.0.0.0:49627->6627/tcp, 0.0.0.0:49772->3772/tcp, 0.0.0.0:49773->3773/tcp   nimbus,supervisor/nimbus,ui/nimbus                                          
    8a6da03bafcf        jplock/zookeeper:latest                /opt/zookeeper-3.4.5   41 minutes ago      Up 41 minutes       2888/tcp, 3888/tcp, 0.0.0.0:49181->2181/tcp                                 nimbus/zk,supervisor/nimbus/zk,supervisor/zk,ui/nimbus/zk,ui/zk,zookeeper   

OK, now Apache Storm is ready!

The started containers are running on Host-only network. As shown above, some of the container ports are forwarded to the boot2docker instance. You can access to the boot2docker port with its IP address from your guest OS.

The boot2docker IP address is displayed by running the following command.

    boot2docker $ boot2docker ip

In most cases, the output will be as follows:

    The VM's Host only interface IP address is: 192.168.59.103

So you can open the following URL with your browser:

    http://192.168.59.103:49080/

This will render the Storm UI page.

You can get more information regarding the container port forwarding [here](https://github.com/boot2docker/boot2docker#container-port-redirection).

In order to stop the containers, run the following command.

    boot2docker $ cd ~/storm-docker
    boot2docker $ ./destroy-storm.sh

## How to deploy and undeploy topologies

In order to deploy your topology, you need to install Apache Storm on your host machine (untar/unzip the archive).
Then set PATH so that you can run `storm` command from a terminal.

### Deploying a topology
Run the following command on your **HOST** machine after creating a jar file for your topology.

```bash
your-host-machine $ storm jar path/to/your/topology.jar fqdn.of.your.TopologyMainClass \
  -c nimbus.host=192.168.59.103 -c nimbus.thrift.port=49627
```

### Undeploying a topology
Run the following command on your **HOST** machine and you can remove the deployed topology.

You can specify the waiting time with -w before Storm shuts down the topology. `-w 1` means Storm will wait 1 second before shutting down the topology.

```bash
your-host-machine $ storm kill YourTopologyName -c nimbus.host=192.168.59.103 -c nimbus.thrift.port=49627 -w 1
```
