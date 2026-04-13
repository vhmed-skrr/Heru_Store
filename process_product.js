const fs = require('fs');
let content = fs.readFileSync('product.html', 'utf8');

// 1. Navigation updates (Shared)
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

// Static UI Sections Wrap
const staticUI = [
    { from: '>(لا توجد تقييمات)</span>', to: '>(<span data-i18n="product.no_reviews">لا توجد تقييمات</span>)</span>' },
    { from: '>التحقق من المخزون...</span>', to: '><span data-i18n="product.check_stock">التحقق من المخزون...</span></span>' },
    { from: '>الكمية:</div>', to: '><span data-i18n="product.qty">الكمية:</span></div>' },
    { from: '>أضف للسلة الآن</button>', to: '><span data-i18n="product.add_to_cart">أضف للسلة الآن</span></button>' },
    { from: '>اطلب وتواصل واتساب</button>', to: '><span data-i18n="product.whatsapp">اطلب وتواصل واتساب</span></button>' },
    { from: '>مشاركة 💬</button>', to: '><span data-i18n="product.share">مشاركة 💬</span></button>' },
    { from: '>نسخ الرابط 🔗</button>', to: '><span data-i18n="product.copy_link">نسخ الرابط 🔗</span></button>' },
    
    // Tabs & Reviews Form
    { from: '>تفاصيل المنتج</button>', to: '><span data-i18n="product.tab_desc">تفاصيل المنتج</span></button>' },
    { from: '>التقييمات والآراء</button>', to: '><span data-i18n="product.tab_reviews">التقييمات والآراء</span></button>' },
    { from: '>منتجات مشابهة</button>', to: '><span data-i18n="product.tab_related">منتجات مشابهة</span></button>' },
    
    { from: '>أضف تقييمك الخاص</div>', to: '><span data-i18n="product.add_review">أضف تقييمك الخاص</span></div>' },
    { from: '>الاسم</label>', to: '><span data-i18n="product.rev_name">الاسم</span></label>' },
    { from: '>التقييم (من 1 لـ 5 نجوم)</label>', to: '><span data-i18n="product.rev_rating">التقييم (من 1 لـ 5 نجوم)</span></label>' },
    { from: '<option value="5">⭐⭐⭐⭐⭐ ممتاز جداً</option>', to: '<option value="5" data-i18n="product.rev_5_stars">⭐⭐⭐⭐⭐ ممتاز جداً</option>' },
    { from: '<option value="4">⭐⭐⭐⭐ عظيم</option>', to: '<option value="4" data-i18n="product.rev_4_stars">⭐⭐⭐⭐ عظيم</option>' },
    { from: '<option value="3">⭐⭐⭐ جيد كفاية</option>', to: '<option value="3" data-i18n="product.rev_3_stars">⭐⭐⭐ جيد كفاية</option>' },
    { from: '<option value="2">⭐⭐ مش أحسن حاجة</option>', to: '<option value="2" data-i18n="product.rev_2_stars">⭐⭐ مش أحسن حاجة</option>' },
    { from: '<option value="1">⭐ سيء</option>', to: '<option value="1" data-i18n="product.rev_1_stars">⭐ سيء</option>' },
    { from: '>تعليقك (اختياري)</label>', to: '><span data-i18n="product.rev_comment">تعليقك (اختياري)</span></label>' },
    { from: '>إرسال للتقييم</button>', to: '><span data-i18n="product.rev_submit">إرسال للتقييم</span></button>' },
    { from: '>* التقييم سيظهر للمستخدمين بمجرد مراجعته من الإدارة لضمان الجدية.</p>', to: '><span data-i18n="product.rev_note">* التقييم سيظهر للمستخدمين بمجرد مراجعته من الإدارة لضمان الجدية.</span></p>' },
    { from: '>\\r\\n                       شكرًا لتقييمك! سيظهر للجميع فور اعتماده وتقييمه عبر فريقنا.\\r\\n                  </div>', 
      to: '>\\r\\n                       <span data-i18n="product.rev_thanks">شكرًا لتقييمك! سيظهر للجميع فور اعتماده وتقييمه عبر فريقنا.</span>\\r\\n                  </div>' },
      
    // Sticky Mobile
    { from: '>المنتج</div>', to: '><span id="sticky-title-i18n" data-i18n="product.sticky_title">المنتج</span></div>' },
    { from: '>أضف للسلة</button>', to: '><span data-i18n="product.sticky_add">أضف للسلة</span></button>' }
];

staticUI.forEach(r => content = content.replace(r.from, r.to));

// Clean up newlines specifically for the thanks div if needed statically:
content = content.replace(
    'شكرًا لتقييمك! سيظهر للجميع فور اعتماده وتقييمه عبر فريقنا.',
    '<span data-i18n="product.rev_thanks">شكرًا لتقييمك! سيظهر للجميع فور اعتماده وتقييمه عبر فريقنا.</span>'
);

// 3. Dynamic JS replacement

// Categories fetch needs name_en
content = content.replace(
    `const { data: c } = await supabaseClient.from('categories').select('*').eq('id', p.category_id).single();`,
    `const { data: c } = await supabaseClient.from('categories').select('id, name_ar, name_en, color').eq('id', p.category_id).single();`
);

// Variables creation inside initUI()
content = content.replace(
    `const catName = category ? category.name_ar : 'عام';`,
    `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
              const catNameAr = category ? category.name_ar : 'عام';
              const catNameEn = category ? (category.name_en || category.name_ar) : 'General';
              const catName = currentLang === 'en' ? catNameEn : catNameAr;`
);

