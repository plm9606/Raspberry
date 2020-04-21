const gpio = require("node-wiring-pi");
const TRIG = 27,
  ECHO = 26,
  RED = 28,
  GREEN = 24,
  BLUE = 25,
  BUTTON = 29,
  BUZZER = 22;

let count = 0;
let startTime, travelTime;
let TRIGGER = false;

async function detectButton() {
  console.log(`Pressed! ${count}`);

  await buzzerOn(100);
}

async function buzzerOn(ms) {
  if (count++ % 2 == 0) {
    TRIGGER = true;
    gpio.digitalWrite(BUZZER, 1);
    sleep(ms);
    activateLed();
    triggering();
  } else {
    buzzerPiPi();
    inactivateLed();
    TRIGGER = false;
  }
}

async function buzzerPiPi() {
  gpio.digitalWrite(BUZZER, 0);
  sleep(20);
  gpio.digitalWrite(BUZZER, 1);
  sleep(30);
  gpio.digitalWrite(BUZZER, 0);
  sleep(20);
  gpio.digitalWrite(BUZZER, 1);
  sleep(30);
  gpio.digitalWrite(BUZZER, 0);
}

function triggering() {
  if (!TRIGGER) return;
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

function inactivateTrigger() {
  console.log("inactivate trigger");
}
function activateLed() {
  console.log("activate LED");
  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(RED, 1);
}

function inactivateLed() {
  console.log("inactivate LED");
  gpio.digitalWrite(GREEN, 1);
  gpio.digitalWrite(RED, 0);
}

// function sleep(ms) {
//   return new Promise((res) => setTimeout(res, ms));
// }

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

process.on("SIGINT", function () {
  gpio.digitalWrite(BLUE, 0);
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(BUZZER, 0);
  console.log("node All OFF");
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, detectButton);
