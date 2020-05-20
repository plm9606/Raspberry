const gpio = require("node-wiring-pi");
const RED = 29,
  BUZZER = 26;

gpio.wiringPiSetup();
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);

process.on("SIGINT", () => {
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(BUZZER, 0);

  process.exit();
});

(function ledBuzzer() {
  gpio.digitalWrite(RED, 1);
  gpio.delay(1000);
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(BUZZER, 1);
  gpio.delay(100);
  gpio.digitalWrite(BUZZER, 0);
  setTimeout(ledBuzzer, 0);
})();
