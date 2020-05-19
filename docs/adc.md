## SPI(Serial Preipheral Interface)

시리얼 통신(직렬 통신) 중 한가지로, 마이크로컨트롤러, 스프트 레지스터, sd카드 등의 소형 주변 장치 사이에 데이터를 전송하기 위한 기능이다.

4개의 버스(SCLK, MOSI, MISO, SS)를 이용하여 데이터를 전송한다.
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FbdjyfO%2FbtqzM07Vlh2%2FXRYaPjyTjjzjlADkSYMXj1%2Fimg.png)

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FbA5pHt%2FbtqzNah7irV%2FPyNFcHiTQg2yJ81o1l0P90%2Fimg.png)

### **특징**

- 1대 다수의 통신을 지원하는 동기식 통신방식
- 동시 송수신 가능
- I2C에 비해 속도가 빠름
- 하나의 마스터 장치만 지원

라즈베리파이는 기본적으로 SPI, I2C 통신이 블랙리스트로 등록되어 활성화되어 있지 않음. **라즈베리파이에서 SPI통신 활성화를 위한 세팅이 필요.**

## **SPI 회로**

### **MCP3208**

MCP3208은 8채널 12비트 ADC로, 센서의 출력값인 아날로그 값을 12비트의 디지털 값으로 변환하는 칩이다.

라즈베리파이의 GPIO는 아두이노와는 다르게 디지털 입력만 가능하도록 되어있다. 라즈베리파이는 ADC(Analog Digital Converter)가 내장되어있지 않다. 그래서 별도의 ADC를 사용해서 ADC 기능을 추가해야 한다.
라즈베리파이와 MCP3208 간 SPI통신을 이용하여 ADC데이터를 받아와야 한다.

SPI 통신 프로그램은 마스터와 슬레이브로 나뉜다.

현재는 라즈베리파이가 마스터이고, MCP3208이 슬레이브다. 마스터인 라즈베리파이가 슬레이브인 MCP3208에 정해진 명령을 보내면 그에 해당되는 값을 전송해주는 시스템이다.

우리는 센서 값을 ADC하여 라즈베리파이가 수신할 필요가 있으므로 다음과 같은 규칙으로 전송해야 합니다. 라즈베리파이는 총 3개의 바이트를 아래와 같이 전송한다.

```
첫째 바이트 0 0 0 0 0 Start SGL D2

둘째 바이트 D1 D0 x x x x x x

셋째 바이트 x x x x x x x x
```

이 데이터중 아래에서부터 12비트(x)가 ADC 결과 값이다.

![](https://t1.daumcdn.net/cfile/tistory/273C084057DF94A60A)

![](https://raw.githubusercontent.com/MomsFriendlyRobotCompany/MCP3208/master/docs/pics/chip.png)

![](https://t1.daumcdn.net/cfile/tistory/2609553C58A0028D31)
|pin|설명|
|---|---|
|16, 15| (+5V)연결할 때 사용|
|14| 아날로그 GND 연결할 때 사용|
|13| SCLK버스(물리번호 23)에 연결|
|11| MOSI(물리핀번호 24)에 연결|
|10| Ch0번(물리핀번호 19)에 연결|
|9|디지털 GND|
사용하고자 하는 센서를 CH0~CH7 어느 곳에 연결하여 사용해도 무방하다.
