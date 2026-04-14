import os
import re

directory = r"d:\web\heru-store v2"

# 1. Update checkout.html
checkout_path = os.path.join(directory, "checkout.html")
with open(checkout_path, "r", encoding="utf-8") as f:
    checkout_html = f.read()

# Add phone validation safely inside submitOrder
validation_str = """
              // Phone validation per phase4
              const _phoneStr = iPhone.value.trim() || '';
              if (!/^01[0125][0-9]{8}$/.test(_phoneStr)) {
                 window.showToast('رقم الهاتف غير صحيح', 'error');
                 return;
              }
"""

if "_phoneStr" not in checkout_html:
    checkout_html = checkout_html.replace(
        "window.submitOrder = async () => {",
        "window.submitOrder = async () => {\n" + validation_str
    )

# Fix loading state styling per prompt:
# Original: btnObj.classList.add('btn-loading');
# New: btnObj.disabled = true; btnObj.textContent = 'جارٍ معالجة الطلب...';

checkout_html = re.sub(
    r"btnObj\.classList\.add\('btn-loading'\);",
    r"btnObj.disabled = true;\n              btnObj.textContent = 'جارٍ معالجة الطلب...';",
    checkout_html
)

# Revert on error:
# Original: btnObj.classList.remove('btn-loading');
# New: btnObj.disabled = false; btnObj.textContent = 'تأكيد وإتمام الطلب الآن';

checkout_html = re.sub(
    r"btnObj\.classList\.remove\('btn-loading'\);",
    r"btnObj.disabled = false;\n                  btnObj.textContent = 'تأكيد وإتمام الطلب الآن';",
    checkout_html
)

# The cart is already checked via: if (cart.length === 0) { window.location.replace('/cart'); return; }
# Let's change it to redirect to /shop with message:
checkout_html = re.sub(
    r"if\s*\(\s*cart\.length\s*===\s*0\s*\)\s*\{\s*window\.location\.replace\('/cart'\);\s*return;\s*\}",
    r"if (cart.length === 0) { alert('السلة فارغة. جاري التوجيه.'); window.location.replace('/shop'); return; }",
    checkout_html
)

# The cart is already being cleared: localStorage.removeItem('heru_cart'); (already verified via view_file)

with open(checkout_path, "w", encoding="utf-8") as f:
    f.write(checkout_html)


# 2. Update Cloudinary logic in admin forms
cloudinary_fn = """async function uploadToCloudinary(file) {
  const cloudName = window.CLOUDINARY_CLOUD_NAME || 'di5ihjlkh';
  const preset    = window.CLOUDINARY_UPLOAD_PRESET || 'heru_products';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  if (!response.ok) {
    const err = await response.json();
    console.error('Cloudinary error:', err);
    throw new Error(err.error?.message || 'فشل رفع الصورة');
  }
  
  const data = await response.json();
  return data.secure_url;
}"""

# regex to find the entire async function uploadToCloudinary(...) { ... }
cloudinary_regex = re.compile(r'async\s+function\s+uploadToCloudinary\s*\([^)]*\)\s*{[\s\S]*?(?:return\s+data\.secure_url;|return\s+data\.url;)\s*}', re.MULTILINE)

admin_files = ['add-product.html', 'edit-product.html', 'add-category.html', 'edit-category.html']

for admin_file in admin_files:
    path = os.path.join(directory, "admin", admin_file)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = cloudinary_regex.sub(cloudinary_fn.replace('\\', '\\\\'), content)
        
        # fix caller `uploadToCloudinary(file, id)` -> `uploadToCloudinary(file)`
        new_content = re.sub(r'uploadToCloudinary\(file\s*,\s*[^)]+\)', 'uploadToCloudinary(file)', new_content)

        if new_content != content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)

print("Phase 4 fixes applied.")
