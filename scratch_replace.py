import os
import re

directory = "d:/web/heru-store v2"
html_files = [f for f in os.listdir(directory) if f.endswith('.html')]

# Replacements array
style_replacements = [
    (r'style="background-color:\s*#080808"', 'style="background-color: var(--bg-primary)"'),
    (r'style="background:\s*#080808"', 'style="background: var(--bg-primary)"'),
    (r'style="background-color:\s*#0D0D0D"', 'style="background-color: var(--bg-secondary)"'),
    (r'style="background-color:\s*#141414"', 'style="background-color: var(--bg-card)"'),
    (r'style="background-color:\s*#1C1C1C"', 'style="background-color: var(--bg-elevated)"'),
    (r'style="background-color:\s*#060606"', 'style="background-color: var(--bg-secondary)"'),
    (r'style="background:\s*#060606"', 'style="background: var(--bg-secondary)"'),
    (r'style="color:\s*#F0EBE1"', 'style="color: var(--text-primary)"')
]

for filename in html_files:
    path = os.path.join(directory, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply inline style replacements
    for pattern, repl in style_replacements:
        content = re.sub(pattern, repl, content)
        
    # Fix dark text in intentional CTA section (it needs color: var(--text-inverse))
    # Let's find sections with style="background-color: var(--accent)" and manually patch its text colors if needed.
    # Actually wait, the instruction says "But ensure all text INSIDE it uses: color: var(--text-inverse)"
    # That might be complex with Python regex. Let's do a wider search and replace.
    # Typically, text inline color in dark sections might be #fff or #ffffff or var(--text-inverse).
    # But wait! I will solve the nested text manually later if regex is insufficient.
    # Let's first replace `<button class="theme-toggle btn-ghost" ...>☀️</button>`
    content = re.sub(r'<button\s+(?:[^>]*\s+)?class="[^"]*theme-toggle[^"]*"[^>]*>.*?</button>', '', content, flags=re.DOTALL)

    # Replace `<button data-lang-toggle ...>`
    content = re.sub(r'<button\s+(?:[^>]*\s+)?data-lang-toggle[^>]*>.*?</button>', '', content, flags=re.DOTALL)
    
    # Remove script src="./assets/js/i18n.js"
    content = re.sub(r'<script\s+src="\./assets/js/i18n\.js"\s*>\s*</script>', '', content)
    content = re.sub(r'<script\s+src="assets/js/i18n\.js"\s*>\s*</script>', '', content)
    
    # Remove data-i18n attributes completely wrapper: <span data-i18n="key">النص العربي</span> -> النص العربي
    # If the span has no other attributes, remove the tag.
    content = re.sub(r'<span\s+data-i18n="[^"]*"\s*>([^<]+)</span>', r'\1', content)
    # If the span has other attributes, just remove data-i18n
    content = re.sub(r'(\<[^>]+?)\sdata-i18n="[^"]*"([^>]*\>)', r'\1\2', content)

    # Remove data-i18n-placeholder
    content = re.sub(r'(\<[^>]+?)\sdata-i18n-placeholder="[^"]*"([^>]*\>)', r'\1\2', content)

    # Remove data-i18n-html
    content = re.sub(r'(\<[^>]+?)\sdata-i18n-html="[^"]*"([^>]*\>)', r'\1\2', content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML transformations complete.")
