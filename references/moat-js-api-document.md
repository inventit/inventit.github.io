---
sitemap:
 priority: 0.6
 changefreq: weekly
 lastmod: 2013-09-28T00:00:00
name: moat-js-api-document.html
title: "Inventit Iot developer Network | References | MOAT js"
layout: references
breadcrumbs:
-
 name: References
 url: /references.html
-
 name: MOAT js
---
<h1>MOAT js</h1>
<h3>Version</h3>
<p>1.3.0</p>
<p>See <a href="/references/moat-js-api-document/changes.html">here</a> for change history.<br />
</p>
　　
<h3>Table of Contents</h3>
<p><a href="#NamingConvention">1. Naming Convention</a></p>
<p><a href="#GlobalObject">2. Global Object</a></p>
<ul>
  <li><a href="#GlobalObjectMOAT">MOAT</a></li>
</ul>
<p><a href="#GlobalFunction">3. Global Function</a></p>
<ul>
  <li><a href="#GlobalFunctionrequire">require()</a></li>
</ul>
<p><a href="#Classes">4. Classes</a></p>
<ul>
  <li><a href="#ClassesMessageSession">MessageSession</a></li>
  <li><a href="#ClassesModelMapperStub">ModelMapperStub</a></li>
  <li><a href="#ClassesModelStub">ModelStub</a></li>
  <li><a href="#ClassesOperationResult">OperationResult</a></li>
  <li><a href="#ClassesDatabase">Database</a></li>
  <li><a href="#ClassesQueryResult">QueryResult</a></li>
  <li><a href="#ClassesClientRequest">ClientRequest</a></li>
  <li><a href="#ClassesDevice">Device</a></li>
  <li><a href="#ClassesDmjob">Dmjob</a></li>
</ul>

<div id="NamingConvention">
  <h3>Naming Convention</h3>
</div>
<p>All javascript files must follow the naming convention below:</p>
<pre>[operation]![version].js</pre>
<p>when the file corresponds to the URN (JobServiceId)&nbsp;<code>urn:moat:app-id:package-id:operation:version</code>.<br />
  e.g. <code>install!1.0.js</code>, <code>start!1.0.js</code><br />
  The <code>version</code> must be identical with the one declared in <code>package.json</code>.<br />

<div id="GlobalObject">
  <h3>Global Object</h3>
</div>
<div id="GlobalObjectMOAT">
  <h4>MOAT</h4>
</div>
<p>This object is a globally accessible object from any scope in your script. It contains the meta information such as version and a function to provide a context object.<br />
  However, you <u><b>should not use</b></u> this object directly but use <b><a href="#GlobalFunctionrequire">require()</a></b> function like Node.js.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Return Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>init()</td>
      <td>object</td>
      <td>Initializes the current session context.<br />
        The returned object contains the following attributes:<br />
        <br />
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>session</td>
              <td>A <a href="#ClassesMessageSession">MessageSession</a> object.</td>
            </tr>
            <tr>
              <td>clientRequest</td>
              <td>A <a href="#ClassesClientRequest">ClientRequest</a> object coming from a device.</td>
            </tr>
            <tr>
              <td>database</td>
              <td>A <a href="#ClassesDatabase">Database</a> object.</td>
            </tr>
          </tbody>
        </table></td>
    </tr>
    <tr>
      <td>version</td>
      <td>String</td>
      <td>The version of MOAT IoT.</td>
    </tr>
    <tr>
      <td>runtime</td>
      <td>object</td>
      <td>An object containing the runtime environment information.<br />
        <br />
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>server</td>
              <td>A boolean value.<br />
                Whether or not the ongoing runtime environment is on server.</td>
            </tr>
            <tr>
              <td>name</td>
              <td>A String value.<br />
                The name of the runtime environment name.<br />
                <br /></td>
            </tr>
          </tbody>
        </table></td>
    </tr>
  </tbody>
</table>

<div id="GlobalFunction">
  <h3>Global Function</h3>
</div>
<div id="GlobalFunctionrequire">
  <h4>require(String) </h4>
