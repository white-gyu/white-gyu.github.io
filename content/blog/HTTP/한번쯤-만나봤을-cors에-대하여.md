---
title: 한번쯤 만나봤을 CORS에 대하여
date: 2022-05-27 16:05:68
category: HTTP
thumbnail: { thumbnailSrc }
draft: false
---

개발자라면 한번쯤은 만나봤을 `CORS(= Cross-Origin Resource Sharing)` 정책에 대해 알아보려 한다. 

## CORS 개요

`CORS` 에러는 `CORS` 정책을 위반해 발생한 에러다. 하지만 `CORS` 정책 덕분에 여러 곳에서 가져오는 리소스가 안전하다는 최소한의 보장을 받을 수 있다.   
`CORS`, `교차 출처 리소스 공유`라는 뜻으로 이에 대해 알아보자.

## 출처(= Origin)이란?

> 출처 = protocol + host + port

<div align="center">
    <img style="width: 600px;" src="https://www.notion.so/image/https%3A%2F%2Flh5.googleusercontent.com%2Fau-z1C1EX6pFkKoPT1mICvT3Vp4iIwQ5LwoxdqWhvX8-hmsQLfQqsTyMz4eDoXiVv_vTCkbU-Tsxmy27Kqxpsj0r0JlWdvMMbD6sRuMckSepHdevO9QGb363EYOOthDIZ-5wfoqI?table=block&id=111a6874-aed8-45e6-a3a8-84c3470fbd6d&width=2000&userId=&cache=v2" alt="" />
</div>

`출처`란 서버의 위치를 찾아가기 위해 필요한 가장 기본적인 정보를 합쳐놓은 것이다. 우리는 개발자 도구 콘솔에서 `Location` 객체가 갖고 있는 `Origin` 프로퍼티에 접근하여 
어플리케이션 출처를 알수 있다.

```js
console.log(location.origin) // "https://white-gyu.github.io"
```

## CORS는 어떻게 동작할까?

기본적으로 웹 클라이언트 어플리케이션이 다른 출처의 리소스를 요청할 때는 HTTP 프로토콜을 사용하여 요청을 보낸다.

```http request
Origin: https://white-gyu.github.io
```

이후 기본적인 흐름은 아래와 같다.

1. 브라우저는 요청 헤더에 Origin 필드에 요청을 보내는 출처를 함께 담아 보낸다.
2. 서버가 이 요청에 대한 응답을 할 때 응답 헤더의 `Access-Controller-Allow-Origin` 이라는 값에 "이 리소스에 접근할 수 있는 출처" 를 담아 보낸다.
3. 응답을 받은 브라우저는 자신이 보냈던 요청의 `Origin`과 서버가 보내준 응답의 `Access-Controller-Allow-Origin`을 비교해본 후 이 응답이 유효한 응답인지 아닌지를 확인한다. 

### Preflight Request

> 브라우저가 요청을 한번에 보내지 않고 예비 요청과 본 요청을 나누어 서버 전송  
> `Preflight`란, 본 요청을 보내기 전에 보내는 요청 &rarr; HTTP OPTIONS 메소드 이용하여 해당 요청이 안전한지 확인

<div align="center">
    <img src="https://evan-moon.github.io/static/c86699252752391939dc68f8f9a860bf/6af66/cors-preflight.png" alt="">
</div>

1. 브라우저에게 리소스를 받아오라는 명령을 내리면 **브라우저는 서버에게 예비 요청을 먼저 보낸다.**
2. 서버는 이 예비 요청에 대한 응답으로 **허용 및 금지에 대한 정보를 응답 헤더에 담아서 브라우저에 응답한다.**
3. 브라우저는 자신이 보낸 예비 요청과 서버가 응답에 담아준 허용 정책을 비교한 후 이 요청이 **안전하다고 판단되면 같은 엔드포인트로 다시 본 요청 전송**
4. 서버가 본 요청에 대한 응답을 하면 브라우저는 최종적으로 이 응답 데이터를 클라이언트에 넘겨준다.

```js
const headers = new Headers({
  'Content-Type': 'text/xml',
});
fetch('https://white-gyu.tistory.com/rss', { headers });
```

```http
OPTIONS https://white-gyu.tistory.com/rss

Accept: */*
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9,ko;q=0.8,ja;q=0.7,la;q=0.6
Access-Control-Request-Headers: content-type
Access-Control-Request-Method: GET
Connection: keep-alive
Host: evanmoon.tistory.com
Origin: https://white-gyu.github.io
Referer: https://white-gyu.github.io/HTTP/한번쯤-만나봤을-cors에-대하여/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: cross-site
```

실제로 브라우저가 보낸 요청을 보면, 단순히 Origin에 대한 정보 뿐만 아니라 **자신이 예비 요청 이후에 보낼 본 요청에 대한 다른 정보들도 함께 포함**되어 있는 것을 볼 수 있다.

### Simple Request

`Simple Request`는 예비 요청을 보내지 않고 바로 서버에게 본 요청부터 보낸 후 서버가 이에 대한 응답의 헤더에 `Access-Control-Allow-Origin`과 같은 값을 보내주면 그때 브라우저가 CORS 정책 위반 여부를 검사하는 방식이다. 즉, `Preflight`와 `Simple Request` 시나리오는 전반적인 로직 자체는 같고 예비 요청의 존재 유무만 다르다.

