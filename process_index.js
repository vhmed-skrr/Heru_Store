const fs = require('fs');

const idxHtml = 'index.html';
let content = fs.readFileSync(idxHtml, 'utf8');

// 1. Add i18n.js to <head> without defer
if (!content.includes('assets/js/i18n.js')) {
    content = content.replace('</head>', '  <script src="./assets/js/i18n.js"></script>\n</head>');
} else if (content.includes('<script src="./assets/js/i18n.js" defer></script>')) {
    content = content.replace('<script src="./assets/js/i18n.js" defer></script>', '<script src="./assets/js/i18n.js"></script>');
}

// Map exact strings to their span replacements
const replacements = [
    // Navbar links
    { from: '<a href="./" data-ar="الرئيسية" data-en="Home">الرئيسية</a>', to: '<a href="./"><span data-i18n="nav.home">الرئيسية</span></a>' },
    { from: '<a href="./shop" data-ar="المتجر" data-en="Shop">المتجر</a>', to: '<a href="./shop"><span data-i18n="nav.shop">المتجر</span></a>' },
    { from: '<a href="./suggest" data-ar="اقترح تصميم" data-en="Suggest Design">اقتراح تصميم</a>', to: '<a href="./suggest"><span data-i18n="nav.suggest">اقتراح تصميم</span></a>' },
    
    // Mobile links
    { from: 'data-ar="الرئيسية" data-en="Home">الرئيسية</a>', to: '><span data-i18n="nav.home">الرئيسية</span></a>' },
    { from: 'data-ar="المتجر" data-en="Shop">المتجر</a>', to: '><span data-i18n="nav.shop">المتجر</span></a>' },
    { from: 'data-ar="اقترح تصميم" data-en="Suggest Design">اقتراح تصميم</a>', to: '><span data-i18n="nav.suggest">اقتراح تصميم</span></a>' },
    
    // Marquee
    { from: '🔥 شحن مجاني على كل الطلبات &nbsp;&nbsp;|&nbsp;&nbsp; تصاميم شبابية حصرية &nbsp;&nbsp;|&nbsp;&nbsp; اقترح تصميمك لطباعته &nbsp;&nbsp;|&nbsp;&nbsp; 🔥 شحن مجاني على كل الطلبات &nbsp;&nbsp;|&nbsp;&nbsp; تصاميم شبابية حصرية', to: '<span data-i18n-html="anno.text">🔥 شحن مجاني على كل الطلبات &nbsp;&nbsp;|&nbsp;&nbsp; تصاميم شبابية حصرية &nbsp;&nbsp;|&nbsp;&nbsp; اقترح تصميمك لطباعته</span>' },
    
    // Search
    { from: '<span class="nav-search__hint" aria-hidden="true">ابحث</span>', to: '<span class="nav-search__hint" aria-hidden="true"><span data-i18n="nav.search_aria">ابحث</span></span>' },
    { from: 'placeholder="ابحث عن منتج..."', to: 'placeholder="ابحث عن منتج..." data-i18n-placeholder="nav.search_placeholder"' },
    
    // Hero
    { from: 'data-setting="hero_title">صمّم بصمتك</h1>', to: 'data-setting="hero_title"><span data-i18n="hero.title">صمّم بصمتك</span></h1>' },
    { from: 'data-setting="hero_subtitle">منتجات شبابية بتصاميم مختلفة — فقط في هيرو</p>', to: 'data-setting="hero_subtitle"><span data-i18n="hero.subtitle">منتجات شبابية بتصاميم مختلفة — فقط في هيرو</span></p>' },
    { from: 'hero_cta_primary">تسوّق الآن</a>', to: 'hero_cta_primary"><span data-i18n="hero.btn_primary">تسوّق الآن</span></a>' },
    { from: 'hero_cta_secondary">اقترح تصميم</a>', to: 'hero_cta_secondary"><span data-i18n="hero.btn_secondary">اقترح تصميم</span></a>' },
    
    // Trust bar
    { from: '<span>شحن مجاني</span>', to: '<span data-i18n="trust.shipping">شحن مجاني</span>' },
    { from: '<span>جودة مضمونة</span>', to: '<span data-i18n="trust.quality">جودة مضمونة</span>' },
    { from: '<span>دعم واتساب</span>', to: '<span data-i18n="trust.support">دعم واتساب</span>' },
    { from: '<span>تصاميم حصرية</span>', to: '<span data-i18n="trust.designs">تصاميم حصرية</span>' },
    
    // Sections
    { from: '>تسوّق حسب الفئة</h2>', to: '><span data-i18n="home.categories_title">تسوّق حسب الفئة</span></h2>' },
    { from: '>الأكثر طلباً</h2>', to: '><span data-i18n="home.featured_title">الأكثر طلباً</span></h2>' },
    { from: '>عرض الكل ←</a>', to: '><span data-i18n="home.featured_btn">عرض الكل ←</span></a>' },
    { from: '>وصل حديثاً</h2>', to: '><span data-i18n="home.new_title">وصل حديثاً</span></h2>' },
    { from: '>تسوّق الجديد ←</a>', to: '><span data-i18n="home.new_btn">تسوّق الجديد ←</span></a>' },
    { from: '>إيه رأي عملاءنا</h2>', to: '><span data-i18n="home.reviews_title">إيه رأي عملاءنا</span></h2>' },
    { from: '>أضف تقييمك</button>', to: '><span data-i18n="home.reviews_btn">أضف تقييمك</span></button>' },
    { from: '>عندك تصميم في بالك؟</h2>', to: '><span data-i18n="home.cta_title">عندك تصميم في بالك؟</span></h2>' },
    { from: 'btn-lg">اقترح الآن</a>', to: 'btn-lg"><span data-i18n="home.cta_btn">اقترح الآن</span></a>' },
    
    // Footer
    { from: '>متجر هيرو للمنتجات الشبابية. بنقدم لك منتجات بتعبر عن أسلوب حياتك وروحك المختلفة.</p>', to: '><span data-i18n="footer.desc">متجر هيرو للمنتجات الشبابية. بنقدم لك منتجات بتعبر عن أسلوب حياتك وروحك المختلفة.</span></p>' },
    { from: '>المتجر</h3>', to: '><span data-i18n="footer.store_title">المتجر</span></h3>' },
    { from: '>كل المنتجات</a>', to: '><span data-i18n="footer.all_products">كل المنتجات</span></a>' },
    { from: '>كابات</a>', to: '><span data-i18n="footer.caps">كابات</span></a>' },
    { from: '>الجديد</a>', to: '><span data-i18n="footer.new">الجديد</span></a>' },
    { from: '>الأكثر مبيعاً</a>', to: '><span data-i18n="footer.best">الأكثر مبيعاً</span></a>' },
    { from: '>الدعم</h3>', to: '><span data-i18n="footer.support_title">الدعم</span></h3>' },
    { from: '>تتبع الطلب</a>', to: '><span data-i18n="footer.track">تتبع الطلب</span></a>' },
    { from: '>سياسة الخصوصية</a>', to: '><span data-i18n="footer.privacy">سياسة الخصوصية</span></a>' },
    { from: '>شروط الاستخدام</a>', to: '><span data-i18n="footer.terms">شروط الاستخدام</span></a>' },
    { from: '>تواصل معنا</h3>', to: '><span data-i18n="footer.contact_title">تواصل معنا</span></h3>' },
    { from: '💬 واتساب: ', to: '<span data-i18n="footer.whatsapp">💬 واتساب:</span> ' },
    { from: '⏰ ساعات الرد: ', to: '<span data-i18n="footer.hours">⏰ ساعات الرد:</span> ' },
    { from: ' Heru Store. كافة الحقوق محفوظة.', to: ' <span data-i18n="footer.copyright">Heru Store. كافة الحقوق محفوظة.</span>' }
];

