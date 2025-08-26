-- Supabase Setup for StudyBuddy App - Fixed Version
-- Run these commands in your Supabase SQL Editor

-- 1. Drop existing table and functions to start fresh
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 2. Create user_profiles table WITHOUT foreign key constraint initially
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  selectedSubject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- 5. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to update updated_at on profile changes
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;

-- 8. Create a simple function to manually create profiles (we'll call this from the app)
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_name TEXT,
  user_email TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO user_profiles (id, name, email)
  VALUES (user_id, user_name, user_email)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Failed to create/update user profile: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT) TO authenticated;

-- 10. Now add the foreign key constraint (after table is populated)
-- ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_id_fkey 
--   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
