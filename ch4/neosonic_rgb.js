const gpio = require("node-wiring-pi");
const TRIG = 27,
  ECHO = 26,
  RED = 28,
  GREEN = 24,
  BLUE = 25;

let startTime, travelTime;

async function triggering() {
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
    if (distance < 5) {
      await ledOn();
    }
  }

  setTimeout(triggering, 500);
}

async function ledOn() {
  gpio.digitalWrite(RED, 1);
  gpio.digitalWrite(BLUE, 1);
  gpio.digitalWrite(GREEN, 1);
  await sleep(1000);

  gpio.digitalWrite(BLUE, 0);
  gpio.digitalWrite(GREEN, 0);
  await sleep(1000);

  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 1);
  await sleep(1000);

  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(BLUE, 1);
  await sleep(1000);

  gpio.digitalWrite(BLUE, 0);
  await sleep(1000);
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

process.on("SIGINT", function () {
  console.log("node OFF");
  gpio.digitalWrite(BLUE, 0);
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 0);
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
setImmediate(triggering);
