# 🚀 COMPLETE BEGINNER-FRIENDLY GUIDE
## Pandaverse Gharana Partner Portal - Step by Step

---

# ═══════════════════════════════════════════════════════
# WHERE IS EVERYTHING?
# ═══════════════════════════════════════════════════════

## Current Location of Your Project
The project files are stored at this exact path on your computer:

```
C:\Users\user\AppData\Local\Claude-3p\local-agent-mode-sessions\bc25ca88\00000000\c9df0996\outputs\pandaverse-gharana-portal
```

But this is a hidden system folder. You should NOT work from here. Instead, copy the project to a location you can easily access.

---

# ═══════════════════════════════════════════════════════
# STEP 1: COPY PROJECT TO YOUR DESKTOP
# ═══════════════════════════════════════════════════════

### Option A: Using File Explorer (Easiest)

1. Press `Windows Key + E` to open File Explorer
2. In the address bar at the top, paste this path and press Enter:
   ```
   C:\Users\user\AppData\Local\Claude-3p\local-agent-mode-sessions\bc25ca88\00000000\c9df0996\outputs
   ```
3. You will see a folder called `pandaverse-gharana-portal`
4. Right-click on `pandaverse-gharana-portal` → Select **Copy**
5. In the address bar, type `Desktop` and press Enter
6. Right-click in the empty space → Select **Paste**
7. Wait for the copy to finish

### Option B: Using Command Prompt

1. Press `Windows Key + R`, type `cmd`, press Enter
2. Type this command and press Enter:
   ```
   xcopy "C:\Users\user\AppData\Local\Claude-3p\local-agent-mode-sessions\bc25ca88\00000000\c9df0996\outputs\pandaverse-gharana-portal" "C:\Users\user\Desktop\pandaverse-gharana-portal" /E /I /H
   ```
3. Wait for it to finish

### After this step:
Your project will be at: `C:\Users\user\Desktop\pandaverse-gharana-portal`

---

# ═══════════════════════════════════════════════════════
# STEP 2: OPEN PROJECT IN VS CODE
# ═══════════════════════════════════════════════════════

1. Open **Visual Studio Code**
   - Press Windows Key, type "Visual Studio Code", press Enter

2. Go to **File → Open Folder...**
   - Or press `Ctrl + K, Ctrl + O`

3. Navigate to your Desktop and select the folder `pandaverse-gharana-portal`

4. Click **"Select Folder"**

You will now see all the project files in the VS Code sidebar on the left.

---

# ═══════════════════════════════════════════════════════
# WHAT IS THE "PROJECT ROOT"?
# ═══════════════════════════════════════════════════════

The **project root** is the folder that contains `package.json`.

In your case, the project root is:
```
C:\Users\user\Desktop\pandaverse-gharana-portal\
```

If you open this folder, you will see these important files:
- `package.json` ← This file MUST be here
- `next.config.js`
- `tailwind.config.js`
- `tsconfig.json`
- `postcss.config.js`
- `.env.example`
- `README.md`
- And folders: `app/`, `components/`, `lib/`

The folder `app/` contains ALL your website pages.

---

# ═══════════════════════════════════════════════════════
# STEP 3: INSTALL NODE.JS (If not already installed)
# ═══════════════════════════════════════════════════════

You need Node.js to run this project.

### Check if you already have Node.js:
1. Press `Windows Key + R`, type `cmd`, press Enter
2. Type: `node -v` and press Enter
3. If you see a version number like `v18.x.x` or `v20.x.x`, you already have it! Skip to Step 4.
4. If you see an error, you need to install it.

### Install Node.js:
1. Go to: https://nodejs.org/
2. Download the **LTS version** (the big green button on the left)
3. Run the downloaded installer
4. Click "Next" through all steps (default settings are fine)
5. After installation, close and reopen Command Prompt
6. Verify: type `node -v` — you should see a version number
7. Verify npm: type `npm -v` — you should see a version number

---

# ═══════════════════════════════════════════════════════
# STEP 4: INSTALL PROJECT DEPENDENCIES
# ═══════════════════════════════════════════════════════

1. Open **Command Prompt**:
   - Press `Windows Key + R`, type `cmd`, press Enter

