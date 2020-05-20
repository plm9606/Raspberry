const gpio = require("node-wiring-pi");
const BUZZER = 29;

gpio.wiringPiSetup();
gpio.pinMode(BUZZER, gpio.OUTPUT);

process.on("SIGINT", () => {
  gpio.digitalWrite(BUZZER, 0);
  process.exit();
});

function turnOn() {
  gpio.digitalWrite(BUZZER, 1);
  gpio.delay(1000);
  turnOff();
}

function turnOff() {
  gpio.digitalWrite(BUZZER, 0);
  gpio.delay(1000);
  turnOn();
}

turnOn();
