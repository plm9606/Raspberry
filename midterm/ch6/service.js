const util = require("util");
const bleno = require("@abandonware/bleno");
const SwitchCharacteristic = require("./characteristic");
const Pi = require("./pi");

function SwitchService() {
  bleno.PrimaryService.call(this, {
    uuid: "ff20",
    characteristics: [new SwitchCharacteristic(new Pi())],
  });
}

util.inherits(SwitchService, bleno.PrimaryService);

module.exports = SwitchService;
