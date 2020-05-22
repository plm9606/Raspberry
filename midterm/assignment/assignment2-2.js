const gpio = require("node-wiring-pi");
const ws281x = require("@bartando/rpi-ws281x-neopixel");

const BUTTON = 29,
  ECHO = 28,
  TRIG = 27,
  BUZZER = 26;
let FLAG = true;
let triggerTimer;

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_RISING, buttonCallback);

ws281x.init({ count: 12, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(10);

process.on("SIGINT", () => {
  gpio.digitalWrite(BUZZER, 0);
  ws281x.reset();
  process.exit();
});

async function buttonCallback() {
  await new Promise((res) => {
    if (FLAG) {
      // 부저 스피커 0.1초 삐

      //초음파 센서 활성화
      triggering();

      // 빨간색 led
      setLED(0, 12, { r: 100, g: 0, b: 0 });

      FLAG = false;
    } else {
      // 0.1초동앙 삐삐 두번
      // 초음파 비활성화
      clearTimeout(triggerTimer);

      // 초록색 led
      setLED(0, 12, { r: 0, g: 100, b: 0 });

      FLAG = true;
    }
    res();
  });
}

function triggering() {
  gpio.digitalWrite(TRIG, gpio.LOW);
  gpio.delayMicroseconds(2);
  gpio.digitalWrite(TRIG, gpio.HIGH);
  gpio.delayMicroseconds(20);
  gpio.digitalWrite(TRIG, gpio.LOW);

  while (gpio.digitalRead(ECHO, gpio.LOW));
  let startTime = gpio.micros();
  while (gpio.digitalRead(ECHO, gpio.HIGH));
  let travelTime = gpio.micros() - startTime;
  let distance = travelTime / 58;
  if (distance < 5) {
    // red all
    setLED(0, 12, { r: 100, g: 0, b: 0 });
  } else if (distance >= 5 && distance < 15) {
    // 59% red, 50% blue
    setLED(0, 6, { r: 100, g: 0, b: 0 });
    setLED(6, 12, { r: 0, g: 0, b: 100 });
  } else {
    // blue
    setLED(0, 12, { r: 0, g: 0, b: 100 });
  }
  triggerTimer = setTimeout(triggering, 1000);
}

function setLED(start, end, color) {
  for (let i = start; i < end; i++) {
    ws281x.setPixelColor(i, color);
    ws281x.show();
  }
}
