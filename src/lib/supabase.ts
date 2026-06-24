import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client using environment variables
// These will be loaded securely from .env.local during development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Throw a helpful error if the user forgot to set up their .env.local file
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase Environment Variables. Database functions will fail.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
