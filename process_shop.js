const fs = require('fs');
let content = fs.readFileSync('shop.html', 'utf8');

// 1. Navigation updates (Shared)
const navReplacements = [
    { from: '<a href="./" class="navbar-logo" data-setting="store_name">HERU</a>\n      <div class="navbar-links">\n          <a href="./">الرئيسية</a>\n          <a href="./shop" style="color: var(--accent);">المتجر</a>\n          <a href="./suggest">اقتراح تصميم</a>', 
      to: '<a href="./" class="navbar-logo" data-setting="store_name">HERU</a>\n      <div class="navbar-links">\n          <a href="./"><span data-i18n="nav.home">الرئيسية</span></a>\n          <a href="./shop" style="color: var(--accent);"><span data-i18n="nav.shop">المتجر</span></a>\n          <a href="./suggest"><span data-i18n="nav.suggest">اقتراح تصميم</span></a>' },

    { from: '<a href="./" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);">الرئيسية</a>', 
      to: '<a href="./" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);"><span data-i18n="nav.home">الرئيسية</span></a>' },
    { from: '<a href="./shop" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);">المتجر</a>', 
      to: '<a href="./shop" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);"><span data-i18n="nav.shop">المتجر</span></a>' },
    { from: '<a href="./suggest" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);">اقتراح تصميم</a>', 
      to: '<a href="./suggest" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);"><span data-i18n="nav.suggest">اقتراح تصميم</span></a>' }
];

navReplacements.forEach(r => content = content.replace(r.from, r.to));

// 2. Static UI Replacements
const staticReplacements = [
    { from: '>المتجر</span>', to: '><span data-i18n="nav.shop">المتجر</span></span>' },
    { from: '<h1 class="page-title">المتجر</h1>', to: '<h1 class="page-title"><span data-i18n="nav.shop">المتجر</span></h1>' },
    { from: 'placeholder="ابحث عن منتج، تصنيف..."', to: 'placeholder="ابحث عن منتج، تصنيف..." data-i18n-placeholder="nav.search_placeholder"' },
    { from: '⧸⧹</span> فلترة', to: '⧸⧹</span> <span data-i18n="shop.filters">فلترة</span>' },
    { from: '>الفلاتر والتصنيف</h3>', to: '><span data-i18n="shop.filters_title">الفلاتر والتصنيف</span></h3>' },
    
    // Chips & Options
    { from: '<button class="chip active" data-id="all">الكل</button>', to: '<button class="chip active" data-id="all"><span data-i18n="shop.filter_all">الكل</span></button>' },
    { from: '<option value="newest">الترتيب: الأحدث</option>', to: '<option value="newest" data-i18n="shop.sort_newest">الترتيب: الأحدث</option>' },
    { from: '<option value="rating">الأعلى تقييماً</option>', to: '<option value="rating" data-i18n="shop.sort_rating">الأعلى تقييماً</option>' },
    { from: '<option value="price_asc">السعر: من الأرخص للأغلى</option>', to: '<option value="price_asc" data-i18n="shop.sort_price_asc">السعر: من الأرخص للأغلى</option>' },
    { from: '<option value="price_desc">السعر: من الأغلى للأرخص</option>', to: '<option value="price_desc" data-i18n="shop.sort_price_desc">السعر: من الأغلى للأرخص</option>' },
    
    { from: '<option value="all">الحالة: الكل</option>', to: '<option value="all" data-i18n="shop.status_all">الحالة: الكل</option>' },
    { from: '<option value="available">متوفر فقط</option>', to: '<option value="available" data-i18n="shop.status_available">متوفر فقط</option>' },
    { from: '<option value="out">نفذ من المخزون</option>', to: '<option value="out" data-i18n="shop.status_out">نفذ من المخزون</option>' },
    
    { from: '>مسح الفلاتر</button>', to: '><span data-i18n="shop.clear_filters">مسح الفلاتر</span></button>' },
    { from: '>تحميل المزيد</button>', to: '><span data-i18n="shop.load_more">تحميل المزيد</span></button>' },
    
    // Compare bottom bar
    { from: '<strong id="compare-text">تقارن 2 منتجات</strong>', to: '<strong id="compare-text" data-i18n="shop.compare_text">تقارن المنتجات</strong>' },
    { from: 'onclick="clearCompare()">إلغاء</button>', to: 'onclick="clearCompare()"><span data-i18n="shop.compare_cancel">إلغاء</span></button>' },
    { from: 'onclick="openCompareModal()">قارن الآن</button>', to: 'onclick="openCompareModal()"><span data-i18n="shop.compare_now">قارن الآن</span></button>' },
    
    // Compare Modal
    { from: '<h3>مقارنة المنتجات</h3>', to: '<h3><span data-i18n="shop.compare_modal_title">مقارنة المنتجات</span></h3>' },
];

