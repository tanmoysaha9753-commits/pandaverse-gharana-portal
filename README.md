# Pandaverse Gharana Partner Portal

A production-ready web application for Pandaverse to manage Gharana Partner relationships, product uploads, and content review.

## What This Application Does

Pandaverse partners (artisans, weavers, shop owners) can register, upload products with photos and videos, and manage their profile. Pandaverse admins can view all partner data, products, and media.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + Storage)
- **Hosting**: Vercel

## Project Structure

```
pandaverse-gharana-portal/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind styles + custom CSS
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Registration page
│   ├── partner/
│   │   ├── onboarding/page.tsx # Partner registration form
│   │   ├── dashboard/page.tsx  # Partner dashboard
│   │   ├── products/page.tsx   # List of partner's products
│   │   ├── products/[id]/page.tsx # Product detail view
│   │   ├── upload/page.tsx     # Multi-step product upload
│   │   ├── guide/page.tsx      # Pandaverse Guide
│   │   └── profile/page.tsx    # Partner profile
│   ├── admin/
│   │   ├── page.tsx            # Admin overview
│   │   ├── partners/page.tsx   # All partners list
│   │   ├── partners/[id]/page.tsx # Individual partner view
│   │   ├── products/page.tsx   # All products
│   │   ├── content/page.tsx    # Content library
│   │   ├── search/page.tsx     # Search page
│   │   └── profile/page.tsx    # Admin profile
│   └── middleware.ts           # Auth route protection
├── components/
│   ├── AuthProvider.tsx         # React auth context
│   ├── PartnerLayout.tsx        # Partner sidebar layout
│   └── AdminLayout.tsx          # Admin sidebar layout
├── lib/
│   ├── supabase.ts              # Supabase client (server + browser)
│   └── types.ts                 # TypeScript interfaces
├── public/                      # Static assets
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind config
├── tsconfig.json                # TypeScript config
├── .env.example                 # Environment variables template
├── supabase-schema.sql          # Database tables
├── supabase-rls-policies.sql    # Row Level Security
├── supabase-storage-policies.sql # Storage policies
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Setup Guide

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project (choose a region close to you)
3. Wait for the project to be ready (about 2 minutes)

### Step 3: Get Environment Variables

1. In your Supabase project, go to **Settings → API**
2. Copy:
   - Project URL
   - anon/public key

### Step 4: Create .env.local

Create a file called `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Create Database Tables

1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click **Run** (or press Ctrl+Enter)

### Step 6: Apply Row Level Security

In the same SQL Editor, run `supabase-rls-policies.sql` (copy and paste, then Run).

This ensures partners can only see their own data and admins can see everything.

### Step 7: Create Storage Buckets

1. Go to **Storage** in the Supabase sidebar
2. Create a new bucket named: `product-images`
3. Toggle **Public bucket** to **OFF** (leave it private)
4. Create another bucket named: `product-videos`
5. Toggle **Public bucket** to **OFF** (leave it private)

### Step 8: Apply Storage Policies

In the SQL Editor, run `supabase-storage-policies.sql`.

### Step 9: Create Admin Account

1. Run your app: `npm run dev`
2. Go to http://localhost:3000/signup
3. Sign up with your email
4. In Supabase SQL Editor, run:

```sql
INSERT INTO profiles (id, full_name, email, role)
SELECT id, 'Admin Name', 'your-email@example.com', 'admin'
FROM auth.users
WHERE email = 'your-email@example.com';
```

Replace `Admin Name` and `your-email@example.com` with your actual details.

### Step 10: Run the Application

```bash
npm run dev
```

Open http://localhost:3000

## Deploying to Vercel

1. Push your code to a GitHub repository
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: leave as `.` (or the folder containing package.json)
6. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Click **Deploy**

## How It Works

### Authentication
- Uses Supabase Auth for email/password login
- After signup, user role is set to 'partner' by default
- Admin role is set manually in the database

### Database
- 7 relational tables with proper foreign keys
- Row Level Security enforces access control
- Partners can only access their own data
- Admins can access everything

### Storage
- Private buckets for images and videos
- Signed URLs generated for authorized access
- File metadata stored in the database
- Organized by partner ID and product ID

### Multi-Step Product Upload
8 steps covering all product details, story, maker information, personal story, shop details, photographs, videos, and review.

## User Roles

**Gharana Partner:**
- Register and manage own profile
- Upload products with photos and videos
- View own dashboard and products

**Pandaverse Admin:**
- View all partners and their data
- Browse all products and media
- Content library with search

## Troubleshooting

### "npm install fails"
Make sure Node.js 18+ is installed. Run `node -v`.

### "Build fails on Vercel"
- Check that `.env.local` variables are set in Vercel Dashboard → Settings → Environment Variables
- Make sure package.json is in the root directory
- Check that Framework Preset is set to Next.js

### "Cannot access admin dashboard"
Make sure the admin account was created with the SQL INSERT shown in Step 9.

### "Images not loading"
Make sure storage buckets are set to **private** and storage policies are applied.

### "Login not working"
Check that Supabase Auth is enabled in your Supabase project settings.

## License

Proprietary - Pandaverse
