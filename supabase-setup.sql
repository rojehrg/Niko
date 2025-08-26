-- Create the exams table for tracking exams, deadlines, and assignments
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TIME,
  location TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_days INTEGER[] DEFAULT '{1, 3, 7}',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the date for faster queries
CREATE INDEX IF NOT EXISTS idx_exams_date ON exams(date);

-- Create an index on completed status for filtering
CREATE INDEX IF NOT EXISTS idx_exams_completed ON exams(completed);

-- Create an index on subject for filtering
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject);

-- Enable Row Level Security (RLS)
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can restrict this later)
CREATE POLICY "Allow all operations on exams" ON exams
  FOR ALL USING (true) WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_exams_updated_at 
  BEFORE UPDATE ON exams 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO exams (title, description, subject, date, priority, location) VALUES
  ('Final Exam', 'Comprehensive final covering all course material', 'Mathematics', NOW() + INTERVAL '7 days', 'high', 'Room 101'),
  ('Research Paper', 'Submit 15-page research paper on chosen topic', 'English Literature', NOW() + INTERVAL '14 days', 'medium', 'Online'),
  ('Lab Report', 'Complete and submit chemistry lab experiment report', 'Chemistry', NOW() + INTERVAL '3 days', 'medium', 'Lab Building A'),
  ('Group Project', 'Present group project findings to class', 'Business Management', NOW() + INTERVAL '21 days', 'low', 'Conference Room');

-- Grant necessary permissions (adjust as needed for your setup)
GRANT ALL ON TABLE exams TO authenticated;
GRANT USAGE ON SEQUENCE exams_id_seq TO authenticated;
