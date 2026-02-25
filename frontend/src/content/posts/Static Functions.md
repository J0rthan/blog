---
title: static Functions
date: 2026-02-25
summary: static functions
tags: C, static
---
# Static Functions

The keyword `static` in a function definition limits the visibility of the name to the current compilation module. For instance, if one compilation module contains this code:

```C
static int foo(void) {
  ...
}
```

then the code of that compilation module can call `foo` anywhere after the definition, **but other compilation modules cannot refer to it at all.**

To call `foo` before its definition, it needs a forward declaration, which should use `static` since the function definition does. For this function, it looks like this:

```C
static int foo (void);
```

