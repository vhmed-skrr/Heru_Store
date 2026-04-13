/**
 * theme.js - Dark/Light Theme Switching Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORE_KEY = 'heru-theme';
  
  // 1. Initialize Theme on Load (Defaults to Dark)
  function initTheme() {
    const savedTheme = localStorage.getItem(STORE_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
  }

  // 2. Toggle Theme
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORE_KEY, newTheme);
    updateThemeUI(newTheme);
  }

  // 3. Update Toggle Buttons UI
  function updateThemeUI(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach(btn => {
      // ☀️ for dark mode (click to light), 🌙 for light mode (click to dark)
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'تفعيل المظهر النهاري' : 'تفعيل المظهر الليلي');
    });
  }

  // Bind to global for inline usage if needed
  window.toggleTheme = toggleTheme;

  // Bind existing buttons
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Run initialization
  initTheme();
});
