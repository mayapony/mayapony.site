---
title: "[阅读记录]Typescript Function"
created: 2022-04-28T00:12:25+08:00
draft: false
tags: ["阅读记录"]
---

> 原文地址 [www.typescriptlang.org](https://www.typescriptlang.org/docs/handbook/2/functions.html)

> Learn about how Functions work in TypeScript.

Functions are the basic building block of any application, whether they’re local functions, imported from another module, or methods on a class. They’re also values, and just like other values, TypeScript has many ways to describe how functions can be called. Let’s learn about how to write types that describe functions.

## Function Type Expressions

---

== The simplest way to describe a function is with a function type expression ==. These types are syntactically similar to arrow functions:

```ts
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}
function printToConsole(s: string) {
  console.log(s);
}
greeter(printToConsole);
```

The syntax `(a: string) => void` means “a function with one parameter, named `a`, of type string, that doesn’t have a return value”. Just like with function declarations, if a parameter type isn’t specified, it’s implicitly `any`.

> ==Note that the parameter name is required.== The function type `(string) => void` means “a function with a parameter named `string` of type `any`“!

Of course, we can use a type alias to name a function type:

```ts
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

## Call Signatures

In JavaScript, functions can have properties in addition to being callable. ==However, the function type expression syntax doesn’t allow for declaring properties==. If we want to describe something callable with properties, we can write a _call signature_ in an object type:

```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";
doSomething(myFunc);
```

== Note that the syntax is slightly different compared to a function type expression - use : between the parameter list and the return type rather than =>. ==

## Construct Signatures

---

JavaScript functions can also be invoked with the `new` operator. TypeScript refers to these as _constructors_ because they usually create a new object. You can write a _construct signature_ by adding the `new` keyword in front of a call signature:

```ts
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

Some objects, like JavaScript’s `Date` object, can be called with or without `new`. You can combine call and construct signatures in the same type arbitrarily:

```ts
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

## Generic Functions

---

It’s common to write a function where the types of the input relate to the type of the output, or where the types of two inputs are related in some way. Let’s consider for a moment a function that returns the first element of an array:

```ts
function firstElement(arr: any[]) {
  return arr[0];
}
```

This function does its job, but unfortunately has the return type `any`. It’d be better if the function returned the type of the array element.

In TypeScript, _generics_ are used when we want to describe a correspondence between two values. We do this by declaring a _type parameter_ in the function signature:

```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

By adding a type parameter `Type` to this function and using it in two places, we’ve created a link between the input of the function (the array) and the output (the return value). Now when we call it, a more specific type comes out:

```ts
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```

### Inference

Note that we didn’t have to specify `Type` in this sample. The type was _inferred_ - chosen automatically - by TypeScript.

We can use multiple type parameters as well. For example, a standalone version of `map` would look like this:

```ts
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}
// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

Note that in this example, TypeScript could infer both the type of the `Input` type parameter (from the given `string` array), as well as the `Output` type parameter based on the return value of the function expression (`number`).

### Constraints

We’ve written some generic functions that can work on _any_ kind of value. Sometimes we want to relate two values, but can only operate on a certain subset of values. In this case, we can use a _constraint_ to limit the kinds of types that a type parameter can accept.

> [!note] NOTE
> 有时候我们对泛型的类型进行限制，在这种情况下需要使用 _constraint_

Let’s write a function that returns the longer of two values. To do this, we need a `length` property that’s a number. We _constrain_ the type parameter to that type by writing an `extends` clause:

> [!note] NOTE
> 例如下面这个例子，只接受含有 length 属性的类型

```ts
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.2345Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

There are a few interesting things to note in this example. We allowed TypeScript to _infer_ the return type of `longest`. ==Return type inference also works on generic functions.==

Because we constrained `Type` to `{ length: number }`, we were allowed to access the `.length` property of the `a` and `b` parameters. Without the type constraint, we wouldn’t be able to access those properties because the values might have been some other type without a length property.

The types of `longerArray` and `longerString` were inferred based on the arguments. Remember, generics are all about relating two or more values with the same type!

Finally, just as we’d like, the call to `longest(10, 100)` is rejected because the `number` type doesn’t have a `.length` property.

### Working with Constrained Values

Here’s a common error when working with generic constraints:

```ts
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
Type '{ length: number; }' is not assignable to type 'Type'.
  '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.2322Type '{ length: number; }' is not assignable to type 'Type'.
  '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.

  }

}

```

It might look like this function is OK - `Type` is constrained to `{ length: number }`, and the function either returns `Type` or a value matching that constraint. ==The problem is that the function promises to return the _same_ kind of object as was passed in, not just _some_ object matching the constraint==. If this code were legal, you could write code that definitely wouldn’t work:

> [!tip] IMPORTANT
> Type 类型一定包含 length 类型，包含 length 的不一定是 Type 类型

```ts
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

### Specifying Type Arguments

==TypeScript can usually infer the intended type arguments in a generic call, but not always.== For example, let’s say you wrote a function to combine two arrays:

```ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

Normally it would be an error to call this function with mismatched arrays:

```ts
const arr = combine([1, 2, 3], ["hello"]);
Type 'string' is not assignable to type 'number'.2322Type 'string' is not assignable to type 'number'.
```

If you intended to do this, however, you could manually specify `Type`:

```ts
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

### Guidelines for Writing Good Generic Functions

Writing generic functions is fun, and it can be easy to get carried away with type parameters. Having too many type parameters or using constraints where they aren’t needed can make inference less successful, frustrating callers of your function.

> [!tip] IMPORTANT
> 不能有太多的类型参数和类型约束

#### Push Type Parameters Down

Here are two ways of writing a function that appear similar:

```ts
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}
function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}
// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

