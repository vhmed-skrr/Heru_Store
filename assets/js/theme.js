/**
 * theme.js - DISABLED
 * Dark/Light mode system removed. Site is light mode only.
 * File kept to prevent 404 errors.
 */

// Stub to prevent errors from any remaining references
window.toggleTheme = function() { /* disabled */ };

// Remove data-theme attribute if it exists (cleanup from old system)
document.documentElement.removeAttribute('data-theme');

// Remove from localStorage if saved
localStorage.removeItem('heru-theme');