<div align="center">
    <img src="https://evan-moon.github.io/static/d8ed6519e305c807c687032ff61240f8/6af66/simple-request.png" alt="">
</div>

하지만 아무 때나 단순 요청을 사용할 수 있는 것은 아니고, 특정 조건을 만족하는 경우에만 예비 요청을 생략할 수 있다. 게다가 이 조건이 조금 까다롭기 때문에 일반적인 방법으로 웹 어플리케이션 아키텍처를 설계하게 되면 거의 충족시키기 어려운 조건이다.

<hr>

1. 요청 메소드 = `GET`, `HEAD`, `POST`
2. 지원 가능한 헤더 목록 = `Accept`, `Accept-Language`, `Content-Language`, `Content-Type`, `DPR`, `Downlink`, `Save-Data`, `Viewport-Width`, `Width`
3. 만약 `Content-Type`을 사용하는 경우에는 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`만 허용

<hr>

### Credentialed Request

> 인증된 요청을 사용하는 방법. 다른 출처 간 통신에서 좀 더 보안을 강화하고 싶을 때 사용하는 방법

기본적으로 브라우저가 제공하는 비동기 리소스 요청 API인 `XMLHttpRequest 객체`나 `fetch API`는 별도의 옵션 없이 브라우저의 쿠키 정보나 **인증과 관련된 헤더를 함부로 요청에 담지 않는다.** 이때 요청에 인증과 관련된 정보를 담을 수 있게 해주는 옵션이 바로 `credentials Request`이다.

이 옵션에는 총 3가지의 값을 사용할 수 있으며, 각 값들이 가지는 의미는 다음과 같다.

|<div align="center">옵션 값</div>|<div align="center">설명</div>|
|:------:|:-------|
|same-origin (기본값)|	같은 출처 간 요청에만 인증 정보를 담을 수 있다.|
|include|모든 요청에 인증 정보 담을 수 있다.|
|omit|모든 요청에 인증 정보를 담지 않는다.|

만약 `same-origin`이나 `include`와 같은 옵션을 사용하여 리소스 요청에 인증 정보가 포함된다면, 이제 브라우저는 다른 출처의 리소스를 요청할 때 단순히 `Access-Control-Allow-Origin`만 확인하는 것이 아니라 **좀 더 빡빡한 검사 조건을 추가하게 된다.**

브라우저는 인증 모드가 `include`일 경우, 모든 요청을 허용한다는 의미의 *를 `Access-Control-Allow-Origin` 헤더에 사용하면 안된다고 이야기하고 있다.  

이처럼 요청에 인증 정보가 담겨있는 상태에서 다른 출처의 리소스를 요청하게 되면 브라우저는 CORS 정책 위반 여부를 검사하는 룰에 다음 두 가지를 추가하게 된다.

<hr>

1. `Access-Control-Allow-Origin`에는 *를 사용할 수 없으며, 명시적인 URL이어야한다
2. 응답 헤더에는 반드시 `Access-Control-Allow-Credentials`: **true**가 존재해야한다.

<hr>

## CORS를 해결할 수 있는 방법

### 1. Access-Control-Allow-Origin 설정

CORS 정책 위반으로 인한 문제를 해결하는 가장 대표적인 방법은, 그냥 정석대로 서버에서 `Access-Control-Allow-Origin` 헤더에 **알맞은 값을 세팅**해주는 것이다.

이때 **와일드카드인 *을 사용하여 이 헤더를 세팅하게 되면 모든 출처에서 오는 요청을 받아먹겠다는 의미**이므로 당장은 편할 수 있겠지만, 바꿔서 생각하면 정체도 모르는 이상한 출처에서 오는 요청까지 모두 받아먹겠다는 오픈 마인드와 다를 것 없으므로 **보안적으로 심각한 이슈가 발생**할 수도 있다.

그러니 가급적이면 귀찮더라도 `Access-Control-Allow-Origin`: `https://white-gyu.github.io`와 같이 출처를 명시해주도록 하자.

### 2. Webpack Dev Server로 Reverse Proxying

`webpack-dev-server`가 제공하는 프록시 기능을 사용하면 아주 편하게 CORS 정책을 우회할 수 있다.

```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.white-gyu.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    }
  }
}
```

이렇게 설정을 해놓으면 로컬 환경에서 `/api`로 시작하는 URL로 보내는 요청에 대해 브라우저는 `localhost:8000/api`로 요청을 보낸 것으로 알고 있지만, 사실 뒤에서 웹팩이 `https://api.white-gyu.com`으로 **요청을 프록싱해주기 때문에 마치 CORS 정책을 지킨 것처럼 브라우저를 속이면서도 우리는 원하는 서버와 자유롭게 통신**을 할 수 있다. 즉, 프록싱을 통해 CORS 정책을 우회할 수 있는 것이다.

물론 로컬 개발 환경에서야 웹팩이 요청을 프록싱해주니 아무 이상이 없다. 하지만 어플리케이션을 빌드하고 서버에 올리고 나면 더 이상 `webpack-dev-server`가 **구동하는 환경이 아니기 때문에 프록싱이고 나발이고 이상한 곳으로 API 요청**을 보내게 된다. 그래서 로컬 환경에서만 활용 하는 것을 추천한다.

## 참고 자료

[CORS는 왜 이렇게 우리를 힘들게 하는걸까?](https://evan-moon.github.io/2020/05/21/about-cors/)