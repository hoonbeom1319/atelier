# 요기조기 와이어프레임 빌드킷 (모든 빌더가 따른다)

lo-fi(저충실도) 와이어다. **색·브랜드 없음, 회색 박스·점선 테두리·플레이스홀더.** 진짜 `<a href>` 링크 + 실재하는 상태 변화(인라인 JS 허용) + 죽은 컨트롤 0.

## 파일 규약
- 위치: `projects/yogi-jogi/wireframe/<id>.html` (플랫, 같은 폴더). cross-link은 같은 폴더 파일명(`map-home.html` 등, `../` 없음).
- 첫 줄 마커: `<!-- @dsCard group="Wireframe" -->`
- 외부 의존성 0. 단일 HTML. 뷰포트 390px.

## 화면 파일명 (정확히 이 이름들 — 오타 금지)
auth.html · onboarding.html · follow-seed.html · map-home.html · feed.html · upload-1-gallery.html · upload-2-classify.html · upload-3-manual.html · upload-4-meta.html · search.html · profile-me.html · profile-friend.html · post-detail.html · notifications.html · settings.html · index.html

## 공유 CSS (각 파일 `<head>`에 그대로 붙여라)
```html
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,'Segoe UI',sans-serif}
body{width:390px;min-height:844px;margin:0 auto;background:#fff;color:#222;position:relative;padding-bottom:72px}
.appbar{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border-bottom:1px solid #ccc;position:sticky;top:0;background:#fff;z-index:5}
.title{font-weight:700;font-size:17px}
.icons a{margin-left:10px;text-decoration:none;color:#444;font-size:13px;border:1px solid #bbb;border-radius:6px;padding:5px 8px}
.tabbar{position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:390px;height:64px;display:flex;align-items:center;justify-content:space-around;border-top:1px solid #ccc;background:#fff;z-index:6}
.tabbar a{text-decoration:none;color:#555;font-size:13px;border:1px dashed #bbb;border-radius:6px;padding:7px 14px}
.tabbar a.fab{background:#222;color:#fff;border-style:solid;font-size:22px;border-radius:50%;width:50px;height:50px;display:flex;align-items:center;justify-content:center;padding:0}
.tabbar a[aria-current="page"]{font-weight:700;border-style:solid;color:#111;background:#eee}
.box{border:1px dashed #999;border-radius:8px;padding:12px;margin:10px 14px;color:#555}
.ph{background:#e8e8e8;border:1px solid #ccc;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#888;min-height:60px}
.btn{font:inherit;border:1px solid #888;background:#f3f3f3;border-radius:8px;padding:10px 14px;cursor:pointer;display:inline-block;text-decoration:none;color:#222}
.btn.primary{background:#333;color:#fff;border-color:#333}
.seg{display:flex;border:1px solid #999;border-radius:8px;overflow:hidden;margin:10px 14px}
.seg button{flex:1;border:0;border-right:1px solid #ccc;background:#fff;padding:10px;cursor:pointer}
.seg button[aria-selected="true"]{background:#333;color:#fff;font-weight:700}
.oos{color:#aaa;font-size:12px;border:1px dotted #bbb;border-radius:5px;padding:2px 6px}
.chip{display:inline-block;border:1px solid #999;border-radius:14px;padding:4px 10px;margin:3px;font-size:13px}
.badge{display:inline-block;background:#333;color:#fff;border-radius:10px;padding:1px 7px;font-size:12px}
.sheet{position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:390px;background:#fff;border-top:2px solid #888;border-radius:14px 14px 0 0;padding:14px;box-shadow:0 -2px 8px rgba(0,0,0,.15);z-index:8}
.hidden{display:none}
</style>
```

## 셸 (셸 화면 = map-home·feed·search·profile-me·profile-friend·notifications에 사용; 업로드/온보딩/인증은 풀스크린이라 탭바 없음)
상단 앱바:
```html
<div class="appbar">
  <a class="title" href="search.html" style="text-decoration:none;color:inherit">🔍 <span>화면제목</span></a>
  <div class="icons"><a href="notifications.html">🔔</a><a href="profile-me.html">👤</a></div>
</div>
```
하단 탭바(현재 화면 탭에 `aria-current="page"`):
```html
<nav class="tabbar" aria-label="주요 내비게이션">
  <a href="map-home.html">🗺 지도</a>
  <a class="fab" href="upload-1-gallery.html" aria-label="새 게시물 업로드">＋</a>
  <a href="feed.html">📋 피드</a>
</nav>
```

## 절대 규칙 (검증 대상)
1. **죽은 컨트롤 0** — 모든 클릭 가능 요소는 (a) 실제 href로 다른 와이어로 가거나, (b) 인라인 JS로 *눈에 보이는* 상태를 바꾸거나, (c) `<span class="oos">[범위 밖]</span>` 라벨이 붙는다. 빈 `<button>`/`href="#"` 무동작 금지.
2. **상태 변화 실재** — 각 화면 §C가 명시한 "상태(필수)"를 인라인 JS로 진짜 토글한다(클래스 hidden 토글·텍스트 변경·aria 속성 변경). 누르면 *반드시* 화면이 변해야 한다(stateInert 금지).
3. **셀렉터 친화** — 버튼은 의미있는 텍스트, 탭/세그먼트는 `aria-selected`, 활성 내비는 `aria-current`, 토글은 `aria-pressed`. 검증이 role·text·aria로 잡는다.
4. **빈 상태 포함** — 화면에 빈 상태가 있으면 토글 버튼으로 빈↔채움을 둘 다 보여준다(예: "데모: 빈 상태 보기").
5. lo-fi라 색 없음 — 회색/점선만. 사진은 `.ph`(회색 박스 "사진"). 지도는 `.ph`로 큰 박스 "지도 영역".
