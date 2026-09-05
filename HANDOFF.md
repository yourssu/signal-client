# HANDOFF — 모두의 시그널(미팅) 기능

> 이 문서는 다음 작업을 이어받는 에이전트를 위한 것이다. 작업 시작 전 `AGENTS.md`, `.AI.md`와 함께 읽어라.
> 기준: 2026-09-05 / `staging` 브랜치 / 퍼블리싱 완료, API 연결 미착수.

---

## 0. 먼저 할 것

```bash
git fetch origin && git checkout -b <새브랜치> origin/staging
pnpm install
pnpm type-check && pnpm lint && pnpm build   # 모두 통과해야 정상 시작점
```

`§5`의 HIGH 2건부터 처리한다. 백엔드 응답을 기다릴 필요가 없다.

---

## 1. 현재 상태

`staging`에 머지 완료. `main`에는 아직 없다.

| PR | 브랜치 | 내용 |
|---|---|---|
| #13 | `feat/lobby-page` | 로비 페이지, 미팅 타입·훅, MSW 목 |
| #14 | `fix/lobby-avatar-assets` | 아바타 SVG 캔버스 배경 제거 |
| #15 | `feat/meeting-onboarding-funnel` | 폼·리스트 컴포넌트, 생성/참여 퍼널, 라우트 |
| #16 | `feat/meeting-room-status` | 방 상태 시트 3종 |

### 라우트 (모두 `ENABLE_LOBBY` 게이팅, `src/App.tsx`)

```
/lobby                    src/pages/lobby/page.tsx
/lobby/create             src/pages/lobby/create/page.tsx
/lobby/join/:roomId       src/pages/lobby/join/page.tsx
```

### 파일 인벤토리

```
src/types/meeting.ts                     도메인 타입 전체
src/hooks/queries/meetings.ts            훅 6개 (useMeetingBoard만 사용 중)
src/lib/meeting.ts                       SLOT_POSITIONS, formatRemainingTime, getSlotAvatar
src/components/lobby/                    SlotMarker, PartySizeFilterCard, LatestMatchBanner,
                                         MatchChanceChip, ProfileRequiredDialog
src/components/meeting/                  GenderChips, MemberForm, MemberRow,
                                         EmptyMemberSlot, MemberList, InvitationStep
src/components/meeting/status/           RoomWaitingSheet, RoomExpiredSheet,
                                         RoomMatchedSheet, RoomStepper
src/assets/lobby/                        아바타 10종, 지도 배경, 핀 3종, 단계 아이콘 4종 등
src/mocks/handlers.ts                    GET /api/meetings/board 목
```

### 호출부가 없는 코드 (의도된 것)

- `src/components/meeting/status/*` 전부 — `§4` 블로커 때문에 로비에 연결하지 못함
- `useMeetingRoom`, `useMeetingResult`, `useCreateMeetingRoom`, `useMatchMeetingRoom`, `useCancelMeetingRoom` — API 연결 단계에서 사용

---

## 2. 확정된 기능 정책

디자인만으로는 알 수 없어 확인받은 내용이다. **추측하지 말고 이대로 따를 것.**

### 방 생성 (`/lobby/create`)

- **프로필 등록한 유저만** 가능. 미등록 시 `creationEligibility.reason === "PROFILE_REQUIRED"`
- 방장(나)은 `useUser().profile`에서 가져와 "함께할 친구들" **첫 줄에 자동 포함**. `members` 배열에는 넣지 않고 `MemberList`의 `host` prop으로 전달
- **방 정원 = 1(나) + 추가한 친구 수** → 친구 최대 3명, 정원 2~4
- 친구 0명이면 [다음] 비활성
- **연락처 입력 없음.** 방장 연락처는 프로필 것을 사용 (`MeetingRoomCreateRequest`에 `contact` 필드 자체가 없음)
- 나이 라벨 `"출생연도"`, 추가 버튼 `"친구 추가"`
- 2단계 `useFunnel`: `members` → `invitation`

### 방 참여 (`/lobby/join/:roomId`)

- **프로필 없어도 가능** → 자동으로 채워지는 방장 행이 **없다**. `MemberList`에 `host`를 넘기지 말 것
- 정원(`partySize`)만큼 **전원 직접 입력**. 리스트 행 수 = `partySize`
- **첫 입력자가 `representative`**
- **연락처는 첫 입력에서만** 받는다 (`showContact={members.length === 0}`). API가 대표 연락처 하나만 받기 때문
- 나이 라벨 `"나이"`, 추가 버튼 `"추가하기"`
- 단일 화면이라 퍼널 미사용, `useState`로 충분
- 현재 `partySize`는 `?partySize=4` 쿼리에서 읽는 임시 구현 — API 연결 시 방 정보로 교체

