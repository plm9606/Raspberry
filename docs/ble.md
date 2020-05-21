# BLE

블루투스 4.0 BLE 장치는 `브로드캐스팅`(Broadcasting)와 `연결`(Connection)이라는 두 가지 방식으로 서로 통신할 수 있다.

브로드캐스팅은 연결을 하지 않는 (`Connectionless`) 방식이며, 주변의 장치들에게 자신의 존재를 광고하는(advertizing) 데이터를 주기적으로 전송하거나 수신받는 방식이다. 이 방식을 사용하는 장치는 주기적으로 데이터 패킷을 전송하는 `Broadcaster`와 전송되는 광고 메시지를 반복해서 수신하는 `Observer` 의 역할로 나뉜다. 브로드캐스팅 방식은 전송하는 데이터가 최대 31바이트이므로(경우에 따라 추가로 31바이트를 더 송수신할 수 있다) **적은 양의 데이터를 여러 장치에게 주기적으로 전송해야 할 때** 적합하다. 대표적인 예가 `iBeacon`가 같은 비콘 장치와 수신기이다.

반면에 `연결` 방식은 **양방향 또는 많은 양의 데이터를 전송할 때** 적합하다. 이 방식은 일반 블루투스 2.0처럼 두 장치 간에 일대일로 연결한 후 데이터를 전송하므로 브로드캐스팅 방식에 비해 훨씬 안전하다. 이 방식을 사용하는 장치는 광고 신호(advertising signal)를 스캔하다가 연결을 초기화하고 일단 연결되면 타이밍(timing)을 설정하고 주기적인 데이터 교환을 관리하는 `센트럴(Central)/마스터(Master)`와 광고 메시지를 주기적으로 보내고 마스터가 요청한 연결을 받아들이는 `페리퍼렐(Peripheral)/슬레이브(Slave)` 장치로 역할이 구분된다.

블루투스 4.0 BLE의 프로토콜 스택 구조는 다음 그림과 같다. 예전 블루투스 1.0~2.0 용 동글에는 `SPP (Service Port Profile)` 을 통해 시리얼 통신이 가능하였다. 하지만, BLE 에서는 SPP 프로파일이 기본적으로 포함되어 있지 않으므로 이 방식을 사용할 수 없고 `GATT 프로파일`을 이용하여야 한다.

![](https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F26779043558650CD16)

# GAP

GAP는 Generic Access Profile의 약자로 블루투스에서 게시(`advertising`)와 연결(`connection`)을 제어한다. GAP은 특정 장치가 다른 장치들에게 어떻게 보여지도록 할 것인가와 어떻게 두 장치를 연결할 것인가를 결정한다. GAP은 장치들이 맡을 수 있는 다양한 역할들에 대해 정의한다. 그 중 가장 핵심이 되는 컨셉은 `Central` 장치와 `Peripheral` 장치이다.

`Peripheral` 장치는 주로 작고, 저전력으로 동작하고, 제한된 리소스를 가진 장치들로 보다 리소스가 풍부한 `Central` 장치에 연결되어 동작하도록 설계된 장치이다. Heart Rate Monitor(심박측정기), BLE 근접센서 태그 등이 해당된다.

# Advertising and Scan Response Data

GAP을 이용해서 게시(Advertising)를 할 때 Advertising Data Payload와 Scan Response Payload 를 포함할 수 있다.

`Advertising Data Payload` 는 Central 장치가 인식할 수 있도록 peripheral 장치(센서장치)에서 계속 송출되는 데이터이다. `Scan Response Payload` 는 central 장치(폰)에서 장치 이름과 같이 추가적인 정보를 요구하기 위해 정의된 것으로 선택적으로 구현된다.

두 가지는 서로 구분되며 31바이트까지 데이터를 포함할 수 있다. 하지만 `Advertising Data Payload` 가 필수인데 반해 `Scan Response Payload`는 선택적이다.

## 역할에 따른 구분

