---
title: C fopen() function
date: 2025-12-06
summary: fopen()
tags: C
---
# C fopen() Function

The **fopen()** function is used to open a file in the specified mode. The function returns a file pointer**(FILE *)** which is used to perform further operations on the file, such as reading from or writing into it. If the file exists then the fopen() function opens the particular file else a new file is created in some cases.

Example:

```c
#include <stdio.h>
#inclue <stdlib.h>

int main() {
  FILE *fptr;
  // Creates a file "demo_file"
  // with file access as write mode
  fptr = fopen("demo_file.txt", "w+");

 	// 
  fprintf(fptr, "%s", "GeeksforGeeks");
  fclose(demo);
  
  return 0;
}
```

On running the following program, a new file will be created by the name "demo_file.txt" with the following content.

**demo_file.txt**

```
Welcome to GeeksforGeeks
```

## Syntax of fopen()

```c
fopen(filename, mode)
```

Parameters:

- **filename**: Name of the file to be opened(with extension)
- **mode**: For what purpose file is to be opened.

Return Values:

- Returns a FILE pointer if the file is successfully opened.
- Returns NULL if failed.

### File Opening Modes

The below table lists valid mode values for feof() function with their meaning:

| **Opening Modes** | **Description**                                        |
| :---------------------: | :----------------------------------------------------------- |
|          **r**          | Searches file. **Opens the file for reading only**. If the file is opened successfully fopen() loads it into memory and sets up a pointer that points to the first character in it. If the file cannot be opened fopen() returns **NULL**. |
|          **w**          | Searches file. If the file exists already, its contents are overwritten. **If the file doesn’t exist, a new file is created.** Returns NULL, if unable to open the file. **It creates a new file for writing only(no reading).** |
|          **a**          | Searches file. If the file is opened successfully fopen() loads it into memory and sets up a pointer that points to the last character in it. If the file doesn’t exist, a new file is created. Returns NULL, if unable to open the file. **The file is opened only for appending(writing at the end of the file).** |
|         **r+**          | Searches file. **Opens the file for both reading and writing**. If opened successfully, fopen() loads it into memory and sets up a pointer that points to the first character in it. Returns NULL, if unable to open the file. |
|         **w+**          | Searches file. If the file exists, its contents are overwritten. If the file doesn’t exist, a new file is created. Returns NULL, if unable to open the file. **The difference between w and w+ is that we can also read the file created using w+.** |
|         **a+**          | Searches file. If the file is opened successfully fopen( ) loads it into memory and sets up a pointer that points to the last character in it. If the file doesn’t exist, a new file is created. Returns NULL, if unable to open the file. **The file is opened for reading and appending(writing at the end of the file).** |
|         **rb**          | Open the **binary file in read mode.** If the file does not exist, the open() function returns NULL. |
|         **wb**          | Open the **binary file in write mode.** As the pointer is set to the start of the file, the **contents are overwritten.** If the file does not exist, a **new file is created.** |
|         **ab**          | Open the **binary file in append mode.** The file pointer is set **after the last character in the file**. A **new file is created** if no file exists with the name. |
|         **rb+**         | Open the **binary file in read and write mode.** If the file does not exist, the open() function returns NULL. |
|         **wb+**         | Open the **binary file in read and write mode.** Contents are overwritten if the file exists. It will be created if the file does not exist. |
|         **ab+**         | Open the **binary file in read and append mode.** A file will be created if the file does not exist. |