### 방 생명주기

- 슬롯 **7개 고정** (`SLOT_1`~`SLOT_7`)
- 방 유지 **1시간**. 디자인의 `13:02`는 예시값 — 반드시 `expiresAt` 기준 계산
- "방 삭제" = `POST /api/meetings/rooms/{roomId}/cancel`
- 일일 생성·참여 횟수 제한 존재

### 연락 보내기 (`RoomMatchedSheet`)

연락처 형식: `^(?:010[2-9]\d{7}|@[a-zA-Z0-9._]{1,30})$`

- **인스타(`@` 시작)**: `https://www.instagram.com/{id}` 를 **`<a>` 태그 href**로. Universal Links/App Links가 앱을 직접 연다
  - `window.open` / `location.href` **금지** — JS 내비게이션은 Universal Link를 깨뜨린다
  - `instagram://` 커스텀 스킴 **금지** — 미설치 시 에러 다이얼로그
- **휴대폰**: `sms:` 링크. `getDeviceType()`(`src/lib/utils.ts`)로 분기
  - iOS: `sms:{번호}&body={본문}`
  - 그 외: `sms:{번호}?body={본문}`
- 표시는 `formatPhone()`(같은 파일)로 `010-4444-3333` 형태, 인스타는 원문

---

## 3. API 계약 요약

`GET https://signal-dev-api.yourssu.com/api-docs` 에서 최신 스펙을 받을 수 있다.
`/v3/api-docs`는 404이므로 `/api-docs`를 쓸 것.

```
GET  /api/meetings/board                  MeetingBoardResponse
GET  /api/meetings/rooms/{roomId}         MeetingRoomDetailResponse
GET  /api/meetings/rooms/{roomId}/result  MeetingResultResponse
POST /api/meetings/rooms                  201 → MeetingRoomResponse (id 포함)
POST /api/meetings/rooms/{roomId}/matches 201 → MeetingMatchResponse
POST /api/meetings/rooms/{roomId}/cancel  204
```

### 에러 코드 (409 위주)

| 엔드포인트 | 코드 |
|---|---|
| `POST /rooms` | `PROFILE_REQUIRED`, `DAILY_CREATION_LIMIT_EXCEEDED`, `DAILY_MEETING_LIMIT_EXCEEDED`, `SLOT_ALREADY_OCCUPIED` |
| `POST /matches` | `SELF_MATCH_NOT_ALLOWED`, `DAILY_MEETING_LIMIT_EXCEEDED`, `ACTIVE_ROOM_EXISTS`, `ROOM_ALREADY_MATCHED`, `ROOM_CANCELLED`, `ROOM_EXPIRED` |
| `POST /cancel` | 403 `MEETING_ROOM_CANCEL_FORBIDDEN`, 409 위 3종 |
| `GET /result` | 403 `MEETING_RESULT_FORBIDDEN` |

### 아직 반영되지 않은 것

`ErrorResponse`에 `code` 필드가 스펙에 추가됐으나 **프론트 타입에는 없다.**

- `src/types/common.ts`의 `ErrorResponse`에 `code?: string` 추가 필요
- `src/lib/error.ts`의 `SignalError`가 `code`를 보관하도록 수정 필요
- 생성자 시그니처가 바뀌므로 `src/lib/fetch.ts`의 **호출부 2곳**도 함께 수정

이게 없으면 409를 받아도 `PROFILE_REQUIRED`인지 `DAILY_*`인지 구분할 수 없다.

### 실제 응답과 스펙의 차이

스펙은 "방 또는 최신 매칭이 없으면 필드가 **생략**된다"고 하지만, 실측하면 `room: null` / `latestMatch: null`로 **키가 존재하고 값이 null**이다. 현재 타입이 `?: T | null`이라 양쪽을 흡수한다. **그대로 둘 것.**

---

## 4. 백엔드 요청 — 진행 전 필요

### (블로커) 보드 응답에 내 방 정보

상태 시트를 로비에 연결하려면 "내가 지금 어떤 방에 엮여 있는가"를 알아야 하는데 `GET /api/meetings/board`에 그 정보가 없다.

`POST /rooms`가 `id`를 돌려주므로 **생성 직후에는 안다.** 하지만 새로고침·기기 변경·저장소 삭제 시 잃는다. 방은 1시간 살아 있으므로 **잃어버린 방이 7개 슬롯 중 하나를 끝까지 점유**한다.

