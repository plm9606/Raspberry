const gpio = require("node-wiring-pi");
const mcpadc = require("mcp-spi-adc");

const CS_MCP3208 = 10, // CE0 is set
  speedHz = 1000000, // colck speed = 1Mhz
  LIGHT = 0; // adc 0번째 채널 선택 = 아날로그센서

let timerId,
  timeout = 800; // 타이머제어용
let lightdata = -1; // 조도값 측정데이터 저장용

const light = mcpadc.openMcp3208(LIGHT, { speedHz }, (err) => {
  console.log(`SPI 채널0 초기화 완료`);
  if (err) console.log(`채널 0 초기화 실패`);
});

gpio.wiringPiSetup();
gpio.pinMode(CS_MCP3208, gpio.OUTPUT);

const analogLight = () => {
  light.read((err, reading) => {
    console.log(`▲▽ ${reading.rawValue}`);
    lightdata = reading.rawValue;
  });
  if (lightdata != -1) {
    io.sockets.emit("watch", lightdata);

    console.log(`${(lightdata / 4095) * 100}%`);

    timerId = setTimeout(analogLight, timeout);
  }
};

process.on("SIGINT", () => {
  console.log(`MCP-ADC가 해제되어, 웹서버를 종료합니다`);
  process.exit();
});
