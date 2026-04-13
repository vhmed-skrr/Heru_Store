const fs = require('fs');
let content = fs.readFileSync('cart.html', 'utf8');

// Shared Navigation
const navReplacements = [
    { from: '<a href="./" class="navbar-logo" data-setting="store_name">HERU</a>\n      <div class="navbar-links">\n          <a href="./">الرئيسية</a>\n          <a href="./shop">المتجر</a>\n          <a href="./suggest">اقتراح تصميم</a>', 
      to: '<a href="./" class="navbar-logo" data-setting="store_name">HERU</a>\n      <div class="navbar-links">\n          <a href="./"><span data-i18n="nav.home">الرئيسية</span></a>\n          <a href="./shop"><span data-i18n="nav.shop">المتجر</span></a>\n          <a href="./suggest"><span data-i18n="nav.suggest">اقتراح تصميم</span></a>' },
    { from: '<a href="./" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);">الرئيسية</a>', 
      to: '<a href="./" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);"><span data-i18n="nav.home">الرئيسية</span></a>' },
    { from: '<a href="./shop" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);">المتجر</a>', 
      to: '<a href="./shop" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);"><span data-i18n="nav.shop">المتجر</span></a>' },
    { from: '<a href="./suggest" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);">اقتراح تصميم</a>', 
      to: '<a href="./suggest" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);"><span data-i18n="nav.suggest">اقتراح تصميم</span></a>' }
];

navReplacements.forEach(r => content = content.replace(r.from, r.to));

const staticUI = [
    { from: '<span style="font-weight:600; color:var(--text-primary);">سلة المشتريات</span>', to: '<span style="font-weight:600; color:var(--text-primary);"><span data-i18n="cart.breadcrumb">سلة المشتريات</span></span>' },
    { from: '<h1 class="page-title">عناصر السلة</h1>', to: '<h1 class="page-title"><span data-i18n="cart.title">عناصر السلة</span></h1>' },
    { from: '<h3 style="margin: 0 0 var(--space-6) 0;">ملخص الطلب الأساسي</h3>', to: '<h3 style="margin: 0 0 var(--space-6) 0;"><span data-i18n="cart.summary_title">ملخص الطلب الأساسي</span></h3>' },
    { from: '<span>المجموع الفرعي:</span>', to: '<span><span data-i18n="cart.subtotal">المجموع الفرعي:</span></span>' },
    { from: '<span>الخصم (كوبون):</span>', to: '<span><span data-i18n="cart.discount">الخصم (كوبون):</span></span>' },
    { from: '<span>رسوم الشحن التوصيل:</span>', to: '<span><span data-i18n="cart.shipping">رسوم الشحن التوصيل:</span></span>' },
    { from: '<span style="color:var(--success);">مجاني بالكامل!</span>', to: '<span style="color:var(--success);"><span data-i18n="cart.free_shipping">مجاني بالكامل!</span></span>' },
    { from: '<span>الإجمالي:</span>', to: '<span><span data-i18n="cart.total">الإجمالي:</span></span>' },
    { from: 'placeholder="لديك كود خصم؟"', to: 'placeholder="لديك كود خصم؟" data-i18n-placeholder="cart.coupon_placeholder"' },
    { from: 'id="btn-coupon">تطبيق</button>', to: 'id="btn-coupon"><span data-i18n="cart.coupon_apply">تطبيق</span></button>' },
    { from: 'id="btn-checkout" style="font-size:var(--text-xl);">بدء إتمام الطلب الآن</button>', to: 'id="btn-checkout" style="font-size:var(--text-xl);"><span data-i18n="cart.checkout_btn">بدء إتمام الطلب الآن</span></button>' },
    
    // Empty state
    { from: '>سلتك فارغة، أضف السعادة فيها!</h2>', to: '><span data-i18n="cart.empty_title">سلتك فارغة، أضف السعادة فيها!</span></h2>' },
    { from: '>لم تقم بشراء أي منتجات حتى الآن.</p>', to: '><span data-i18n="cart.empty_desc">لم تقم بشراء أي منتجات حتى الآن.</span></p>' },
    { from: '>تسوّق أحدث المنتجات</button>', to: '><span data-i18n="cart.shop_now">تسوّق أحدث المنتجات</span></button>' },
    
    // Cookie Button Message
    { from: 'id="btn-accept-cookie" aria-label="موافق ومتابعة">موافق</button>', to: 'id="btn-accept-cookie" aria-label="موافق ومتابعة"><span data-i18n="cart.cookie_btn">موافق</span></button>' }
];

