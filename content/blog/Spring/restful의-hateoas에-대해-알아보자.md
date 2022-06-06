---
title: RestFul의 Hateoas에 대해 알아보자
date: 2022-03-04 16:05:86
category: Spring
thumbnail: { thumbnailSrc }
draft: false
---

`Http 통신`, `API`, `RestFul API` 정의에 대해 알아보려 합니다.

## HTTP 프로토콜이란?

> Hypertext Transfer Protocol  
> Hypertext란, 참조(하이퍼링크)를 통해 한 문서에서 다른 문서로 즉시 접근할 수 있는 텍스트

- 인터넷상에서 **데이터를 주고 받기 위한 서버/클라이언트 모델**을 따르는 프로토콜
- 어떤 종류의 데이터든 전송 가능 (HTML문서, 이미지, 동영상, 오디오, 텍스트 문서 등)
- 애플리케이션 레벨의 프로토콜로 TCP/IP 위에서 동작
- **하이퍼텍스트 기반으로(Hypertext) 데이터를 전송**하겠다(Transfer) = **링크 기반**으로 데이터에 접속

### Connectionless & Stateless

- 자원 하나에 대해서 하나의 연결 
- HTTP는 서버에 연결하고, 요청해서 응답을 받으면 연결 해제 

이런 작동방식은 각각 아래의 장점과 단점을 가집니다.

|장점|단점|
|:-------|:-------|
|불특정 다수를 대상으로 하는 서비스에 적합한 방식|연결을 끊어버리기 때문에, 클라이언트의 이전 상태를 알 수 없음|
|대용량 트래픽에도 접속 유지는 최소한으로 하여 처리 가능|클라이언트가 과거에 로그인을 성공하더라도 로그 정보 유지 불가능|

### Keep Alive

HTTP 1.1 부터는 `keep-alive` 기능을 지원합니다. HTTP는 **하나의 연결에 하나의 요청**이 기준입니다.
요즘 웹 서비스 간단한 페이지라고 해도 수십개의 데이터(문서, image, css, js)가 있기 마련입니다. HTTP의 원래 규격대로라면 **웹페이지를 하나 표시하기 위해서는 연결을 맺고 끝는 과정을 수십번을 반복**해야 합니다. 
이는 당연히 비효율적일 수 밖에 없습니다. **연결을 맺고 끝는 것은 TCP 통신 과정에서 가장 많은 비용이 소비되는 작업**이기 때문입니다.  

예를 들어 HTML로 표현된 문서를 다운로드 받는 상황입니다.  
이 문서에는 20개 정도의 image, css, js 파일이 있습니다.

**Keep alive를 지원하지 않을 경우**

```text
1. 웹 서버 연결 -> HTML 문서 다운로드 -> 웹 서버 연결 해제  
2. HTML 문서의 image, css, javascript 링크들을 읽어서 경로 저장
3. 웹 서버에 연결 -> 첫번째 이미지 다운로드 -> 연결 해제  
5. 모든 링크를 다운로드 할 때까지 반복
```

**Keep-alive 지원하는 경우** 

```text
1. 웹 서버에 연결
2. HTML, Image, css, javascript 다운로드
3. 모든 문서를 다운로드 받았다면 연결 해제
```

지정된 시간동안 **연결을 끊지 않고 요청을 계속**해서 보낼 수 있습니다. 하지만 자원은 한정적이기에 **Keep-alive 연결에 제한**을 둡니다. 

**Response Header**
```
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Thu, 11 Aug 2016 15:23:13 GMT
Keep-Alive: timeout=5, max=1000
Last-Modified: Mon, 25 Jul 2016 04:32:39 GMT
Server: Apache

(body)
```

- 연결을 keep-alive 상태로 유지
- 하나의 연결당 5초 동안 유지
- Keep-alive 연결은 최대 1000개까지 허용

keep-alive는 하나의 연결로 여러 요청을 처리하기 때문에 효율적이긴 하지만, **연결이 그만큼 길어지기에 동시간대 연결이 늘어납니다**. 운영체제에 있어서 연결은 `유한한 자원`입니다. **연결을 다 써버리면, 서버는 더 이상 연결이 불가능** 합니다. **Max 값을 이용해서 keep-alive 연결을 제한**하는 이유입니다.

## Rest API

> Representational State Transfer  
> 자원을 이름(자원의 표현)으로 구분하여 해당 자원의 상태(정보) 통신  
> 자원(resource)의 표현(representation) 에 의한 상태 전달

<div align="center"><img width="700px" src="https://gmlwjd9405.github.io/images/network/rest.png" alt=""></div>

- **HTTP URI(Uniform Resource Identifier)** 를 통해 **자원(Resource) 명시**
- 웹 사이트의 이미지, 텍스트, DB 내용 등의 **모든 자원에** 고유한 ID인 **HTTP URI** 부여
- **HTTP Method(POST, GET, PUT, DELETE)** 를 통해 해당 자원에 대한 **CRUD Operation** 적용

