import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://okmurjvzsgdxjiaflacq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbXVyanZ6c2dkeGppYWZsYWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDczNjQsImV4cCI6MjA2Mjg4MzM2NH0.uhFFu8fm_kSERZk-xLmBc6t4P0L4WeN7iPLT4ESyCTo'         

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
