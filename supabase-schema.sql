-- Code Clash Database Schema
-- Run this in Supabase SQL Editor

-- ======================
-- Table 1: Quizzes
-- ======================
CREATE TABLE quizzes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  questions INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT DEFAULT 'Draft',
  participants INTEGER DEFAULT 0,
  questions_data JSONB NOT NULL,
  created TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Public access policies (for demo - make more restrictive in production)
CREATE POLICY "Allow public read quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Allow public insert quizzes" ON quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update quizzes" ON quizzes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete quizzes" ON quizzes FOR DELETE USING (true);

-- ======================
-- Table 2: Participants  
-- ======================
CREATE TABLE participants (
  id BIGSERIAL PRIMARY KEY,
  team TEXT NOT NULL,
  college TEXT NOT NULL,
  members JSONB,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Active',
  joined TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Public access policies
CREATE POLICY "Allow public read participants" ON participants FOR SELECT USING (true);
CREATE POLICY "Allow public insert participants" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update participants" ON participants FOR UPDATE USING (true);
CREATE POLICY "Allow public delete participants" ON participants FOR DELETE USING (true);

-- ======================
-- Table 3: Quiz Results
-- ======================
CREATE TABLE quiz_results (
  id BIGSERIAL PRIMARY KEY,
  quiz_id BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
  participant_id BIGINT REFERENCES participants(id) ON DELETE CASCADE,
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

-- Public access policies
CREATE POLICY "Allow public read results" ON quiz_results FOR SELECT USING (true);
CREATE POLICY "Allow public insert results" ON quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update results" ON quiz_results FOR UPDATE USING (true);
CREATE POLICY "Allow public delete results" ON quiz_results FOR DELETE USING (true);

-- ======================
-- Indexes for Performance
-- ======================
CREATE INDEX idx_quizzes_code ON quizzes(code);
CREATE INDEX idx_quizzes_status ON quizzes(status);
CREATE INDEX idx_participants_team ON participants(team);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX idx_quiz_results_score ON quiz_results(score DESC);

-- ======================
-- Functions
-- ======================

-- Function to auto-update participant count
CREATE OR REPLACE FUNCTION update_quiz_participants()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE quizzes
    SET participants = (
        SELECT COUNT(DISTINCT participant_id)
        FROM quiz_results
        WHERE quiz_id = NEW.quiz_id
    )
    WHERE id = NEW.quiz_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update participant count on new result
CREATE TRIGGER trigger_update_participants
AFTER INSERT ON quiz_results
FOR EACH ROW
EXECUTE FUNCTION update_quiz_participants();
