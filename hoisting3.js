function foo() {
    a = 1;
    console.log(b); // ReferenceError
    let b = 2;
}

foo();
console.log("a: " + a);
console.log("b: " + b);
