---
sitemap:
 priority: 0.6
 changefreq: weekly
 lastmod: 2013-09-28T00:00:00
name: moat-rest-api-document.html
title: "Inventit Iot developer Network | References | MOAT REST"
layout: references
breadcrumbs:
-
 name: References
 url: /references.html
-
 name: MOAT REST
 url: /references/moat-rest-api-document.html
---
<h1>MOAT REST</h1>
<h3>Version</h3>
<p>1.0.3</p>
<p>See <a href="/references/moat-rest-api-document/changes.html">here</a> for change history.</p>
<h3>REST API Level</h3>
<p>v1</p>
　　
<h3>Table of Contents</h3>
<p><a href="#System_Defined_Models">1. System Defined Models</a></p>
<ol>
  <li><a href="#System_Defined_Models_URI_Form">URI Form</a></li>
  <li><a href="#auth">auth</a> Model Object</li>
  <li><a href="#package">package</a> Model Object</li>
  <li><a href="#device">device</a> Model Object</li>
  <li><a href="#dmjob">dmjob</a> Model Object</li>
  <li><a href="#oauth2auth">oauth2auth</a> Model Object</li>
  <li><a href="#account">account</a> Model Object</li>
  <li><a href="#log">log</a> Model Object</li>
</ol>
<p><a href="#Developer_Defined_Models">2. Developer Defined Models</a></p>
<ol>
  <li><a href="#Developer_Defined_Models_URI_Form">URI Form</a></li>
  <li><a href="#Resource_Type_Query">'Resource' Type Query</a></li>
  <li><a href="#Single_Model_Query">Single Model Object Query</a></li>
  <li><a href="#List_Model_Query">List Model Object Query</a></li>
  <li><a href="#Create_Model_Object">Create Model Object</a></li>
  <li><a href="#Update_Model_Object">Update Model Object</a></li>
  <li><a href="#Delete_Model_Object">Delete Model Object</a></li>
</ol>

<div id="System_Defined_Models">
  <h3>System Defined Models</h3>
</div>
<p> System Defined Models are pre-defined systemwide data objects offering developers or their applications to access or manipulate the data. The following APIs are already used in <a href="https://github.com/inventit/iidn-cli">the IIDN command line tool</a> and <a href="/guides/get-started.html">'Get Started'</a> example web application. Please take a look at them for the use of the APIs. </p>

<div id="System_Defined_Models_URI_Form">
  <h3>URI Form</h3>
</div>
<pre>https://host:port/moat/v1/sys/{:model_name}/{:model_uid}?{:query_parameters}</pre>
<p>- <code>{:model_name}</code> can be replaced with <code>auth</code>, <code>package</code>, <code>device</code>, <code>dmjob</code>, <code>oauth2auth</code>, <code>account</code> or <code>log</code><br />
  - <code>{:model_uid}</code> is a unique identifier for a model object, which is represented by an attribute named <code>uid</code></p>
<h4>Generic Query Parameters</h4>
<p>You can specify the following query parameters for system models REST URI.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name<br /></th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> token<br /></td>
      <td> An access token provided when you signed in. <code>authToken</code> value of the response for a GET request to <code>auth</code>.<br /></td>
    </tr>
    <tr>
      <td> callback<br /></td>
      <td> The name of javascript function name to be assigned.<br />
      You can use JSONP style API invocation with this paramter.<br /></td>
    </tr>
  </tbody>
</table>

<div id="auth">
  <h3>auth</h3>
