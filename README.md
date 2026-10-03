# JWB STUDIO Portfolio

정적 사이트와 Supabase를 연결해 포트폴리오, 공지, 문의와 관리자 기능을 운영합니다.

## 기능

- 포트폴리오: 썸네일 이미지(JPG/PNG/WebP, Google Drive, 최대 20MB)와 MP4/WebM 작품 영상(Google Drive, 최대 100MB) 업로드, 상세 소개, 프로젝트별 공유 링크
- 공지: 카테고리별 공개 게시판, 관리자 등록·수정·삭제, Google Drive 첨부파일(공지당 최대 5개, 파일당 20MB)
- 외주 문의: 허니팟과 IP 지문당 15분에 3회 제출 제한, PDF/이미지 첨부, Supabase 저장 및 Discord 알림
- 알림: Resend 이메일과 Discord 웹훅(각각 선택 설정)
- 견적: 문의를 바탕으로 답변 초안을 만들고 복사
- 검색 노출: 페이지 설명·Open Graph·JSON-LD, `robots.txt`, `sitemap.xml`

## 1. Supabase 프로젝트 준비

1. Supabase 대시보드에서 프로젝트를 만듭니다.
2. 프로젝트의 **SQL Editor**에서 `supabase-setup.sql` 전체를 실행합니다. 테이블, RLS, 문의 제한 함수, 공지 카테고리·첨부파일 열, 썸네일과 동영상 Google Drive 파일 ID 저장 열, 비공개 문의 첨부 버킷이 준비됩니다. 기존 프로젝트도 이 SQL을 다시 실행하면 필요한 열이 추가됩니다.
3. **Authentication → Users**에서 관리자 계정을 추가합니다. 공개 회원가입이 필요 없다면 가입을 비활성화하세요.
4. SQL Editor에서 아래 쿼리를 실행해 그 계정에 관리자 역할을 지정합니다. 이메일은 실제 관리자 이메일로 바꿉니다.

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'YOUR_ADMIN_EMAIL';
   ```

5. **Project Settings → API**에서 Project URL과 공개용 anon/publishable key를 복사해 `js/supabase-config.js`에 넣습니다. `service_role` 또는 secret key는 브라우저 파일에 넣지 마세요.
6. 문의 첨부는 PDF/JPG/PNG/WebP, 최대 10MB입니다. 포트폴리오 썸네일과 영상, 공지 첨부파일은 Google Drive에 저장합니다.

## 2. 문의 접수와 스팸 방지

문의는 Supabase Edge Function이 검증한 뒤 DB에 저장합니다. Turnstile은 사용하지 않으며, 숨겨진 허니팟 입력란과 IP 지문 기준 15분당 최대 3회 제한으로 기본적인 자동 제출을 줄입니다. CAPTCHA보다 스팸 방어 강도는 낮으므로 스팸이 늘면 Turnstile 또는 다른 CAPTCHA 제공자를 다시 연결할 수 있습니다.

## 3. Discord 문의 알림 설정

문의는 Supabase DB에 저장되고, Discord에는 개인정보를 포함하지 않은 새 문의 알림이 전송됩니다. Discord 웹훅 주소는 브라우저 코드에 넣지 않습니다.

- Discord에서 문의 알림을 받을 채널의 웹훅을 만든 뒤 Supabase 대시보드 **Edge Functions → Secrets**에 `DISCORD_WEBHOOK_URL`로 저장합니다.
- 이메일 알림도 원하면 Resend에서 발신 도메인을 인증하고 `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM`을 추가합니다.
- Discord 웹훅을 설정하지 않으면 해당 알림을 건너뜁니다. 알림 전송에 실패해도 문의 데이터는 Supabase에 보관됩니다.

## 4. Edge Function 배포

프로젝트 루트(`portfolio-site-main`)에서 Supabase CLI를 설치하고 다음을 실행합니다. `<PROJECT_REF>`는 Supabase 프로젝트의 Reference ID입니다.

```powershell
supabase login
supabase link --project-ref <PROJECT_REF>
supabase functions deploy submit-inquiry
supabase functions deploy drive-upload
```

Edge Function Secrets에 다음 값도 저장합니다.

| Secret | 값 |
|---|---|
| `ALLOWED_ORIGINS` | `https://www.wonbok.kr` 및 실제 사용 도메인(origin 전체 주소)을 쉼표로 구분 |
| `RATE_LIMIT_SALT` | 임의의 긴 비밀 문자열 |
| `APPS_SCRIPT_WEB_APP_URL` | 아래 Apps Script 배포에서 복사한 웹 앱 URL |
| `APPS_SCRIPT_SHARED_SECRET` | Apps Script와 Supabase에 동일하게 저장할 긴 임의 비밀 문자열 |
| `RESEND_API_KEY` | Resend API 키, 이메일 알림을 사용할 때 |
| `NOTIFY_EMAIL_TO` | 알림을 받을 이메일 |
| `NOTIFY_EMAIL_FROM` | Resend에서 인증한 발신 주소 |
| `DISCORD_WEBHOOK_URL` | Discord 웹훅 URL, Discord 알림을 사용할 때 |

