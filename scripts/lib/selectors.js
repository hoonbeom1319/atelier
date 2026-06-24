// 재사용 골격 ③ — 포터블 셀렉터 헬퍼.
//
// 셀렉터는 role/aria/exact-text로(클래스·DOM 구조 X) → 같은 spec이 와이어(3단계)와 hi-fi(6단계) 양쪽에 그대로 돈다.
// 마크업을 갈아엎는 5.5 리디자인 후보도 의미만 지키면 green.
//
//   const { fileUrl } = require('../../scripts/lib/selectors');
//   const url = fileUrl(path.join(__dirname, 'wireframe'));   // url('list.html') → file:// 절대 URL
const { pathToFileURL } = require('url');
const path = require('path');

// 한 디렉터리 기준 file:// URL 생성기. 와이어/스크린 폴더에 하나씩.
function fileUrl(dir) {
  return (f) => pathToFileURL(path.join(dir, f)).href;
}

// ⚠ 넓은 getByText(/단어/)는 strict-mode 위반("resolved to N elements")을 부른다.
// 데모용 상태 토글 버튼과 상태 표시가 같은 단어를 공유하면 거의 항상 터진다.
// → 아래로 좁혀라(이건 spec 결함이지 산출물 버그가 아니다. 빨개지면 산출물 말고 셀렉터를 고친다):
//   page.getByRole('button', { name: '오프라인' })   // 역할로 좁힘
//   page.getByText('오프라인', { exact: true })       // 정확 일치
//   page.locator('#offline')                          // 특정 id
//   scope.getByText(/.../)                             // 스코프 안으로
// 자주 쓰는 좁힘 헬퍼:
const exact = (page, t) => page.getByText(t, { exact: true });           // 정확 텍스트
const btn = (page, name) => page.getByRole('button', { name });          // 버튼(이름 부분일치 정규식 가능)
const link = (page, name) => page.getByRole('link', { name });           // 링크
const within = (scopeLocator, role, name) => scopeLocator.getByRole(role, { name }); // 스코프 안 역할

module.exports = { fileUrl, exact, btn, link, within };