</div>
<p>This is an object providing the proprietary form of authentication.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> HTTP Method </th>
      <th> Return Type </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> POST<br /></td>
      <td> N/A<br /></td>
      <td> Not Allowed </td>
    </tr>
    <tr>
      <td> PUT </td>
      <td> N/A </td>
      <td> Not Allowed.<br /></td>
    </tr>
    <tr>
      <td> GET </td>
      <td>JSON</td>
      <td> Signs in to the runtime system.<br />
        Don't send a request body.<br />
        Use the following query parameters (form parameters) for the method.<br />
        <table class="table table-bordered">
          <thead>
            <tr>
              <th> Name </th>
              <th> Description </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> a<br /></td>
              <td> The application id.<br /></td>
            </tr>
            <tr>
              <td> u<br /></td>
              <td> The authentication user id.<br /></td>
            </tr>
            <tr>
              <td> c<br /></td>
              <td> The credentials for the user id.<br /></td>
            </tr>
          </tbody>
        </table>
        <br />
        The response JSON has the following structure:<br />
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th> Name </th>
              <th> Description </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> authUserId<br /></td>
              <td> The authentication user id.<br /></td>
            </tr>
            <tr>
              <td> accessToken<br /></td>
              <td> The value used for specifying <code>token</code>.<br /></td>
            </tr>
            <tr>
              <td> lastSignedIn<br /></td>
              <td> The last signed in time in RFC2822 date/time format.<br /></td>
            </tr>
          </tbody>
        </table></td>
    </tr>
    <tr>
      <td> DELETE<br /></td>
      <td> N/A<br /></td>
      <td> Signs out from the current session.<br />
        <code>{:model_uid}</code> is not required.<br />
        Don't send a request body. </td>
    </tr>
  </tbody>
</table>

<div id="package">
  <h3>package</h3>
</div>
<p>A package is a set of the developer application, which includes</p>
<ol>
  <li>Server side scripts using MOAT js</li>
  <li>Client application built with MOAT Java/Android/OSGi/C</li>
</ol>
<p><i>Note that no device firmwares are included.</i><br />
  Depending on the type of packages, the ways to upload packages are different.&nbsp;The MOAT js packages can be uploaded via POST or PUT method. On the other hand, client packages CANNOT with the same way.<br />
  In order to upload client packages, you need to get an uploading URL via GET operation with <code>r</code> parameter. Then you can upload the packages to the acquired URL.</p>
<p><br />
</p>
<h4>For Server side MOAT js packages (zip)</h4>
<p>Uploading URL for POST/PUT requests is:</p>
<pre>https://host:port/moat/v1/sys/package</pre>
<p>For GET requests:</p>
<pre>https://host:port/moat/v1/sys/package</pre>
<pre>https://host:port/moat/v1/sys/package/{:package_id}?{:query_parameters}</pre>
<p>For DELETE request:</p>
<pre>https://host:port/moat/v1/sys/package/{:package_id}</pre>
<br />
<h4>For Client packages</h4>
<p>Uploading URL for POST/PUT requests is <strong>NONE</strong>.<br />
  For GET request to retrieve the uploading/deleting URL, the REST API URL will be:</p>
<pre>https://host:port/moat/v1/sys/package/{:object_name}?r={:methods}</pre>
<br />
<p>The response body is like this (when <code>r=get,put</code>):</p>
<pre>{
"get" : "https://path/to/get",
"put" : "https://path/to/post",
"type" : "none"
}</pre>
        <p>The retrieved URL is temporary. It will be expired after 5 minutes.<br />
          Note that Android applications can be distributed via&nbsp;<a href="https://play.google.com/store/apps">Google Play</a> or other application distribution services as well.<br />
          You are allowed to upload your binaries unless its amount exceeds the service quota described <a href="/legal/acceptable-use-policy.html">here</a>. </p>
        <h4>package.json for MOAT js and MOAT C</h4>
        <p>Like <a href="https://npmjs.org/">npm</a>, the node.js package management tool, you can create a script package with the <a href="http://wiki.commonjs.org/wiki/Packages/1.1"><code>package.json</code></a>, a meta data file.</p>
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th> Attribute </th>
              <th> Description </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> name </td>
              <td><b>Mandatory</b><br />
                The package id. Alphabets, numbers, hyphen and underscore are allowed.<br />
                Must have at least 4 characters.&nbsp;<br />
                Must start with an alphabet character rather than a number, hypen and underscore.<br />
                <pre>"name" : "MyPackage"
</pre></td>
            </tr>
            <tr>
              <td> version </td>
              <td><b>Mandatory</b><br />
                The version of the package. Alphabets, numbers and dot are allowed.<br />
                <pre>"version" : "1.0"
