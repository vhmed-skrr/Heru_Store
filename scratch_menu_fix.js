const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
console.log('Running mobile menu fix and cleanup...');

// ── STEP 1 & 2: Update components.css ──
const componentsFile = path.join(baseDir, 'assets', 'css', 'components.css');
if (fs.existsSync(componentsFile)) {
  let css = fs.readFileSync(componentsFile, 'utf8');

  // Remove [dir="ltr"] .mobile-menu block
  css = css.replace(/\[dir="ltr"\]\s*\.mobile-menu\s*\{[^}]+\}/g, '');

  // Replace .mobile-menu and .mobile-menu.open blocks
  // First, strip them out to easily re-insert
  css = css.replace(/\.mobile-menu\s*\{[\s\S]*?\}(?=\s*\.mobile-menu\.open)/g, '');
  css = css.replace(/\.mobile-menu\.open\s*\{[^}]+\}/g, '');

  // But there's also .mobile-menu-toggle, so let's be careful.
  // We'll surgically find .mobile-menu { ... } and .mobile-menu.open { ... }
  // Better yet, just find the whole block from .mobile-menu { up to the end of .mobile-menu.open }
  // Since we don't know exact spacing, let's use a simpler replace block.
  css = css.replace(/\.mobile-menu\s*\{[\s\S]*?transform:\s*translateX[^}]+\}/g, '');
  // Then we might have leftover '}' or .mobile-menu.open block
  css = css.replace(/\.mobile-menu\.open\s*\{[^}]+\}/g, '');

  // The safest way is to inject at the end of the file if we can't reliably replace,
  // but since we want the exact definitions, let's append it cleanly.
  // Actually, wait, let's remove ALL `.mobile-menu {` and `.mobile-menu.open {` strictly.
  // Regex: 
  const regexMenu = /\.mobile-menu\s*\{[\s\S]*?\}/g;
  const regexMenuOpen = /\.mobile-menu\.open\s*\{[\s\S]*?\}/g;
  const regexMenuBackdrop = /\.mobile-menu-backdrop[\s\S]*?\}/g;
  
  css = css.replace(regexMenu, '');
  css = css.replace(regexMenuOpen, '');
  css = css.replace(regexMenuBackdrop, '');

  // Add the strictly requested rules
  const cssAdditions = `
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  max-width: 100vw;
  height: 100vh;
  background-color: var(--bg-card);
  border-left: 1px solid var(--border);
  z-index: 200;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-base);
  transform: translateX(100%);
  overflow-y: auto;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 199;
}

.mobile-menu-backdrop.open {
  display: block;
}
`;

  // Append to the end
  css += cssAdditions;

  fs.writeFileSync(componentsFile, css, 'utf8');
  console.log('Updated components.css');
}

// ── STEP 3, 4, 5: Update HTML Files ──
const htmlFiles = ['index.html', 'shop.html', 'product.html', 'cart.html', 'checkout.html'];

const newJsLogic = `
const menuToggles = document.querySelectorAll('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

// Create backdrop if it doesn't exist
let backdrop = document.querySelector('.mobile-menu-backdrop');
if (!backdrop) {
  backdrop = document.createElement('div');
  backdrop.className = 'mobile-menu-backdrop';
  document.body.appendChild(backdrop);
}

function openMobileMenu() {
  if (mobileMenu) mobileMenu.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

menuToggles.forEach(btn => {
  // The open button (hamburger ☰)
  if (!btn.classList.contains('open')) {
    btn.addEventListener('click', openMobileMenu);
  }
});

// Close button inside menu (the ✕ button)
const closeMenuBtn = mobileMenu ? mobileMenu.querySelector('.mobile-menu-toggle.open') : null;
if (closeMenuBtn) {
  closeMenuBtn.onclick = closeMobileMenu;
}

// Close on backdrop click
if (backdrop) {
  backdrop.addEventListener('click', closeMobileMenu);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});
`;

for (const fileName of htmlFiles) {
  const file = path.join(baseDir, fileName);
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, 'utf8');

  // STEP 4: Remove script tags for theme.js
  content = content.replace(/<script[^>]*?src="(?:\.\/|\.\.\/)assets\/js\/theme\.js"[^>]*?>\s*<\/script>\s*/gi, '');

  // STEP 3: Replace mobile menu toggle logic
  // Case 1: index.html
  // // 6. Mobile Menu Logic
  // const menuToggles = document.querySelectorAll('.mobile-menu-toggle');
  // ...
  // });
  // We can just use string replacement or regex
  const regexExtract1 = /\/\/\s*6\.\s*Mobile Menu Logic[\s\S]*?(?=\/\/ \d|\s*<\/script>)/i;
  const regexExtract2 = /const menuToggle(?:s)?\s*=\s*document\.querySelector.*?\.mobile-menu-toggle['"]\);[\s\S]*?(?=\s*<\/script>|\/\/)/i;

  if (regexExtract1.test(content)) {
    content = content.replace(regexExtract1, '// Mobile Menu Logic\n' + newJsLogic + '\n');
  } else if (regexExtract2.test(content)) {
    content = content.replace(regexExtract2, newJsLogic + '\n');
  }

  // STEP 5: Fix CTA color
  // style="background-color: var(--accent); color: var(--accent)"
  content = content.replace(/color:\s*var\(--accent\)/g, 'color: var(--text-inverse)');
  // If there's an invisible combination like section with style="background-color: var(--accent)"
  // check for text elements inside and make sure they use var(--text-inverse)
  // the prompt mainly says "Fix by ensuring text inside accent-bg sections uses: color: var(--text-inverse)"
  // I'll replace any direct color: var(--accent) inside sections to var(--text-inverse) just in case, but usually they are already correct.

  fs.writeFileSync(file, content, 'utf8');
  console.log('Processed HTML:', fileName);
}

console.log('Finished fixing mobile menu.');
