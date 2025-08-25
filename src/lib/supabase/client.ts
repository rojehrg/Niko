import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yiqtcunzxrwcymaoggih.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcXRjdW56eHJ3Y3ltYW9nZ2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Mzc5MDEsImV4cCI6MjA3MTUxMzkwMX0.9rWnwHse85kQ54tsCruXIQ8MdF_vXYNBHdqCgwoAq00'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
