import { log } from "node:console";
import { execArgv } from "node:process";

let a =["apple" ,"banana" , "mengo" , "papita" ,1,2,2,"apple",3,3];
const b = ["red"  ,"yello" ,"orenge" ,"blue"];

// let ab = [...a,...b];
let ab = a.concat(b);
ab.unshift("narange");
ab.shift(0);
ab.splice(2,1 , "nikul");
console.log(ab.slice(1,5));
console.log(ab.map(a => a));
console.log(ab.filter(a => a.length < 5));
console.log(ab.reduce((a ,b) => a+b, 0));

const uniqueArray = [...new Set(ab)];
console.log(uniqueArray);

ab.forEach((c,index) => {
    console.log(`${index + 0}. ${c}`);
});

// console.log(x);
// console.log(y);
console.log(z);
const x = 10;
let y = 20;
var z = 30;

// closure
function outer() {
    var count = 0;
    function inner() {
         var count = 5;
        console.log(count);
    }
   inner();
}
outer();

// callback function
function fetchData(callback) {
    setTimeout(() => {
        const data = "Data fetched";
        callback(data);
    }, 2000);
}

// fetchData((result) => {
//     console.log(result);
// });

// promise
function fetchDataPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = "Data fetched with Promise";
            resolve(data);
        }, 2000);
    });
}
// fetchDataPromise()
//     .then(result => {
//         console.log(result);
//     })
//     .catch(error => {
//         console.error(error);
//     });

// async/await
async function fetchDataAsync() {
    try {
        const result = await fetchDataPromise();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
fetchDataAsync();

//arrow function and normal function
const arrowFunction = () => {
    console.log("This is an arrow function");
};
arrowFunction();
function normalFunction() {
    console.log("This is a normal function");
}
normalFunction();

// spred operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinedArr = [...arr1, ...arr2];
console.log(combinedArr);

// destructuring
const person = {
    name: "John",
    age: 30,
    city: "New York"
};
const { name, age, city } = person;
console.log(name, age, city);

// event loop
console.log("Start");
setTimeout(() => {
    console.log("Inside setTimeout");
}, 0);
console.log("End");
// setimdiate
setImmediate(() => {
    console.log("Inside setImmediate");
});


// call , apply , bind
const obj = {
    name: "Alice",  
    greet: function() {
        console.log(`Hello, ${this.name}`);
    }
};
console.log(obj);

obj.greet(); // Hello, Alice
const anotherObj = { name: "Bob" };
obj.greet.call(anotherObj); // Hello, Bob
obj.greet.apply(anotherObj); // Hello, Bob
const boundGreet = obj.greet.bind(anotherObj);
boundGreet(); // Hello, Bob 
// find the avrege  
function example(a,b,c){
    return console.log((a+b+c)/3);   
}
example(2,8,14);

// fectorial number
function factorial(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("n must be a non-negative integer");
  }
  let result = 1;  
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Example:
console.log(factorial(12)); // 120
