---
title: Garbage Collector에 대하여
date: 2022-03-23 16:05:95
category: Java
thumbnail: { thumbnailSrc }
draft: false
---

## 1. GC는 어떻게 처리를 할까?

> Garbage Collector란, 객체가 생성되고 메모리의 한 부분을 점유하고 특정 메소드가 수행이 완료되어 해당 객체가 더이상 필요없는 상태가 되어 이를 처리하는 작업

Garbage Collector는 아래의 역할을 한다.

```
1. 메모리 할당
2. 사용중인 메모리 인식
3. 사용하지 않는 메모리 인식
```

### JVM 메모리 구조

Garbage Collector는 메모리 구조 중 `Heap`을 다룬다. 이를 크게 `Young`, `Old`, `Perm` 세 영역으로 나눈다.

<div align="center">
    <img src="https://t1.daumcdn.net/cfile/tistory/995811375C76841D02" alt="">
</div>

#### 1) Young Generation : Eden 영역 + Survivor 영역

|<div align="center">Eden 영역</div>|<div align="center">Survivor 영역</div>|
|:-----|:-----|
|- 객체가 최초로 `Heap`에 할당되는 장소|- `Eden 영역`에서 살아 남은 객체들이 잠시 머무르는 장소|
|- 만일 `Eden 영역`이 가득 찼다면, Object의 참조 여부를 파악하고 `Live Object`는 `Suvrvior 영역`으로 넘긴다. |이며 하나의 `Survivor 영역`만 사용|
|- `참조가 사라진 Garbage Object`이면 남겨 놓는다.|- 이러한 과정을 `Minor GC`라고 한다.|
|- 모든 `Live Object`가 `Survivor 영역`으로 넘어간다면 `Eden 영역`을 모두 청소||

#### 2) Old Generation

- `Survivor 영역`에서 살아남아 오랫동안 참조 되었고 앞으로도 사용될 확률이 높은 Object들을 저장하는 영역
- `Old Generation`의 메모리가 충분하지 않으면 해당 영역에서 GC가 발생
- 이를 `Major GC`라고 한다. &rarr; `Tenured 영역`에서 발행한 GC

#### 3) Perm 

- Perm 영역은 보통 Class Meta 정보나 Method의 메타 정보, static 변수와 상수 정보들이 저장되는 공간으로 흔히 메타데이터 저장 영역이라고 한다. 이 영역은 JAVA8 부터 Native Memory 영역으로 이동하였다.( 기존의 Perm영역에 존재하는 static object는 Heap 영역으로 옮겨졌다.)

<br>

## 2. GC 모니터링 방법

<br>

## 3. GC 튜닝을 시도해보자

<br> 

## 4. 참고 자료 

[Garbage Collection 과정](https://d2.naver.com/helloworld/1329)

[[성능튜닝] 가비지 컬렉터(GC) 이해하기](https://12bme.tistory.com/57)

[Garbage Collection 모니터링 방법](https://d2.naver.com/helloworld/6043)

[Garbage Collector Monitoring](https://jjaesang.github.io/gc/2019/04/02/java-gc-monitoring.html)

[Garbage Collection 튜닝](https://d2.naver.com/helloworld/37111)