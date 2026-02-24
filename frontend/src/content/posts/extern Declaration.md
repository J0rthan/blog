---
title: extern Declaration
date: 2026-02-24
summary: extern
tags: C, extern,
---
# extern Declarations

## Syntax

```C
extern basetype variable-name;
```

Its meaning is that, in the current scope, the variable name refers to the file-scope variable of that name - which needs to be declared in a non-extern, non-static way somewhere else.

For instance, if one compilation module has this global variable declaration

```C
int error_count = 0;
```

then other compilation modules(a .c file and all its `#include` files) can specify this

```C
extern int error_count;
```

to allow reference to the same variable.

Since an extern declaration does not allocate space for the variable, it can omit the size of an array:

```C
extern int array[];
```

It is valid to have multiple `extern` declarations for the same variable, even in the same scope, if they give the same type. They do not conflict—they agree. For an array, it is legitimate for some `extern` declarations can specify the size while others omit it. However, if two declarations give different sizes, that is an error.

