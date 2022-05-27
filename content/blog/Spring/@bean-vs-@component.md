---
title: "@Bean vs @Component"
date: 2022-02-23 16:05:65
category: Spring
thumbnail: { thumbnailSrc }
draft: false
---

스프링에서 객체를 다루기 위해서는 객체가 Bean으로 등록이 돼야한다. 그 중에서 설정 관련 객체들은 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">@Bean</span>, 
<span style="background: rgb(0 30 181 / 15%); font-weight: bold">@Configuration</span>으로 스프링 컨테이너에 Bean으로 등록한다.
그럼 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">@Bean</span>과 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">@Component</span>의 차이는 뭘까?

## @Bean

<span style="background: rgb(0 30 181 / 15%); font-weight: bold">@Bean</span>은 **메서드 레벨**에서 선언하며, 반환되는 객체를 개발자가 **수동으로 등록**하는 어노테이션이다.

```java
@Configuration
public class AppConfig {
   @Bean
   public RestTemplate restTemplate() {
      return new RestTemplate();
   }
}
```

개발자가 **컨트롤이 불가능한 외부 라이브러리**를 Bean으로 등록하고 싶은 경우에 사용된다.

## @Component

<span style="background: rgb(0 30 181 / 15%); font-weight: bold">@Component</span>는 **클래스 레벨**에서 선엄함으로써 **스프링이 런타임에서 컴포넌트 스캔을 통해 자동으로 빈을 찾아 등록**하는 어노테이션이다. 

```java
@Component
public class Utility {
   // ...
}
```

반대로, 개발자가 **직접 컨드롤이 가능한 클래스**의 경우에 사용된다.

## 결론

|@Bean|@Component|
|:--------|:--------|
|메소드 사용|클래스 사용|
|컨트롤이 불가능한 외부 라이브러리 사용하는 경우|개발자가 컨트롤 가능한 클래스 사용하는 경우|


## 참고 자료

[Bean과 Component 차이](https://youngjinmo.github.io/2021/06/bean-component/)