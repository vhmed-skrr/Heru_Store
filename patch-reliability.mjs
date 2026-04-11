import fs from 'fs';

const files = [
  'track-order.html', 'terms.html', 'suggest.html', 'shop.html', 
  'review.html', 'product.html', 'privacy.html', 'index.html', 
  'confirmation.html', 'checkout.html', 'cart.html'
];

const reliabilitySnippet = `
<!-- Vercel Performance & Reliability -->
<script defer src="/_vercel/speed-insights/script.js"></script>
<script defer src="/_vercel/insights/script.js"></script>
<script>
  window.addEventListener('error', (e) => {
      // Prevent verbose console if handled, silent UX failure mode
      if(window.showToast) window.showToast('حدث خطأ غير متوقع — حاول مرة أخرى', 'error');
  });
  window.addEventListener('unhandledrejection', (e) => {
      if(window.showToast) window.showToast('تم رفض الاتصال بالخادم — يرجى التواصل عبر الواتساب بدلاً من ذلك.', 'error');
  });
</script>
`;

for (let f of files) {
   if (!fs.existsSync(f)) continue;
   let text = fs.readFileSync(f, 'utf8');
   if(!text.includes('speed-insights/script.js')) {
       text = text.replace(/<\/body>/, reliabilitySnippet + '\n</body>');
       fs.writeFileSync(f, text);
   }
}
console.log('Reliability patched successfully!');
