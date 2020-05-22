const util = require("util");
const bleno = require("@abandonware/bleno");
let ledState = Math.random();

function SwitchCharacteristic(pi) {
  bleno.Characteristic.call(this, {
    uuid: "ff11",
    properties: ["read", "write"],
    discriptors: [
      new bleno.Descriptor({
        uuid: "ff12",
        value: "switch",
      }),
    ],
  });

  this.pi = pi;
}

util.inherits(SwitchCharacteristic, bleno.Characteristic);

SwitchCharacteristic.prototype.onWriteRequest = function (
  data,
  offset,
  withoutResponse,
  callback
) {
  if (data[0] === 1) {
    //led를 켠다
    this.pi.turnOn();
  } else {
    // led를 끈다
    this.pi.turnOff();
  }

  callback(this.RESULT_SUCCESS); //Central로 성공 응답 전송
};

SwitchCharacteristic.prototype.onReadRequest = function (offset, callback) {
  // 1byte buffer
  const data = Buffer.alloc(1);
  data[0] = ledState;
  callback(this.RESULT_SUCCESS, data);
};

module.exports = SwitchCharacteristic;
