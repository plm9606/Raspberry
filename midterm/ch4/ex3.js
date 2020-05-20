const gpio = require("node-wiring-pi");
const ws281x = require("@bartando/rpi-ws281x-neopixel");
const TRIG = 29,
  ECHO = 28;

let startTime, detectTime;
gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);

ws281x.init({ count: 12, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(50);

process.on("SIGINT", () => {
  gpio.digitalWrite();
  ws281x.reset();
  process.exit();
});

function triggering() {
  gpio.digitalWrite(TRIG, 0);
  gpio.delayMicroseconds(2);
  gpio.digitalWrite(TRIG, 1);
  gpio.delayMicroseconds(20);
  gpio.digitalWrite(TRIG, 0);

  while (gpio.digitalRead(ECHO, 0));
  startTime = gpio.micros();
  while (gpio.digitalRead(ECHO, 1));
  detectTime = gpio.micros() - startTime;

  let distance = detectTime / 58;

  if (distance < 400) {
    console.log(`distance is ${distance}cm`);
    if (distance < 5) {
      turnOnLed(5);
    }
  }
}

function turnOnLed(count) {
  for (let i = 0; i < count; i++) {
    ws281x.setPixelColor(i, { r: 100, g: 0, b: 0 });
    ws281x.show();
  }
  for (let i = count; i < 12; i++) {
    ws281x.setPixelColor(i, { r: 0, g: 0, b: 0 });
    ws281x.show();
  }
}
