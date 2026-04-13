// Download supabase locally to avoid CDN blocking by browsers
// This file must be loaded BEFORE any other script

const supabaseUrl = 'https://yynewmzzurjvghicerby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bmV3bXp6dXJqdmdoaWNlcmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NjI2NTIsImV4cCI6MjA5MTQzODY1Mn0.vov2TwtQAOyNMJshx5YZEWms8LvXdlCQ5U7VOJU71H8';

// Initialize Supabase client
// Works with both: import CDN and UMD local file
let supabaseClient;

if (typeof window !== 'undefined') {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  }
}

// Export for use in other files
export { supabaseClient };
window.supabaseClient = supabaseClient;
window.SUPABASE_URL = supabaseUrl;
window.SUPABASE_ANON_KEY = supabaseKey;
window.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_N-0Aad1WcYdS3p6qx74y3Q_b-7SVLgs';
export const SUPABASE_PUBLISHABLE_KEY = window.SUPABASE_PUBLISHABLE_KEY;

export const CLOUDINARY_CLOUD_NAME = 'di5ihjlkh';
export const CLOUDINARY_UPLOAD_PRESET = 'heru_products';
window.CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
window.CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET;
export const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/di5ihjlkh/image/upload';
window.CLOUDINARY_UPLOAD_URL = CLOUDINARY_UPLOAD_URL;

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
