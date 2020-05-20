const gpio = require("node-wiring-pi");
let flag = true;
const pin = 29;

gpio.wiringPiSetup();
gpio.pinMode(pin, gpio.OUTPUT);

process.on("SIGINT", () => {
  gpio.digitalWrite(pin, 0);
  process.exit();
});

(function led() {
  if (flag) {
    gpio.digitalWrite(pin, 1);
    flag = false;
  } else {
    gpio.digitalWrite(pin, 0);
    flag = true;
  }
  setTimeout(led, 1000);
})();
