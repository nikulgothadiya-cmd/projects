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