</pre></td>
            </tr>
            <tr>
              <td> description </td>
              <td> The description of the package.
                <pre>"description" : "Describe Here!"
</pre></td>
            </tr>
            <tr>
              <td> maintainers </td>
              <td> A string array of an object containing name and email properties.<br />
                The email is used for notifying the result of a dmjob if it specifies email as the notification type.
                <pre>"maintainers" : [
{
"name": "Example Maintainers",
"email": "maintainers@example.com"
},...]
</pre></td>
            </tr>
            <tr>
              <td> notification </td>
              <td><b>MOAT js ONLY</b><br />
                An alternate notification setting. With this attribute, you can specify other notification type than 'email'. Currently, 'http' is available (includes https).<br />
                <pre>"notification" : {
"http" : "https://ssl.dest/path"
}
</pre>
                <br />
                This item is preferred even if maintainers item is already set. </td>
            </tr>
            <tr>
              <td> models </td>
              <td><b>Mandatory</b><br />
                The description of the models which the application package uses. The values must contain the name of models and their model descriptors mentioned <a href="moat-iot-model-descriptor.html">here</a>.
                <pre>"models" : {
"ModelName" : {
"field1" : {"type":"string"}, ...
},
...
},
</pre>
                You MUST define <b>the same model definitions through the same packageId</b>. Any declaration differences between MOAT js and MOAT C causes unexpected behaviors, for instance. </td>
            </tr>
            <tr>
              <td>main</td>
              <td><b>MOAT C Only</b><br />
                The main entry point to a user application, the relative path to a library object in particular e.g. <code>app/testapp.so</code></td>
            </tr>
            <tr>
              <td>os</td>
              <td><b>MOAT C Only</b><br />
                The platform OS type is set as string:<br />
                - <code>linux-generic</code> for generic Linux OS<br />
                - <code>linux-rgx</code> Reserved </td>
            </tr>
            <tr>
              <td>directories</td>
              <td><b>MOAT C Only</b><br />
                The directories where user libraries and executable files exist. This entry has the following keys:<br />
                - <code>lib</code> for libraries<br />
                - <code>bin</code> for executables <br />
                <pre>"directories": {
"lib": "lib",
"bin": "binaries",
},</pre></td>
            </tr>
          </tbody>
        </table>
        <p>All other attributes above can be included in the <code>package.json</code> if required.<br />
          The HTTP methods are as follows.</p>
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th> HTTP Method </th>
              <th> Return Type </th>
              <th> Description </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> POST<br /></td>
              <td> JSON<br /></td>
              <td> Creates a new MOAT js package. The body must be a zip file containing the package.json (see above) and js files.<br />
                <br />
                The return value contains the following attributes:<br />
                - <code>pacakgeJson</code> ... the pacakge.json content<br />
                - <code>registeredFiles</code> ... the string array of registered file names<br />
                You will receive HTTP 400 when the package is already registered. </td>
            </tr>
            <tr>
              <td> PUT </td>
              <td> JSON<br /></td>
              <td> Updates an existing package. The body must be a zip file containing the package.json (see above) and js files to be replaced.<br />
                <br />
                The return value contains the following attributes:<br />
                - <code>pacakgeJson</code> ... the package.json content<br />
                - <code>updatedFiles</code> ... the string array of replaced/added file names<br /></td>
            </tr>
            <tr>
              <td> GET </td>
              <td> JSON </td>
              <td>[Without <code>r</code> parameter]<br />
                Retrieves a package.json content if the package id is specified in <code>{:model_uid}</code>. Or a list of package.json associated with the current application id. <br />
                <br />
                [With <code>r</code> parameter]<br />
                The name of client package file to be uploaded must be placed in <code>{:model_uid}</code>. The allowed characters are:<br />
                <ul>
                  <li>Alphabet (case sensitive)</li>
                  <li>Numeric</li>
                  <li>Underscore (_)</li>
                  <li>Hyphen (-)</li>
                  <li>Period (.) ... <b>REQUIRED</b></li>
                  <li>Percent (%)</li>
                </ul>
                The length must be within 255 characters.<br />
                Not starting with period.<br />
                Don't send a request body.</td>
            </tr>
            <tr>
              <td> DELETE<br /></td>
              <td> N/A<br /></td>
              <td> Deletes the specified package.<br />
                The package id must be given in <code>{:model_uid}</code>.<br />
                Don't send a request body. </td>
            </tr>
          </tbody>
        </table>
        