서버는 이미 안다 — `ACTIVE_ROOM_EXISTS`를 판정하기 때문이다. 조회 수단만 없다.

```jsonc
// 요청 형태
"myRoom": {
  "roomId":    12,
  "status":    "OPEN",      // OPEN | MATCHED | CANCELLED | EXPIRED
  "teamSide":  "CREATOR",   // CREATOR | APPLICANT
  "expiresAt": "2026-09-05T14:00:00+09:00"
} // 없으면 null
```

`teamSide`로 화면이 갈린다 — `CREATOR`는 "방 삭제"가 있는 `RoomWaitingSheet`, `APPLICANT`는 `RoomMatchedSheet`.

**임시 대응**: roomId를 jotai `atomWithStorage`로 보관 (`src/atoms/authTokens.ts`와 같은 패턴). 단 이는 캐시일 뿐 위 문제를 해결하지 못한다.

### (권장) 참여 자격의 선제 판정

`creationEligibility`는 생성 자격만 본다. `SELF_MATCH_NOT_ALLOWED`, `ACTIVE_ROOM_EXISTS`, `DAILY_MEETING_LIMIT_EXCEEDED`는 전부 POST 409를 받아야 안다.
→ 사용자가 참여 인원 3~4명을 다 입력한 뒤에야 거부당한다. `participationEligibility`를 생성 쪽과 대칭으로 요청 중.

### 확인 필요

- `SLOT_ALREADY_OCCUPIED`는 선제 판정이 원리적으로 불가능(5초 폴링 간극). 입력한 인원 정보를 유지한 채 다른 슬롯 재시도를 허용할지 정책 확인
- `creatorAnimal`은 "방 생성 당시" 스냅샷인지 확인
- **연락처 포맷이 `@`로 시작하는 형태로 보장되는지** — `§5`의 LOW 항목 참조

---

## 5. 코드 리뷰 지적 사항

`tsc`·`eslint`는 통과하지만 아래는 런타임 문제다. **HIGH 2건은 다음 작업의 시작점.**

### [HIGH] 슬롯 위치를 배열 인덱스로 매핑 — `src/pages/lobby/page.tsx:56`

```tsx
// 현재 (문제)
board?.slots.slice(0, SLOT_POSITIONS.length).map((slotItem, i) => (
  <SlotMarker position={SLOT_POSITIONS[i]} ... />
))
```

응답이 `slot: "SLOT_1"…"SLOT_7"` 식별자를 이미 들고 있는데 무시하고 배열 순서에 의존한다. 백엔드가 정렬 순서를 바꾸거나(예: 생성 시각순), 방이 있는 슬롯만 내려주거나, 하나라도 누락하면 **핀이 엉뚱한 좌표에 찍히고 빈 슬롯이 렌더되지 않아 방 생성 자체가 불가능해진다.**

수정: `src/lib/meeting.ts`의 `SLOT_POSITIONS`를 배열 → `Record<MeetingSlot, SlotPosition>`으로 바꾸고 `SLOT_POSITIONS[slotItem.slot]`으로 조회. 좌표값 자체는 그대로 유지할 것(`§7` 참조).

### [HIGH] 핀 클릭이 대부분 무반응 — `src/pages/lobby/page.tsx:27`

```tsx
// 현재 (문제)
if (!slotItem.room && board?.creationEligibility.reason === "PROFILE_REQUIRED") {
  setProfileDialogOpen(true);
}
```

처리되지 않는 경우 3가지 — 모두 조용히 아무 일도 안 일어난다.

1. **빈 슬롯 + `canCreate: true`** → `/lobby/create`로 이동해야 함. MSW 목이 `canCreate: true`를 주므로 **로컬에서는 핀을 눌러도 반응이 전혀 없다**
2. `DAILY_CREATION_LIMIT_EXCEEDED` / `DAILY_MEETING_LIMIT_EXCEEDED` → 사유 안내 필요. 디자인이 없으므로 토스트 권장
3. 방이 있는 슬롯 → `/lobby/join/{roomId}`로 이동해야 함

### [MEDIUM] 인증 가드 없이 5초 폴링 — `src/pages/lobby/page.tsx:19`

`/lobby`는 `ENABLE_LOBBY`만 검사하는데 `useMeetingBoard`는 `authedFetch` + `refetchInterval: 5000`이다. refresh가 일시적으로 실패하면 `src/lib/fetch.ts:134`가 `clearTokensAtom`을 호출하므로, **5초 폴링이 이 경로를 계속 두드려 순간적 네트워크 장애로 세션이 날아갈 확률을 키운다.**