</div>
<p>This function is a factory function to provide a MOAT object. The string parameter must be always '<b><u>moat</u></b>'. Other text cannot be taken.<br />
  The purpose of this function is to offer the script the source code compatibility with Node.js. WIth this function, developers are able to perform the unit testing with a test stub module and libraries available on Node.js.<br />
  Inventit provides a testing library, <a href="https://github.com/inventit/moatjs-stub">moatjs-stub</a>, at <a href="http://npmjs.org/">npm</a>, which is working with <a href="http://sinonjs.org/">SinonJS</a> and <a href="https://github.com/caolan/nodeunit/">nodeunit</a>. You can test your code with the modules on your local environment without deployment on a server. </p>

<div id="Classes">
  <h3>Classes</h3>
</div>
<div id="ClassesMessageSession">
  <h4>MessageSession</h4>
</div>
<p>The MessageSession provides functions associated with the ongoing script execution. On the server side script, developers are able to code operations to a remote device. These operations are not automatically transmitted to the remote device but must be directed by several functions.<br />
  <code>commit()</code> function is one of the commands to perform the transmission, which is used for applying model stub object manipulation to the device. Prior to call this function, one or more property set/get operations to a model stub object are required.<br />
  Or, command functions defined in developer defined model play the role as well. Every command function of the model stub object transmits its request to the remote device whenever it is invoked. See <a href="#ClassesModelStub">here</a> for detail.<br />
  As of version 1.1.0, MessageSession object has the following properties.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>applicationId</td>
      <td>String</td>
      <td>The application identifier of the currently running script.</td>
    </tr>
    <tr>
      <td>packageId</td>
      <td>String</td>
      <td>The package identifier of this ongoing script.</td>
    </tr>
  </tbody>
