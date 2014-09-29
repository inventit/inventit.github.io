---
sitemap:
 priority: 0.6
 changefreq: weekly
 lastmod: 2014-05-16T00:00:00
name: moat-java-api-document.html
title: "Inventit Iot developer Network | References | MOAT Java/Android"
layout: references
breadcrumbs:
-
 name: References
 url: /references.html
-
 name: MOAT Java/Android
---
# MOAT Java/Android

Java API for client MOAT applications

### Version
1.1.1 (library version: 4.1.5)

See [here](/references/moat-java-api-document/changes.html) for change history.

## Table of Contents
　
### MOAT Java
- [Moat](#Moat) interface
- [ModelMapper](#ModelMapper) interface
- [Command](#Command) annotation (JDK1.5+ only. See [here](#Command.jdk14) for JDK1.4)
- [ResourceType](#ResourceType) annotation (JDK1.5+ only. See [here](#ResourceType.jdk14) for JDK1.4)
- [Model](#Model) annotation (JDK1.5+ only. See [here](#Model.jdk14) for JDK1.4)
- [PubSub](#MOATPubSub) Java/Android interfaces for [MOAT PubSub](/references/moat-pubsub-api-document.html)
- [Future](#Future) interfaces

### MOAT Android
- [MoatAndroidFactory](#MoatAndroidFactory) class
- [MoatInitResult](#MoatInitResult) class
- [AndroidManifest.xml](#AndroidManifestxml) for your APK

## MOAT Java

<div id="Moat" class="anchor"></div>
### MOAT Interface

This is an entry point of MOAT Java/Android/OSGi API. You don't have to implement this interface since the instance of the interface should be provided by the underlying runtime application or library.

#### Android Example

```java
final byte[] token = toByteArray(
    context.getAssets().open(
    "moat/signed-token-file"));
final MoatAndroidFactory factory = MoatAndroidFactory.getInstance();
factory.initMoat(token, context)
  .then(
    new DoneCallback<MoatInitResult, Throwable>() {
      public void onSuccess(MoatInitResult result) {
        final ContextFactory contextFactory = ...;
        final ModelMapper blockDaoOrmlite = ...;
        moat.registerModel(
          Block.class, blockDaoOrmlite, contextFactory);
      }
      public void onFailure(Throwable throwable) {
        if ("....".eqauls(throwable.getMessage())) {
             :
             :
        }
             :
             :
      }
});
```

#### OSGi Example

```java
final ContextFactory contextFactory = ...;
final ModelMapper blockDaoOrmlite = ...;
final ServiceReference<Moat> sysMoatRef =
    bundleContext.getServiceReference(Moat.class);

// global Moat object
final Moat sysMoat = bundleContext.getService(sysMoatRef);

// local Moat object
final Map<String, Object> additionalProperties = new HashMap<String, Object>();
additionalProperties.put("urn:inventit:dmc:app:application-id", APP_ID);
additionalProperties.put("urn:inventit:dmc:app:package-id", PACKAGE_ID);
additionalProperties.put("urn:inventit:dmc:domain-id", DOMAIN_ID);

final Moat moat = sysMoat.newInstance(Moat.class, additionalProperties);
moat.registerModel(Block.class, blockDaoOrmlite, contextFactory);

             :
             :

bundleContext.ungetService(sysMoat);
```

`bundleContext` is an org.osgi.framework.BudleContext instance. <br/>
`Moat` instance is associated with its FQDN in the bundleContext.

`context` is an android.content.Context instance.<br />
`toByteArray` is a pseudo code, you can get the code by search engine with `inputstream to byte array`.<br />
`moat/signed-token-file` is a token file signed by both MOAT server runtime environment and developers themselves.

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Signature </th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> registerModel(<br />
        &nbsp; c:Class&lt;T&gt;,<br />
        &nbsp; m:ModelMapper&lt;T&gt;) </td>
      <td> N/A<br /></td>
      <td> Registers a new model class and ModelMapper associated with the class.<br />
        <code>c</code> is the class object of the model object.<br />
        <code>m</code> is a <code>ModelMapper</code> instance corresponding to the model. </td>
    </tr>
    <tr>
      <td> registerModel(<br />
        &nbsp; c:Class&lt;T&gt;,<br />
        &nbsp; m:ModelMapper&lt;T&gt;,<br />
        &nbsp; f:ContextFactory) </td>
      <td> N/A<br /></td>
      <td> Registers a new model class and ModelMapper associated with the class.<br />
        <code>c</code> is the class object of the model object.<br />
        <code>m</code> is a <code>ModelMapper</code> instance corresponding to the model. <code>f</code> is a <code>ContextFactory</code> instance associated with the model. </td>
    </tr>
    <tr>
      <td> removeModel(<br />
        &nbsp; c:Class&lt;T&gt;) </td>
      <td> N/A<br /></td>
      <td> Removes the ModelMapper associated with the token.<br />
        <code>c</code> is the class object of the model object. </td>
    </tr>
    <tr>
      <td> isModelRegistered(<br />
        &nbsp; c:Class&lt;T&gt;) </td>
      <td> boolean<br /></td>
      <td> Whether or not the given ModelMapper is registered or not.<br />
        <code>c</code> is the class object of the model object. </td>
    </tr>
    <tr>
      <td> sendNotification(<br />
        &nbsp; urn:String,<br />
        &nbsp; t:String,<br />
        &nbsp; models:Object[]) </td>
      <td> N/A<br /></td>
      <td> Sends a notification to MOAT IoT cloud servers.<br />
        <code>urn</code> must be a job service id determining the type of client/server application flow.<br />
        <code>t</code> can be set if any, which is the continuation key when this method is used for notifying asynchronous operation result. You can get this value from a context object associated with the key `token` in the corresponding method when the method is defined as asynchronous.<br />
        <code>models</code> are the model objects to be sent if any. Can be null. Each model must be registered prior to the method invocation.</td>
    </tr>
    <tr>
      <td> sendNotificationAsync(<br />
        &nbsp; urn:String,<br />
        &nbsp; t:String,<br />
        &nbsp; models:Object[]) </td>
      <td> <a href="#FutureResult">FutureResult</a>&lt;Map&lt;String, Object&gt;, Throwable&gt;<br /></td>
      <td> The asynchronous form of sendNotification().</td>
    </tr>
    <tr>
      <td> newInstance(<br />
        &nbsp; c:Class&lt;T&gt;,<br />
        &nbsp; additionalProeprties:Map&lt;String, Object&gt;)
      </td>
      <td> T<br /></td>
      <td> Returns a new instance of the type T. Either <code><a href="#PubSubClient">PubSubClient.class</a></code> or <code><a href="#Moat">Moat.class</a></code> (not available for Android, though) is available.<br />
        <code>c</code> is a type of the created instance.<br />
        <code>additionalProeprties</code> are arguments for creating a new instance.</td>
    </tr>
    <tr>
      <td> newInstanceAsync(<br />
        &nbsp; c:Class&lt;T&gt;,<br />
        &nbsp; additionalProeprties:Map&lt;String, Object&gt;)
      </td>
      <td> <a href="#FutureResult">FutureResult</a>&lt;Map&lt;String, Object&gt;, Throwable&gt;<br /></td>
      <td> The asynchronous form of newInstance().</td>
    </tr>
  </tbody>
</table>

<div id="ModelMapper" class="anchor"></div>
### ModelMapper Interface

This interface represents Create/Read/Update/Delete operations for a single POJO data model, one model for one ModelMapper.<br />
The implementation is totally depending on developers, which means there is no constraint on the implementation of the interface. For instance, you can use the database or the file system for the object persistence if you want.

#### Singleton and Array
There are 2 kinds of model objects in MOAT IoT. One is Singleton, which is always a single record object and the other is Array, which aggregates zero, one or more model objects with unique identifiers.

#### UID, the unique identifier
Each model object must have an identifier field named 'uid' like the primary key in RDB.

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Signature</th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> add(entity:T) </td>
      <td> T (Object) </td>
      <td> Represents the operation of adding a given data object to the device. This doesn't always mean the device has to store the data into some persistence store but depends on its implementation. </td>
    </tr>
    <tr>
      <td> update(<br />
        &nbsp; entity:T) </td>
      <td> N/A<br /></td>
      <td> This is invoked when the MOAT IoT Server requests the MOAT IoT Client/Gateway to update a field value of a model object. </td>
    </tr>
    <tr>
      <td> updateFields(<br />
        &nbsp; entity:T, &nbsp; updateFields:String[]) </td>
      <td> N/A<br /></td>
      <td> This is invoked when the MOAT IoT Server requests the MOAT IoT Client/Gateway to update field values of a model object. </td>
    </tr>
    <tr>
      <td> remove(<br />
        &nbsp; uid:String) </td>
      <td> N/A<br /></td>
      <td> This is invoked when the MOAT IoT Server requests the MOAT IoT Client/Gateway to delete an existing model object. </td>
    </tr>
    <tr>
      <td> findByUid(<br />
        &nbsp; uid:String) </td>
      <td> T (Object)<br /></td>
      <td> This is invoked when the MOAT IoT Server requests the MOAT IoT Client/Gateway to return an existing model object or its field value. This method can return null if the model object is missing. </td>
    </tr>
    <tr>
      <td> findAllUids() </td>
      <td> List&lt;String&gt;<br /></td>
      <td> This is invoked when the MOAT IoT Server requests the MOAT IoT Client/Gateway to return all UIDs in the device. </td>
    </tr>
    <tr>
      <td> count() </td>
      <td> int<br /></td>
      <td> This is invoked when the MOAT IoT Server requests the MOAT IoT Client/Gateway to return the number of model objects stored in the device. </td>
    </tr>
  </tbody>
</table>
        
<div id="Command" class="anchor"></div>
### Command Annotation
This interface annotates a method so that it can be invoked from a MOAT js script via a [ModelStub](/references/moat-js-api-document.html#ClassesModelStub) object.

Annotates a method so that MOAT IoT Client/Gateway can execute it. The argument of the method must have a single `Map` argument containing the context information which is created by a appropriate `ContextFactory`, specified via `Moat#registerModel(Class, ModelMapper, ContextFactory)`.

The method should tell the MOAT IoT Client/Gateway if the method execution is performed synchronously or asynchronously (See the Examples below). The method is able to return arbitrary error code when you'd like to pass it to the server. The negative integer value can be sent back to the server automatically.

#### Examples
1) This declaration means the method `associate` is performed synchronously.

```java
@Command
public int associate(Map<String, Object> context) {
  ...
}
```

2) This declaration means the method is performed asynchronously.

```java
@Command
public void associate(Map<String, Object> context) {
  ...
  throw new CommandException(Constants.ASYNC);
}
```

3) This declaration means the method is performed synchronously.

```java
@Command
public int associate(Map<String, Object> context) {
  ...
  return Constants.SYNC;
}
```

4) This declaration means the method is performed asynchronously.

```java
@Command
public int associate(Map<String, Object> context) {
  ...
  return Constants.ASYNC;
}
```
        
<div id="Command.jdk14" class="anchor"></div>
#### Command For JDK1.4

With regard to bundles compiled with JDK1.4, the following method declaration convention is provided instead of the annotation mechanism.

#### Examples (JDK 1.4)

The following examples show the JDK 1.4 version of the above Examples.

1) This declaration means the method is performed synchronously.

```java
public void associate(Map context) {
  ...
}
```

2) This declaration means the method is performed asynchronously.

```java
public void associate(Map context) {
  ...
  throw new CommandException(Constants.ASYNC);
}
```

3) This declaration means the method is performed synchronously.

```java
public int associate(Map context) {
  ...
  return Constants.SYNC;
}
```

4) This declaration means the method is performed asynchronously.

```java
public int associate(Map context) {
  ...
  return Constants.ASYNC;
}
```

<div id="ResourceType" class="anchor"></div>
### ResourceType Annotation
The `resource` type field contains URLs to fetch a binary object or to store it. You can retrieve the URL from the passed Map value. Its keys are corresponding to HTTP methods available.

Note that the URLs to be passed in the field value are determined by a server side script with MOAT js API. See [ModelStub](/references/moat-js-api-document.html#ClassesModelStub) for detail.

```java
final Map<String,String> r = model.getMyResouceType();
final URL getUrl = new URL(r.get("get"));
final HttpURLConnection conn = getUrl.openConnection();
  :
  :
```

#### For JDK1.5 including Android
Annotate your resource field declaration with `@ResourceType`.

```java
public class ... {
@ResourceType
private Map<String,String> myResourceType;
public Map<String,String> getMyResourceType() {
  ...
}
public void setMyResourceType(
Map<String,String> value) {
  ...
}
   :
 (snip)
   :
}
```

You need to declare the accessor methods as well.

<div id="ResourceType.jdk14" class="anchor"></div>
#### ResourceType For JDK1.4
Use `Resource` suffix to your resource field name.

```java
public class ... {
private Map myResourceTypeResource;
public Map getMyResourceTypeResource() {
  ...
}
public void setMyResourceTypeResource(Map value) {
  ...
}
   :
 (snip)
   :
}
```

You need to declare the accessor methods as well.

<div id="Model" class="anchor"></div>
### Model Annotation

The `Model` annotation can be used for providing meta information regarding a model class.

With this annotation, developers are able to specify a different name from the defined class name as the model name and a field for storing a raw binary data when `Raw` codec is employed during [MOAT PubSub](/references/moat-pubsub-api-document.html) communication.

Annotating a model type class with this annotation is NOT mandatory.

For JDK1.4, see [here](#Model.jdk14) for annotating a model class.

#### For JDK1.5 including Android
Annotate your model class declaration with `@Model`.

```java

@Model(name="AnotherEvent", binaryPayloadField = "binary")
public class SparkiEvent {
  private byte[] binary;

  public byte[] getBinary() {
    if (this.binary == null) {
      return null;
    }
    return this.binary.clone();
  }
  public void setBinary(byte[] binary) {
    this.binary = binary;
  }
   :
 (snip)
   :
}
```

You need to declare the getter and setter methods for the field as well.

<div id="Model.jdk14" class="anchor"></div>
#### Model annotation For JDK1.4
With JDK 1.4, there is no alternative way to the `name` attribute of `Model` annotation.
The class name is always employed as the model type name.

Regarding `binaryPayloadField` attribute, use `Binary` suffix to your binary field name.

```java
public class AnotherEvent {
  private byte[] payloadBinary;
  public byte[] getPayloadBinary() {
    ...
  }
  public void setPayloadBinary(byte[] binary) {
    ...
  }
   :
 (snip)
   :
}
```

You need to declare the accessor methods for the field as well.

<div id="MOATPubSub" class="anchor"></div>
### MOAT PubSub Interfaces
The interfaces are Java implementation of [MOAT PubSub](/references/moat-pubsub-api-document.html) specification, offer developers to create an app using publish-subscribe message exchange.

<div id="PubSubClient" class="anchor"></div>
### PubSubClient&lt;M&gt; Interface
A MOAT PubSub compliant client. Subclasses must implements this interface.

`<M>` represents the meta data class describing a model type rather than the model type itself.

`<T>` represents a model type.

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name </th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> begin() </td>
      <td> N/A </td>
      <td> Performs connecting with the preconfigured configuration info. You can re-connect a broker if connected() returns false unless end() is invoked. Note that the broker destination is automatically configured by the underlying MOAT runtime app.</td>
    </tr>
    <tr>
      <td> begin(<br/>
        upstreamEncoding:<a href="#PayloadCodec">PayloadCodec</a>,<br/>
        downstreamDecoding:<a href="#PayloadCodec">PayloadCodec</a><br/>
        ) </td>
      <td> N/A </td>
      <td> Performs connecting with the preconfigured configuration info with the given payload encoding and decoding. <br/>
        <code>upstreamEncoding</code> is applied for uploading data from a device to Cloud whereas <code>downstreamDecoding</code> is used for incoming data from Cloud to a device. <br />
        <div class="alert alert-warning"> <strong>IMPORTANT:</strong><br />
          Currently, set the same value as <code>upstreamEncoding</code> to <code>downstreamDecoding</code> because PubSub API doesn't support separate pyaload codecs yet. </div>
      </td>
    </tr>
    <tr>
      <td> end() </td>
      <td> N/A </td>
      <td> Disposes all allocated resources for the publish/subscribe communication. <br/>
      You cannot connect/subscribe/unsubscribe/publish any more once the methodis invoked.</td>
    </tr>
    <tr>
      <td> connected() </td>
      <td> boolean </td>
      <td> Whether or not the connection is established.</td>
    </tr>
    <tr>
      <td> subscribe(<br/>
        modelClass:M,<br/>
        qos:<a href="#PubSubQoS">PubSubQoS</a>,<br/>
        callback:<a href="#PubSubCallback">PubSubCallback&lt;T&gt;</a><br/>
        ) </td>
      <td> N/A </td>
      <td> Subscribes the given <code>modelClass</code> actions. The <code>callback</code> will be invoked whenever the given <code>modelClass</code> action arrives repeatedly. <br/>
        The subscription is valid unless <code>unsubscribe()</code> is invoked.</td>
    </tr>
    <tr>
      <td> unsubscribe(<br/>
        modelClass:M<br/>
        ) </td>
      <td> boolean </td>
      <td> Unsubscribes the given <code>modelClass</code> actions. <br/>
        The method returns true if the subscription is removed, false if it is missing.
      </td>
    </tr>
    <tr>
      <td> publish(<br/>
        modelObject:T<br/>
        ) </td>
      <td> boolean </td>
      <td> Publishes the given <code>modelObject</code> event.
      </td>
    </tr>
  </tbody>
</table>

<div id="PayloadCodec" class="anchor"></div>
### PayloadCodec Interface

This interface provides various implementation for payload encoding/deconding.

The following constant names are available by default:

1. `PayloadCodec.RAW` for a raw binary container format described [here](/references/moat-pubsub-api-document.html#PayloadContainerFormats)
1. `PayloadCodec.MOATV1_JSON_NOENC` for [MoatV1](/references/moat-pubsub-api-document.html#PayloadContainerFormats.MoatV1) container format with plain JSON content format
1. `PayloadCodec.MOATV1_JSON_ECB_ENC` for [MoatV1](/references/moat-pubsub-api-document.html#PayloadContainerFormats.MoatV1) container format with `x-inventit-aes-256-ecb-pkcs7` encrypted JSON content format
1. `PayloadCodec.MOATV1_JSON_CBC_ENC` for [MoatV1](/references/moat-pubsub-api-document.html#PayloadContainerFormats.MoatV1) container format with `x-inventit-aes-256-cbc-pkcs7` encrypted JSON content format

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name </th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> encode(<br/>
        input:Object,<br/>
        key:byte[]<br/>
        ) </td>
      <td> byte[] </td>
      <td> Encodes the given input and returns the encoded binary.</td>
    </tr>
    <tr>
      <td> decode(<br/>
        input:Object,<br/>
        key:byte[]<br/>
        ) </td>
      <td> byte[] </td>
      <td> Decodes the given input and returns the decoded binary.</td>
    </tr>
    <tr>
      <td> getUserNameQuery() </td>
      <td> String </td>
      <td> Returns the query parameter used for <code>UserName</code> on establishing a connection with <a href="/references/moat-pubsub-api-document.html">MOAT PubSub</a>.</td>
    </tr>
    <tr>
      <td> name() </td>
      <td> String </td>
      <td> Returns the name of the codec.</td>
    </tr>
  </tbody>
</table>

<div id="PubSubQoS" class="anchor"></div>
### PubSubQoS Enum

The enum represents QoS level for publish/subscribe messageing.

The following constant names are available:

1. `PubSubQoS.FIRE_AND_FORGET` ... At most once, low reliability but high throughput
1. `PubSubQoS.ACKNOWLEDGED_DELIVERY` ... At least once, intermediate reliability and throughput
1. `PubSubQoS.ASSURED_DELIVERY` ... Exactly once, high reliability but low throughput

<div id="PubSubCallback" class="anchor"></div>
### PubSubCallback&lt;T&gt; Interface

A callback interface on an action arriving at the subscribing model type.

This callback is associated with a specific model type.

`<T>` represents a model type.

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name </th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> onAction(<br/>
        modelObject:T<br/>
        ) </td>
      <td> N/A </td>
      <td> Invoked when an action arrives.</td>
    </tr>
  </tbody>
</table>

<div id="Future" class="anchor"></div>
### Future Interfaces
Future interfaces are generic types of `java.util.concurrent.Future` and `java.util.concurrent.Callable`.
They are used for handling unfinished task results, both success and failure.

<div id="FutureResult" class="anchor"></div>
### FutureResult&lt;V&gt; Interface
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name </th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> get() </td>
      <td> V </td>
      <td> Returns the finished result. This method is blocking, waiting for the result being resolved.</td>
    </tr>
    <tr>
      <td> get(<br />
        timeout:long, <br/>
        timeUnit:TimeUnit, <br/>
        ) </td>
      <td> N/A </td>
      <td> Returns the finished result. This method is blocking, waiting for the result being resolved or the elapsed time reaching the given expiraton time.</td>
    </tr>
    <tr>
      <td> isDone() </td>
      <td> boolean </td>
      <td> Returns whether or not the underlying task is completed. </td>
    </tr>
    <tr>
      <td> then(<br />
        callback: <a href="#DoneCallback">DoneCallback&lt;V, F&gt;</a>) </td>
      <td> N/A </td>
      <td> Sets a callback interface to be invoked when the underlying task is finished with success or failure.
        The callback object is invoked even if the underlying task is already finished when this method is performed.
      </td>
    </tr>
  </tbody>
</table>

<div id="DoneCallback" class="anchor"></div>
### DoneCallback&lt;V, F&gt; Interface
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name </th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> onSuccess(<br />
        &nbsp;&nbsp;result: V) </td>
      <td> N/A </td>
      <td> Invoked when an ongoing task is completed with success. The passed value is a result of the task, same as the return value of <code>FutureResult#get()</code>. </td>
    </tr>
    <tr>
      <td> onFailure(<br />
        &nbsp;&nbsp;cause: F) </td>
      <td> N/A </td>
      <td> Invoked when an unexpected event occurs while an ongoing task is executing. The <code>cause</code> argument contains information regarding the exceptional event. </td>
    </tr>
  </tbody>
</table>

## MOAT Android
MOAT Android is the Android Specific API set. These classes enable you to access the MOAT IoT runtime environment via a gateway application, which can be installed from [Google Play](https://play.google.com/store/search?q=pub:Inventit%20Inc.).

These classes are included in `inventit-dmc-android-lib-api-4.1.0-prod.jar` which you can download via [iidn](https://github.com/inventit/iidn-cli) command. You need to embed the jar file into your APK.

The minimum API level required in the jar file is 10 ([Gingerbread MR1](http://developer.android.com/about/versions/android-2.3.3.html)). You can also use higher level of API set in your APK.

<div id="MoatAndroidFactory" class="anchor"></div>
### MoatAndroidFactory Class
This is a factory class for creating Android Platform dependent [`Moat`](#Moat) object.

You need to invoke `initMoat` in order to obtain the instance. You also need to invoke `destroyMoat` so that the gateway application is able to discard unused state and information, which causes inconsistency between the gateway application and your application.

Once the inconsistency happens, your application doesn't work properly until the installed device is rebooted.

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Signature</th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> getInstance() </td>
      <td> MoatAndroidFactory </td>
      <td> This is a static method, which returns a singleton object of this class. </td>
    </tr>
    <tr>
      <td> initMoat(<br />
        &nbsp;&nbsp;token:byte[], &nbsp;&nbsp;context:<a href="http://developer.android.com/reference/android/content/Context.html">Context</a>) </td>
      <td> <a href="#FutureResult">FutureResult</a>&lt;<a href="#MoatInitResult">MoatInitResult</a>, Throwable&gt; </td>
      <td> Initializes Android specific <code><a href="#Moat">Moat</a></code> instance asynchronously. The initialized <code><a href="#Moat">Moat</a></code> instance can be passed via <code><a href="#FutureResult">FutureResult</a></code> object. </td>
    </tr>
    <tr>
      <td> initMoat(<br />
        token:byte[], enrollmentDomain:String, enrollmentId:String, enrollmentPassword:String, context:<a href="http://developer.android.com/reference/android/content/Context.html">Context</a>) </td>
      <td> <a href="#FutureResult">FutureResult</a>&lt;<a href="#MoatInitResult">MoatInitResult</a>, Throwable&gt; </td>
      <td> Initializes Android specific <code><a href="#Moat">Moat</a></code> instance asynchronously with the given enrollment parameters. The initialized <code><a href="#Moat">Moat</a></code> instance can be passed via <code><a href="#FutureResult">FutureResult</a></code> object.
      </td>
    </tr>
    <tr>
      <td> destroyMoat(<br />
        &nbsp;&nbsp;moat:<a href="#Moat">Moat</a>) </td>
      <td> N/A </td>
      <td> Destroys the given <code><a href="#Moat">Moat</a></code> instance. This method doesn't remove any model definitions registered via <code>registerModel</code> method of <code><a href="#Moat">Moat</a></code> but unbinds the underlying remote stub for a <a href="http://developer.android.com/guide/components/services.html">Service</a> running on the gateway application. </td>
    </tr>
    <tr>
      <td> isValid(<br />
        &nbsp;&nbsp;moat:<a href="#Moat">Moat</a>) </td>
      <td> boolean </td>
      <td> Returns whether or not the given <code><a href="#Moat">Moat</a></code> instance is valid. The return value is false when <code>null</code> is passed. You can check if it is valid so as not to receive <code>IllegalStateException</code> when invoking methods of the object. Invalid <code><a href="#Moat">Moat</a></code> object methods always throw the exception. </td>
    </tr>
    <tr>
      <td> isActivated(<br />
        &nbsp;&nbsp;moat:<a href="#Moat">Moat</a>) </td>
      <td> boolean </td>
      <td> Returns whether or not the connected gateway app is already activated. </td>
    </tr>
  </tbody>
</table>

<div id="MoatInitResult" class="anchor"></div>
### MoatInitResult class
A value object class containing a [`Moat`](#Moat) and the URN prefix associated with this app.
The instance of the class is immutable.
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name </th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> getMoat() </td>
      <td> <a href="#Moat">Moat</a> </td>
      <td> Returns the initialized <a href="#Moat">Moat</a> object.</td>
    </tr>
    <tr>
      <td> getUrnPrefix()</td>
      <td> String </td>
      <td> Returns the URN prefix associated with the application.</td>
    </tr>
  </tbody>
</table>


<div id="AndroidManifestxml" class="anchor"></div>
### AndroidManifest.xml for your APK

Here is a chore prior to finishing your APK regarding AndroidManifest.xml.

* Putting a [uses-permission](http://developer.android.com/guide/topics/manifest/uses-permission-element.html) named `com.yourinventit.servicesync.android.permission.MOAT_ANDROID`

This is required for interacting with Inventit ServiceSync Gateway application since it grants access to/from applications having this permission. Other securities regarding Interprocess Communication (IPC) between the gateway application and your APK than the Android permission.

Note that the name of the permission may be different from this depending on the distribution of the gateway application. The name is currently available for Inventit ServiceSync Android Gateway connecting Inventit IoT Developer Network Development Sandbox Server.

#### uses-permission

You can define the [uses-permission](http://developer.android.com/guide/topics/manifest/uses-permission-element.html) as follows:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
package="com.yourinventit.moat.android.example">
   :
 (snip)
   :
<uses-permission android:name="com.yourinventit.servicesync.android.permission.MOAT_ANDROID" />
   :
 (snip)
   :
```
