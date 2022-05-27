---
title: ThreadLocal에 대하여
date: 2022-01-19 16:05:93
category: Java
thumbnail: { thumbnailSrc }
draft: false
---

## 1. 변수를 공유하는 방법

객체는 Heap 또는 Stack 메모리 영역에 배치시킬 수 있습니다. **Heap 영역은 일반적으로 모든 thread에서 접근 할 수 있으며 stack은 thread 하나당 만들어 지는 메모리 영역으로 thread간 접근이 불가능**한 것으로 알려져 있습니다.

```java
public class UserService {

  private final UserRepository userRepository;

  public UserServiceV1(UserRepository userRepositoryV1) {
      this.userRepository = userRepository;
  }

  @Transactional
  public void signUp(SignUpRequest request) {
    userRepository.save(request.toUser());
}
```

UserRepository 변수는 **Heap 영역에 만들어진 객체를 가리키고 있으며 다른 곳에서도 해당 객체를 바로 접근할 수 있습니다.**  따라서 만약 UserRepository가 설정 정보를 가지고 있고 이를 변경한다면 사용하고 있는 모든 곳에서 영향을 받게 됩니다.

```java
public SignInResponse signIn(SignInRequest request) {

    String email = request.getEmail();
    String password = request.getPassword();

    return new SignInResponse(email, pasword);
}
```

**한 메서드 안에서 변수를 사용한다면 Stack 메모리에 올라갈 것이며 이 변수의 값은 thread에 안전한 변수**로 사용될 수 있을 것입니다. 왜냐하면 email, password 변수에 대해서는 외부에서 접근을 할 수 있는 방법이 없기 때문에 하나의 thread에 한정적으로 사용할 수 있기 때문이죠. 
그렇기 때문에 **변수 공유를 위해서는 인자로 받아서 사용해야하며 자신의 변수를 다른 곳에서 사용하기 위해서는 리턴값으로 제공해야하는 단점**이 있습니다.

## 2. ThreadLocal 이란

ThreadLocal은 한 thread 안에서 파라미터 또는 리턴 값으로 정보를 제공하는 것이 아닌 다른 방법으로 thread 안에서의 값을 공유하는 방법을 제공합니다. 이렇게 Stack 영역에 변수를 선언하는 것에 대해서 단점을 해소해줄 수 있습니다.


### ThreadLocal 내부 동작

ThreadLocal의 내부는 thread 정보를 key로 하여 값을 저장해두는 Map 구조를 가지고 있습니다.

```java
public T get() {
        Thread t = Thread.currentThread();
        
        ThreadLocalMap map = getMap(t);
        
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        
        return setInitialValue();
}
```

### ThreadLocal 예제

```java
class User { }

public class ThreadLocalTest {

    public static void main(String[] args) {
        User u = new User();
        
        ThreadLocal threadLocal = new ThreadLocal<>();
        threadLocal.set(u);
        
        System.out.println(threadLocal);
        System.out.println(threadLocal.get());

        new Thread(()->{
            System.out.println(threadLocal);
            System.out.println(threadLocal.get());
        }).start();

        new Thread(()->{
            threadLocal.set(u);
            
            System.out.println(threadLocal);
            System.out.println(threadLocal.get());
        }).start();
    }
}
```

```shell
java.lang.ThreadLocal@63947c6b
User@2b193f2d

java.lang.ThreadLocal@63947c6b
null

java.lang.ThreadLocal@63947c6b
User@2b193f2d
```

- **threadLocal** 이라는 변수는 안에 컨테이너를 들고 있는데, 이 컨테이너가 스레드마다 독립적으로 존재
  - **threadLocal**  이라는 변수 자체는 각 스레드에서 조회해도 동일한 변수
  - 그 안의 컨테이너를 **.get()** 으로 가져왔을 때, 각 스레드마다 호출 결과 다름
  - 두 번째 스레드 print 결과 **null**

- 단, 세번째 스레드처럼 **threadLocal**  내 컨테이너에 같은 변수를 설정하게 되면,  
**컨테이너 자체는 독립적이지만 가리키는 변수가 같아 스레드에서 같은 변수에 접근**

## 3. 참고 자료

[Threadlocal에 관하여](https://sabarada.tistory.com/163)

[[Java] Thread Local](https://umbum.dev/1035?category=778552)