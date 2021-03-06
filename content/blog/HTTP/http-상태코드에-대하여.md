---
title: HTTP 상태코드에 대하여
date: 2022-03-04 16:05:40
category: HTTP
thumbnail: { thumbnailSrc }
draft: false
---

## HTTP Status Code (상태 코드)

> HTTP 요청이 성공했는지, 실패했는지를 서버에서 알려주는 코드

### 2XX Success

2xx 번대의 상태 코드는 **서버가 클라이언트 요청을 성공적으로 처리**했다는 것을 의미

### 200 OK

> 서버가 클라이언트의 요청을 정상적으로 처리

`200 상태 코드`는 클라이언트에게 요청이 성공했다는 것을 응답하는 기능을 갖기 때문에 성공에 대한 모든 상태 코드를 200으로 응답해도 크게 상관없다. 하지만 클라이언트에게 더 정확하고 자세한 정보를 제공하기 위해선 적절한 상태 코드를 보내는 것이 좋다.  
2xx 상태 코드들은 **각각 세분화된 목적**을 갖는다.

### 201 Created

> 클라이언트의 요청을 서버가 정상적으로 처리했고 새로운 리소스가 생겼다.

`201 상태 코드`는 **POST**, **PUT** 요청에 대한 응답에 주로 사용된다.
클라이언트의 요청이 성공적으로 이뤄졌다는 의미까지는 200과 동일한데, 성공과 동시에 **새로운 리소스가 생성**되었다는 의미를 포함한다.

```json
POST /users HTTP/1.1
Content-Type: application/json
{
    "name": "hak"
}
```

```json
HTTP/1.1 201 Created
{
    "id" : 1,
    "name" : "hak"
}
```

물론 새로운 리소스를 생성하는 POST, PUT 요청의 응답으로 200을 보내줘도 된다.  
하지만 **더 정확한 의미를 전달하기 위해 201 상태 코드를 쓸 것을 추천**한다.

> HTTP 헤더의 Content-Location를 이용하여 만들어진 리소스 생성된 위치를 알려주면 더할 나위 없이 좋다.

```json
HTTP/1.1 201 Created
Content-Location: /users/1
{
    "id" : 1,
    "name" : "hak"
}
```

### 202 Accepted

> 클라이언트의 요청은 정상적이나, 서버가 아직 요청을 완료하지 못했다.  
> 작업 완료를 위한 일련의 작업들이 오래 걸리기 때문에 나중에 알려주겠다는 의미

`202 상태 코드`에서 중요한 것은 **작업의 확인**이다. 비동기 작업은 해당 요청이 언제 완료되는지 알 수 없다.  
클라이언트가 요청의 완료 여부를 확인할 수 있는 방법을 제공해야 한다. 2가지 방법이 있다.

> 1. Callback : 서버가 작업이 완료되면 클라이언트에게 알려주는 것
> 2. Polling : 클라이언트가 주기적으로 해당 작업의 상태를 조회하는 것(HATEOAS, Content-Location 등으로 작업의 상태를 확인할 수 있는 URI를 응답)

결론은 비동기 요청은 콜백이든 폴링이든 **클라이언트가 요청의 완료 여부를 확인할 수 있는 방법을 제공**해야 한다는 것이다.  
둘 다 제공하는 것이 좋다.

### 204 No Content

> 클라이언트의 요청은 정상적이다. 하지만 컨텐츠를 제공하지 않는다.

`204 상태 코드`는 **자원의 삭제 요청**에 응답할 수 있다.

``` HTTP
DELETE /users/1 HTTP/1.1
```

```HTTP
HTTP/1.1 204 No Content
```

자원 삭제 요청을 했고 이 요청이 유효하니 서버는 해당 자원을 삭제했다. **더 이상 응답할 컨텐츠가 없기** 때문에 컨텐츠가 없는 204로 응답한다.  
여기서 주의할 점은 **200으로 응답하고 응답 body에 null, {}, [], false 등으로 응답하는 것과 다르다**는 것이다.  
**204의 경우 HTTP Response body가 아예 존재하지 않는 경우**다.

```
PUT
    - 자원 수정 요청의 결과가 기존의 자원 내용과 동일하여 변경된 내용이 없을 때 204로 응답 가능
    - 만약 수정 요청으로 자원의 내용이 변경된다면 201로 응답

DELETE
    - 삭제 요청으로 자원을 삭제하여 더 이상 존재하지 않고 그 자원을 참조하는 모든 자원도 삭제되어 더 이상 HTTP body를 응답하는 것이 무의미해졌을 때 사용
```