Supabase가 Edge Function 런타임에 제공하는 `SUPABASE_SERVICE_ROLE_KEY`는 함수가 DB와 스토리지에 저장할 때 사용합니다. 직접 설정하거나 프런트엔드에 복사하지 마세요. `supabase/config.toml`은 문의 함수의 JWT 검증을 끄고, 함수 코드에서 허용 Origin·허니팟·제출 제한을 검사합니다.

## 5. Google Drive 동영상 저장 설정 (Apps Script)

Apps Script가 본인 Google 계정 권한으로 Drive 업로드 세션을 만듭니다. 파일 본문은 브라우저에서 Google Drive로 직접 전송하므로 Supabase Edge Function을 거치지 않으며, 현재 관리자 페이지의 최대 100MB 업로드를 유지합니다. 관리자 로그인은 Supabase가 확인하고, Apps Script 공유 비밀값은 Supabase Edge Function 안에서만 전달합니다.

### Apps Script 웹 앱 만들기

1. 영상·첨부파일을 저장할 Google Drive 폴더를 준비합니다. 폴더 ID는 폴더 주소의 `/folders/` 뒤에 있는 문자열입니다. 루트에 저장하려면 폴더 설정을 비워 둡니다.
2. [Google Apps Script](https://script.google.com/)에서 새 프로젝트를 만들고 `google-apps-script/Code.gs`의 내용을 편집기의 `Code.gs`에 붙여넣습니다. 이미 프로젝트를 만들었다면 기존 `Code.gs`를 새 내용으로 교체합니다.
3. 왼쪽 **프로젝트 설정**에서 `appsscript.json 매니페스트 파일을 편집기에 표시`를 켭니다. 나타난 `appsscript.json`에 `google-apps-script/appsscript.json`의 내용을 붙여넣고 저장합니다. 기본 Apps Script Cloud 프로젝트를 사용하면 Drive 고급 서비스 추가에 필요한 API도 자동으로 활성화됩니다. 표준 Cloud 프로젝트로 바꾼 경우에는 Drive API 설정을 별도로 확인해야 합니다.
4. **프로젝트 설정 → 스크립트 속성**에 다음 속성을 추가합니다.

   | 속성 | 값 |
   |---|---|
   | `JWB_SHARED_SECRET` | 최소 32바이트 이상 임의 비밀값. 아래의 Supabase Edge Function에도 똑같이 저장 |
   | `JWB_DRIVE_FOLDER_ID` | 선택 사항. 대상 Drive 폴더 URL의 `/folders/` 뒤에 있는 ID |
   | `JWB_DRIVE_THUMBNAIL_FOLDER_ID` | 선택 사항. 썸네일 전용 폴더 ID. 미설정 시 기본 Drive 폴더 사용 |
   | `JWB_DRIVE_NOTICE_FOLDER_ID` | 선택 사항. 공지 첨부 전용 폴더 ID. 미설정 시 `JWB_DRIVE_FOLDER_ID` 폴더를 사용 |

   Windows PowerShell에서 비밀값을 만들려면 다음을 실행하고, 출력된 값만 두 설정에 붙여넣습니다.

   ```powershell
   [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

5. 편집기에서 `authorizeDriveAccess`를 한 번 실행하고 표시되는 권한 요청에서 본인 Google 계정의 Drive 접근을 승인합니다.
6. **배포 → 새 배포 → 웹 앱**을 선택합니다. 실행 사용자는 **나**, 액세스 권한은 **모든 사용자**로 설정해 배포합니다. 기존 배포가 있으면 **배포 관리 → 수정 → 새 버전**으로 업데이트합니다. 웹 앱 URL(`/exec`)을 복사합니다. 이 URL은 비밀이 아니지만, 공유 비밀값은 외부에 공개하면 안 됩니다.

### Supabase 연결

1. Supabase 대시보드의 **Edge Functions → Secrets**에서 `APPS_SCRIPT_WEB_APP_URL`에 웹 앱 URL을, `APPS_SCRIPT_SHARED_SECRET`에 위와 동일한 비밀값을 저장합니다. 기존 Google OAuth Secrets (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`)은 더 이상 필요하지 않습니다.
2. 사이트의 주소가 `ALLOWED_ORIGINS`에 포함되었는지 확인하고 아래를 실행해 `drive-upload`를 배포합니다.

   ```powershell
   supabase functions deploy drive-upload
   ```

