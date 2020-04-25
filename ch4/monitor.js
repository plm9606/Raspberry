const gpio = require("node-wiring-pi");
const ws281x = require("@bartando/rpi-ws281x-neopixel");

const TRIG = 27,
  ECHO = 26,
  BUTTON = 29,
  BUZZER = 22,
  NUM_LEDS = 12;

const RED = { r: 180, g: 0, b: 0 },
  GREEN = { r: 0, g: 180, b: 0 },
  BLUE = { r: 0, g: 0, b: 180 };

let count = 0;
let startTime, travelTime;
let TRIGGER = false;

let triggerTimer;

ws281x.init({ count: NUM_LEDS, stripType: ws281x.WS2811_STRIP_RGB });
ws281x.setBrightness(10);

async function detectButton() {
  console.log(`Pressed! ${count}`);
  await buzzerOn(100);
}

async function buzzerOn(ms) {
  if (count++ % 2 == 0) {
    TRIGGER = true;
    gpio.digitalWrite(BUZZER, 1);
    gpio.delay(ms);
    activateLed(RED);
    triggering();
  } else {
    activateLed(GREEN);
    buzzerPiPi();
    TRIGGER = false;
    if (triggerTimer) {
      clearTimeout(triggerTimer);
      triggerTimer = null;
    }
  }
}

async function buzzerPiPi() {
  gpio.digitalWrite(BUZZER, 0);
  gpio.delay(20);
  gpio.digitalWrite(BUZZER, 1);
  gpio.delay(30);
  gpio.digitalWrite(BUZZER, 0);
  gpio.delay(20);
  gpio.digitalWrite(BUZZER, 1);
  gpio.delay(30);
  gpio.digitalWrite(BUZZER, 0);
}

function triggering() {
  // if (!TRIGGER) return;
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
    if (distance >= 5 && distance < 15) {
      for (let j = 0; j < NUM_LEDS; j++) {
        if (j < NUM_LEDS / 2) {
          ws281x.setPixelCoror(i, RED);
          ws281x.show();
        } else {
          ws281x.setPixelCoror(i, BLUE);
          ws281x.show();
        }
      }
    } else if (distance >= 15) {
      activateLed(BLUE);
    }
  }

  triggerTimer = setTimeout(triggering, 500);
}

function activateLed(color) {
  for (let i = 0; i < NUM_LEDS; i++) {
    ws281x.setPixelColor(i, color);
    ws281x.show();
  }
}

process.on("SIGINT", function () {
  gpio.digitalWrite(BUZZER, 0);
  ws281x.reset();
  console.log("node All OFF");
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, detectButton);

setTimeout(() => {
  activateLed({ r: 0, g: 180, b: 0 });
}, 0);
