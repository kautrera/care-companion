import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anon);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase credentials are missing. Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

// `createClient` calls `new URL(url)` synchronously, which throws on an empty
// string. When env vars are missing we use a syntactically valid placeholder
// so the app can still mount and render the "Supabase isn't configured"
// screen instead of crashing to a blank page.
const safeUrl = isSupabaseConfigured ? url! : "https://placeholder.supabase.co";
const safeAnon = isSupabaseConfigured ? anon! : "placeholder";

export const supabase = createClient(safeUrl, safeAnon, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: false,
  },
});
