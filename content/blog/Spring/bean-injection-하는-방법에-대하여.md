---
title: Bean Injection 하는 방법에 대하여
date: 2022-01-15 16:05:02
category: Spring
thumbnail: { thumbnailSrc }
draft: false
---

## 1. DI 방법

### 생성자 기반 주입

컨테이너가 알아서 생성자에게 객체를 넣어주면서 생성하게 됩니다. 생성자의 파라미터를 통해 의존 관계를 파악하기 쉽다는 장점이 존재합니다.

```java
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    } 
}
```

롬복의 도움으로 아래와 같이 코드를 줄일 수 있습니다.

```java
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

}
```

<br>

### Setter 기반 주입

인수가 없는 생성자를 호출한 후 빈에서 setter를 호출해 주입하는 방식입니다. 

```java
public class StudentController {
    private StudentService studentService;

    @Autowired
    public void setStudentService(StudentService studentService) {
        this.studentService = studentService;
    }
}
```

<br>

### 필드 주입

```java
public class StudentController {

    @Autowired
    private StudentService studentService;
}
```

필드 주입은 <span style="color: #bf2a2a;font-weight: bold">외부에서 변경이 불가능하다는 단점</span>이 존재하는데, 점차 테스트 코드의 중요성이 부각됨에 따라 <span style="color: #bf2a2a;font-weight: bold">필드의 객체를 수정할 수 없는 필드 주입</span>은 거의 사용되지 않게 되었습니다. 
또한 **필드 주입은 반드시 DI 프레임워크가 존재**해야 하므로 반드시 사용을 지양해야 합니다. 그렇기에 애플리케이션의 실제 코드와 무관한 테스트 코드나 설정을 위해 불가피한 경우에만 이용하도록 해야겠네요.

<br>

## 2. 생성자 기반 주입 방법을 지양하자 

최근에는 인텔리제이에서도 그렇고 @Autowired 어노테이션을 이용한 필드 주입보다 생성자 기반 주입을 권합니다. 왜 인텔리제이에서도 그렇게 권장할까요?

### 객체의 불변성 확보

실제로 개발을 하다 보면 느끼겠지만, <span style="color: #bf2a2a; font-weight: bold">의존 관계 주입의 변경이 필요한 상황은 거의 없습니다</span>. 하지만 수정자 주입이나 일반 메소드 주입을 이용하면 불필요하게 수정의 가능성을 열어두게 되며, 이는 OOP의 5가지 개발 원칙 중 OCP(Open-Closed Principal, 개방-폐쇄의 법칙)를 위반하게 됩니다. 그러므로 <span style="color: rgb(0 30 181 / 85%); font-weight: bold">생성자 주입을 통해 변경의 가능성을 배제하고 불변성을 보장</span>하는 것이 좋습니다.

### 테스트 코드 작성

실제 코드가 <span style="color: #bf2a2a; font-weight: bold">필드 주입으로 작성된 경우에는 순수한 자바 코드로 단위 테스트를 작성하는 것이 불가능</span>합니다. 물론, ReflectionTestUtilsf를 사용해 주입해줄 수 있기는 합니다.

```java
@Service 
public class UserServiceImpl implements UserService { 
    
    @Autowired 
    private UserRepository userRepository; 
    
    @Autowired 
    private MemberService memberService; 
    
    @Override 
    public void register(String name) { 
        userRepository.add(name); 
    } 
}
```

```java
public class UserServiceTest { 
    
    @Test 
    public void addTest() { 
        UserService userService = new UserServiceImpl(); 
        
        userService.register("whiteGyu"); 
    } 
}
```