</table>
<p>Here is a table for MessageSession basic functions.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Return Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>newModelMapperStub(type:String)</td>
      <td>object</td>
      <td>Creates a new <a href="#ClassesModelMapperStub">ModelMapperStub</a> object. The type must be declared in a <code>package.json</code>.</td>
    </tr>
    <tr>
      <td>commit(state:String,<br />
        block:object)</td>
      <td>object</td>
      <td>Commits the reserved operations and returns the result as an object.<br />
        If you specify a function block with each reserved operation, the block function is performed at this time.<br />
        <br />
        <b>Parameters:</b><br />
        state ... (optional) The name of the commit state<br />
        block ... (optional) An object containing functions called within the function after receiving a result object. See <a href="#CallbackFunctionObject">here</a> for detail<br />
        <b> Return:</b><br />
        An object containing the result of reserved operations associated with tokens.<br />
        <div class="alert alert-warning"> <b>IMPORTANT!</b><br />
          The commit() function is blocked until all the callback function blocks are completed</div></td>
    </tr>
    <tr>
      <td>setWaitingForResultNotification(<br />
        tf:boolean)</td>
      <td>void</td>
      <td>Tells the runtime system that the device will access it later and it doesn't terminate the ongoing job.<br />
        <br />
        <b>Parameters:</b><br />
        tf ... boolean. Whether or not a device accesses the runtime later<br /></td>
    </tr>
    <tr>
      <td><a name="MessageSession_log" id="MessageSession_log"></a>log(tag:String, message:String)</td>
      <td>void</td>
      <td>Prints a message log to the runtime environment.<br />
        <br />
        <b>Parameters:</b><br />
        tag ... a tag for categorizing logs<br />
        message ... a message text to be logged</td>
    </tr>
    <tr>
      <td>findPackage(objectName:String)</td>
      <td>object</td>
      <td>Returns a resource type for the given objectName. This function does NOT check if the given objectName package file exists or not.<br />
        The returned object has 2 resource methods, 'get' and 'head'. No other methods are included in the object.<br />
        <br />
        <b>Parameters:</b><br />
        objectName ... an application package object name<br />
        <b>Return:</b><br />
        A resource type object for 'get' and 'head' methods.<br />
        <b>Since:</b><br />
        1.1.0</td>
    </tr>
    <tr>
      <td>setDmjobArgument(<br />
        name:String,<br />
        value:Object)</td>
      <td>object</td>
      <td>Associates a given name with a given value in Dmjob.arguments attribute.<br />
        This is useful when a script needs to share information with another script.<br />
        If the passed value is object, it will be translated into JSON string.<br />
        <br />
        <b>Parameters:</b><br />
        name: an attribute name in the Dmjob.arguments hash<br />
        value: a value data associated with the name. Can be translated into JSON string if it is an Object.<br />
        <b>Return:</b><br />
        An updated dmjob object<br />
        <b>Since:</b><br />
        1.1.0</td>
    </tr>
    <tr>
      <td>digest(<br />
        algorithm: String,<br />
        encoding: String,<br />
        value: String)<br /></td>
      <td>String</td>
      <td>Returns a hash digest value as a given encoding string.<br />
        <br />
        <b>Parameters:</b><br />
        algorithm: one of 'MD5', 'SHA1', 'SHA256' is acceptable<br />
        encoding: the type of encoding used for a value string. One of 'hex','b64', 'plain'<br />
        value: a string value to be calculated<br />
        <b>Return:</b><br />
        A digest hash value with the given encoding. Note that a hex string is returned if the encoding is 'plain'.<br />
        <b>Since:</b><br />
        1.2.0<br /></td>
    </tr>
    <tr>
      <td>hmac(<br />
        algorithm: String,<br />
        encoding: String,<br />
        secret: String,<br />
        value: String)</td>
      <td>String</td>
      <td>Returns an hmac value as a given encoding string.<br />
        <br />
        <b>Parameters:</b><br />
        algorithm: one of 'MD5', 'SHA1', 'SHA256' is acceptable<br />
        encoding: the type of encoding used for a secret string and a value string. One of 'hex','b64', 'plain'<br />
        secret: a secret string<br />
        value: a string value to be calculated.<br />
        <b>Return:</b><br />
        An HMAC value with the given encoding. Note that a hex string is returned if the encoding is 'plain'.<br />
        <b>Since:</b><br />
        1.2.0<br /></td>
    </tr>
    <tr>
      <td>hex2b64(hex: String)</td>
      <td>String</td>
      <td>Converts a given hex string to a base64 string.<br />
        <br />
        <b>Parameters:</b><br />
        hex: a hex string<br />
        <b>Return:</b><br />
        A Base64 string<br />
        <b>Since:</b><br />
        1.2.0<br /></td>
    </tr>
    <tr>
      <td>b642hex(b64: String)</td>
      <td>String</td>
      <td>Converts a given base 64 text to a hex string.<br />
        <br />
        <b>Parameters:</b><br />
        hex: a Base64 string<br />
        <b>Return:</b><br />
        A hex string<br />
        <b>Since:</b><br />
        1.2.0<br /></td>
    </tr>
    <tr>
      <td>text2hex(plain: String)<br />
        text2hex(<br />
        encoding: String, plain: String)</td>
      <td>String</td>
      <td>Converts a plain text into a hex string.<br />
        <br />
        <b>Parameters:</b><br />
        encoding: the text encoding. UTF-8 by default<br />
        plain: a plain text<br />
        <b>Return:</b><br />
        A hex string<br />
        <b>Since:</b><br />
        1.2.0<br /></td>
    </tr>
    <tr>
      <td>text2b64(plain: String)<br />
        text2b64(<br />
        &nbsp; encoding: String, plain: String)</td>
      <td>String</td>
      <td>Converts a plain text into a Base64 string.<br />
        <br />
        <b>Parameters:</b><br />
        encoding: the text encoding. UTF-8 by default<br />
        plain: a plain text<br />
        <b>Return:</b><br />
        A Base64 string<br />
        <b>Since:</b><br />
        1.2.0<br /></td>
    </tr>
  </tbody>
</table>
<h4>Notification Functions</h4>
<p>You can emit arbitrary javascript objects to a remote system with HTTP/S protocol both synchronously and asynchronously.<br />
  MOAT js provides 2 ways of remote accessing:</p>
<ul>
  <li><b>Synchronous or asynchronous notification to the pre-defined destination</b><br />
    Developers are able to specify the notification destination by:
    <ol>
      <li>Setting <code><a href="/references/moat-rest-api-document.html#package">notification</a></code> in a <code>package.json</code> for MOAT js application package</li>
      <li>Or, setting <code>notificationUri</code> in a <code><a href="/references/moat-rest-api-document.html#dmjob">dmjob</a></code> object</li>
    </ol>
  </li>
  <li><b>Synchronous and arbitrary destination access</b><br />
    This is used for interacting with public third-party web services such as <a href="https://twitter.com">Twitter</a>, <a href="http://www.salesforce.com">Salesforce.com</a> or whatever. </li>