<div id="device">
<h3>device</h3>
</div>
<p>This represents a device itself to be managed by the underlying runtime system.<br />
It includes the following attributes.</p>
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
      The addressing name of the device.<br />
      8 or more characters and within 255 characters.<br />
      Alphanumeric, hyphen, underscore and colon are allowed.<br />
      At least 3 alphanumeric characters are required.<br />
      Cannot be duplicate in the runtime environment. </td>
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
      The object revision. </td>
  </tr>
  <tr>
    <td> {arbitrary key} </td>
    <td> Any other attribute key than above.<br />
      The max number of arbitrary keys is 10. The maximum length of keys is 20 and the maximum length of values is 100. </td>
  </tr>
</tbody>
</table>
<p>The possible operations are as follows</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> HTTP Method </th>
    <th> Return Type </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> POST<br /></td>
    <td> N/A<br /></td>
    <td> Not Used for now (HTTP 400 is returned).<br />
      In order for you to register a new device record, you need to install your own MOAT IoT application on the device as well as the MOAT IoT Gateway application. See <a href="/guides/get-started.html">this tutorial</a> for detail. </td>
  </tr>
  <tr>
    <td> PUT </td>
    <td> N/A </td>
    <td> Updates the device object. The <code>{:model_uid}</code> must be specified.<br /></td>
  </tr>
  <tr>
    <td> GET </td>
    <td> JSON </td>
    <td> Retrieves a specified single object if a <code>{:model_uid}</code> is given, or a list of objects otherwise.<br />
      Don't send a request body.<br />
      You can set the following query parameters for a list query.<br />
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th> Name </th>
            <th> Description </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> o </td>
            <td> An integer value or a text returned by the server to specify the offset position </td>
          </tr>
          <tr>
            <td> l </td>
            <td> An integer value to set the max size to fetch at once. The value should be between 1 and<br />
              <br /></td>
          </tr>
        </tbody>
      </table></td>
  </tr>
  <tr>
    <td> DELETE<br /></td>
    <td> N/A<br /></td>
    <td> Deletes the device object.<br />
      You must delete the device object if you'd like to make the device enroll again when you wipe the device or uninstall the MOAT IoT Gateway application.<br />
      You must place the <code>uid</code> of the device to be removed in <code>{:model_uid}</code>.<br />
      Don't send a request body. <br />
      <br />
      HTTP 409 is returned when there are active <a href="#dmjob">dmjob</a> objects associated with the device object.<br />
      HTTP 400 is returned when there are no <a href="#device">device</a>s to be deleted.<br />
      <br />
      You can provide the following query parameter for this method.<br />
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th> Name </th>
            <th> Description </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> force </td>
            <td> A boolean value, <code>true</code> or <code>false</code>. Whether or not the specified device is to be deleted forcedly. Devices are able to be deleted when their status is <code>Inactive</code>. However, with <code>true</code> value of the parameter, you can delete devices whatever their status is. <br />
              <b>Notice: With this option, you don't receive any notifications when there are left <a href="#dmjob">dmjob</a> objects associated with a <a href="#device">device</a> to be removed</b>.</td>
          </tr>
        </tbody>
      </table>
</table>