staticReplacements.forEach(r => content = content.replace(r.from, r.to));

// 3. Dynamic JS replacement
content = content.replace(
    `const { data, error } = await supabaseClient.from('categories').select('id, name_ar').eq('active', true);`,
    `const { data, error } = await supabaseClient.from('categories').select('id, name_ar, name_en').eq('active', true);`
);

content = content.replace(
    `categoryMap = cats.reduce((acc, c) => ({...acc, [c.id]: c.name_ar}), {});`,
    `categoryMap = cats.reduce((acc, c) => ({...acc, [c.id]: {ar: c.name_ar, en: c.name_en || c.name_ar}}), {});`
);

content = content.replace(
    `chipsContainer.insertAdjacentHTML('beforeend', \`<button class="chip" data-id="\${c.id}">\${c.name_ar}</button>\`);`,
    `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';\n                          const cName = (currentLang === 'en' && c.name_en) ? c.name_en : c.name_ar;\n                          chipsContainer.insertAdjacentHTML('beforeend', \`<button class="chip" data-id="\${c.id}">\${cName}</button>\`);`
);

// Empty state translation inside renderPage
content = content.replace(
    `let msg = activeFilters.q ? \`ما لقيناش نتائج لـ "\${activeFilters.q}"\` : 'لا توجد منتجات مطابقة للبحث.';`,
    `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
                  let baseMsg = (currentLang === 'en') ? 'No matching products found.' : 'لا توجد منتجات مطابقة للبحث.';
                  let searchMsg = (currentLang === 'en') ? \`No results for "\${activeFilters.q}"\` : \`ما لقيناش نتائج لـ "\${activeFilters.q}"\`;
                  let msg = activeFilters.q ? searchMsg : baseMsg;
                  let clearBtnTxt = (currentLang === 'en') ? 'Clear Filters' : 'مسح الفلتر';`
);

content = content.replace(
    `<button class="btn btn-secondary" onclick="document.getElementById('clear-filters-btn').click();">مسح الفلتر</button>`,
    `<button class="btn btn-secondary" onclick="document.getElementById('clear-filters-btn').click();">\${clearBtnTxt}</button>`
);

/////////////////////////
// Dynamic card mapping logic
/////////////////////////
content = content.replace(
    `const img = (p.images && p.images.length > 0) ? clThumb(p.images[0]) : 'https://placehold.co/400x400/141414/F0EBE1?text=Heru';`,
    `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
                  const img = (p.images && p.images.length > 0) ? clThumb(p.images[0]) : 'https://placehold.co/400x400/141414/F0EBE1?text=Heru';`
);

// We need to replace these carefully using Regex to prevent duplicating the block
content = content.replace(
    `const cName = categoryMap[p.category_id] || 'عام';`,
    `const catObj = categoryMap[p.category_id];
                  const cNameArr = catObj ? catObj.ar : 'عام';
                  const cNameEnn = catObj ? catObj.en : 'General';
                  const selectedCatName = (currentLang === 'en') ? cNameEnn : cNameArr;`
);

content = content.replace(
    `const badgeHtml = p.stock === 0 ? '<span class="badge-out">نفذ</span>' : '';`,
    `const outText = (currentLang === 'en') ? 'Sold Out' : 'نفذ';
                  const badgeHtml = p.stock === 0 ? \`<span class="badge-out">\${outText}</span>\` : '';
                  const selectedName = (currentLang === 'en' && p.name_en) ? p.name_en : p.name_ar;`
);

content = content.replace(
    `let html = tpl.replace(/{id}/g, p.id)\n                                .replace(/{name}/g, p.name_ar)`,
    `let html = tpl.replace(/{id}/g, p.id)\n                                .replace(/{name}/g, selectedName)`
);

content = content.replace(
    `.replace(/{catName}/g, cName)`,
    `.replace(/{catName}/g, selectedCatName)`
);

// We need to translate "عرض سريع" inside the product template and "قارن" inside label
content = content.replace(
    `<label for="cmp_{id}">قارن</label>`,
    `<label for="cmp_{id}"><span data-i18n="shop.compare">قارن</span></label>`
);
content = content.replace(
    `<div class="prod-overlay">عرض سريع</div>`,
    `<div class="prod-overlay"><span data-i18n="card.quick_view">عرض سريع</span></div>`
);
content = content.replace(
    `{price} ج.م`,
    `{price} <span data-i18n="card.currency">ج.م</span>`
);

fs.writeFileSync('shop.html', content, 'utf8');
console.log('shop.html processed successfully.');
