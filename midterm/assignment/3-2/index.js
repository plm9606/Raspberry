const gpio = require("node-wiring-pi");
const ws281x = require("@bartando/rpi-ws281x-neopixel");
const mcp = require("mcp-spi-adc");
const fs = require("fs");
const app = require("http").createServer();

const BUTTON = 29,
  BUZZER = 28;

function detectRoadLight() {
  lightSensor.read((err, reading) => {
    if (reading.rawValue > 0) {
      console.log(`${(reading.rawValue / 4096) * 100}%`);
      lightSensor.emit("road", { data: reading.rawValue });
      // 밝다면
      // 5초 기다린다
      // led red
      // 부저 1초 간격으로 울린다
    }
  });

  setTimeout(detectRoadLight, 1000);
}

async function buttonCb() {
  await new Promise((res) => {
    // led red
    // buzzer 0.5sec
    // 6초 기다린다
    // buzzer off
    // led blue

    res();
  });
}

// settings
gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_RISING, buttonCb);

ws281x.init({ count: 12, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(10);

const lightSensor = mcp.openMcp3208(0, { speedHz: 1000000 }, (err) => {
  if (!err) {
    detectRoadLight();
  }
});

process.on("SIGINT", () => {
  gpio.digitalWrite(BUZZER, 0);
  ws281x.reset();
  lightSensor.close();
  process.exit();
});

app.on("request", (req, res) => {
  fs.readFile("/views/index.html", (err, data) => {
    if (err) throw err;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const io = require("socket.io").listen(app);

io.on("connection", (socket) => {
  socket.on("startService", (data) => {});
  socket.on("endService", (data) => {});
});

app.listen(8080, () => {});