</ul>
<p>Regarding <code><a href="/references/moat-rest-api-document.html#dmjob">dmjob</a></code>s created by users via MOAT REST API, the runtime environment ALWAYS sends the notification when they are completed.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Return Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>fetchUrlSync(<br />
        &nbsp; &nbsp; url:String,<br />
        &nbsp; &nbsp; params:object,<br />
        &nbsp; &nbsp; block:function)</td>
      <td>object</td>
      <td>Submits an HTTP request with given parameters.<br />
        You can run a function after receiving an HTTP response (not mandatory).<br />
        <br />
        <b>Parameters:</b><br />
        url ... the destination URL to be accessed.<br />
        params ... an object containing HTTP request parameters and headers. The structure is shown below.<br />
        block ... (optional) a block function to be performed when the response arrives.<br />
        <br />
        <b> Request Parameter Structure:</b><br />
        <br />
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody> 
            <tr>
              <td>method</td>
              <td>The HTTP method.</td>
            </tr>
            <tr>
              <td>contentType</td>
              <td>A String value.<br />
                The content type of the request payload.</td>
            </tr>
            <tr>
              <td>headers</td>
              <td>An object containing request headers.</td>
            </tr>
            <tr>
              <td>payload</td>
              <td>Either plain text, Base64 text, Hex text or a javascript object.<br />
                You need to use either Base64 or Hex string in order to handle byte data.<br />
                <ul>
                  <li>Plain text is applied when 'responseBodyEncoding' is unset&nbsp;</li>
                  <li>Base64 is applied when 'responseBodyEncoding' is set to 'b64' in request parameters</li>
                  <li>Hex is applied when 'responseBodyEncoding' is set to 'hex' in request parameters</li>
                  <li>Javascript object is returned when the response content type is JSON</li>
                </ul></td>
            </tr>
          </tbody>
        </table>
        <br />
        <b>Return:</b><br />
        An object containing response meta data.<br />
        <br />
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>responseCode</td>
              <td>An int value.<br />
                HTTP status code to the submitted request.</td>
            </tr>
            <tr>
              <td>contentType</td>
              <td>A String value.<br />
                The content type of the response payload.</td>
            </tr>
            <tr>
              <td>content</td>
              <td>Either plain text, Base64 text, Hex text or a javascript object.<br />
                You need to use either Base64 or Hex string in order to handle byte data.<br />
                <ul>
                  <li>Plain text is applied when 'responseBodyEncoding' is unset&nbsp;</li>
                  <li>Base64 is applied when 'responseBodyEncoding' is set to 'b64' in request parameters</li>
                  <li>Hex is applied when 'responseBodyEncoding' is set to 'hex' in request parameters</li>
                  <li>Javascript object is returned when the response content type is JSON</li>
                </ul></td>
            </tr>
          </tbody>
        </table>
       </td>
    </tr>
    <tr>
      <td>notifySync(<br />
        &nbsp; &nbsp; entity:object,<br />
        &nbsp; &nbsp; block:function)&nbsp; &nbsp;&nbsp; </td>
      <td>object</td>
      <td>Submits a notification message <b>synchronously</b>.<br />
        The destination is set when a DM job object is created. See <a href="ClassesDmJobnotificationUri"><code>DmJob.notificationUri</code></a> for detail.<br /></td>
    </tr>
    <tr>
      <td>notifyAsync(<br />
        &nbsp; &nbsp; entity:object)</td>
      <td>void</td>
      <td>Submits a notification message <b>asynchronously</b>.<br />
        The destination is set when a DM job object is created. See <a href="ClassesDmJobnotificationUri"><code>DmJob.notificationUri</code></a> for detail.<br />
        <br />
        The latest method invocation is affected when the function is performed two or more times.<br />
        <br />
        You can cancel to notify by specifying <code>null</code> for entity.</td>
    </tr>
  </tbody>
</table>

<h5>Example</h5>
<p>This is an example for <code>fetchUrlSync()</code>.</p>
<script src="https://gist.github.com/2943421.js" type="text/javascript"></script>
<div id="ClassesModelMapperStub">
  <h4>ModelMapperStub</h4>
