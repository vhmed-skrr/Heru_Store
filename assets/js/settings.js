import { supabaseClient } from './supabase.js';

export async function loadAllSettings() {
    try {
        const { data } = await supabaseClient.from('settings').select('*');
        if(!data) return;
        const map = {}; data.forEach(d => map[d.key] = d.value);

        const safeSet = (id, val) => {
            const el = document.getElementById(id);
            if(el) {
                if(el.type === 'checkbox') el.checked = (val === 'true');
                else el.value = val || '';
            }
        };

        safeSet('store-name', map['store_name']);
        safeSet('whatsapp', map['whatsapp']);
        safeSet('hero-title', map['hero_title']);
        safeSet('hero-subtitle', map['hero_subtitle']);
        safeSet('hero-cta-primary', map['hero_cta_primary']);
        safeSet('hero-cta-secondary', map['hero_cta_secondary']);
        safeSet('announcement-active', map['announcement_active']);
        safeSet('announcement-items', map['announcement_items']);
        safeSet('footer-tagline', map['footer_tagline']);
        safeSet('footer-support-hours', map['footer_support_hours']);
        safeSet('social-instagram', map['social_instagram']);
        safeSet('social-facebook', map['social_facebook']);
        safeSet('social-tiktok', map['social_tiktok']);
        safeSet('social-telegram', map['social_telegram']);
        safeSet('store-bg-primary', map['store_bg_primary'] || '#080808');
        safeSet('store-accent-color', map['store_accent_color'] || '#F0EBE1');
        safeSet('cloudinary-cloud-name', map['cloudinary_cloud_name']);
        safeSet('cloudinary-upload-preset', map['cloudinary_upload_preset']);
    } catch(e) {
        console.error("Error loading settings", e);
    }
}

export async function saveAllSettings() {
  const settingsToSave = [
    { key: 'store_name', value: document.getElementById('store-name').value },
    { key: 'whatsapp', value: document.getElementById('whatsapp').value },
    { key: 'hero_title', value: document.getElementById('hero-title').value },
    { key: 'hero_subtitle', value: document.getElementById('hero-subtitle').value },
    { key: 'hero_cta_primary', value: document.getElementById('hero-cta-primary').value },
    { key: 'hero_cta_secondary', value: document.getElementById('hero-cta-secondary').value },
    { key: 'announcement_active', value: document.getElementById('announcement-active').checked.toString() },
    { key: 'announcement_items', value: document.getElementById('announcement-items').value },
    { key: 'footer_tagline', value: document.getElementById('footer-tagline').value },
    { key: 'footer_support_hours', value: document.getElementById('footer-support-hours').value },
    { key: 'social_instagram', value: document.getElementById('social-instagram').value },
    { key: 'social_facebook',  value: document.getElementById('social-facebook').value  },
    { key: 'social_tiktok',    value: document.getElementById('social-tiktok').value    },
    { key: 'social_telegram',  value: document.getElementById('social-telegram').value  },
    { key: 'store_bg_primary', value: document.getElementById('store-bg-primary').value },
    { key: 'store_accent_color', value: document.getElementById('store-accent-color').value },
    { key: 'cloudinary_cloud_name', value: document.getElementById('cloudinary-cloud-name').value },
    { key: 'cloudinary_upload_preset', value: document.getElementById('cloudinary-upload-preset').value },
  ];

  const sBtn = document.querySelector('#view-settings .btn-primary');
  const oTxt = sBtn.innerText;
  sBtn.innerText = 'جارٍ الحفظ...'; sBtn.disabled = true;

  try {
      for (const setting of settingsToSave) {
        const { error } = await supabaseClient
          .from('settings')
          .upsert({ key: setting.key, value: setting.value }, { onConflict: 'key' });
        if (error) console.error('Error saving', setting.key, error);
      }
      if(window.showToast) window.showToast('تم حفظ الإعدادات بنجاح ✓', 'success');
  } catch(e) {
      if(window.showToast) window.showToast('خطأ في حفظ الإعدادات', 'error');
  } finally {
      sBtn.innerText = oTxt; sBtn.disabled = false;
  }
}