### 4XX Client Errors

`4XX`의 상태 코드들은 **클라이언트의 요청이 유효하지 않아 서버가 해당 요청을 수행하지 않았다**는 의미다.

### 400 Bad Request

> 클라이언트의 요청이 유효하지 않아 더 이상 작업을 진행하지 않는 경우

대부분의 API는 사전에 유효성 검증을 통해 400 상태 코드로 클라이언트에게 유효하지 않은 요청임을 응답한다.  
유효성 검증 없이 진행하면 5xx 서버 오류가 발생할 수 있기 때문에 대부분 사전에 막는 로직을 추가한다.  
오류 발생 시 **파라미터의 위치(path, query, body), 사용자 입력 값, 에러 이유를 꼭 명시**하는 것이 좋다.

**Bad**

```HTTP
HTTP/1.1 400 Bad Request
```

**Good case 1**

```JSON
HTTP/1.1 400 Bad Request
{
    "message" : "'name'(body) must be String, input 'name': 123"
}
```

**Good case 2**

```JSON
HTTP/1.1 400 Bad Request
{
    "errors": [
        {
        "location": "body",
        "param": "name",
        "value": 123,
        "error": "TypeError",
        "msg": "must be String"
        }
    ]
}
```

**Good case 3**

```JSON
HTTP/1.1 400 Bad Request
{
    "errors": {
        "message": "'name'(body) must be String, input 'name': 123",
        "detail": [
            {
            "location": "body",
            "param": "name",
            "value": 123,
            "error": "TypeError",
            "msg": "must be String"
            }
        ]
    }   
}
```

### 401 Unauthorized

> 클라이언트가 권한이 없기 때문에 작업을 진행할 수 없는 경우

401 상태 코드는 `비인증`이다. 상태 코드 이름만 보면 권한(authorized)에 대한 내용처럼 보이지만, 사실 `인증(authenticated)`에 대한 이야기다.  

```
비인증: 非, Not
    - 비인증은 아니다의 뜻이 강하다. 즉, 인증이 안된 상태

미인증: 未, Not enough
    - 미인증은 부족하다의 뜻이 강하다. 즉, 권한이 부족한 상태
```

결론적으로 `401`은 **인증이 안돼 자원을 이용할 수 없는 상태**고, 의미상 `unauthenticated`가 더 정확하다.

### 403 Forbidden

> 클라이언트가 권한이 없기 때문에 작업을 진행할 수 없는 경우

`403`은 `권한(authorized)`에 대한 내용이다.
`401`의 상태 코드명이 Unauthorized라 혼동의 여지가 있으나, `권한`에 대한 내용이다.
**인증된 클라이언트가 권한이 없는 자원에 접근할 때 응답하는 상태 코드**다.

### 404 Not Found

> 클라이언트가 요청한 자원이 존재하지 않는 경우

브라우저(클라이언트) 입장에선 자원이 웹 페이지 경로고 **존재하지 않는 경로(자원)를 요청**했기 때문에 404 상태 코드를 응답했다.  
REST API에선 크게 두 가지 경우에서 404 상태 코드를 응답한다.

1. 경로가 존재하지 않음  
2. 자원이 존재하지 않음

REST 입장에서 생각을 해야 한다.
대부분 API 프레임워크에선 경로(라우팅)에 대한 에러 처리를 해준다. 즉, 존재하지 않은 경로는 쉽게 404로 응답할 수 있다. `GET` `/users/abc/def/wow` 경우 아예 존재하지 않는 경로다

그러나 `자원의 경우`는 개발자가 처리해줘야 한다.
`PUT` `/users/1` 경우 `/users/:id`로 존재하는 경로다. 또한 `:id`엔 숫자 값이 오고 요청도 숫자기 때문에 400 Bad Request도 아니다. 이때 서버는 `ID = 1`을 갖는 사용자가 있는지 먼저 확인을 해야 한다. 이것이 **자원에 대한 존재 여부**를 파악하는 것이다. 만약, 존재 여부를 파악하지 않고 그대로 진행을 하면 후속 작업에서 오류가 발생할 가능성이 있고 이것은 5XX 오류로 이어질 수 있다. 즉, **존재하는 경로에 대한 요청이라도 자원이 존재하는지 파악 후, 존재하지 않는다면 404 상태 코드로 응답**해야 한다.

