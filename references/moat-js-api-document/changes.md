---
name: moat-js-api-document/changes.html
title: "Inventit Iot developer Network | References | MOAT js | Changes"
layout: references
breadcrumbs:
-
 name: References
 url: /references.html
-
 name: MOAT js
 url: /references/moat-js-api-document.html
-
 name: Changes
---
# Change History

## 1.5.0 October 24, 2014

 * MOAT js server runtime now eliminates a blocking function. `session.commit()` is obsolete. Do not use this function.

## 1.4.0 September 26, 2014

 * `console.log` is available because of API compatibility improvement
 * The version identifier included in a js file name is no longer mandatory. i.e. `start.js` is now a valid file name instead of `start!1.0.js`.

## 1.3.0 March 24, 2014

 * Removes `querySharedByUid` function and use `queryByUid` as `queryByUid` now automatically resolves the model scope

## 1.2.0 June 1, 2013

 * Adds new functions for calculating a message digest value and an hmac value to <a href="moat-js-api-document.html#ClassesMessageSession">MessageSession</a> object
 * Adds new functions for converting a hex ascii string to/from Base64 string to <a href="moat-js-api-document.html#ClassesMessageSession">MessageSession</a> object

## 1.1.0 February 6, 2013

 * Adds a new function <code>findPackage</code> to <a href="/references/moat-js-api-document.html#ClassesMessageSession">MessageSession</a> object to retrieve an application package stored via <a href="/references/moat-rest-api-document.html#package"><code>package</code> MOAT REST API</a> as&nbsp;<a href="/references/moat-js-api-document.html#ClassesModelStub">resource type</a>
 * Adds new properties to <a href="/references/moat-js-api-document.html#ClassesMessageSession">MessageSession</a> object. The properties represent meta information of currently executing script
 * Adds a new function <code>updateDmjobArguments</code> to <a href="/references/moat-js-api-document.html#ClassesMessageSession">MessageSession</a> object