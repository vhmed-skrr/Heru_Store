import os
import re

directory = r"d:\web\heru-store v2"

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = os.path.basename(filepath)
    changed = False

    # 1. "اكتشف القصة" in index.html
    if filename == "index.html":
        # we know it says href="/about-story.html" or similar.
        new_content = re.sub(r'(<a\s+href=")[^"]*("\s*class="btn btn-secondary btn-lg">اكتشف القصة</a>)', r'\1./about-story\2', content)
        if new_content != content:
            content = new_content
            changed = True

    # 2. Add social media CSS to responsive.css
    if filename == "responsive.css":
        css_addition = """
.social-link[href=""],
.social-link:not([href]) {
  display: none !important;
}
"""
        if ".social-link[href=\"\"]" not in content:
            content += css_addition
            changed = True

    # 3. Announcement Bar string logic in index.html
    if filename == "index.html":
        announcement_js = """
async function loadAnnouncement() {
  try {
    const { data } = await window.supabaseClient
      .from('settings')
      .select('value')
      .eq('key', 'announcement_active')
      .single();
    
    if (data?.value === 'false') {
      const bar = document.querySelector('.marquee-bar, .announcement-bar, #announcement-bar');
      if (bar) bar.style.display = 'none';
    }
  } catch(e) {}
}
loadAnnouncement();
"""
        if "loadAnnouncement()" not in content:
            content = content.replace("</body>", f"<script>\n{announcement_js}\n</script>\n</body>")
            changed = True

    # 4. Categories logic in index.html
    if filename == "index.html":
        # The line is currently: container.innerHTML = emptyStateHTML('لا توجد تصنيفات حالياً');
        # Prompt requires: <p style="color:var(--text-muted);text-align:center;">لا توجد تصنيفات متاحة حالياً</p>
        old_empty = "container.innerHTML = emptyStateHTML('لا توجد تصنيفات حالياً');"
        new_empty = "container.innerHTML = '<p style=\"color:var(--text-muted);text-align:center;\">لا توجد تصنيفات متاحة حالياً</p>';"
        if old_empty in content:
            content = content.replace(old_empty, new_empty)
            changed = True
        
        # Ensure categories fetch includes .eq('active', true).order('sort_order')
        # It's already there: .eq('active', true).order('sort_order', { ascending: true });
        
    # 5. Product card quick add (tpl-product)
    if "tpl-product" in content:
        # replace the onclick attribute entirely
        # The old attribute looks like: onclick="window.quickAddToCart(event, '{id}', '{product_data}', this)"
        old_onclick_regex = r'onclick="window\.quickAddToCart[^"]*"'
        # Given the placeholder logic, we must use {id}, {name}, {price} instead of ${product.id} if we are inside a <template> block to not break replacement logic.
        new_onclick = 'onclick="event.stopPropagation(); window.handleQuickAdd(\'{id}\', \'{name}\', {price})"'
        new_c = re.sub(old_onclick_regex, new_onclick, content)
        if new_c != content:
            content = new_c
            changed = True

    # Inject handleQuickAdd if it doesn't exist
    if "handleQuickAdd" in content and "async function handleQuickAdd(" not in content:
        quick_add_js = """
window.handleQuickAdd = async function(id, name, price) {
  const { addToCart } = await import('./assets/js/data.js');
  addToCart({ id, name_ar: name, price }, 1);
  // Update badge
  const badge = document.querySelector('.cart-badge, #cart-count');
  if (badge) {
    const count = parseInt(localStorage.getItem('heru_cart') 
      ? JSON.parse(localStorage.getItem('heru_cart')).reduce((s,i) => s+i.quantity, 0) 
      : 0);
    badge.textContent = count; // Ensure textContent is set
    badge.setAttribute('data-count', count);
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  // Visual feedback
  const btn = event.currentTarget;
  const originalBg = btn.style.background;
  btn.style.background = '#16A34A';
  setTimeout(() => btn.style.background = originalBg, 600);
};
"""
        if "window.handleQuickAdd =" not in content:
            content = content.replace("</body>", f"<script>\n{quick_add_js}\n</script>\n</body>")
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk(directory):
    for f in files:
        if f.endswith(('.html', '.css')):
            update_file(os.path.join(root, f))

print("Phase 3 updates completed.")
