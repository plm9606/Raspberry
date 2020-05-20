const gpio = require("node-wiring-pi");
const RED = 29,
  BLUE = 28,
  BUTTON = 27;

let flag = true;

gpio.wiringPiSetup();
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_RISING, button);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);

process.on("SIGINT", () => {
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(BLUE, 0);
  process.exit();
});

async function button() {
  await new Promise((res) => {
    if (flag) {
      gpio.digitalWrite(RED, 1);
      gpio.digitalWrite(BLUE, 0);
      flag = false;
    } else {
      gpio.digitalWrite(RED, 0);
      gpio.digitalWrite(BLUE, 1);
      flag = true;
    }
    res();
  });
}
