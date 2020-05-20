const gpio = require("node-wiring-pi");

const ECHO = 29,
  TRIG = 28;
let startTime, detectTime;

gpio.wiringPiSetup();
gpio.pinMode(ECHO, gpio.INPUT);
gpio.pinMode(TRIG, gpio.OUTPUT);

process.on("SIGINT", () => {
  gpio.digitalWrite();
  process.exit();
});

function triggering() {
  gpio.digitalWrite(TRIG, gpio.LOW);
  gpio.delayMicroseconds(2);
  gpio.digitalWrite(TRIG, gpio.HIGH);
  gpio.delayMicroseconds(20);
  gpio.digitalWrite(TRIG, gpio.LOW);

  while (gpio.digitalRead(ECHO) == gpio.LOW);
  startTime = gpio.micros();
  while (gpio.digitalRead(ECHO) == gpio.HIGH);
  detectTime = gpio.micros() - startTime;

  let distance = detectTime / 58;
  if (distance < 400) {
    console.log(`Distance is ${distance}cm`);
  }
  setTimeout(triggering, 500);
}
