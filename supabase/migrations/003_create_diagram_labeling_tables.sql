-- Create the diagrams table
CREATE TABLE IF NOT EXISTS diagrams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the diagram_labels table
CREATE TABLE IF NOT EXISTS diagram_labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
  label_number INTEGER NOT NULL,
  x_position DECIMAL(10,2) NOT NULL,
  y_position DECIMAL(10,2) NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diagrams_created_at ON diagrams(created_at);
CREATE INDEX IF NOT EXISTS idx_diagram_labels_diagram_id ON diagram_labels(diagram_id);
CREATE INDEX IF NOT EXISTS idx_diagram_labels_label_number ON diagram_labels(label_number);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_diagrams_updated_at 
  BEFORE UPDATE ON diagrams 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagram_labels_updated_at 
  BEFORE UPDATE ON diagram_labels 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_labels ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on diagrams" ON diagrams
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on diagram_labels" ON diagram_labels
  FOR ALL USING (true);

-- Grant permissions to authenticated users
GRANT ALL ON TABLE diagrams TO authenticated;
GRANT ALL ON TABLE diagram_labels TO authenticated;
GRANT USAGE ON SEQUENCE diagrams_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE diagram_labels_id_seq TO authenticated;
