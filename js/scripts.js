var canvas = document.getElementById("can");
var ctx = canvas.getContext("2d");

// Assume ctx is canvas 2D Context and ready to render to
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var center = {
    x: width / 2,
    y: height / 2
};

canvas.addEventListener('mousemove', function(){
    var mouse = {};

    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
    if(mouse.x === undefined){ // if firefox
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    // Substract offset (so it's centered at 0,0)
    mouse.x -= center.x;
    mouse.y -= center.y;

    drawFibonacciSpiral({x:0, y:0}, mouse);
});

var drawFibonacciSpiral = function(p1, p2){
    ctx.clearRect(0, 0, width, height);

    // Draw coord axis -> center viewport at 0,0
    drawStroke([{x:0, y:-center.y}, {x:0, y:center.y}], center, "gray");
    drawStroke([{x:-center.x, y:0}, {x:center.x, y:0}], center,"gray");

    // Draw spiral -> center viewport at 0,0
    drawStroke(getSpiral(p1, p2, getDistance({x:0,y:0},center)), center);
};

var getDistance = function(p1, p2){
    return Math.sqrt(Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2));
};

var getAngle = function(p1, p2){
    return Math.atan2(p2.y-p1.y, p2.x-p1.x);
};

var drawStroke = function(points, offset, strokeColor){
    // Default value
    offset = offset || {x:0,y:0}; // Offset to center on screen
    strokeColor = strokeColor || "black";

    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    var p = points[0];
    ctx.moveTo(offset.x + p.x, offset.y + p.y);
    for(var i = 1; i < points.length; i++){
        p = points[i];
        ctx.lineTo(offset.x + p.x, offset.y + p.y);
    }
    ctx.stroke();  // draw it all
};

var FibonacciGenerator = function(){
    var thisFibonacci = this;

    // Start with 0 1 2... instead of the real sequence 0 1 1 2...
    thisFibonacci.array = [0, 1, 2];

    thisFibonacci.getDiscrete = function(n){

        // If the Fibonacci number is not in the array, calculate it
        while (n >= thisFibonacci.array.length){
            var length = thisFibonacci.array.length;
            var nextFibonacci = thisFibonacci.array[length - 1] + thisFibonacci.array[length - 2];
            thisFibonacci.array.push(nextFibonacci);
        }

        return thisFibonacci.array[n];
    };

    thisFibonacci.getNumber = function(n){
        var floor = Math.floor(n);
        var ceil = Math.ceil(n);

        if (Math.floor(n) == n){
            return thisFibonacci.getDiscrete(n);
        }

        var a = Math.pow(n - floor, 1.15);

        var fibFloor = thisFibonacci.getDiscrete(floor);
        var fibCeil = thisFibonacci.getDiscrete(ceil);

        return fibFloor + a * (fibCeil - fibFloor);
    };

    return thisFibonacci;
};

var getSpiral = function(pA, pB, maxRadius){
    // 1 step = 1/4 turn or 90º

    var precision = 50; // Lines to draw in each 1/4 turn
    var stepB = 4; // Steps to get to point B

    var angleToPointB = getAngle(pA,pB); // Angle between pA and pB
    var distToPointB = getDistance(pA,pB); // Distance between pA and pB

    var fibonacci = new FibonacciGenerator();

    // Find scale so that the last point of the curve is at distance to pB
    var radiusB = fibonacci.getNumber(stepB);
    var scale = distToPointB / radiusB;

    // Find angle offset so that last point of the curve is at angle to pB
    var angleOffset = angleToPointB - stepB * Math.PI / 2;

    var path = [];

    var i, step , radius, angle, p;

    // Start at the center
    i = step = radius = angle = 0;

    // Continue drawing until reaching maximum radius
    while (radius * scale <= maxRadius){
        p = {
            x: scale * radius * Math.cos(angle + angleOffset) + pA.x,
            y: scale * radius * Math.sin(angle + angleOffset) + pA.y
        };

        path.push(p);

        i++; // Next point
        step = i / precision; // 1/4 turns at point    
        radius = fibonacci.getNumber(step); // Radius of Fibonacci spiral
        angle = step * Math.PI / 2; // Radians at point
    }

    return path;
};


//function fibonacci(num){
// 
//  
//  seed = last + num;
//  last = num;
//  return seed;
//
//}
//
//var seed = 1;
//var last =  seed;
//
//$( document ).ready(function() {
// 
//  var temp = seed;
//  
//    for(i = 1; i <= 100; i++){
//      
//      console.log("s: " + seed);
//      //console.log("l: " + last);
//      temp = fibonacci(seed);
//      //console.log("t: " + temp);
//      
//      
//    }
//  });