> [!tip] IMPORTANT
> 第一个例子，TS 能推断出返回值的类型，而第二个则无法推断，因为第二个的 Type 是一个继承了 any[]的类型？

These might seem identical at first glance, but `firstElement1` is a much better way to write this function. Its inferred return type is `Type`, but `firstElement2`’s inferred return type is `any` because TypeScript has to resolve the `arr[0]` expression using the constraint type, rather than “waiting” to resolve the element during a call.

> **Rule**: When possible, use the type parameter itself rather than constraining it

> [!tip] IMPORTANT
> 尽量不要使用类型约束而直接使用 type 参数它自己

#### Use Fewer Type Parameters

Here’s another pair of similar functions:

```ts
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}
function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

> [!tip] IMPORTANT
> 因为类型 Func 没有并没有将两个属性建立起联系

We’ve created a type parameter `Func` that _doesn’t relate two values_. That’s always a red flag, because it means callers wanting to specify type arguments have to manually specify an extra type argument for no reason. `Func` doesn’t do anything but make the function harder to read and reason about!

> **Rule**: Always use as few type parameters as possible

#### Type Parameters Should Appear Twice

Sometimes we forget that a function might not need to be generic:

```ts
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}
greet("world");
```

We could just as easily have written a simpler version:

```ts
function greet(s: string) {
  console.log("Hello, " + s);
}
```

Remember, type parameters are for _relating the types of multiple values_. If a type parameter is only used once in the function signature, it’s not relating anything.

> [!tip] IMPORTANT
> 类型参数（尖括号内的）是用来对多个函数的参数建立联系的。如果一个类型参数仅仅被使用一次，这种就不需要使用泛型。

> **Rule**: If a type parameter only appears in one location, strongly reconsider if you actually need it

## Optional Parameters

Functions in JavaScript often take a variable number of arguments. For example, the `toFixed` method of `number` takes an optional digit count:

```ts
function f(n: number) {
  console.log(n.toFixed()); // 0 arguments
  console.log(n.toFixed(3)); // 1 argument
}
```

We can model this in TypeScript by marking the parameter as _optional_ with `?`:

```
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK

