const gpio = require("node-wiring-pi");
const BLUE = 29;
const RED = 28;
const GREEN = 27;

let count = 0;
let redFlag = 0;
let blueFlag = 0;
let greenFlag = 0;

function blinkRed() {
  if (redFlag == 0) {
    gpio.digitalWrite(RED, 1);
    console.log(` / RED ON`);
    redFlag = 1;
  } else {
    gpio.digitalWrite(RED, 0);
    console.log(` / RED OFF`);
    redFlag = 0;
  }

  setTimeout(blinkRed, 1000);
}

function blinkBlue() {
  if (blueFlag == 0) {
    gpio.digitalWrite(BLUE, 1);
    console.log(` / BLUE ON`);
    blueFlag = 1;
  } else {
    gpio.digitalWrite(BLUE, 0);
    console.log(` / BLUE OFF`);
    blueFlag = 0;
  }
  setTimeout(blinkBlue, 2000);
}

function blinkGreen() {
  if (greenFlag == 0) {
    gpio.digitalWrite(GREEN, 1);
    console.log(` / GREEN ON`);
    greenFlag = 1;
  } else {
    gpio.digitalWrite(GREEN, 0);
    console.log(` / GREEN OFF`);
    greenFlag = 0;
  }
  setTimeout(blinkGreen, 3000);
}

function turnOffAllLED() {
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(BLUE, 0);

  console.log(` / turn off ALL`);

  setTimeout(turnOffAllLED, 10000);
}

gpio.setup("wpi");
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);

blinkRed();
blinkGreen();
blinkBlue();
setTimeout(turnOffAllLED, 10000);

process.on("SIGINT", function () {
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(BLUE, 0);
  console.log("node All OFF");
  process.exit();
});
