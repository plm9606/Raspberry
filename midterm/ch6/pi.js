const gpio = require("gpio");
const LED = 29;

function Pi() {
  gpio.wiringPiSetup();
  gpio.pinMode();

  process.on("SIGINT", () => {
    gpio.digitalWrite(LED, 0);
    process.exit();
  });
}

Pi.prototype.turnOn = function () {
  gpio.digitalWrite(LED, 1);
};

Pi.prototype.turnOff = function () {
  gpio.digitalWrite(LED, 0);
};

module.exports = Pi;
