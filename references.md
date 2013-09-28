---
sitemap:
 priority: 0.8
 changefreq: weekly
 lastmod: 2013-09-28T00:00:00
name: references.html
title: "Inventit Iot developer Network | References"
layout: references
breadcrumbs:
-
 name: References
 url: /references.html
---

# API References

### MOAT IoT API

[MOAT IoT Model Descriptor](/references/moat-iot-model-descriptor.html)

 * The way to describe your models

[MOAT REST](/references/moat-rest-api-document.html)

 * Version 1.0.3, HTTP based REST API set

[MOAT js](/references/moat-js-api-document.html)

 * Version 1.1.0, Server side javascript running on the sandbox server

[MOAT Java/Android](/references/moat-java-api-document.html)

 * Version 1.0.0, Android, OSGi and generic Java SE version of API set

[MOAT C](/references/moat-c-api-document.html)

 * Version 1.0.0, C-based API set

### Relationships between MOAT IoT API sets

There are several significant objects for MOAT IoT API sets. The respective elements are emerged on each MOAT IoT API set as illustrated below.

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th rowspan="2"> Key MOAT Objects </th>
      <th> MOAT REST </th>
      <th> MOAT <span class="GINGER_SOFATWARE_correct" grcontextid="js:0" ginger_sofatware_markguid="25da4cd2-7738-488d-a4c7-8ca9a92b825f" ginger_sofatware_uiphraseguid="d77a4332-46a4-4491-ac38-3b0be565094e">js</span></th>
      <th> MOAT Java/C </th>
    </tr>
    <tr>
      <th> Web Clients </th>
      <th> Server </th>
      <th> Device/Gateway </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> Moat</td>
      <td><i class="icon-ok"></i> (in a URL form)</td>
      <td><a href="/references/moat-js-api-document.html#GlobalObjectMOAT"><i class="icon-ok"></i></a></td>
      <td><a href="/references/moat-java-api-document.html#Moat"><i class="icon-ok"></i></a></td>
    </tr>
    <tr>
      <td> ModelMapper </td>
      <td>N/A</td>
      <td><a href="/references/moat-js-api-document.html#ClassesModelMapperStub"><i class="icon-ok"></i> (Stub)</a></td>
      <td><a href="/references/moat-java-api-document.html#ModelMapper"><i class="icon-ok"></i></a></td>
    </tr>
    <tr>
      <td> Model </td>
      <td><a href="/references/moat-rest-api-document.html#Developer_Defined_Models"><i class="icon-ok"></i></a></td>
      <td><a href="/references/moat-js-api-document.html#ClassesModelStub"><i class="icon-ok"></i>(incl. Stub)</a></td>
      <td><i class="icon-ok"></i></td>
    </tr>
    <tr>
      <td> Device </td>
      <td><a href="/references/moat-rest-api-document.html#device"><i class="icon-ok"></i></a></td>
      <td><a href="/references/moat-js-api-document.html#ClassesDevice"><i class="icon-ok"></i></a></td>
      <td>N/A</td>
    </tr>
    <tr>
      <td> Dmjob </td>
      <td><a href="/references/moat-rest-api-document.html#dmjob"><i class="icon-ok"></i></a></td>
      <td><a href="/references/moat-js-api-document.html#ClassesDmjob"><i class="icon-ok"></i></a></td>
      <td>N/A</td>
    </tr>
  </tbody>
</table>

 * (in a URL form) means MOAT object appears on a URL path
 * (Stub) means ModelMapper is always handled as a Stub object
 * (incl. Stub) means that a model object can be created as a stub via API (`newModelStub()`). The model entity can be handled via another APIs (`findByUid()`, etc.)