위와 같이 작성한 <span style="color: #bf2a2a; font-weight: bold">테스트 코드는 Spring과 같은 DI 프레임워크 위에서 동작하지 않으므로 의존 관계 주입이 되지 않습니다</span>. 
userRepository가 null이 되어 userRepository의 add 호출 시 NPE가 발생합니다. 이를 해결하기 위해 <span style="color: #bf2a2a; font-weight: bold">Setter를 사용하면 여러 곳에서 사용가능한 싱글톤 패턴 기반의 빈이 변경될 수 있는 치명적인 단점</span>을 갖게 됩니다. 또한 반대로 테스트 코드에서도 @Autowired를 사용하기 위해 스프링 빈을 올리면 단위 테스트가 아니며 컴포넌트들을 등록하고 초기화하는 시간이 커져 테스트 비용이 증가하게 됩니다.

반면에 <span style="color: rgb(0 30 181 / 85%); font-weight: bold">생성자 주입을 사용하면 컴파일 시점에 객체를 주입받아 테스트 코드를 작성할 수 있으며, 주입하는 객체가 누락된 경우 컴파일 시점에 오류를 발견</span>할 수 있습니다. 
심지어 우리가 테스트를 위해 만든 Test객체를 생성자로 넣어 편리함을 얻을 수도 있습니다.

### final 선언 가능

생성자 주입을 사용하면 필드 객체에 final 키워드를 사용할 수 있으며, 컴파일 시점에 누락된 의존성을 확인할 수 있습니다. 반면에 생성자 주입을 제외한 다른 주입 방법들은 객체의 생성(생성자 호출) 이후에 호출되므로 final 키워드를 사용할 수 없습니다.

### 순환 참조 에러 방지

애플리케이션 구동 시점(객체의 생성 시점)에 순환 참조 에러를 방지할 수 있습니다.

```java
@Service 
public class UserServiceImpl implements UserService { 
    
    @Autowired 
    private MemberServiceImpl memberService; 
    
    @Override 
    public void register(String name) { 
        memberService.add(name); 
    } 
}
```

```java
@Service 
public class MemberServiceImpl extends MemberService { 

    @Autowired 
    private UserServiceImpl userService; 

    public void add(String name){ 
        userService.register(name); 
    } 
}
```

위의 두 메소드는 서로를 계속 호출할 것이고, 메모리에 함수의 CallStack이 계속 쌓여 StackOverflow 에러가 발생하게 됩니다.

```shell
Caused by: java.lang.StackOverflowError: null 
        at com.mang.example.user.MemberServiceImpl.add(MemberServiceImpl.java:20) ~[main/:na] 
        at com.mang.example.user.UserServiceImpl.register(UserServiceImpl.java:14) ~[main/:na] 
        at com.mang.example.user.MemberServiceImpl.add(MemberServiceImpl.java:20) ~[main/:na] 
        at com.mang.example.user.UserServiceImpl.register(UserServiceImpl.java:14) ~[main/:na]
```

만약 이러한 문제를 발견하지 못하고 서버가 운영된다면 어떻게 될까요? 해당 메소드의 호출 시에 StackOverflow 에러에 의해 서버가 죽게 될 것입니다. 하지만 생성자 주입을 이용하면 이러한 순환 참조 문제를 방지할 수 있습니다.
**애플리케이션 구동 시점(객체의 생성 시점)에 에러가 발생**하기 때문입니다. 그러한 이유는 **Bean에 등록하기 위해 객체를 생성하는 과정에서 다음과 같이 순환 참조가 발생**하기 때문입니다.

요약하자면 아래와 같습니다.

> - 객체의 불변성을 확보 가능
> - 테스트 코드의 작성 용이
> - final 키워드 및 Lombok과의 결합을 통해 코드를 간결하게 작성 가능
> - 순환 참조 문제를 를 애플리케이션 구동(객체의 생성) 시점에 파악하여 방지 가능

이러한 이유들로 DI 프레임워크를 사용하는 경우, **생성자 주입** 을 권장합니다.

<br>

## 3. 왜 굳이 인터페이스를 Bean으로 주입할까?