</div>
<p>The instance of this class is created via <code>MessageSession.newModelMapperStub()</code> with specifying the type of Model. However, you cannot directly instantiate it wtih <code>new</code> key word. The type must be declared in a <code>package.json</code> associated with the executing script.</p>
<p>As the name says, this is a stub for a <a href="/references/moat-java-api-document.html#ModelMapper"><code>ModelMapper</code></a> on a remote device. You can request the model object manipulation to the remote device thorough the stub object.</p>
<h5>Stub Creation Operation</h5>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Return Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>newModelStub()</td>
      <td>object</td>
      <td>Creates a new <a href="#ClassesModelStub">ModelStub</a> object.</td>
    </tr>
  </tbody>
</table>

<h5>Usage of Model Operations</h5>
<p>There are several functions in the class allowing you to access/manipulate model objects on a remote device.</p>
<ul>
  <li><a href="#ClassesModelMapper.add">add</a> for adding new model objects</li>
  <li><a href="#ClassesModelMapper.update">update</a> for updating existing model objects</li>
  <li><a href="#ClassesModelMapper.updateFields">updateFields</a> for updating one or more fields in a model object</li>
  <li><a href="#ClassesModelMapper.remove">remove</a> for removing the existing model object</li>
  <li><a href="#ClassesModelMapper.findByUid">findByUid</a> for finding a model object by a given UID</li>
  <li><a href="#ClassesModelMapper.findAllUids">findAllUids</a> for listing all UIDs associated with a model type</li>
  <li><a href="#ClassesModelMapper.count">count</a> for counting the number of model objects</li>
</ul>
<p>These functions are performed asynchronously. <code>MessageSession.commit()</code> or command functions in a model stub object triggers the operations on a remote device. In order for you to look into the operation results, you can append a callback function object (see below) to above functions.</p>

<div id="CallbackFunctionObject"><h5></a>Callback Function Object</h5></div>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Function</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>success(obj)</td>
      <td>The function is invoked when the command result is successful. You will receive an <a href="#ClassesOperationResult"><code>OperationResult</code></a>.</td>
    </tr>
    <tr>
      <td>error(errorType, errorCode)</td>
      <td>The function is invoked when the command result is failed with the error information parameters.
        <p><code>errorType</code> takes the one of the following values:</p>
        <ul>
          <li><code>CLIENT_ERROR</code> for application specific errors. The <code>errorCode</code> may be returned as well</li>
          <li><code>BAD_REQUEST</code> when a remote device cannot identify the server side operations</li>
          <li><code>NOT_FOUND</code> when a remote device cannot find a specified object</li>
          <li><code>SERVER_ERROR</code> when a remote device cannot handle the server side operations</li>
        </ul>
        <p><code>errorCode</code> will be returned when an application on a remote device sends. The code is always a negative integer.</p></td>
    </tr>
    <tr>
      <td>interrupt(eventId)</td>
      <td>The command/operation transmission to a remote device can be interrupted because of an unexpected event. The function is used when such the event occurs before completing server-device interaction. The <code>eventId</code> is a value set via <code>MessageSession.commit()</code> or an auto-generated text by the underlying runtime.</td>
    </tr>
  </tbody>
</table>

<h5>Add Operation</h5>
<p>You can add an object, the class of which is defined as a MOAT data model.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Return Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a name="ClassesModelMapper.add"></a>add(<br />
        entity:object,<br />
        block:object)</td>
      <td>String</td>
      <td>Reserves an operation to insert a new instance of the given type with a given uid.<br />
        <br />
        Parameters:<br />
        entity ... a model object to be added.<br />
        block ... <u>(optional)</u> a <a href="#CallbackFunctionObject">Callback Function Object</a><br />
        Return:<br />
        A token string corresponding to the insert request.</td>
    </tr>
  </tbody>
</table>

<h5>Example</h5>
<h5>add</h5>
<script src="https://gist.github.com/3142705.js" type="text/javascript"></script>
<div id="ClassesModelMapperupdate">
  <h4>Update Operations</h4>