<div id="dmjob">
<h3>dmjob</h3>
</div>
<p>This represents a request unit and it retains the progress state of the request. All attributes are not updatable. Once a dmjob is created, the only way to manipulate it is to destroy it by DELETE request.<br />
</p>
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
      The unique identifier assigned by the runtime environment. This value is used for specifying a dmjob object in a request URL.<br /></td>
  </tr>
  <tr>
    <td> deviceId </td>
    <td><b>Not Updatable</b><br />
      The URN form of a device specific identifier.<br /></td>
  </tr>
  <tr>
    <td> name<br /></td>
    <td><b>Mandatory for POST</b><br />
      <b>Updatable only for POST</b><br />
      The addressing name of the device.<br /></td>
  </tr>
  <tr>
    <td> status<br /></td>
    <td><b>Not Updatable</b><br />
      The status of the dmjob object.<br /></td>
  </tr>
  <tr>
    <td> jobServiceId </td>
    <td><b>Mandatory for POST</b><br />
      <b>Updatable only for POST</b><br />
      The unique identifier for specifying a job service type. See <a href="/guides/MOAT-IoT/app-design-in-moat-iot.html#JobServiceIdentifier">here</a> for detail.<br /></td>
  </tr>
  <tr>
    <td> sessionId </td>
    <td><b>Not Updatable</b><br />
      The id used in a conversation between the underlying server and a device.<br /></td>
  </tr>
  <tr>
    <td> arguments </td>
    <td><b>Not Updatable</b><br />
      A key-value entry set for providing additional information for the job.<br /></td>
  </tr>
  <tr>
    <td> description </td>
    <td><b>Not Updatable</b><br />
      The information related with the finished dmjob.<br />
      Not available for the ongoing dmjob.<br /></td>
  </tr>
  <tr>
    <td> createdAt </td>
    <td><b>Not Updatable</b><br />
      The timestamp when the dmjob is created.<br /></td>
  </tr>
  <tr>
    <td> activatedAt </td>
    <td><b>Updatable only for POST</b><br />
      The timestamp when the dmjob is activated. When a dmjob is activated, a device is able to receive a notification from the underlying server to initiate a new conversation.<br /></td>
  </tr>
  <tr>
    <td> startedAt </td>
    <td><b>Not Updatable</b><br />
      The timestamp when the dmjob is started by a device contacting to the underlying server.<br /></td>
  </tr>
  <tr>
    <td> endedAt </td>
    <td><b>Not Updatable</b><br />
      The timestamp when the dmjob is ended by an event, e.g. the conversation is terminated normally, timed out, or server/client error.<br /></td>
  </tr>
  <tr>
    <td> expiredAt </td>
    <td><b>Mandatory for POST</b><br />
      <b>Updatable only for POST</b><br />
      The timestamp when the dmjob is expired.<br /></td>
  </tr>
  <tr>
    <td> notificationType </td>
    <td><b>Updatable only for POST</b><br />
      The type of notification sent when the dmjob is finished.<br />
      The available type is either <code>email</code> or <code>http</code>.<br />
      <code>notificationUri</code> must be set when the item is set.<br />
      <br />
      Note that this item is valid only when a client creates a dmjob object so to push the job to a device (Server initiated jobs).<br />
      For client initiated jobs, both notification type and notification destination are used, configured in <a href="/references/moat-rest-api-document.html#package">the package.json</a> associated with the MOAT js server side scripts. </td>
  </tr>
  <tr>
    <td> notificationUri </td>
    <td><b>Updatable only for POST</b><br />
      The destination where the finish notification is sent.<br /></td>
  </tr>
</tbody>
</table>
<p>The possible operations are as follows</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> HTTP Method </th>
    <th> Return Type </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> POST<br /></td>
    <td> JSON </td>
    <td> Create a new server initiated dmjob (enqueued).<br />
      The returned object contains the assigned <code>{:model_uid}</code> in the field <code>uid</code>.<br />
      <br />
      <table class="table table-bordered">
        <thead>
          <tr>
            <th> Name </th>
            <th> Description </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> uid </td>
            <td> generated <code>{:model_uid}</code> string </td>
          </tr>
        </tbody>
      </table></td>
  </tr>
  <tr>
    <td> PUT </td>
    <td> N/A </td>
    <td> Not allowed.<br /></td>
  </tr>
  <tr>
    <td> GET </td>
    <td> JSON </td>
    <td> Retrieves a specified single object if a <code>{:model_uid}</code> is given, or a list of objects otherwise.<br />
      Don't send a request body. </td>
  </tr>
  <tr>
    <td> DELETE<br /></td>
    <td> N/A<br /></td>
    <td> Cancel the posted job. <code>{:model_uid}</code> must be specified.<br />
      Don't send a request body. </td>
  </tr>
