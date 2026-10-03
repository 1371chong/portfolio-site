# JWB STUDIO 포트폴리오 사이트

JWB STUDIO의 포트폴리오와 공지사항을 소개하는 정적 웹사이트입니다. 화면은 HTML·CSS·JavaScript로 제공하고, 작품·공지 데이터와 관리자 로그인은 Supabase를 사용합니다. 작품 미디어와 공지 첨부파일은 Google Drive에 저장합니다.

## 주요 기능

- 포트폴리오 등록·수정·삭제, 공개 또는 임시저장
- 포트폴리오 한국어 카테고리 필터, 키워드 검색, 상세 보기와 공유 링크
- 작품별 쉼표 구분 태그(최대 10개), 태그 검색 및 상세·카드 표시
- 작품 상세 조회수 집계 및 관리자 목록 조회수 표시
- 관리자 대시보드: 작품·공지 수, 공개 작품, 누적 조회수, 예약 공지, 인기 작품 요약
- 관리자에서 경력·학력·교육 이력 등록·수정·삭제 및 공개 여부·순서 관리
- 썸네일 이미지(Google Drive, JPG/PNG/WebP, 파일당 최대 20MB)와 작품 영상(Google Drive, MP4/WebM, 파일당 최대 100MB) 업로드
- 공지 카테고리, 예약 게시, 미리보기, 수정·삭제
- 공지 첨부파일(Google Drive, PDF·이미지·텍스트·Office 문서, 파일당 최대 20MB, 공지당 최대 5개)
- 크몽 중심의 외주 서비스 안내, 서비스 링크·가격·예상 기간 설정
- 이용약관, 개인정보 처리방침, 이용자 권리 헌장, 이메일 무단 수집 거부 페이지
- 모바일 메뉴, 검색엔진 메타데이터, `robots.txt`, `sitemap.xml`

예약 공지는 정한 게시 시각부터 공개됩니다. 백그라운드 예약 작업은 필요하지 않습니다. 게시 예정 시각이 지난 공지는 방문자가 페이지를 새로 열거나 새로고침할 때 표시됩니다.

## 폴더와 주요 파일

| 경로 | 용도 |
|---|---|
| `index.html` | 메인 페이지, 포트폴리오와 공지사항 |
| `outsourcing.html` | 외주 서비스 안내와 크몽 연결 |
| `admin-login.html` | 관리자 로그인 |
| `admin.html` | 포트폴리오·공지 관리 및 기존 문의 기록 확인 |
| `js/supabase-config.js` | Supabase 프로젝트 URL과 공개 키 |
| `js/contact-config.js` | 크몽·이메일·카카오 링크와 가격·기간 |
| `js/portfolio.js` | 포트폴리오 로딩, 상세 화면, 조회수 호출 |
| `js/notices.js` | 공개 공지와 첨부 링크 표시 |
| `js/profile.js` | Supabase에서 공개 프로필 이력 불러오기 |
| `supabase-setup.sql` | 테이블·권한·Storage·프로필 이력·포트폴리오 태그·예약 게시·조회수 함수 설정 |
| `supabase/functions/drive-upload/` | 관리자 전용 Google Drive 업로드 Edge Function |
| `privacy.html`, `terms.html` 등 | 정책 및 권리 안내 페이지 |
| `PDF/` | 공개 다운로드 가능한 이력서 파일 |

## 준비물

- HTTPS를 지원하는 정적 웹 호스팅과 공개 사이트 주소
- Supabase 프로젝트
- 관리자용 이메일과 비밀번호
- 포트폴리오 및 공지 파일 업로드를 사용하는 경우 Google Cloud 프로젝트와 Google Drive
- `drive-upload`를 배포하려면 Supabase CLI

별도의 빌드 명령이나 패키지 설치는 필요하지 않습니다. 웹사이트 루트 폴더를 그대로 호스팅에 올립니다.

## 1. Supabase 설정

### 프로젝트와 데이터베이스

1. Supabase 대시보드에서 프로젝트를 생성합니다.
2. 프로젝트의 **SQL Editor**에서 이 폴더의 `supabase-setup.sql` 전체 내용을 실행합니다. 이 스크립트는 필요한 테이블, RLS 권한, Storage 버킷, 경력·학력·교육 이력 테이블과 초기 프로필 항목, 포트폴리오 태그 열, 예약 게시 열과 조회수 증가 함수를 설정합니다. 재실행할 수 있도록 작성되어 있습니다.
3. SQL 실행이 완료됐는지 확인합니다. 이전 버전을 사용하다 업데이트하는 경우에도 최신 SQL을 다시 실행해야 예약 게시와 조회수가 동작합니다.

### 관리자 계정