</div>
<p>You can update the object retrieved from a device and persist the modification to the device.></p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Return Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a name="ClassesModelMapper.update"></a> update(<br />
        entity:object,<br />
        block:object)</td>
      <td>String</td>
      <td>Reserves an operation to update an existing instance of the given type identified by a given uid.<br />
        <br />
        Parameters:<br />
        entity ... the updated object.<br />
        block ... <u>(optional)</u> a <a href="#CallbackFunctionObject">Callback Function Object</a><br />
        Return:<br />
        A token string corresponding to the insert request.</td>
    </tr>
    <tr>
      <td><a name="ClassesModelMapper.updateFields"></a> updateFields(<br />
        entity:object,<br />
        fields:Array,<br />
        block:object)</td>
      <td>String</td>
      <td>Reserves an operation to update a field/property in an existing instance of the given type identified by a given uid.<br />
        <br />
        Parameters:<br />
        entity ... the updated object.<br />
        fields ... the names of field to be updated.<br />
        block ... <u>(optional)</u> a <a href="#CallbackFunctionObject">Callback Function Object</a><br />
        Return:<br />
        A token string corresponding to the update request.</td>
    </tr>
  </tbody>
</table>

<h5>Examples</h5>
<h5>update</h5>
<script src="https://gist.github.com/3143020.js" type="text/javascript"></script>
<h5>updateFields</h5>
<script src="https://gist.github.com/3143092.js" type="text/javascript"></script>
<h5>Remove Operation</h5>
<p>You can remove an object in a device.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Return Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>remove(<br />
        uid:String,<br />
        block:object)</td>
      <td>String</td>
      <td>Reserves an operation to remove an existing instance of the given type with a given uid.<br />
        <br />
        Parameter:<br />
        block ... <u>(optional)</u> a <a href="#CallbackFunctionObject">Callback Function Object</a><br />
        Return:<br />
        A token string corresponding to the remove request.</td>
    </tr>
  </tbody>
</table>

<h5>Example</h5>
<h5>remove</h5>
<script src="https://gist.github.com/3142802.js" type="text/javascript"></script>
<h5>Query Operations</h5>
<p>You can retrieve data stored in a device via find* and count functions as similar as you do so from a database via DAO class.<br />
  Unlike a generic database, the query operations require 'commit' operation in order for you to complete them.<br />
</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Return Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a name="ClassesModelMapper.findByUid"></a> findByUid(<br />
        uid:String,<br />
        block:object)</td>
      <td>String</td>
      <td>Reserves a query for an instance of the given array type specified by the given uid.<br />
        The uid is a unique identifier to identify the instance of the array.<br />
        <br />
        Parameters:<br />
        uid ... the unique identifier for the destination instance.<br />
        block ... <u>(optional)</u> a <a href="#CallbackFunctionObject">Callback Function Object</a><br />
        Return:<br />
        A token string corresponding to the query request. </td>
    </tr>
    <tr>
      <td><a name="ClassesModelMapper.findAllUids"></a> findAllUids(<br />
        block:object)</td>
      <td>String</td>
      <td>Reserves a query for the list of existing uids for the given array type.<br />
        You cannot use this method to query a Singleton type instance since the empty data is always returned.<br />
        <br />
        Parameter:<br />
        block ... <u>(optional)</u> a <a href="#CallbackFunctionObject">Callback Function Object</a><br />
        Return:<br />
        A token string corresponding to the query request.</td>
    </tr>
    <tr>
      <td><a name="ClassesModelMapper.count"></a> count(<br />
        block:object)</td>
      <td>String</td>
      <td>Reserves a query for the count of the given array type entries in a device.<br />
        You cannot use this method to query a Singleton type instance.<br />
        <br />
        Parameter:<br />
        block ... <u>(optional)</u> a <a href="#CallbackFunctionObject">Callback Function Object</a><br />
        Return:<br />
        A token string corresponding to the query request.</td>
    </tr>
  </tbody>
</table>

<h5>Examples</h5>
<h5>findByUid</h5>
<script src="https://gist.github.com/3122106.js" type="text/javascript"></script>
<h5>findAllUids</h5>
<script src="https://gist.github.com/3123410.js" type="text/javascript"></script>
<h5>count</h5>
<script src="https://gist.github.com/3123774.js" type="text/javascript"></script>
<div id="ClassesModelStub">
  <h4>ModelStub</h4>
