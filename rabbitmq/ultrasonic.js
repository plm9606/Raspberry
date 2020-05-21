const gpio = require("node-wiring-pi");
const rabbitmq = require("./index");

const TRIG = 29,
  ECHO = 28;
let startTime, travelTime;

rabbitmq.connect();

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
    console.log(`Distance ${distance}cm`);
    rabbitmq.sendData({ queueName: "sensor_queue", distance });
  }

  setTimeout(triggering, 500);
}

process.on("SIGINT", function () {
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(triggering);