```

Although the parameter is specified as type `number`, the `x` parameter will actually have the type `number | undefined` because unspecified parameters in JavaScript get the value `undefined`.

You can also provide a parameter _default_:

```ts
function f(x = 10) {
  // ...
}
```

Now in the body of `f`, `x` will have type `number` because any `undefined` argument will be replaced with `10`. Note that when a parameter is optional, callers can always pass `undefined`, as this simply simulates a “missing” argument:

```ts
declare function f(x?: number): void;
// cut
// All OK
f();
f(10);
f(undefined);
```

### Optional Parameters in Callbacks

Once you’ve learned about optional parameters and function type expressions, **it’s very easy to make the following mistakes when writing functions that invoke callbacks:**

```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

What people usually intend when writing `index?` as an optional parameter is that they want both of these calls to be legal:

```ts
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

What this _actually_ means is that _`callback` might get invoked with one argument_. In other words, the function definition says that the implementation might look like this:

```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // I don't feel like providing the index today
    callback(arr[i]);
  }
}
```

In turn, TypeScript will enforce this meaning and issue errors that aren’t really possible:

```ts
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
'i' is possibly 'undefined'.18048'i' is possibly 'undefined'.

});

```

In JavaScript, if you call a function with more arguments than there are parameters, the extra arguments are simply ignored. TypeScript behaves the same way. Functions with fewer parameters (of the same types) can always take the place of functions with more parameters.

> When writing a function type for a callback, _never_ write an optional parameter unless you intend to _call_ the function without passing that argument

## Function Overloads

Some JavaScript functions can be called in a variety of argument counts and types. For example, you might write a function to produce a `Date` that takes either a timestamp (one argument) or a month/day/year specification (three arguments).

In TypeScript, we can specify a function that can be called in different ways by writing _overload signatures_. To do this, write some number of function signatures (usually two or more), followed by the body of the function:

```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.2575No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.

```

In this example, we wrote two overloads: one accepting one argument, and another accepting three arguments. These first two signatures are called the _overload signatures_.

Then, we wrote a function implementation with a compatible signature. Functions have an _implementation_ signature, but this signature can’t be called directly. Even though we wrote a function with two optional parameters after the required one, it can’t be called with two parameters!

> [!tip] IMPORTANT
> 先写 signature 再写实现函数，并且 signature 不能被直接调用

### Overload Signatures and the Implementation Signature

This is a common source of confusion. ==Often people will write code like this and not understand why there is an error==:

```ts
function fn(x: string): void;
function fn() {
  // ...
}
// Expected to be able to call with zero arguments
fn();
Expected 1 arguments, but got 0.2554Expected 1 arguments, but got 0.
```

Again, the signature used to write the function body can’t be “seen” from the outside.

> The signature of the _implementation_ is not visible from the outside. When writing an overloaded function, you should always have _two_ or more signatures above the implementation of the function.

The implementation signature must also be _compatible_ with the overload signatures. For example, these functions have errors because the implementation signature doesn’t match the overloads in a correct way:

> [!tip] IMPORTANT
> 只有一个 signature 是没有意义的，只有一个 signature 再写一个它的实现不如直接写一个普通函数，所以要 2+个 signature 才行。对 signature 的实现必须兼容所有的重载 signature，上面的例子报错就是没有兼容（缺少变量 x）。

```ts
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
This overload signature is not compatible with its implementation signature.2394This overload signature is not compatible with its implementation signature.

function fn(x: boolean) {}
```

```ts
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
This overload signature is not compatible with its implementation signature.2394This overload signature is not compatible with its implementation signature.

function fn(x: string | number) {
  return "oops";
}

```

### Writing Good Overloads

Like generics, there are a few guidelines you should follow when using function overloads. Following these principles will make your function easier to call, easier to understand, and easier to implement.

Let’s consider a function that returns the length of a string or an array:

```ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
```

This function is fine; we can invoke it with strings or arrays. However, we can’t invoke it with a value that might be a string _or_ an array, ==because TypeScript can only resolve a function call to a single overload:==

> [!tip] IMPORTANT
> 因为 Typescript 只能匹配一个函数重载
> 例如 len(s: string) 匹配第一个重载，而 len(s: string | any[]) 则不能匹配了，所以会出问题就像下面一样。

```ts
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
No overload matches this call.
  Overload 1 of 2, '(s: string): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
      Type 'number[]' is not assignable to type 'string'.
  Overload 2 of 2, '(arr: any[]): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
      Type 'string' is not assignable to type 'any[]'.2769No overload matches this call.
  Overload 1 of 2, '(s: string): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
      Type 'number[]' is not assignable to type 'string'.
  Overload 2 of 2, '(arr: any[]): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
      Type 'string' is not assignable to type 'any[]'.

