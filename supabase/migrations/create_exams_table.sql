-- Create the exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_days INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exams_date ON exams(date);
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject);
CREATE INDEX IF NOT EXISTS idx_exams_completed ON exams(completed);
CREATE INDEX IF NOT EXISTS idx_exams_priority ON exams(priority);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_exams_updated_at 
  BEFORE UPDATE ON exams 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can restrict this later)
CREATE POLICY "Allow all operations on exams" ON exams
  FOR ALL USING (true);

-- Insert some sample data
INSERT INTO exams (title, description, subject, date, time, location, priority, reminder_enabled, reminder_days, completed) VALUES
  ('Midterm Exam', 'Covering chapters 1-5', 'Computer Science', '2024-12-15', '09:00:00', 'Room 101', 'high', true, 1, false),
  ('Final Project', 'Submit your final project', 'Mathematics', '2024-12-20', '23:59:00', 'Online', 'high', true, 2, false),
  ('Quiz 3', 'Weekly quiz on current material', 'Physics', '2024-12-10', '14:00:00', 'Lab 2', 'medium', false, 1, false);

-- Grant permissions to authenticated users
GRANT ALL ON TABLE exams TO authenticated;
GRANT USAGE ON SEQUENCE exams_id_seq TO authenticated;