### 405 Method Not Allowed

> 클라이언트의 요청이 허용되지 않는 메소드인 경우

메소드란 `POST`, `GET`, `PUT`, `DELETE` 등 `HTTP Method`  
즉, 자원(URI)은 존재하지만 **해당 자원이 지원하지 않는 메소드**일 때 응답하는 상태 코드다.

`405 상태 코드`는 **OPTIONS 메소드**와 **HTTP header의 Allow**와 연관되어있다.

`OPTIONS`는 **API가 허용하는 메소드**가 어떤 것들이 있는지 확인하는 메소드다. 405 오류를 사전에 방지하기 위한 용도에 주로 쓰인다.  
이 때 응답 HTTP header의 Allow에 지원하는 메소드를 나열하여 응답한다.

```HTTP
OPTIONS /users/1 HTTP/1.1
HTTP/1.1 200 OK
Allow: GET,PUT,DELETE,OPTIONS,HEAD
```

`/users/1` 자원은 `POST` 메소드를 제공하지 않는다는 정보를 확인할 수 있다.

### 409 Conflict

> 클라이언트의 요청이 서버의 상태와 충돌이 발생한 경우  
> 해당 요청의 처리 중 비지니스 로직상 불가능하거나 모순이 생긴 경우

```HTTP
DELETE /users/1 HTTP/1.1
X-TOKEN: password
```

- 자원(URI) /users/1에 존재하는 메소드 &rarr; 405 X
- /users/:id에서 :id가 유효한 형식 &rarr; 400 X
- 사용자도 존재 &rarr; 404 X
- 헤더의 인증(X-TOKEN)도 정확 &rarr; 401 X
- 삭제 권한도 있는 경우 &rarr; 403 X

클라이언트의 삭제 요청은 받아들여져서 200 혹은 204로 응답해야 하지만, **사용자의 게시물이 존재하는 경우 사용자를 삭제할 수 없다는 비지니스 로직**이 있을 수 있다. 이렇게 API 사용에 있어 **비지니스 로직상 모순이 발생하여 처리가 불가능한 경우 응답하는 상태 코드**다.

```HTTP
HTTP/1.1 409 Conflict
```

400 오류 상황과 마찬가지로 **응답 시 오류의 원인**을 알려야 한다.  
HATEOAS를 이용해 **클라이언트가 다음 상태로 전이될 수 있는 링크를 함께 응답**하면 좋다.

```JSON
HTTP/1.1 409 Conflict
{
    "message" : "First, delete posts"
    "links": [
        {
            "rel": "posts.delete",
            "method": "DELETE",
            "href": "https://api.rest.com/v1/users/1/posts"
        },
    ]
}
```

### 5XX Server Errors

`5XX` 상태 코드들은 **서버 오류**로 인해 요청을 수행할 수 없다는 의미다.

특히 `500` 에러는 개발자의 실수로 발생할 여지가 크다.

```JSON
POST /users HTTP/1.1
{
    "name": 123
}
```

- 요청에 대해 4XX 오류를 발생시킬 가능성이 있는데 사전에 확인 작업을 하지 않은 경우
- 파라미터 필수 값, 유효성 확인 없이 비지니스 로직 진행하는 경우
- 외부 API에서 받은 객체를 확인하지 않고 비지니스 로직 진행하는 경우

params에 name이 존재하는지 판단하지 않고 개발한 경우 **클라이언트의 요청이 무조건 유효할 것이라 판단하고 개발하는 경우 오류를 발생**시킬 수 있다.

```python
params = request.json
create(params['name'])
```

최신의 웹 애플리케이션 프레임워크는 자체 웹서버를 내장하고 있어서 웹서버(Apache, Nginx) 없이 운영할 수 있다. 그러나 보통 운영 레벨에서 이렇게 하는 경우는 드물고 **앞에 웹서버를 두고 웹 애플리케이션을 연결해서 운영**한다.
따라서 상단의 웹서버(Apache, Nginx)에서 발생하는 어쩔 수 없는 오류를 제외하고 **API에선 5XX 상태 코드가 응답되선 안된다**. **API 레벨에선 완벽한 예외처리를 통해 5XX 서버 오류 상태 코드를 방지**해야 한다.

## 참고 자료

[REST API 관점에서 바라보는 HTTP 상태 코드(HTTP status code)](https://sanghaklee.tistory.com/61#recentEntries)
