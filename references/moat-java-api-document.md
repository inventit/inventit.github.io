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
1.0.0
　　
## Table of Contents
　
### MOAT Java
- [Moat](#Moat) interface
- [ModelMapper](#ModelMapper) interface
- [Command](#Command) annotation (JDK1.5+ only. See [here](#Command.jdk14) for JDK1.4)
- [ResourceType](#ResourceType) annotation (JDK1.5+ only. See [here](#ResourceType.jdk14) for JDK1.4)

### MOAT Android
- [MoatAndroidFactory](#MoatAndroidFactory) class
- [Callback](#MoatAndroidFactoryCallback) interface
- [AndroidManifest.xml](#AndroidManifestxml) for your APK

## MOAT Java

<div id="Moat" class="anchor"></div>
### MOAT Interface

This is an entry point of MOAT Java/Android/OSGi API. You don't have to implement this interface since the instance of the interface should be provided by the underlying runtime application or library.

#### OSGi Example

```java
final ContextFactory contextFactory = ...;
final ModelMapper blockDaoOrmlite = ...;
final ServiceReference moatRef =
bundleContext.getServiceReference(
    Moat.class.getName());
final Moat moat = bundleContext.getService(moatRef);
    moat.registerModel(
    "urn:moat:b5db3806-43a6-4a7a-b974-6364099ea7d0:package-id:1.0",
    Block.class, blockDaoOrmlite, contextFactory);
```

`bundleContext` is an org.osgi.framework.BudleContext instance. <br/>
`Moat` instance is associated with its FQDN in the bundleContext.

#### Android Example

```java
final byte[] token = toByteArray(
    context.getAssets().open(
    "moat/signed-token-file"));
final Moat moat = MoatAndroidFactory.getInstance()
    .initMoat(token, context,
    new MoatAndroidFactory.Callback() {
      public void onInitialized(Moat moat, String prefix) {
        final ContextFactory contextFactory = ...;
        final ModelMapper blockDaoOrmlite = ...;
        moat.registerModel(
          prefix,
          Block.class, blockDaoOrmlite, contextFactory);
      }
      public void onThrowable(Throwable throwable) {
             :
             :
      }
});
```
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
        &nbsp; urn:String,<br />
        &nbsp; c:Class&lt;T&gt;,<br />
        &nbsp; m:ModelMapper&lt;T&gt;) </td>
      <td> N/A<br /></td>
      <td> Registers a new model class and ModelMapper associated with the class.<br />
        <code>urn</code> can be a job service id associated with the model or alternatively the prefix of job service id (applicationId and packageId are mandatory).<br />
        <code>c</code> is the class object of the model object.<br />
        <code>m</code> is a <code>ModelMapper</code> instance corresponding to the model. </td>
    </tr>
    <tr>
      <td> registerModel(<br />
        &nbsp; urn:String,<br />
        &nbsp; c:Class&lt;T&gt;,<br />
        &nbsp; m:ModelMapper&lt;T&gt;,<br />
        &nbsp; f:ContextFactory) </td>
      <td> N/A<br /></td>
      <td> Registers a new model class and ModelMapper associated with the class.<br />
        <code>urn</code> can be a job service id associated with the model or alternatively the prefix of job service id (applicationId and packageId are mandatory).<br />
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
This interface annotates a method so that it can be invoked from a MOAT js script via a [ModelStub](/references/moat-js-api-document.html#ClassesModelStub) object.<br />
Annotates a method so that MOAT IoT Client/Gateway can execute it. The argument of the method must have a single <code>Map</code> argument containing the context information which is created by a appropriate <code>ContextFactory</code>, specified via <code>Moat#registerModel(String, Class, ModelMapper, ContextFactory)</code>. <br />
  The method should tell the MOAT IoT Client/Gateway if the method execution is performed synchronously or asynchronously (See the Examples below). The method is able to return arbitrary error code when you'd like to pass it to the server. The negative integer value can be sent back to the server automatically. </p>

#### Examples
1) This declaration means the method <code>associate</code> is performed synchronously.

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
#### For JDK1.4

With regard to bundles compiled with JDK1.4, the following method declaration convention is provided instead of the annotation mechanism.

#### Examples (JDK 1.4)

The following examples show the JDK 1.4 version of the above Examples.<br />

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

<div id="ResourceTypejdk14" class="anchor"></div>
#### For JDK1.4
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

## MOAT Android
MOAT Android is the Android Specific API set. These classes enable you to access the MOAT IoT runtime environment via a gateway application, which can be installed from [Google Play](https://play.google.com/store/search?q=pub:Inventit%20Inc.).

These classes are included in `inventit-dmc-android-lib-api-4.0.0-prod.jar` which you can download via [iidn](https://github.com/inventit/iidn-cli) command. You need to embed the jar file into your APK.

The minimum API level required in the jar file is 10 ([Gingerbread MR1](http://developer.android.com/about/versions/android-2.3.3.html)). You can also use higher level of API set in your APK.

<div id="MoatAndroidFactory" class="anchor"></div>
### MoatAndroidFactory Class
This is a factory class for creating Android Platform dependent <code><a href="#Moat">Moat</a></code> object.

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
        &nbsp;&nbsp;token:byte[], &nbsp;&nbsp;context:<a href="http://developer.android.com/reference/android/content/Context.html">Context</a>,<br />
        &nbsp;&nbsp;cb:<a href="#Callback">Callback</a>) </td>
      <td> N/A </td>
      <td> Initializes Android specific <code><a href="#Moat">Moat</a></code> instance asynchronously. The initialized <code><a href="#Moat">Moat</a></code> instance can be passed via <code><a href="#Callback">Callback</a></code> object. </td>
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
  </tbody>
</table>

<div id="MoatAndroidFactoryCallback" class="anchor"></div>
### Callbck Interface
This interface is used for receiving <code<a href="#Moat">>Moat</code></a> object from <code<a href="MoatAndroidFactory">>MoatAndroidFactory</a></code>. Or you may also receive an exception raised during the initialization process.

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
      <td> onInitialized(<br />
        &nbsp;&nbsp;moat:<a href="#Moat">Moat</a>,<br />
        &nbsp;&nbsp;p:String) </td>
      <td> N/A </td>
      <td> Invoked when <code>initMoat</code> is completed with a <a href="#Moat">Moat</a> instance. The <code>p</code> is the prefix of MOAT URN having <a href="/guides/moat-iot/app-design-in-moat-iot.html#JobServiceIdentifier">applicationId and packageId</a> used in your application. The prefix always ends with <code>:</code>. </td>
    </tr>
    <tr>
      <td> onThrowable(<br />
        &nbsp;&nbsp;t:<a href="http://developer.android.com/reference/java/lang/Throwable.html">Throwable</a>) </td>
      <td> N/A </td>
      <td> Invoked when an unexpected exception is thrown while <code>initMoat</code> is executing. </td>
    </tr>
  </tbody>
</table>

<div id="AndroidManifestxml" class="anchor"></div>
### AndroidManifest.xml for your APK

There are several chores prior to finishing your APK regarding AndroidManifest.xml.

<ol>
  <li>Putting a <a href="http://developer.android.com/guide/topics/manifest/uses-permission-element.html">uses-permission</a> named <code>com.yourinventit.servicesync.android.permission.MOAT_ANDROID</code></li>
  <li>Defining a <a href="http://developer.android.com/guide/components/services.html">Service</a> named <code>com.yourinventit.dmc.api.moat.android.MoatClientEndpoint</code></li>
</ol>

The first one is required for interacting with Inventit ServiceSync Gateway application since it grants access to/from applications having this permission. Other securities regarding Interprocess Communication (IPC) between the gateway application and your APK than the Android permission.

Note that the name of the permission may be different from this depending on the distribution of the gateway application. The name is currently available for Inventit ServiceSync Android Gateway connecting Inventit IoT Developer Network Development Sandbox Server.

The second is used by the gateway application so that it can invoke objects defined in your APK. The detailed info is described later.

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

#### Android Service

The Android [Service](http://developer.android.com/guide/components/services.html) you need to specify in your APK's AndroidManifest.xml is `MoatClientEndpoint`, which is embedded in the library jar.

The service receives operations directed by the gateway application and propagates them to the local objects in your APK. You don't have to do something special for the service other than placing the service setting in your AndroidManifest.xml.

```xml
<application
android:allowClearUserData="false"
android:description="@string/app_desc"
   :
>
   :
 (snip)
   :
<service
android:name="com.yourinventit.dmc.api.moat.android.MoatClientEndpoint"
android:exported="true"
android:permission="com.yourinventit.servicesync.android.permission.MOAT_ANDROID">
<intent-filter>
<action android:name="com.yourinventit.moat.android.example.MOAT_CLIENT" />
</intent-filter>
</service>
   :
 (snip)
   :
</application>
```
You can find the working example [here](https://github.com/inventit/moat-iot-get-started/blob/master/simple-example-android/AndroidManifest.xml) at GitHub.
