---
title: getById vs findById
date: 2022-01-18 16:05:18
category: JPA
thumbnail: { thumbnailSrc }
draft: false
---

## getById
---

```java
@Override
public T getById(ID id) {
    Assert.notNull(id, ID_MUST_NOT_BE_NULL);
    
    return em.getReference(getDomainClass(), id);
}
```

내부적으로 EntityManager.getReference() 메소드를 호출하기 때문에 엔티티를 직접 반환하는 것이 아니라 프록시만 반환합니다.  
프록시만 반환하기 때문에 실제로 사용하기 전까지는 DB에 접근하지 않으며, 만약 나중에 프록시에서 DB에 접근하려고 할 때 데이터가 없다면 EntityNotFoundException이 발생합니다.

## findById
---

```java
@Override
public Optional<T> findById(ID id) {
    Assert.notNull(id, ID_MUST_NOT_BE_NULL);

    Class<T> domainType = getDomainClass();

    if (metadata == null) {
        return Optional.ofNullable(em.find(domainType, id));
    }

    LockModeType type = metadata.getLockModeType();

    Map<String, Object> hints = new HashMap<>();
    getQueryHints().withFetchGraphs(em).forEach(hints::put);

    return Optional.ofNullable(type == null ? em.find(domainType, id, hints) : em.find(domainType, id, type, hints));
}
```

실제로 DB에 요청해서 엔티티를 가져옵니다.  
정확히 말하면, 영속성 컨텍스트의 1차 캐시를 먼저 확인하고 데이터가 없으면 실제 DB에 데이터가 있는지 확인합니다.


## 차이점
---

- getById()가 해당 엔티티를 사용하기 전까진 DB에 접근하지 않기 때문에 성능상 좀 더 유리  
- 특정 엔티티의 ID 값만 활용할 일이 있다면 DB에 접근하지 않고 프록시만 가져와서 사용 가능

## Test
---

```java
@SpringBootTest
public class PostServiceTest {

    @Autowired
    private PostService postService;

    @Test
    void testGetById() {
        Member member = postService.createMember();
        postService.createPostByGet(member.getId());
    }

    @Test
    void testFindById() {
        Member member = postService.createMember();
        postService.createPostByFind(member.getId());
    }
}
```

```sql
-- getById() 사용한 경우 member 테이블 조회하는 쿼리가 날아가지 않음

Hibernate: 
    insert 
    into
        member
        (member_id) 
    values
        (null)
Hibernate: 
    insert 
    into
        post
        (post_id, member_id) 
    values
        (null, ?)
```

- getById()는 실제 테이블을 조회하는 대신 프록시 객체만 가져옵니다.
- 프록시 객체만 있는 경우 ID값을 제외한 나머지 값을 사용하기 전까지는 실제 DB에 접근하지 않기 때문에 SELECT 쿼리가 날아가지 않습니다.

```sql
-- findById() 사용한 경우 post 테이블을 조회

Hibernate: 
    insert 
    into
        member
        (member_id) 
    values
        (null)
Hibernate: 
    select
        member0_.member_id as member_i1_2_0_ 
    from
        member member0_ 
    where
        member0_.member_id=?
Hibernate: 
    insert 
    into
        post
        (post_id, member_id) 
    values
        (null, ?)
```

- findById()를 사용하면 DB에 바로 접근해서 데이터를 가져옵니다.