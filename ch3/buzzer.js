const gpio = require("node-wiring-pi");
const BUZZER = 29;

function turnOn() {
  gpio.digitalWrite(BUZZER, 1);
  console.log("Buzzer on");
  setTimeout(turnOff, 1000);
}

function turnOff() {
  gpio.digitalWrite(BUZZER, 0);
  console.log("Buzzer off");
  setTimeout(turnOn, 1000);
}

process.on("SIGINT", function () {
  gpio.digitalWrite(BUZZER, 0);
  console.log("node All OFF");
  process.exit();
});

// 초기화
gpio.setup("wpi");
gpio.pinMode(BUZZER, gpio.OUTPUT);
turnOn();
