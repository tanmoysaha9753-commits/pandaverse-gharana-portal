# Supabase Setup Guide

Complete beginner-friendly guide to set up Supabase for the Pandaverse Gharana Partner Portal.

---

## STEP 1: Create a Supabase Account

1. Open your web browser and go to: https://supabase.com
2. Click **"Start your project"** (or "Sign up").
3. You can sign up with your **GitHub account** or your **email address**.
4. Verify your email if prompted.

---

## STEP 2: Create a New Project

1. After logging in, click **"New Project"**.
2. Choose an **Organization** (create one if you don't have one — you can name it "Pandaverse").
3. Fill in:
   - **Project name:** `Pandaverse Portal` (or any name you prefer)
   - **Database password:** Choose a strong password and **save it somewhere safe** — you will need it if you ever need to access the database directly.
   - **Region:** Choose the region closest to you (for example, **Mumbai** or **Singapore** for India).
4. Click **"Create new project"**.
5. Wait 2-3 minutes while Supabase sets up your project. You will see a progress screen.

---

## STEP 3: Get Your Project URL

1. In your project, look at the left sidebar and click **"Settings"** (gear icon at the bottom).
2. Click **"API"** in the settings menu.
3. Under **"Project URL"**, you will see something like:
   ```
   https://abcdefghijklmnop.supabase.co
   ```
4. **Copy this URL** — you will need it later.

---

## STEP 4: Get Your API Keys

On the same **API** settings page, look at the **"Project API keys"** section. You will see two keys:

1. **anon public** — This is the public key. It is safe to use in frontend code. Copy this key.
2. **service_role secret** — This is a secret key. Never expose it in frontend code or commit it to Git.

For the frontend (Next.js pages), you need the **anon public** key.
For the server-side (API routes), you also need the **service_role secret** key.

**Copy both keys.**

---

## STEP 5: Add Environment Variables

In your project folder, copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with the ones you copied from Step 3 and Step 4.
- `NEXT_PUBLIC_SUPABASE_URL` = your Project URL (from Step 3)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the "anon public" key (from Step 4)
- `SUPABASE_SERVICE_ROLE_KEY` = the "service_role secret" key (from Step 4) — used ONLY on the server side in API routes.

**Important:**
- Never share these values publicly.
- Never commit `.env.local` to Git.
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security — keep it secret.

---

## STEP 6: Create Database Tables

1. In your Supabase project, click **"SQL Editor"** in the left sidebar.
2. Click **"New query"**.
3. Open the file `supabase-schema.sql` from this project folder.
4. Copy the **entire contents** of that file.
5. Paste it into the SQL Editor.
6. Click **"Run"** (or press Ctrl+Enter).
7. You should see "Success" at the bottom.

This creates all 7 tables: profiles, partners, products, product_stories, maker_details, shop_details, and media_assets.

---

## STEP 7: Apply Row Level Security Policies

1. In the SQL Editor, click **"New query"**.
2. Open the file `supabase-rls-policies.sql`.
3. Copy the **entire contents** and paste into the SQL Editor.
4. Click **"Run"**.
5. You should see "Success".

These policies ensure:
- Partners can only see their own data.
- Admins can see everything.
- Unauthorized access is blocked at the database level.

---

## STEP 8: Create Storage Buckets

1. Click **"Storage"** in the left sidebar.
2. Click **"New bucket"**.
3. Create the first bucket:
   - **Name:** `product-images`
   - **Public bucket:** OFF (make it **private**)
   - Click **"Create bucket"**
4. Click **"New bucket"** again for the second bucket:
   - **Name:** `product-videos`
   - **Public bucket:** OFF (make it **private**)
   - Click **"Create bucket"**

---

## STEP 9: Apply Storage Access Policies

1. Go to the **SQL Editor**.
2. Click **"New query"**.
3. Open the file `supabase-storage-policies.sql`.
4. Copy the **entire contents** and paste into the SQL Editor.
5. Click **"Run"**.
6. You should see "Success".

These policies ensure partners can only upload/view/delete their own files, and admins can access everything.

---

## STEP 10: Create the First Pandaverse Admin

By default, all signups through `/signup` get the `partner` role. To make someone an admin:

1. Go to the **Table Editor** in the left sidebar.
2. Select the **"profiles"** table.
3. Find your user (the one you signed up with).
4. Double-click the `role` cell and change it from `partner` to `admin`.
5. The change is saved automatically.

Now you can log in and you will be redirected to `/admin` instead of the partner dashboard.

---

## STEP 11: Test a Gharana Partner Account

1. Open an **incognito/private browser window**.
2. Go to your local app (http://localhost:3000).
3. Click **"Become a Partner"** or go to `/signup`.
4. Fill in the registration form with test data.
5. Click **"Create Partner Account"**.
6. You should be redirected to the partner dashboard.
7. Verify:
   - You can upload a product with photos.
   - You can see the product in "My Products".
   - The admin can see this partner in `/admin/partners`.

---

## You are done!

Your Supabase backend is now fully configured and ready for the Pandaverse Gharana Partner Portal.

When deploying to Vercel, make sure to add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
