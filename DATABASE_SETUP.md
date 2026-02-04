# Database Setup Guide - Code Clash

## 🗄️ Supabase Database Setup

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub/Email
4. Create a new project:
   - **Name**: code-clash
   - **Database Password**: (create a strong password)
   - **Region**: Southeast Asia (closest to you)

### Step 2: Create Database Tables

Go to **SQL Editor** in Supabase Dashboard and run these queries:

#### Table 1: Quizzes
```sql
CREATE TABLE quizzes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  questions INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT DEFAULT 'Draft',
  participants INTEGER DEFAULT 0,
  questions_data JSONB,
  created TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON quizzes FOR SELECT USING (true);

-- Allow public insert/update/delete (for demo purposes)
CREATE POLICY "Allow public insert" ON quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON quizzes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON quizzes FOR DELETE USING (true);
```

#### Table 2: Participants
```sql
CREATE TABLE participants (
  id BIGSERIAL PRIMARY KEY,
  team TEXT NOT NULL,
  college TEXT NOT NULL,
  members JSONB,
  email TEXT,
  status TEXT DEFAULT 'Active',
  joined TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Allow public access
CREATE POLICY "Allow public read" ON participants FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON participants FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON participants FOR DELETE USING (true);
```

#### Table 3: Quiz Results
```sql
CREATE TABLE quiz_results (
  id BIGSERIAL PRIMARY KEY,
  quiz_id BIGINT REFERENCES quizzes(id),
  team TEXT NOT NULL,
  college TEXT NOT NULL,
  score DECIMAL NOT NULL,
  correct INTEGER NOT NULL,
  total INTEGER NOT NULL,
  time TEXT NOT NULL,
  rank INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Allow public access
CREATE POLICY "Allow public read" ON quiz_results FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON quiz_results FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON quiz_results FOR DELETE USING (true);
```

### Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOi...` (long string)

### Step 4: Create .env.local File

Create file: `.env.local` in project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 5: Restart Dev Server

```bash
# Stop current server (Ctrl + C)
npm run dev
```

---

## 🚀 Deploy to Vercel (for sharing with others)

### Option 1: Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/code-clash.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repo
   - Add Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Get Your Live URL**: 
   - `https://code-clash-xxxxx.vercel.app`
   - Share this with everyone!

### Option 2: Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   - Go to https://netlify.com
   - Drag and drop `.next` folder
   - Add environment variables
   - Get your URL

---

## 📊 Data Migration (localStorage → Supabase)

After setting up Supabase, the app will automatically:
- Save quizzes to Supabase instead of localStorage
- Save participants to Supabase
- Save quiz results to Supabase

All users accessing the website will see the same data!

---

## ✅ Features After Database Setup

- ✅ **Multi-user access**: Everyone sees same quizzes
- ✅ **Real-time updates**: Changes sync instantly
- ✅ **Persistent data**: Data doesn't disappear on refresh
- ✅ **Admin control**: Manage from anywhere
- ✅ **Shareable link**: Send to participants
- ✅ **View & Delete**: Admin can view and delete participants

---

## 🔗 Final URLs

**Local Development**: `http://localhost:3000`
**Production**: `https://your-app.vercel.app`

Share the production URL with everyone!
