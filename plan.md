# 11주차 실습 계획 — Type-Safe Task Manager

SH327 고급웹프로그래밍 11주차 (React & TypeScript) 실습을 Step 1~5 순서로 진행하고, Netlify 배포 URL을 LMS에 제출한다.

## 현재 상태

- 저장소 `web-pr`: 커밋 없는 빈 저장소 (origin: `KimJongHyun2/web-pr`)
- Node v22.20.0 / npm 10.9.3 — Vite 최신 버전 요구사항 충족

## 결정 사항 (기본값)

| 항목 | 결정 | 이유 |
|---|---|---|
| 프로젝트 위치 | `web-pr/task-manager/` | 강의자료의 폴더명 그대로 사용 |
| 폴더 구조 | `src/types/task.ts`, `src/components/TaskItem.tsx`, `src/App.tsx` | 강의자료가 지정한 3개 파일, 역할별로만 분리 |
| 상태 관리 | `useState`만 사용 | 강의 제약조건 (라이브러리 금지) |
| 스타일 | `App.css`에 최소한의 CSS | 채점 대상은 기능과 타입, 과한 디자인 불필요 |
| 배포 | Netlify 드래그 & 드롭 | 강의자료 지정 방식 |

## 최종 파일 구조

```
task-manager/
└─ src/
   ├─ types/task.ts            # Task 인터페이스
   ├─ components/TaskItem.tsx  # 개별 Task 출력 + TaskItemProps
   ├─ App.tsx                  # 상태, 핸들러, 검증, 통계, 목록
   └─ App.css                  # 최소 스타일
```

## Step 1 — 프로젝트 생성

```powershell
npm create vite@latest task-manager -- --template react-ts
cd task-manager
npm install
npm run dev
```

- 강의자료의 `----template`은 오타. 올바른 형태는 `-- --template` (띄어쓰기 필요).
- PowerShell에서 `--`가 제대로 전달되지 않으면 `npx create-vite@latest task-manager --template react-ts`로 대체.
- 생성 중 추가 질문이 나오면 기본값 선택.
- 템플릿의 기본 데모 코드(카운터, 로고, `App.css` 내용)는 Step 2에서 제거.

**완료 기준:** `npm run dev` 실행 후 브라우저에서 Vite 기본 화면 확인.

## Step 2 — 뼈대 잡기 (읽기 전용 목록)

- `task.ts`: `Task` 인터페이스 정의 (`id: number`, `title: string`, `completed: boolean`)
- `TaskItem.tsx`: `TaskItemProps { task: Task }` 정의, Task 하나 출력
- `App.tsx`: 샘플 Task 3개를 `Task[]` 타입 상수로 선언하고 `map`으로 `TaskItem` 렌더링 (`key={task.id}`)

주의: Vite 템플릿은 `verbatimModuleSyntax`가 켜져 있어 타입은 `import type { Task } from ...`로 가져와야 빌드 오류가 나지 않는다.

**완료 기준:** 샘플 3개가 화면에 출력되고, 추가/삭제/수정 기능은 없음.

## Step 3 — 상태 관리 & 이벤트 처리 (추가 기능)

- 샘플 배열을 `useState<Task[]>`로, 입력값을 `useState<string>`으로 전환
- 입력창 + "추가" 버튼
- `handleChange(e: React.ChangeEvent<HTMLInputElement>): void`
- `addTask(title: string): void` — `id: Date.now()`, `completed: false`, `[...tasks, newTask]`로 갱신 후 입력창 초기화

**완료 기준:** 입력 후 "추가"를 누르면 목록 맨 아래에 추가되고 입력창이 비워짐.

## Step 4 — CRUD & Validation (직접 작성하는 프롬프트)

이 단계는 프롬프트를 직접 작성하는 것이 과제다. 아래 초안을 사용한다.

### 프롬프트 초안

