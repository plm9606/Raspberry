const gpio = require("node-wiring-pi");
const bleno = require("@abandonware/bleno");
const util = require("util");
const SwitchCharacteristic = require("./SwitchCharacteristics");
const LED = 28;
let ledState = 0; // led 켜진 상태
let nodeName = "neogachon01";
const POWERED_ON = "poweredOn";

let PrimaryService = bleno.PrimaryService;
let Charactteristic = bleno.Characteristic;

const lightService = new PrimaryService({
  uuid: "ff10",
  characteristics: [new SwitchCharacteristic(ledState, LED)],
});

bleno.on("stateChange", function (state) {
  if (state === POWERED_ON) {
    bleno.startAdvertising(nodeName, [lightService.uuid]);
    console.log("------------------------------------");
    console.log(`블루투스> ON (${nodeName} 가동)`);
  } else {
    bleno.stopAdvertising();
    console.log(`블루투스> Advertising 중단`);
  }
});

bleno.on("accept", function (addr) {
  console.log(`블루투스> 상대편(${addr})이 연결을 수락했습니다. `);
  setInterval(() => {
    bleno.updateRssi((err, rssi) => {
      console.log(
        `수신감도(5초마다): 2m이내(-20 ~ -50), 3~7m(-60 ~ -80), 8m이상(-90 ~ -120) > ${rssi}`
      );
    });
  }, 5000);
});

bleno.on("disconnect", function (addr) {
  console.log(`블루투스> 상대편 (${addr})이 연결을 끊었습니다. `);
});

bleno.on("advertisingStart", function (err) {
  if (!err) {
    console.log(`블루투스> Advertising을 시작합니다`);
    console.log("--------------------------------------");
    bleno.setServices([lightService]);
  } else {
    console.log(`블루투스> Advertising도중 오류 발생`);
  }
});

function exit() {
  console.log(`블루투스> 프로그램을 종료합니다`);
  process.exit();
}

process.on("SIGINT", exit);
gpio.wiringPiSetup();
gpio.pinMode(LED, gpio.OUTPUT);
