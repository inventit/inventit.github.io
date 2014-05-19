---
sitemap:
 priority: 0.6
 changefreq: weekly
 lastmod: 2014-04-25T00:00:00
name: moat-c-api-document.html
title: "Inventit Iot developer Network | References | MOAT C"
layout: references
breadcrumbs:
-
 name: References
 url: /references.html
-
 name: MOAT C
---
  
# MOAT C

C API for client MOAT applications

### Version
1.0.0
　　
## Table of Contents
　　
### MOAT C
<ol>
  <li><a href="#MoatApp">MoatApp</a> interfaces</li>
  <li><a href="#Moat">Moat</a> interfaces</li>
  <li><a href="#ModelMapper">ModelMapper</a> interfaces</li>
  <li><a href="#DataStore">DataStore</a> interfaces</li>
  <li><a href="#MoatValue">MoatValue</a> type interfaces</li>
  <li><a href="#MoatObject">MoatObject</a> type interfaces</li>
  <li><a href="#PrimitiveDataTypes">Primitive Data Types</a></li>
  <li><a href="#UnidirectionalLinkedList">Unidirectional Linked List</a> interface</li>
</ol>

## MOAT C
<div class="alert alert-info"> <b>NOTICE:</b><br />
  The MOAT IoT API is designed in Object Oriented Paradigm. We apply the design philosophy to MOAT C API as well.<br />
  Give <a href="https://plus.google.com/u/0/103577935124656848081/posts">us</a> feedback if you have suggestions on it.<br />
</div>

### Overview

#### Modeling and MOAT API

The above diagram illustrates the relationships between modelling and MOAT API sets. At first, developers design models representing data sets on the device side. Then, they write server side code with MOAT js and client side code with MOAT C.<br />
This document focuses on MOAT C API used for developing the device side application.

#### MOAT C app specific function
Your MOAT C apps must implement the following function so that the underlying MOAT runtime environment is able to start/stop your apps.

<div id="MoatApp"></div>
### MoatApp interfaces

#### MOAT C application specific function

Your MOAT C apps must implement the following function so that the underlying MOAT runtime environment is able to start/stop your apps.

<table class="table table-hover table-bordered">
<thead>
<tr>
  <th> Signature </th>
  <th> Return Value </th>
  <th> Description </th>
</tr>
</thead>
<tbody>
<tr>
  <td> sse_int moat_app_main(<br />
    sse_int in_argc,<br />
    sse_char *in_argv[]) </td>
  <td><code>SSE_E_OK</code> if successful.<br />
    Failure otherwise.<br /></td>
  <td> This is a main entry point for the MOAT runtime environment to start your MOAT C app.<br />
    The function is responsible for;<br />
    <ol>
      <li>initializing your app and retrieving a <code>Moat</code> instance by invoking <code>moat_init()</code></li>
      <li>entering the main loop by invoking <code>moat_run()</code></li>
    </ol>
    <code>in_argc</code> is the number of passed arguments.<br />
    <code>*in_argv[]</code> is a pointer to the arguments. The <code>in_argv[0]</code> is always the URN of your MOAT C app.<br /></td>
</tr>
</tbody>
</table>

#### MOAT C app lifecycle management functions

The following functions offer your MOAT C app main entry point to manage the application lifecycle.

<table class="table table-hover table-bordered">
<thead>
<tr>
  <th> Signature </th>
  <th> Return Value </th>
  <th> Description </th>
</tr>
</thead>
<tbody>
<tr>
  <td> sse_int moat_init(<br />
    sse_char *in_url,<br />
    Moat *out_moat) </td>
  <td><code>SSE_E_OK</code> if successful.<br />
    Failure otherwise.<br /></td>
  <td> Returns an initialized <code>Moat</code> object.<br />
    <code>*in_url</code> must be identical with the <code>in_argv[0]</code> passed by <code>moat_app_main</code> function.<br />
    <code>*out_moat</code> is the initialized <code>Moat</code> instance if your app is initialized successfully.<br /></td>
</tr>
<tr>
  <td> sse_int moat_run(<br />
    Moat in_moat) </td>
  <td><code>SSE_E_OK</code> if successful.<br />
    Failure otherwise.<br /></td>
  <td> Enters the main loop of your MOAT C app.<br />
    Your app must set up everything, including registering models and/or adding event handlers,
    prior to invoking this function.<br />
    <div class="alert alert-danger"> <b>IMPORTANT</b> This function is BLOCKED until your MOAT C app invokes <code>moat_quit()</code> or the underlying MOAT runtime interrupts the loop.<br />
    </div>
    <code>in_moat</code> is the <code>Moat</code> instance acquired by <code>moat_init()</code>.<br /></td>
</tr>
<tr>
  <td>void moat_quit(<br />
    Moat in_moat) </td>
  <td>N/A</td>
  <td>Allows your MOAT C app to quit the running main loop.<br />
    This function terminates the main loop triggered by <code>moat_run()</code> and then your <code>moat_app_main</code> resumes.<code>in_moat</code> is the <code>Moat</code> instance acquired by <code>moat_init()</code>.<br /></td>
</tr>
<tr>
  <td> void moat_destroy(<br />
    Moat in_moat) </td>
  <td>N/A </td>
  <td> Discards a given <code>Moat</code> object.<br />
    Your MOAT C app code must invoke this function AFTER exiting <code>moat_run()</code>. <code>in_moat</code> is the <code>Moat</code> instance acquired by <code>moat_init()</code>.<br /></td>
</tr>
</tbody>
</table>

<div id="Moat"></div>
### Moat Interfaces

The Moat interfaces allow MOAT C applications to manage and/or manipulate model data.

#### Moat type
The `Moat` data type is context information associated with the underlying MOAT runtime environment.
You need to pass the valid object to all Moat functions described later.<br />
The data is always passed by the MOAT runtime so you don't have to instantiate it.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Name </th>
    <th> Type </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> Moat </td>
    <td> sse_pointer </td>
  </tr>
