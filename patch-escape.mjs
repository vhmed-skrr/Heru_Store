import fs from 'fs';

const files = ['track-order.html', 'terms.html', 'suggest.html', 'shop.html', 'review.html', 'privacy.html', 'index.html', 'confirmation.html', 'checkout.html', 'cart.html'];

const scriptStr = `
<script>
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
        document.querySelectorAll('.mobile-menu.open, .filter-overlay.open, .filters-wrapper.open, .modal-overlay.open').forEach(el => el.classList.remove('open'));
    }
});
</script>
</body>`;

for(let f of files) {
   if (!fs.existsSync(f)) continue;
   let text = fs.readFileSync(f, 'utf8');
   if(!text.includes("if(e.key === 'Escape') {")) {
       text = text.replace(/<\/body>/, scriptStr);
       fs.writeFileSync(f, text);
   }
}
console.log('Escape patch done.');
