/**
 * i18n.js - Multilingual Dictionary Engine
 */

const LANG_KEY = 'heru-lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ar';
let langDict = {};

// Fetch JSON based on standard path
async function loadLanguage(lang) {
  try {
    const response = await fetch(`/assets/lang/${lang}.json`);
    if (!response.ok) throw new Error(`Could not load ${lang}.json`);
    langDict = await response.json();
    return true;
  } catch (err) {
    console.error('Translation error:', err);
    return false;
  }
}

// Main binding function applying dictionary keys across the DOM
function applyTranslations() {
  // 1. TextContent elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (langDict[key]) el.textContent = langDict[key];
  });

  // 2. Placeholder attributes (inputs/textareas)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (langDict[key]) el.placeholder = langDict[key];
  });

  // 3. InnerHTML elements
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (langDict[key]) el.innerHTML = langDict[key];
  });
  
  // Specific logic for Language Toggle Button to show the OTHER language
  const toggleBtn = document.querySelector('[data-lang-toggle]');
  if (toggleBtn) {
    toggleBtn.textContent = currentLang === 'ar' ? 'EN' : 'عربي';
  }
}

// Adjust document direction context
function setDirection(lang) {
  document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
  document.documentElement.setAttribute('lang', lang);
  
  // Dispatch a CustomEvent for dynamic scripts to catch
  document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: lang } }));
}

// Action execution
async function initializeLanguage() {
  const loaded = await loadLanguage(currentLang);
  if (loaded) {
    setDirection(currentLang);
    applyTranslations();
  }
}

// Global Toggle Action linked to navbar
window.toggleLanguage = async function() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem(LANG_KEY, currentLang);
  
  const loaded = await loadLanguage(currentLang);
  if (loaded) {
    setDirection(currentLang);
    applyTranslations();
    
    // Attempt re-render on components if they are dynamic wrappers
    if (typeof fetchSupabaseData === 'function') fetchSupabaseData(); // Re-render index templates
  }
};

// Bootstrap engine on load
document.addEventListener('DOMContentLoaded', initializeLanguage);