수정: `enabled`로 토큰 유무를 가드하고 `isError` 분기 추가.

### [MEDIUM] 인원 필터가 적용되지 않음 — `src/pages/lobby/page.tsx:89`

`partySize` 상태가 저장만 되고 `slots` 필터링에 쓰이지 않는다. 카드 문구는 "참여 가능한 방을 빠르게 보여드려요!"라고 약속한다. **의도된 미구현이지만 사용자에게는 고장으로 보인다.**

### [LOW] 기타

| 위치 | 내용 |
|---|---|
| `lobby/page.tsx:88` | `latestMatch.visibleUntil` 미검사. 백그라운드 탭에서 폴링이 멈추면 만료된 매칭이 계속 표시됨 |
| `lib/meeting.ts:37` | `formatRemainingTime`이 렌더 시점에만 계산 → 폴링이 멈추면 카운트가 얼어붙음. `Math.ceil`이라 1초 남아도 "1분 남음" |
| `components/lobby/SlotMarker.tsx:54` | "마감"된 방도 동일하게 클릭 가능한 버튼으로 렌더 |
| `status/RoomWaitingSheet.tsx:41` | 0 도달 후에도 인터벌이 계속 돎. `onExpire` 콜백이 없어 소멸 시트로 전환 불가 |
| `status/RoomMatchedSheet.tsx:28` | 인스타 판별이 `@` 접두사에만 의존. 같은 레포 mock(`src/mocks/handlers.ts:259,276`)은 `https://instagram.com/example1` 형태로 저장 → `sms:https://…` 라는 동작하지 않는 URI 생성 |
| `lobby/ProfileRequiredDialog.tsx:37` | "취소"가 주 CTA 스타일, 실제 CTA인 "프로필 등록하기"가 보조 스타일. 디자인 원본이 그러하나 의도 확인 필요 |
| `lobby/ProfileRequiredDialog.tsx:45` | `ENABLE_REGISTER`가 off면 `/profile/register`가 홈으로 리다이렉트되어 조용히 실패 |
| `PartySizeFilterCard.tsx:14` | `null`이 "미선택"과 "미정"을 겸함. 초기값도 `null`이라 첫 렌더에서 "미정"이 선택돼 보임 |

---

## 6. 다음 작업 순서

1. **HIGH 2건 수정** — 백엔드 대기 없이 즉시 가능
2. **`ErrorResponse.code` 배선** — `types/common.ts`, `lib/error.ts`, `lib/fetch.ts` 2곳
3. **백엔드 `myRoom` 수령** — `§4`
4. **API 연결** — 생성/참여 퍼널의 TODO를 `useCreateMeetingRoom` / `useMatchMeetingRoom`으로 교체, 409 코드별 처리
5. **상태 시트 연결** — `myRoom.status` + `teamSide`로 3종 분기. 로비 하단에서 `PartySizeFilterCard`와 자리를 교대
6. **QA** — `§8`

---

## 7. 건드리면 안 되는 것

### 반응형 좌표계 (`src/pages/lobby/page.tsx`)

지도는 하단 카드 블록에 앵커되어 있다.

```
inset-x-[-1.615%]  bottom-[103px]  aspect-[387.113/960.766]  translate-y-[38.602%]
```

`103` = 마커 높이 93 + 디자인 여백 10. `38.602%`는 마지막 마커 행이 맵 높이의 61.398% 지점이라는 데서 나온다. translate 퍼센트가 **자기 높이 기준**이라는 성질을 이용해, 마지막 마커와 카드 간격이 뷰포트와 무관하게 10px로 고정된다. 375×810에서 맵 상단이 디자인 원본값 `-130.9`와 정확히 일치한다.

iPhone SE(375×667, 320×568)부터 `max-w-md`(448px)까지 검증됨. **수치를 바꾸지 말 것.**

`SLOT_POSITIONS`의 퍼센트 좌표도 이 좌표계 기준이다. `§5`의 HIGH 수정 시 **자료구조만 바꾸고 값은 유지**할 것.

### 로비와 무관한 워킹트리 변경 5개

```
public/mockServiceWorker.js
src/components/register/RegisterDoneStep.tsx
src/pages/my/analysis/page.tsx
src/pages/profile/contact/page.tsx
src/pages/profile/register/page.tsx
```

뒤 4개는 순수 Prettier 재포맷이다. 모든 커밋에서 의도적으로 제외했다. **커밋에 쓸어 담지 말 것.** 별도 포맷팅 PR로 올리거나 `git restore`할 것.

---

## 8. 검증

