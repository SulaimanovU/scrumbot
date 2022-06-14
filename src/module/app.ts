
let current = 24;
let allarm = 24;

let currentM = 30;
let allarmM = 0;

let x = 0;
let xm = 0;

if(current < allarm) {
    x = allarm - current;
}
else {
    x = (24 - current) + allarm;
}

if(allarmM > currentM) {
    xm = allarmM - currentM;
}
else {
    xm = 60 - (currentM - allarmM)
    x--;
}


console.log(x);
console.log(xm);