```

==Because both overloads have the same argument count and same return type, we can instead write a non-overloaded version of the function==:

```ts
function len(x: any[] | string) {
  return x.length;
}
```

This is much better! Callers can invoke this with either sort of value, and as an added bonus, we don’t have to figure out a correct implementation signature.

> Always prefer parameters with union types instead of overloads when possible

> [!tip] IMPORTANT
> 所以再使用 union types `(type1 | type2)` 能解决的情况下，不要使用重载

### Declaring `this` in a Function

TypeScript will infer what the `this` should be in a function via code flow analysis, for example in the following:

> [!tip] IMPORTANT
> this 永远指向调用方，如果不存在调用者则是全局变量，浏览器下是 window

```ts
const user = {
  id: 123,
  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```

TypeScript understands that the function `user.becomeAdmin` has a corresponding `this` which is the outer object `user`. `this`, _heh_, can be enough for a lot of cases, but there are a lot of cases where you need more control over what object `this` represents. The JavaScript specification states that you cannot have a parameter called `this`, and so TypeScript uses that syntax space to let you declare the type for `this` in the function body.

> [!tip] IMPORTANT
> this 的值能被特别指定

```ts
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}
const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

This pattern is common with callback-style APIs, where another object typically controls when your function is called. Note that you need to use `function` and not arrow functions to get this behavior:

```ts
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}
const db = getDB();
const admins = db.filterUsers(() => this.admin);
The containing arrow function captures the global value of 'this'.
Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.7041
7017The containing arrow function captures the global value of 'this'.
Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.

```

## Other Types to Know About

There are some additional types you’ll want to recognize that appear often when working with function types. Like all types, you can use them everywhere, but these are especially relevant in the context of functions.

### `void`

`void` represents the return value of functions which don’t return a value. It’s the inferred type any time a function doesn’t have any `return` statements, or doesn’t return any explicit value from those return statements:

```ts
// The inferred return type is void
function noop() {
  return;
}
```

==In JavaScript, a function that doesn’t return any value will implicitly return the value `undefined`.== However, `void` and `undefined` are not the same thing in TypeScript. There are further details at the end of this chapter.

> `void` is not the same as `undefined`.

> [!tip] IMPORTANT
> void 与 undefined 并不相同！

### `object`

The special type `object` refers to any value that isn’t a primitive (`string`, `number`, `bigint`, `boolean`, `symbol`, `null`, or `undefined`). This is different from the _empty object type_ `{ }`, and also different from the global type `Object`. It’s very likely you will never use `Object`.

> ==`object` is not `Object`. **Always** use `object`!==

Note that in JavaScript, function values are objects: They have properties, have `Object.prototype` in their prototype chain, are `instanceof Object`, you can call `Object.keys` on them, and so on. For this reason, ==function types are considered to be `object`s in TypeScript.==

### `unknown`

The `unknown` type represents _any_ value. This is similar to the `any` type, but is safer because it’s not legal to do anything with an `unknown` value:

> [!tip] IMPORTANT
> 对 unknown 的变量做人和操作都不合法（所以它安全）

```
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
'a' is of type 'unknown'.18046'a' is of type 'unknown'.
}
```

This is useful when describing function types because you can describe functions that accept any value without having `any` values in your function body.

Conversely, you can describe a function that returns a value of unknown type:

```ts
function safeParse(s: string): unknown {
  return JSON.parse(s);
}
// Need to be careful with 'obj'!
const obj = safeParse(someRandomString);
```

### `never`

==Some functions _never_ return a value:==

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

The `never` type represents values which are ==_never_ observed==. In a return type, ==this means that the function throws an exception or terminates execution of the program.==

`never` also appears when TypeScript determines there’s nothing left in a union.

