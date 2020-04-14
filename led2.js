const gpio = require("node-wiring-pi");
const BLUE = 29;
const RED = 28;
const GREEN = 27;
let count = 0;

function timoutHandler() {
  switch (count % 4) {
    case 0:
      gpio.digitalWrite(RED, 1);
      console.log("node RED on");
      break;
    case 1:
      gpio.digitalWrite(RED, 0);
      gpio.digitalWrite(GREEN, 1);
      console.log("node GREEN on");
      break;
    case 2:
      gpio.digitalWrite(GREEN, 0);
      gpio.digitalWrite(BLUE, 1);
      console.log("node BLUE on");
      break;
    case 3:
      gpio.digitalWrite(RED, 0);
      gpio.digitalWrite(GREEN, 0);
      gpio.digitalWrite(BLUE, 0);
      console.log("node All OFF");
      break;
    default:
      break;
  }
  count++;
  setTimeout(timoutHandler, 1000);
}

gpio.setup("wpi");
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
timoutHandler();

process.on("SIGINT", function () {
  console.log("Caught interrupt signal");
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(BLUE, 0);
  console.log("node All OFF");
});