2. Navigate to your project folder:
   ```
   cd C:\Users\user\Desktop\pandaverse-gharana-portal
   ```
   Press Enter after typing this.

3. Install dependencies:
   ```
   npm install
   ```
   Press Enter. This will take 2-5 minutes. You will see lots of text scrolling. This is normal.

4. When it finishes, you should see something like:
   ```
   added XXX packages in XXs
   ```

If you see errors, write them down and let me know.

---

# ═══════════════════════════════════════════════════════
# STEP 5: CREATE A SUPABASE ACCOUNT
# ═══════════════════════════════════════════════════════

Supabase is the "backend" service that provides:
- User authentication (login/signup)
- Database (to store all data)
- File storage (to store photos and videos)

### Creating your Supabase project:

1. Go to: https://supabase.com
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub account (recommended), OR
   - Email and password
4. After signing up, you will see your dashboard
5. Click **"New project"**
6. Fill in:
   - **Name**: `pandaverse-portal` (or any name you like)
   - **Database Password**: Create a strong password and SAVE IT somewhere (you will need it)
   - **Region**: Choose the region closest to you (e.g., `ap-south-1` for India)
7. Click **"Create new project"**
8. Wait 2-3 minutes for the project to be created

---

# ═══════════════════════════════════════════════════════
# STEP 6: GET YOUR SUPABASE CREDENTIALS
# ═══════════════════════════════════════════════════════

1. In your Supabase project dashboard, look at the left sidebar
2. Click on **"Project Settings"** (gear icon at the bottom left)
3. Click on **"API"** in the settings menu
4. You will see these values:

   ### Project URL
   Looks like: `https://abcdefghijklmnop.supabase.co`
   Copy this.

   ### anon / public key
   Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   Copy this.

   ### service_role key (secret)
   Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   Copy this too. (This is a secret key - do not share it with anyone)

5. Keep these 3 values somewhere safe (Notepad is fine for now).

---

# ═══════════════════════════════════════════════════════
# STEP 7: CREATE .env.local FILE
# ═══════════════════════════════════════════════════════

1. In VS Code, look at your project files on the left
2. You should see a file called `.env.example`
3. **Right-click** on `.env.example` → Select **Copy**
4. **Right-click** in the empty space → Select **Paste**
5. The new file should be called `.env.example - Copy`
6. **Rename** it to `.env.local` (remove the " - Copy" part)
   - Right-click → Rename → type `.env.local`
7. Open `.env.local` in VS Code (click on it)
8. Replace the placeholder values with your actual Supabase values:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

   Replace:
   - `https://your-project-id.supabase.co` with your **Project URL**
   - `your-anon-key-here` with your **anon/public key**
   - `your-service-role-key-here` with your **service_role key**

9. **Save the file** (`Ctrl + S`)

---

# ═══════════════════════════════════════════════════════
# STEP 8: CREATE DATABASE TABLES
# ═══════════════════════════════════════════════════════

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Click on your project
3. In the left sidebar, click **"SQL Editor"**
4. Click **"+ New query"** button
5. A text editor will open
6. Go back to VS Code, open the file called `supabase-schema.sql`
7. **Select ALL the text** in that file (`Ctrl + A`, then `Ctrl + C`)
8. Go back to the Supabase SQL editor
9. **Paste** the SQL code (`Ctrl + V`)
10. Click **"Run"** (or press `Ctrl + Enter`)
11. You should see "Success. No rows returned"

This creates all 7 database tables.

---

# ═══════════════════════════════════════════════════════
# STEP 9: APPLY SECURITY POLICIES (Row Level Security)
# ═══════════════════════════════════════════════════════

1. In Supabase SQL Editor, click **"+ New query"**
2. In VS Code, open `supabase-rls-policies.sql`
3. Copy ALL text (`Ctrl + A`, `Ctrl + C`)
4. Paste into Supabase SQL Editor (`Ctrl + V`)
5. Click **"Run"**
6. You should see "Success. No rows returned"

This ensures partners can ONLY see their own data, and admins can see everything.

---

# ═══════════════════════════════════════════════════════
# STEP 10: CREATE STORAGE BUCKETS
# ═══════════════════════════════════════════════════════