content = content.replace(
    `document.getElementById('lbl-name').innerText = product.name_ar;`,
    `const prodName = (currentLang === 'en' && product.name_en) ? product.name_en : product.name_ar;
              document.getElementById('lbl-name').innerText = prodName;`
);

// Breadcrumbs innerHTML
content = content.replace(
    `<a href="./">الرئيسية</a> <span>/</span> <a href="./shop">المتجر</a> <span>/</span>`,
    `<a href="./"><span data-i18n="nav.home">الرئيسية</span></a> <span>/</span> <a href="./shop"><span data-i18n="nav.shop">المتجر</span></a> <span>/</span>`
);
content = content.replace(
    `\${product.name_ar}</span>`,
    `\${prodName}</span>`
);

content = content.replace(
    `document.getElementById('sticky-title').innerText = product.name_ar.length > 20 ? product.name_ar.substring(0, 18) + '...' : product.name_ar;`,
    `document.getElementById('sticky-title').innerText = prodName.length > 20 ? prodName.substring(0, 18) + '...' : prodName;`
);

// Stock logic translation
content = content.replace(
    `stockEl.innerHTML = \`<span>✗</span> <span>نفذ المخزون تماماً</span>\`;`,
    `const msgOut = currentLang === 'en' ? 'Out of stock completely' : 'نفذ المخزون تماماً';
                  stockEl.innerHTML = \`<span>✗</span> <span>\${msgOut}</span>\`;`
);
content = content.replace(
    `document.getElementById('btn-add-cart').innerText = 'المخزون نفذ';`,
    `document.getElementById('btn-add-cart').innerText = currentLang === 'en' ? 'Sold Out' : 'المخزون نفذ';`
);
content = content.replace(
    `stockEl.innerHTML = \`<span>⚠️</span> <span>كمية محدودة جداً (\${maxStock} متبقي)</span>\`;`,
    `const msgLow = currentLang === 'en' ? \`Very low stock (\${maxStock} left)\` : \`كمية محدودة جداً (\${maxStock} متبقي)\`;
                  stockEl.innerHTML = \`<span>⚠️</span> <span>\${msgLow}</span>\`;`
);
content = content.replace(
    `stockEl.innerHTML = \`<span>✓</span> <span>متوفر في المخزون</span>\`;`,
    `const msgOk = currentLang === 'en' ? 'Available in stock' : 'متوفر في المخزون';
                  stockEl.innerHTML = \`<span>✓</span> <span>\${msgOk}</span>\`;`
);

// Attributes Translation Logic
content = content.replace(
    `if(product.attributes && Object.keys(product.attributes).length > 0) {
                  let h = '';
                  for (const [k, v] of Object.entries(product.attributes)) {
                      h += \`<div class="attr-item"><div class="attr-key">\${k}</div><div class="attr-val">\${v}</div></div>\`;
                  }
                  attrEl.innerHTML = h;`,
    `const attrs = (currentLang === 'en' && product.attributes_en) ? product.attributes_en : product.attributes;
              if(attrs && Object.keys(attrs).length > 0) {
                  let h = '';
                  for (const [k, v] of Object.entries(attrs)) {
                      h += \`<div class="attr-item"><div class="attr-key">\${k}</div><div class="attr-val">\${v}</div></div>\`;
                  }
                  attrEl.innerHTML = h;`
);
content = content.replace(
    `attrEl.innerHTML = \`<span style="color:var(--text-muted); font-size:13px;">لا توجد تفاصيل إضافية لهذا المنتج.</span>\`;`,
    `const attrMsg = currentLang === 'en' ? 'No additional details available.' : 'لا توجد تفاصيل إضافية لهذا المنتج.';
                  attrEl.innerHTML = \`<span style="color:var(--text-muted); font-size:13px;">\${attrMsg}</span>\`;`
);

// Description Tab
content = content.replace(
    `document.getElementById('tab-desc').innerHTML = \`<div style="white-space:pre-wrap;">\${product.description_ar || 'تفاصيل المنتج غير متوفرة حالياً.'}</div>\`;`,
    `const descEmptyMsg = currentLang === 'en' ? 'Product details not available here.' : 'تفاصيل المنتج غير متوفرة حالياً.';
              const prodDesc = (currentLang === 'en' && product.description_en) ? product.description_en : (product.description_ar || descEmptyMsg);
              document.getElementById('tab-desc').innerHTML = \`<div style="white-space:pre-wrap;">\${prodDesc}</div>\`;`
);

// Related render update for template ! Wait, the product.html uses its own 'tpl-product' for related.
content = content.replace(
    `<div class="product-price">{price} ج.م</div>`,
    `<div class="product-price">{price} <span data-i18n="card.currency">ج.م</span></div>`
);
content = content.replace(
    `let html = tpl.replace(/{id}/g, p.id).replace(/{name}/g, p.name_ar).replace(/{price}/g, p.price).replace(/{image}/g, img);`,
    `const relatedName = (currentLang === 'en' && p.name_en) ? p.name_en : p.name_ar;
                   let html = tpl.replace(/{id}/g, p.id).replace(/{name}/g, relatedName).replace(/{price}/g, p.price).replace(/{image}/g, img);`
);

// Verify rendering of reviews name (do not touch it, DB origin)
  // function loadReviews() uses loadReviews(). It doesn't have name_ar. It fetches reviews from DB.
  // Nothing to change there!

fs.writeFileSync('product.html', content, 'utf8');
console.log('product.html processed without modifying cart logic.');
