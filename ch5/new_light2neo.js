const fs = require("fs");
const http = require("http");
const gpio = require("node-wiring-pi");
const socketio = require("socket.io");
const mcpadc = require("mcp-spi-adc");
const ws281x = require("@bartando/rpi-ws281x-neopixel");

const CS_MCP3208 = 10, // CE0 is set
  speedHz = 1000000, // colck speed = 1Mhz
  LIGHT = 0, // adc 0번째 채널 선택 = 아날로그센서
  NUM_LEDS = 12, // 네오픽셀 개수
  LIGHT_MAX = 2200;
let timerId,
  timeout = 800; // 타이머제어용
let lightdata = -1; // 조도값 측정데이터 저장용

ws281x.init({ count: NUM_LEDS, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(5);

const light = mcpadc.openMcp3208(LIGHT, { speedHz }, (err) => {
  console.log(`SPI 채널0 초기화 완료`);
  if (err) console.log(`채널 0 초기화 실패`);
});

const analogLight = () => {
  light.read((err, reading) => {
    console.log(`▲▽ ${reading.rawValue}`);
    lightdata = reading.rawValue;
  });
  if (lightdata != -1) {
    io.sockets.emit("watch", lightdata);

    ledTime(getLedPercent(lightdata));

    timerId = setTimeout(analogLight, timeout);
  }
};

const getLedPercent = (lightdata) => {
  console.log(`${Math.floor((lightdata / 4096) * 100)}%`);
  return Math.floor((lightdata / 4096) * NUM_LEDS);
};

const serverBody = (req, res) => {
  fs.readFile("views/plotly_light.html", "utf8", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
};

const ledOn = (color, max) => {
  for (let i = 0; i < max; i++) {
    ws281x.setPixelColor(i, color);
    ws281x.show();
    gpio.delay(1);
  }
};

const ledTime = (max) => {
  ledOn({ r: 180, g: 0, b: 0 }, max);

  for (let i = 0; i < max; i++) {
    ws281x.setPixelColor(i, { r: 0, g: 0, b: 0 });
    ws281x.show();
    gpio.delay(100);
  }
};

process.on("SIGINT", () => {
  console.log(`MCP-ADC가 해제되어, 웹서버를 종료합니다`);
  ws281x.reset();
  process.exit();
});

const server = http.createServer(serverBody);
const io = socketio.listen(server);
io.sockets.on("connection", (socket) => {
  socket.on("startmsg", (data) => {
    console.log(`가동 메세지 수신(측정주기: ${data})`);
    timeout = data;
    analogLight();
  });

  socket.on("stopmsg", (data) => {
    console.log(`중지 메세지 수신`);
    clearTimeout(timerId);
  });
});

server.listen(65001, () => {
  gpio.wiringPiSetup();
  gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
  console.log(`--------------------------------------------`);
  console.log(`아날로그 조도센서 측정 및 실시간 모니터링 웹서버`);
  console.log(`---------------------------------------------`);
});
