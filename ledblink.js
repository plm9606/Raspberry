const gpio = require("node-wiring-pi");
const BLUE = 29;
const RED = 28;
const GREEN = 27;

let count = 0;

function blinkRed() {
  if (count % 2) {
    gpio.digitalWrite(RED, 1);
    console.log(`count: ${count} / RED ON`);
  } else {
    gpio.digitalWrite(RED, 0);
    console.log(`count: ${count} / RED OFF`);
  }

  setTimeout(blinkRed, 1000);
}

function blinkBlue() {
  if (count % 4 === 0) {
    gpio.digitalWrite(BLUE, 1);
    console.log(`count: ${count} / BLUE ON`);
  } else if (count % 2 === 0) {
    gpio.digitalWrite(BLUE, 0);
    console.log(`count: ${count} / BLUE OFF`);
  }
  setTimeout(blinkBlue, 1000);
}

function blinkGreen() {
  if (count % 3 === 0) {
    gpio.digitalWrite(GREEN, 1);
    console.log(`count: ${count} / GREEN ON`);
  } else {
    gpio.digitalWrite(GREEN, 0);
    console.log(`count: ${count} / GREEN OFF`);
  }
  setTimeout(blinkGreen, 1000);
}

function turnOffAllLED() {
  if (count % 10 === 0) {
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BLUE, 0);

    console.log(`count: ${count} / turn off ALL`);
  }
  setTimeout(turnOffAllLED, 1000);
}

gpio.setup("wpi");
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);

setTimeout(() => count++, 1000);
blinkRed();
blinkGreen();
blinkBlue();
turnOffAllLED();

process.on("SIGINT", function () {
  console.log("Caught interrupt signal");
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(BLUE, 0);
  console.log("node All OFF");
  process.exit();
});
