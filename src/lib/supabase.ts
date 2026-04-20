import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if we have the required environment variables
// This allows the module to be imported at build time without errors
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          signUp: async () => ({ error: new Error('Supabase not configured') }),
          signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
          signOut: async () => ({ error: null }),
          verifyOtp: async () => ({ error: new Error('Supabase not configured') }),
        },
      } as any;
