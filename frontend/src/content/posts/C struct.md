---
title: C struct
date: 2025-06-08
summary: C结构体
tags: C
---
# C Struct

In C, a **struct** is a user-defined data type that can be used to group items of possibly different types into a single type. The **struct** keyword is used to define a structure. The items in the struct are called its **member** and they can be of any valid data type.

Example:

```C
#include <stdio.h>

// Defining a structure
struct A {
    int x;
};

int main() {
  
    // Creating a structure variable
    struct A a;
  	
  	// Initializing member
  	a.x = 11;

    printf("%d", a.x);
    return 0;
}
```

Output:

```C
11
```

## Syntax of structure 

There are two steps of creating a structure in C:

1. Structure Definition
2. Creating Structure Variables

### Structure Definition

A structure is defined using the **struct** keyword followed by the structure name and its members. It's also called a structure **template** or structure **prototype**, and no memory is allocated to the structure in the declaration.

```C
struct struct_name {
  data_type1 member1;
  data_type2 member2;
  ...;
};
```

- struct_name: Name of the structure.
- member1, member2, ...: Name of the members.
- data_type1, data_type2, ...: Type of the members.



### Creating Structure Variable

After structure definition, we have to create variable of that structure to use it. It's similar to the any other type of variable declaration:

```c
struct struct_name var;
```

We can also declare structure variables with structure definition.

```c
struct struct_name {
  ...;
}var1, var2, ...;
```

## Basic Operations of Structure

Following are the basic operations commonly used on structures:

### 1. Access Structure Members

To access or modify members of a structure, we use the **(.) dot operator**. This is applicable when we are using structure variables directly.

```c
struct_name.member1;
struct_name.member2;
```

In this case where we have a pointer to the structure, we can also use the **arrow operator** to access the members.

```c
struct_ptr -> member1;
struct_ptr -> member2;
```

### 2. Initialize Structure Members

Struct members **cannot be** initialized with the declaration. For example, the following C program fails in the compilation.

```c
struct structure_name {
  data_type1 member1 = value1; // Compiler error
}
```

When a datatype is declared, no memory is allocated for it. Memory is allocated only when variables are created. Memory is allocated only when variables are created. 

### 3. Copy Structure

Copying structure is simple as copying any other variables. For example, s1 is copied into s2 using assignment operator.

```c
s2 = s1;
```

This method only creates a **shallow** copy of s1. If the structure s1 have some dynamic resources allocated by malloc, and it contains pointer to that resource, then only the pointer will be copied to **s2**. If the dynamic resource is also needed, then it has to be copied manually (deep copy).

```C
#include <stdio.h>
#include <stdlib.h>

struct Student {
    int id;
  	char grade;
};

int main() {
    struct Student s1 = {1, 'A'};
  
  	// Create a copy of student s1
  	struct Student s1c = s1;

    printf("Student 1 ID: %d\n", s1c.id);
    printf("Student 1 Grade: %c", s1c.grade);
  	return 0;
}
```

Output:

```c
Student 1 ID: 1
Student 1 Grade: A
```

### 4. Passing Structure to Functions

Structure can be passed to a function in the same way as normal variables. Though, it's recommended to pass it as a pointer to avoid copying a large amount of data.

```c
#include <stdio.h>

// Structure definition
struct A {
    int x;
};

// Function to increment values
void increment(struct A a, struct A* b) {
    a.x++;
  	b->x++;
}

int main() {
    struct A a  = { 10 };
  	struct A b  = { 10 };
  
  	// Passing a by value and b by pointer
  	increment(a, &b);
  
  	printf("a.x: %d \tb.x: %d", a.x, b.x);
    return 0;
}
```

Output:

```c
a.x: 10 	b.x: 11
```

### 5. typedef for Structures

The **typedef** keyword is used to define an alias for the already existing datatype. In structures, we have to use the struct keyword along with the structure name to define the variables. Sometimes, this increases the length and complexity of the code. We can use the typedef to define some new shorter name for the structure.

```c
#include <stdio.h>

// Defining structure
typedef struct {
    int a;
} str1;

// Another way of using typedef with structures
typedef struct {
    int x;
} str2;

int main() {
  
    // Creating structure variables using new names
    str1 var1 = { 20 };
    str2 var2 = { 314 };

    printf("var1.a = %d\n", var1.a);
    printf("var2.x = %d\n", var2.x);
    return 0;
}
```

Output:

```c
var1.a = 20
var2.x = 314
```