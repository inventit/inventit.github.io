---
layout: post
title: "Fixed Address Memory Allocation with KPIT GNU Tools"
categories: blog embedded_c embedded_cxx renesas_rx
posted_by: dbaba
---
Through the RX development with KPIT GNU tools, I've learnt the knowledge regarding how to get the linker to allocate variables to arbitrary addresses. This seems to be easily done with Renesas's IDEs, but with KPIT tools, I neeed to do a little bit more ;-b.

## KPIT GCC Custom Attributes for RX63N

Unlike HEW Renesas Compiler, KPIT GNU tools don't understand Renesas specific `#pragma section` directives. Fortunately, the [KPIT's Migration Guide](http://kpitgnutools.com/manuals/Renesas-GNURX-Migration-Guide.html#_compiler_directives) gives us how to handle the unsupported `#pragma section` directives. Having read the guide, I identified an attribute and created the following macro.

    #define KPIT_SECTION(name)			__attribute__ ((section(name)))

With this macro, you can assign a variable to an arbitrary section, which can be used in the linker script.

## Use Macro to Annotate Sections

As described above, you need to annotate variable definitions at first. I did it like this:

	ethfifo xRxDescriptors[ emacNUM_RX_DESCRIPTORS ]  KPIT_SECTION("_RX_DESC");
	ethfifo xTxDescriptors[ emacNUM_TX_BUFFERS ] KPIT_SECTION("_TX_DESC");
	struct
	{
		unsigned long ulAlignmentVariable;
		char cBuffer[ emacNUM_BUFFERS ][ UIP_BUFSIZE ];
	} xEthernetBuffers KPIT_SECTION("_ETHERNET_BUFFERS");

This snipet defines 3 sections, `_RX_DESC`, `_TX_DESC` and `_ETHERNET_BUFFERS`, which must be allocated on RAM area since they are used by Ethernet DMAC, Direct Memory Access Controller, connected to RX63N.

## Assign Address in Linker Script

Next, write a linker script in order to allocate the sections. In my case, I wrote the following code with `SECTIONS` command.

	OUTPUT_ARCH(rx)
	SECTIONS
	{
		_RX_DESC          0x00000000 : { }
		_TX_DESC          0x00000080 : { }
		_ETHERNET_BUFFERS 0x00000100 : { }
		....(snip)....
	}

The address to be allocated comes to next to the section name. So the above section declarations say;

* `_RX_DESC` will be put at 0x00000000
* `_TX_DESC` will be put at 0x00000080
* `_ETHERNET_BUFFERS` will be put at 0x00000100

After creating the script, you can tell `ld` (or `gcc` alternatively) to use the linker script with `-T`.

The following is an example command line.

	rx-elf-ld -Map path/to/mapfile.map -T path/to/linker/script.ld -nostartfiles -lwhatever whatever.a -o path/to/output.elf

With `-Map`, you will get a map file telling you how ld allocated the binary. With `-T`, you can specify the linker script. Run `man ld` for further options.

## Review How Sections being Allocated

As described above, you can review the memory allocation with the map file which `ld` generates. Now take a look at the map file.

Open the map file, and find a section named `Linker script and memory map`.

	Memory Configuration

	Name             Origin             Length             Attributes
	*default*        0x0000000000000000 0xffffffffffffffff

	Linker script and memory map


	_RX_DESC        0x0000000000000000       0x80
	 _RX_DESC       0x0000000000000000       0x80 /path/to/build/out/gr-sakura/libfreetcpipport.a(EMAC.o)
	                0x0000000000000000                xRxDescriptors

	_TX_DESC        0x0000000000000080       0x20
	 _TX_DESC       0x0000000000000080       0x20 /path/to/build/out/gr-sakura/libfreetcpipport.a(EMAC.o)
	                0x0000000000000080                xTxDescriptors

	_ETHERNET_BUFFERS
	                0x0000000000000100      0xa04
	 _ETHERNET_BUFFERS
	                0x0000000000000100      0xa04 /path/to/build/out/gr-sakura/libfreetcpipport.a(EMAC.o)
	                0x0000000000000100                xEthernetBuffers

As you can see, `ld` did a good job!

## Add Option to Objcopy

Finally, you have to tell `objcopy` to exclude the sections with `-R` option on generating a raw binary with `-O binary` option. Without the `-R` option, `objcopy -O binary` will generates a huge size of file since `objcopy` tries to write RAM area as well as ROM area.

The following command tells `objcopy` to ignore the 3 sections on the raw binary generation. 

	rx-elf-objcopy -O binary -R _RX_DESC -R _TX_DESC -R _ETHERNET_BUFFERS \
	build/out/gr-sakura/ssep/client.elf \
	build/out/gr-sakura/gr_sketch.bin
