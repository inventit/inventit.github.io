---
sitemap:
 priority: 0.8
 changefreq: weekly
 lastmod: 2013-09-28T00:00:00
name: ja/references.html
title: "Inventit Iot developer Network | リファレンス"
layout: references
lang: ja
breadcrumbs:
-
 name: リファレンス
 url: /ja/references.html
---

# API リファレンス

### MOAT IoT API

[MOAT IoT Model Descriptor](/ja/references/moat-iot-model-descriptor.html)

 * モデルの記述方法について説明します。

[MOAT REST](/ja/references/moat-rest-api-document.html)

 * HTTP ベースの REST API について説明します。(Version 1.0.3)

[MOAT js](/ja/references/moat-js-api-document.html)

 * サーバ上で動作する Javascript について説明します。(Version 1.1.0)

[MOAT Java/Android](/ja/references/moat-java-api-document.html)

 * Android と OSGi、そしてジェネリック Java SE の API セット について説明します。(Version 1.0.0)

[MOAT C](/ja/references/moat-c-api-document.html)

 * C ベースの API セットについて説明します。(Version 1.0.0)

### MOAT IoT API セットの関連

MOAT IoT API セットには、いくつかの重要なオブジェクトが定義されています。各 API セットのそれぞれの要素は、以下の表のように表すことができます。

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th rowspan="2"> MOAT オブジェクト </th>
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
      <td><a href="/ja/references/moat-js-api-document.html#GlobalObjectMOAT"><i class="icon-ok"></i></a></td>
      <td><a href="/ja/references/moat-java-api-document.html#Moat"><i class="icon-ok"></i></a></td>
    </tr>
    <tr>
      <td> ModelMapper </td>
      <td>N/A</td>
      <td><a href="/ja/references/moat-js-api-document.html#ClassesModelMapperStub"><i class="icon-ok"></i> (Stub)</a></td>
      <td><a href="/ja/references/moat-java-api-document.html#ModelMapper"><i class="icon-ok"></i></a></td>
    </tr>
    <tr>
      <td> Model </td>
      <td><a href="/ja/references/moat-rest-api-document.html#Developer_Defined_Models"><i class="icon-ok"></i></a></td>
      <td><a href="/ja/references/moat-js-api-document.html#ClassesModelStub"><i class="icon-ok"></i>(incl. Stub)</a></td>
      <td><i class="icon-ok"></i></td>
    </tr>
    <tr>
      <td> Device </td>
      <td><a href="/ja/references/moat-rest-api-document.html#device"><i class="icon-ok"></i></a></td>
      <td><a href="/ja/references/moat-js-api-document.html#ClassesDevice"><i class="icon-ok"></i></a></td>
      <td>N/A</td>
    </tr>
    <tr>
      <td> Dmjob </td>
      <td><a href="/ja/references/moat-rest-api-document.html#dmjob"><i class="icon-ok"></i></a></td>
      <td><a href="/ja/references/moat-js-api-document.html#ClassesDmjob"><i class="icon-ok"></i></a></td>
      <td>N/A</td>
    </tr>
  </tbody>
</table>

 * (in a URL form) は、MOAT オブジェクトが、URL のパスで表現されることを意味します。
 * (Stub) は、ModelMapper が、常にスタブオブジェクトとして扱われることを意味します。
 * (incl. Stub) は、モデルオブジェクトが API 経由 (`newModelStub()`) でスタブとして生成できることを意味します。モデルの実体は、`findByUid()` 等のAPI経由で操作することができます。