staticUI.forEach(r => content = content.replace(r.from, r.to));

// Fix cookie statement 
content = content.replace(
    `نستخدم تقنية <strong>LocalStorage</strong> لحفظ سلة التسوق وتفضيلاتك. نحن لا نستخدم ملفات تعريف الارتباط (Cookies) للتتبع. يمكنك الاطلاع على <a href="./privacy" style="color:var(--accent); text-decoration:underline;">سياسة الخصوصية</a> لمزيد من التفاصيل.`,
    `<span data-i18n-html="cart.cookie_notice">نستخدم تقنية <strong>LocalStorage</strong> لحفظ سلة التسوق وتفضيلاتك. نحن لا نستخدم ملفات تعريف الارتباط (Cookies) للتتبع. يمكنك الاطلاع على <a href="./privacy" style="color:var(--accent); text-decoration:underline;">سياسة الخصوصية</a> لمزيد من التفاصيل.</span>`
);

// Dynamic rendering updates:
content = content.replace(
    `<div class="cart-item-price">\${item.price} ج.م لكل قطعة</div>`,
    `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
                           const priceTxt = (currentLang === 'en') ? 'EGP per item' : 'ج.م لكل قطعة';
                           html += \`\n...
<div class="cart-item-price">\${item.price} \${priceTxt}</div>`.replace('html += `\n...', '')
);

content = content.replace(
    `<button class="btn-remove" onclick="window.removeItem('\${item.id}')">✕ إزالة العنصر</button>`,
    `const removeTxt = (currentLang === 'en') ? 'Remove Item' : 'إزالة العنصر';
                           const htmlbtn = \`<button class="btn-remove" onclick="window.removeItem('\${item.id}')">✕ \${removeTxt}</button>\`;
                           html += \`\n...\${htmlbtn}\`.replace('html += \`\n...\${htmlbtn}\`', htmlbtn)`
);

// Wait, the `.replace` above using html += ... logic is messy. Instead I will target exactly the JS block:
// First, find the block:
const blockFind = 
`                  html += \`
                  <div class="cart-item">
                       <img src="\${item.image}" alt="" class="cart-item-img">
                       <div class="cart-item-details">
                           <h3 class="cart-item-title"><a href="./product?id=\${item.id}">\${item.name}</a></h3>
                           <div class="cart-item-price">\${item.price} ج.م لكل قطعة</div>
                       </div>
                       <div class="cart-item-controls">
                           <div class="quantity-selector">
                               <button class="quantity-btn" onclick="window.updateQty('\${item.id}', -1)">−</button>
                               <input type="number" class="quantity-input" value="\${item.quantity}" readonly>
                               <button class="quantity-btn" onclick="window.updateQty('\${item.id}', 1)">+</button>
                           </div>
                           <button class="btn-remove" onclick="window.removeItem('\${item.id}')">✕ إزالة العنصر</button>
                       </div>
                  </div>
                  \`;`;

