---
title: Query Parameter vs Path Variable
date: 2022-01-14 16:05:13
category: HTTP
thumbnail: { thumbnailSrc }
draft: false
---

## 1. Query Parameter

```text
GET http://www.example.com/user?id=1
```

## 2. Path Variable
```text
GET http://www.example.com/user/1
```

---

이 두 GET 요청은 같은 기능을 수행하지만 조금의 차이가 있다.

```text
// 프로그래머인 사용자 목록을 가져온다.
GET http://localhost:8080/user?occupation=programmer 

// id가 1인 사용자를 가져온다.
GET http://localhost:8080/user/1                        
```


## Path Variable
- 어떤 resource 식별
- REST API에서 값을 호출할 때 주로 사용 

## Query Parameter
- 정렬 & 필터링 기능
- 게시판의 페이지 및 검색 정보 전달