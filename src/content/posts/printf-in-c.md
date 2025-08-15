---
title: Printf in C
date: 2025-05-16
lastMod: 2025-05-16T15:54:02.820Z
tags: [C]
category: C
summary: This article is about how to use printf function in C
---

`printf()` function is used to print formatted output in many ways to the standard output **stdout**(which is generally the console screen).

## Syntax of printf

The printf() function is defined inside **<stdio.h>** header file.

```c
printf("format_string", args...);
```

Parameter:

- **formatted_string**: It's a string that specifies the data to be printed. It may also contain a format specifier as a placeholder to print the value of any variable or value.
- **args...**: These are the variable/values corresponding to the format specifier.

Return Value:

- Returns the numebr of characters printed after successful execution.
- If an error occurs, a negative value is returned.

## Format Specifier in printf

The format string inside printf() can include various format specifiers whose primary function is to act as a placeholder for printing the variables and values. These format specifiers start with the percentage symbol(**%**).

```c
%[flags][width][.precision][length]specifier
```

| **Component** | **Meaning**                          | **Example**  |
| ------------- | ------------------------------------ | ------------ |
| %             | Marks the beginning of the specifier | %            |
| flags         | Adjust alignment, padding, symbols   | -, +, 0, #,  |
| width         | Minimum field width                  | 10, 4, etc.  |
| .precision    | Precision (decimal or min digits)    | .2, .5, etc. |
| length        | Length modifier (like long, short)   | l, ll, h, z  |
| specifier     | Data type to print                   | d, f, s, x   |

### 1. flags

| **Flag** | **Description**                          | **Example**         |
| -------- | ---------------------------------------- | ------------------- |
| -        | Left-align within the width              | %-5d prints 42      |
| +        | Show sign for positive numbers           | %+d prints +42, -42 |
| 0        | Pad with zeros instead of spaces         | %05d prints 00042   |
| #        | Add prefix (0x, 0) for hex/oct           | %#x prints 0x2a     |
| space    | Add space before positive number if no + | % d prints 42       |

### 2. Width

It is the sub-specifier that denotes the minimum number of characters that will be printed.s

- If the number of characters is less than the specified width, the white space will be used to fill the remaining characters' places.
- But if the number of characters is greater than the specified width, all the characters will be still printed without cutting off any.

### 3. .Precision

Precision sub specifier meaning differs for different data types it is being used with.

- **For Integral data(d, i, u, o, x, X):** Specifies the minimum number of digits to be printed. But unlike the width sub-specifier, instead of white spaces, t**his sub-specifier adds leading zeroes to the number.** If the number has more digits than the precision, the number is printed as it is.
- **For Float or Double Data(f, e, a, A)**: Specifies the number of digits to be printed after the decimal point.
- **For String (s):** Specifies the length of the string to be printed.

### 4. Length

There are 3 length sub-specifiers:

- **h:** With short int and unsigned short int
- **l:** With long int and unsigned long int.
- **L:** With long double

## Examples:

### Right Align the Output

We can right align the output using the width specifier with positive value.

```c
    char s[] = "Welcome to GfG!";

    // Printing right aligned string of width 40
    printf("%40s", s);

```

**Output**

```
                                                                                     Welcome to GfG!
```

**Explanation:** The format specifier **%40s** prints the string **s** right-aligned with a minimum width of **40** characters. If the string is shorter than **40** characters, it is padded with spaces on the left.

### Left Align the Output with Specified Width

If we pass negative width, the minimum width will be the absolute value of the width, but the text will be left aligned.

```c
↔
    char s[] = "Welcome to GfG!";

    // Printing left aligned string of width 50
    printf("%-50s", s);
    printf("Geeks");
↔
```

**Output**

```
Welcome to GfG!                                   Geeks
```

**Explanation**: The format specifier **%-50s** prints the string **s** left-aligned with a minimum width of **50** characters. The remaining spaces are padded with blanks, followed by printing **Geeks**.

### **Add Leading Zeroes to Integer**

The precision sub-specifier adds leading zeroes to the integer.

```c
↔
    int n = 2451;

    // Precision for integral data
    printf("%.10d
", n);
↔
```

**Output**

```
0000002451
```

**Explanation**: The format specifier **%.10d** ensures the integer n is printed with a precision of **10** digits. If n has fewer digits, it is left-padded with **zeros** to meet the required precision.

### **Limit Digits After Point in Float**

For floating point values, precision limits the number of digits to be printed after decimal points.

```c
↔
    float f = 2.451;

    // Precision for float data
    printf("%.2f", f);
↔
```

**Output**

```
2.45
```

**\*\*Explanation\*\***: The format specifier **\*\*%.2f\*\*** ensures the floating-point number **\*\*f\*\*** is printed with **\*\*2\*\*** digits after the decimal point. It rounds the value if necessary.

### **Limit Number of Characters in a String**

For strings, precision limits the number of characters to be printed.

```c
↔
    char s[] = "Welcome to GfG!";

    // Print with 3 decimal places
    printf("%.7s", s);
↔
```

**Output**

```
Welcome
```

**\*\*Explanation:\*\*** The format specifier **\*\*%.7s\*\*** prints only the first **\*\*7\*\*** characters of the string **\*\*s\*\***, truncating the rest if it exceeds this length.
