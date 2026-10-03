/*
 * Supabase public project settings.
 * Replace these two values with the Project URL and anon/publishable key from
 * Supabase Dashboard > Project Settings > API. Never place a service_role key here.
 */
window.JWB_SUPABASE_CONFIG = {
  url: 'https://rktwmdtjboyihmrrajrc.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdHdtZHRqYm95aWhtcnJhanJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MDQ0NTksImV4cCI6MjEwNTQ4MDQ1OX0.LdeCCKnAm5HJu8BlE40HEXuQ5rfJb067PfaA84kY1N0'
};

window.getJwbSupabase = function () {
  const config = window.JWB_SUPABASE_CONFIG;
  if (!window.supabase || !config || !config.url || !config.anonKey ||
      config.url.includes('YOUR_') || config.anonKey.includes('YOUR_')) {
    return null;
  }
  return window.supabase.createClient(config.url, config.anonKey);
};
