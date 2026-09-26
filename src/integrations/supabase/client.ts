import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'
import { previewAuthStorage } from '@/integrations/supabase/previewAuthStorage'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Unset or still holding the README placeholders ("https://your-project-ref…").
const isConfigured =
  Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) &&
  !SUPABASE_URL.includes('your-project-ref') &&
  !SUPABASE_PUBLISHABLE_KEY.startsWith('your-')

// null when Supabase isn't configured, so the site still loads (e.g. on a
// static host with no env vars) and callers can fall back gracefully.
export const supabase = isConfigured
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: previewAuthStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
