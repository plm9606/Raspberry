const gpio = require("node-wiring-pi");
const TRIG = 27, //29,
  ECHO = 26; //28;
let startTime, travelTime;

function triggering() {
  gpio.digitalWrite(TRIG, gpio.LOW);
  gpio.delayMicroseconds(2);
  gpio.digitalWrite(TRIG, gpio.HIGH);
  gpio.delayMicroseconds(20);
  gpio.digitalWrite(TRIG, gpio.LOW);

  while (gpio.digitalRead(ECHO) == gpio.LOW);

  startTime = gpio.micros();
  while (gpio.digitalRead(ECHO) == gpio.HIGH);
  travelTime = gpio.micros() - startTime;

  let distance = travelTime / 58;
  if (distance < 400) {
    console.log(`Distance: ${distance}cm`);
  }

  setTimeout(triggering, 500);
}

process.on("SIGINT", function () {
  console.log("node OFF");
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(triggering);
