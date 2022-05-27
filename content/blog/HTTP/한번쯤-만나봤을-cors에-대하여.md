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

```text
1. 브라우저는 요청 헤더에 Origin 필드에 요청을 보내는 출처를 함께 담아 보낸다.
2. 서버가 이 요청에 대한 응답을 할 때 응답 헤더의 `Access-Controller-Allow-Origin` 이라는 값에 "이 리소스에 접근할 수 있는 출처" 를 담아 보낸다.
3. 응답을 받은 브라우저는 자신이 보냈던 요청의 `Origin`과 서버가 보내준 응답의 `Access-Controller-Allow-Origin`을 비교해본 후 이 응답이 유효한 응답인지 아닌지를 확인한다. 
```

### Preflight Request




## 참고 자료

[CORS는 왜 이렇게 우리를 힘들게 하는걸까?](https://evan-moon.github.io/2020/05/21/about-cors/)