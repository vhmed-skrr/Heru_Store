// Download supabase locally to avoid CDN blocking by browsers
// This file must be loaded BEFORE any other script

const SUPABASE_URL = 'https://yynewmzzurjvghicerby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bmV3bXp6dXJqdmdoaWNlcmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NjI2NTIsImV4cCI6MjA5MTQzODY1Mn0.vov2TwtQAOyNMJshx5YZEWms8LvXdlCQ5U7VOJU71H8';

// Initialize Supabase client
// Works with both: import CDN and UMD local file
let supabaseClient;

if (typeof window !== 'undefined') {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
}

// Export for use in other files
window.supabaseClient = supabaseClient;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabaseClient.from('settings').select('key').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    return false;
  }
}

window.checkSupabaseConnection = checkSupabaseConnection;