</div>
<p>The <code>ModelStub</code> is a stub object created via <code>ModelMapperStub.newModelStub()</code>, or retrieved by find* functions.</p>
<p>You can set and/or get field values of the created object, or even run commands if they are defined in its model descriptor.</p>
<h5>'Resource' Type</h5>
<p>The 'Resource' represents an abstract data object. The value of this type can be accessed via HTTP. 'Resource' type value is usually empty and is NOT transferred to a remote device. However, with the following operations, the device is able to receive URLs to GET/PUT/DELETE/HEAD the resource (<u>POST is not included</u>).</p>
<pre>var mapper = session.newModelMapper(...);
var stub = mapper.newModelStub();
stub.myResourceField = ["put", "get"];
</pre>
        <br />
        <p>In this example above, the string array is assigned to a field named 'myResourceField', which is, for example, a resource type field. With this array, the runtime automatically converts the field value (String Array) into a resource type object, like this:</p>
        <pre>{
  "put" : "http://....",
  "get" : "http://....",
  "type" : "...."
}
</pre>
        <p>However, the value can be 'empty' unless a string array is assigned.</p>
        <br />
        <h4>Commands</h4>
        <p>Model objects can have one or more commands which are executed on a remote device. With MOAT js, you can direct the command execution from the server side script as the remote procedure call.
          Command takes the following signature:</p>
        <pre>function <i>commandName</i>(<i>session</i>, <i>parameter</i>, <i>callbackObject</i>) {
...
}
</pre>
        <p>The <code>session</code> parameter is an instance of <code>MessageSession</code>.<br />
          The second parameter is transferred to a remote device. The last parameter is an instance of <a href="#CallbackFunctionObject">CallbackFunctionObject</a>.</p>
        <div class="alert alert-warning"> <b>IMPORTANT!</b><br />
          <p>The runtime environment will call <code>MessageSession.commit()</code> automatically when a command is invoked.</p>
        </div>
        <h5>Command in a model object</h5>
        <script src="https://gist.github.com/3142814.js" type="text/javascript"></script><br />
        <div id="ClassesOperationResult">
          <h3>OperationResult</h3>
        </div>
        <p>This is a return object by ModelMapperStub and ModelStub operations.<br />
          You cannot directly instantiate it.</p>
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
              <td> success </td>
              <td> Boolean </td>
              <td> Whether or not the command is successful. The field is NOT available for find* and count functions result. </td>
            </tr>
            <tr>
              <td> async </td>
              <td> Boolean </td>
              <td> Whether or not the operation is performed asynchronously. This property is available ONLY for the command result. </td>
            </tr>
            <tr>
              <td> array </td>
              <td> Array </td>
              <td> The model objects array. The field is available ONLY for find* and count functions result. </td>
            </tr>
          </tbody>
        </table>
        
<div id="ClassesDatabase">
  <h3>Database</h3>
</div>
<p>The instance of this class is passed by <code>database</code> attribute of a context instance returned via <code>require('moat').init()</code>.<br />
  You cannot directly instantiate it.<br />
</p>
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
      <td> insert(entity:object) </td>
      <td> object (created object) </td>
      <td> Inserts a new entity object to the cloud database. The unique identifier can be assigned automatically. However, you can specify it if you'd like to manage it. </td>
    </tr>
    <tr>
      <td> update(entity:object) </td>
      <td> object (updated object) </td>
      <td> Updates the given entity object to the cloud database. </td>
    </tr>
    <tr>
      <td> remove(type:String, uids:Array) </td>
      <td> N/A </td>
      <td> Removes records identified by the given uid or the uid array of the given type. The <code>uids</code> can be a singular string if you remove only one record. </td>
    </tr>
    <tr>
      <td> query(type:String, offsetToken:String, limit:int) </td>
      <td><a href="#ClassesQueryResult">QueryResult</a></td>
      <td> Queries all records of the given type. The result is paginated.
        The <code>limit</code> takes only &gt; 0 integer. If you set zero or negative value, the <code>limit</code> is seen as 25. </td>
    </tr>
    <tr>
      <td> queryByUids(<br />
        &nbsp;type:String,<br />
        &nbsp;uids:Array,<br />
        &nbsp;f:Array,<br />
        &nbsp;r:Array) </td>
      <td> Array </td>
      <td> Queries records of the given type identified by the given uid array.<br />
        <code>f</code> ... the fields to fetch<br />
        <code>r</code> ... HTTP methods for resource fields if any<br />
        * <code>f</code> and <code>r</code> are optional. </td>
    </tr>
    <tr>
      <td>querySharedByUids(<br />
        &nbsp;type:String,<br />
        &nbsp;uids:Array,<br />
        &nbsp;f:Array,&nbsp;r:Array)</td>
      <td>Array</td>
      <td>Queries records of the given shared model type identified by the given uid array.<br />
        <code>f</code> ... the fields to fetch<br />
        <code>r</code> ... HTTP methods for resource fields if any<br />
        * <code>f</code> and <code>r</code> are optional. </td>
    </tr>
  </tbody>
