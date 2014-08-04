---
layout: post
title: "Sparkfun CC3000 Shield got worked with mbed"
category: posts
posted_by: dbaba
---
I bought a Sparkfun's Wifi Shield for Arduino with TI CC3000 chip. Thanks to lots of the [examples](https://github.com/sparkfun/SFE_CC3000_Library/tree/master/examples), I successfully got it working on Arduino.

Now, I want to make it work on my mbed board, FRDM-KL25Z (rev. E). According to the [CC3000 Cookbook](https://mbed.org/cookbook/cc3000) page on mbed.org, it seems to provide enough information to do that.

However, all the examples refer to either [WiGO](http://www.em.avnet.com/en-us/design/drc/Pages/Avnet-Wi-Go-Module.aspx) or [WiFi DipCortex](https://mbed.org/platforms/WiFi-DipCortex/). Sparkfun's CC3000 shiled information is missing. So I describe the information regarding Sparkfun CC3000 Shield on mbed boards through my trials-and-errors.

![Sparkfun CC3000 and KL25Z](img/posts/2014-08-04-Sparkfun-CC-3000-on-mbed/sf_cc3000_kl25z.png)

# Prerequisites

1. mbed board (I used Freescale's [FRDM-KL25Z/rev.E](http://www.freescale.com/webapp/sps/site/prod_summary.jsp?code=FRDM-KL25Z))
1. [Sparkfun CC3000 Shield](https://www.sparkfun.com/products/12071)
1. mbed account in order to compile source codes

# Using cc3000\_hostdriver\_mbedsocket

[cc3000_hostdriver_mbedsocket](https://mbed.org/users/Kojto/code/cc3000_hostdriver_mbedsocket/) is the most popular library in the mbed site. Let's have a look at this library.

## cc3000 class

The key class is `cc3000`, which has a constructor taking the following parameters:

1. `cc3000_irq:PinName`    ... IRQ
1. `cc3000_en:PinName`     ... Enabling CC3000
1. `cc3000_cs:PinName`     ... SPI Chip Select
1. `cc3000_spi:SPI`        ... SPI
1. `ssid:const char *`     ... SSID
1. `phrase:const char *`   ... password
1. `security:Security`     ... WiFi Security Type (WEP, WPA, etc.)
1. `smartConfig:bool`      ... Smart Configuration (Not sure what this is, though)

## Sparkfun CC3000 Wifi Shield connections and Pin Mappings

(from https://github.com/sparkfun/SFE_CC3000_Library/blob/master/examples%2FPingTest%2FPingTest.ino)

| Uno Pin | CC3000 Board |  Function        | FRDM-KL25Z |
| ------- | ------------ | ---------------- | ---------- |
| +5V     | VCC or +5V   |  5V              | **+5V**    |
| GND     | GND          |  GND             | **GND**    |
| 2       | INT          |  Interrupt       | **PTD4**   |
| 7       | EN           |  WiFi Enable     | **PTC9**   |
| 10      | CS           |  SPI Chip Select | **PTD0**   |
| 11      | MOSI         |  SPI MOSI        | **PTD2**   |
| 12      | MISO         |  SPI MISO        | **PTD3**   |
| 13      | SCK          |  SPI Clock       | **PTD1**   |

With USB connection, FRDM-KL25Z is able to supply 5V so that CC3000 Wifi shield is able to work.
If you'd like to use battery power supply, you need to hack the rev. E board as described this [post](http://www.element14.com/community/docs/DOC-55214/l/review-for-frdm-kl25z-rev-e-and-modify-it-to-generate-5v-from-vin)(see `Modify your FRDM-KL25Z revE to Generate 5V from V_IN`).

As shown above, FRDM-KL25Z pin mappings to CC3000 board are resolved. So the cc3000 class constructor can be invoked like this:

```c++
cc3000 wifi(PTD4, PTC9, PTD0, SPI(PTD2, PTD3, PTD1), "your-ssid", "wifi-password", WPA2, false);
```

Where `SPI` constructor declaration is:

```c++
SPI(PinName mosi, PinName miso, PinName sclk, const char *name = NULL);
```

## Sample Code

I imported and modified the sample code available [here](https://mbed.org/users/Kojto/code/cc3000_hello_world_demo/).

What I modified the code is:

1. Removes the board specific macro to declare cc3000 object and places the above cc3000 declaration
2. Removes the board dependent `init()` function call

Here is the modified code (`main.cpp`):

```c++
#include "mbed.h"
#include "cc3000.h"

using namespace mbed_cc3000;

#define SSID "your-ssid"
#define PASSWORD "your-password"

cc3000 wifi(PTD4, PTC9, PTD0, SPI(PTD2, PTD3, PTD1), SSID, PASSWORD, WPA2, false);

Serial pc(USBTX, USBRX);

int main() {
    pc.baud(115200);
 
    printf("cc3000 Hello World demo. \r\n");
    wifi.init();
    if (wifi.connect() == -1) {
        printf("Failed to connect. Please verify connection details and try again. \r\n");
    } else {
        printf("IP address: %s \r\n",wifi.getIPAddress());
        printf("\r\ncc3000 connected to the Internet. Demo completed. \r\n");
    }
 
    wifi.disconnect();
}
 ```

## How to compile

Open the mbed compiler, create a new project, import this [library](http://mbed.org/users/Kojto/code/cc3000_hostdriver_mbedsocket/), create a new file named `main.cpp` and then copy-and-paste the above sample code.

Finally, clicking `Compile` button will download a binary file.

## Sample Code Output
Make sure your Wifi AP/router is working and you will get the following output via serial terminal.

```text
cc3000 Hello World demo. 
IP address: 192.168.1.58 

cc3000 connected to the Internet. Demo completed. 
```

Of course, the acutual IP address may be different from the above.
