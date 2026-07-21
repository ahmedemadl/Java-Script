// Q1
let x = "123";
x = Number(123);
x += 7;
console.log(x);

//Q2
let x = 0
if(!x){
    console.log("Invalid")
}

//Q3
for(let i = 1; i <= 10 ; i++){
    if(i % 2 == 0){
        continue;
    }
    console.log(i)
}

// Q4
let arr1 = [1,2,3,4,5];

let result = arr1.filter(function(value) {
    if(value % 2 == 0){
        return value;
    }
});
console.log(result)

//Q5
let arr1 = [1, 2, 3]
let arr2 = [4, 5, 6];
let result = [...arr1, ...arr2];
console.log(result);



//Q6
let dayNum= 5;
switch (dayNum) {
    case 1:
        console.log("Saturday")
        break;
    case 2:
        console.log("Sunday")
        break;
    case 3:
        console.log("Monday")
        break;
    case 4:
        console.log("Tuesday")
        break;
    case 5:
        console.log("Wednesday")
        break;
    case 6:
        console.log("Thursday")
        break;
    case 7:
        console.log("Friday")
        break;                                
    default:
        console.log("Invalid Number");
        break;
}

//Q7
let arr = ["a", "ab", "abc"];
let i = 1;
let result = arr.map(function(value){
    return i++;
})
console.log(result)

//Q8
function Check(number){
    if(number % 3 == 0 && number % 5 != 0){
        return "Divisible by 3";
    }else if(number % 3 != 0 && number % 5 == 0){
        return "Divisible by 5";
    }else if(number % 3 == 0 && number % 5 == 0){
        return "Divisible by both";
    }else{
        return "Not Divisible by both";
    }

}
let number = 15;
let result = Check(number);
console.log(result)

//Q9
let square = () =>{
    return x*x;
}
let x = 5;
result = square(x);
console.log(result);

//Q10
let user = {
    name : "John",
    age : "25"
}
console.log(`${user.name} is ${user.age} years old`);

//Q11
function sum(...number){
    let res = 0;
    for(let i = 0 ; i < number.length ;i++){
        res += number[i];
    }
    return res;
}
let result = sum(1,2,3,4,5)
console.log(result);

//Q12
function fun(){
    return new Promise ((resolve, reject) => {
        setTimeout (() => {
            console.log("Success");
            resolve();
        }, 3000);
    });
    
}
fun();

//Q13
let arr = [1,3,7,2,4];
function largest(arr){
    let cur = -1;
    for(let i = 0 ; i < arr.length; i++){
        if(arr[i] > cur) cur = arr[i];
    }
    return cur;
}
let result = largest(arr);
console.log(result);

//Q14
let user = {
    name : "John",
    age : 30
};
function fn(obj){
    return Object.keys(obj);
}
let result = fn((user));
console.log(result);


//Q15
let s = "The quick brown fox";
function splits(s){
    let arr = []
    let cur_word = "";
    for(let i = 0 ; i < s.length ; i++){
        
        if(s[i] == ' '){
           arr.push(cur_word);
           cur_word ="";
        }else{
            cur_word += s[i];
        }
    }
    arr.push(cur_word);
    return arr;
}
let result = splits(s);
console.log(result);

// /*
// Q1:

// "For Each" is usually used to loop on a certain data structure like an array, using an iterator to loop on it, and so it's limited by the size of that data structure 

// where "For" is used for more applications like looping on anything (not limited by the size of an array)
// and also the iterator doesn't have to move only one step but we can control it 
// so "For" is more useful 

// Q2:
// 1- Defination :
// hoisting : the variables declared inside code are stored in memory before the execution of the code
// 2- Example:
console.log(x);
var x = 5;
// note: the output is "undefined" even though it printed x before it was declared

// 1- Defination:
// Temporal Dead Zone: part of the code that doesn't work due to using variable that wasn't declared
// 2- Example:
// Dead Zone
// ------------ 
console.log(x);
// -------------
let x;

// Q3:
// "==" compare the value of the variables even if the data type is different
// "===" compare between the variables 

//Q4:
// try-catch: you put a block of code inside "try" and it tried repeatedly and if error happens "try" is skipped and the code inside catch Executes

//Q5
// 1- Difination
// conversion: when you change the type of a variable manually
// 2- Example:
let x = "123";
x = Number(x);
// 1- Difination
// coercion : when the type of a variable is changed automatically to perform an operation
// 2- Example:
let x = "123";
console.log(x + 4);
