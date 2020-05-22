const mcp = require("mcp-spi-adc");
const ws281x = require("@bartando/rpi-ws281x-neopixel");

const light = mcp.openMcp3208(0, { speedHZ: 1000000 }, (err) => {
  if (err) console.log(`채널 0 초기화 실패`);
  else detect();
});

ws281x.init({ count: 12, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(10);

process.on("SIGINT", () => {
  light.close();
  ws281x.reset();
  process.exit();
});

function detect() {
  light.read((err, reading) => {
    if (reading.rawValue >= 0) {
      let ledCount = Math.floor((reading.rawValue / 4096) * 12);
      for (let i = 0; i < ledCount; i++) {
        ws281x.setPixelColor(i, { r: 100, g: 0, b: 0 });
        ws281x.show();
      }
    }
  });

  setTimeout(timer, 1000);
}
