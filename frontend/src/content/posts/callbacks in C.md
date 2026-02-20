---
title: C callbacks
date: 2025-08-15
summary: callbacks
tags: C
---
# Callbacks in C

In C, a callback is a function that is passed as an argument to another code, which is expected to call back the argument at a given time. In simple terms, a callback is the process of passing a function (executable code) to another function as an argument, which is then called by the function to which it's passed.

In C, a callback function is passed through a **function pointer**.

Example:

```C
#include <stdio.h>

void A() { 
  printf("I am function A");
}
// Callback function
void B(void (*ptr)()) {
  
  	// Callback to A
    (*ptr)(); 
}

int main() {
  
  	// Function pointer to A()
    void (*ptr)() = &A;

    // Calling function B and passing
    // address of the function A as argument
    B(ptr);

    return 0;
}
```

Output:

```C
I am function A
```

## Syntax of Callback Functions

In C, the syntax for a callback function involves the use of function pointers. A function pointer is a variable that stores the address of a function. The function pointer is then passed to another function, and it can be called using the pointer.

```C
// Function signature of the callback function
void callback_function(void);

// A function that accepts a callback function
void some_function(void (*callback)()) {
      // Calling the callback function
     callback();
}
```

Working of Callback in C

THe step by step working of callbacks is as follows:

1. **Define the Callback Function:** This is the function that will be called from within another function.
2. **Declare a Function Pointer:** A pointer to the callback function is declared, typically matching the signature of the callback function.
3. **Pass the Function Pointer:** The pointer is passed as an argument to another function.
4. **Invoke the Callback Function:** Inside the receiving function, the callback function is called using the function pointer.

Examples of Callbacks in C:

Example_1:

```C
#include <stdio.h>

// Callback function to compare two numbers
int comp(int a, int b) {
    if (a > b) return a;
    return b;
}

// Function that accepts a callback for comparison
void Max(int (*callback)(int, int), int x, int y) {
  
    // Calls the callback function
    int res = callback(x, y); 
    printf("Given Numbers: %d, %d\n" ,x, y);
    printf("%d is greater", res);
}

int main() {
    int x = 7, y = 10;

    // Pass the compareNumbers function as callback
    Max(comp, x, y);

    return 0;
}
```

Example_2:

```C
#include <stdio.h>

// Callback functions
int add(int a, int b) {
    return a + b;
}
int sub(int a, int b) {
    return a - b;
}
int mul(int a, int b) {
    return a * b;
}
int div(int a, int b) {
    return a / b;
}

// General calculator function that accepts a callback
void calc(int a, int b, int (*op)(int, int)) {
  
  	// Call the callback function
    printf("%d\n", op(a, b));
}

int main() {
    int n1 = 10, n2 = 5;

    // Using the calculator with addition
    printf( "Numbers : %d, %d\n" ,n1, n2);
    printf("Sum : ");
    calc(n1, n2, add);

    // Using the calculator with subtraction
    printf("Difference: ");
    calc(n1, n2, sub);

    return 0;
}
```

