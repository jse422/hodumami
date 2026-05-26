# 나만의 화장대 — CLAUDE.md

AI 어시스턴트를 위한 코드베이스 가이드입니다. 개발 시 이 문서를 우선적으로 참고하세요.

---

## 프로젝트 개요

**나만의 화장대**는 개인 화장품을 관리하는 모바일 퍼스트 PWA(Progressive Web App)입니다.

- **목적**: 화장품 재고 관리, 유통기한 추적, 카테고리 분류, 위시리스트 관리
- **타겟**: iOS/Android 모바일 웹 브라우저
- **언어**: 한국어 전용 UI

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| 언어 | TypeScript (strict 모드) |
| 백엔드/DB | Supabase (PostgreSQL + Storage) |
| 외부 API | Kakao 이미지 검색 API |
| 배포 형태 | PWA (Web App Manifest 포함) |

---

## 디렉토리 구조

```
hodumami/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 루트 레이아웃 (하단 네비게이션 포함)
│   ├── page.tsx                # 홈 (대시보드 — 전체/곧만료/만료 요약)
│   ├── globals.css             # 전역 스타일
│   ├── manifest.ts             # PWA Web App Manifest
│   ├── products/
│   │   ├── page.tsx            # 제품 목록 (카테고리 필터)
│   │   ├── new/page.tsx        # 새 제품 등록 폼
│   │   └── [id]/
│   │       ├── page.tsx        # 제품 상세
│   │       └── edit/page.tsx   # 제품 수정 폼
│   ├── wishlist/page.tsx       # 위시리스트
│   └── api/
│       └── search-image/route.ts  # Kakao 이미지 검색 API 라우트
├── components/
│   ├── BottomNav.tsx           # 하단 고정 네비게이션 (4탭 + FAB)
│   ├── ProductCard.tsx         # 제품 카드 컴포넌트
│   ├── ProductForm.tsx         # 공유 폼 필드 및 카테고리/스타일 상수
│   ├── ExpiryBadge.tsx         # 유통기한 상태 배지
│   ├── ImagePicker.tsx         # 파일 업로드 + 미리보기
│   └── ImageSearch.tsx         # Kakao 이미지 검색 UI
├── lib/
│   ├── supabase.ts             # Supabase 클라이언트 및 이미지 URL 헬퍼
│   └── utils.ts                # 유통기한 상태 계산, 카테고리 이모지 매핑
├── types/
│   └── product.ts              # Product, Category, ExpiryStatus 타입
├── public/                     # 정적 자산 (SVG 아이콘 등)
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── postcss.config.mjs
```

---

## 데이터 모델

### `Product` 인터페이스 (`types/product.ts`)

```typescript
interface Product {
  id: string           // UUID
  user_id?: string
  name: string         // 필수
  brand: string
  category: Category
  purchase_date?: string   // ISO 날짜 문자열
  opened_date?: string
  expiry_date?: string
  memo?: string
  image_path?: string  // Supabase Storage 경로 또는 외부 URL
  is_wishlist: boolean
  created_at: string
}

type Category = '스킨케어' | '메이크업' | '선케어' | '바디케어' | '헤어케어' | '기타'
type ExpiryStatus = '정상' | '주의' | '위험' | '만료'
```

### Supabase 테이블: `products`

컬럼은 Product 인터페이스와 동일. 이미지는 `product-images` 버킷에 저장.

---

## 핵심 비즈니스 로직

### 유통기한 상태 계산 (`lib/utils.ts`)

```
남은 일수 > 29일  → '정상' (초록)
남은 일수 7~29일 → '주의' (주황)
남은 일수 1~6일  → '위험' (빨강)
남은 일수 <= 0   → '만료' (회색)
expiry_date 없음 → null (배지 미표시)
```

### 이미지 처리 (`lib/supabase.ts`)

- `getImageUrl(imagePath)`: `http`로 시작하면 외부 URL 그대로 반환, 아니면 Supabase Storage 공개 URL 생성
- 버킷명: `product-images`

---

## 환경 변수

개발 시 프로젝트 루트에 `.env.local` 파일을 생성하세요.

```
NEXT_PUBLIC_SUPABASE_URL=...       # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # Supabase 익명 키
KAKAO_REST_API_KEY=...             # Kakao REST API 키 (서버 사이드 전용)
```

`KAKAO_REST_API_KEY`는 `NEXT_PUBLIC_` 접두사 없이 서버에서만 사용합니다 (`app/api/search-image/route.ts`).

---

## 개발 명령어

```bash
npm run dev     # 개발 서버 시작 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버 시작
npm run lint    # ESLint 실행
```

---

## 코딩 컨벤션

### 일반

- **TypeScript strict 모드** 필수 — `any` 사용 금지
- **한국어 UI 텍스트** — 모든 사용자 노출 문자열은 한국어로 작성
- 파일명: `PascalCase` (컴포넌트), `camelCase` (유틸리티, lib)
- 경로 별칭: `@/` → 프로젝트 루트 (`tsconfig.json`에 설정됨)

### 컴포넌트

- 클라이언트 전용 컴포넌트 최상단에 `'use client'` 선언
- Supabase 직접 호출은 클라이언트 컴포넌트 내부 `useEffect`에서 처리
- 현재 전용 서버 컴포넌트는 없음 — 데이터 페칭은 클라이언트에서 수행

### 스타일링

- **Tailwind CSS 4** 사용 — 인라인 CSS 최소화
- 테마 컬러: `#C8A882` (웜 베이지/카멜)
- 배경색: `#FBF9F6`
- 최대 너비: `max-w-lg` (모바일 퍼스트, 중앙 정렬)
- 하단 네비게이션 공간 확보: `pb-24`

### Supabase 쿼리

```typescript
// 표준 패턴
const { data, error } = await supabase.from('products').select('*')
if (error) { /* 처리 */ }
```

오류는 항상 체크하되 `throw` 대신 UI 상태로 처리합니다.

---

## 아키텍처 특이사항

1. **인증 없음**: `user_id` 컬럼이 존재하지만 현재 인증 미구현 — 전체 데이터가 공유됨
2. **테스트 없음**: 테스트 프레임워크 미설정 — 기능 추가 시 수동 확인 필요
3. **CI/CD 없음**: GitHub Actions 미설정
4. **PWA 설정**: `app/manifest.ts` + `layout.tsx`의 `appleWebApp` 메타데이터로 구성

---

## 주요 기능 목록

- [x] 화장품 CRUD (생성/조회/수정/삭제)
- [x] 카테고리 필터링 (6종)
- [x] 유통기한 추적 및 상태 배지
- [x] 위시리스트 토글 (`is_wishlist`)
- [x] 이미지 업로드 (Supabase Storage)
- [x] Kakao 이미지 검색 통합
- [x] PWA (홈 화면 추가 지원)
- [x] 모바일 퍼스트 반응형 UI

---

## 새 기능 추가 시 체크리스트

1. 타입 변경이 필요한 경우 `types/product.ts` 먼저 수정
2. DB 스키마 변경은 Supabase 대시보드에서 직접 진행
3. 새 페이지는 `app/` 하위에 App Router 규칙에 따라 생성
4. 공용 로직은 `lib/utils.ts` 또는 `lib/supabase.ts`에 추가
5. 빌드 오류 확인: `npm run build`
6. 린트 확인: `npm run lint`