3. 관리자 페이지에서 썸네일(JPG/PNG/WebP, 최대 20MB), MP4/WebM 영상(최대 100MB), 공지 첨부파일을 업로드합니다. 공지는 **공지사항·업데이트·작업 소식·기타** 카테고리를 선택할 수 있고, 파일을 최대 5개까지 붙일 수 있습니다. 공지 첨부 가능 형식은 PDF·이미지·텍스트·Office 문서이며 파일당 최대 20MB입니다. 업로드된 썸네일·영상·공지 첨부파일은 Drive에서 “링크가 있는 모든 사용자” 보기 권한이 되므로 공개 가능한 파일만 올리세요. 파일 교체나 해당 작품·공지를 삭제하면 이전 Drive 파일도 정리됩니다. 기존 Supabase 썸네일은 새 Drive 썸네일로 교체하기 전까지 계속 표시됩니다.

**보안 참고:** 웹 앱은 Supabase 서버만 공유 비밀값을 알고 있도록 구성합니다. `JWB_SHARED_SECRET`을 사이트 파일, GitHub 저장소, 관리자 브라우저 코드에 넣지 마세요. 공유 설정이 조직 계정 정책으로 차단되어 있으면 개인 Google 계정의 Drive 폴더를 이용하세요. Apps Script의 실행 시간과 Google 계정별 할당량은 Google 정책에 따라 달라질 수 있습니다.

## 6. 사이트 설정 및 게시

1. `js/contact-config.js`에 공개할 실제 이메일과 카카오 오픈채팅 주소를 입력합니다.
2. `privacy.html`에 실제 보유기간, Supabase 프로젝트 리전과 서비스 처리 위치를 확인해 반영합니다. 문의 알림 이메일을 켜면 해당 데이터 처리 사실도 정책에 유지합니다.
3. 사이트 파일 전체를 현재 호스팅에 업로드합니다. 루트에 `robots.txt`, `sitemap.xml`, `supabase` 폴더도 포함합니다.
4. 관리자 페이지에서 작품·공지 등록을 확인하고, 테스트 문의가 DB에 쌓이는지와 설정한 알림 채널에 전달되는지 확인합니다.

## 관리자 메뉴

- `admin-login.html`: 관리자 로그인
- `admin.html`: 작품과 미디어 등록·수정·삭제, 공지 CRUD, 문의 확인·상태 변경, 답변 초안 복사

작품 공유 링크는 `index.html?work=<작품ID>#works` 형식입니다. 공유 미리보기 메타데이터와 페이지 제목은 브라우저에서 작품에 맞춰 바뀝니다. 정적 호스팅 특성상 일부 SNS 미리보기 봇은 JavaScript 변경을 읽지 못하고 기본 사이트 미리보기를 표시할 수 있습니다.

## 공식 설정 안내

- [Supabase Edge Functions 배포](https://supabase.com/docs/guides/functions/deploy)
- [Supabase Edge Function Secrets](https://supabase.com/docs/guides/functions/secrets)
- [Google Drive 업로드](https://developers.google.com/workspace/drive/api/guides/manage-uploads)
- [Google Drive 파일 권한 설정](https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/create)
- [Apps Script 웹 앱 배포](https://developers.google.com/apps-script/guides/web)
- [Apps Script Cloud 프로젝트](https://developers.google.com/apps-script/guides/cloud-platform-projects)
- [Apps Script 서비스 할당량](https://developers.google.com/apps-script/guides/services/quotas)
- [Supabase Storage 재개 가능한 업로드](https://supabase.com/docs/guides/storage/uploads/resumable-uploads)
- [Resend와 Supabase 연동](https://resend.com/supabase)
