# Vercel Deployment Guide

Complete step-by-step guide to deploy the Pandaverse Gharana Partner Portal to Vercel.

---

## STEP 1: Create a GitHub Repository

1. Go to https://github.com and log in.
2. Click the **"+"** icon in the top right → **"New repository"**.
3. Name it something like `pandaverse-gharana-portal`.
4. You can keep it **Private** (recommended for a business project) or Public.
5. Click **"Create repository"**.

---

## STEP 2: Upload the Complete Project

1. On the new repository page, you will see instructions for creating a new repository.
2. If you already have the project on your computer, follow these steps:

### Option A: Using Git (Recommended)

Open your terminal/command prompt in your project folder and run:

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Pandaverse Gharana Partner Portal"
git remote add origin https://github.com/YOUR_USERNAME/pandaverse-gharana-portal.git
git branch -M main
git push -u origin main
```

### Option B: Upload via GitHub Website

1. On the repository page, click **"uploading an existing file"**.
2. Drag and drop ALL files and folders from your `pandaverse-gharana-portal` folder.
3. **Important:** Make sure `package.json` is at the root of what you upload.
4. Click **"Commit changes"**.

---

## STEP 3: Verify package.json is in the Root

1. Go to your GitHub repository.
2. You should see `package.json` listed at the top level (not inside any subfolder).
3. Click on `package.json` and verify it contains `"next"` in the dependencies.

If `package.json` is inside a subfolder, you will need to either:
- Move the contents up so `package.json` is at the root, OR
- Set the Root Directory in Vercel to that subfolder (see Step 7 below).

---

## STEP 4: Open Vercel

1. Go to https://vercel.com and log in.
2. You can sign up with your **GitHub account** (recommended — it connects automatically).

---

## STEP 5: Import the GitHub Repository

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**.
2. Under **"Import Git Repository"**, find `pandaverse-gharana-portal`.
3. Click **"Import"**.

---

## STEP 6: Correct Framework Preset

1. After importing, you will see the project configuration page.
2. Vercel should **automatically detect** the framework as **Next.js**.
3. If it does not:
   - Click on the **"Framework Preset"** dropdown.
   - Select **"Next.js"**.
4. The Build Command should be: `npm run build`
5. The Install Command should be: `npm install`
6. The Output Directory should be: **".next"** (or left as default — Next.js handles this)

---

## STEP 7: Correct Root Directory

1. Look at the **"Root Directory"** field.
2. If your `package.json` is at the root of your repository, this should be **empty** (no value).
3. If your project files are inside a subfolder (e.g., `pandaverse-gharana-portal/`), set the Root Directory to that folder name.
4. **Most likely:** Root Directory should be left empty if `package.json` is at the top level.

---

## STEP 8: Add Supabase Environment Variables

1. In the same configuration page, look for **"Environment Variables"** section.
2. Add these two variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g., `https://abcdefghijklmnop.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (from Supabase Dashboard → Settings → API) |

3. Make sure both are set for **"Production"**, **"Preview"**, and **"Development"** environments.
4. Do NOT prefix the variable names with anything — use them exactly as shown.

---

## STEP 9: Deploy

1. Scroll down and click the **"Deploy"** button.
2. Vercel will start building your project. This takes 1-3 minutes.
3. You will see a live log of the build process.
4. When it says **"Your project is ready!"** — your site is live.

---

## STEP 10: Open Deployed Website

1. Click the **"Visit"** button or the provided URL.
2. Your Pandaverse Gharana Partner Portal is now live on the internet!
3. The URL will look like: `https://pandaverse-gharana-portal.vercel.app` (or your custom domain).

---

## STEP 11: Test Registration

1. Open your deployed website.
2. Click **"Become a Partner"**.
3. Fill in the registration form with test data.
4. Click **"Create Partner Account"**.
5. You should be redirected to the partner dashboard.

---

## STEP 12: Test Login

1. Log out and go back to the login page.
2. Sign in with the email and password you just created.
3. You should reach the partner dashboard.

---

## STEP 13: Test Product Upload

1. Click **"Upload New Product"** from the dashboard.
2. Go through all 8 steps and fill in the product details.
3. Add some photos (you can use small image files for testing).
4. Submit the product.
5. You should be redirected to "My Products" where the new product appears.

---

## STEP 14: Test Admin Access

1. Log in with the admin account you created.
2. You should be redirected to `/admin`.
3. Verify you can see:
   - Overview with partner/product/video counts
   - List of all partners
   - All products from all partners
   - Content library

---

## Troubleshooting

### Vercel says "Next.js is not detected"

**Solution:**
- Make sure `package.json` is in the root directory (not inside a subfolder).
- Make sure `next` is listed in the `dependencies` (not just `devDependencies`) of `package.json`.
- Manually select **Framework Preset: Next.js** from the dropdown.

### Vercel cannot find package.json

**Solution:**
- The Root Directory setting is wrong. If your `package.json` is inside a subfolder, set Root Directory to that folder name.
- If `package.json` is at the root, make sure Root Directory is empty.

### Wrong Root Directory is selected

**Solution:**
- Check the Root Directory field. It should be empty (if package.json is at root) or the exact folder name containing package.json.
- Click "Edit" and correct it, then Redeploy.

### Build fails

**Solution:**
- Check the build log in Vercel. The error message will tell you exactly what went wrong.
- Common causes:
  - Missing environment variables — add them in Vercel Settings → Environment Variables.
  - TypeScript errors — fix them locally and redeploy.
  - Import errors — check that all imports use the `@/` path alias correctly.
- Always test `npm run build` locally first before pushing to Vercel.

### Environment variables are missing

**Solution:**
- Go to your Vercel project → **Settings** → **Environment Variables**.
- Add both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- After adding, go to **Deployments** and click **"Redeploy"** on the latest deployment.

### Supabase connection fails

**Solution:**
- Double-check your Supabase URL and anon key in Vercel environment variables.
- Make sure you have completed the database setup (schema, RLS policies, storage buckets, storage policies) in Supabase.
- Check that your Supabase project is not paused (free tier projects pause after inactivity — click "Resume" in Supabase Dashboard).

### Partner registration works but data is not saved

**Solution:**
- Check the browser console for errors.
- Make sure the Supabase RLS policies are correctly applied.
- Make sure the `partners` table exists and has the correct columns.

### Images/videos fail to upload

**Solution:**
- Make sure the `product-images` and `product-videos` storage buckets exist in Supabase.
- Make sure the storage policies have been applied.
- Check that the bucket names match exactly in the code and in Supabase (they are case-sensitive).

---

## Need Help?

1. Check the browser console for error messages.
2. Check the Vercel deployment logs.
3. Check the Supabase Dashboard → Logs for database errors.
4. Review TROUBLESHOOTING.md in this project.
