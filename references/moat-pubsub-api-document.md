---
sitemap:
 priority: 0.6
 changefreq: weekly
 lastmod: 2014-05-30T00:00:00
name: moat-pubsub-api-document.html
title: "Inventit Iot developer Network | References | MOAT PubSub"
layout: references
breadcrumbs:
-
 name: References
 url: /references.html
-
 name: MOAT PubSub
 url: /references/moat-pubsub-api-document.html
---
# MOAT PubSub
Publish/Subscribe API for MOAT applications

### Version
1.0.0

### Table of Contents

1. [Overview](#Overview)
1. [Supported Protocols](#SupportedProtocols)
1. [Sandbox Environment](#SandboxEnvironment)
1. [Authentication](#Authentication)
1. [Device Enrollment](#DeviceEnrollment)
1. [Message Topics](#MessageTopics)
1. [Topic Access Control](#TopicAccessControl)
1. [Payload Container Formats & Encryption](#PayloadContainerFormats)
1. [Model Design Conventions](#ModelDesignConventions)

<div id="Overview" class="anchor"></div>
### Overview

MOAT PubSub API is a specification allowing developers to use message exchange between devices and applications in Publish/Subscribe paradigm.
With the API, developers are able to build event-based applications.

[MOAT Java/Android](/references/moat-java-api-document.html) API, [MOAT C](/references/moat-c-api-document.html) API and [MOAT js](references/moat-js-api-document.html) API are used for creating session-based applications which contain complex interactions, including RPC (Remote Procedure Call), between clients and servers for completing a single task. Such the sequence of interactions is called a 'session'.

<image src="/img/references/moat-pubsub-api-session-based.png" alt="Responsive image" class="img-rounded img-responsive" />

The session-based application is suited for performing a task including a bunch of subtasks and conditional actions such as firmware update which includes, for instance, 1) to retrieve the existing firmware version, 2) to deliver a URL to download 3) to notify the firmware update result.

On the other hand, the event-based application is suited for transmitting small stream data and/or receiving notifications continuously, periodically and/or incidentally.

<image src="/img/references/moat-pubsub-api-event-based.png" alt="Responsive image" class="img-rounded img-responsive" />

<div class="alert alert-info">
<strong>Terminology</strong><br />

We call the upstream event from a device <code>Event</code> whereas the downstream event to a device <code>Action</code> here.
</div>

Users will be able to use MOAT PubSub API together with [MOAT Java/Android](/references/moat-java-api-document.html) API, [MOAT C](http://localhost:4000/references/moat-c-api-document.html) API and [MOAT js](http://localhost:4000/references/moat-js-api-document.html) API if the target device has enough capabilities.

MOAT PubSub specification also includes:

- [device enrollment protocol with HTTP](#DeviceEnrollment)
- [payload encryption](#PayloadContainerFormats.PayloadEncryption) in order for resource-constrained devices to communicate with MOAT runtime environment (server side platform runtime) at the non-SSLed MQTT layer
- [payload container format](#PayloadContainerFormats) for having meta data of the payload such as content type or encryption method

<image src="/img/references/moat-pubsub-api-overview.png" alt="Responsive image" class="img-rounded img-responsive" />

- ① Gateways/Clients will be able to use MOAT PubSub as well as their existing protocol (OMA-DM based)
- ② Resource-constrained devices can directly connect MOAT runtime environment if they have internet connectivity capabilities
- ③ User applications can access MOAT runtime environment via WebSockets with SSL
- ④ Resource-constrained devices without internet connectivity capabilities will be able to reach MOAT runtime environment with ServiceSync Gateway/Client's help

<div id="SupportedProtocols" class="anchor"></div>
## Supported Protocols

MOAT PubSub employs [MQTT v3.1.1](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.html) as the message protocol.
Authentication and authorization are performed under the protocol.

MOAT PubSub can be serviced with [WebSockets](http://datatracker.ietf.org/doc/rfc6455/?include_text=1) as the transport protocol.
Transport encryption (SSL/TLS) is able to be provided in conjunction with WebSockets as well.

<div id="SandboxEnvironment" class="anchor"></div>
## Sandbox Environment

ServiceSync Sandbox Cloud provides the following services:

 1. MQTT over WebSockets with SSL at port `443`
 1. MQTT over WebSockets without SSL at port `80`
 1. Plain MQTT only for devices at port `1883`

Note that all devices are able to use the above 3 transports but user applications are only allowed to use WebSocket transports.

<div id="Authentication" class="anchor"></div>
## Authentication

There are 2 kinds of authentication in MOAT PubSub specification, one for devices and the other for users.

Both authentication methods use the following parameters:

 1. Client ID (always required)
 1. Username (can be empty)
 1. Password (always required)

Each value can be specified as described below depending on the type of authentication.

### Device Authentication
Device authentication is performed with a device account, which is issued by MOAT runtime environment via [Device Enrollment](#DeviceEnrollment) process.

MOAT PubSub device authentication requires the following parameters:

 1. `dev:<Device UUID>` as Client ID
 1. `<Client Generating Nonce>?<Query Parameters>` as Username
 1. `HEX(HMAC-SHA1(text=<Device UUID>:<Username>, key=<AES Key>))` as Password

Each parameter value is described below.

##### &lt;Device UUID&gt;
This value is assigned by MOAT runtime environment and is coming at Phase 2 of [Device Enrollment](#DeviceEnrollment).
You can get the value by accessing `uid` property in the enrollment response JSON.

Make sure `dev:` prior to `<Device UUID>` is required as Client ID.

##### &lt;Client Generating Nonce&gt;
This value must be a positive signed 64 bit integer. The value is expected to be incremented whenever a client repeatedly accesses MOAT runtime environment within a specific time window. However, the value can be an arbitrary value when:

 1. the client is accessing MOAT runtime environment first time
 1. the time since the client's last access exceeds the specific time window

The time window is set to 5 minutes in ServiceSync Sandbox environment for now.

<div id="Authentication.QueryParameters" class="anchor"></div>
##### ? and &lt;Query Parameters&gt;
These values are optional. You can use them like URL query parameters in order to tell MOAT runtime environment some extra requriements regarding the message session.

The supported parameters are as follows:

 1. `c` parameter for the type of payload container format (**applied for both receiving and sending messages**). `Raw` or `MoatV1` is available as its value for now (case-sensitive).
   - `Raw` means the payload itself is a container, without any headers and footers. Used by default.
   - `MoatV1` is a [MOAT PubSub specific container format](#PayloadContainerFormats.MoatV1)
   - When the value is `MoatV1`, the following parameters are available:
      1. `e1` parameter for the message encoding type
          1. `0xeeeb` for encrypted with AES 256bit ECB padding and PKCS#7 format (default)
          1. `0xeeec` for encrypted with AES 256bit CBC padding and PKCS#7 format
          1. `0` for not encoded
      1. `f1` parameter for the message format type (Content-Type in HTTP)
          1. `0x2a` for `application/octet-stream` (default)
          1. `0x32` for `application/json `

`?` is required as a delimiter between the nonce and query parameters whenever you pass the query parameters.

The `0x` prefix in the above values is optional. You can use `32` as well as `0x32`, for instance.

Username examples using query parameters:

`Raw` with a nonce `1234567`:

    1234567?c=Raw

`MoatV1` with a nonce `1234567`:

    1234567?c=MoatV1&e1=eeeb&f1=32

##### HEX(HMAC-SHA1(text=&lt;Device UUID&gt;:&lt;Username&gt;, key=&lt;AES key&gt;))
The pseudo functions in the formula are:

 1. `HEX(val)` returns a hex string of the `val` byte array
 1. `HMAC-SHA1(text, key)` returns HMAC SHA1 message digest of the `text` with the given `key` byte array

`<AES Key>` is a byte array value passed from MOAT runtime environment through [Device Enrollment](#DeviceEnrollment) as `aesKey` property value.

Note that the `<Username>` may contain the query parameters as [described above](#Authentication.QueryParameters).
  
###### Example

Suppose we have the following values:

 - `<Device UUID>` is `4028813a438a6e6c01438a76510d0307`
 - `<Username>` is `1234567?c=MoatV1&e1=eeeb&f1=2a`
 - `<AES Key>` in HEX format is `ffffffffffffffffffffffffffffffff`

Then we will get `5b3da245d1c1b61fbc61aded621dbee09c685d91` as Password (case-insensitive).

The Ruby code snip is as follows:

```ruby
require 'digest/hmac'
digest = Digest::HMAC.hexdigest("4028813a438a6e6c01438a76510d0307:1234567?c=MoatV1&e1=eeeb&f1=2a",
  ["ffffffffffffffffffffffffffffffff"].pack('H*'),Digest::SHA1)
puts digest
```

Here, written in Java:

```java
import org.apache.commons.codec.binary.Hex; // from Commons Codec
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
...
final SecretKeySpec key = new SecretKeySpec(
		Hex.decodeHex("ffffffffffffffffffffffffffffffff".toCharArray()),
		"HmacSHA1");
final Mac mac = Mac.getInstance("HmacSHA1");
mac.init(key);
final byte[] digest = mac.doFinal("4028813a438a6e6c01438a76510d0307:1234567?c=MoatV1&e1=eeeb&f1=2a".getBytes());
System.out.println(new String(Hex.encodeHex(digest)));
```
### User Authentication
The user authentication of MOAT PubSub API requires MOAT REST API authentication as well in order for the Cloud Server to manage the authentication session period. Therefore, a user application using MOAT PubSub API must access the server with MOAT REST API, and then try to connect the server with the Pub/Sub manner.

MOAT PubSub user authentication requires the following parameters:

 1. `usr:<ClientID>` as Client ID
 1. `?<Query Parameters>` as Username, Optional (can be empty)
 1. `<AccessToken>` as Password

where

 * `<ClientID>` is the ID of a MOAT account, e.g. `usr:admin@abcdefgh0123456789`
 * `c=Raw` is supported for `<Query Parameters>`, `MoatV1` is not supported
 * `<AccessToken>` is the value of `accessToken` property returned after MOAT REST authentication, having approx. 180 to 200 bytes length

Username shall not be used so leave it empty.

<div id="DeviceEnrollment" class="anchor"></div>
## Device Enrollment for PubSub Client

MOAT PubSub is expected to be used for resource-constrained devices as well as smart devices running on Linux or other embedded OSes.
In order for clients supporting MOAT PubSub to enroll the Cloud Server, they can use this Device Enrollment REST API.

Note that [MOAT Java/Android](/references/moat-java-api-document.html) API and [MOAT C](http://localhost:4000/references/moat-c-api-document.html) API are **not available** when clients enroll with the Device Enrollment REST API since the API doesn't provide enough information to interact with MOAT runtime environment using the [MOAT Java/Android](/references/moat-java-api-document.html) API and [MOAT C](http://localhost:4000/references/moat-c-api-document.html) API.

The Device Enrollment REST API is dedicated for clients which **only** handle MOAT PubSub rather than [MOAT Java/Android](/references/moat-java-api-document.html) and [MOAT C](http://localhost:4000/references/moat-c-api-document.html). 

<image src="/img/references/moat-pubsub-api-enrollment.png" alt="Responsive image" class="img-rounded img-responsive" />

<div id="DeviceEnrollment.Prerequisites" class="anchor"></div>
### Prerequisites
Prior to the enrollment, the following information is required:

 1. `domainId`, the right part of `@` in `clientId` value
 1. `enrollmentId`
 1. `enrollmentPassword`

These are available when a new account is created (by [IIDN-CLI](https://github.com/inventit/iidn-cli) or [Chrome browser](/tools/signup.html)), or an existing account is reset.

### Phase 1 (Challenge)
This is an initial phase for a client to start the device enrollment session.

#### HTTP Method
    POST

<div id="DeviceEnrollment.Phase1.URLform" class="anchor"></div>
#### URL form
    http://{:host}:{:port}/moat/v1/sys/device

where:

- `{:host}` is the host of MOAT runtime environment
- `{:port}` is the port numberof MOAT runtime environment

The recommended scheme is `http` since the request body is already encrypted. However, SSL can be applied if necessary.

<div id="DeviceEnrollment.Phase1.RequestHeaders" class="anchor"></div>
#### Request Headers
- `Content-Type`
  - Always `application/json`
  - **Mandatory**
- `Content-Encoding` used for specifying the encryption type:
  - `x-inventit-aes-256-ecb-pkcs7` for AES 256bit ECB padding with PKCS#7 format
  - `x-inventit-aes-256-cbc-pkcs7` for AES 256bit CBC padding with PKCS#7 format
     - This encoding type requires `X-IV` header as well
  - **Mandatory**
- `X-Inventit-EnrollmentUserId`
  - Providing the [enrollmentId](#DeviceEnrollment.Prerequisites)
  - **Mandatory**
- `X-Inventit-DomainId`
  - Providing the [domainId](#DeviceEnrollment.Prerequisites)
  - **Mandatory**
- `X-Content-Digest`
  - HMAC-SHA1 digest of the plain JSON body (the request body prior to encryption) in HEX string format
  - The secret key is same as the one used for AES encryption
  - **Mandatory**
- `X-IV`
  - The IV (Initialization Vector) in HEX string format used for CBC padding (i.e. `x-inventit-aes-256-cbc-pkcs7` content encoding)
  - Optional

#### Request Body Encryption
The request body **must** be encrypted with `enrollmentPassword`. Here describes the method for creating a secret key with the `enrollmentPassword`.

Note that this secret key is used only at Phase 1 of the device enrollment. It is never used for other purposes such as PubSub messaging since an AES key for such the purposes is always generated by MOAT runtime environment during the device enrollment process.

The `enrollmentPassword` is a Base64 text and its decoded data length is 28, the first 8 octets for a salt and the remainder for the passphrase.

      0 1 2 3 4 5 6 7 8 9 ...    23  25  27 (byte)
     +-+-+-+-+-+-+-+-+-+-+...-+-+-+-+-+-+-+
     |  SALT Bytes   |     Passphrase     |
     +---+---+---+---+---+...-+-+-+-+-+-+-+


In order to create an AES key, you need to compute [PBKDF2](http://en.wikipedia.org/wiki/PBKDF2) with the following parameters:

1. 8-octet salt in the `enrollmentPassword`
1. 20-octet passphrase in the `enrollmentPassword`
1. the number of iteration is 1
1. the length of the generated key is 256

Here is a Python example to generate a secret key (`pbkdf2` module, which can be installed by `sudo pip install pbkdf2`, is required).

```python
from pbkdf2 import PBKDF2
import base64

...

enrollment_password_base64 = "Base64 encoded text"

enrollment_password_bytes = base64.b64decode(enrollment_password_base64)
salt_bytes = enrollment_password_bytes[:8]
password_bytes = enrollment_password_bytes[8:]
    
aes_key = PBKDF2(password_bytes, salt_bytes, 1) # the number of iteration is 1
```

#### Pre-encrypted Request Body Structure
The plain data of the request body should be serialized in JSON format.

As the [URL form](#DeviceEnrollment.Phase1.URLform) represents, the structure of this JSON object is basically identical with [`device`](/references/moat-rest-api-document.html#device) object in [MOAT REST](/references/moat-rest-api-document.html) API.
However, all attributes of the [`device`](/references/moat-rest-api-document.html#device) object are not mandatory.

The typical JSON body is as follows.

    {
        "deviceId":"<Device ID>",
        "name":"<Device Name, Optional>",
        "{arbitrary key}":"<arbitrary tag value. Optional>"
    }

Note that `{}` of `{arbitrary key}` is not required for arbitrary keys.

Here is a list of the available attributes.

- `deviceId` ... The URN form of a device specific identifier. **Mandatory**. See [here](/references/moat-rest-api-document.html#device) for detail.
- `name` ... The addressing name of the device. Optional but `deviceId` is used if this attribute is missing. See [here](/references/moat-rest-api-document.html#device) for detail.
- `{arbitrary key}` ... User definied attribute. Optional. See [here](/references/moat-rest-api-document.html#device) for detail.
    - You cannot use the predefined attributes of the [`device`](/references/moat-rest-api-document.html#device) object

Any other attributes than above are always ignored.

#### Response Status
The status code must be 200. Other status code always means the failure.

#### Response Headers
Same as the above [Request Headers](#DeviceEnrollment.Phase1.RequestHeaders).

<div id="DeviceEnrollment.Phase1.ResponseBody" class="anchor"></div>
#### Response Body
The response body is encrypted with the same key as used for the initial request.

The decrypted response body looks like this:

    {
        "uid":"<Device UUID assigned by MOAT runtime environment>",
        "status":"I",
        "deviceId":"<DeviceID>',
        "name":"<DeviceID or name>',
        "aesKey": "<Base64 encoded AES key>',
        "expiredAt":"<Timeout of an acknowledgement request, RFC2822 format, e.g. Sun, 06 Nov 1994 08:49:37 GMT>',
        "pubsubAddress":"<MOAT runtime environment pubsub destination address>',
        "pubsubTcpPort":<MOAT runtime environment pubsub destination port>,
        "{arbitrary key}":"<arbitrary tag value if exists>"
    }

### Phase 2 (Enrollment)
At this phase, a client must notify the acknowledgement message to MOAT runtime environment.

#### HTTP Method
    PUT

#### URL form
Same as [Phase 1](#DeviceEnrollment.Phase1.URLform).

#### Request Headers
Same as [Phase 1](#DeviceEnrollment.Phase1.RequestHeaders).

#### Request Body
The request body **must** be encrypted with the `aesKey` included in the [response body at Phase 1](#DeviceEnrollment.Phase1.ResponseBody).

The request body looks like this.

    {
        "status":"A"
    }

As shown above, `status` property is mandatory. But other properties are optional. You can provide other `device` properties if you need to update them at this time.

#### Response Status
The status code must be 200. Other status code always means the failure.

#### Response Headers
Same as the above [Request Headers](#DeviceEnrollment.Phase1.RequestHeaders).

#### Response Body
We don't have any response body associated with the `PUT` request. The behavior is consistent through all the `PUT` MOAT REST operations.

<div id="MessageTopics" class="anchor"></div>
## Message Topics

Topics are case-sensitive. Therefore, the model name is always case-aware unlike MOAT REST API, which accepts case-insensitive model names.

The <a href="moat-iot-model-descriptor.html#ScopeOfModels">scope of models</a>, which are able to be included in a topic, must be `device`. The other scopes than `device` will be supported in the future.

Topics must take the following structure.

    /<AppId>/<PackageId>/<ModelName>/<DeviceDomain>/<DeviceUUID>

where

 * `<AppId>` and `<PackageID>` are IDs of an application package where the model is defined
 * `<ModelName>` is the name of the model defined in the [Model Descriptor](/references/moat-iot-model-descriptor.html)
 * `<DeviceDomain>` is the identifier of a domain where the device belongs
 * `<DeviceUID>` is the uid of the device

All the nodes are mandatory for the message publishing.

Regarding the message subscription, you may be able to use the wildcard character `#`. However, the wildcard must be strictly controlled by the topic access control described later.

<div id="TopicAccessControl" class="anchor"></div>
## Topic Access Control
Topic access is strictly controlled per account role. This access control enables multi-tenancy functionality as well by introducing the user's domain into the topic structure illustrated above.

The following is a list of account roles:

1. Application Provider ... a user creating/deploying an application package
1. Device Owner ... a user associated with a device
1. Device ... a device

It's possible for a single user account to have `Application Provider` and `Device Owner`.
In that case, the user creates an application and the user's devices subscribe the user's application.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Role </th>
    <th> Accessible Topics </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> Application Provider </td>
    <td>
      <ul>
        <li><code>/&lt;AppId&gt;/#</code></li>
        <li><code>/&lt;AppId&gt;/&lt;PackageId&gt;/#</code></li>
        <li><code>/&lt;AppId&gt;/&lt;PackageId&gt;/&lt;ModelName&gt;/#</code></li>
        <li><code>/&lt;AppId&gt;/&lt;PackageId&gt;/&lt;ModelName&gt;/&lt;DeviceDomain&gt;/#</code></li>
        <li><code>/&lt;AppId&gt;/&lt;PackageId&gt;/&lt;ModelName&gt;/&lt;DeviceDomain&gt;/&lt;DeviceUUID&gt;</code></li>
    </ul>
    Note that <code>&lt;AppId&gt;</code> MUST be the applicaton provider's applicationId. Cannot access other application than the application provider's. <br />
    <code>&lt;DeviceDomain&gt;</code> MUST be a domain of a user, owning one or more devices, who subscribes the application provider's app. <br /><br />
    
    <div class="alert alert-info">
    <strong>Application Subscription Management</strong><br />

    As described above, Device Owners are able to subscribe arbitrary applications.
    However, there isn't any API to manage the subscription yet. <br />
    Therefore, each Device Owner cannot subscribe other users' apps yet but can subscribe the Device Owner's apps.
    Application Subscription Management API will be released in the future.
    </div>
    
    </td>
  </tr>
  <tr>
    <td> Device Owner </td>
    <td>
      <ul>
        <li><code>/&lt;AppId&gt;/&lt;PackageId&gt;/&lt;ModelName&gt;/&lt;DeviceDomain&gt;/#</code></li>
        <li><code>/&lt;AppId&gt;/&lt;PackageId&gt;/&lt;ModelName&gt;/&lt;DeviceDomain&gt;/&lt;DeviceUUID&gt;</code></li>
    </ul>
    Note that <code>&lt;DeviceDomain&gt;</code> MUST be the device owner's domain and a device of the <code>&lt;DeviceUUID&gt;</code> MUST belong to the device owner.
    </td>
  </tr>
  <tr>
    <td> Device </td>
    <td>
      <ul>
        <li><code>/&lt;AppId&gt;/&lt;PackageId&gt;/&lt;ModelName&gt;/&lt;DeviceDomain&gt;/&lt;DeviceUUID&gt;</code></li>
    </ul>
    Note that <coce>&lt;DeviceUUID&gt;</code> MUST be identical to the device itself. Cannot access other device than the device.
    </td>
  </tr>
</tbody>
</table>

<div id="PayloadContainerFormats" class="anchor"></div>
## Payload Container Formats & Encryption
Message payload is often enclosed by a container data including the payload meta data.
MOAT PubSub offers its specific container format, called `MoatV1` format, in order for MOAT runtime environment, acting as a message broker, to provide message encryption/decryption, message validation and MOAT model processing functionalities.

You can also select the naked `Raw` format as a container in order to carry opaque data to endpoints.

Note that user accounts are always assumed to use `Raw` even if `c=MoatV1` is specified as data encryption is expected to be offered at transport layer (e.g. TLS).

<div id="PayloadContainerFormats.MoatV1" class="anchor"></div>
### MoatV1 Container Format
This format is a binary format rather than a text format.
In this format, each item entry must be assigned to the fixed position except for `X-IV` header, which is required for CBC padding.

The following items are available for the format.
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Item </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> Start Code </td>
    <td> Always <code>0xFF</code>. <b>Mandatory</b> </td>
  </tr>
  <tr>
    <td> Content-Encoding header </td>
    <td> Always <code>0xBEEEE</code>. <b>Mandatory</b> </td>
  </tr>
  <tr>
    <td> Content-Encoding value </td>
    <td> One of the following 2-octet value:
      <ul>
        <li><code>0xEEEB</code> for x-inventit-aes-256-ecb-pkcs7</li>
        <li><code>0xEEEC</code> for x-inventit-aes-256-cbc-pkcs7</li>
        <li><code>0x0000</code> for no encoding (Not available for the device enrollment)</li>
      </ul>
      <b>Mandatory</b>
    </td>
  </tr>
  <tr>
    <td> Content-Format header </td>
    <td> Always <code>0x0C</code>. <b>Mandatory</b> </td>
  </tr>
  <tr>
    <td> Content-Format value </td>
    <td> One of the following 2-octet value:
      <ul>
        <li><code>0x0032</code> for application/json</li>
      </ul>
      The available value will be added in the future. <b>Mandatory</b>
    </td>
  </tr>
  <tr>
    <td> X-IV header </td>
    <td> Always <code>0x06</code>. This header is required only for <code>x-inventit-aes-256-cbc-pkcs7</code> Content-Encoding. </td>
  </tr>
  <tr>
    <td> X-IV value </td>
    <td> 16 bytes length Initialization Vector value used for the enclosed payload encryption. </td>
  </tr>
  <tr>
    <td> X-Content-Digest header </td>
    <td> Always <code>0x04</code>. <b>Mandatory</b> </td>
  </tr>
  <tr>
    <td> X-Content-Digest value </td>
    <td> HMAC-SHA1 message digest of the plain payload (prior to encryption). Its length is always 20. <b>Mandatory</b> </td>
  </tr>
</tbody>
</table>

These items are mapped to a binary array as described below.

#### Container Layout Without X-IV header
This is a typical container layout without `X-IV` header.

      0    1   2   3   4   5   6   7  (byte)
     +---+---+---+---+---+---+---+---+
     |FF |BE  EE |EE  EB |0C |00  32 |
     +---+---+---+---+---+---+---+---+
     |04 |HMacSHA1 DIGEST 20 bytes ..
     +---+---+---+---+---+---+---+---+
      ...............................
     +---+---+---+---+---+---+---+---+
      ..................>| Payload ..
     +---+---+---+---+---+---+---+---+

#### Container Layout With X-IV header
This is a typical container layout including `X-IV` header and its value.

      0    1   2   3   4   5   6   7  (byte)
     +---+---+---+---+---+---+---+---+
     |FF |BE  EE |EE  EC |0C |00  32 |
     +---+---+---+---+---+---+---+---+
     |06 | Initialization Vector ....
     +---+---+---+---+---+---+---+---+
      16 bytes ......................
     +---+---+---+---+---+---+---+---+
      ..>|04 |HMacSHA1 DIGEST 20 bytes
     +---+---+---+---+---+---+---+---+
      ...............................
     +---+---+---+---+---+---+---+---+
      ..................>| Payload ..
     +---+---+---+---+---+---+---+---+

You can choose this layout even though you don't need `X-IV` header because MOAT runtime environment shall ignore the value unless Content-Encoding of a message is `x-inventit-aes-256-cbc-pkcs7`.

<div id="PayloadContainerFormats.PayloadEncryption" class="anchor"></div>
### Payload Encryption
[MoatV1 container format](#PayloadContainerFormats.MoatV1) offers payload encryption and decryption.
Clients using payload encryption must tell MOAT runtime environment the encryption type when they connect to MOAT runtime environment with the [`e1` query parameter](#Authentication.QueryParameters).

The supported encryption types are as follows:

 1. AES 256bit ECB padding and PKCS#7 format
 1. AES 256bit CBC padding and PKCS#7 format
 1. Plain format (no encryption)

With CBC padding, IV(Initialization Vector) must be provided with `X-IV` header.

A PubSub client claiming `Raw` format is able to receive a decrypted message sent from another PubSub client claiming `MoatV1` format with AES encryption because MOAT runtime environment is automatically performing the message encryption/decryption during message transportation.

<div id="ModelDesignConventions" class="anchor"></div>
## Model Design Conventions
Devices are allowed to subscirbe/publish the same model though it is essentially meaningless.

In order to avoid such the incorrect use of models, here describes the model design conventions.

### Naming Conventions
The name of the upstream data model from a device MUST end with `Event`. Devices should NOT subscribe models having `Event` suffix.

The name of the downstream data model to a device MUST end with `Action`. Devices should NOT publish models having `Action` suffix.