## RestFul API

아래의 것들은 "RESTful"하다고 하기에 충분하지 않습니다.

> 예쁜 URL들 /employees/3 는 REST가 아니다.   
> 단순히 GET, POST를 쓰는 것은 REST가 아니다.  
> 모든 CRUD 작업이 나와있는 것은 REST가 아니다.

위 항목들을 포함해서 대충 그럴싸하게 만든 것은 그냥 단지 RPC(**원격 프로시저 호출**)라고 부릅니다. 왜냐하면 **서비스와 어떻게 상호작용** 하는지 모르기 때문입니다.

다음 구절은 Roy Fielding (로이 필딩) **REST와 RPC를 구분하는 말** 입니다.

> 나는 모든 HTTP 기반 인터페이스를 REST API라고 부르는 사람들에게 빡친다. 오늘날 예시는 SocialSite REST API이다. 그것은 그냥 RPC이다. 그것들은 RPC라고 울부짖을 정도다. 하이퍼 텍스트가 제약 조건이라는 개념에서 REST 아키텍처 스타일을 명확히 하려면 어떻게 해야할까? 즉, 애플리케이션 상태 엔진 (및 API)이 하이퍼 텍스트에 의해 구동되지 않는 경우 RESTful이 될 수 없으며 REST API가 될 수 없다. (강조!) 어딘가 수정해야 할 작살난 메뉴얼이 있나?

**하이퍼 미디어를 포함하지 않아 생기는 사이드 이펙트**는 **클라이언트는 반드시 API를 호출할 때 URI들을 하드코딩** 해야 한다는 점입니다. JSON 아웃풋이 조금은 도와줘야할 신호입니다.

### HAL - 하이퍼텍스트 애플리케이션 언어

> HAL이란, **리소스와 API 사이를 하이퍼링크를 쉽게 하고 일관성 있게 하기 위한 간단한 포맷**

#### HAL 문서 구조

- 최소한의 빈 리소스 포함

```json
{}
```

#### 리소스

- 대부분, 리소스는 self URI를 가지고 있습니다.

```json
{ 
    "_links": { 
        "self": { 
            "href": "/example_resource" 
        } 
    } 
}
```

#### 링크

- 링크는 리소스안에 포함되어야 합니다.

```json
{
    "_links": { 
        "next": { 
            "href": "/page=2" 
        } 
    } 
}
```

링크는 관계를 가질 수 있는데 (rel 속성) 이것은 의미(sementic)를 나타냅니다. 링크 rel은 리소스의 링크들을 구별하기 위한 방법입니다.

- 여러 관계를 가지는 경우

```json
{ 
    "_links": {
        "items": [
            { 
                "href": "/first_item" 
            },
            { 
                "href": "/second_item" 
            }
        ] 
    } 
}
```

HAL은 가벼운 mediatype으로 데이터와 하이퍼미디어들을 인코딩할수 있고 API의 다른 부분으로 이동할 수 있도록 클라이언트에게 알려줍니다.

위와 같은 형식으로 employees를 가져온 결과입니다.

```json
{
  "_embedded": {
    "employeeList": [
      {
        "id": 1,
        "name": "Bilbo Baggins",
        "role": "burglar",
        "_links": {
          "self": {
            "href": "http://localhost:8080/employees/1"
          },
          "employees": {
            "href": "http://localhost:8080/employees"
          }
        }
      },
      {
        "id": 2,
        "name": "Frodo Baggins",
        "role": "thief",
        "_links": {
          "self": {
            "href": "http://localhost:8080/employees/2"
          },
          "employees": {
            "href": "http://localhost:8080/employees"
          }
        }
      }
    ]
  },
  "_links": {
    "self": {
      "href": "http://localhost:8080/employees"
    }
  }
}
```

## 정리

REST는 예쁜 URI에 XML이 아닌 JSON을 내려준다고 해서 REST라고는 할 수 없습니다.  
대신 아래와 같은 항목을 지향 하고자 합니다.

> 1. 이전 필드를 삭제하지 말고 지원해라.  
> 2. rel-based한 링크를 사용하여 client가 URI를 하드코드하지 않게 한다.  
> 3. old 링크들을 가능한 한 오래 보유해라.  
     > URI가 바뀌어도 기존 rels를 보유하여 기존 고객들이 새로운 기능으로 연결되게 하라.  
> 4. 클라이언트에게 다양한 상황에서 행동들을 알려주기 위해 데이터를 단순 적재 하지말고 Link를 사용해라.

## 참고 자료

[HTTP 프로토콜이란?](https://shlee0882.tistory.com/107)

[[Spring] RESTful의 HATEOAS 관련 내용 정리 - RESTful 하려면 어떤...](https://pjh3749.tistory.com/260)