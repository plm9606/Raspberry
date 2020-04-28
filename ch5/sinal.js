const fs = require("fs");
const http = require("http");
const gpio = require("node-wiring-pi");
const socketio = require("socket.io");
const mcpadc = require("mcp-spi-adc");
const ws281x = require("@bartando/rpi-ws281x-neopixel");
const CS_MCP3208 = 10, // CE0 is set
  speedHz = 1000000, // colck speed = 1Mhz
  LIGHT = 0, // adc 0번째 채널 선택 = 아날로그센서
  NUM_LEDS = 12; // 네오픽셀 개수

const RED = 27,
  GREEN = 26,
  BLUE = 28,
  BUZZER = 25,
  BUTTON = 29;

const NEO_COLOR = {
  GREEN: { r: 0, g: 180, b: 0 },
  RED: { r: 180, g: 0, b: 0 },
};

let lightTimeout,
  detectTimeout,
  buzzerTimeout,
  neopixelTimeout,
  timeout = 800; // 타이머제어용

let lightdata = -1; // 조도값 측정데이터 저장용

let pixelRed = 0,
  pixelGreen = 0;

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
    // io.sockets.emit("watch", {
    //   red: gpio.digitalRead(RED),
    //   green: gpio.digitalRead(GREEN),
    // });

    detectCar(lightdata);

    // lightTimeout = setTimeout(analogLight, timeout);
  }
};

const vehicleTrafficLights = {
  turnGreen: function () {
    for (let i = 0; i < NUM_LEDS; i++) {
      ws281x.setPixelColor(i, NEO_COLOR.GREEN);
      ws281x.show();
      gpio.delay(1);
    }
  },
  turnRed: function () {
    for (let i = 0; i < NUM_LEDS; i++) {
      ws281x.setPixelColor(i, NEO_COLOR.RED);
      ws281x.show();
      gpio.delay(1);
    }
  },
};

const pedestrianTrafficLights = {
  turnRed: function () {
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(RED, 1);
  },
  turnGreen: function () {
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 1);
  },
  isRed: function () {
    if (gpio.digitalRead(RED) == 1) return true;
    else return false;
  },
};

const buzzer = {
  off: function () {
    gpio.digitalWrite(BUZZER, 0);
  },
  ringAtIntervals: function (ms) {
    gpio.digitalWrite(BUZZER, 1);
    gpio.delay(ms * 0.5);
    gpio.digitalWrite(BUZZER, 0);
    console.log(`${ms}ms 간격으로 울린다`);
    buzzerTimeout = setTimeout(function () {
      buzzer.ringAtIntervals(ms);
    }, ms);
  },
};

const detectCar = (lightData) => {
  if (lightData > 3000) {
    console.log(`조도센서가 차량 감지함. 5초 기다림..`);

    detectTimeout = setTimeout(() => {
      clearTimeout(buzzerTimeout);
      vehicleTrafficLights.turnGreen();
      pedestrianTrafficLights.turnRed();
      buzzer.off();
      lightTimeout = setTimeout(analogLight, 0);
    }, 5000);
  } else {
    console.log("밝음이 감지됨. 5초 기다림");

    detectTimeout = setTimeout(() => {
      clearTimeout(buzzerTimeout);
      vehicleTrafficLights.turnRed();
      pedestrianTrafficLights.turnGreen();
      buzzer.ringAtIntervals(1000);
      lightTimeout = setTimeout(analogLight, 0);
    }, 5000);
  }
};

const detectButton = () => {
  console.log(`Button Pressed!`);

  if (pedestrianTrafficLights.isRed()) {
    clearTimeout(lightTimeout);
    clearTimeout(detectTimeout);
    clearTimeout(detectTimeout);

    pedestrianTrafficLights.turnGreen();
    vehicleTrafficLights.turnRed();
    buzzer.ringAtIntervals(500);

    setTimeout(() => {
      console.log(`버튼을 누르고 6초가 지났습니다. `);
      clearTimeout(buzzerTimeout);
      buzzer.off();
      pedestrianTrafficLights.turnRed();
      vehicleTrafficLights.turnGreen();
      lightTimeout = setTimeout(analogLight, timeout);
    }, 6000);
  }
};

const serverBody = (req, res) => {
  fs.readFile("views/sinal.html", "utf8", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
};

process.on("SIGINT", () => {
  console.log(`MCP-ADC가 해제되어, 웹서버를 종료합니다`);
  ws281x.reset();
  gpio.digitalWrite(BLUE, 0);
  gpio.digitalWrite(RED, 0);
  gpio.digitalWrite(GREEN, 0);
  gpio.digitalWrite(BUZZER, 0);
  process.exit();
});

const sendPixelStatus = () => {
  io.sockets.emit("watch", {
    pixelRed,
    pixelGreen,
  });

  neopixelTimeout = setTimeout(sendPixelStatus, 1000);
};
const server = http.createServer(serverBody);
const io = socketio.listen(server);

io.sockets.on("connection", (socket) => {
  socket.on("startmsg", (data) => {
    console.log(`가동 메세지 수신`);
    timeout = data;
    analogLight();
    sendPixelStatus();
  });

  socket.on("stopmsg", (data) => {
    console.log(`중지 메세지 수신`);
    clearTimeout(neopixelTimeout);
    clearTimeout(lightTimeout);
    clearTimeout(detectTimeout);
    clearTimeout(detectTimeout);
    clearTimeout(buzzerTimeout);
  });
});

server.listen(65001, () => {
  gpio.wiringPiSetup();
  gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
  gpio.pinMode(BUTTON, gpio.INPUT);
  gpio.pinMode(BUZZER, gpio.OUTPUT);
  gpio.pinMode(RED, gpio.OUTPUT);
  gpio.pinMode(GREEN, gpio.OUTPUT);
  gpio.pinMode(BLUE, gpio.OUTPUT);

  gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, detectButton);

  console.log(`--------------------------------------------`);
  console.log(`아날로그 조도센서 측정 및 실시간 모니터링 웹서버`);
  console.log(`---------------------------------------------`);
});
