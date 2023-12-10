---
categories: posts
data: 2023-12-10 18:15
tags: [스프링, 오픈 소스, 자바, 코틀린, 회사일 하다가]

---

인프콘에서 [코프링 도입 세션](https://www.inflearn.com/conf/infcon-2023/session-detail?id=765)을 듣고 ([유튜브](https://youtu.be/xuMoald9MPQ?si=W651iW_LhBi7deCs)), FixtureMonkey라는 라이브러리를 알게 되었다.

이후 회사에서 신규로 개발하는 프로젝트에서 활용해 보기 위해 선행조사를 진행했고, 이를 동료들에게 소개하며 FixtureMonkey를 도입하게 되었다. 덕분에 많은 시간을 단축하면서도, 효율적으로 테스트 코드를 작성할 수 있게 되었다.

~~비록 경쟁사에서 공개해 주신 오픈소스지만~~ 이 좋은 라이브러리를 우리만 알고 쓰기엔 아쉽다고 생각해서, 사내 개발꿀팁 게시판에 글을 올렸다. 많은 사우분들이 글을 읽고 좋아요를 눌러 주신 것을 보면, 테스트 작성 시에 느끼던 애로사항을 FixtureMonkey가 시원하게 해소해 주지 않나 싶다.

회사에 소개한 글을 다듬어서, 블로그에서도 소개해 보고자 한다.

## 목차

1. FixtureMonkey 소개
2. FixtureMonkey 예시
3. FixtureMonkey가 생성해준 값

## 1. FixtureMonkey 소개

소개에 앞서, 이 글에서 다루는 모든 코드는 [GitHub](https://github.com/kchung1995/fixture-monkey-examples)에서 확인할 수 있다. Kotlin으로 작성되어 있지만, FixtureMonkey는 Java와 Kotlin을 모두 지원한다. Java 예제 코드는 ~~귀찮아서 안 만들었는데~~ 구글링하면 Kotlin보다 쉽게 찾을 수 있다.



유닛 테스트를 작성할 때, 테스트 객체를 매번 작성하는 일이 번거롭다고 느껴본 적이 있는가? 실제로 테스트하려는 값은 하나뿐인데, 테스트를 위해 객체를 작성하며 모든 필드에 대한 값을 직접 지정해서 만들어 본 적이 있는가?

아쉽게도 내가 많이 그랬다 ㅎㅎ 매번 테스트를 위해 테스트 객체를 작성하다 보면, 실제 테스트 로직 작성보다 테스트 객체의 값 지정에 더 시간을 많이 허비하게 되었다. 이는 생산성의 저하와 직결된다고 느꼈다. 뿐만 아니라, 직접 지정한 수십개의 값 중에서, 어떤 값이 테스트를 위한 값이며, 어떤 값이 테스트를 위해 고정되어야 하는 값이고, 어떤 값이 테스트와는 무관한 값인지 한눈에 파악하기 어려웠다.

이런 니즈를 FixtureMonkey가 잘 해결해 준다. FixtureMonkey는 테스트에 필요한 테스트 객체를 더 쉽게 만들도록 도와 준다. 개발자는 각 필드마다 값을 할당해 주거나, not null 혹은 not empty 같은 조건을 할당해 준다. 그러면 FixtureMonkey는 그 조건 내에서 값을 무작위로 만들어 준다. 바꿔 말하면, 필드 타입 외에 다른 조건을 지정하지 않은 경우, FixtureMonkey는 정말 무작위의 값을 만들어서 할당해 준다.

FixtureMonkey를 사용하면,

* 더 간단히 테스트 객체를 만들 수 있다.
* 더 명확히 테스트 하려는 필드를 드러낼 수 있다.
* 더 꼼꼼히 엣지 케이스를 찾아낼 수 있다.

## 2. FixtureMonkey 예시

아래와 같은 data class가 있고,

```kotlin
data class SomethingResponse(
    val name: String,
    val phoneNumber: String,
    val validEndDate: LocalDate,
    val isDisplay: Boolean,
    val notes: List<String>,
    val reason: String?,
    val remindDate: LocalDate?,
    val detail: SomethingDetailResponse,
) {
    data class SomethingDetailResponse(
        val somethingDetailName: String,
        val comment: String?,
        val somethingDataType: SomethingDataType,
        val anotherDataType: AnotherDataType,
    )

    fun isExpired(now: LocalDate = LocalDate.now()) = validEndDate <= now
}

enum class SomethingDataType(val code: String, val description: String) {
    INITIAL("01", "초기형"),
    PLURAL("02", "복수형"),
    BROTHER("03", "우리형"),
    CIRCULAR("04", "환형"),
}

enum class AnotherDataType(val description: String) {
    SEOUL("서울"),
    TOKYO("도쿄"),
    SYDNEY("시드니"),
}

```

아래와 같은 Service가 있다.

```kotlin
@Service
class SomethingService(
    private val somethingRepository: SomethingRepository,
) {
    fun something(now: LocalDate = LocalDate.now()): List<SomethingResponse> {
        val responses = somethingRepository.something()

        return responses.asSequence()
            .filter { it.isExpired().not() }
            .filter { it.isDisplay }
            .sortedBy { it.validEndDate }
            .toList()
    }
}

```

이 때, 아래 3개의 조건을 테스트해 보려고 한다.

* `isDisplay`가 false인 값은 필터링된다.
* ` validEndDate`가 오늘 날짜 이전이면, 만료된 것으로 간주한다. `isExpired`가 true인 값은 필터링된다.
* response list는 `validEndDate`를 기준으로 오름차순 정렬된다.

따라서 우리가 신경 써야 하는 값들은 `isDisplay`, `validEndDate` 뿐이다. 다른 값들은 적어도 이 테스트들에서는 무관하다.

FixtureMonkey 없이 테스트를 작성한다면 ([GitHub 예시코드](https://github.com/kchung1995/fixture-monkey-examples/blob/main/src/test/kotlin/com/example/fixturemonkey/examples/stuffs/SomethingServiceWithoutFixtureMonkeyMockTest.kt)),

```kotlin
@DisplayName("isDisplay가 아닌 response는 filter된다")
@Test
fun `responses without isDisplay true are filtered`() {
    // given
    val now = LocalDate.of(2023, 12, 10)
    val responses = (0 until 3).map {
        SomethingResponse(
            name = it.toString(),
            phoneNumber = "010-1234-5678",
            validEndDate = LocalDate.of(2023, 12, 10 + it),
            isDisplay = it % 2 == 1,
            notes = listOf("a", "b", "c"),
            reason = if (it % 2 == 1) "this is a stub note" else null,
            remindDate = if (it % 2 == 1) LocalDate.of(2023, 12, 10) else null,
            detail =
            SomethingResponse.SomethingDetailResponse(
                somethingDetailName = it.toString(),
                comment = if (it % 2 == 0) "this is a stub comment" else null,
                somethingDataType = SomethingDataType.entries[it],
                anotherDataType = AnotherDataType.entries[it],
            ),
        ) 
      
    every { somethingRepository.something() } returns responses

    // when
    val result = somethingService.something(now)

    // then
    assertThat(result.all { it.isDisplay }).isTrue
}
```

위에서 언급한 문제점이 명확히 드러난다.

* Response 생성하는 내용이 given, 나아가 테스트 전체의 대부분의 비중을 차지
* 어떤 값이 테스트하려는 값인지, 고정되어야 하는 값인지, 무관한 값인지 알 수 없음

이 코드를 FixtureMonkey를 사용해서 리팩토링해 보면 ([GitHub 예시코드](https://github.com/kchung1995/fixture-monkey-examples/blob/main/src/test/kotlin/com/example/fixturemonkey/examples/stuffs/SomethingServiceMockTest.kt)),

```kotlin
@DisplayName("isDisplay가 아닌 response는 filter된다")
@Test
fun `responses without isDisplay true are filtered`() {
    // given
    val now = LocalDate.of(2023, 12, 10)
    val responses =
        (1..100).map {
            fixtureMonkey.giveMeBuilder<SomethingResponse>()
                .setExp(SomethingResponse::validEndDate, LocalDate.of(2023, 12, 11))
                .sample()
        }

    every { somethingRepository.something() } returns responses

    // when
    val result = somethingService.something(now)

    // then
    assertThat(result.all { it.isDisplay }).isTrue
}
```

위에서 언급한 문제점이 해결되었다.

* `validEndDate`가 고정값임에 따라 `isExpired`는 언제나 같은 값을 가질 것이며, 따라서 필터링 결과에 변화를 주지 않음
* assertThat에 `isDisplay`를 명시함으로서, 이 값을 테스트하고 있음을 명확히 표시 (사실 이 부분은 위에서도 마찬가지이긴 하다.)
* 테스트와 무관한 값들은 코드 내에 전혀 등장하지 않음으로서, 테스트의 목적과 대상을 명확히 드러냄

비슷하게, `validDateTime` 필드 값에 따라 필터링 여부를 테스트 아래와 같이 테스트 하거나,

```kotlin
@DisplayName("isExpired인 response는 filter된다")
@Test
fun `responses with isExpired true are filtered`() {
    // given
    val now = LocalDate.of(2023, 12, 10)
    val expiredDate = LocalDate.of(2023, 12, 9)
    val nonExpiredDate = LocalDate.of(2023, 12, 11)
    val responses =
        (1..100).map {
            fixtureMonkey.giveMeBuilder<SomethingResponse>()
                .setExp(SomethingResponse::isDisplay, true)
                .setExp(SomethingResponse::validEndDate, if (it % 2 == 0) expiredDate else nonExpiredDate)
                .sample()
        }

    every { somethingRepository.something() } returns responses

    // when
    val result = somethingService.something(now)

    // then
    assertThat(result.none { it.isExpired(now) }).isTrue
    assertThat(result.all { it.validEndDate == nonExpiredDate }).isTrue
}
```

필터링 후의 값이 조건에 따라 정렬된다는 것을 검증하는 테스트코드도 편리하게 작성할 수 있다.

```kotlin
@DisplayName("response가 validEndDate 기준으로 오름차순 정렬된다")
@Test
fun `responses are sorted ascending by validEndDate`() {
    // given
    val now = LocalDate.of(2023, 12, 10)
    val validEndDates = listOf("2023-12-31", "2023-12-30", "2023-12-29", "2023-12-11")

    val responses =
        (0 until 4).map {
            fixtureMonkey.giveMeBuilder<SomethingResponse>()
                .setExp(SomethingResponse::isDisplay, true)
                .setExp(SomethingResponse::validEndDate, LocalDate.parse(validEndDates[it]))
                .sample()
        }

    every { somethingRepository.something() } returns responses

    // when
    val result = somethingService.something(now)

    // then
    assertThat(result).isSortedAccordingTo { o1, o2 -> o1.validEndDate.compareTo(o2.validEndDate) }
}
```

이 외에도, nullable인 필드에서 테스트할 땐 not null하도록 고정하거나, list형 필드가 비어 있지 않도록 고정하는 등의 역할을 할 수 있다. 

## 3. FixtureMonkey가 생성해준 값

앞서, FixtureMonkey는 **사용자가 제시한 제약조건 내에서** 임의의 값을 지정해 준다고 하였다. 이를 확인해 보자.

가장 아무 조건도 안 넣은, `isDisplay` 여부를 확인하는 테스트 코드를 디버깅해 보면,

* `validEndDate`는 고정값으로 제약조건을 주었으므로, 2023-12-11로 고정되어 있다.
* nullable 필드는 null일 수도, 아닐 수도 있다.
* `notes` 필드는 `List<String>`이므로, null은 아니지만 내부의 element 개수는 무작위다.
* `somethingDataType`, `anotherDataType`은 `enum` 필드이므로, 각 enum entry 중 무작위 값이다.
* `String`형 필드들에는 정말 무작위의 문자열이 들어간다.

![img](/assets/images/posts/2023-12-10-FixtureMonkey-보다-효율적이고-정확한-테스트-코드를-빠르게-작성하도록-도와주는-라이브러리/debug.png)

이에 따라, 앞서 언급한 "더 꼼꼼히 엣지 케이스를 찾을 수 있다."가 이루어진다. 테스트 객체를 개발자가 직접 하나씩 작성하다 보면, 고려하지 않은 경우를 만들지 않게 되는 경우가 있다. 위의 예시처럼 list 형태로 만들어 버리면, list 내의 객체가 모두 비슷한 패턴을 가지고 만들어지며, 이는 특정 엣지 케이스가 누락되기 쉬운 환경이 된다.

이런 엣지 케이스의 경우에는, 한두 번 테스트 코드를 실행하는 것으로는 드러나지 않을 수도 있다. 아까는 성공했지만 지금은 실패하는 테스트가 등장한다면 바로 이런 경우일 것인데, 이는 유닛 테스트를 언제 실행해도 동일한 결과를 얻을 수 있어야 한다는 consistency가 깨지는 것이 된다. Consistency를 만족하도록 코드를 수정해 주는 것으로 엣지 케이스를 잡아낼 수 있다.

## 마무리

FixtureMonkey는 얼마 전에 정식 릴리즈가 되었다 (v1.0.0). 우연히 알게되어 현재까지 매우 유용하게 쓰고 있는 라이브러리이기 때문에, 한 번쯤 내용을 간략히 소개하고 싶었다.

참고:

* [FixtureMonkey 공식 문서](https://naver.github.io/fixture-monkey/) (정식 릴리즈 이전에는 좀 불친절했다)
* [FixtureMonkey GitHub](https://github.com/naver/fixture-monkey)
* [Naver Deview FixtureMonkey 소개](https://deview.kr/2021/sessions/417)
* [FixtureMonkey 1.0.0 정식 버전 릴리즈 (2023.11.10)](https://d2.naver.com/news/2459981)