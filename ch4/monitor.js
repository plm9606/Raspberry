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

async function detectButton() {
  console.log(`Pressed! ${count}`);
  //   await new Promise((resolve, rej) => {
  //     if (count++ % 2 == 0) {
  //       gpio.digitalWrite(BUZZER, 1);
  //       resolve();
  //     } else {
  //         gpio.digitalWrite(BUZZER, 1);
  //         gpio.digitalWrite(BUZZER, 0);
  //         gpio.digitalWrite(BUZZER, 1);
  //       resolve();
  //     }
  //   });

  await buzzerOn(100);
}

async function buzzerOn(ms) {
  if (count++ % 2 == 0) {
    gpio.digitalWrite(BUZZER, 1);
    await sleep(ms);
    activateLed();
    triggering();
  } else {
    await buzzerPiPi(ms);
    inactivateLed();
    inactivateTrigger();
  }
}

async function buzzerPiPi(ms) {
  gpio.digitalWrite(BUZZER, 1);
  await sleep(10);
  gpio.digitalWrite(BUZZER, 0);
  await sleep(10);
  gpio.digitalWrite(BUZZER, 1);
  await sleep(ms - 20);
}

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

function inactivateTrigger() {
  console.log("inactivate trigger");
  gpio.digitalWrite(TRIG, 0);
  gpio.digitalWrite(ECHO, 0);
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
