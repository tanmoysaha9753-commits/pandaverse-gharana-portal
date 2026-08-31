# 📋 SIMPLE SETUP GUIDE - COPY THIS DOCUMENT

## PROBLEM YOU SAW:
```
npm error path C:\Users\user\package.json
```
This means: **The folder pandaverse-gharana-portal does NOT exist on your Desktop yet.**

---

## ✅ STEP-BY-STEP FIX:

### STEP 1: COPY THE FOLDER TO DESKTOP

**Option A - Using File Explorer (EASIEST):**
1. Press `Windows Key + E` (opens File Explorer)
2. In the address bar at the top, COPY and PASTE this path:
   ```
   C:\Users\user\AppData\Local\Claude-3p\local-agent-mode-sessions\bc25ca88\00000000\c9df0996\outputs
   ```
3. Press Enter
4. You will see a folder named: **pandaverse-gharana-portal**
5. RIGHT-CLICK on that folder → Click **Copy**
6. In the address bar, type: `Desktop` → Press Enter
7. RIGHT-CLICK in empty space → Click **Paste**
8. Wait 30 seconds

**Option B - Using Command Prompt:**
1. Press `Windows Key + R` → Type `cmd` → Press Enter
2. Copy and paste this command (it's one long line):
```
xcopy "C:\Users\user\AppData\Local\Claude-3p\local-agent-mode-sessions\bc25ca88\00000000\c9df0996\outputs\pandaverse-gharana-portal" "C:\Users\user\Desktop\pandaverse-gharana-portal" /E /I /H /Y
```
3. Press Enter and wait

---

### STEP 2: VERIFY THE COPY WORKED

1. Press `Windows Key + E`
2. Type `Desktop` in address bar, press Enter
3. You should see a folder called **pandaverse-gharana-portal**
4. If you see it, GREAT! Continue to Step 3.
5. If you DON'T see it, go back to Step 1.

---

### STEP 3: INSTALL THE PROJECT

1. Press `Windows Key + R` → Type `cmd` → Press Enter
2. Type this command and press Enter:
   ```
   cd C:\Users\user\Desktop\pandaverse-gharana-portal
   ```
3. You should see the prompt change to something like:
   ```
   C:\Users\user\Desktop\pandaverse-gharana-portal>
   ```
4. Now type this and press Enter:
   ```
   npm install
   ```
5. This will take 2-5 minutes. Lots of text will scroll. THIS IS NORMAL.
6. Wait until you see: `added XXX packages in XXs`

---

### STEP 4: IF YOU GET ERRORS

**If you see "npm is not recognized":**
- Node.js is not installed
- Go to: https://nodejs.org
- Download LTS version (left side, big green button)
- Run installer, keep all defaults
- Restart your computer
- Come back to Step 3

**If you see "Cannot find path":**
- The folder copy didn't work
- Go back to Step 1 and try again

---

### STEP 5: AFTER npm install SUCCEEDS

Once you see "added XXX packages", type this:
```
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

Open your browser and go to: **http://localhost:3000**

---

### STEP 6: SETUP SUPABASE (Database & Storage)

Follow the guide in **HOW_TO_RUN.md** file (it's in your project folder).

Or follow these quick steps:

1. Go to https://supabase.com and sign up
2. Create a new project
3. Get your API keys from Project Settings → API
4. Create a file called `.env.local` in your project folder with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
   ```
5. Run the SQL files (supabase-schema.sql, supabase-rls-policies.sql, supabase-storage-policies.sql) in Supabase SQL Editor
6. Create storage buckets: `product-images` and `product-videos` (both PRIVATE)

---

## 🎯 QUICK CHECKLIST:

- [ ] Folder copied to Desktop
- [ ] Can see pandaverse-gharana-portal on Desktop
- [ ] Opened Command Prompt in that folder
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev`
- [ ] Opened http://localhost:3000 in browser
- [ ] Created Supabase account
- [ ] Created .env.local with credentials
- [ ] Ran SQL scripts in Supabase
- [ ] Created storage buckets

---

## 🆘 IF YOU GET STUCK:

**Take a screenshot** of:
1. What you see in Command Prompt
2. What you see on your Desktop
3. The error message

Then share the screenshot so I can help you fix it.
