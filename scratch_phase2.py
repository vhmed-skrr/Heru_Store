import os
import re

directory = r"d:\web\heru-store v2"

# 1. Fetch all html files
html_files = []
for root, dirs, files in os.walk(directory):
    if "admin" in root or root == directory:
        for f in files:
            if f.endswith(".html"):
                html_files.append(os.path.join(root, f))

SINGLE_MOBILE_MENU_JS = """// Mobile Menu
(function() {
  const menu    = document.querySelector('.mobile-menu');
  const toggles = document.querySelectorAll('.mobile-menu-toggle');
  if (!menu || !toggles.length) return;

  // Create overlay
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu()  {
    menu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open buttons (☰ hamburger)
  toggles.forEach(btn => {
    if (!btn.closest('.mobile-menu')) {
      btn.addEventListener('click', openMenu);
    }
  });

  // Close button inside menu (✕)
  const closeBtn = menu.querySelector('.mobile-menu-toggle');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Overlay click closes
  overlay.addEventListener('click', closeMenu);

  // Escape key closes
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();"""

for path in html_files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    is_admin = 'admin\\' in path or 'admin/' in path
    prefix = "../" if is_admin else "./"
    
    # 1. Viewport Meta
    if '<meta name="viewport"' not in content:
        content = re.sub(r'(<head(?:[^>]*)>)', r'\1\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">', content, count=1)
        
    # 2. Disable old scripts
    content = re.sub(r'<script\s+src="[^"]*assets/js/theme\.js"(?:\s+defer)?(?:\s+)?>\s*</script>', '', content)
    content = re.sub(r'<script\s+src="[^"]*assets/js/i18n\.js"(?:\s+defer)?(?:\s+)?>\s*</script>', '', content)
    
    # Remove themes.css
    content = re.sub(r'<link[^>]+themes\.css[^>]*>\s*', '', content)

    # 3. CSS load order
    css_regex = r'(<link[^>]+(?:tokens|base|components|responsive)\.css[^>]+>\s*)'
    matches = list(re.finditer(css_regex, content))
    
    if matches:
        first_css_pos = matches[0].start()
        content = re.sub(css_regex, '', content)
        ordered_css = f"""<link rel="stylesheet" href="{prefix}assets/css/tokens.css">
<link rel="stylesheet" href="{prefix}assets/css/base.css">
<link rel="stylesheet" href="{prefix}assets/css/components.css">
<link rel="stylesheet" href="{prefix}assets/css/responsive.css">\n"""
        content = content[:first_css_pos] + ordered_css + content[first_css_pos:]

    # 4. Mobile Menu JS Logic
    # Let's cleanly replace the exact existing logic
    # First, let's find the script block containing the logic
    script_regex = re.compile(r'<script>\s*(const\s+menuToggles\s*=[\s\S]*?)</script>', re.IGNORECASE)
    
    def repl_script(m):
        inner = m.group(1)
        # Verify it's the mobile menu logic
        if "document.querySelector('.mobile-menu')" in inner:
            # We replace only the mobile menu parts, or the whole block?
            # Since the prompt says "Replace the mobile menu toggle logic with this SINGLE implementation:"
            # If the script block contains ONLY mobile menu logic + maybe some backdrop logic, replace the whole thing.
            # Some pages might have a massive script, so let's carefully replace ONLY the mobile menu fragment inside the text
            # Often, "const menuToggles = ... document.querySelectorAll('.mobile-menu.open..." ends it.
            # It's safer to just remove known mobile menu vars.
            pass
        return m.group(0)

    # Actually, a simpler robust way (which will work 99% of cases here):
    # Find block starting with "const menuToggles = " or similar. 
    # Let's identify the mobile menu section in Heru Store v2.
    mobile_menu_pattern = r'(//\s*Mobile Menu|const menuToggles\s*=\s*document\.querySelectorAll\(\'\.mobile-menu-toggle\'\);)[\s\S]*?(?=(?:// [A-Z]|</script>|\n\s*const|\n\s*let|\n\s*document\.addEventListener\(\'DOMContentLoaded\'))'
    
    # Many pages have `const menuToggles = ...` down to the Escape key event listener.
    # Let's remove any instances of document.querySelector('.mobile-menu') toggling.
    match_mobile = re.search(r'const menuToggles\s*=\s*document\.querySelectorAll\(\'\.mobile-menu-toggle\'\);[\s\S]*?}\)?;', content)
    
    # We will just append our new script right before </body> and strip the old typical lines:
    content = re.sub(r'const menuToggles\s*=\s*document\.querySelectorAll\(\'\.mobile-menu-toggle\'\);', '', content)
    content = re.sub(r'const mobileMenu\s*=\s*document\.querySelector\(\'\.mobile-menu\'\);', '', content)
    content = re.sub(r'let backdrop\s*=\s*document\.querySelector\(\'\.mobile-menu-backdrop\'\);.*?backdrop\.className\s*=\s*\'mobile-menu-backdrop\';.*?document\.body\.appendChild\(backdrop\);', '', content, flags=re.DOTALL)
    content = re.sub(r'if \(!backdrop\) {[\s\S]*?body\.appendChild\(backdrop\);[\s\S]*?}', '', content)
    content = re.sub(r'menuToggles\.forEach.*?\);', '', content, flags=re.DOTALL)
    content = re.sub(r'if \(backdrop\) {.*?}', '', content, flags=re.DOTALL)
    content = re.sub(r'const closeMenuBtn.*?null;', '', content, flags=re.DOTALL)
    content = re.sub(r'if \(closeMenuBtn\).*?;', '', content)
    
    # Insert new mobile menu JS at bottom
    # Only if there's a mobile menu in the DOM
    if 'mobile-menu' in content:
        content = content.replace('</body>', f'<script>\n{SINGLE_MOBILE_MENU_JS}\n</script>\n</body>')

    # 5. JS Script Loading Order
    # Find supabase
    supabase_lib = r'<script\s+src="[^"]*supabase[^\.]*\.min\.js"[^>]*>\s*</script>\s*'
    supabase_local = r'<script\s+src="[^"]*supabase\.js"[^>]*>\s*</script>\s*'
    
    lib_match = re.search(supabase_lib, content)
    loc_match = re.search(supabase_local, content)
    
    if lib_match or loc_match:
        # remove them from current places
        content = re.sub(supabase_lib, '', content)
        content = re.sub(supabase_local, '', content)
        
        # inject just before the first remaining <script src="..."> or before </body>
        # actually, it's easier to inject before ANY app scripts. Let's find first `<script src="`
        first_script = content.find('<script src="')
        prefix_path = prefix + "assets/js/supabase.js"
        lib_path = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"
        
        insert_block = f'<script src="{lib_path}"></script>\n<script src="{prefix_path}"></script>\n'
        
        if first_script != -1:
            content = content[:first_script] + insert_block + content[first_script:]
        else:
            # put before </body>
            content = content.replace('</body>', insert_block + '</body>')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Batch HTML processing complete.")
