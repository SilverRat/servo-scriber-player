const fs = require('fs');
var Sound = require('node-aplay');

// Sound not working.  Works from command line, but not in Node. . .
//  aplay "./ssf/Great Big Beautiful Tomorrow 2.wav"
new Sound('ssf/Beautiful Tomorrow 3 - good.wav').play();


const myFile = fs.readFileSync('ssf/Beautiful Tomorrow 3 - good.ssf','utf-8');

const myData = myFile.toString().split("\n");

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

// with ability to pause/resume: 
// var music = new Sound('/path/to/the/file/filename.wav');
// music.play();