</tbody>
</table>

<div id="oauth2auth">
<h3>oauth2auth</h3>
</div>
<p>This is an object providing the way to sign up to the platform with an Oauth2 provider's account.<br />
<b>Not the OAuth2 provider API.</b></p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> HTTP Method </th>
    <th> Return Type </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> POST<br /></td>
    <td> N/A<br /></td>
    <td> Not Allowed. </td>
  </tr>
  <tr>
    <td> PUT </td>
    <td> N/A </td>
    <td> Not Allowed.<br /></td>
  </tr>
  <tr>
    <td> GET </td>
    <td> N/A </td>
    <td> Retrieves the result of OAuth2 authorization or verification.<br />
      Don't send a request body.<br />
      Use the following query parameters for the method.<br />
      <table class="table table-bordered">
        <thead>
          <tr>
            <th> Name </th>
            <th> Description </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> p<br /></td>
            <td> The OAuth2 provider to be connected. <code>fb</code> (for <a href="https://www.facebook.com">Facebook</a>) or <code>github</code> (for <a href="https://github.com">GitHub</a>) is available.<br /></td>
          </tr>
          <tr>
            <td> t<br /></td>
            <td> The type of OAuth2 operation. <code>authorization</code> or <code>verification</code> is available.<br /></td>
          </tr>
          <tr>
            <td> c </td>
            <td> The authorization code provided by the corresponding OAuth2 provider.<br />
              This parameter is effective when <code>type</code> is <code>verification</code>, or ignored, otheriwise.<br /></td>
          </tr>
          <tr>
            <td>g</td>
            <td> The privileged operation name. This parameter is valid only when the <code>t</code> parameter is <code>verification</code> and the <code>c</code> parameter has the valid authorization code. <code>resetApiCredentials</code> is available for now. This operation forcedly updates user account credentials.<br />
              <b>TAKE CARE WHEN USING THIS OPTION. API credentials are updated and the old information is no longer available.</b> <br /></td>
          </tr>
        </tbody>
      </table></td>
  </tr>
  <tr>
    <td> DELETE<br /></td>
    <td> N/A<br /></td>
    <td> Not Allowed.<br /></td>
  </tr>
</tbody>
</table>

<div id="account">
<h3>account</h3>
</div>
<p>Used for removing the registered account and data associated with the account.<br />
</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> HTTP Method </th>
    <th> Return Type </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> POST<br /></td>
    <td> N/A<br /></td>
    <td> Not Allowed. </td>
  </tr>
  <tr>
    <td> PUT </td>
    <td> N/A </td>
    <td> Not Allowed.<br /></td>
  </tr>
  <tr>
    <td> GET </td>
    <td>JSON</td>
    <td>You can inquire the current account information containing enrollment credentials, which offer your devices to enroll the sandbox cloud server. <br />
      <br />
      The response JSON contains the following fields.<br />
      <table class="table table-bordered">
        <thead>
          <tr>
            <th> Name </th>
            <th> Description </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>domainName</td>
            <td>The domain name associated with the account.</td>
          </tr>
          <tr>
            <td>applicationIdList<br /></td>
            <td>A comma separated value containing application ids associated with the account.</td>
          </tr>
          <tr>
            <td>authUserId</td>
            <td>The user id for authentication.</td>
          </tr>
          <tr>
            <td>enrollmentUserId</td>
            <td>The user id for device enrollment.</td>
          </tr>
          <tr>
            <td>enrollmentPassword</td>
            <td>The password for the user id.</td>
          </tr>
        </tbody>
      </table></td>
  </tr>
  <tr>
    <td> DELETE<br /></td>
    <td> N/A<br /></td>
    <td> Removes the currently logging in account.<br />
      Once the method is invoked, the session is invalidated immediately and the account info is removed.<br />
      The data associated with the account's application is also erased asynchronously (up to 24 hours to be removed completely). <br />
      Don't send a request body.</td>
  </tr>
</tbody>
</table>