1. In Supabase left sidebar, click **"Storage"**
2. Click **"New bucket"**
3. Create first bucket:
   - **Name**: `product-images`
   - Toggle **"Public bucket"** to **OFF** (very important - must be private)
   - Click **"Create bucket"**
4. Click **"New bucket"** again
5. Create second bucket:
   - **Name**: `product-videos`
   - Toggle **"Public bucket"** to **OFF** (very important - must be private)
   - Click **"Create bucket"**

---

# ═══════════════════════════════════════════════════════
# STEP 11: APPLY STORAGE POLICIES
# ═══════════════════════════════════════════════════════

1. In Supabase SQL Editor, click **"+ New query"**
2. In VS Code, open `supabase-storage-policies.sql`
3. Copy ALL text (`Ctrl + A`, `Ctrl + C`)
4. Paste into Supabase SQL Editor (`Ctrl + V`)
5. Click **"Run"**
6. You should see "Success. No rows returned"

This controls who can upload, view, and delete files.

---

# ═══════════════════════════════════════════════════════
# STEP 12: RUN THE APPLICATION LOCALLY
# ═══════════════════════════════════════════════════════

1. Make sure you are still in the project folder in Command Prompt:
   ```
   cd C:\Users\user\Desktop\pandaverse-gharana-portal
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. You should see output like:
   ```
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000
   ```

4. Open your browser and go to: **http://localhost:3000**

You should see the Pandaverse landing page!

---

# ═══════════════════════════════════════════════════════
# STEP 13: TEST THE APPLICATION
# ═══════════════════════════════════════════════════════

### Test 1: Create a Partner Account
1. Go to: http://localhost:3000/signup
2. Fill in your details:
   - Full Name
   - Email
   - Phone Number
   - Password
3. Click **"Sign Up"**
4. You will be redirected to the onboarding page
5. Fill in your shop details (shop name, type, location, etc.)
6. Click **"Complete Profile"**
7. You should be redirected to your Partner Dashboard

### Test 2: Partner Dashboard
- You should see your name and shop name
- Stats showing your products
- Buttons to upload products and view your products
- Navigation on the left side

### Test 3: Upload a Product
1. Click **"Upload New Product"** in the sidebar
2. Go through all 8 steps:
   - Step 1: Basic Product Details
   - Step 2: Product Story
   - Step 3: Maker Information
   - Step 4: Personal Story
   - Step 5: Shop Information
   - Step 6: Photographs (upload some test images)
   - Step 7: Video (optional)
   - Step 8: Review and Submit
3. Click **"Submit Product"**
4. You should see your product in the "My Products" page

### Test 4: Create an Admin Account
1. Go to: http://localhost:3000/signup
2. Sign up with a DIFFERENT email (this will be your admin account)
3. Complete the onboarding
4. Now you need to make this user an admin:
5. In Supabase, go to **SQL Editor**
6. Run this SQL (replace with your details):
   ```sql
   INSERT INTO profiles (id, full_name, email, phone, role)
   SELECT id, 'Your Admin Name', 'your-admin-email@example.com', '9999999999', 'admin'
   FROM auth.users
   WHERE email = 'your-admin-email@example.com';
   ```
7. Log out and log in with your admin account
8. You should be redirected to the Admin Dashboard at: http://localhost:3000/admin

---

# ═══════════════════════════════════════════════════════
# IMPORTANT ROUTES AND WHAT THEY DO
# ═══════════════════════════════════════════════════════

## Public Routes (No login needed):
| URL | What it does |
|-----|-------------|
| http://localhost:3000/ | Landing page |
| http://localhost:3000/login | Login page |
| http://localhost:3000/signup | Sign up page |

## Partner Routes (Login required):
| URL | What it does |
|-----|-------------|
| http://localhost:3000/partner/dashboard | Partner Dashboard |
| http://localhost:3000/partner/products | View all your products |
| http://localhost:3000/partner/products/123 | View product with ID 123 |
| http://localhost:3000/partner/upload | Upload a new product |
| http://localhost:3000/partner/guide | Pandaverse Guide |
| http://localhost:3000/partner/profile | Edit your profile |

## Admin Routes (Admin login required):
| URL | What it does |
|-----|-------------|
| http://localhost:3000/admin | Admin Overview |
| http://localhost:3000/admin/partners | See all partners |
| http://localhost:3000/admin/partners/123 | See partner with ID 123 |
| http://localhost:3000/admin/products | See all products from all partners |
| http://localhost:3000/admin/products/456 | See product with ID 456 |
| http://localhost:3000/admin/content | Content Library |
| http://localhost:3000/admin/search | Search all content |
| http://localhost:3000/admin/profile | Admin profile |

---

# ═══════════════════════════════════════════════════════
# HOW TO STOP AND RESTART THE SERVER
# ═══════════════════════════════════════════════════════

## To stop the server:
In the Command Prompt window where `npm run dev` is running, press `Ctrl + C`

## To restart:
1. Make sure you are in the project folder:
   ```
   cd C:\Users\user\Desktop\pandaverse-gharana-portal
   ```
2. Start again:
   ```
   npm run dev
   ```

---

# ═══════════════════════════════════════════════════════
# TROUBLESHOOTING
# ═══════════════════════════════════════════════════════

## Problem: "npm is not recognized"
**Solution**: Node.js is not installed. Go to nodejs.org, download and install the LTS version. Restart your computer.

## Problem: "npm install" fails with errors
**Solution**: Make sure you are in the correct folder. Type `cd C:\Users\user\Desktop\pandaverse-gharana-portal` in Command Prompt and press Enter, then run `npm install` again.

## Problem: "Cannot find module"
**Solution**: You need to run `npm install` first. Make sure you are in the project folder.

## Problem: Port 3000 is already in use
**Solution**: Open Command Prompt, type:
```
npx kill-port 3000
```
Then restart with `npm run dev`.

## Problem: Changes not showing in browser
**Solution**: Save all files in VS Code (`Ctrl + S`), then refresh the browser page.

## Problem: "Failed to upload" when uploading images/videos
**Solution**: Make sure you completed STEP 10 (created storage buckets) and STEP 11 (applied storage policies).

## Problem: Login works but shows blank page
**Solution**: Check Command Prompt for errors. Most likely a missing environment variable. Make sure `.env.local` file exists and has correct values.

## Problem: "Invalid login credentials"
**Solution**: Make sure you are using the correct email and password. If you forgot, you can reset password on the login page.

## Problem: Images not showing after upload
**Solution**: This is normal for now. The files are stored in Supabase and will display through the media proxy API. Check the browser console for errors (F12).

---

# ═══════════════════════════════════════════════════════
# DEPLOYING TO VERCEL (After testing locally)
# ═══════════════════════════════════════════════════════

## Part A: Upload to GitHub

1. Go to: https://github.com/new
2. Repository name: `pandaverse-gharana-portal`
3. Click **"Create repository"**
4. On the next page, you will see instructions. Under **"...or push an existing repository from the command line"**, copy the commands.
5. In Command Prompt:
   ```
   cd C:\Users\user\Desktop\pandaverse-gharana-portal
   ```
6. Run these commands one by one:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/pandaverse-gharana-portal.git
   git push -u origin main
   ```
   (Replace `YOUR-USERNAME` with your actual GitHub username)

## Part B: Deploy on Vercel

1. Go to: https://vercel.com/new
2. Click **"Import Third-Party Git Repository"**
3. Select your GitHub account
4. Find and select `pandaverse-gharana-portal`
5. Click **"Import"**
6. Vercel will auto-detect Next.js
7. Before clicking Deploy, expand **"Environment Variables"**
8. Add these 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key
9. Click **"Deploy"**
10. Wait 2-3 minutes for the build to complete
11. You will get a URL like: `https://pandaverse-gharana-portal.vercel.app`

Your website is now LIVE on the internet! Anyone can access it.

---

# ═══════════════════════════════════════════════════════
# YOU ARE ALL SET!
# ═══════════════════════════════════════════════════════

After completing all steps above:
- Your app runs locally at: http://localhost:3000
- Your app is deployed at: https://your-app.vercel.app
- Partners can sign up and upload products
- Admin can view and manage all content
- All data is permanently stored in Supabase
- All files are stored in Supabase Storage

If anything goes wrong, go back to the relevant step and re-check your work.

Good luck with Pandaverse! 🐼
