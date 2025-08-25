import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yiqtcunzxrwcymaoggih.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcXRjdW56eHJ3Y3ltYW9nZ2loIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTkzNzkwMSwiZXhwIjoyMDcxNTEzOTAxfQ.jZTAo8CDuHeB0zTcBzETLTL00uLSe5vxcDYwihBPU6M'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
