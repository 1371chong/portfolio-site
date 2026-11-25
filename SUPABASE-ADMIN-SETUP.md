# Supabase setup: website history and administrator accounts

1. Run the updated `supabase-setup.sql` in Supabase Dashboard → SQL Editor. It creates the website update history, inquiry progress and homepage campaign tables, administrator account registry, campaign image storage bucket, and RLS policies so both administrator roles can manage site content.
2. Confirm that at least one trusted Supabase Auth user has `app_metadata.role = "admin"`. For an existing main administrator, the SQL syncs that user into `admin_accounts` when it runs. If needed, assign the role from Supabase Dashboard → Authentication → Users, then run the SQL again.
3. Deploy both functions from the project root:

   ```sh
   supabase functions deploy drive-upload
   supabase functions deploy manage-admin-users
   supabase functions deploy check-inquiry-progress
   ```

4. Set the `ALLOWED_ORIGINS` Edge Function secret to the deployed site origin, for example `https://www.wonbok.kr`. Keep the existing Google Drive secrets configured for `drive-upload`.
5. Sign in with the main administrator account. Use **메인·부관리자 계정 관리** in the admin dashboard to create administrator accounts. The login ID is an email address. Supabase Auth stores the password as a hash; the website never stores or returns it.

The main administrator can create or delete main and sub-administrator accounts. Sub-administrators can manage notices, portfolios, profile entries, website updates, and media, but cannot manage administrator accounts. The last main administrator and the currently signed-in main administrator cannot be deleted.

For Kmong inquiries, an administrator can create a project progress record in the admin dashboard and share both the one-time tracking code and 12-digit issue number in the Kmong conversation. The client must enter both values to see a status. Only their hashes and status details are stored; the original values are shown once after creation. The **코드 재발급** action rotates both values and immediately invalidates the previous pair. If you already have older progress records, use **코드 재발급** for each one so it has an issue number. The progress table does not store client contact details or the original inquiry.

The **히어로·팝업·이벤트 배너 관리** section lets either administrator role upload JPG, PNG or WebP images, draft or publish a homepage campaign, set its active dates, add optional CTA details, and edit or delete existing campaigns. Published hero slides run in an accessible carousel and replace the built-in hero while active; popup modals and event banners also appear only during their configured schedule. A popup's **오늘 하루 보지 않기** button remembers the choice through the visitor's local date. Popup text and image alt text are entered by the administrator; the site language switch does not translate campaign copy automatically.