<div id="log">
<h3>log</h3>
</div>
<p>Developers are able to tail the server side script logs via <code><a href="moat-js-api-document.html#ClassesMessageSession">MessageSession</a>.log()</code> function in the MOAT js. Only a single connection is allowed at the same time for the same package id.</p>
　　
<p>This object is for the debugging use rather than the application development.<br />
The possible operations are as follows</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> HTTP Method </th>
    <th> Return Type </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> POST<br /></td>
    <td> N/A </td>
    <td> Not allowed. </td>
  </tr>
  <tr>
    <td> PUT </td>
    <td> N/A </td>
    <td> Not allowed.<br /></td>
  </tr>
  <tr>
    <td> GET </td>
    <td> JSON </td>
    <td> Tails the server side MOAT js script log.<br />
      Don't send a request body.<br />
      You can set the following query parameters for the log query.<br />
      <table class="table table-bordered">
        <thead>
          <tr>
            <th> Name </th>
            <th> Description </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> t </td>
            <td> Whether to tail or not. Must be always <code>true</code>. No other parameter is allowed for now. </td>
          </tr>
        </tbody>
      </table></td>
  </tr>
  <tr>
    <td> DELETE<br /></td>
    <td> N/A<br /></td>
    <td> Not allowed. </td>
  </tr>
</tbody>
</table>

<div id="Developer_Defined_Models">
<h3>Developer Defined Models</h3>
</div>
<p>Developers are able to create their own data models by defining a <code>package.json</code> bundled in the MOAT js package. The limitations are described <a href="/legal/acceptable-use-policy.html">here</a>.<br />
POST request to unregistered models will fail with HTTP 400. All models to be accessed must be declared in the <code>package.json</code>. </p>

<div id="Developer_Defined_Models_URI_Form">
<h3>URI Form</h3>
</div>
<pre>https://host:port/moat/v1/{:package_id}/{:model_name}/{:model_uid}?{:query_paramters}</pre>
<ol>
<li><code>{:pacakge_id}</code> is an identifier for a collection of model types and MOAT js scripts.</li>
<li><code>{:model_name}</code> can be replaced with your arbitrary name of a model type.</li>
<li><code>{:model_uid}</code> is a unique identifier for a model object, which is represented by an attribute named <code>uid</code></li>
<li><code>{:query_paramters}</code> is a placeholder of a query string. See below.</li>
</ol>
<p>In order to specify an application id, the URI form will be like this:</p>
<pre>https://host:port/moat/v1/<b>{:application_id}:</b>{:package_id}/{:model_name}/{:model_uid}?{:query_paramters}</pre>
<br />
<p>Alternatively, these models are aggregated by a device. Therefore, the URL form can be<br />
</p>
<pre>https://host:port/moat/v1/sys/device/{:device_uid}/{:package_id}/{:model_name}/{:model_uid}?{:query_paramters}</pre>
<p>as well.<br />
- <code>{:device_uid}</code> is a device <code>uid</code> associated with the model objects.</p>
<br />
<p>This format can also include an application id as shown below.</p>
<pre>https://host:port/moat/v1/sys/device/{:device_uid}/<b>{:application_id}:</b>{:package_id}/{:model_name}/{:model_uid}?{:query_paramters}</pre>

<div id="Resource_Type_Query">
<h3>'Resource' Type Query</h3>
</div>
<p>All operations for Models having 'Resource' type fields are IGNORED by default. The only way to manipulate the fields is to issue GET request with the following parameters:</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Name<br />
    </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> f </td>
    <td> A comma separated value containing 'Resource' type field names to be retrieved.<br /></td>
  </tr>
  <tr>
    <td> r </td>
    <td> A comma separated value containing HTTP methods. The returned URLs are generated per the given HTTP methods. <code>get</code> is used by default (when <code>r</code> is missing and <code>f</code> contains a 'Resource' type field). </td>
  </tr>
  <tr>
    <td>q</td>
    <td>Optional. Arbitrary query string to be appended to resource URLs. The format is JSON stirng.
      	{% highlight json %}{"key1":"value1","key2":"value2",...}{% endhighlight %}
      And it <b>MUST BE URL-ENCODED</b>.<br />
      So often the value would be;
      <pre>%7B%22key1%22%3A%22value1%22%2C%22key2%22%3A%22value2%22%20 ... %7D</pre></td>
  </tr>
