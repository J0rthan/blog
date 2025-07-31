---
title: Proxy server and Reverse proxy server
date: 2025-07-31
lastMod: 2025-07-31T20:16:02.820Z
tags: [Network]
category: Computer Network
summary: This article is about "proxy"
---
## proxy server

![Forward proxy flow: traffic flows from user's device (A) to forward proxy (B) to Internet to origin server (C)](https://jorthans-blog-storage.oss-cn-beijing.aliyuncs.com/forward_proxy_flow.png)

A forward proxy, often called a proxy, proxy serer, or web proxy, is a server tha sits in front of a group of client machines. When those computers make requests to sites and services on the internet, the proxy server intercepts those requests and then communicates with web servers on behalf of those clients, like a middleman.

For example:

in a standard internet communication, computer A would reach out directly to computer C, with the client sending requests to the origin server and the origin server responding to the client. 

When a forward proxy is in place, A will instead send requests to B, which will then forward the request to C. C will then send a response to B, which will forward the response back to A.

## reverse proxy

![Reverse proxy flow: traffic flows from user's device (D) to Internet to reverse proxy (E) to origin server (F)](https://jorthans-blog-storage.oss-cn-beijing.aliyuncs.com/reverse_proxy_flow.png)

A reverse proxy is a server that sits in front of one or more web servers, intercepting requests from clients. This is different from a forward proxy, where the proxy sits in front of the clients. With a reverse proxy, when clients send requests to the origin server of a website, those requests are intercepted at the <u>network edge</u>(the edge of the network is geographically close to the device) by the reverse proxy server. 

For eaxmple:

Typically all requests from D would go directly to F, and F would send responses directly to D.

With a reverse proxy, all requests from D will go directly to E, and E will send its requests to and receive responses from F. E will then pass along the appropriate responses to D.

## Difference between a forward and reverse proxy

A forward proxy sits in front of a client and ensures that no origin server ever communicates directly with that specific client. 

A reverse proxy sits infront of an origin server and ensures that no client ever communicates directly with that origin server.