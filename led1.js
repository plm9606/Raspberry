const gpio = require("node-wiring-pi");
const LEDPIN = 29;
let flag = 0;

function timoutHandler() {
  if (flag > 0) {
    gpio.digitalWrite(LEDPIN, 1);
    console.log("Node LED ON");
  } else {
    gpio.digitalWrite(LEDPIN, 0);
    console.log("Node LED OFF");
  }
  setTimeout(timoutHandler, 1000);
}

gpio.setup("wpi");
gpio.pinMode(LEDPIN, gpio.OUTPUT);
setTimeout(timoutHandler, 1000);
