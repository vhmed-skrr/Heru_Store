/**
 * supabase.js — Heru Store v2
 * CREDENTIALS LOCK: These values must never be changed or removed.
 * Supabase Project: yynewmzzurjvghicerby
 */

// ══ SUPABASE CREDENTIALS ══
const supabaseUrl = 'https://yynewmzzurjvghicerby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bmV3bXp6dXJqdmdoaWNlcmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NjI2NTIsImV4cCI6MjA5MTQzODY1Mn0.vov2TwtQAOyNMJshx5YZEWms8LvXdlCQ5U7VOJU71H8';

// ══ CLOUDINARY CREDENTIALS ══
const CLOUDINARY_CLOUD_NAME    = 'di5ihjlkh';
const CLOUDINARY_UPLOAD_PRESET = 'heru_products';
const CLOUDINARY_UPLOAD_URL    = 'https://api.cloudinary.com/v1_1/di5ihjlkh/image/upload';

// ══ WHATSAPP ══
const WHATSAPP_NUMBER = '201124519232';

// ══ INITIALIZE SUPABASE CLIENT ══
let supabaseClient = null;

function initSupabase() {
  if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Expose globally for all pages
    window.supabaseClient        = supabaseClient;
    window.SUPABASE_URL          = supabaseUrl;
    window.SUPABASE_ANON_KEY     = supabaseKey;
    window.SUPABASE_PUBLISHABLE  = 'sb_publishable_N-0Aad1WcYdS3p6qx74y3Q_b-7SVLgs';
    window.CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
    window.CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET;
    window.CLOUDINARY_UPLOAD_URL = CLOUDINARY_UPLOAD_URL;
    window.WHATSAPP_NUMBER       = WHATSAPP_NUMBER;
    
    return true;
  }
  return false;
}

// Try immediately, retry after DOM if needed
if (!initSupabase()) {
  document.addEventListener('DOMContentLoaded', initSupabase);
}

// Export for ES module usage (data.js, nav.js, etc.)
export { supabaseClient, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL };
export const SUPABASE_URL  = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseKey;

// Connection health check
async function checkSupabaseConnection() {
  try {
    if (!supabaseClient) return false;
    const { error } = await supabaseClient.from('settings').select('key').limit(1);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err.message);
    return false;
  }
}
window.checkSupabaseConnection = checkSupabaseConnection;
