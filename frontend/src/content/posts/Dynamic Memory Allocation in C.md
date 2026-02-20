---
title: Dynamic Memory Allocation in C
date: 2025-12-06
summary: C 动态内存
tags: C
---

# Dynamic Memory Allocation in C

Dynamic memory allocation is possible in C by using the following 4 library functions provided by `<stdlib.h>` library:

## malloc()

The `malloc()`(stands for memory allocation) function is used to allocate a single block of contiguous memory on the heap at runtime. The memory allocated by `malloc()` is uninitialized, meaning it contains garbage values.

Syntax:

```c
malloc(size);
```

where **size** is the number of bytes to allocate.

This function returns a **void pointer** to the allocated memory that needs to be converted to the pointer of required type to be usable. If allocation fails, it returns NULL pointer.

Example:

Assume that we want to create an array to store 5 integers. Since the size of int is 4 bytes, we need 5 * 4 bytes = 20 bytes of memory. 

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
  int *ptr = (int *)malloc(20);
  // int *ptr = (int *)malloc(sizeof(int) * 5);
  
  // check if failed or pass
  if (ptr == NULL) {
    printf("Allocation Failed");
    exit(0);
  }
    
  // Populate the array
  for (int i = 0; i < 5; i++)
      ptr[i] = i + 1;
        
  // Print the array
  for (int i = 0; i < 5; i++)
      printf("%d ", ptr[i]);
  
  return 0;
}
```

Output:

```c
1 2 3 4 5
```

![Malloc-function-in-c](/Malloc-function-in-c.webp)

## calloc()

The `alloc()`(stands for contiguous allocation) function is similar to malloc(), but it initializes the allocated memory to zero. It's used when you need memory with default zero values.

Syntax:

```c
calloc(n, size);
```

where **n** is the number of elements and **size** is the size of each element in bytes.

This function also returns a void pointer to the allocated memory that is converted to the pointer of required type to be usable. If allocation fails, it returns NULL pointer.

Example:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
  int *ptr = (int *)calloc(5, sizeof(int));
  
  // check if failed or pass
  if (ptr == NULL) {
    printf("Allocation Failed");
    exit(0);
  }
  
  // already initialized to 0
  // print the array
  for (int i = 0;i < 5;++i)
    printf("%d ", ptr[i]);
  
  return 0;
}
```

Output

```c
0 0 0 0 0
```

![calloc-function-in-c](/calloc-function-in-c.webp)

## free()

The memory allocated using `malloc()` and `alloc()` is not de-allocated on their own. The `free()` function is used to release dynamically allocated memory back to the operating system. It's essential to free memory that is no longer needed to avoid memory leaks.

Syntax:

```c
free(ptr);
```

where **ptr** is the pointer to the allocated memory.

After freeing a memory block, the pointer becomes invalid, and it is no longer pointing to a valid memory location.

Example:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
  int *ptr = (int *)calloc(5, sizeof(int));
  
  for (int i = 0;i < 5;++i) {
    printf("%d ", ptr[i]);
  }
  
  free(ptr);
  ptr = NULL;
  
  return 0;
}
```

Output:

```c
0 0 0 0 0
```

After calling free(), it's a good practice to set the pointer to NULL to avoid using a "dangling pointer", which points to a memory location that has been deallocated.

![Free-function-in-c](/Free-function-in-c.webp)

## realloc()

`realloc()` function is used to resize a previously allocated memory block. It allows you to change the size of an existing memory allocation without needing to free the old memory and allocate a new block.

Syntax:

```c
realloc(ptr, new_size);
```

ptr is the pointer to the previously allocated memory block and new_size is the reallocated size that the memory block should have in bytes.

This function returns a pointer to the newly allocated memory, or NULL if the reallocation fails. If it fails, the original memory block remains unchanged and it will return a NULL pointer.

Example:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
  int *ptr = (int *)malloc(5 * sizeof(int));
  
  if (ptr == NULL) {
    printf("Memory Allocation Failed\n");
    exit(0);
  }
  
  int *temp = (int *)realloc(ptr, 8 * sizeof(int));
  
  if (temp == NULL) {
    printf("Memory Allocation Failed\n");
    exit(0);
  }
  
  ptr = temp;
  
  for (int i = 0;i < 5;++i) {
    ptr[i] = (i + 1) * 10;
  }
  
  temp = (int *)realloc(ptr, 5 * sizeof(int));
  
  if (temp == NULL) {
    printf("Memory Allocation Failed\n");
    exit(0);
  }
  
  for (int i = 0;i < 5;++i) {
    printf("%d ", ptr[i]);
  }
  
  free(ptr);
  ptr = temp = NULL;
  
  return 0;
}
```

![realloc-function-in-c](/realloc-function-in-c.webp)