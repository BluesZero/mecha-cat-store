// supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://otiaqffgxrvcnssxehdd.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWFxZmZneHJ2Y25zc3hlaGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODM5ODQsImV4cCI6MjA2NzQ1OTk4NH0.UHW8o1LQHFM-F_MvGTyFWw6VBqohRA1hKQ2HFe4-vXE'; // cópiala de tu panel

export const supabase = createClient(supabaseUrl, supabaseKey)
