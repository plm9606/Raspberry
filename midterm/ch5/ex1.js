const gpio = require("node-wiring-pi");
const mcpadc = require("mcp-spi-adc");
// const socket = require("socket.io");
// const fs = require("fs");
// const server = require("http").createServer((req, res) => {
//   fs.readFile("views/test.html", "utf-8", (err, read) => {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end();
//   });
// });
// const io = socket.listen(server);

let ANALOG_LIGHT;
const speedHz = 1000000; //1Mhz
const CS_MCP3208 = 10; // CE0 is set
const LIGHT_CHANNEL = 0;
let lightData;

gpio.wiringPiSetup();
gpio.pinMode(CS_MCP3208, gpio.OUTPUT);

const LIGHT = mcpadc.openMcp3208(LIGHT_CHANNEL, { speedHz }, (err) => {
  console.log(`spi channel 0 초기화 완료`);
  if (err) console.log(`spi channel 0 초기화 실패`);
});

process.on("SIGINT", () => {
  process.exit();
});

(function analogLight() {
  LIGHT.read((err, reading) => {
    console.log(
      `rawVal: ${reading.rawValue}, ${(reading.rawValue / 4095) * 100}%`
    );
    lightData = reading.rawValue;
  });

  //   socket.emit();
  ANALOG_LIGHT = setTimeout(analogLight, 1000);
})();
