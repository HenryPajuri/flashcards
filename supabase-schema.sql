CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  mode VARCHAR(50) NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  score_percentage DECIMAL(5,2) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flashcards_category_id ON flashcards(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_attempts_category_id ON attempts(category_id);
CREATE INDEX IF NOT EXISTS idx_attempts_completed_at ON attempts(completed_at);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on categories" ON categories
  FOR DELETE USING (true);

CREATE POLICY "Allow public read access on flashcards" ON flashcards
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on flashcards" ON flashcards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on flashcards" ON flashcards
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on flashcards" ON flashcards
  FOR DELETE USING (true);

CREATE POLICY "Allow public read access on attempts" ON attempts
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on attempts" ON attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on attempts" ON attempts
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on attempts" ON attempts
  FOR DELETE USING (true);
