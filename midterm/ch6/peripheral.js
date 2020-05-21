const bleno = require("@abandonware/bleno");
const NODE_NAME = "GC";

const SwitchService = require("./service");
const switchService = new SwitchService();

bleno.on("stateChange", function (state) {
  if (state === "poweredOn") {
    // We will also advertise the service ID in the advertising packet,
    // so it's easier to find.
    bleno.startAdvertising(NODE_NAME, [switchService.uuid], function (error) {
      if (err) console.log(err);
    });
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on("advertisingStart", function (err) {
  if (err) throw err;

  console.log("advertising...");
  bleno.setServices([switchService]);
});

bleno.on("accept", function (clientAddr) {
  console.log(`${clientAddr}::연결을 수락함`);
});

bleno.on("disconnect", function (clientAddr) {
  console.log(`${clientAddr} :: 연결 해제함`);
});