export async function applyDynamicSettings() {
  // جلب كل الإعدادات من Supabase
  const { data, error } = await supabaseClient
    .from('settings')
    .select('key, value');
  
  if (error || !data) return; // إذا فشل الجلب: الصفحة تبقى كما هي
  
  // تحويل المصفوفة لـ object
  const s = {};
  data.forEach(row => s[row.key] = row.value);
  
  // ══ اسم المتجر ══
  if (s.store_name) {
    document.querySelectorAll('[data-setting="store_name"]')
      .forEach(el => el.textContent = s.store_name);
  }
  
  // ══ Hero Section ══
  if (s.hero_title) {
    const el = document.querySelector('[data-setting="hero_title"]');
    if (el) el.textContent = s.hero_title;
  }
  if (s.hero_subtitle) {
    const el = document.querySelector('[data-setting="hero_subtitle"]');
    if (el) el.textContent = s.hero_subtitle;
  }
  if (s.hero_cta_primary) {
    const el = document.querySelector('[data-setting="hero_cta_primary"]');
    if (el) el.textContent = s.hero_cta_primary;
  }
  if (s.hero_cta_secondary) {
    const el = document.querySelector('[data-setting="hero_cta_secondary"]');
    if (el) el.textContent = s.hero_cta_secondary;
  }
  
  // ══ Announcement Bar ══
  const announcementBar = document.querySelector('[data-setting="announcement_bar"]');
  if (s.announcement_active === 'false') {
    if (announcementBar) {
      announcementBar.style.display = 'none';
      const hero = document.querySelector('.hero-section');
      if (hero) hero.style.marginTop = '-65px'; // إزالة التداخل بسبب الـ Navbar
    }
  } else if (s.announcement_items) {
    const items = s.announcement_items
      .split('|')
      .map(i => i.trim())
      .filter(Boolean);
    
    if (items.length > 0 && announcementBar) {
      const itemsHTML = items
        .map(item => `<span class="marquee-item">${item}</span>`)
        .join('<span class="marquee-sep" aria-hidden="true">✦</span>');
      
      announcementBar.innerHTML = 
        `<div class="marquee-content">
          ${itemsHTML}
          <span class="marquee-sep" aria-hidden="true">✦</span>
          ${itemsHTML}
        </div>`;
    }
  }
  
  // ══ Footer ══
  if (s.footer_tagline) {
    const el = document.querySelector('[data-setting="footer_tagline"]');
    if (el) el.textContent = s.footer_tagline;
  }
  if (s.footer_support_hours) {
    const el = document.querySelector('[data-setting="footer_support_hours"]');
    if (el) el.textContent = s.footer_support_hours;
  }
  
  // ══ أيقونات السوشيال في الـ Footer ══
  const socialPlatforms = ['instagram', 'facebook', 'tiktok', 'telegram'];

  socialPlatforms.forEach(platform => {
    const links = document.querySelectorAll(`[data-social="${platform}"]`);
    const value = s[`social_${platform}`];
    
    links.forEach(link => {
      if (value && value.trim() !== '') {
        link.href = value.trim();
        link.style.display = 'flex';
      } else {
        link.style.display = 'none';
      }
    });
  });
  
  // ══ الهوية البصرية ══
  if (s.store_bg_primary && /^#[0-9A-Fa-f]{6}$/.test(s.store_bg_primary)) {
    document.documentElement.style.setProperty('--bg-primary', s.store_bg_primary);
  }
  if (s.store_accent_color && /^#[0-9A-Fa-f]{6}$/.test(s.store_accent_color)) {
    document.documentElement.style.setProperty('--accent', s.store_accent_color);
  }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', applyDynamicSettings);

function initLanguage() {
  const saved = localStorage.getItem('heru_lang') || 'ar';
  applyLanguage(saved);
  
  // تحديث زر اللغة
  const langBtn = document.querySelector('[data-lang-toggle]');
  if (langBtn) langBtn.textContent = saved === 'ar' ? 'EN' : 'AR';
}

function applyLanguage(lang) {
  localStorage.setItem('heru_lang', lang);
  
  // تطبيق اتجاه الصفحة
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // ترجمة كل العناصر التي لديها data-ar أو data-en
  document.querySelectorAll('[data-ar]').forEach(el => {
    el.textContent = lang === 'ar' 
      ? el.getAttribute('data-ar') 
      : (el.getAttribute('data-en') || el.getAttribute('data-ar'));
  });
  
  // تحديث زر اللغة
  const langBtn = document.querySelector('[data-lang-toggle]');
  if (langBtn) langBtn.textContent = lang === 'ar' ? 'EN' : 'AR';
}

function toggleLanguage() {
  const current = localStorage.getItem('heru_lang') || 'ar';
  applyLanguage(current === 'ar' ? 'en' : 'ar');
}

if (typeof window !== 'undefined') {
  window.toggleLanguage = toggleLanguage;
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initLanguage);
