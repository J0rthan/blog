---
title: scanf() and fget() in C
date: 2026-02-23
summary: scanf, fget
tags: C, scanf(), fget(),
---
# scanf() and fget() in C

## scanf()

```C
int scanf(const char *format, ...);
int scanf(const char *restrict format, ...);
```

format - pointer to a null-terminated character string specifying how to read the input.

**Return value:**

- the numebr of receiving arguments if successfully assigned.
- 0, matching failure occurred.
- EOF, input failure occurs before the first receiving argument was assigned.

**Rules:**

- scanf() is used to parse `%s`(a word) which matches a sequence of non-white-space characters.

A white-space in C is one of space, tab(`\t`) or newline(`\n`).

If you want something different, you can use `%[`:

- `%[a - z]`: parse as long as the input characters are in the range `a` - `z`.
- `%[ny]`: parse as long as the input characters are `y` or `n`.
- `%[^.]`: The `^` negates the list, so this means parse as logn as there is no `.` in the input.

**Example:**

```C
#include <stdio.h>

int main()
{
    int a;
    printf("enter a number: ");
    while (scanf("%d", &a) != 1)
    {
        // input was not a number, ask again:
        printf("enter a number: ");
    }
    printf("You entered %d.\n", a);
}
```



 ## fgets()

`fgets()` reads up to a given maximum number of characters, but stops at a newline, **which is read as well**. In other words: It reads a line of input.

```C
char *fgets(char *str, int n, FILE *stream)
```

- The parameter for the maximum length accounts for the necessary `0` byte, so we can just pass the size of our variable.
- The return value is either a pointer to `str` or `NULL` if, for any reason, nothing was read.

```C
#include <stdio.h>

int main() {
	char name[40];
  printf("What's your name? ");
  if (fgets(name, 40, stdin)) {
    printf("Hello %s!\n", name);
  }
  
  return 0;
}
```

Output:

```
What's your name? lkw
Hello lkw
!
```

this is because `fgets()` also reads the *newline* character itself. But the fix is simple as well: We use `strcspn()` to get the index of the *newline* character if there is one and overwrite it with `0`. `strcspn()` is declared in `string.h`, so we need a new `#include`:

```C
#include <stdio.h>
#include <string.h>

int main() {
  char name[40];
  printf("What's your name? ");
  if (fgets(name, 40, stdin)) {
    name[strcspn(name, "\n")] = 0;
    printf("Hello %s!\n", name);
  }
  
  return 0;
}
```

Output:

```
What's your name? lkw
Hello lkw!
```