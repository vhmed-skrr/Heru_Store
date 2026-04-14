import os
import re

directory = r"d:\web\heru-store v2"

html_files = []
for root, dirs, files in os.walk(directory):
    if "admin" in root or root == directory:
        for f in files:
            if f.endswith(".html"):
                html_files.append(os.path.join(root, f))

for path in html_files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    is_admin = 'admin\\' in path or 'admin/' in path
    prefix = "../" if is_admin else "./"
    
    # Remove any existing supabase tags to avoid duplicates
    content = re.sub(r'<script\s+src="[^"]*supabase[^\.]*\.min\.js"[^>]*>\s*</script>\s*', '', content)
    content = re.sub(r'<script\s+src="[^"]*supabase\.js"[^>]*>\s*</script>\s*', '', content)

    # We want to inject these before the first custom JS file or at the top of scripts
    lib_path = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"
    prefix_path = prefix + "assets/js/supabase.js"
    
    insert_str = f'<script src="{lib_path}"></script>\n<script src="{prefix_path}"></script>\n'
    
    # To place it "before </body>" but also "before any page-specific scripts":
    # Let's find the first <script> tag that is NOT ld+json in the document.
    # Actually, nav.js or other things might be in <head>. But let's just insert it right before the first script that comes AFTER <body> starts.
    body_start_idx = content.find('<body')
    if body_start_idx == -1: continue
    
    # search for the first <script in the body
    script_in_body_match = re.search(r'<script', content[body_start_idx:])
    
    if script_in_body_match:
        idx = body_start_idx + script_in_body_match.start()
        content = content[:idx] + insert_str + content[idx:]
    else:
        # no scripts in body? just put before </body>
        content = content.replace('</body>', insert_str + '</body>')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Supabase script tags injected successfully.")
