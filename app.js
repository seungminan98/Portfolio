/* ============================================================
   포트폴리오 SPA 라우팅 (의존성 없음, 바닐라 JS)
   - [data-goto="p1"] 등을 클릭하면 해당 페이지로 전환
   - #about / #work / #contact 같은 앵커는 data-goto 가 없으므로
     기본 동작(같은 페이지 내 스크롤)이 그대로 유지된다.
   ============================================================ */
(function () {
  var PAGES = ['home', 'p1', 'p2', 'p3'];

  function show(page) {
    if (PAGES.indexOf(page) < 0) page = 'home';
    PAGES.forEach(function (p) {
      var el = document.getElementById('page-' + p);
      if (el) el.classList.toggle('active', p === page);
    });
    window.scrollTo(0, 0);
    try {
      history.replaceState(null, '', page === 'home' ? location.pathname : '#' + page);
    } catch (e) { /* file:// 등에서 무시 */ }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-goto]') : null;
    if (!t) return;
    e.preventDefault();
    show(t.getAttribute('data-goto'));
  });

  // 새로고침·딥링크(#p1 등) 대응
  var h = (location.hash || '').replace('#', '');
  if (PAGES.indexOf(h) >= 0) show(h);
})();
