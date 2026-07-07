# 안승민 포트폴리오 — 프론트(Netlify)

정적 셸 1장. **내용(4개 프로젝트)은 이 파일에 없다.** 비번 통과 후
백엔드(Novile FastAPI)가 토큰을 검사하고 내려준다 → 공개 정적 파일을
다운로드해도 내용이 노출되지 않는다.

## 보안 모델
- 정적 파일(index.html)에는 게이트 UI만 있음. 소스보기/다운로드해도 빈 껍데기.
- 비밀번호·API키·프로젝트 내용은 전부 백엔드 서버(env/코드)에만 존재.
- 백엔드 URL이 JS에 보이는 것은 정상이며 위험하지 않음(공개 웹서비스는 주소가 공개됨).
  보호는 "URL 숨기기"가 아니라 "민감정보를 클라이언트에 두지 않기"로 달성.

## 흐름
1. 방문 시 `POST /visit` 로 접속 기록(미로그인).
2. 비번 입력 → `POST /unlock` → 성공 시 scope=portfolio JWT 발급.
3. 토큰으로 `GET /content` 호출 → 4개 프로젝트 내용 수신 → 화면 렌더.
4. 소방(firecheck)만 실제 동작 기능. 도면 검토 실행은 다음 배포 단계에서 연결.

## 배포 — 프론트(Netlify)
- 이 폴더(`portfolio_site`)를 Netlify에 올린다(드래그드롭 또는 Git 연동, Publish directory = 이 폴더).
- `index.html` 상단 `BACKEND_URL` 은 이미 `https://novile.onrender.com` 로 설정됨.
- GitHub 은 이 Netlify 주소로 링크만 걸어두면 됨(코드/내용은 안 올려도 무방).

## 배포 — 백엔드(Novile FastAPI / Render)
필수 환경변수:
- `DATABASE_URL` = Supabase Postgres, **반드시 `postgresql+asyncpg://` 로 시작** (미설정 시 앱 부팅 실패)
- `PORTFOLIO_PASSWORD` = 자소서 비밀번호
- `ALLOWED_ORIGINS` = 배포된 **Netlify 주소**(예: `https://안승민포폴.netlify.app`) 포함, 쉼표 구분
- `ENVIRONMENT` = production / `JWT_SECRET_KEY` = 랜덤 / `RUN_SCHEDULER` = false
- (다음 단계) `ANTHROPIC_API_KEY` = 소방 에이전트 도면검토용

## API (prefix `/api/v1/portfolio`)
- `POST /unlock`  `{password}` → `{ok, token}`
- `GET  /content` (Bearer 토큰 필요) → 4개 프로젝트 내용
- `POST /visit`   `{page, path, referrer, unlocked}` → 방문 1건 적재
- `GET  /stats`   (Bearer 토큰 필요) → 방문 집계

## 다음 단계
- FireCheck `review`(Django) → FastAPI 이관: 토큰 보호된 도면 업로드·SSE 검토 엔드포인트.
- 프론트 "도면 검토 실행하기" 버튼을 그 엔드포인트에 연결.
