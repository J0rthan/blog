---
title: What is alignment
date: 2025-09-02
lastMod: 2025-09-02T18:22:18.820Z
tags: [Computer Architecture]
category: Computer Architecture
summary: data alignment in memory
---

# What is alignment

Alignment refers to the arrangement of data in memory, and specifically deals with the issue of accessing data as proper units of infomration from main memory.

First we must conceptualize main memory as a block of consecutive memory locations. Each location contains a fixed number of bits. The data which these fixed number of bits represents can be accessed by the location's address. Thus addresses denote the smallest unit of memory which can be manipulated.

Example: A 32bit memory that is byte addressable.

![a matrix graphic](https://jorthans-blog-storage.oss-cn-beijing.aliyuncs.com/arr.gif)

Each row denotes a location with a fixed size of eight bits(1 byte) labeled **zero** through **seven**.

The actual addresses are labeled at the side and range from zero to three as offsets showing the number of bytes from the starting address of zero. 

4 rows of 8 bits equals 32 bits of memory total.

------

Issues of alignment come into play when the objects which need to be accessed are larger than the smallest addressable unit.

One: Given the following diagram, suppose floating point numbers are stored in memory as 16 bit objects(2 bytes).

![img](https://jorthans-blog-storage.oss-cn-beijing.aliyuncs.com/one.gif)

byte size objects being stored in a byte addressable memory.

------

Two:

2 blocks each containing 2 rows of eight bits labeled with the same address 0, 1, 2, 3 with a blank line between the 2 blocks but no blank lines between the rows inside a block like this:

![img](https://jorthans-blog-storage.oss-cn-beijing.aliyuncs.com/two.gif)

16 bit objects stored in a byte addressable memory.

------

Note each 16 bit object starts at a even address since each object is 2 bytes long. If you were to access at a address which was not a multiple of the size of the objects stored in main memory a misalignment would occur.

In this case, misalignment would occur at address 1,3 since no objects begin at those locations assuming all 16 bit objects are stored consecutively and no empty locations between them. All alignments in this example would occurr at even addresses if we extended the size of memory by an integer number of bytes in this case.

------

You do not want a misalignment to happen since you would be accessing parts of different objects and putting them together. An access at address 1 would grab the last half of the first 16 bit object and concatenate it with the first half of the second 16 bit object resulting in incorrect information.

Accesses to main memory will be aligned if the address is a multiple of the size of the object being tracked down as given by the formula in the H&P book:

![img](https://jorthans-blog-storage.oss-cn-beijing.aliyuncs.com/mod.gif)

Where A is the address and s is the size of the object being accessed.