replacements.forEach(r => {
    content = content.replace(r.from, r.to);
});

// For Supabase dynamic loading logic in data.js or inline scripts!
// Wait - index.html has a script section at the bottom for fetchSupabaseData!
// I'll replace product.name_ar -> (currentLang === 'en' && product.name_en) ? product.name_en : product.name_ar 
// Let's do that cleanly.
const regexProdName = /\`\s*\$\{p\.name_ar\}\s*\`/g;
content = content.replace(regexProdName, '` ${ (typeof currentLang !== "undefined" && currentLang === "en" && p.name_en) ? p.name_en : p.name_ar } `');

const regexCatName = /\`\s*\$\{cat\.name_ar\}\s*\`/g;
content = content.replace(regexCatName, '` ${ (typeof currentLang !== "undefined" && currentLang === "en" && cat.name_en) ? cat.name_en : cat.name_ar } `');

// Fix the card template
content = content.replace(
    'class="btn btn-md btn-primary btn-full">عرض سريع</button>', 
    'class="btn btn-md btn-primary btn-full"><span data-i18n="card.quick_view">عرض سريع</span></button>'
);
content = content.replace(
    '<span class="badge" style="background: var(--success); color: var(--bg-primary);">شحن مجاني</span>', 
    '<span class="badge" style="background: var(--success); color: var(--bg-primary);"><span data-i18n="card.free_shipping">شحن مجاني</span></span>'
);

fs.writeFileSync(idxHtml, content, 'utf8');
console.log('Successfully updated index.html with i18n tags');