1. **Authentication → Users**에서 이메일·비밀번호 방식으로 관리자 사용자를 추가합니다.
2. SQL Editor에서 아래 쿼리의 이메일을 실제 관리자 이메일로 바꾸고 실행합니다.

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = '관리자 이메일 주소';
   ```

3. 역할을 변경한 뒤에는 기존 세션에서 로그아웃하고 다시 로그인합니다.
4. **Authentication → URL Configuration**에서 사이트 주소를 Site URL 및 허용된 Redirect URLs에 등록합니다. 실제 도메인과 관리자 로그인 주소를 등록하세요.

관리자 페이지 주소는 `https://사이트주소/admin-login.html`입니다. 로그인에 성공하면 `admin.html`로 이동합니다. 공개 방문자에게 관리자 역할이나 비밀번호를 공유하지 마세요.

### 브라우저 연결

`js/supabase-config.js`에서 다음 두 값을 Supabase 대시보드의 **Project Settings → API** 값으로 바꿉니다.

```js
window.JWB_SUPABASE_CONFIG = {
  url: 'https://프로젝트ID.supabase.co',
  anonKey: '공개용 anon 또는 publishable key'
};
```

이 파일에는 공개용 키만 넣습니다. `service_role` 또는 secret key는 HTML·JavaScript·GitHub 등 브라우저에 전달되는 곳에 절대 넣지 마세요.

## 2. Google Drive 업로드 설정 (Apps Script)

이 프로젝트는 Google Cloud OAuth를 사용하지 않습니다. `google-apps-script` 폴더의 브리지를 본인 Google 계정으로 배포하고, 관리자 브라우저 → Supabase Edge Function → Apps Script → Google Drive 순서로 파일을 업로드합니다. 브라우저가 Google Drive에 직접 파일을 보내지 않으므로 Drive CORS 오류를 피합니다.

### Apps Script 설정