</tbody>
</table>

#### Moat functions

The following functions are methods associated with the <code>Moat</code> data type, class methods and/or instance methods in OO languages.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> sse_int moat_register_model(<br />
      Moat in_moat,<br />
      sse_char *in_model_name,<br />
      ModelMapper *in_mapper,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Registers a new model definition and a <code>ModelMapper</code> associated with the model so that the MOAT C app is able to share its data on Server.<br />
      <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_model_name</code> is the name of the model.<br />
      <code>*in_mapper</code> is a <code>ModelMapper</code> type instance created by your MOAT C app.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
  <tr>
    <td> sse_int moat_register_model(<br />
      Moat in_moat,<br />
      sse_char *in_model_name,<br />
      sse_char *json_desc,<br />
      ModelMapper *in_mapper,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Registers a new model definition and a <code>ModelMapper</code> associated with the model so that the MOAT C app is able to share its data on Server.<br />
      <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_model_name</code> is the name of the model.<br />
      <code>*json_desc</code> is a JSON string containing the <a href="moat-iot-model-descriptor.html">model descriptor</a> for the model.<br />
      <code>*in_mapper</code> is a <code>ModelMapper</code> type instance created by your MOAT C app.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
  <tr>
    <td> sse_int moat_remove_model(<br />
      Moat in_moat,<br />
      sse_char *in_model_name) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Removes the existing model definition from the runtime environment.<br />
      <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_model_name</code> is the name of the model.<br /></td>
  </tr>
  <tr>
    <td><strike>sse_int moat_unregister_model(<br />
      Moat in_moat,<br />
      sse_char *in_model_name)</strike></td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td><div class="alert alert-danger"><b>DEPRECATED:</b><br />
        Use <code>moat_remove_model</code> instead.</div>
      Removes the existing model definition from the runtime environment.<br />
      <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_model_name</code> is the name of the model.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_send_notification(<br />
      Moat in_moat, <br />
      sse_char *in_urn, <br />
      sse_char *in_key, <br />
      sse_char *in_model_name,<br />
      MoatObject *in_collection,<br />
      MoatNotifyResultProc in_result_proc,<br />
      sse_pointer in_user_data) </td>
    <td><code>zero or <br />
      positive value</code> if successful. The value is unique per function call so to identify your request.<br />
      Failure otherwise.<br /></td>
    <td> Removes the existing model definition from the runtime environment.<br />
      <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_urn</code> must be a job service id determining the type of client/server application flow.<br />
      <code>*in_key</code> can be set if any, which is the continuation key when this method is used for notifying asynchronous operation result. You can get this value from a context object associated with the key 'token' in the corresponding method when the method is defined as asynchronous. Set <code>NULL</code>, otherwise.<br />
      <code>*in_model_name</code> is the name of the model.<br />
      <code>*in_collection</code> is a collection of the model objects to be sent if any. Can be <code>NULL</code>. Each model must be registered prior to the method invocation.<br />
      <code>in_result_proc</code> is a callback function invoked when the notification request is completed, if any. Can be <code>NULL</code>. The type must be <code>MoatNotifyResultProc</code>(see below).<br />
      <code>in_user_data</code> is an application specific data to be passed to the callback function. This value is meaningful unless <code>in_user_data</code> is <code>NULL</code>.<br /></td>
  </tr>
  <tr>
    <td> void moat_set_user_data(<br />
      Moat in_moat,<br />
      sse_pointer in_user_data) </td>
    <td> N/A </td>
    <td> Associates an arbitrary object to the given Moat instance.<br />
      You can remove it by setting <code>NULL</code>.<br />
      <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>in_user_data</code> is an arbitrary data to be associated with the <code>in_moat</code> object.<br /></td>
  </tr>
  <tr>
    <td> sse_pointer moat_get_user_data(<br />
      Moat in_moat) </td>
    <td> A pointer to the user data. </td>
    <td> Returns the object associated with the given Moat instance.<br />
      <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br /></td>
  </tr>
</tbody>
</table>

#### Moat Opaque Types

##### MoatNotifyResultProc

This is an opaque type representing a callback function to be invoked when `moat_send_notification` is finished. Your MOAT C apps must implement the following function so that the runtime is able to call your MOAT C app function.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef void (*MoatNotifyResultProc)(<br />
      Moat in_moat,<br />
      sse_char *in_urn,<br />
      sse_char *in_model_name, <br />
      sse_int in_request_id, <br />
      sse_int in_result, <br />
      sse_pointer in_user_data)<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_urn</code> is a job service id associated with the notification.<br />
      <code>*in_model_name</code> is the name of the model.<br />
      <code>in_request_id</code> is a unique identifier returned by <code>moat_send_notification</code> in order to identify the invocation.<br />
      <code>in_result</code> is a result code of the <code>moat_send_notification</code> process. See below:<br />
      <div class="bs-callout">
        <p><code>SSE_E_OK</code> ... Successful</p>
        <p><code>SSE_E_NOMEM</code> ... Insufficient memory error</p>
        <p><code>SSE_E_NOENT</code> ... Authentication error</p>
        <p><code>SSE_E_INVAL</code> ... Server error</p>
        <p><code>SSE_E_TIMEDOUT</code> ... Communication timeout</p>
        <p><code>SSE_E_GENERIC</code> ... Miscellaneous error</p>
      </div>
      <code>in_user_data</code> is an application specific data passed via <code>moat_send_notification</code>.<br /></td>
  </tr>
</tbody>
</table>

<div id="ModelMapper"></div>
### ModelMapper Interfaces

These interfaces represent Create/Read/Update/Delete operations for a single data model, one model for one ModelMapper.<br />
The implementation is totally depending on developers, which means there is no constraint on the implementation of the interfaces. For instance, you can use the database or the file system for the object persistence if you want.

#### Singleton and Array

There are 2 kinds of model objects in MOAT IoT. One is Singleton, which is always a single record object and the other is Array, which aggregates zero, one or more model objects with unique identifiers.

#### UID, the unique identifier

Each model object must have an identifier field named 'uid' like the primary key in RDB.

#### ModelMapper type

The `ModelMapper` type is a collection of callback functions, which are invoked by the underlying MOAT runtime environment when a MOAT js code on the MOAT server runtime demands. See [(ModelMapperStub]/references/moat-js-api-document.html#ClassesModelMapperStub) for detail, the stub class functions are corresponding to the callback functions declared here.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Name </th>
    <th> Type </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> ModelMapper </td>
    <td> struct </td>
  </tr>
</tbody>
</table>

##### Model Object Accessor Members

The following table illustrates functions so-called accessors in OO languages.<br />
They are called by the underlying MOAT runtime environment but you never call them directly.<br />
The responsibility of the functions is to offer the MOAT runtime to CRUD (create/read/update/delete) model objects managed by your MOAT C app.<br />
The functions are corresponding to ones defined in [ModelMapperStub](/references/moat-js-api-document.html#ClassesModelMapperStub). The stub methods invocation is propagated by the MOAT runtime (including both Server and Client) and the callback functions are invoked in the end.<br />
<br />
See [ModelMapper Opaque Types](#ModelMapperOpaqueTypes) for the following type detail.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Name </th>
    <th> Type </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> AddProc </td>
    <td><a href="#MoatAddProc">MoatAddProc</a></td>
  </tr>
  <tr>
    <td> RemoveProc </td>
    <td><a href="#MoatRemoveProc">MoatRemoveProc</a></td>
  </tr>
  <tr>
    <td> UpdateProc </td>
    <td><a href="#MoatUpdateProc">MoatUpdateProc</a></td>
  </tr>
  <tr>
    <td> UpdateFieldsProc </td>
    <td><a href="#MoatUpdateFieldsProc">MoatUpdateFieldsProc</a></td>
  </tr>
  <tr>
    <td> FindAllUidsProc </td>
    <td><a href="#MoatFindAllUidsProc">MoatFindAllUidsProc</a></td>
  </tr>
  <tr>
    <td> FindByUidProc </td>
    <td><a href="#MoatFindByUidProc">MoatFindByUidProc</a></td>
  </tr>
  <tr>
    <td> CountProc </td>
    <td><a href="#MoatCountProc">MoatCountProc</a></td>
  </tr>
</tbody>
</table>

<div id="ModelMapperOpaqueTypes"></div>
#### ModelMapper Opaque Types

<div id="MoatAddProc"></div>
##### MoatAddProc

This is an opaque type representing a callback function to be invoked when `ModelMapperStub.add` is performed on the MOAT server runtime.<br />
MOAT C app must implement this function to store the passed `MoatObject` and associate it with the given 'uid' value so that `MoatFindAllUidsProc` and `MoatFindAllUidsProc` type functions are able to retrieve the object.<br />
Note that MOAT C API specification doesn't care of the way to persist the object data, which is completely dependent on MOAT C apps.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef sse_int (*MoatAddProc)(<br />
      Moat in_moat,<br />
      sse_char *in_uid,<br />
      MoatObject *in_object,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_uid</code> is a 'uid' value of the <code>*in_object</code>.<br />
      <code>*in_object</code> is an object to be added.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
</tbody>
</table>

<div id="MoatRemoveProc"></div>
MoatRemoveProc

This is an opaque type representing a callback function to be invoked when `ModelMapperStub.remove` is performed on the MOAT server runtime.<br />
MOAT C app must implement this function to remove the object specified by the given 'uid' value.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef sse_int (*MoatRemoveProc)(<br />
      Moat in_moat,<br />
      sse_char *in_uid,<br />
      sse_pointer in_model_context)<br /></td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_uid</code> is a 'uid' value of a model object to be removed.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
</tbody>
</table>

<div id="MoatUpdateProc"></div>
##### MoatUpdateProc

This is an opaque type representing a callback function to be invoked when `ModelMapperStub.update` is performed on the MOAT server runtime.<br />
MOAT C app must implement this function to update all fields in the object specified by the given 'uid' value.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef sse_int (*MoatUpdateProc)(<br />
      Moat in_moat,<br />
      sse_char *in_uid,<br />
      MoatObject *in_object,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_uid</code> is a 'uid' value of a model object to be updated.<br />
      <code>*in_object</code> is an object to be added.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
</tbody>
</table>

<div id="MoatUpdateFieldsProc"></div>
##### MoatUpdateFieldsProc

This is an opaque type representing a callback function to be invoked when `ModelMapperStub.updateFields` is performed on the MOAT server runtime.<br />
MOAT C app must implement this function to update all fields in the object specified by the given 'uid' value.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef sse_int (*MoatUpdateFieldsProc)(<br />
      Moat in_moat,<br />
      sse_char *in_uid,<br />
      MoatObject *in_object,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_uid</code> is a 'uid' value of a model object to be updated.<br />
      <code>*in_object</code> is an object to be updated.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
</tbody>
</table>

<div id="MoatFindAllUidsProc"></div>
##### MoatFindAllUidsProc

This is an opaque type representing a callback function to be invoked when `ModelMapperStub.findAllUids` is performed on the MOAT server runtime.<br />
MOAT C app must implement this function to return all objects associated with the model type.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef sse_int (*MoatFindAllUidsProc)(<br />
      Moat in_moat,<br />
      SSESList **out_uids,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>**out_uids</code> is an out parameter of the retrievable objects.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
</tbody>
</table>

<div id="MoatFindByUidProc">
<h5>MoatFindByUidProc</h5>
</div>
<p>This is an opaque type representing a callback function to be invoked when <code>ModelMapperStub.findByUid</code> is performed on the MOAT server runtime.<br />
MOAT C app must implement this function to return a model object specifed by the given 'uid'.</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef sse_int (*MoatFindByUidProc)(<br />
      Moat in_moat,<br />
      sse_char *in_uid,<br />
      MoatObject **out_object,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_uid</code> is a 'uid' value of a model object to be retrieved.<br />
      <code>**out_object</code> is an out parameter of the returned object.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
</tbody>
</table>

<div id="MoatCountProc"></div>
##### MoatCountProc

This is an opaque type representing a callback function to be invoked when `ModelMapperStub.count` is performed on the MOAT server runtime.<br />
MOAT C app must implement this function to return the number of stored objects.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef sse_int (*MoatCountProc)(<br />
      Moat in_moat,<br />
      sse_uint *out_count,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>**out_count</code> is an out parameter of the object count.<br />
      <code>in_model_context</code> is context information associated with the model. </td>
  </tr>
</tbody>
</table>

#### Command Interface Type

The command interface opaque type is a function so-called 'instance method' associated a model object in OO languages.<br />
They are called by the underlying MOAT runtime environment but you never call it directly.<br />
The responsibility of the function is to offer the MOAT runtime to invoke an instance method of a model object managed by your MOAT C app.<br />

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef sse_int (*MoatCommandProc)(<br />
      Moat in_moat,<br />
      sse_char *in_uid,<br />
      sse_char *in_key,<br />
      MoatValue *in_data,<br />
      sse_pointer in_model_context) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      <code>SSE_E_INPROGRESS</code> in progress<br />
      Failure otherwise.<br /></td>
    <td><code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_uid</code> is a 'uid' value of an Array model object or <code>NULL</code> if the target object is Singleton.<br />
      <code>*in_key</code> can be set if any, which is the continuation key when this method is used for notifying asynchronous operation result. You can get this value from a context object associated with the key 'token' in the corresponding method when the method is defined as asynchronous. Set <code>NULL</code>, otherwise.<br />
      <code>*in_data</code> is a parameter value passed by the MOAT runtime originated from MOAT js function call. The type can be defined in the model descriptor as
      <coce>paramType field.<br />
        <code>in_model_context</code> is context information associated with the model. </coce></td>
  </tr>
</tbody>
</table>

<div id="DataStore"></div>
### DataStore Interfaces

The DataStore interfaces allow MOAT C applications to manage and/or manipulate model data on a built-in store.

#### DataStore functions

The following functions offer your MOAT C apps to store/load/remove `MoatObject` data.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> sse_int moat_datastore_save_object(<br />
      Moat in_moat,<br />
      sse_char *in_key,<br />
      MoatObject *in_object) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Persists the given <code>MoatObject</code> object into the MOAT runtime environment. <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_key</code> is a key string corresponding to the in_object.<br />
      <code>*in_object</code> is a <code>MoatObject</code> type instance created by your MOAT C app.<br />
      <div class="alert alert-danger"> <b>IMPORTANT</b> The key string is shared between this method and <code>moat_datastore_save_value</code>.
        The MOAT runtime overwrites the new <code>*in_value</code> if the <code>*in_key</code> is duplicate.<br />
      </div></td>
  </tr>
  <tr>
    <td> sse_int moat_datastore_load_object(<br />
      Moat in_moat,<br />
      sse_char *in_key,<br />
      MoatObject **out_object) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Reads the given <code>MoatObject</code> object from the MOAT runtime environment. <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_key</code> is a key string corresponding to the out_object.<br />
      <code>**out_object</code> is a <code>MoatObject</code> type instance loaded from the runtime.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_datastore_remove_object(<br />
      Moat in_moat,<br />
      sse_char *in_key) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Removes a <code>MoatObject</code> object specified by the given key from the MOAT runtime environment. <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_key</code> is a key string to be removed.<br />
      <div class="alert alert-danger"> <b>IMPORTANT</b> You cannot use <code>moat_datastore_remove_value</code> to remove a <code>MoatObject</code> object. </div></td>
  </tr>
  <tr>
    <td> sse_int moat_datastore_save_value(<br />
      Moat in_moat,<br />
      sse_char *in_key,<br />
      MoatValue *in_value) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Persists the given <code>MoatValue</code> object into the MOAT runtime environment. <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_key</code> is a key string value corresponding to the in_object.<br />
      <code>*in_value</code> is a <code>MoatValue</code> type instance created by your MOAT C app.<br />
      <div class="alert alert-danger"> <b>IMPORTANT</b> The key string is shared between this method and <code>moat_datastore_save_object</code>.
        The MOAT runtime overwrites the new <code>*in_value</code> if the <code>*in_key</code> is duplicate.<br />
      </div></td>
  </tr>
  <tr>
    <td> sse_int moat_datastore_load_value(<br />
      Moat in_moat,<br />
      sse_char *in_key,<br />
      MoatValue  **out_value) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Reads the given <code>MoatValue</code> object from the MOAT runtime environment. <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_key</code> is a key string corresponding to the out_object.<br />
      <code>**out_value</code> is a <code>MoatValue</code> type instance loaded from the runtime.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_datastore_remove_value(<br />
      Moat in_moat,<br />
      sse_char *in_key) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Removes a <code>MoatValue</code> object specified by the given key from the MOAT runtime environment. <code>in_moat</code> is a <code>Moat</code> type instance passed by the MOAT runtime environment.<br />
      <code>*in_key</code> is a key string to be removed.<br />
      <div class="alert alert-danger"> <b>IMPORTANT</b> You cannot use <code>moat_datastore_remove_object</code> to remove a <code>MoatValue</code> object. </div></td>
  </tr>
</tbody>
</table>

<div id="MoatValue"></div>
### MoatValue type

#### MoatValue struct type

The MoatValue type represents an abstract field type in a model object.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef struct MoatValue_ MoatVlaue </td>
    <td> The struct type of <code>MoatValue</code>. </td>
  </tr>
</tbody>
</table>

#### MoatValue type enums

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef enum moat_value_type_ moat_value_type </td>
    <td></td>
  </tr>
</tbody>
</table>

The following table is a list of enums available as MoatValue types (the declaration of `moat_value_type_`).<br />
Most of types described in the 'Description' is corresponding to one used in a [Model Descriptor](/references/moat-iot-model-descriptor.html).

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Name </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> MOAT_VALUE_TYPE_BOOLEAN </td>
    <td> Represents <code>boolean</code> type. </td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPE_INT16 </td>
    <td> Represents <code>int16</code> type. </td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPE_INT32 </td>
    <td> Represents <code>int32</code> type. </td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPE_INT64 </td>
    <td> Represents <code>int64</code> type.<br />
      The use can be disabled by <code>SSE_CONFIG_USE_INT64</code> constant. </td>
  </tr>
  <tr>
    <td> SSE_CONFIG_USE_SINGLE_FLOAT </td>
    <td> Represents <code>float</code> type.<br />
      The use can be disabled by <code>SSE_CONFIG_USE_SINGLE_FLOAT</code> constant. </td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPE_DOUBLE </td>
    <td> Represents <code>double</code> type.<br />
      The use can be disabled by <code>SSE_CONFIG_USE_DOUBLE_FLOAT</code> constant. </td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPE_STRING </td>
    <td> Represents <code>string</code> type.<br /></td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPE_BINARY </td>
    <td> Represents <code>binary</code> type.<br /></td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPE_OBJECT </td>
    <td> Represents <code>MoatObject</code> type.<br /></td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPE_NULL </td>
    <td> Represents <code>NULL</code> value.<br /></td>
  </tr>
  <tr>
    <td> MOAT_VALUE_TYPEs </td>
    <td> Represents undefined type. Used only when value conversion is error. </td>
  </tr>
</tbody>
</table>

#### MoatValue generic functions

The following functions offer your MOAT C apps to manipulate `MoatValue` data.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> void moat_value_free(<br />
      MoatValue *self) </td>
    <td> N/A </td>
    <td> Frees the <code>MoatValue</code> object. <code>*self</code> is a <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> void moat_value_set_null(<br />
      MoatValue *self) </td>
    <td> N/A </td>
    <td> Sets <code>NULL</code> to the <code>MoatValue</code> object. <code>*self</code> is a <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_clone(<br />
      MoatValue *self) </td>
    <td><code>MoatValue</code> object if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a cloned <code>MoatValue</code> object. <code>*self</code> is a <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> moat_value_type moat_value_get_type(<br />
      MoatValue *self) </td>
    <td><code>moat_value_type</code> enum </td>
    <td> Returns the type of <code>MoatValue</code> object. <code>*self</code> is a <code>MoatValue</code> object.<br /></td>
  </tr>
</tbody>
</table>

#### MoatValue accessor functions

The following functions offer your MOAT C apps to get/set `MoatValue` data.

<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> sse_int moat_value_get_boolean(<br />
      MoatValue *self,<br />
      sse_bool *out_bool_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>boolean</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*out_bool_val</code> is a <code>boolean</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> void moat_value_set_boolean(<br />
      MoatValue *self,<br />
      sse_bool in_bool_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Sets the typed value contained in the <code>MoatValue</code> object.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>in_bool_val</code> is a <code>boolean</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_int16(<br />
      MoatValue *self,<br />
      sse_int16 *out_int16_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>int16</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*out_int16_val</code> is an <code>int16</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> void moat_value_set_int16(<br />
      MoatValue *self,<br />
      sse_int16 in_int16_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Sets the typed value contained in the <code>MoatValue</code> object.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>in_int16_val</code> is a <code>int16</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_int32(<br />
      MoatValue *self,<br />
      sse_int32 *out_int32_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>int32</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*out_int32_val</code> is an <code>int32</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> void moat_value_set_int32(<br />
      MoatValue *self,<br />
      sse_int32 in_int32_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Sets the typed value contained in the <code>MoatValue</code> object.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>in_int32_val</code> is a <code>int32</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_int64(<br />
      MoatValue *self,<br />
      sse_int64 *out_int64_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>int64</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*out_int64_val</code> is an <code>int64</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> void moat_value_set_int64(<br />
      MoatValue *self,<br />
      sse_int64 in_int64_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Sets the typed value contained in the <code>MoatValue</code> object.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>in_int64_val</code> is a <code>int64</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_float(<br />
      MoatValue *self,<br />
      sse_float *out_float_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>float</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*out_float_val</code> is an <code>float</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> void moat_value_set_float(<br />
      MoatValue *self,<br />
      sse_float in_float_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Sets the typed value contained in the <code>MoatValue</code> object.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>in_float_val</code> is a <code>float</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_double(<br />
      MoatValue *self,<br />
      sse_double *out_double_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>double</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*out_double_val</code> is an <code>double</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> void moat_value_set_double(<br />
      MoatValue *self,<br />
      sse_double in_double_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Sets the typed value contained in the <code>MoatValue</code> object.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>in_double_val</code> is a <code>double</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_string(<br />
      MoatValue *self,<br />
      sse_char **out_string_val,<br />
      sse_uint *out_len) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>double</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>**out_string_val</code> is a pointer to the char buffer in the object.<br />
      <code>*out_len</code> is the length of the string without NULL terminator code.<br /></td>
  </tr>
  <tr>
    <td> void moat_value_set_string(<br />
      MoatValue *self,<br />
      sse_char *in_string_val,<br />
      sse_uint in_len,<br />
      sse_bool in_dup) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Sets the typed value contained in the <code>MoatValue</code> object.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*in_string_val</code> is a <code>string</code> value to be set.<br />
      <code>in_len</code> is the length of a string. Can be 0 when the value is same as the string length.<br />
      <code>in_dup</code> is whether or not the string is passed by value.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_binary(<br />
      MoatValue *self,<br />
      sse_byte **out_binary_val,<br />
      sse_uint *out_len) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>binary</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>**out_binary_val</code> is a pointer to the byte buffer in the object.<br />
      <code>*out_len</code> is the length of the binary.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_set_binary(<br />
      MoatValue *self,<br />
      sse_byte *in_binary_val,<br />
      sse_uint in_len,<br />
      sse_bool in_dup) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>binary</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*in_binary_val</code> is a pointer to the byte buffer in the object.<br />
      <code>in_len</code> is the length of the binary.<br />
      <code>in_dup</code> is whether or not the binary is passed by value.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_object(<br />
      MoatValue *self,<br />
      MoatObject **out_obj_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>double</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>**out_obj_val</code> is a pointer to <code>MoatObject</code> object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_set_object(<br />
      MoatValue *self,<br />
      MoatObject *in_obj_val,<br />
      sse_bool in_dup) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>double</code> type.<br />
      <code>*self</code> is a <code>MoatValue</code> object.<br />
      <code>*in_obj_val</code> is a pointer to <code>MoatObject</code> object.<br />
      <code>in_dup</code> is whether or not the object is passed by value.<br /></td>
  </tr>
</tbody>

</table>
<h4>MoatValue typed factory functions</h4>
<p>The following functions offer your MOAT C apps to create a new <code>MoatValue</code> data.</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> MoatValue * moat_value_new(void) </td>
    <td><code>MoatValue</code> object if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a new <code>MoatValue</code>. </td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_boolean(<br />
      sse_bool in_bool_val) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a new <code>MoatValue</code> object with the given value.<br />
      <code>in_bool_val</code> is a value contained in the created <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_int16(<br />
      sse_int16 in_int16_val) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a new <code>MoatValue</code> object with the given value.<br />
      <code>in_int16_val</code> is a value contained in the created <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_int32(<br />
      sse_int32 in_int32_val) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a new <code>MoatValue</code> object with the given value.<br />
      <code>in_int32_val</code> is a value contained in the created <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_int64(<br />
      sse_int64 in_int64_val) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a new <code>MoatValue</code> object with the given value.<br />
      <code>in_int64_val</code> is a value contained in the created <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_float(<br />
      sse_float in_float_val) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a new <code>MoatValue</code> object with the given value.<br />
      <code>in_float_val</code> is a value contained in the created <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_double(<br />
      sse_double in_double_val) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a new <code>MoatValue</code> object with the given value.<br />
      <code>in_double_val</code> is a value contained in the created <code>MoatValue</code> object.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_string(<br />
      sse_string *in_string_val,<br />
      sse_uint in_len,<br />
      sse_bool in_dup) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a new <code>MoatValue</code> object with the given value.<br />
      <code>*in_string_val</code> is a <code>string</code> value to be set.<br />
      <code>in_len</code> is the length of a string. Can be 0 when the value is same as the string length.<br />
      <code>in_dup</code> is whether or not the string is passed by value.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_binary(<br />
      sse_byte *in_binary_val,<br />
      sse_uint in_len,<br />
      sse_bool in_dup) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>binary</code> type.<br />
      <code>*in_binary_val</code> is a pointer to the byte buffer in the object.<br />
      <code>in_len</code> is the length of the binary.<br />
      <code>in_dup</code> is whether or not the binary is passed by value.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_value_new_object(<br />
      MoatObject *in_obj_val,<br />
      sse_bool in_dup) </td>
    <td> a created <code>MoatValue</code> instance if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatValue</code> object.<br />
      This function fails if the given <code>MoatValue</code> object doesn't have <code>double</code> type.<br />
      <code>*in_obj_val</code> is a pointer to <code>MoatObject</code> object.<br />
      <code>in_dup</code> is whether or not the object is passed by value.<br /></td>
  </tr>
</tbody>
</table>

<div id="MoatObject">
<h3>MoatObject type</h3>
</div>
<h4>MoatObject struct type</h4>
<p>The MoatObject type is an object whose fields are dynamically added/removed like <code>Hash</code>(or <code>HashMap</code>) object.</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> typedef struct MoatObject_ MoatObject </td>
    <td> The struct type of <code>MoatObject</code>. </td>
  </tr>
</tbody>
</table>

<h4>MoatObject generic functions</h4>
<p>The following functions offer your MOAT C apps to manipulate <code>MoatObject</code> data.</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td> void moat_object_free(<br />
      MoatObject *self) </td>
    <td> N/A </td>
    <td> Frees the <code>MoatObject</code> object. <code>*self</code> is a <code>MoatObject</code> object.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_object_clone(<br />
      MoatObject *self) </td>
    <td><code>MoatObject</code> object if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a cloned <code>MoatObject</code> object. <code>*self</code> is a <code>MoatObject</code> object.<br /></td>
  </tr>
  <tr>
    <td> sse_uint moat_object_length(<br />
      MoatObject *self) </td>
    <td> The size of contained field properties in the given object. </td>
    <td> Returns the size of contained field properties in the <code>MoatObject</code>. <code>*self</code> is a <code>MoatObject</code> object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      MoatValue *in_value,<br />
      sse_bool in_dup,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given <code>MoatValue</code> object as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a key string corresponding to the <code>*in_value</code>.<br />
      <code>*in_value</code> is a <code>MoatValue</code> type instance to be added.<br />
      <code>in_dup</code> is whether or not the string is passed by value.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> MoatValue * moat_object_get_value(<br />
      MoatObject *self,<br />
      sse_char *in_key) </td>
    <td><code>MoatValue</code> object if successful.<br />
      <code>NULL</code> otherwise.<br /></td>
    <td> Returns a <code>MoatValue</code> object associated with the given <code>*in_key</code> property. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read. </td>
  </tr>
  <tr>
    <td> void moat_object_remove_value(<br />
      MoatObject *self,<br />
      sse_char *in_key) </td>
    <td> N/A </td>
    <td> Removes a property named <code>*in_key</code> in the <code>MoatObject</code> object. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to remove. </td>
  </tr>
  <tr>
    <td> MoatObjectIterator moat_object_create_iterator(<br />
      MoatObject *self) </td>
    <td> a <code><a href="#MoatObjectIterator">MoatObjectIterator</a></code> object to iterate properties contained in the given <code>MoatObject</code> instance. </td>
    <td> Returns an iterator object to list properties (key-value set) defined in the <code>MoatObject</code> object.<br />
      <code>*self</code> is a <code>MoatObject</code> object. </td>
  </tr>
</tbody>
</table>

<h4>MoatObject property accessor helper functions</h4>
<p>The following functions helps your MOAT C apps to add/get a property in a <code>MoatObject</code>.<br />
With these functions, you can access the unwrapped data directly without using <code>MoatValue</code> and its functions.<br />
The functions only provide <code>add</code> and <code>get</code> properties. Use <code>moat_object_remove_value</code> to remove an existing property.</p>
<table class="table table-hover table-bordered">
<thead>
  <tr>
    <th> Signature </th>
    <th> Return Value </th>
    <th> Description </th>
  </tr>
</thead>
<tbody>
  <tr> </tr>
  <tr>
    <td> sse_int moat_object_get_boolean(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_bool *out_bool_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>boolean</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>*out_bool_val</code> is a <code>boolean</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_boolean_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_bool in_bool_val,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given primitive type value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>in_bool_val</code> is a primitive type value to be added.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_get_int16(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_int16 *out_int16_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>int16</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>*out_int16_val</code> is a <code>int16</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_int16_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_int16 in_int16_val,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given primitive type value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>in_int16_val</code> is a primitive type value to be added.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_get_int32(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_int32 *out_int32_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>int32</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>*out_int32_val</code> is a <code>int32</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_int32_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_int32 in_int32_val,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given primitive type value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>in_int32_val</code> is a primitive type value to be added.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_get_int64(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_int64 *out_int64_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>int64</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>*out_int64_val</code> is a <code>int64</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_int64_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_int64 in_int64_val,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given primitive type value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>in_int64_val</code> is a primitive type value to be added.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_get_float(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_float *out_float_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>float</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>*out_float_val</code> is a <code>float</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_float_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_float in_float_val,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given primitive type value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>in_float_val</code> is a primitive type value to be added.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_get_double(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_double *out_double_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>double</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>*out_double_val</code> is a <code>double</code> value in the object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_double_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_double in_double_val,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given primitive type value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>in_double_val</code> is a primitive type value to be added.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_get_string(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_char **out_string_val,<br />
      sse_uint *out_len) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>string</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>**out_string_val</code> is a pointer to the char buffer in the object.<br />
      <code>*out_len</code> is the length of the string without NULL terminator code.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_string_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_char *in_string_val,<br />
      sse_uint in_len,<br />
      sse_bool in_dup,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given string value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>*in_string_val</code> is a <code>string</code> value to be set.<br />
      <code>in_len</code> is the length of a string. Can be 0 when the value is same as the string length.<br />
      <code>in_dup</code> is whether or not the string is passed by value.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_binary(<br />
      MoatValue *self,<br />
      sse_char *in_key,<br />
      sse_byte **out_binary_val,<br />
      sse_uint *out_len) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>binary</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>**out_binary_val</code> is a pointer to the byte buffer in the object.<br />
      <code>*out_len</code> is the length of the binary.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_binary_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      sse_byte *in_binary_val,<br />
      sse_uint in_len,<br />
      sse_bool in_dup,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given binary value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>*in_binary_val</code> is a <code>binary</code> value to be set.<br />
      <code>in_len</code> is the length of the binary.<br />
      <code>in_dup</code> is whether or not the string is passed by value.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_value_get_object(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      MoatObject **out_obj_val) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Returns the typed value contained in the <code>MoatObject</code> object.<br />
      This function fails if the given <code>*in_key</code> property doesn't have <code>MoatObject</code> type.<br />
      <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to read.<br />
      <code>**out_obj_val</code> is a pointer to <code>MoatObject</code> object.<br /></td>
  </tr>
  <tr>
    <td> sse_int moat_object_add_object_value(<br />
      MoatObject *self,<br />
      sse_char *in_key,<br />
      MoatObject *in_obj_val,<br />
      sse_bool in_dup,<br />
      sse_bool in_overwrite) </td>
    <td><code>SSE_E_OK</code> if successful.<br />
      Failure otherwise.<br /></td>
    <td> Adds the given <code>MoatObject</code> value as a property named <code>*in_key</code> in the <code>MoatObject</code> object.<br />
      This function implicitly wraps the value with <code>MoatValue</code> object.<br />
      The non <code>SSE_E_OK</code> code will be returned when the <code>*in_key</code> already exists in the object and <code>in_overwrite</code> is <code>sse_true</code>. <code>*self</code> is a <code>MoatObject</code> object.<br />
      <code>*in_key</code> is a property name to set.<br />
      <code>*in_obj_val</code> is a <code>MoatObject</code> value to be set.<br />
      <code>in_dup</code> is whether or not the string is passed by value.<br />
      <code>in_overwrite</code> is whether or not to overwrite the value if the <code>*in_key</code> is duplicate.<br /></td>
  </tr>
</tbody>
</table>

<div id="MoatObjectIterator">
<h4>MoatObjectIterator struct type</h4>
</div>
<p>The MoatObjectIterator type is an iterator object to list properties in a <code>MoatObject</code> instance.<br />
  This object is returned when <code>moat_object_create_iterator</code> is invoked.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Signature </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> typedef struct MoatObjectIterator_ MoatObjectIterator </td>
      <td> The struct type of <code>MoatObjectIterator</code>. </td>
    </tr>
  </tbody>
</table>

<h4>MoatObjectIterator generic functions</h4>
<p>The following functions offer your MOAT C apps to manipulate <code>MoatObjectIterator</code> object.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Signature </th>
      <th> Return Value </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> void moat_object_iterator_free(MoatObjectIterator *self) </td>
      <td> N/A </td>
      <td> Frees the <code>MoatObjectIterator</code> object. <code>*self</code> is a <code>MoatObjectIterator</code> object.<br /></td>
    </tr>
    <tr>
      <td> sse_bool moat_object_iterator_has_next(MoatObjectIterator *self) </td>
      <td><code>sse_false</code> if there is no next value to iterate.<br />
        Or NOT <code>sse_false</code> otherwise. </td>
      <td> Returns whether the <code>MoatObjectIterator</code> object has next value to iterate or not. <code>*self</code> is a <code>MoatObjectIterator</code> object.<br /></td>
    </tr>
    <tr>
      <td> sse_char * moat_object_iterator_get_next_key(MoatObjectIterator *self) </td>
      <td> The property name if there is the next value to iterate.<br />
        Or <code>NULL</code> otherwise. </td>
      <td> Returns a property name to read if the <code>MoatObjectIterator</code> object has next value to iterate or not. <code>*self</code> is a <code>MoatObjectIterator</code> object.<br /></td>
    </tr>
  </tbody>
</table>

<div id="PrimitiveDataTypes">
  <h3>Primitive Data Types</h3>
</div>
<p>Here is a primitive data type table available in MOAT C API.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Name </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> sse_byte </td>
      <td> Byte type. </td>
    </tr>
    <tr>
      <td> sse_char </td>
      <td> Character type. </td>
    </tr>
    <tr>
      <td> sse_uchar </td>
      <td> Unsigned character type. </td>
    </tr>
    <tr>
      <td> sse_int </td>
      <td> Platform dependent integer type. </td>
    </tr>
    <tr>
      <td> sse_uint </td>
      <td> Platform dependent unsigned integer type. </td>
    </tr>
    <tr>
      <td> sse_int8 </td>
      <td> 8bit integer type. </td>
    </tr>
    <tr>
      <td> sse_uint8 </td>
      <td> Unsigned 8bit integer type. </td>
    </tr>
    <tr>
      <td> sse_int16 </td>
      <td> 16bit integer type. </td>
    </tr>
    <tr>
      <td> sse_uint16 </td>
      <td> Unsigned 16bit integer type. </td>
    </tr>
    <tr>
      <td> sse_int32 </td>
      <td> 32bit integer type. </td>
    </tr>
    <tr>
      <td> sse_uint32 </td>
      <td> Unsigned 32bit integer type. </td>
    </tr>
    <tr>
      <td> sse_int64 </td>
      <td> 64bit integer type. </td>
    </tr>
    <tr>
      <td> sse_uint64 </td>
      <td> Unsigned 64bit integer type. </td>
    </tr>
    <tr>
      <td> sse_float </td>
      <td> Single float type. </td>
    </tr>
    <tr>
      <td> sse_double </td>
      <td> Double float type. </td>
    </tr>
    <tr>
      <td> sse_bool </td>
      <td> Boolean type. </td>
    </tr>
    <tr>
      <td> sse_pointer </td>
      <td> Generic pointer type. </td>
    </tr>
  </tbody>
</table>

<div id="UnidirectionalLinkedList">
  <h3>Unidirectional Linked List interfaces</h3>
</div>
<div id="SSEList">
  <h4>SSEList struct type</h4>
</div>
<p>The SSEList type is a struct representing the unidirectional linked list.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Signature/Definition </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> typedef struct SSESList_ SSESList;<br />
        struct SSESList_ {<br />
        sse_pointer Data;<br />
        SSESList *Next;<br />
        }; </td>
      <td><code>Data</code> contains list elements.<br />
        <code>*Next</code> is a link to the next list. </td>
    </tr>
  </tbody>
</table>

<h4>SSEList generic functions</h4>
<p>The following functions provides the way to manipulate the unidirectional linked list instance.</p>
<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th> Signature </th>
      <th> Return Value </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> SSESList * sse_slist_add(<br />
        SSESList *list,<br />
        sse_pointer in_data) </td>
      <td> The newly created linked list object containing the <code>in_data</code> if successful.<br />
        <code>NULL</code> otherwise. </td>
      <td> Adds a new linked list object.<br />
        <code>*list</code> is a linked list object to be added. <code>NULL</code> can be specified when a new instance is required.<br />
        <code>in_data</code> is an element to be appended into the list.<br /></td>
    </tr>
    <tr>
      <td> SSESList * sse_slist_remove(<br />
        SSESList *list,<br />
        sse_pointer in_data) </td>
      <td> The list instance containing the given <code>in_data</code> if exists.<br />
        <code>NULL</code> if there is no list element having the <code>in_data</code>. </td>
      <td> Removes a link including <code>in_data</code> from the given <code>*list</code>.<br />
        This function removes only the first list element by searching the given <code>*list</code> from the beginning.<br />
        This function does NOT free the given data but just removes the link. <code>*list</code> is a linked list object to be searched.<br />
        <code>in_data</code> is an element to be removed from the list.<br /></td>
    </tr>
    <tr>
      <td> sse_uint sse_slist_length(<br />
        SSESList *list) </td>
      <td> The length of the linked list. </td>
      <td> Returns the length of the given linked list. <code>*list</code> is a linked list object.<br /></td>
    </tr>
    <tr>
      <td> sse_pointer sse_slist_data(<br />
        SSESList *list) </td>
      <td> the <code>Data</code> of the given list element. </td>
      <td> Returns the <code>Data</code> of the given list element. <code>*list</code> is a linked list object.<br /></td>
    </tr>
    <tr>
      <td> SSESList * sse_slist_next(<br />
        SSESList *list) </td>
      <td> The <code>Next</code> list if exists.<br />
        <code>NULL</code> otherwise. </td>
      <td> Returns the <code>Next</code> of the given list element. <code>*list</code> is a linked list object.<br /></td>
    </tr>
    <tr>
      <td> SSESList * sse_slist_last(<br />
        SSESList *list) </td>
      <td> The last element of the given list.<br />
        <code>NULL</code> if missing. </td>
      <td> Returns the last element of the given list element. <code>*list</code> is a linked list object.<br /></td>
    </tr>
  </tbody>
</table>
