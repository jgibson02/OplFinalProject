function foo() {
    a = 1;
    console.log(b);
    var b = 2;
}

foo();
console.log("a: " + a); // 1
console.log("b: " + b); // ReferenceError: b is not defined
