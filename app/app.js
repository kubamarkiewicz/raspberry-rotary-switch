/**
 * raspberry-rotary-switch 
 *
 * https://github.com/kubamarkiewicz/raspberry-rotary-switch
 */

const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const fs = require('fs');
const Omx = require('node-omxplayer');


const directory = '/home/pi/Desktop/instalacja/playlist';


var switch1 = new Gpio(17, 'in', 'rising'); //use GPIO pin 17 as input, button presses should be handled
var switch2 = new Gpio(27, 'in', 'rising'); 
var switch3 = new Gpio(22, 'in', 'rising');
var switch4 = new Gpio(10, 'in', 'rising');
var switch5 = new Gpio(9, 'in', 'rising');
var switch6 = new Gpio(11, 'in', 'rising');
var switch7 = new Gpio(13, 'in', 'rising');
var switch8 = new Gpio(19, 'in', 'rising');
var switch9 = new Gpio(26, 'in', 'rising');
var switch10 = new Gpio(16, 'in', 'rising');
var switch11 = new Gpio(20, 'in', 'rising');
var switch12 = new Gpio(21, 'in', 'rising');

var lastSwitch = 0;


switch1.watch(function (err, value) { return switchHandler(err, value, 1); });
switch2.watch(function (err, value) { return switchHandler(err, value, 2); });
switch3.watch(function (err, value) { return switchHandler(err, value, 3); });
switch4.watch(function (err, value) { return switchHandler(err, value, 4); });
switch5.watch(function (err, value) { return switchHandler(err, value, 5); });
switch6.watch(function (err, value) { return switchHandler(err, value, 6); });
switch7.watch(function (err, value) { return switchHandler(err, value, 7); });
switch8.watch(function (err, value) { return switchHandler(err, value, 8); });
switch9.watch(function (err, value) { return switchHandler(err, value, 9); });
switch10.watch(function (err, value) { return switchHandler(err, value, 10); });
switch11.watch(function (err, value) { return switchHandler(err, value, 11); });
switch12.watch(function (err, value) { return switchHandler(err, value, 12); });


function switchHandler(err, value, switchNumber) {
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  changeSwitch(switchNumber);
}


function unexportOnClose() { //function to run when exiting program
  switch1.unexport(); // Unexport Button GPIO to free resources
  switch2.unexport();
  switch3.unexport();
  switch4.unexport();
  switch5.unexport();
  switch6.unexport();
  switch7.unexport();
  switch8.unexport();
  switch9.unexport();
  switch10.unexport();
  switch11.unexport();
  switch12.unexport();
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c 
      


function changeSwitch(switchNumber) {
  console.log(switchNumber); 
  if ((switchNumber == 1) && (lastSwitch == 12)) {
    next();
  }
  else if ((switchNumber == 12) && (lastSwitch == 1)) {
    prev();
  }
  else if (switchNumber > lastSwitch) {
    next();
  }
  else if (switchNumber < lastSwitch) {
    prev();
  }
  
  lastSwitch = switchNumber;
}



// read files from directory
var files = [];
var currentFileIndex = 0;

fs.readdirSync(directory).forEach(file => {
  files.push(file);
});
console.log('Videos in \'playlist\':', files.length);

// play first file
next();


// Create an instance of the player
var player = Omx();


function prev() {
  console.log('prev');
  --currentFileIndex;
  if (currentFileIndex < 0) {
    currentFileIndex = files.length - 1;
  }
  playFile(currentFileIndex);
}

function next() {
  console.log('next');
  ++currentFileIndex;
  if (currentFileIndex >= files.length) {
    currentFileIndex = 0;
  }
  playFile(currentFileIndex);
}


function playFile(fileIndex) {
  console.log('play ', fileIndex);
  if (files[fileIndex]) {
    player.newSource(directory + '/' + files[fileIndex]);
  }
}
