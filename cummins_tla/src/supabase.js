import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://paixptuglhwecgkdjfwm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaXhwdHVnbGh3ZWNna2RqZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1NzE1NjIsImV4cCI6MjAyNDE0NzU2Mn0.DXxU5di4ePTDl6XzEE4fIEoGE5GnDh8cl48U7Si6p_w';
export const supabase = createClient(supabaseUrl, supabaseKey);