```ts
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

### `Function`

==The global type `Function` describes properties like `bind`, `call`, `apply`, and others present on all function values in JavaScript==. It also has the special property that values of type `Function` can always be called; these calls return `any`:

```
function doSomething(f: Function) {
  return f(1, 2, 3);
}

```

This is an _untyped function call_ and is generally best avoided because of the unsafe `any` return type.

If you need to accept an arbitrary function but don’t intend to call it, the type `() => void` is generally safer.

## Rest Parameters and Arguments

> Background Reading:  
> [Rest Parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)  
> [Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

### Rest Parameters

In addition to using optional parameters or overloads to make functions that can accept a variety of fixed argument counts, we can also define functions that take an _unbounded_ number of arguments using _rest parameters_.

==A rest parameter appears after all other parameters, and uses the `...` syntax==:

```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

In TypeScript, the type annotation on these parameters is implicitly `any[]` instead of `any`, and any type annotation given must be of the form `Array<T>`or `T[]`, or a tuple type (which we’ll learn about later).

### Rest Arguments

Conversely, we can _provide_ a variable number of arguments from an array using the spread syntax. For example, the `push` method of arrays takes any number of arguments:

```ts
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```

==Note that in general, TypeScript does not assume that arrays are immutable==. This can lead to some surprising behavior:

> [!tip] IMPORTANT
> 因为 arrays 的长度是可变的，例如下面 args 可能被更改为`[8, 5, 7]`，当这个时候再调用`Math.atan2`的时候就会出错，所以 TS 觉得这样做不安全，便会报下面这样的错误

```ts
// Inferred type is number[] -- "an array with zero or more numbers",
// not specifically two numbers
const args = [8, 5];
const angle = Math.atan2(...args);
A spread argument must either have a tuple type or be passed to a rest parameter.2556A spread argument must either have a tuple type or be passed to a rest parameter.

```

The best fix for this situation depends a bit on your code, but in general a `const` context is the most straightforward solution:

> [!tip] IMPORTANT
> 使用 as const 将其转换为字面量类型，[文档](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

```ts
// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```

Using rest arguments may require turning on [`downlevelIteration`](https://www.typescriptlang.org/tsconfig#downlevelIteration) when targeting older runtimes.

## Parameter Destructuring

> Background Reading:  
> [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

You can use parameter destructuring to conveniently unpack objects provided as an argument into one or more local variables in the function body. In JavaScript, it looks like this:

```ts
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
```

The type annotation for the object goes after the destructuring syntax:

```ts
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

This can look a bit verbose, but you can use a named type here as well:

```ts
// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## Assignability of Functions

### Return type `void`

The `void` return type for functions can produce some unusual, but expected behavior.

Contextual typing with a return type of `void` does **not** force functions to **not** return something. Another way to say this is a contextual function type with a `void` return type (`type vf = () => void`), when implemented, can return _any_ other value, ==but it will be ignored.==

> [!tip] IMPORTANT
> 返回值会被忽略

Thus, the following implementations of the type `() => void` are valid:

```js
type voidFunc = () => void;
const f1: voidFunc = () => {
  return true;
};
const f2: voidFunc = () => true;
const f3: voidFunc = function () {
  return true;
};
```

And when the return value of one of these functions is assigned to another variable, it will retain the type of `void`:

```
const v1 = f1();
const v2 = f2();
const v3 = f3();

```

This behavior exists so that the following code is valid even though `Array.prototype.push` returns a number and the `Array.prototype.forEach` method expects a function with a return type of `void`.

```
const src = [1, 2, 3];
const dst = [0];
src.forEach((el) => dst.push(el));

```

There is one other special case to be aware of, when a literal function definition has a `void` return type, that function must **not** return anything.

```
function f2(): void {
  // @ts-expect-error
  return true;
}
const f3 = function (): void {
  // @ts-expect-error
  return true;
};

```

For more on `void` please refer to these other documentation entries:

- [v1 handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html#void)
- [v2 handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html#void)
- [FAQ - “Why are functions returning non-void assignable to function returning void?”](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void)
