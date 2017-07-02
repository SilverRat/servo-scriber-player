const fs = require('fs');

const myFile = fs.readFileSync('ssf/Beautiful Tomorrow 3 - good.ssf','utf-8');

const myData = myFile.toString().split("\r\n");

//console.log(myFile);

var currentIndex = 0;
const fileName = myData[currentIndex];
currentIndex++;
const duration = myData[currentIndex];
currentIndex++;
const servoNames = myData.slice(currentIndex, currentIndex + 24);
currentIndex += 24;
const servoIDs = myData.slice(currentIndex, currentIndex + 24);
currentIndex += 24;

var positionData = [];
for (var y=0; y < 25; y++) {
    var label = myData[currentIndex];
    currentIndex++;
    var length = parseInt(myData[currentIndex]);
    currentIndex++;
    var positions = myData.slice(currentIndex, currentIndex + length + 1);
    currentIndex += length +1;

    var data = {};
    data.label = label;
    data.entries = length;
    data.positions = positions;
    
    positionData[y] = data;
}

console.log ('FileName: ' + fileName);
console.log ('Duration: ' + duration);
console.log ('servoNames: ');
console.log (servoNames);
console.log ('Servo IDs');
console.log (servoIDs);

for (var y=0; y < 25; y++){
    console.log ('WaveTime: ' + positionData[y].label);
    console.log ('Wave Time Length: ' + positionData[y].entries);
    // console.log ('WaveTimes:')
    // console.log (positionData[y].positions);
}

// File Format
//  Wave File
//  Milliseconds
//  Servo Names (x24)
//  Servo ?? (x24)
//  WaveTimes Label
//  WaveTime Entries (integer)
//  WaveTimes
//  blank
// 0-23 servos
//  ServoXpos
//  Number of Servo position Values
//  Servo Values
//  Blank