</table>

<div id="ClassesQueryResult">
  <h3>QueryResult</h3>
</div>
<p>The instance of this class is a return object by Databse.query() function or Database.queryWithFilter() function.<br />
  You cannot directly instantiate it.<br />
</p>
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
      <td> array<br /></td>
      <td> Array </td>
      <td> An array of the model objects.<br /></td>
    </tr>
    <tr>
      <td> offset </td>
      <td> String </td>
      <td> The offset key to be allowed to resume the preceding query. </td>
    </tr>
    <tr>
      <td> limit </td>
      <td> int </td>
      <td> The maximum number of records to be fetched at once. </td>
    </tr>
  </tbody>
</table>

<div id="ClassesClientRequest">
  <h3>ClientRequest</h3>
</div>
<p>The instance of this class is passed by 'clientRequest' property of a context instance returned via require('moat').init().<br />
  You cannot directly instantiate it.<br />
</p>
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
      <td> objects<br /></td>
      <td> Array </td>
      <td> An array of the model objects sent from a device.<br /></td>
    </tr>
    <tr>
      <td> device </td>
      <td><a href="#ClassesDevice">Device</a></td>
      <td> The device information sent from a device. </td>
    </tr>
    <tr>
      <td> dmjob </td>
      <td><a href="#ClassesDmJob">DmJob</a></td>
      <td> The requested job information associated with the ongoing session. </td>
    </tr>
  </tbody>
</table>

<div id="ClassesDevice">
  <h3>Device</h3>
</div>
<p>The instance of this class is passed by <code>device</code> property of the ClientRequest object.<br />
  You cannot directly instantiate it.<br />
  The class has the following READONLY attributes:</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Attribute </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> uid </td>
      <td><b>Not Updatable</b><br />
        The unique identifier assigned by the runtime environment. This value is used for specifying a device object in a request URL.<br /></td>
    </tr>
    <tr>
      <td> deviceId </td>
      <td><b>Not Updatable</b><br />
        The URN form of a device specific identifier.<br /></td>
    </tr>
    <tr>
      <td> name </td>
      <td><b>Not Updatable</b><br />
        The addressing name of the device.<br /></td>
    </tr>
    <tr>
      <td> status </td>
      <td> Whether or not the device is activated. <code>I</code> for inactive and <code>A</code> for active.<br /></td>
    </tr>
    <tr>
      <td> clientVersion </td>
      <td><b>Not Updatable</b><br />
        The library version of the client installed software.<br /></td>
    </tr>
    <tr>
      <td> rev </td>
      <td><b>Not Updatable</b><br />
        The object revision. This value is not updated while the ongoing session is active even though the object is updated by another client. </td>
    </tr>
    <tr>
      <td> {arbitrary key} </td>
      <td><b>Not Updatable</b><br />
        Any other attribute key than above.<br />
        The max number of arbitrary keys is 10. The maximum length of keys is 20 and the maximum length of values is 100. </td>
    </tr>
  </tbody>
</table>

<div id="ClassesDmjob">
  <h3>Dmjob</h3>
</div>
<p> The instance of this class is passed by <code>dmjob</code> property of the ClientRequest object.<br />
  You cannot directly instantiate it.<br />
  The class has the same attributes as MOAT REST <code>dmjob</code> object described <a href="/references/moat-rest-api-document.html#dmjob">here</a>. Refer to <a href="/references/moat-rest-api-document.html#dmjob">the page</a> for detail. </p>
