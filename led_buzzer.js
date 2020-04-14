const gpio = require("node-wiring-pi");
const BUZZER = 29;
const RED = 28;

function turnOnRed() {
  gpio.digitalWrite(BUZZER, 0);
  gpio.digitalWrite(RED, 1);
  console.log("LED on, Buzzer off");
  setTimeout(turnOnBuzzer, 1000);
}

function turnOnBuzzer() {
  gpio.digitalWrite(BUZZER, 1);
  gpio.digitalWrite(RED, 0);
  console.log("LED off, Buzzer on");
  setTimeout(turnOnRed, 100);
}

process.on("SIGINT", function () {
  gpio.digitalWrite(BUZZER, 0);
  gpio.digitalWrite(RED, 0);
  console.log("node All OFF");
  process.exit();
});

// 초기화
gpio.setup("wpi");
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
turnOnRed();
turnOnBuzzer();
