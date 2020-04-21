const gpio = require("node-wiring-pi");
const BUTTON = 29;
const RED = 28;
const BLUE = 25;
let count = 0;

function detectButton() {
  console.log(`Pressed! ${count}`);
  if (count++ % 2 == 0) {
    gpio.digitalWrite(RED, 1);
    gpio.digitalWrite(BLUE, 0);
  } else {
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(BLUE, 1);
  }
}

process.on("SIGINT", function () {
  gpio.digitalWrite(BLUE, 0);
  gpio.digitalWrite(RED, 0);
  console.log("node All OFF");
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
console.log("버튼(첫번째 빨강, 두번째 파랑)");
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, detectButton);
