const fs = require('fs');
var Sound = require('node-aplay');

// Sound not working.  Works from command line, but not in Node. . .
//  aplay "./ssf/Great Big Beautiful Tomorrow 2.wav"
// new Sound('ssf/Beautiful Tomorrow 3 - good.wav').play();
var music = new Sound();
music.play('ssf/Beautiful Tomorrow 3 - good.wav');


const myFile = fs.readFileSync('ssf/Beautiful Tomorrow 3 - good.ssf','utf-8');

const myData = myFile.toString().split("\n");

var currentIndex = 0;
const fileName = myData[currentIndex];
currentIndex++;
const duration = parseInt(myData[currentIndex]);
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

// Remember, the controller power is USB until the power is hard wired to draw
//  off the power supply.
//  serial port for the pi  /dev/ttyAMA0 - Undefined GPIO?
//  serial port for the pi  /dev/ttyACM0 - USB
//  serial port for the pi  /dev/ttyACM1 - USB
var SerialPort = require('serialport');


/*
SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

*/

// Permission errors on ttyAMAO - run as sudo, correct permissions later.
var port = new SerialPort('/dev/ttyAMA0', function(err){
    if (err) {
       return console.log("error: " + err.message);
    }
        console.log ('moving robot');
        port.write(0xAA);
        for (var y=0; y < positionData[1].positions.length; y++) {
            // setup buffer, 4 byte, byte array.
            var buffer = new Uint8Array(4); 
            buffer[0] = 0x84;  // Compact Protocol
            buffer[1] = 0x00;  // Channel Number
            buffer[2] = positionData[1].positions[y] & 0x7f;  // Target
            buffer[3] = (positionData[1].positions[y] >>> 7) & 0x7f;  // Target
            port.write(buffer);
            console.log('buffer: ' + buffer)
            sleep(duration);  // delay;
        }
});


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}