---
categories: posts
data: 2023-08-23 23:30
tags: [디자인 패턴, 스프링, 회사일 하다가]
---

# 부제: 역할이 모호한 코드 명확하게 리팩토링하기

회사에서 팀 내의 다른 프로젝트에 참여하게 되었다. 한 8개월 동안 맨날 보던 코드들을 떠나, 좀 더 역사가 긴 코드들을 접하게 되었다. (사실 그래봐야 2년 남짓 된 코드들이다 ㅋㅋ)

어차피 프로젝트에 참여하고 있는 것도 아니라서 시간이 ~~텅텅~~ 비어 있던 차에, 이 참에 부족한 테스트 코드를 채워 넣으면서 코드를 이해하고자 했다. (실제로 [남의 코드에 대한 단위 테스트 작성은 많은 사람들이 시도하는 좋은 코드 이해법이다](https://www.everydayunittesting.com/2021/03/what-ive-learned-writing-tests-for-someone-elses-code.html).)

테스트를 하려면 기존의 도메인 지식을 파악해야 한다. 나는 두 가지 방법으로 도메인 지식을 파악하기로 했다.

1. API 진입부터 DB 호출 또는 외부 API 호출까지, 프로젝트 내의 모든 BE 로직의 흐름을 파악한다.
2. 기존의 기획서를 확보하여 읽어 보고, 이해한 코드와 대조한다.

마침 우리 팀의 위키도 부족한 면이 많아서, 이 참에 내가 하나씩 작성하기로 했다. 서비스에서 사용 중인 DB 테이블을 전부 파악하고, 각 Controller의 요청이 DB까지 어떻게 닿는지 그림을 그려 가며 파악했다.

전체 그림을 한 번 그리고 나니, 적어도 BE 코드의 흐름은 어느 정도 머릿속에 잡히기 시작했다. 다음으로, 가장 간단한 기능부터 테스트 코드를 작성해 보려고 했는데...

## 목차

1. 문제점 발견
2. 문제의 정의
3. 아이디어
4. 이런 걸 부르는 디자인 패턴이 있다고?
5. 마무리

## 1. 문제점 발견

### 테스트가 어렵다

...테스트 코드를 작성하기가 쉽지 않았다.

내가 실력이 없어서일까? ~~물론 그것도 맞지만~~ 애초에 코드가 잘 작성되어 있어야 테스트하기에도 쉽다. [향로님의 '테스트하기 좋은 코드 - 테스트하기 어려운 코드'](https://jojoldu.tistory.com/674) 글을 읽어보면, 프로덕션 코드의 구현이 엉망일 경우 테스트하기 어렵다고 한다. 맞는 말이다! 코드 하나에 여러 책임이 몰려 있거나, 여러 기능이 순간순간 구현에만 급급한 코드들은 대개 테스트하기 어렵다. 또는 코드가 오래 사용되며, 중간중간 기능이 추가되어 간 코드들 역시 정신을 차려 보면 테스트하기 어려운 경우가 있다. 너무 많은 책임을 들고 있기 때문이다.

이번 코드도 마찬가지였다. 약 2년 이상의 시간이 지나면서, 이미 팀을 떠난 분들을 포함해서 많은 개발자가 거쳐 간 코드는 테스트하기 어려운 코드가 되어 있었다. 어쩐지 테스트 코드가 없다 싶더니, 딱 봐도 테스트하기 어려우니까 테스트 코드가 없을 법하다.

그런데 여기서 말한 '책임이 몰려 있는 코드'란 구체적으로 어떤 말일까?

### Example

예시를 하나 보자.

```kotlin
@Service
class SomethingService(
  private val somethingHistoryRepisotory,
  private val somethingProgressRepository,
  private val somethingVendorRepository,
  private val somethingUserRepository,
  private val somethingExternalApiClient
) {
  fun somethingActiveUsers(status: String): Users {
    return Users(
      somethingUserRepository.findByStatus(status).filter { it.isActive }
    )
  }
  
  / ... /
}
```

어떤 서비스 `SomethingService`가 있다. 이 서비스는 4개의 repository와 하나의 Api client에 의존하고 있다.

생각보다 읽고 계신 여러분들도 자주 접할 코드 같다. Spring 처음 배울 때 Controller-Service-Repository로 이어지는 구조를 만들어 놓고, 프로젝트를 하다 DB 테이블이 늘어나다 보면 자연스럽게 repository를 하나 둘 추가해 갔을 테니까. ~~나도 알고 싶지 않았다~~

이 코드가 왜 문제일까?

`sometingActiveUsers` 메소드를 테스트해 보자.

```kotlin
internal class SometingServiceTest() {

  private val service = SomethingService(//... 어? )
  
  @Test
  fun `상태에 맞는 사용자 중 활성화된 사용자만 리턴한다`() {
    / ... /
  }
}
```

문제점이 보이는가? `somethingActiveUsers`를 테스트하려고 하면, `SomethingService`가 의존 중인 모든 repository를 채워 넣어 줘야 한다. 심지어 `somethingActiveUsers`는  `somethingUserRepository`하나밖에 쓰지 않는다.

Mocking하면 되지 않을까? 하기엔 내용이 너무 많고, 불필요한 메소드까지 죄다 모킹해야 한다. 심지어 매 테스트마다 특정 메소드이 모킹값이 다르다면, 그것도 일일히 모킹해 줘야 한다.

### 책임의 모호함

결국 이 모든 문제는 `SomethingService`가 과도한 책임을 가지고 있어서 그렇다.

Service는 어떤 책임을 가지면 좋을까? [이 글](https://www.baeldung.com/spring-service-layer-validation#:~:text=A%20service%20layer%20is%20a,includes%20validation%20logic%20in%20particular.)에 따르면,

> Controller 계층과 Persistance 계층 간의 통신을 용이하게 한다. 또한 비지니스 로직을 포함하며, 유효성 검사 등도 Service에서 이루어진다.

이 말에 따르면, `SomethingService`의 `somethingActiveUsers`는 해당 책임을 따르고 있다. 특정 조건으로 필터링해서 데이터를 보여 주고 있고, 이 조건은 비지니스 로직이다.

하지만 우리의 `SomethingService`는 하나의 책임을 더 가지고 있다.

> 해당 비지니스에 필요한 persistance 계층을 모으고, 이로부터 데이터를 serving 하는 역할

이러다 보니, 비지니스 로직을 검증하고자 하는데 persistance 계층을 모으는 역할이 뒤섞이고, 결과적으로 테스트하기 어려운 코드가 되는 것이다.

## 2. 문제의 정의

그렇다면 현재 상황의 문제를 명확히 정의해 보자.

> Service 계층이 과도한 책임을 가지고 있다. 이 중 비지니스에 필요한 persistance 계층을 모으는 책임은 Service 계층이 담당할 역할이 아닌 것으로 본다.

그렇다면 해결책 역시 정의할 수 있다.

> 비지니스에 필요한 persistance 계층을 모아서 제공하는 역할을 별도 객체에 위임하고, Service 계층은 이 새로운 객체에만 의존하자.

## 3. 아이디어

해결책을 정의했으니, 이를 어떻게 구현할지 생각해 보자.

앞서 우리가 마주한 문제점은, `SomethingService`가 너무 많은 repository에 의존하고 있기 때문에, 테스트하기 쉽지 않다는 점이었다. 

정의한 해결책에 따르면, `SomethingService`는 역할을 위임 받을 새로운 객체에만 의존하면 된다. 이 새로운 객체를 앞으로 `SomethingRepository`라고 부르겠다.

이 client는 내부적으로는 변동의 여지가 있지만 (DB 테이블이 추가되거나, 변경되거나, 등등), **SomethingService**가 처리하는 비지니스 영역에 필요한 persistance 계층을 모아서 제공한다는 점은 항상 동일하다. 따라서 이 역할을 소프트웨어 세계의 표현 방식으로 옮기자. **Interface**를 사용하면 된다.

```kotlin
interface SomethingRepository {
  fun findAllUsersByStatus(status: String): Users
  
  fun getTotalCallCount(id: Long): Long
}
```

### 잠깐 딴소리

Interface, 즉 추상화를 사용하면 항상 좋을까? 나는 그렇지는 않다고 생각한다.

추상화를 사용하면 생기는 단점은,

* 구현체가 2개 이상이라면, 어떤 구현체를 사용하고 있는지 명확하지 않다.
* 불필요한 추상화는 오버엔지니어링이다. 즉 이후에 제거하려고 해도 쉽지 않다.
* 코드의 이해가 직관적이지 못하다. (IntelliJ에서 코드 따라따라 가다 보면 interface 막힌 경험 한번씩 있죠?)
* 종합하면, 추상화도 비용이다.

하지만 추상화를 쓰면 생기는 장점도 뚜렷하다.

* mocking 없이도 테스트코드를 작성할 수 있다.
* DB 테이블을 교체하거나, 외부 API 호출로 변경해도 그대로 사용할 수 있다.
* 같은 역할을 구현만 다르게 해야 하는 경우 (사실 드물 듯하다) 유리하다.

종합적으로 따져 봤을 때, 이번에는 추상화를 사용하기로 했다. 구현체도 (현재로서는) 1개 뿐이고, 오히려 테스트 코드 작성이나 DB 테이블 추가 등에서 이점을 얻을 수 있다.

### 다시 본론으로 돌아와서

작성한 Interface의 구현체를 작성하자.

```kotlin
@Repository
class SomethingClient(
  private val somethingHistoryRepisotory,
  private val somethingProgressRepository,
  private val somethingVendorRepository,
  private val somethingUserRepository,
  private val somethingExternalApiClient
) : ClaimCompanyRepository {
    fun findAllUsersByStatus(status: String): Users {
      return Users(
        somethingUserRepository.findByStatus(status).filter { it.isActive }
      )
    }
  
  fun getTotalCallCount(id: Long): Long {
    TODO ("not yet implemented")
  }
}
```

구현체 `SomethingClient`가 여러 repository에 의존하고 있다. 언급한 바 있지만, 다른 구현체는 API 호출 같은 전혀 다른 의존 관계를 가져도 상관 없다.

이 구현체를 사용하는 `SomethingService`는 아래와 같이 수정할 수 있다.

```kotlin
@Service
class SomethingService(
  somethingClient: SomethingRepository
) {
  fun somethingActiveUsers(status: String): Users = somethingClient.findAllUsersByStatus(status)
  
  / ... /
}
```

그리고 테스트는 아래와 같이 작성할 수 있다.

```kotlin
internal class SometingServiceTest() {

  private val client = TestSomethingClient()
  private val service = SomethingService(client)
  
  @Test
  fun `상태에 맞는 사용자 중 활성화된 사용자만 리턴한다`() {
    / ... /
  }
}

internal class TestSomethingClient() : SomethingRepository {
  fun findAllUsersByStatus(status: String): Users {
      return Users(
        // 아래의 stub은 User 타입의 stub 객체
        listOf(USER_STUB_01, USER_STUB_02)
      )
    }
  
  fun getTotalCallCount(id: Long): Long {
    TODO ("not yet implemented")
  }
}
```

이렇게 **인터페이스를 구현해서** 테스트를 하는 방법이 존재한다. 꼭 이렇게 해야 하는 건 아니고, 이것 외에 방법이 없는 것은 아니지만, 일단 훨씬 수월해졌다.

### 보너스

이렇게 `SomethingRepository`를 두면 의외의 장점을 하나 더 얻을 수 있다.

우리는 보통 JPA를 사용하며, repository에 오만 가지 메소드가 열려 있게 된다. `findBy`도 무궁무진하고, 그 외 다양한 메소드 중에서 어떤 것을 써야 할 지 명확하지 않은 경우가 많다. 위의 예시에서, 만약 `SomethingService` 외에 `OneMoreThingService`에서도 `SomethingHistoryRepository`를 사용해야 한다면? 혼란스러울 것이다.

`SomethingRepository`를 두면, `SomethingService`가 다루는 비지니스 영역에 필요한 기능만 노출시킬 수 있다. 어떤 것이 `SomethingService`에서 쓰이고, 어떤 것이 그렇지 않은지 명확해지는 것이다.

종합적으로 객체지향 5대 원칙 (SOLID) 중 **Interface Segregation Principle**에 해당하는 내용이라고 볼 수 있겠다.

## 4. 이런 걸 부르는 디자인 패턴이 있다고?

그런데 역시, 이런 생각을 세상에서 나만 한 게 아니다. 심지어 이런 경우를 가리키는 디자인 패턴도 있다.

Facade (퍼사드) 패턴이라는게 있다. ([위키피디아 링크](https://ko.wikipedia.org/wiki/퍼사드_패턴)) 설명을 조금 옮겨 오면,

* SW 라이브러리를 쉽게 이해하게 해 준다. 간편한 메소드를 제공한다.
* 바깥쪽의 코드가 안쪽 코드에 의존하는 일을 감소시켜 준다.

즉, 일종의 wrapper인 것이다. 덕분에 이런 경우에 대한 좋은 설계 방향성을 참고할 수 있었다. 

이 패턴 이름을 접한 건 개발바닥 2사로 오픈톡방이었다. 공교롭게도 [종현님](https://kim-jong-hyun.tistory.com/) 역시 비슷한 경우에 리팩토링을 진행 중이셨는데, 톡방 염탐하다가 주워듣게 되었다.

![img](/assets/images/posts/하나의-Service가-여러-Repository에-의존할-때)

**눈빛 애교 어피치**가 종현님이다.

구현하고 나서 생각나서 찾아 보니 딱 이런 상황이었던 것... ~~내 코드도 찰떡코드가 되었다~~ 오묘하고 재밌는 경험이었다. ㅋㅋ

## 5. 마무리

이전에 프로젝트 설계를 하면서 코드의 책임과 역할을 명확히 한다는, 흔하게 듣는 말의 무게감을 제대로 ~~머리 깨져 가며~~ 체감할 일이 있었는데, 그 때의 경험이 이번 리팩토링에 큰 도움이 되었다. 어디 가서 그래도 개발자라고 명함은 내밀 수 있을 것 같다 ㅎㅎ

현재로서 이렇게 코드를 리팩토링하고, 테스트 코드를 채워 나가려고 한다.  다만 이게 프로젝트 사이의 빈 시간에 진행하는 거라, 진행이 잘 안 될 수도 있지만... 하다 보면 잘 진행되지 않을까? ㅎㅎ
