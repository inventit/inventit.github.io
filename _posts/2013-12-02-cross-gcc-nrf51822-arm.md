---
layout: post
title: "Cross GCC for nRF51822/ARM Cortex M0"
categories: blog embedded_c embedded_cxx arm cortex_m0 nordic nRF51822
posted_by: dbaba
---
I created the building environment for nRF51822 on OSX (10.8.5).

The following GitHub projects are helpful.

 1. [Pebble's toolchain project](https://github.com/pebble/arm-eabi-toolchain) ([d36d291b27b0427dc7f3d19dd61846facf307f4b](https://github.com/pebble/arm-eabi-toolchain/commit/d36d291b27b0427dc7f3d19dd61846facf307f4b))
 1. [Sprounting's sample template for OSX](https://github.com/Sproutling/nRF51822-OSX-Sample)

The first one is originally coming from [jsnyder's](https://github.com/jsnyder/arm-eabi-toolchain) project. However, it didn't work for me (not sure why).

The second project provides almost complete set of nRF51822 building environment.

What I have to do is:

 1. to replace the existing toolchain under `tools/OSX` with the newly built one.
 1. to modify the GCC version in the Makefile (4.6.3 -> 4.7.3)

## Prerequisites

 * Installing gcc, gmp, mpfr and mpc (see [README.md](https://github.com/pebble/arm-eabi-toolchain) in the Pebble's project). I used the same enviroment as before (described [here](/posts/2013/11/15/cross-gcc.html))

## Building Toolchain

*There is a shortcut to get the prebuilt toolchain for 10.7 and 10.8 users. See the last section.*

    cd /to/your/working/directory
    git clone https://github.com/pebble/arm-eabi-toolchain
    cd arm-eabi-toolchain
	make install-cross
	make install-bin-extras

The toolchain will be placed under the `$HOME` and you can find `$HOME/arm-cs-tools` directory where the built binaries exit.

The last command extracts and places CS3 libraries into the correct directories. The libraries are required on linking objects.

## Preparing the Sample template

    cd /to/your/working/directory
    git clone https://github.com/Sproutling/nRF51822-OSX-Sample
    cd nRF51822-OSX-Sample
	vi Makefile

Then, replace `4.6.3` with `4.7.3` where `GNU_VERSION` is defined.

You need to replace the newly built toolchain with the existing one as well.

    cd nRF51822-OSX-Sample/tools/OSX
	rm -fr arm-cs-tools
	mkdir arm-cs-tools
	cp -r ~/arm-cs-tools arm-cs-tools

## Testing the template

Now you are ready to develop. Try the following command if the template works.

    make

And you can find the following binaries under the `build` directory:

 1. ble_hrs.bin
 1. ble_hrs.hex
 1. ble_hrs.out

Note that you need to get nRF51 softdevice from the [Nordic site](http://www.nordicsemi.com/) in order to use all Make targets incluing Jlink stuff in the sample tempalte.

## Shortcut way to get the toolchain for 10.8 and 10.7 users

[Pebble's Developer site](https://developer.getpebble.com/1/GettingStarted/MacOS/) is also distributing prebuilt binaries for 10.8 and 10.7 useres though I've never tried.

