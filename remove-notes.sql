-- Remove Notes functionality from Supabase
-- Run this in your Supabase SQL editor

-- Drop the notes table and all related data
DROP TABLE IF EXISTS public.notes CASCADE;

-- Remove any related policies (if they exist)
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes;

-- Note: This will permanently delete all notes data
-- Make sure you want to do this before running!
