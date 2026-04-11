import fs from 'fs';

const files = [
  'track-order.html', 'terms.html', 'suggest.html', 'shop.html', 
  'review.html', 'product.html', 'privacy.html', 'index.html', 
  'confirmation.html', 'checkout.html', 'cart.html'
];

const cookieSnippet = `
<!-- Cookie Notice -->
<style>
  #cookie-notice {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: var(--bg-elevated);
    border-top: 1px solid var(--border);
    padding: var(--space-4) var(--space-6);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4);
    z-index: 9999;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.6);
    transform: translateY(100%);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  #cookie-notice.visible { transform: translateY(0); }
  .cookie-text { font-size: var(--text-sm); color: var(--text-secondary); flex: 1; }
  .cookie-actions { display: flex; gap: var(--space-3); flex-shrink:0; }
  @media(max-width: 600px) {
    #cookie-notice { flex-direction: column; text-align: center; padding: var(--space-4); margin-bottom:-1px;}
    .cookie-actions { width: 100%; }
    .cookie-actions button { flex: 1; padding: var(--space-3); }
  }
</style>
<div id="cookie-notice" role="dialog" aria-live="polite" aria-label="إشعار الخصوصية">
    <div class="cookie-text">
        نستخدم تقنية <strong>LocalStorage</strong> لحفظ سلة التسوق وتفضيلاتك. نحن لا نستخدم ملفات تعريف الارتباط (Cookies) للتتبع. يمكنك الاطلاع على <a href="/privacy" style="color:var(--accent); text-decoration:underline;">سياسة الخصوصية</a> لمزيد من التفاصيل.
    </div>
    <div class="cookie-actions">
        <button class="btn btn-primary" id="btn-accept-cookie" aria-label="موافق ومتابعة">موافق</button>
    </div>
</div>
<script>
  document.addEventListener('DOMContentLoaded', () => {
     if(!localStorage.getItem('heru_cookie_accepted')) {
         setTimeout(() => { const c = document.getElementById('cookie-notice'); if(c) c.classList.add('visible'); }, 800);
     }
     const btnC = document.getElementById('btn-accept-cookie');
     if(btnC) {
         btnC.addEventListener('click', () => {
             localStorage.setItem('heru_cookie_accepted', 'yes');
             document.getElementById('cookie-notice').classList.remove('visible');
         });
     }
  });
</script>
`;

for (let f of files) {
   if (!fs.existsSync(f)) continue;
   let text = fs.readFileSync(f, 'utf8');
   if(!text.includes('id="cookie-notice"')) {
       text = text.replace(/<\/body>/, cookieSnippet + '\n</body>');
       fs.writeFileSync(f, text);
   }
}
console.log('Cookie Notice injected successfully.');
