# Database Setup Guide - Code Clash

இந்த guide-ல student மற்றும் admin data-வை Supabase database-ல save செய்ய எப்படி setup செய்யணும் என்று விளக்கப்பட்டுள்ளது.

## 📋 Prerequisites

- Supabase account (free tier is enough)
- Node.js installed
- Code Clash application

---

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `code-clash` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., `ap-south-1` for India)
5. Click **"Create new project"**
6. Wait 1-2 minutes for setup to complete

### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard
2. Click on **Settings** (gear icon) in the sidebar
3. Click on **API** under Project Settings
4. You'll see:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon** **public** key (long string starting with `eyJ...`)
5. **Keep this tab open** - you'll need these values!

### Step 3: Set Up Database Tables

1. In Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **"New query"**
3. Open the file `DATABASE_SCHEMA.md` in your project
4. **Copy all the SQL commands** from that file
5. **Paste** into the Supabase SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`
7. You should see: ✅ **Success. No rows returned**

### Step 4: Configure Environment Variables

1. In your project folder, find `.env.local.example`
2. **Copy** this file and rename it to `.env.local`
3. Open `.env.local` and update:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Replace:
   - `your_project_url_here` → Paste your **Project URL**
   - `your_anon_key_here` → Paste your **anon public key**
5. **Save** the file

### Step 5: Install Dependencies (Already Done)

✅ Supabase package has been installed automatically!

### Step 6: Restart Development Server

1. **Stop** the current dev server (press `Ctrl+C` in terminal)
2. **Start** it again:
   ```bash
   npm run dev
   ```

---

## ✅ Verification

### Test Database Connection

1. Open your application: `http://localhost:3000`
2. Login as admin
3. Go to **Quiz Management**
4. Try creating a new quiz
5. Check Supabase dashboard → **Table Editor** → **quizzes** table
6. You should see your quiz saved there! 🎉

---

## 📊 Database Structure

### Tables Created:

1. **quizzes** - Stores all quiz information
   - id, title, questions, status, code, participants, duration, created

2. **participants** - Stores team/student registrations
   - id, team, college, members, status, joined, email, score

3. **quiz_results** - Stores quiz completion results
   - id, quiz_id, participant_id, rank, team, score, correct, total, time, college, completed_at

4. **admin_users** (optional) - For admin authentication
   - id, username, password_hash, email, created_at

---

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- Public can read data
- Only authenticated users can insert/update/delete
- Automatic timestamps
- Unique constraints on emails and codes

---

## 🛠️ Troubleshooting

### Error: "Invalid Supabase URL"
- Check `.env.local` file exists
- Verify URL format: `https://xxxxx.supabase.co`
- Restart dev server after changing `.env.local`

### Error: "relation does not exist"
- Tables not created properly
- Re-run the SQL schema in Supabase SQL Editor
- Check for any SQL errors

### Data not saving
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Check Supabase project is active (not paused)

---

## 📝 Next Steps

Once setup is complete, the application will:
- ✅ Save all quizzes to database
- ✅ Save all participant registrations
- ✅ Save quiz results automatically
- ✅ Persist data even after page refresh
- ✅ Work in production (Vercel) without changes

---

## 🎯 Usage Examples

### Create Quiz (saves to database)
```typescript
import { createQuiz } from '@/lib/db'

const newQuiz = await createQuiz({
  title: 'Python Basics',
  questions: 20,
  status: 'Draft',
  code: 'PYT001',
  participants: 0,
  duration: 30,
  created: new Date().toISOString()
})
```

### Register Participant (saves to database)
```typescript
import { createParticipant } from '@/lib/db'

const participant = await createParticipant({
  team: 'Code Wizards',
  college: 'MIT',
  members: 4,
  status: 'Active',
  joined: new Date().toISOString(),
  email: 'team@college.edu',
  score: 0
})
```

---

**Database setup complete! 🎉** Your data will now be saved permanently in Supabase!
