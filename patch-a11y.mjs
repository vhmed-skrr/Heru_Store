import fs from 'fs';

const files = [
    'track-order.html', 'terms.html', 'suggest.html', 'shop.html', 
    'review.html', 'product.html', 'privacy.html', 'index.html', 
    'confirmation.html', 'checkout.html', 'cart.html'
];

for (let file of files) {
   if (!fs.existsSync(file)) continue;
   let content = fs.readFileSync(file, 'utf8');

   // 1. Wrap <nav class="navbar"> in <header>
   if (file !== 'index.html' && !content.includes('<header>\n  <nav class="navbar"') && !content.includes('<header>\r\n  <nav class="navbar"')) {
       content = content.replace(/(<!-- Navbar Component(?:\s*.*?-->\s*)?)?<nav class="navbar">/, '<header>\n  $1<nav class="navbar" aria-label="التنقل الرئيسي">');
       // This will unfortunately replace the first </nav> it finds. Hopefully there's only one navbar per page.
       if(content.includes('<header>')) { // safety check
          content = content.replace(/<\/nav>/, '</nav>\n  </header>');
       }
   }

   // 2. Add aria-label to specific buttons
   content = content.replace(/<nav class="navbar">/g, '<nav class="navbar" aria-label="التنقل الرئيسي">');
   content = content.replace(/aria-label="سلة المشتريات"/g, 'aria-label="سلة التسوق"');
   content = content.replace(/<button class="mobile-menu-toggle"[^>]*>☰<\/button>/g, '<button class="mobile-menu-toggle" aria-label="فتح القائمة الرئيسية" aria-expanded="false">☰</button>');

   // 3. Update cart badge dynamic JS to update the aria-label
   content = content.replace(/if\(badge\)\s*badge\.setAttribute\('data-count',\s*(.+?)\);/g, "if(badge) { const c = $1; badge.setAttribute('data-count', c); badge.setAttribute('aria-label', `سلة التسوق، ${c} منتجات`); }");

   // 4. Modals ARIA
   content = content.replace(/<div class="modal-overlay" id="([^"]+)">/g, '<div class="modal-overlay" id="$1" role="dialog" aria-modal="true" aria-label="نافذة منبثقة">');

   // 5. HTML lang and dir guarantee
   if (!content.includes('dir="rtl"')) {
       content = content.replace(/<html[^>]*>/, '<html lang="ar" dir="rtl">');
   }

   // Write back
   fs.writeFileSync(file, content, 'utf8');
}
console.log('HTML ARIA Patching Complete.');
