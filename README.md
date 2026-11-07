# Kyungwon Lee · Game Developer Portfolio

University of Minnesota의 Computer Science 학생 Kyungwon Lee가 자신의 게임과 개발 경험을 소개하는 영문 포트폴리오입니다. B안의 Player Select 스타일을 바탕으로 Home, Projects, 게임별 상세 페이지, About, Contact를 만들었습니다.

## VS Code에서 열고 실행하기

1. ZIP을 받았다면 먼저 압축을 풉니다. `package.json`이 보이는 `kyungwon-portfolio` 폴더를 찾습니다.
2. VS Code에서 **File → Open Folder**로 그 폴더를 엽니다.
3. **Terminal → New Terminal**을 열고 아래 명령을 입력합니다. Node.js 22 이상이 필요하며, 이 컴퓨터에서는 Node.js 24로 확인했습니다.

```powershell
npm.cmd start
```

4. 브라우저에서 [로컬 미리보기](http://127.0.0.1:4180/)를 엽니다. 터미널이 실행 중인 동안 이 컴퓨터에서 접속할 수 있습니다. 게임은 이 주소에서 열어야 정상적으로 내려받아 실행됩니다.
5. 실행을 끝내려면 터미널에서 `Ctrl+C`를 누릅니다. 내용을 바꿨을 때는 `npm.cmd start`를 다시 실행하고 브라우저를 새로고침합니다.

이미 미리보기가 실행 중이라 `4180` 포트를 쓸 수 없다면 열린 브라우저를 그대로 이용하세요. 다른 포트로 실행하려면 `npm.cmd run build` 후 `node scripts/serve.mjs 4181`을 입력하고 터미널에 표시된 주소를 엽니다.

## 사용한 언어와 제작 방식

| 파일 | 역할 | 처음 수정해 볼 곳 |
| --- | --- | --- |
| `content/site.json` | 이름, 소개, 사진, 이메일, 소셜 링크 | `intro` 문장 변경 |
| `content/projects/*.json` | 프로젝트 제목, 설명, 기여, 사진, 게임 링크 | `description` 문장 변경 |
| `scripts/templates.mjs` | **HTML**을 만드는 공통 틀. 제목, 메뉴, 카드, 상세 섹션의 순서를 정합니다. | 페이지 구성을 바꿀 때 |
| `public/assets/site.css` | **CSS**. 보라색 테마, 카드 배치, 화면 폭에 따른 줄 바꿈을 정합니다. | `--accent` 색상 변경 |
| `public/assets/site.js` | 브라우저에서 실행되는 **JavaScript**. 필터, 사진 확대, 게임 열기와 닫기를 처리합니다. | 버튼 동작을 바꿀 때 |
| `scripts/build.mjs` | 컴퓨터에서 Node.js로 실행하는 **JavaScript**. JSON을 읽어 HTML을 생성하고 파일을 `dist/`에 복사합니다. | 평소에는 `npm.cmd run build`로 실행 |

처음에는 Home에 소개와 프로필 사진을 두고, 다음 줄에 두 게임을 나란히 배치했습니다. 화면이 좁으면 CSS가 사진과 프로젝트를 한 열로 쌓습니다. 그 다음, 동일한 카드와 상세 페이지 틀에서 두 게임의 JSON을 읽도록 만들어 설명이나 이미지를 따로 수정할 수 있게 했습니다. Unity 게임의 플레이 코드는 기존 C# 빌드를 사용합니다. 사이트는 JavaScript로 브라우저 플레이어를 여닫습니다.

`npm.cmd run build`만 실행하면 배포할 파일이 `dist/`에 만들어집니다. `dist/`의 HTML은 다음 실행에 다시 생성되므로, 수정할 때는 위 표의 원본 파일을 편집합니다. 별도 패키지를 내려받지 않고 실행할 수 있습니다.

## 프로젝트나 사진 추가하기

1. 코딩 프로젝트는 [`examples/software-project.json`](examples/software-project.json)을 복사해 `content/projects/`에 저장합니다. 게임은 기존 게임 JSON을 참고합니다. `slug`에는 `my-new-project`처럼 영문 소문자와 하이픈으로 고유한 주소를 입력합니다.
2. `category`는 `game`, `software` 또는 `web-app`, `research` 같은 새 분류입니다. 새 분류의 필터가 Projects에 자동으로 생기며, 표시 이름은 `categoryLabel`로 지정할 수 있습니다. `number`는 정렬 순서입니다. Home에 올릴 프로젝트는 `featured`를 `true`로 설정합니다.
3. 제목과 한 줄 설명을 먼저 적습니다. 사용 기술, 개발 기여, 대표 이미지, 갤러리, 다운로드, 플레이, 영상은 필요한 것만 추가합니다. 이미지 파일을 `public/assets/`에 넣고 JSON에는 `assets/my-new-project.png`처럼 적습니다. `coverAlt`와 갤러리의 `alt`에는 장면을 설명하는 짧은 문장을 씁니다.
4. GitHub 주소는 `source`에, 데모와 문서 같은 버튼은 `links`에 `{ "label": "Live demo", "url": "https://example.com" }` 형식으로 추가합니다. 영상은 MP4를 `public/assets/`에 넣고 `video`에 `src`, `title`, 자막이 있으면 `captions` 경로를 설정합니다.
5. 다시 실행하면 프로젝트 목록, 필터, 개별 상세 페이지가 함께 만들어집니다. 내용을 검토한 뒤 GitHub에 수정 파일을 올리고 **Publish portfolio**를 다시 실행합니다.

사진은 `public/assets/profile.png`를 바꾸거나 `site.json`의 `photo`를 새 경로로 설정합니다. 이력서를 추가할 때는 PDF를 `public/assets/`에 넣고 `resume`에 경로를 쓰면 About에 버튼이 생깁니다. Contact에는 개인 GitHub 계정 `dku7785`를, Zelda 상세 페이지에는 과제의 소스 저장소를 연결했습니다.

## Unity Web Build 연결

**MonochromeBall**은 사용자가 만든 Web Build 전체를 `public/games/monochrome-ball/`에 복사했습니다. 상세 페이지에서 Play in browser를 누르면 `iframe`이라는 브라우저 영역이 만들어지고, Unity의 `index.html`이 그 안에서 열립니다. Close game을 누르면 영역이 제거됩니다. 모바일에서도 소개와 사진을 읽을 수 있고, 게임 조작은 데스크톱 키보드를 기준으로 안내했습니다.

빌드의 Brotli(`.br`) 파일에는 호스팅에서 맞는 압축 응답 설정이 필요합니다. 이 프로젝트는 배포용 `dist/`를 만들 때만 Unity 파일을 풀어 일반 정적 호스팅에서 읽게 했습니다. `public/`의 Web Build 복사본과 원본 Unity 프로젝트는 보존됩니다. 풀린 게임 파일은 약 62 MB이며, 플레이 버튼을 누른 뒤 로딩합니다. [Unity Web 배포 문서](https://docs.unity.com/en-us/engine/6000.3/manual/platform-specific/webgl/building-distribution/deploying)

MonochromeBall을 업데이트하려면 Unity에서 새 Web Build를 만든 뒤 `index.html`, `Build`, `TemplateData` 등 출력 폴더 전체를 `public/games/monochrome-ball/`에 교체하고 다시 빌드합니다. 다른 Unity 게임은 새 `public/games/<slug>/` 폴더에 기본 Web 템플릿 빌드를 넣고 프로젝트 JSON의 `play`를 아래처럼 지정합니다.

```json
"play": {
  "mode": "embed",
  "url": "games/my-new-game/index.html",
  "note": "Use a desktop browser and keyboard."
}
```

**Zelda**의 Gold Web Build는 `public/games/zelda/`에 있으며, 상세 페이지의 Play in browser 버튼으로 사이트 안에서 실행됩니다. 숫자열 `4`로 Gold의 Parry 튜토리얼에 들어갈 수 있습니다. 별도 Windows Gold ZIP에는 제출본의 Windows 실행 파일과 데이터가 포함되어 있습니다. 창의 비율이 Unity 기본값과 다르면 `play.frameWidth`, `play.frameHeight`에 게임 화면과 하단 도구 막대를 포함한 크기를 지정할 수 있습니다.

## 공개 배포와 과제 제출

개인 GitHub 계정의 [포트폴리오 저장소](https://github.com/dku7785/portfolio)에서 관리합니다. 과제 제출 주소는 [공개 포트폴리오](https://dku7785.github.io/portfolio/)입니다.

1. VS Code에서 원본 파일을 수정하고 로컬 미리보기에서 확인합니다.
2. 변경한 파일을 커밋해 저장소의 `main`에 올립니다. 배포 작업은 `dist/`를 자동 생성합니다.
3. 저장소에서 **Actions → Publish portfolio → Run workflow**를 실행합니다. [GitHub Pages 배포 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
4. 실행이 성공하면 공개 주소를 열어 변경 사항을 확인합니다. 두 게임의 Web Build도 포트폴리오와 함께 배포됩니다.

이번 파일 구성은 GitHub Pages를 기준으로 준비했습니다. 현재 Windows ZIP과 풀린 Unity `.wasm` 파일은 각각 Cloudflare Pages의 파일당 25 MiB 제한보다 큽니다. Cloudflare를 선택할 경우 게임이나 다운로드 파일을 별도 호스팅으로 연결해야 합니다. [Cloudflare Pages 파일 제한](https://developers.cloudflare.com/pages/platform/limits/)

[과제 검증표](docs/SUBMISSION-CHECKLIST.md)