Spring에서 보통 인터페이스를 선언하고 @Service를 사용해서 빈 주입을 합니다. 구현체가 아니라 왜 인터페이스를 통해서 빈을 주입하는지에 대해 의문점이 생겼습니다. 
제가 이해한 바로는 2가지 이유가 있네요.

### spring proxy

```java
public interface MyService {
    void doSomething();
}
```

```java
@Service
public class MyServiceImpl implements MyService {
    
    @Override
    public void doSomething() {
        System.out.println("hello Im Impl Service");
    }
}
```

```java
@Controller
@RequiredArgsConstructor
public class MyController {

    // 인터페이스 타입
    private final MyService myService;

    // 클래스 타입
    private final MyServiceImpl myServiceImpl;
}
```

```java
spring.aop.proxy-target-class=false 
```

**인터페이스 타입**
> 구현 상속 관계 : MyService -> MyServiceImpl
> 프록시 상속 관계 : MyService -> ProxyMyService 

```java
spring.aop.proxy-target-class=true
```

**클래스 타입**
> 구현 상속 관계 : MyService -> MyServiceImpl
> 프록시 상속 관계 : MyServiceImpl -> ProxyMyService
> MyService --> MyServiceImpl --> ProxyMyService

이 경우 스프링이 생성하는 프록시가 MyServiceImpl을 부모로 하여 생성하는 프록시가 됩니다.

요약하자면 아래와 같습니다.

> - 스프링 프록시 설정이 <span style="color: rgb(0 30 181 / 85%); font-weight: bold">True</span>인 경우 
>     - 인터페이스 타입 & 클래스 타입 빈 주입 가능
>     - 아래의 상황에선 에러 발생 
>         - 사용자가 Service class를 final로 선언 -> 상속 불가능
>         - private 생성자 선언
> 
> - 스프링 프록시 설정이 <span style="color: #bf2a2a; font-weight: bold">False</span>인 경우 
>     - 인터페이스 타입만 빈 주입 가능 (클래스 타입 빈 주입 X)


### OOP 개방 폐쇄 원칙

> 개방 폐쇄의 원칙이란, 확장에는 열려있고 변화에는 닫혀있다는 의미

![컨트롤러 및 서비스 빈 주입](https://user-images.githubusercontent.com/67765871/160088066-af02037f-c189-4748-b45a-7fdefa88e22e.png)

서비스 클래스가 인터페이스를 구현하고 있다면 코드 상에서 컨트롤러는 인터페이스만을 바라보고 있습니다. **실제 구현 클래스는 런타임 시점까지 알지 못하는 상태**입니다.

컨트롤러 입장에서는 서비스 클래스의 비즈니스 로직에 대해서는 관심이 없습니다. 그냥 인터페이스에 있는 메소드를 이용해 로직을 구성할 뿐이기 때문에 **서비스 클래스의 내부 로직이 어떻게 변하던 영향을 받지 않습니다**. **즉, 변화에 닫혀 있습니다.**

반대로 서비스 클래스는 인터페이스에서 규정된 규칙만 잘 지키면 언제든 로직을 변경할 수도 있고, 인터페이스를 구현한 새로운 클래스를 하나 만들어서 기존 클래스를 대체할 수도 있습니다. 확장에는 열려있다라고 표현합니다.

결론적으로, 인터페이스가 아니라 **클래스 타입으로 빈을 주입한다면 개방 폐쇄 원칙에 위배되므로 인터페이스 타입으로 빈을 주입하는 방향이 좋다**고 생각합니다.

<br>


## 4. 참고 자료

[[Spring] 다양한 의존성 주입 방법과 생성자 주입을 사용해야 하는 이유 - (2/2)](https://mangkyu.tistory.com/125)

[인터페이스 빈주입을 사용하는 이유](https://jyami.tistory.com/72)

[스프링 의존 주입(DI)과 인터페이스 사용에 관하여](https://codevang.tistory.com/312)