"use strict"

function foo() {
    a = 1; // ReferenceError: a is not defined
    console.log(b); 
    var b = 2;
}

foo();
console.log("a: " + a);
console.log("b: " + b);