---
title: Printf in C
date: 2024-11-26
lastMod: 2024-11-26T15:54:02.820Z
tags: [C]
category: Linux
summary: Linux File Permissions
---

## What are Linux File Permissions?

![0_5FgkfJtRbgCQIJuk](/Users/lkw/Desktop/图片资源/0_5FgkfJtRbgCQIJuk.webp)

Linux file permissions consist of three sets of permissions:

1. User Permissions: Dictate actions the file's owner can perform
2. Group Permissions: Define permissions for members of the file's group
3. Other Permissions: Set Permissions for all other users on the system

## Converting Binary to Octal

For instance, the binary permission 'rwxr-xr-x' translates to the octal permission 755, with each permission having a corresponding numeric value.

## Common file permission expressions

- 755: Typical for executables, allowing the owner full permissions while enabling group members and others to read and execute.
- 644: Common for regular files, granting the owner read and write permissions while restricting others to read-only access.
- 777: Grants full permissions to everyone on the system, which can pose security risks and should be used cautiously.

## Modifying file permissions

The `chmod` command is used to modify file permissions in Linux. It allows users to set permissions explicitly or modify them incrementally.

- To set permissions to 755: `chmod 755 myfile`
- To add execute permission for **<u>all users</u>**: `chmod +x myfile`

Addtionnaly, `chmod` can be used with symbolic notation for more direct modifications:

- To add write permission for the group: `chmod g+w myfile`
- To remove execute permission for the others: `chmod o-x myfile`

## Decoding File System Information

`-rw-r--r--@ 1 lkw  staff  2 11 26 20:40 output.txt`

1. Permissions

`-rw-r--r--@`

`-` indicates the type of file(e.g., `-`for a regular file, `d` for a directory)

`@` indicates the file has extended attributes(e.g. Access control lists). Use `-l@` or `xattr` to view these attributes.

2. Number of Links

`1` 

- Shows the number of **hard links** to the file.
- At least one link exists for every file, pointing to its node. If the file has additional hard links, this number increases.

3. Owner

`lkw`

- The username of the file's owner.
- The owner has the permissions defined in the first group(rw-).

4. Group

`staff`

- The name of the group that owns the file.
- Group members have the permissions defined in the second group(r--).

5. File size

`2`

- Indicates the file size in **<u>byes</u>**.
- In this case, the file is 2 bytes long.

6. Last Modified Time

`11 26 20:40`

- The timestamp of the last modification:
  - 11:Month
  - 26:Day
  - 20:40:Time

7. File name

`output.txt`

