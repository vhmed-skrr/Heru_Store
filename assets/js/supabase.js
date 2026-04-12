const { createClient } = supabase;

// Create or import supabase client
// Assuming supabase-js is loaded locally in index.html (e.g., window.supabase)

const supabaseUrl = 'https://yynewmzzurjvghicerby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bmV3bXp6dXJqdmdoaWNlcmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NjI2NTIsImV4cCI6MjA5MTQzODY1Mn0.vov2TwtQAOyNMJshx5YZEWms8LvXdlCQ5U7VOJU71H8';

export const CLOUDINARY_CLOUD_NAME = 'di5ihjlkh';
export const CLOUDINARY_UPLOAD_PRESET = 'heru_products';

export const supabaseClient = typeof createClient !== 'undefined' 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export async function checkConnection() {
  if (!supabaseClient) return false;
  
  try {
    const { error } = await supabaseClient.from('products').select('id').limit(1);
    if (error) throw error;
    return true;
  } catch (err) {
    // Inject Offline Banner
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed; top:0; left:0; right:0; background:var(--error); color:#fff; text-align:center; padding:12px; z-index:99999; font-weight:700;';
    banner.innerHTML = 'الموقع يمر بصيانة مؤقتة — جرب بعد قليل 🔧';
    document.body.appendChild(banner);
    
    // Hide Payment and Cart Buttons globally
    document.querySelectorAll('#btn-add-cart, #btn-submit-order, .btn-add-cart').forEach(btn => {
        btn.style.display = 'none';
        
        // Add Whatsapp Fallback
        const waBtn = document.createElement('a');
        waBtn.href = "https://wa.me/201124519232";
        waBtn.className = "btn btn-primary btn-lg btn-full";
        waBtn.style.backgroundColor = "#25D366";
        waBtn.style.color = "#fff";
        waBtn.innerHTML = "💬 نأسف للعطل! اطلب عبر التحدث للواتساب مباشرة";
        btn.parentNode.insertBefore(waBtn, btn.nextSibling);
    });
    return false;
  }
}

// Ensure the check runs automatically
setTimeout(checkConnection, 1200);