const blockReplace =
`                  const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
                  const priceTxt = (currentLang === 'en') ? 'EGP per item' : 'ج.م لكل قطعة';
                  const removeTxt = (currentLang === 'en') ? 'Remove Item' : 'إزالة العنصر';
                  
                  html += \`
                  <div class="cart-item">
                       <img src="\${item.image}" alt="" class="cart-item-img">
                       <div class="cart-item-details">
                           <h3 class="cart-item-title"><a href="./product?id=\${item.id}">\${item.name}</a></h3>
                           <div class="cart-item-price">\${item.price} \${priceTxt}</div>
                       </div>
                       <div class="cart-item-controls">
                           <div class="quantity-selector">
                               <button class="quantity-btn" onclick="window.updateQty('\${item.id}', -1)">−</button>
                               <input type="number" class="quantity-input" value="\${item.quantity}" readonly>
                               <button class="quantity-btn" onclick="window.updateQty('\${item.id}', 1)">+</button>
                           </div>
                           <button class="btn-remove" onclick="window.removeItem('\${item.id}')">✕ \${removeTxt}</button>
                       </div>
                  </div>
                  \`;`;
content = content.replace(blockFind, blockReplace);


// Coupon Messages
content = content.replace(
    `document.getElementById('lbl-coupon-msg').innerText = 'تم إلغاء الكوبون لعدم استيفاء الحد الأدنى للطلب.';`,
    `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
                      document.getElementById('lbl-coupon-msg').innerText = (currentLang === 'en') ? 'Coupon cancelled: minimum order not met.' : 'تم إلغاء الكوبون لعدم استيفاء الحد الأدنى للطلب.';`
);

content = content.replace(
    `document.getElementById('lbl-coupon-msg').innerText = \`✓ كود خصم (\${activeCoupon.code}) فعال وتم التطبيق\`;`,
    `document.getElementById('lbl-coupon-msg').innerText = (currentLang === 'en') ? \`✓ Coupon (\${activeCoupon.code}) applied successfully\` : \`✓ كود خصم (\${activeCoupon.code}) فعال وتم التطبيق\`;`
);

content = content.replace(
    `document.getElementById('btn-coupon').innerText = 'تحديث المراجعة';`,
    `document.getElementById('btn-coupon').innerText = (currentLang === 'en') ? 'Update' : 'تحديث المراجعة';`
);

// Form errors
content = content.replace(
    `if(error || !data) throw new Error('كود الخصم غير صالح أو لا يوجد');
                  if(data.max_uses && data.uses_count >= data.max_uses) throw new Error('الكود تجاوز عدد مرات الاستخدام المسموحة');
                  if(data.expires_at && new Date(data.expires_at) < new Date()) throw new Error('تم انتهاء مدة صلاحية هذا الكود');
                  if(data.min_order && subtotal < data.min_order) throw new Error(\`الحد الأدنى لتطبيق الكود هو \${data.min_order} جنيه\`);`,
     `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
                  if(error || !data) throw new Error(currentLang === 'en' ? 'Invalid or missing coupon code' : 'كود الخصم غير صالح أو لا يوجد');
                  if(data.max_uses && data.uses_count >= data.max_uses) throw new Error(currentLang === 'en' ? 'Coupon exceeded maximum uses' : 'الكود تجاوز عدد مرات الاستخدام المسموحة');
                  if(data.expires_at && new Date(data.expires_at) < new Date()) throw new Error(currentLang === 'en' ? 'Coupon expired' : 'تم انتهاء مدة صلاحية هذا الكود');
                  if(data.min_order && subtotal < data.min_order) throw new Error(currentLang === 'en' ? \`Minimum order for this coupon is \${data.min_order} EGP\` : \`الحد الأدنى لتطبيق الكود هو \${data.min_order} جنيه\`);`
);

content = content.replace(
    `window.showToast('كود الخصم سارٍ وتم التطبيق!', 'success');`,
    `window.showToast(currentLang === 'en' ? 'Coupon applied successfully!' : 'كود الخصم سارٍ وتم التطبيق!', 'success');`
);

fs.writeFileSync('cart.html', content, 'utf8');
console.log('cart.html processed safely.');
