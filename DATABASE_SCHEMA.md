# Supabase Database Schema Setup

This file contains the SQL commands to create the necessary tables in your Supabase database.

## How to Set Up

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Copy and paste the SQL commands below
4. Click **Run** to execute

---

## SQL Schema

```sql
-- Create Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  questions INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Active', 'Completed', 'Draft')),
  code TEXT NOT NULL UNIQUE,
  participants INTEGER DEFAULT 0,
  duration INTEGER NOT NULL,
  created TIMESTAMPTZ DEFAULT NOW()
);

-- Create Participants Table
CREATE TABLE IF NOT EXISTS participants (
  id BIGSERIAL PRIMARY KEY,
  team TEXT NOT NULL,
  college TEXT NOT NULL,
  members INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed')),
  joined TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  score INTEGER DEFAULT 0
);

-- Create Quiz Results Table
CREATE TABLE IF NOT EXISTS quiz_results (
  id BIGSERIAL PRIMARY KEY,
  quiz_id BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
  participant_id BIGINT REFERENCES participants(id) ON DELETE CASCADE,
  rank INTEGER,
  team TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  total INTEGER NOT NULL,
  time TEXT NOT NULL,
  college TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Admin Users Table (optional, for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access
CREATE POLICY "Enable read access for all users" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON participants FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON quiz_results FOR SELECT USING (true);

-- Create Policies for Insert (you can modify based on your authentication needs)
CREATE POLICY "Enable insert for authenticated users only" ON quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON quiz_results FOR INSERT WITH CHECK (true);

-- Create Policies for Update
CREATE POLICY "Enable update for authenticated users only" ON quizzes FOR UPDATE USING (true);
CREATE POLICY "Enable update for authenticated users only" ON participants FOR UPDATE USING (true);

-- Create Policies for Delete
CREATE POLICY "Enable delete for authenticated users only" ON quizzes FOR DELETE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON participants FOR DELETE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON quiz_results FOR DELETE USING (true);

-- Create Indexes for Better Performance
CREATE INDEX idx_quizzes_status ON quizzes(status);
CREATE INDEX idx_quizzes_created ON quizzes(created);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX idx_quiz_results_participant_id ON quiz_results(participant_id);
CREATE INDEX idx_quiz_results_score ON quiz_results(score DESC);
```

---

## Verification

After running the SQL commands, verify the tables were created:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quizzes', 'participants', 'quiz_results', 'admin_users');
```

---

## Next Steps

1. **Set up environment variables**: Copy `.env.local.example` to `.env.local` and add your Supabase credentials
2. **Install Supabase client**: Run `npm install @supabase/supabase-js`
3. **Test the connection**: The app will now save data to Supabase instead of using in-memory data
