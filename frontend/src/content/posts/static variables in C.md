---
title: static variables in C
date: 2026-02-23
summary: static variables
tags: C, static
---
# Static Variables in C

A static variable is declared using static keyword and have the property of retaining their value between multiple function calls. **It's initialized only once and is not destroyed when the function returns a value.**

## Static Variables in Function

Example:

```C
#include <stdio.h>

// Function with static variable
int fun() {
  static int count = 0;
  count++;
  return count;
}

int main() {
  printf("%d ", fun());
  printf("%d ", fun());
  
  return 0;
}
```

Output:

```
1 2
```

Explanation: The above program prints **1 2** because static variables **count** is only initialized once. 

## Syntax

```C
static data_type arg_name;
```

## Global Static Variables

Global static variables have their scope limited to the file they are defined in. It means that they cannot be accessed outside the current translation unit(C source file).

Example:

```C
#include <stdio.h>

// Static global variable
static int globalVar = 5;

void display() {
    printf("%d\n", globalVar);
}
int main() {
    display();  
    globalVar = 10;
    display();  
    return 0;
}
```

Output:

```
5
10
```