1. Google Drive에서 동영상, 썸네일, 공지 첨부파일을 저장할 폴더를 준비합니다. 폴더 ID는 주소의 `/folders/` 뒤에 있는 값입니다.
2. [Google Apps Script](https://script.google.com/)에서 프로젝트를 만들고 `google-apps-script/Code.gs` 내용을 붙여넣습니다.
3. 프로젝트 설정에서 매니페스트 편집을 켜고 `google-apps-script/appsscript.json` 내용을 붙여넣습니다. 왼쪽 **서비스 +**에서 **Drive API**를 추가합니다.
4. **프로젝트 설정 → 스크립트 속성**에 다음 값을 등록합니다.

| 속성 | 값 |
|---|---|
| `JWB_SHARED_SECRET` | Supabase `APPS_SCRIPT_SHARED_SECRET`과 동일한 임의의 비밀 문자열 |
| `JWB_DRIVE_FOLDER_ID` | 동영상 기본 폴더 ID |
| `JWB_DRIVE_THUMBNAIL_FOLDER_ID` | 썸네일 폴더 ID |
| `JWB_DRIVE_NOTICE_FOLDER_ID` | 공지 첨부파일 폴더 ID |

5. 편집기에서 `authorizeDriveAccess`를 한 번 실행하고 권한을 승인합니다.
6. **배포 → 새 배포 → 웹 앱**에서 실행 사용자를 **나**, 액세스 권한을 **모든 사용자**로 선택해 배포합니다. `/exec`로 끝나는 웹 앱 URL을 복사합니다. 코드를 변경하면 **배포 관리 → 수정 → 새 버전**으로 다시 배포합니다.

### Supabase 설정 및 배포

Supabase 대시보드 **Edge Functions → Secrets**에 다음 값을 설정합니다.

| Secret | 값 |
|---|---|
| `APPS_SCRIPT_WEB_APP_URL` | Apps Script 배포 화면에서 복사한 `/exec` 전체 URL |
| `APPS_SCRIPT_SHARED_SECRET` | Apps Script `JWB_SHARED_SECRET`과 같은 값 |
| `ALLOWED_ORIGINS` | `https://www.wonbok.kr,https://wonbok.kr` (실제로 사용하는 도메인만 등록) |

프로젝트 루트에서 Windows PowerShell로 함수를 배포합니다. `<PROJECT_REF>`는 Supabase 프로젝트 ID입니다.

```powershell
npx.cmd --yes supabase@latest functions deploy drive-upload --project-ref <PROJECT_REF>
```

사이트 파일을 호스팅에 올리는 것과 Edge Function 배포는 별개입니다. 둘 다 최신 코드로 갱신해야 공지 첨부파일 업로드가 동작합니다. 배포 후 작은 파일로 먼저 확인하세요. Google Drive 파일은 링크가 있는 사용자가 볼 수 있도록 공유되므로 공개 가능한 파일만 올리세요.

## 3. 크몽 및 연락처 설정

`js/contact-config.js`의 공개 정보를 수정합니다.

- `email`: 공개할 이메일. 공개하지 않으면 빈 문자열로 둡니다.
- `kakaoUrl`: 카카오 오픈채팅 주소. 공개하지 않으면 빈 문자열로 둡니다.
- `kmongUrl`: 크몽 프로필 또는 대표 서비스 주소
- `kmongServices.motion`, `kmongServices.threeD`: 영상·모션그래픽 및 3D 개별 서비스 주소
- `kmongPrices`: 서비스별 시작 가격 문구
- `kmongDurations`: 서비스별 예상 작업 기간

값을 비워 둔 가격·기간은 기본 안내 문구로 표시됩니다. 공개 전에 크몽 URL이 본인의 실제 서비스 페이지인지 확인하세요.

현재 새 외주 의뢰는 크몽으로 연결됩니다. 관리자 페이지의 문의 목록은 이전에 저장된 문의 기록을 확인하기 위한 용도로 남아 있습니다. 저장되어 있는 `submit-inquiry` Edge Function은 현재 사이트의 새 문의 접수 흐름에서 사용하지 않습니다.

## 4. 관리자 사용 방법

### 포트폴리오

1. 관리자 페이지 상단에서 작품·공지 수와 누적 조회수, 조회수 상위 작품을 확인합니다. `admin-login.html`에서 로그인하고 포트폴리오 등록 폼을 작성합니다.
2. 카테고리, 제목, 설명을 입력합니다. 태그 입력란에는 쉼표로 구분해 최대 10개(각 30자 이하)를 추가합니다. 태그는 카드와 상세 화면에 표시되고 키워드 검색에 포함됩니다. 필요하면 썸네일이나 MP4/WebM 파일을 업로드합니다.
3. **사이트에 공개**를 선택하면 공개 포트폴리오에 나타납니다. 체크를 끄면 관리자만 볼 수 있는 임시저장 상태입니다.
4. 작품 상세를 열면 조회수가 증가합니다. 조회수는 포트폴리오 카드와 관리자 목록에 표시됩니다.

### 경력·학력·교육 이력

관리자 페이지의 **경력·학력·교육 이력 관리**에서 종류, 항목명, 학교·회사·교육기관, 기간, 설명을 등록합니다. 공개 체크를 끄면 관리자 목록에는 남고 메인 프로필에서는 숨겨집니다. 표시 순서 숫자가 낮은 항목부터 각 이력 그룹 안에 나타납니다. 데이터베이스가 비어 있을 때 현재 메인 페이지에 표시 중인 학력·국비 교육·경력 항목이 초기 데이터로 등록됩니다.

### 공지사항

1. 카테고리·제목·내용을 입력하고 **게시 예정 일시**를 선택합니다. 현재 시각으로 두면 즉시 공개되고 미래 시각을 선택하면 예약됩니다.
2. 파일은 공지 하나당 최대 5개, 파일당 최대 20MB까지 첨부할 수 있습니다.
3. 미리보기를 확인한 뒤 등록합니다. 게시 예정 시각은 기존 공지를 수정할 때도 변경할 수 있습니다.
4. 예약 공지는 관리자 목록에서 `예약`으로 표시됩니다. 정한 시각이 지난 뒤 공개 페이지를 새로 열면 표시됩니다.

기존 Supabase Storage 공지 첨부파일도 계속 읽을 수 있도록 호환 설정이 남아 있습니다. 새 첨부파일은 Google Drive를 사용합니다.

## 5. 사이트 게시

1. `js/supabase-config.js`와 `js/contact-config.js`를 실제 설정으로 변경합니다.
2. 정책 페이지의 연락처, 개인정보 보유 기간, 실제 운영 방식을 확인하고 필요한 내용을 반영합니다. 이력서 파일도 외부 공개가 적절한지 확인합니다.
3. 프로젝트 루트의 파일과 `css/`, `img/`, `js/`, `PDF/`, `supabase/` 폴더를 모두 호스팅에 업로드합니다. `CNAME` 파일을 사용하는 호스팅에서는 해당 파일도 포함합니다.
4. 사이트 메인 주소, 로그인, 포트폴리오 조회, 공지 공개와 예약, Google Drive 업로드를 확인합니다.

## 문제 해결

| 증상 | 확인할 항목 |
|---|---|
| Supabase에 연결되지 않음 | `js/supabase-config.js`에 Project URL과 공개 키가 정확히 들어 있는지 확인 |
| 관리자 로그인이 거부됨 | 사용자가 등록됐는지, `app_metadata.role`이 `admin`인지, URL Configuration이 맞는지 확인한 뒤 다시 로그인 |
| 예약 게시 열이나 조회수 함수를 찾을 수 없음 | 최신 `supabase-setup.sql` 전체를 SQL Editor에서 실행했는지 확인 |
| Drive 업로드가 실패하거나 403 발생 | `drive-upload` 배포, Edge Function Secrets, `ALLOWED_ORIGINS`, Google Drive API 및 공유 정책 확인 |
| Drive 업로드 후 공개 접근 불가 | 파일의 공유 권한과 Google Workspace 외부 공유 설정 확인 |
| 공지가 저장되지만 보이지 않음 | 공지의 게시 예정 시각과 Supabase RLS 정책을 확인하고 페이지 새로고침 |

## 참고 문서

- [Supabase Edge Functions 배포](https://supabase.com/docs/guides/functions/deploy)
- [Supabase Edge Function Secrets](https://supabase.com/docs/guides/functions/secrets)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Google Drive 업로드](https://developers.google.com/workspace/drive/api/guides/manage-uploads)
- [Google Drive 파일 권한](https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/create)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
