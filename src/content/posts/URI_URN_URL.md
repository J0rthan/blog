---
title: URI, URN and URL 
date: 2025-08-18
lastMod: 2025-08-18T17:42:00.820Z
tags: [Network]
category: Computer Network
summary: Difference of URI, URN and URL
---

# URL URI URN

## URL

URL is an acronym that stands for **Uniform Resource Locator**. The following are examples of URLs:

```
https://jwt.io
https://auth0.com/docs/get-started#learn-the-basics
https://identicons.dev/static/icons/mono/png/icon-access-token.png
mailto:yourfriend@somewhere.com
ftp://ftpserver.com/myfolder
```

### URLs and links

A URL is a string that allows you to locate a resource. A link(short for hyperlink) is an HTML element that enables you to load a resource from a given URL in a browser. So, a link relies on a URL, and a URL can exist without a link, but a link without a URL makes no sense.

### Anatomy of a URL

![Structure of a URL with all its parts](https://jorthans-blog-storage.oss-cn-beijing.aliyuncs.com/url-anatomy.png)

An URL consists of the following parts:

- Scheme: in a URL, this is the protocol that should be used to access the resource. Like: HTTP, HTTPs and other schemes.
- Domain: this part indicates the server hosting the resource. It can be a domain name or an IP address.
- Port: It's the protocol port to which to send the request to access the resource.
- Path: this is the path to the resource on the hosting server. 
- Parameters: these are optional extra information provided to the hosting server.
- Anchor: it's also called *fragment*.

The group consisting of the domain name and the port, if present, is also known as *authority*. The scheme and the authority are seperated by the string `://`. If a URL has no authority, the scheme and the rest of the URL are separated only by the colon `:`. A typical example of a URL without the authority part is the URL representing an email address, such as `mailto:yourfriend@somewhere.com`.

## URI

The URI acronym stands for **Uniform Resource Identifier**. URLs allow you to locate a resource, a URI simply identifies a resource. This means that a URI is not necessraily intended as an address to get a resource. It's meant just as an identifier.

On the other hand, a URL is a URI. Beyond the fact that it uses the same URI syntax, it also identifies a resource through an address. In other words, a URL is an identifier that allows you to identify a resource and gives you directions to access it. 

URLs are a subset of URIs.

**An example of URI**

```xml
<?xml version = "1.0" encoding = "UTF-8"?>
<rec:recipe xmlns:recipe = "https://the-great-chef.com/languages/recipe">
  <rec:title>Spaghetti carbonara</rec:title>
  <rec:author>Anonymous</rec:author>
  <rec:ingredients>
    ...
  </rec:ingredients>
</cont:contact>
```

That `https://the-great-chef.com/languages/recipe` string is a URI that identifies an XML namespace, i.e., a set of names for XML elements and attributes that allows you to define a cooking recipe.

Although the format of that URI is the same as an URL, it doesn't allow you to access any resource on the Web. However, using that format lets you reduce name clashing for namespaces. 

## URN

The URN acronym stands for **Uniform Resource Name**, and its scope is to identify resources in a permanent way, even after the resource doesn't exist anymore.

Unlike a URL, a URN doesn't provide any information about locating the resource but simply identifies it, just like a pure URI. In particular, a URN is a URI whose scheme is `urn` and has the following structure:

`urn:<NAMESPACE-IDENTIFIER>:<NAMESPACE-SPECIFIC-STRING>`

The `<NAMESPACE-IDENTIFIER>` placeholder stands for a string representing the resource category you want to identify. The `<NAMESPACE-SPECIFIC-STRING>` is the resource's specific identifier, and its format depends on the namespace identifier.

The following are examples of URNs:

```
urn:isbn:1234567890
urn:ISSN:0167-6423
urn:ietf:rfc:2648
```

Unlike a URI, URNs are identifiers issued by public standard organizations and may involve anything needing a standard identifier in human activity, not just computer and software systems.

## Summary

![URI vs. URL vs. URN](https://jorthans-blog-storage.oss-cn-beijing.aliyuncs.com/URI-URL-URN.png)