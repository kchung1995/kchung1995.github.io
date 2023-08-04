---
categories: blog
tags: [생각, 블로그]
---

# GitHub 블로그로 이사하기

안녕하세요, 카펀입니다. GitHub 블로그에서는 처음 인사드립니다.

지금까지 [티스토리 블로그](https://katfun.tistory.com)에서 제 개발 이야기를 글로 적었는데, 이번에 GitHub 블로그로 플랫폼을 옮기기로 결정했습니다.

옮기게 된 계기와 장단점, 그리고 간단한 과정을 소개하려고 합니다.

![img](/assets/images/posts/github-blog-migration/tistory-main.png)

## 1. 발단

티스토리 블로그는 범용적이고 편리합니다. 네이버 블로그처럼 오래되어 보이지도 않고, 깔끔하고 커스터마이징이 가능한 좋은 플랫폼입니다. 때문에 개발자를 포함하여 많은 분들이 티스토리 블로그를 애용합니다.

다만 지금까지 티스토리 블로그를 개발 내용 기록용으로 약 3년 반 정도 사용하면서 (2020년부터 썼다 치고), 기술 블로그로 여러 가지 단점이 체감되기 시작했습니다.

### 장점

* 커스터마이징이 간편함. 그러면서도 제법 개성 있게 꾸미기 가능
* 티스토리 플랫폼에서 제공하는 강력한 통계 기능
* Google 검색에 비교적? 잘 잡힘

[처음 기술 블로그를 시작할 때](https://katfun.tistory.com/12)는, 냅다 알고리즘만 공부한 채로 이를 어떻게든 기록에 남기고 싶었습니다. 그러다 보니 접근이 용이한 티스토리를 선택했고, 지금도 당시 최선의 선택을 했다고 생각합니다.

알고리즘과 책을 따라한 학습 내용을 적던 제 블로그는, 점차 단순한 정보의 나열 대신 제 오리지널 경험과 고민을 담는 성격으로 바뀌었습니다. 취업 준비를 겪고 개발자 커리어를 시작하며 나름 잔뼈가 굵어졌고(?), 점점 티스토리의 장점은 흐려지고 단점은 드러나기 시작했습니다.

### 단점

* 코드 블럭이 못생겼고 커스터마이징이 쉽지 않음 (이거 할바엔 차라리 velog를 쓰지)
* 마크다운 작성이 굉장히 불편함

코드 블럭은 제가 티스토리에서 내내 고민하던 부분입니다. 예전이는 GitHub Gist를 사용해 보기도 하였고, 자체 코드 블럭을 사용하기도 하였습니다.

이것이 알고리즘 문제풀이 글을 올릴 때는 괜찮았는데 (코드 한 덩어리만 올리면 되니까), 기술 얘기를 쓰면서 점차 코드의 양이 많아지고, 코드의 가독성이 더 중요해지다 보니 문제점으로 드러나기 시작했습니다.

<img src="/assets/images/posts/github-blog-migration/tistory-code-block.png" alt="img" style="zoom:50%;" />

티스토리 시절의 코드 블록입니다. 읽기 편하셨나요?

저는 개인적으로 코드 블럭이 너무 불호였어서, 결국 다른 방법을 모색하게 되었습니다.

또, 글 작성이 불편하다는 점도 한몫 했습니다. 티스토리 웹 에디터는 훌륭하지만, 코드를 편하게 작성하거나 하기에는 따르는 여러 불편함이 있습니다. 마크다운 문법으로 글을 작성하기엔 여러모로 글이 예쁘지 않고, 일반 에디터로 작성하기에는 마우스에 손이 너무 많이 갑니다.

### 왜 GitHub 블로그인가?

블로그를 이사하기로 결정한 이후, 일말의 고민도 없이 바로 GitHub 블로그로 결정했습니다. 이유는 간단합니다.

* velog는 개인의 블로그라기 보다는 하나의 플랫폼 느낌. 개인으로서는 개성을 드러내기 쉽고, 블로그 트래픽이 velog 내의 다른 블로그로 전이되어 버린다.
* 네이버 블로그는... 할말하않
* WordPress는 한 11년 전에 썼던 플랫폼인데, 자유도는 GitHub 블로그에 비하면 부족하다고 판단.

반면 GitHub 블로그는, 제가 느낀 갈증을 모두 해소할 수 있습니다. 커스터마이징의 자유도만큼 진입장벽이 있다는 것 외에는 불만사항이 없습니다.

저는 마크다운 문법을 매우 좋아합니다. 그러다 보니, 이를 그대로 글 작성에 사용하고 싶은 욕심이 있는데, 마침 GitHub 블로그는 마크다운 파일로 글을 작성하면 이를 보여 줍니다. 

코드 블럭 역시, 예시로 하나 보여 드리겠습니다.

```kotlin
data class GitHubBlog(
  val title: String,
  val owner: User,
  val url: String,
  val totalPosts: Int
) {
  fun getUserEmail(): String = owner.email
  
  fun describeBlog(): String {
    return "title: $title, owner: ${User.name}, url: #url, total posts: $totalPosts."
  }
}
```

읽을만 한가요? ㅎㅎ

## 2. 이사하기

먼저 배경 지식을 끌어 모았습니다.

* GitHub 블로그는 보통 jekyll의 테마를 사용한다.
* jekyll은 ruby를 사용한다.
* 기본적인 설정에 필요한 요소가 있다.

저는 [Minimal Mistakes Jekyll theme](https://jekyllthemes.io/theme/minimal-mistakes)을 선택했습니다. 지금 보고 계신 테마가 바로 요 테마(dirt)입니다.

참고한 글:

* [깃 블로그 만들기(+쉽게 관리 하기)](https://velog.io/@pyk0844/%EA%B9%83-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0%EC%89%BD%EA%B2%8C-%EA%B4%80%EB%A6%AC-%ED%95%98%EA%B8%B0)
* [1. 나만의 블로그 만들기 Git hub blog!! (github.io)](https://supermemi.tistory.com/entry/%EB%82%98%EB%A7%8C%EC%9D%98-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-Git-hub-blog-GitHubio)

해당 테마를 zip 형태로 받고, GitHub에 공유하여 블로그를 deploy 하였습니다. 요 과정은 검색하면 많이 나오니 설명은 생략하겠습니다.

### Posts baseUrl

블로그의 여러 요소를 개인화하여 설정할 수 있습니다. `_config.yml` 파일을 열면, 다양한 설정 내용이 등장합니다.

* 블로그 이름, 주인 이름 등
* 주인 소개
* baseUrl 설정

이 중 baseUrl 설정만 간단히 소개하겠습니다. (검색해 보니 안 나와서...)

`_posts`라는 디렉토리를 만들고, 이 안에 글을 작성하여 마크다운 형식으로 저장하게 됩니다. 형식은 ` YYYY-MM-DD-${title}.md`가 됩니다.

이를 그대로 적용하면, 실제 블로그의 URL은 `https://someone.github.io/title`이 됩니다. 저는 이게 마음에 안 들었습니다. url 답게, 글은 title 앞에 `/posts`를 붙이고 싶었습니다.

요 부분 역시 config에서 설정할 수 있습니다.

```yaml
# Defaults
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
    values:
      permalink: /posts/:title
      layout: single
      author_profile: true
      read_time: true
      comments: # true
      share: # true
      related: true
```

기본적으로 작성되어 있는 `defaults.values` 아래에 `permalink` 값을 추가하였습니다. 따라서 posts 내의 글들은 제목 앞에 `/posts/`를 가지게 됩니다.

### Markdown 글 네이밍 컨벤션

앞에서 말씀드린 바와 같이, 글은 `YYYY-MM-DD-${title}.md` 형식의 제목을 가져야 합니다. 저는 이렇게 매번 날짜를 직접 입력해야 한다는 점이 너무 귀찮았습니다.

그래서 제가 시도한 방법은 아래와 같습니다.

* `_queue` 디렉토리를 만들고, 신규로 배포되어야 하는 글은 여기에 작성
* 해당 글을 커밋할 때, Git Hooks를 이용해 `newblogpost.sh`를 실행
* `newblogpost.sh` 파일은,
  * `_queue` 내에 마크다운 파일이 존재하는 경우,
  * 제목을 형식에 맞도록 변경한 다음,
  * `_posts` 디렉토리로 이동

`newblogpost.sh`는 아래와 같습니다.

```shell
#!/bin/bash

# Step 1: Check if 'queue' folder exists and is not empty
if [ -d "_queue" ] && [ -n "$(ls -A _queue)" ]; then
  # Step 2: Move markdown files to 'posts' folder and rename them
  for file in _queue/*.md; do
    if [ -f "$file" ]; then
      FILE_NAME=$(basename "$file" .md)
      NEW_FILENAME=$(date +%Y-%m-%d-"$FILE_NAME".md)
      mv "$file" "_posts/$NEW_FILENAME"
    fi
  done
fi
```

Git Hooks 설정은 아래와 같습니다. (블로그 repository 디렉토리에서 시도해 주세요.)

```shell
$ vim .git/hooks/pre-commit

>> bash newblogpost.sh

$ chmod 777 .git/hooks/pre-commit
```

이후 commit 하면 `_queue` 내에 작성한 파일이 `_posts`로 이동됩니다.

그 증거로 여러분은 지금 이 글을 보고 계십니다! ㅎㅎ

## 3. 결과

그래서 짜잔! 이렇게 새 블로그에 새 글이 작성되었습니다.

앞으로는 이곳에서 더욱 양질의 글을 작성하도록 하겠습니다.

읽어 주셔서 감사합니다.