```bash
pnpm type-check && pnpm lint && pnpm build

# MSW 목으로 실행 (.env.local에 dev API가 잡혀 있어 평소엔 MSW가 꺼짐)
VITE_API_BASE_URL= pnpm dev
```

`.env.local`에 `VITE_ENABLE_LOBBY=true`가 이미 있다(gitignore 대상).

확인 경로:

```
/lobby                          슬롯 7개, 방 5개 참 / 빈 슬롯 2개
/lobby/create                   친구 0명 [다음] 비활성 → 1명 활성 → 3명이면 폼 비활성
/lobby/join/1?partySize=4       첫 입력에만 연락처 노출, 정원 채우면 [다음] 활성
```

**반응형이 가장 취약한 지점.** devtools 기기 프리셋으로 iPhone SE(375×667), iPhone SE 1세대(320×568), 448px에서 마지막 마커와 하단 카드가 겹치지 않는지 확인.

MSW 목에서 `latestMatch`를 제거해 배너가 빠졌을 때도 간격이 자동으로 맞는지 확인할 것 — 하단 앵커 방식의 핵심 이점이다.

---

## 9. 프로젝트 규칙 (요약)

전체는 `AGENTS.md`, `.AI.md` 참조. 이번 작업에서 특히 걸리는 것:

- **Claude 표기를 어디에도 넣지 않는다.** 커밋의 `Co-Authored-By: Claude` / `Claude-Session` 트레일러, PR 본문의 `🤖 Generated with Claude Code` 배지와 세션 링크 모두. 2026-09-05부터 적용
  - PR #13~#17의 **본문**은 정리 완료. 다만 #13~#16의 **커밋 메시지**에는 트레일러가 남아 있다 — 이미 `staging`에 머지되어 히스토리 재작성이 필요하므로 소급하지 않는다
- **불필요한 주석 금지.** 코드가 설명하지 못하는 것만
- **테스트 파일 만들지 않는다** — 테스트 프레임워크 미설정
- `fetch()` 직접 호출 금지 → `authedFetch`
- MSW 재초기화 금지 (`main.tsx`에서 자동 시작)
- `.AI.md`는 권고이지 법령이 아니다. 근거 있는 이탈은 허용되며 해명 주석도 불필요
- 색상은 `src/index.css` 토큰 사용. 새 입력 컴포넌트를 만들기 전에 `src/components/ui/form-field.tsx` 확인 — 디자인 TextField와 규격이 동일하다

### Figma 에셋을 가져올 때 (실수 사례)

`download_assets`의 반환값 3종 중 무엇을 쓰느냐가 중요하다.

| 반환값 | 결과 |
|---|---|
| `export` | 노드를 캔버스에 **보이는 그대로** 렌더 → **Figma 캔버스 배경(`#4B4B4B`)까지 포함**됨 |
| `svgAssets` | 내부 벡터만 → 배경 원이 빠진 글리프만 나옴 |

아바타 10종을 `export`로 받아 검은 배경이 딸려온 적이 있다(PR #14에서 수정). 배경 원까지 포함된 온전한 컴포넌트가 필요하면 **`get_design_context`가 주는 컨테이너 URL**을 쓸 것.

`download_assets`는 파일을 저장하지 않는다. 짧은 수명의 URL만 반환하므로 직접 `curl`로 받아 `src/assets/<도메인>/`에 넣는다.

---

## 10. 미확정 사항

- **참여 퍼널 연락처의 소유 단위** — API는 요청당 하나만 받으니 팀 단위인데, 디자인상 첫 사람의 폼 안에 있어 개인 정보처럼 보인다. 현재는 "첫 입력 때 받고 팀이 빌 때까지 유지"로 구현
- **일일 제한 2종의 UI** — 디자인이 없어 현재 no-op
- **"매칭 기회 N회" 칩의 데이터 출처** — `MeetingBoardResponse`에 필드가 없어 `count={1}` 하드코딩. 컴포넌트는 prop을 받으므로 필드가 생기면 교체만 하면 됨
- **마커 컴포넌트 세트의 세 번째 변형** — 분홍 테두리 + "가능" 배지. 인원 필터로 걸러낸 "참여 가능한 방" 강조용으로 추정. 미구현
- **Wolf 3D 아이콘** — `AnimalType`에 `WOLF`를 넣으면서 `animalImageMap`·`genderedAnimalImageMap`에 로비용 2D SVG를 임시 연결해 둠(`src/assets/animals/wolf.svg`). 시그널 v6. 파일의 `wolf, large`로 교체 필요. 별도 PR