![](https://www.rfwireless-world.com/images/BLE-connection-establishment-procedure.jpg)

### CENTRAL / PERIPHERAL

BLE 로 `연결`되기 위한 서로의 역할을 구분한 것이다.

`central` 은 scan, 게시검색(looking for advertisement)을 담당하고 `peripheral` 은 게시(advertisement)를 만든다.

예를들어 폰과 센서장치가 있다면 폰이 주변의 센서장치를 스캔하는 역할을 할 것이므로 central 이 된다. 중요한 점은 peripheral 은 오로지 하나의 central 장치에만 연결될 수 있다. peripheral 이 central 에 연결되면 게시(advertising)를 중단하기 때문.

### GATT SERVER(SLAVE) / GATT CLIENT(MASTER)

> GATT(Generic Attribute Profile)는 두 BLE 장치간에 `Service`, `Characteristic` 을 이용해서 **데이터를 주고 받는 방법을 정의한 것**이다.

**BLE 장치가 연결된 이후** 어떻게 서로 통신하는지에 대해 정의한다. 일반적으로 `peripheral` 장치(센서장치)가 `GATT server` 역할을 하며 GATT lookup data, service, characteristic 에 대한 정의를 가지고 있다.

`GATT client`(폰, 태블릿 등)에서는 GATT server 로 데이터 요청을 보낸다. 모든 동작(transaction)은 GATT client 에서 시작되어 GATT server로 부터 응답을 받게 된다.

## GATT 구조

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMsAAAD5CAMAAAC+lzGnAAAAgVBMVEXY2Nj///8AAADc3NzZ2dnd3d3h4eHJycmdnZ1RUVH8/Py1tbXm5uaIiIipqamSkpKgoKB1dXVjY2NYWFgsLCxCQkIvLy/w8PDPz8/BwcE8PDyTk5Ozs7Nra2u9vb2GhoYkJCRMTEx7e3s2NjZBQUEdHR1WVlZvb28XFxcPDw8SEhIegN4FAAATk0lEQVR4nO1dCXeiPBuNWUEg7JoIhE1F+/9/4JcAdtqZ2sHv9Azxbe+ZYiHByW32J88CNv8dgLUL8IX44WIn/ptctqRO3adCEvkfcxEufEJ09AMuDoRNFQn2RJDO+QJP7A8uCsJYUoSfCoSoFp7ob1z2ENYYgacDEglsf+MSwSPAaxfs/wFiEIr3XFLoEJOEEcLjdawjXYloutONDwGMwe1u1fK/A6pg9J6LC9lYUFUUimLmhB7BgKq405/CKYqCMU48hcF4Fwp7yCAHOh9yoYdz3MckyLo2w7TbhUHTUQaHOJZ85ycdAVieqriST8GlpOzKwsEXmVKNpFQ1SkBACeEHv6oNl4Og1B4qn3MRmkvsi4Z1HdVPkmDkgn5x8Rh7Ci55HZ0HEmZVHtAq1MMB6WoB3XMlyhuX5pD3z8El7UJCwpanHR100YG+CuhJid+1sbUJvMGnbQwBEgy+uqKiBXpoPnABBcJTG6OIyAMjVo3J97lwPaGQoKJiJ1FWKZWmehzTQzDivV8lnJds53BuUYe5y4XEHjbJIUKhQ1jctrXAItFcsBfT0E3TSiRp6nJ7ljt3uQAyXs2sr38woVQ/wONDTACi5l5fqD1UPuHyfPjhYid+uNiJz7mgZwBewgUhL7IfXBL8Ny4YlellbTnREmQJQ59zwaDT+SrHdhRGljft6u+vYQYIu/12Yz32JIEwQp9wIQ6E7O77lqGAV4XucsEs+yXTsB7bGLbkLhf9OH2C9nWDD+dCf8SFtpCPd3Ro473fxXG39+shABuu9FPmkEK31MJ16w0f4oGvwuANEqg3uve4vMDxDGDblEBuEZRSblXDOPSjRD/OOes3+10hBNvEnVSrn9yUsKJ3uUA43uyhaWlovJHtZhOG+wxtttBnx01XjFli7x+X+yNgmPyVy7aPfcOFYjpyObJNzza82sh80075u4KA/b8v/Xss4bLZ1rDeEhgP3V7CA9RVwdNNUmou+3Y6ieryuJL/vvTvAZZw0WNExujUxg57r99uKPQv27FeJqG6FW1sIZdN5c1c8s32SDfbJKj0je4v8Zgcl/+01B9jCZd9J/mBEqjXPXtdfN33zRGgNJW08ftYyXITJ46zOp1FXJwgpJs914u4va9nFqJ/fK67urnZ8iDkGxY9CZdnwQ8XO/HDxU78cLET35GLb6uWj/i1Pl/GBXSHleVfn8AN9su57GP9xqGKrUS604WLlnLZVhBWimFKLAQFjLdwKv4CLg48cWrTUfE7YIxoPekm/Z3Ltpmlm9YCowFWy7jAzNpKmYEZzJdysUmv4iNg8TAXcwaOxhPxUTUOmZaHCZ2PyNFrFkLnw3JC8JRuXtJJZEpC4xk7+bqj9Me5YJ7mbSligREvEEBRhQCWVRJLU8sD13dgzFInGpVMzYXpdAVEx7DT5iE3KSkvSoS9JG+/SsXhYS7IyRyPS/EiMKn1S/QAFULOIQovSrODCca42EUll2VUtTxi0Iki4b3wAkrWS77jZSkjDsNIJiF1Gkfn/KJ++CgXLF8E0a1DnASiQUKxPCQxQU6KfddBtI1eJGJXk0UPkuFAiWiMmpnXU5rU4sDijo5JkBGcFKD3yNepaT7KBTnu2D/ES6lUnFDSVWoniKNZ7TgiUB0LTWEqHQkrgsVFZ8TewacNZwfpwQDoJkWhxDhxovYrx5NHuZAunrhA3Q/6hIo8ErCkEdzBmiKnFcXOjwPyhgtM00F4sNfpmgvxXKj7x8ylcNfkoos7NjXRCOrrNubBwxEO1Gll4AJSwTyDLKze1svUxjLpHIXmghFwer0QsqFesISSTv0FkyDxu8Sn5YWY/pKVuqNQ6oYCeqZT3LgIMvWXF2XqRa+dMm/mUoAsouv1F4DDJuCOEpdxHPNfOMLiwKMUUNfhJ6oJtKDehbyQmuvYxrq6lt6OkCQQvSwCXqVg5qLHsVOtv2ylcUx327KLOwUKvZzzODb61STyZASQinipJxcRijGLLqwyRGsNyRyMpQMc4XVxrScgpN/DXGGidE5vNS56qjYT+aQUD8YGMqrC31TkTcqYZUw3CvNj9jEBGSMIMr0y/dzuV+JiLR7gcrJIXf9DkHI0FFmwF8thbPeiH4kW1su4SAhjYZUO8lvozipbeNkv42JMx/qaA2olWDScZk2XRTIl1q4tN/ocyXQAvEw+tpfVae0C30MTslnR5TvKYJ8B35PL1lY8ygVE+dp9/C5yBzzAZdtdILxkdsIULd4u5bLX00viSLT2tPghiHQqCI/+Qi4DzDj4sgX6VwMTXPYwWcZFXGFpkwXlH9Abu3EVs4CLp9fJaxf3L0Cd0QxdxCWw+8xCb2CKh7kYO3GMbzvd6YJncQqeP0yW2fTBXF4tzcct9mvKvEn+Mi7ho1yo7OICKM9YJBpVbK6McNwpJDXCccdY9xGdxWFF4RQFl4W+YH2VBDO9ZeBxzaLCcQpHcIEpq+NgNS4k3tVhJ4KEANpwhFXjAgzSNu4TpBOhkcV0OkuthhimQxhm8RCQ6hj3rh+1oMvDTtWDe4pjr5c42HXhsBYXVO6YOX4NK4rpjiNUpI1EII18BTFmxy6hiPfCiFcI7RWlweBTQqvQlw3jZ5Hpt3UKb33KDkxeJF2vjeF0PLYkYSKYyDiiGU90guFyxYg36gSAy2eBcu8hEpiMtCp81QDNJUmZOVGKWoo1lyT8yvHkQS5Y5B4aX7vmeQ45ES8syihI2iqPEK06pNdFzWzNNHLRGQ81HQ7V0aHRGTC36TC+cWmdrxznH+UCpmMsEuqm4/ecBi+JCz2cxk6vuUC3Og2g99AvLkGs2xgZkuhYGC6Yqr5DNy7ul55NP9rGSJeYEdnIvYHuL9gNpGxrlEaUH0jZe4pfxZQFz1wGihDR/YXvfM0FYVr2r1xCVz/4sqp5uL+ISyylB0YuGVdQFzQ6CN2LJNRNjCLccNZ0SnoCk53h4packyqgMgORKyIl01u99FJksWJfZpL98JiMZNW2iYhCPQIPXjkQTc9ldYnEUA5STy5FTWXStoPAaFCmZ5zPCar1iBeXXieGto2NLV1HsKgYMvftVwlEH58rJzvxUQ6uP8a6ouYsXP9MYm9yMyUfV9WjGTkwZ+XEnKTPKeY9PB6T06/z+fE4F3vxwHqstp0LqhdyYfAi7V70I3Yx5gVL9Mda2DKLla4QFS7st8v2yDSDsPaEpft94QUQNmizUA5DjUApT+yEKVs/+k9bKB9T8W5lKdh9ZIOai75Ubunb2v3Rq+/E7ylPth9LuQDF7USpHmtjW8+19ljMuFQQy7nsE/1GWxehhSjioy5csJTLPodNIEb1EAuBgRwgHAX9C7iEMPMotnUJAzCmBTTLsUU6JJBbvk6m9UI5/xZmllP55nrjeluMZv2xWW98lnCPymPTddQfG0cJNKbg+Wr+6V+m8WOUls+aZutwwbg4ZDsuUoGRYxxLhLne6nvtMeWmlo3ACwOdJePxMc/zVh7y3JWyPZ45EAnD3a7pIv0sP0Q1RzjKsyxaS28c160nFZv1LSmgPSwRclqPX/Rn1CSabTdmkSpOlWLXUingNaqERnc0aqWUzJOQK5aENDiYnGvpjaurUUkc1VuN3jhS+TCgV73xA4cSyYsYvUfTsKLol954NeqNx8azNKJQGr1x0euPLxvnH9ZPLtJZ19qJoiShJI7ZiRHnLOTBQwDKc0Dr+TBw0um9OhEHXg9E5ul6kddB2qc33nV1m1BxiNioN270wknRsjDzh/d6410XCA8eZr1xPT07tuiN8/5Vb9y0sRK6bpP6ul54LnCyc/OrdNLJGfZbXeud8DI26o2jMpM3vXGef+UZ+/+hN15SXbib3ng8+LQ8YV18PyslBJSeAzFmwW904InXE3oyfd+827zqjePModNgvgYXgKKsCrvyxkUPYhjkkdEbT4roYL7kCKLdEMYeRlMbS5JEaS4k7nTfr6ugjW9trKBllugvW2tMBkQ5hSOBmU2kh7lxCltKVuq7cvTWDSJBdZaCYZOOgR4jIiY4NgevXEiniIzeuH4Pe7rFMZ1zPR34UT8cg3F+x69642bux7MXdTxnGb2qv7pYn/XGZweBb5N/9Mb/xANcLsxWedIMEi3VG3dhZXUIBUzEAYbLuAAIU2lMJqyEXq2XGdyZPfJf/FyN+nIehE1SsLX//h8Cq9C9wtNYavYZlx5OklqUrC03+hz15Iygg91dH3dEJ04PtzQ87+zEIS1vwr7GGAre8wmpnsi9pYmN8kLv++rEMdyt7rluKcR1dDx6l4vYwePqruuWoYRwAPgTf7DGTAa63F/7IO+vCA8QVuOG477PYSSGtQeppSimvdMnvqAxEkGSWo/EAfNK9VMf3aOyh/V4XXN/H9/pz4UfLnbih4ud+DZcsKWHru+xZH7BlDmB/QgjQf8272Nps5bCWzTxJC26y4XWVwjb0LMe3U6z4fQTLjiAMH4bQNViCBde+SdxE+R1lDs9B/YJbO7vkWlyk108B3awuCu7oBe4evyAR+DA6n7chJvOlWh36d4/u27q06St5MYx8R68AOhq8+NdX22c1m2dj77/XwIt0bm6MB9tESQAb1VPGUQ81Y97jx02flP6PtnEIQL+h//BP8Qi/TFoBEu/YkAUwbYB+qkvj5tqcvn5NP75t8lZGC5Ssa3MN/sj3uRqE8VjrAE8Zuk6qZ6iXjbb6BRvCSxCZy9ha2JAeO0m9UwMiHyOAZEUofjz2/8tFuqObnt5i5uwFc1241/pZQyi0E5C2qeJm2CQvIkBYdpVZYI/6P4SJGPy0/SXvctr1yew6wZfc9k49WbDjTdZzWWfnKPI2XRtF68+Ji/q+4qX/mYvlfL2e2F8XBvvN3psMzdbybncAKXU6kcC31Fv/Bnww8VO/HCxEz9c7MRSLliVvLQQj9vyKJulZLvkAT9Xky1Pt7bZzseITaSNcCmXfQub2nJbnm6xLU/zn7Hluf7Y8vxDfG9bnrH3v4sB8bEtzzxIzL6gyWTRM/2ik4y6+BQDYkW98T9teVoEsGrztJxsedA7Wx73ZsuTz7Y89e+2PM2KtjxBXn5gy5PPtjwnY8tT/7Ll8di19LybLU8vo1wZWx4FI8/Y8oR9abktz8tiW56dLbY8fLLlkcaWJxXsUBpbHjegQfw21sBvtjxwPISzzJYn7rpltjxxV7+x5VE22fIcfrPladvJlidq79ny0MmWZ2ehLY/31panG2150BJbnstsy0OaNzEg7LXl6c2X5MDZDWGn8NzGkqr6ZcsTVGE7WGTLU4TFqy1PNNryqN9teXQWY8tTGlsejTe2PEXoGFse/R4udYuTTmidLc9kq/Njy/NVeCQGxH/HlqeFFbKZDEbiOHq8WOJzeLTlQeua7NwHwd5sy7NEdlFC2FQOW7vQHwKp8HyFl7HUi2RK2HJbnm4yBlkm69ui0M2atb2kf4SmP/ObJtV3lME+A74ll71vKx6Mj7xhdb/2YHUXfScf4OKn5hX3bCNcIxt3/aVcfF0nXcks9QnJyg7q5e8yLlsXHqW1cayMfJG1MF/mq5NBqOyWKCMJF/pQ9YyZr90gwbf0OXzjgsjNF/S03Z0k5FNXwlOY5DHLKBtHk/R7DAphYkBgdHOBRSZfWXNk5S/h8qgvaIzLJOlEaYyxCxMOuDAhkcuu48DomNcmBgTgVRLIrqu7zvG6riuQZ9KRdAAOk0qGJqlmhRFgDMkA1vLRTdLWiYrXGBBINcZfeJqErYtMxFeu/9pV7kSOrIOXIYjCQxg4pHLD9mhiQAxpFMoiSJowVL3E3bGIVotngaLWRD9+jQFBgqpRJgYElSYGRB+cTThebDylEdp7b2JAsGyMASFNAzUxIAg7MG+nv8yCGBBMMhMD4sSHbowBUV4w4plsBLhF1Z5jQOiMJgaEZ2JAgKpV9E0MiGLVGBDHOQbE6eyeISfsxKKGgKR3sxLRNABt8VsMiNO5DeiQuQ03cRPEkCXClhgQbvQuBkQN2wMscdqVeYEoPLiwEofybb3ojIhUcekGYwwIPT3HtsSACM5GAHmLAQHaCIC0w7q/eBmJciYUZIE7Bd15FwOC8sbEgCDobQyI6LBuDIgm8RQHQTWOYwrqnsx3cwyIpNN9IYtEZrIITHSzI0HuOHocC4jMROSKoPTaWnPJxxgQ4JiW6sva2ePziwjSNBZcl4DU0guM38SBFboXBWVtzJi47s91mna6V9RSE62qKkaFZhV6KjQvhwhjLzShk/X8ou8TS2JA4LGuxin8NQYEeh8Dwkzx4+JgdHBpUsAtdDJ+zbkSF3vxwHqss1mcbICWxkoTV+jZXTHLY9htEqiHWIv3lUgdoLtZuN8/QDhE1u73eQxhb4QXf/HZNT3bGycxmdFysQ/HTJctGWVkn9bL6dU1lDCOcSzF4WbdFcLhM59dyWtk2O3eVtyKuL985rNLnmC8eRbsW3j4xGcXiiA8qv327vvWYOvzE9ypz/xcUeeix4gqXNttwl+RnHS/UdP293cuZzhFo0Ogszcw8ltcXGfaQqD6dy4xrGaH6VSUa4ffWAI1BwrW2w1YvueCJicF87z6BMA3F2MBbLbvueiKaTx75eF3oHe9xdWsMt9z2acQViVbe4XyEBCLXPjWq8XNk8K+g+b86JnQ9hBene2fXPS6JbA3dtUduOE7w/u3Hi7sPW+9g9+ccT6Vt46/4IeLnfjhYid+uNiJ/wF8By/uTXXXrwAAAABJRU5ErkJggg==)

### 프로파일(PROFILE)

프로파일은 BLE peripheral(센서장치) 에 실제로 존재하는 것은 아니다. 이것은 Bluetooth SIG(블루투스 표준 개발그룹) 혹은 peripheral(센서장치) 디자이너에 의해서 만들어진, 미리 정의된 서비스의 묶음이다.

> Heart Rate Profile (HRP)을 예로 들어보겠습니다. 이 프로파일은 Heart Rate Service(필수)와 Device Information Service(선택)를 결합한 것입니다. 이 두 서비스를 묶어서 Heart Rate Profile 이라고 정의했으며 논리적인 구분이라고 보시면 됩니다.

### 서비스(SERVICE)

서비스는 데이터를 논리적인 단위로 나누는 역할을 하며 특성(characteristic)이라 불리는 데이터 단위를 하나 이상 포함하고 있다. 각 서비스는 `UUID`라 불리우는 16bit(for officially adopted BLE Services) 혹은 128bit(for custom services) 구분자를 가지고 있다. 표준 그룹에서 제정한 공식 서비스 리스트는 [링크]에서 확인할 수 있다.

> 이 중 Heart Rate Service 를 확인해보면 16-bit UUID - 0x180D 를 사용함을 알 수 있습니다. 그리고 이 서비스는 3개의 특성(Heart Rate Measurement, Body Sensor Location, Heart Rate Control Point) 을 가지고 있고 이 중 Heart Rate Measurement 만 필수임을 알 수 있습니다.

### 특성(CHARACTERISTIC)

GATT 기반 동작구조에서 가장 하위 단위는 특성이다. 특성은 단 하나의 데이터만을 포함한다. 가속도 센서처럼 X, Y, Z 축 값이 한 쌍을 이루는 경우 일련된 값의 나열(배열)도 하나의 데이터로 간주한다.

서비스와 유사하게 특성도 16-bit 또는 128-bit `UUID` 를 가지고 있고 표준 특성 리스트를 제공한다. 혹은 본인의 목적에 맞게 특성을 정의.

> 예를들어 Heart Rate Measurement 특성은 Heart Rate Service 의 필수 특성으로 UUID - 0x2A37 을 사용합니다. 이 특성은 데이터의 첫 8bit 중 첫 1bit 가 Heart Rate Measurement(HRM) 데이터 타입을 표시합니다. 데이터 타입이 0일 경우 이어지는 HRM 데이터는 UINT8 타입이고 1일 경우는 UINT16 입니다. 이와같이 BLE에서 특성은 peripheral(센서장치)와 데이터를 주고 받는데 핵심 역할을 합니다. 특성은 또한 Central(폰) 장치에서 peripheral(센서장치)로 데이터를 전송할 때도 사용됩니다.

간략하게 실제 폰에서의 동작과정을 요약하면 Central(폰) 장치는 아래와 같은 순서를 거쳐 데이터를 받아 처리합니다.

- 먼저 폰은 주변의 BLE 장치를 스캔합니다. (GAP profile 이 정의하는 것이 이 과정. 주기적으로 advertising 이 되는 데이터가 어떻게 이루어져 있는지를 정의)
- 폰은 스캔 결과에서 원하는 peripheral(센서장치)가 보이면 연결 (두 장치가 연결되면 센서장치는 advertising을 종료, Central(폰)은 GATT client 역할을 하고 GATT server에 연결하는 것)
- 이제 이후부터는 안드로이드, iOS 프레임웍에서 GATT client를 운영하고 데이터 수신, 연결 상태의 변화 등 각종 이벤트가 발생 할 때 앱에 알려주게됩니다. (이 과정을 운용하기 위해 필요한 내용들이 GATT/ATT에 정의됨)
- 먼저 연결된 장치의 GATT 정보와 Service 정보를 수신 (Service UUID 정보로 확인)
- Characteristic 정보 수신 (UUID 값으로 실제 처리할 데이터를 추출)
