const gpio = require("node-wiring-pi");
const ws281x = require("@bartando/rpi-ws281x-neopixel");
const TRIG = 27,
  ECHO = 26,
  NUM_LEDS = 12;

let startTime, travelTime;

ws281x.init({ count: NUM_LEDS, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(10);

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
    if (distance < 5 && distance > 0) {
      ledTime({  b: 0, g:0, r:180}, NUM_LEDS);
    }
  }

  setTimeout(triggering, 200);
}

async function ledOn(color, max) {
  for (let i = 0; i < max; i++) {
    ws281x.setPixelColor(i, color);
    ws281x.show();
    gpio.delay(1);
  }
}

function ledTime(color, max) {
  ledOn(color, max);
	let {r,g,b} = color;
  for (let i = 0; i < max; i++) {
    ws281x.setPixelColor(i, { r: 0, g: 0, b: 0 });
    ws281x.show();
    gpio.delay(200);
  }
}

process.on("SIGINT", function () {
  console.log("node OFF");
  ws281x.reset();
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(triggering);
