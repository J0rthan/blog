---
title: SUID, SGID, and sticky bit
date: 2025-08-24
lastMod: 2025-08-24T22:22:00.820Z
tags: [Linux]
category: Linux
summary: This article is about Linux permission set
---

# Linux permissions: SUID, SGID, and sticky bit

## Symbolic method

The symbolic method uses the following syntax:

```bash
[tcarrigan@server ~]$ chmod WhoWhatWhich file | directory
```

Where:

- **Who** - represents identities: u, g, o, a(user, group, other, all)
- **What** - represents actions: +, -, =(add, remove, set exact)
- **Which** - represents access levels: r, w, x(read, write, execute)

An example of this is if i want to add the read and write permissions to a file named `test.txt` for user and group, I use the following command:

```bash
[tcarrigan@server ~]$ chmod ug+rw test.txt
```

## Numeric method

The numeric method is, in my experience, the best to learn and practice permissions. It's based on the following syntax:

```bash
[tcarrigan@server ~]$ chmod ### file | directory
```

Here, from left to right, the character `#` represents an access level. There are three access levels - user, group, and others. To determine what each digit is, we use the following:

- Start at 0.
- If the `read` permission should be set, add `4`.
- If the `write` permission should be set, add `2`.
- If the `execute` permission should be set, add `1`.

This is calculated on a per access level basis. Let's interpret this permissions example:

```bash
-rw-r-x---
```

This permissions are represneted as `650`.

- The user's permissions are: **rw-** or 4 + 2 = 6.
- The groups's permissions are: **r-x** or 4 + 1 = 5.
- The other's permissions are: **---** or 0.

To put this into the command syntax, it looks like this:

```bash
[tcarrigan@server ~]$ chmod 650 test.txt
```

## Special permission explained

Special permissions make up a fourth access level in addition to **user**, **group**, and **other**. Special permissions allow for additional privileges over the standard permission sets. There is a special permission option for each access level discussed previously. Let's take a look at each one individually, beginning with Set UID:

### user + s(pecial)

Commonly noted as **SUID**, the special permission for the user access level has a single function: A file with **SUID** always executes as the user who owns the file, regardless of the user passing the command. If the file owner doesn't have execute permissions, then use an upperacse **S** here.

To see this in a practical light, look at the `/usr/bin/passwd` command. This command, has the SUID permission set:

```bash
[tcarrigan@server ~]$ ls -l /usr/bin/passwd 
-rwsr-xr-x. 1 root root 33544 Dec 13  2019 /usr/bin/passwd
```

Note the **s** where **x** would usually indicate execute permissions for the user.

### group+s(pecial)

Commonly noted as **SGID**, this special permission has a couple of functions:

- If set on a file, it follows the file to be executed as the **group** that owns the file(similar to SUID)
- If set on a directory, any files created in the directory will have their **group** ownership set to that of the directory owner

```bash
[tcarrigan@server article_submissions]$ ls -l 
total 0
drwxrws---. 2 tcarrigan tcarrigan  69 Apr  7 11:31 my_articles
```

This permission set is noted by a lowercase **s** where the **x** would normally indicate **execute** privileges for the **group**. It's also especially useful for directories that are often used in collaborative efforts between members of a group. Any member of the group can access any new file. This applies to the execution of files, as well. **SGID** is very powerful when utilized properly.

As noted previously for **SUID**, if the owning group does not have execute permissions, then an uppercase **S** is used.

### other + t(sticky)

The last special permission has been dubbed the "sticky bit". This permission doesn't affect individual files. However, at the directory level, it restricts file deletion. Only the **owner(and root)** of a file can remove the file within that directory. A common example of this is the `/tmp` directory:

```bash
[tcarrigan@server article_submissions]$ ls -ld /tmp/
drwxrwxrwt. 15 root root 4096 Sep 22 15:28 /tmp/
```

The permission set is noted by the lowercase **t**, where the **x** would normally indicate the execute privilege.

## Setting special permissions

To set special permissions on a file or a directory, you can utilize either of the two methods outlined for standard permissions above: Symbolic or numerical.

Let's assume that we want to set **SGID** on the directory `community_content`.

```bash
[tcarrigan@server article_submissions]$ chmod g+s community_content/
```

Using the numerical method, we need to pass a fourth, preceding digit in our `chmod` command. The digit is calculated similarly to the standard permission digits:

- Start at 0
- SUID = 4
- SGID = 2
- Sticky = 1

The syntax is:

```bash
[tcarrigan@server ~]$ chmod X### file | directory
```

Where **X** is the special permissions digis.

Here is the command to set **SGID** on `community_content` using the numerical method:

```bash
[tcarrigan@server article_submissions]$ chmod 2770 community_content/
[tcarrigan@server article_submissions]$ ls -ld community_content/
drwxrws---. 2 tcarrigan tcarrigan 113 Apr  7 11:32 community_content/
```