</tbody>
</table>
<p>For example, you can issue a GET request to the following URL;</p>
```bash
curl -X GET 'https://host:port/moat/v1/my-package/mymodel/12345?f=myResourceField&amp;r=get,post,put,delete,head&amp;q=%7B%22response-content-disposition%22%2C%22attachment%3B%20filename%3D%5C%22mydata%3Dis%3Dhere.txt%5C%22%22%7D'
```
<br />
<p>Then the result would be like this;</p>

```json
{
  "uid" : "12345",
  "myResourceField" : {
    "get" : "http://...?response-content-disposition=attachment...",
    "post" : "http://...?response-content-disposition=attachment...",
    "put" : "http://...?response-content-disposition=attachment...",
    "delete" : "http://...?response-content-disposition=attachment...",
    "head" : "http://...?response-content-disposition=attachment..."
  }
}
```

<h4>Generic Query Parameters</h4>
<p>You can specify the following query parameters for REST URI.</p>

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name<br />
      </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> token<br /></td>
      <td> An access token provided when you signed in.<br /></td>
    </tr>
    <tr>
      <td> m<br /></td>
      <td> Overwritten HTTP method. You can tell the runtime server the diffrent HTTP method name from the actually issued one.<br />
        This is helpful when your HTTP client only supports limited methods such as POST and GET.<br /></td>
    </tr>
    <tr>
      <td> l<br /></td>
      <td> The maximum number of entries to be returned for an inquiry. This is valid for a query request returning more than 2 entries.<br /></td>
    </tr>
    <tr>
      <td> o<br /></td>
      <td> The offset position key. This is used when the precedent query response still has remaining entries. You can tell the runtime server the offset position so to search data in the next segment.<br /></td>
    </tr>
    <tr>
      <td> f<br /></td>
      <td> A comma separated value containing field names to be retrieved.<br /></td>
    </tr>
    <tr>
      <td> callback<br /></td>
      <td> The name of javascript function name to be assigned.<br />
        You can use JSONP style API invocation with this parameter.<br /></td>
    </tr>
  </tbody>
</table>
        
<div id="Single_Model_Query">
  <h3>Single Model Query</h3>
</div>
<p>A GET request with <code>{:model_uid}</code> returns a JSON string. Each property has a field name of the requested model.</p>
<div id="List_Model_Query">
  <h3>List Model Query</h3>
</div>
<p>A GET request WITHOUT <code>{:model_uid}</code> returns a JSON string containing one or more model objects. The JSON string has the following structure:</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> offset </td>
      <td> The value or key to bookmark the returned result set. The value can be used for the next query request to retrieve the further results. </td>
    </tr>
    <tr>
      <td> limit </td>
      <td> The number of model objects to be retrieved at once. The maximum number of limit is 500 though the number can be less depending on the size of queried data. </td>
    </tr>
    <tr>
      <td> array </td>
      <td> The JSON array string of the queried data. </td>
    </tr>
  </tbody>
</table>
        
<div id="Create_Model_Object">
  <h3>Create Model Object</h3>
</div>
<p>With POST method, you can create a new model object on the cloud database. The created data is accessible from MOAT js script via <code><a href="moat-js-api-document.html#ClassesDatabase">Database</a></code> object.<br />
  The<code>{:model_uid}</code> will be automatically generated, which is contained in the return value.</p>

<div id="Update_Model_Object">
  <h3>Update Model Object</h3>
</div>
<p>You need to issue a PUT request so to update the existing model object.</p>

<div id="Delete_Model_Object">
  <h3>Delete Model Object</h3>
</div>
<p>You need to issue a DELETE request with <code>{:model_uid}</code> so to remove the existing model object.<br />
  You can remove two or more objects at a single request by concatenating <code>{:model_uid}</code>s of the objects with comma&nbsp;<code>,</code>.</p>
