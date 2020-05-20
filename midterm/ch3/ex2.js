const gpio = require("node-wiring-pi");
const RED = 29,
  GREEN = 28,
  BLUE = 27;
let flag = 0;

gpio.wiringPiSetup();
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);

process.on("SIGINT", () => {
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(BLUE, 0);

  process.exit();
});

(function changeColor() {
  if (flag++ == 0) {
    gpio.digitalWrite(RED, 1);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BLUE, 0);
  } else if (flag++ == 1) {
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 1);
    gpio.digitalWrite(BLUE, 0);
  } else {
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BLUE, 1);
    flag = 0;
  }

  setTimeout(changeColor, 1000);
})();
