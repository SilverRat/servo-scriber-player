const fs = require('fs');
var Sound = require('node-aplay');
const lame = require('lame');
const Speaker = require('speaker');

// Sound from command line. . .
//  aplay "./ssf/Great Big Beautiful Tomorrow 2.wav"
var music = new Sound('./ssf/Great Big Beautiful Tomorrow 2.wav').play();

// Punt to FS/LAME/SPEAKER
//var musicFile = fs.createReadStream('./ssf/Great Big Beautiful Tomorrow 2.wav')
//.pipe(new lame.Decoder())
//.on("format",function (format) {this.pipe(new Speaker(format));});

// Show File name, needs to be put in a config file.  Array of shows
const myFile = fs.readFileSync('ssf/Beautiful Tomorrow 3 - good.ssf','utf-8');

// Line separator, needs to be in a config file too \n for linux, \r\n for win.
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
//  serial port for the pi  /dev/ttyAMA0 - GPIO
//  serial port for the pi  /dev/ttyACM0 - USB
//  serial port for the pi  /dev/ttyACM1 - USB
var SerialPort = require('serialport');

// Permission errors on ttyAMAO - 
//  Need to RUN AS SUDO, correct permissions later.
//  sudo chmod 660 /dev/ttyAMA0
//  sudo usermod -G tty pi
//  sudo chmod 777 /dev/ttyAMA0

console.log ('Ready to start moving robot');
sleep(400);

console.log('Program Complete.');
// });
writeLoop(positionData, duration, 0);

function writeLoop(positionData, duration, y) {
    // for (var y=0; y < positionData[2].positions.length - 575; y++) {
    if (y < positionData[2].positions.length) {
        // setup buffer, 4 byte, byte array.
        let buffer = new Uint8Array(4); 
        buffer[0] = 0x84;  // Compact Protocol
        buffer[1] = 0x02;  // Channel Number
        buffer[2] = positionData[2].positions[y] & 0x7f;  // Target
        buffer[3] = (positionData[2].positions[y] >>> 7) & 0x7f;  // Target
        let port = new SerialPort('/dev/ttyAMA0', function(err) {
            if(err) {
                console.log("Error Opening Port.", err);
            } else {
                port.write(buffer, function(err) {
                    if (err) {
                        console.log("Serial Port write error: " + err.message);
                    }
                    console.log('Ear buffer, frame ' + y +' = ' + buffer);
                    port.close();
                    //sleep(duration);  // delay;
                    setTimeout(function(){ 
                        writeLoop(positionData, duration, y+1);},duration);                
                });
            }
        });
        //console.log('Ear buffer, frame ' + y +' = ' + buffer)
        //port.drain();
    }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function listPorts() {
    SerialPort.list(function (err, ports) {
        ports.forEach(function(port) {
            console.log(port.comName);
            console.log(port.pnpId);
            console.log(port.manufacturer);
        });
    });
}
