import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zhdspeckoenhkbuirlrk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZHNwZWNrb2VuaGtidWlybHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjc3MzQsImV4cCI6MjA3ODcwMzczNH0.cY50Vm_FiMET08gnFDbBd-0u1JS-5ZLwpKz4jio-GCc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
