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

    # Remove all incorrect/duplicate supabase script tags
    content = re.sub(r'<script src="https://cdn\.jsdelivr\.net/npm/@supabase/supabase-js@2"></script>\s*', '', content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