```
앞서 만든 React + TypeScript Task Manager에 삭제, 완료 상태 변경, 입력값 검증, 통계 기능을 추가해줘.

# Task 삭제
- 각 Task 옆에 "삭제" 버튼 생성
- deleteTask(id: number): void 함수로 구현
- filter를 사용해 해당 id를 제외한 새 배열로 갱신

# 완료 상태 변경
- 각 Task에 체크박스 생성, 클릭 시 completed 값 반전
- toggleTask(id: number): void 함수로 구현
- map과 Spread Syntax({ ...task, completed: !task.completed })로 새 객체 생성
- 완료된 Task는 제목에 취소선 표시

# Validation
- validateTitle(title: string): string | null 함수로 분리 (오류 메시지 또는 null 반환)
- 공백만 입력한 경우 추가하지 않음 (trim 후 검사)
- 50자를 초과하면 추가하지 않음
- 이미 같은 제목의 Task가 있으면 추가하지 않음
- 오류 메시지는 useState<string>으로 관리하고 입력창 아래에 표시
- 정상 추가되거나 입력값이 바뀌면 오류 메시지 제거

# 통계
- 전체 Task 개수와 완료된 Task 개수 표시
- 별도 state를 만들지 말고 tasks 배열에서 계산

# Props
- TaskItemProps에 onDelete: (id: number) => void, onToggle: (id: number) => void 추가

# Type Safety
- 기존 Task 인터페이스는 수정하지 않고 그대로 사용
- 모든 함수의 매개변수와 반환 타입 명시
- any 타입 사용 금지
- 상태는 직접 수정하지 않고 Spread Syntax로 불변 갱신 (push, splice, 직접 대입 금지)

# 제약조건
- 기존 Step 2, 3의 기능과 컴포넌트 구조 유지
- 외부 라이브러리 사용하지 않음
- 초보자가 이해할 수 있도록 간결하게 작성
```

### 기본 제약조건 대응표

| 강의자료 제약조건 | 구현 |
|---|---|
| 삭제 기능 | `deleteTask(id: number): void` + `filter` |
| 완료 상태 변경 | `toggleTask(id: number): void` + `map` + `{ ...task }` |
| 입력값 검증 | `validateTitle(title: string): string \| null` (공백 / 길이 / 중복) |
| 전체 · 완료 개수 통계 | `tasks.length`, `tasks.filter(t => t.completed).length` |
| Task 인터페이스 유지, 타입 명시 | `task.ts` 변경 없음, 모든 함수 시그니처에 타입 표기 |
| `any` 금지 | 코드 전체 검색으로 확인 |
| Spread로 불변 갱신 | `[...tasks, newTask]`, `{ ...task, completed: !task.completed }` |

### 정적 타입 검사 확인

과제 문구에 "TypeScript의 정적 타입 검사를 확인"이 있으므로, 일부러 오류를 만들어 컴파일 단계에서 잡히는지 본 뒤 되돌린다.

1. `<TaskItem>`에서 `onDelete` prop 누락 → 필수 Props 누락 오류
2. `deleteTask("1")` 호출 → `string`을 `number`에 넣을 수 없다는 오류
3. 새 Task 객체에서 `completed` 누락 → `Task` 타입 불일치 오류

**완료 기준:** 추가 · 삭제 · 완료 토글 · 검증 메시지 · 통계가 모두 동작하고, 위 3가지 오류가 에디터와 `npm run build`에서 확인됨.

## Step 5 — 배포

1. `npm run build` → `task-manager/dist/` 생성 (`tsc -b`가 먼저 실행되어 타입 오류가 있으면 빌드 실패)
2. `npm run preview`로 빌드 결과를 로컬에서 먼저 확인
3. Netlify 로그인 (GitHub 또는 Google 계정) — **직접 수행**
4. Dashboard → Add new project → `dist` 폴더를 드래그 & 드롭 — **직접 수행**
5. 배포 URL에서 추가 / 삭제 / 완료 토글 동작 확인
6. 배포 URL을 LMS에 제출 — **직접 수행**

`dist` 폴더 안의 파일이 아니라 `dist` 폴더 자체를 올린다.

## 최종 점검

- [x] `npm run build` 오류 없음
- [x] `npm run lint` 오류 없음
- [x] `src/` 안에 `any` 없음
- [x] 상태를 직접 변경하는 코드(`push`, `splice`, 직접 대입) 없음
- [x] 모든 함수에 매개변수 · 반환 타입 표기
- [x] 공백 / 50자 초과 / 중복 입력 시 오류 메시지 표시
- [x] 통계가 추가 · 삭제 · 토글 직후 바로 갱신됨
- [ ] 배포 URL에서 동일하게 동작
- [ ] LMS 제출

## 진행 방식

- Step마다 동작을 확인한 뒤 다음 Step으로 넘어간다.
- Step 단위로 커밋하면 단계별 변화가 기록으로 남는다 (선택).
- Netlify 로그인, 업로드, LMS 제출은 계정이 필요하므로 직접 수행한다. 그 전 단계인 빌드와 로컬 확인까지는 Claude가 진행할 수 있다.
