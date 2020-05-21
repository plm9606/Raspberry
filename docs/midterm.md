[gpio](#gpio)

[neoPixel](#neoPixel)

[ADC](#ADC)

## gpio

`const gpio = require("node-wiring-pi")`

### wiringPiSetup();

wiringPi를 초기화

### pinMode(pin, mode);

`mode`

- `gpio.OUTPUT``
- `gpio.INPUT`

### digitalRead(pin)

핀에서 읽은 값은 리턴
`HIGH`(1) or `LOW`(0)

### digitalWrite(pin, state);

`state`

- `HIGH`(1)
- `LOW`(0)

### delay(milliseconds)

### delayMicroseconds(microseconds)

### mills()

Returns the number of milliseconds since the beginning running of the current program

### micros()

Returns the number of microseconds since the beginning running of the current program

### wiringPiISR(pin, edgeType, callbask);

기존의 무한반복(polling) 대신에, 인터럽트 처리방식으로 센서측정하는 기법
지정된 핀에서 지정된 인터럽트가 발생되면 콜백함수가 호출된다.
버튼에서 사용. (ex. `gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, detectButton)`)

**edgeType**
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FbjR7K3%2FbtqyUhhTWhW%2FwB5vlq0EKo4skQwGH80P50%2Fimg.png)

- `INT_EDGE_FALLING`
- `INT_EDGE_RISING`
- `INT_EDGE_BOTH`
- `INT_EDGE_SETUP`

---

## neoPixel

`const ws281x = require("@bartando/rpi-ws281x-neopixel");`

### init(options)

**options**

- count
- stripType

ex. `ws281x.init({ count: NUM_LEDS, stripType: ws281x.WS2811_STRIP_GRB })`

### setPixelColor(position, {r, g, b})

### setBrightness(brightness)

birghtness is `0` to `100`

### getPixelColor: function (position) {}

### show()

LED를 켠다

### reset()

모든 LED를 끈다

---

## ADC

`const mcpadc = require("mcp-spi-adc");`

### open(channel[, options], cb)

### openMcp3208(channel[, options], cb)

비동기로 adc채널을 open한다.

`Returns`

- a new AdcChannel object

`params`

- channel - the number of the channel to open, see channel numbers in supported devices
- options - an optional object specifying channel configuration options
- cb - completion callback

```js
mcpadc.openMcp3208(LIGHT, { speedHz }, (err) => {
  console.log(`SPI 채널0 초기화 완료`);
  if (err) console.log(`채널 0 초기화 실패`);
});
```

### adcChannel.read(cb)

Asynchronous read.

`Params`

- cb - `(err, reading)` 2개의 agument를 갖는다.

  - `reading`은 0과 1사이의 값인 `value`와 채널에서 읽은 값인 `rawValue`로 구성된 객체다.

### adcChannel.close(cb)

Asynchronous close.

- cb - completion callback `(err)=>{}`

## bleno

> advertiser(peripheral)용 모듈

### startAdvertising(name, serviceUuids[, callback(error)])

name

- maximum 26 bytes

service UUID's

- 1 128-bit service UUID
- 1 128-bit service UUID + 2 16-bit service UUID's
- 7 16-bit service UUID

### stopAdvertising([callback]);

## noble

> observer(central)용 모듈
