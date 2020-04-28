const gpio = require("node-wiring-pi");
const RED = 27,
  GREEN = 26,
  BLUE = 28,
  BUZZER = 25,
  BUTTON = 29;

let flag = 0;

function timoutHandler() {
  if (gpio.digitalRead(RED) >= 1) {
    console.log(`digitalRead(RED) is HIGH(1)`);
    gpio.digitalWrite(GREEN, 1);
    gpio.digitalWrite(RED, 0);
  } else {
    console.log(`digitalRead(RED) is LOW(0)`);
  }
  if (gpio.digitalRead(GREEN) >= 1) {
    console.log(`digitalRead(GREEN) is HIGH(1)`);
  } else {
    console.log(`digitalRead(GREEN) is LOW(0)`);
  }
  setTimeout(timoutHandler, 1000);
}

gpio.setup("wpi");
gpio.pinMode(LEDPIN, gpio.OUTPUT);
() => {
  gpio.digitalWrite(RED, 1);
};
setTimeout(timoutHandler, 1000);
