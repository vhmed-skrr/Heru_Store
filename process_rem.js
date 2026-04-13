const fs = require('fs');

// 1. DICTIONARIES
let ar = JSON.parse(fs.readFileSync('./assets/lang/ar.json', 'utf8'));
let en = JSON.parse(fs.readFileSync('./assets/lang/en.json', 'utf8'));

Object.assign(ar, {
  'checkout.step1': 'بيانات التوصيل الشخصية',
  'checkout.step2': 'اختار طريقة الدفع المريحة ليك',
  'checkout.review': 'مراجعة الطلب النهائي',
  'checkout.lbl_name': 'الاسم بالكامل (رُباعي أو ثُلاثي)',
  'checkout.lbl_phone': 'رقم الهاتف الأساسي',
  'checkout.lbl_gov': 'المحافظة',
  'checkout.lbl_gov_def': 'اختر المحافظة...',
  'checkout.lbl_city': 'المنطقة / تفاصيل المدينة',
  'checkout.lbl_address': 'العنوان بالتفصيل الدقيق',
  'checkout.lbl_notes': 'ملاحظات الطلب (اختياري)',
  'checkout.place_name': 'مثال: أحمد محمد محمود',
  'checkout.place_phone': '01X-XXXX-XXXX',
  'checkout.place_city': 'مثال: مدينة نصر، شارع مكرم عبيد',
  'checkout.place_address': 'رقم العمارة، الدور، رقم الشقة أو علامة مميزة...',
  'checkout.place_notes': 'أية ملاحظات إضافية بخصوص موعد التسليم أو التصميم...',
  'checkout.submit': 'تأكيد وإتمام الطلب الآن',
  'checkout.agree': 'بالنقر هنا أنت توافق ضمنياً على شروط متجر هيرو.',
  'checkout.pay_cash': '💵 الدفع كاش عند الاستلام',
  'checkout.pay_cash_desc': 'قم بالدفع لمندوب التوصيل يدوياً وقت استلامك للطلب بأمان تام — بدون أي رسوم وعمولات مخفية.',
  'checkout.pay_insta': '📱 محفظة InstaPay (انستاباي)',
  'checkout.pay_insta_desc': 'سهولة وسرعة وموثوقية في الدفع المباشر من الموبايل.',
  'checkout.pay_fawry': '🏧 ماكينات Fawry للمدفوعات',
  'checkout.pay_fawry_desc': 'ادفع كاش من أقرب ماركت، أو صيدلية بها ماكينة فوري بمنتهى السرعة.',
  'checkout.summ_items': 'مجموع المنتجات:',
  'checkout.summ_disc': 'الخصم المستحق:',
  'checkout.summ_shipping': 'الشحن للمحافظة:',
  'checkout.summ_free': 'مجاني بالكامل!',
  'checkout.summ_total': 'الإجمالي المضاف:',
  'checkout.prog1': 'البيانات والدفع',
  'checkout.prog2': 'تأكيد الطلب',
  
  'track.title': 'تتبع خط سير طلبك 🚀',
  'track.result': 'النتيجة الحية',
  'track.lbl_id': 'رقم الطلب (Order ID)',
  'track.lbl_phone': 'رقم الهاتف المُطابق للطلب',
  'track.place_id': 'ORD-YYYY-XXXX',
  'track.place_phone': '01XXXXXXXXX',
  'track.btn_track': 'عرض حالة الطلب',
  'track.btn_reset': 'بحث عن طلب آخر',
  'track.btn_whatsapp': 'تواصل مع خدمة العملاء (واتساب)',
  'track.err_notfound': 'عذراً لا يوجد طلب بهذا الرقم أو البيانات غير مطابقة.',
  'track.err_server': 'حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً',
  'track.st_pending': 'الطلب قيد المراجعة، سنتواصل معك قريباً لتأكيد موعد التسليم والتصميم.',
  'track.st_paid': 'تم تأكيد الدفع وجارِ تجهيز طلبك بأعلى جودة.',
  
  'suggest.title': 'العب بلعبتك وصمم منتجك الخاص',
  'suggest.success_title': 'وصلنا اقتراحك الرهيب!',
  'suggest.success_desc': 'فريقنا بيراجع كل فكرة، ولو الفكرة قررنا ننفذها هيوصلك المنتج ده هدية مجانية منا ليك تعبيراً عن شكرنا.',
  'suggest.lbl_name': 'الاسم الكريم',
  'suggest.lbl_phone': 'رقم التواصل للواتساب',
  'suggest.lbl_product': 'المنتج المقترح',
  'suggest.lbl_desc': 'اشرح لنا فكرتك بالتفصيل',
  'suggest.lbl_img': 'عندك صورة توصل فكرتك أسرع؟ (اختياري)',
  'suggest.place_name': 'كيف نحب أن نناديك؟',
  'suggest.place_desc': 'أريد تصميم جراب موبايل باللون الأسود وعليه رسمة كذا...',
  'suggest.btn_submit': '🚀 أرسل اقتراحك للحياة',
  'suggest.btn_reset': 'اقترح فكرة أخرى 💡',
  'suggest.btn_shop': 'تسوّق الآن'
});

Object.assign(en, {
  'checkout.step1': 'Personal Delivery Information',
  'checkout.step2': 'Choose a Convenient Payment Method',
  'checkout.review': 'Final Order Review',
  'checkout.lbl_name': 'Full Name',
  'checkout.lbl_phone': 'Primary Phone Number',
  'checkout.lbl_gov': 'Governorate',
  'checkout.lbl_gov_def': 'Select governorate...',
  'checkout.lbl_city': 'City / Area Details',
  'checkout.lbl_address': 'Detailed Address',
  'checkout.lbl_notes': 'Order Notes (Optional)',
  'checkout.place_name': 'ex: Ahmed Mahmoud',
  'checkout.place_phone': '01X-XXXX-XXXX',
  'checkout.place_city': 'ex: Nasr City, Makram Ebeid',
  'checkout.place_address': 'Building number, floor, apartment...',
  'checkout.place_notes': 'Any additional notes regarding delivery or design...',
  'checkout.submit': 'Confirm & Place Order Now',
  'checkout.agree': 'By clicking here, you agree to Heru Store terms.',
  'checkout.pay_cash': '💵 Cash on Delivery',
  'checkout.pay_cash_desc': 'Pay the delivery representative securely in cash upon receiving your order — no hidden fees.',
  'checkout.pay_insta': '📱 InstaPay Wallet',
  'checkout.pay_insta_desc': 'Easy, fast, and reliable direct mobile payment.',
  'checkout.pay_fawry': '🏧 Fawry Payment Machines',
  'checkout.pay_fawry_desc': 'Pay via cash at any nearby market or pharmacy using Fawry quickly.',
  'checkout.summ_items': 'Products Total:',
  'checkout.summ_disc': 'Applied Discount:',
  'checkout.summ_shipping': 'Shipping to Governorate:',
  'checkout.summ_free': 'Completely Free!',
  'checkout.summ_total': 'Final Total:',
  'checkout.prog1': 'Details & Payment',
  'checkout.prog2': 'Order Confirmation',
  
  'track.title': 'Track Your Order Journey 🚀',
  'track.result': 'Live Result',
  'track.lbl_id': 'Order ID',
  'track.lbl_phone': 'Matching Order Phone Number',
  'track.place_id': 'ORD-YYYY-XXXX',
  'track.place_phone': '01XXXXXXXXX',
  'track.btn_track': 'View Order Status',
  'track.btn_reset': 'Search for Another Order',
  'track.btn_whatsapp': 'Contact Customer Support (WhatsApp)',
  'track.err_notfound': 'Sorry, no order found with this ID or non-matching data.',
  'track.err_server': 'Error searching, please try again later',
  'track.st_pending': 'Order under review. We will contact you soon to confirm delivery and design.',
  'track.st_paid': 'Payment confirmed. Preparing your order with the highest quality.',
  
  'suggest.title': 'Play Your Game & Design Your Product',
  'suggest.success_title': 'We Received Your Awesome Suggestion!',
  'suggest.success_desc': 'Our team reviews every idea. If we decide to produce it, you will receive this product as a free gift as a token of our appreciation.',
  'suggest.lbl_name': 'Your Good Name',
  'suggest.lbl_phone': 'WhatsApp Contact Number',
  'suggest.lbl_product': 'Suggested Product',
  'suggest.lbl_desc': 'Explain your idea in detail',
  'suggest.lbl_img': 'Have a reference image? (Optional)',
  'suggest.place_name': 'How would you like us to call you?',
  'suggest.place_desc': 'I want a black phone case with a drawing of...',
  'suggest.btn_submit': '🚀 Bring Your Suggestion to Life',
  'suggest.btn_reset': 'Suggest Another Idea 💡',
  'suggest.btn_shop': 'Shop Now'
});

fs.writeFileSync('./assets/lang/ar.json', JSON.stringify(ar, null, 2));
fs.writeFileSync('./assets/lang/en.json', JSON.stringify(en, null, 2));

// Function to apply rules
function processFile(filename, replacements, codeReplacements) {
    if(!fs.existsSync(filename)) return;
    let content = fs.readFileSync(filename, 'utf8');
    
    replacements.forEach(r => content = content.replace(r.from, r.to));
    codeReplacements.forEach(r => content = content.replace(r.from, r.to));

    // Fix Cookie notice statically without touching existing script logic
    content = content.replace(
        `نستخدم تقنية <strong>LocalStorage</strong> لحفظ سلة التسوق وتفضيلاتك. نحن لا نستخدم ملفات تعريف الارتباط (Cookies) للتتبع. يمكنك الاطلاع على <a href="./privacy" style="color:var(--accent); text-decoration:underline;">سياسة الخصوصية</a> لمزيد من التفاصيل.`,
        `<span data-i18n-html="cart.cookie_notice">نستخدم تقنية <strong>LocalStorage</strong> لحفظ سلة التسوق وتفضيلاتك. نحن لا نستخدم ملفات تعريف الارتباط (Cookies) للتتبع. يمكنك الاطلاع على <a href="./privacy" style="color:var(--accent); text-decoration:underline;">سياسة الخصوصية</a> لمزيد من التفاصيل.</span>`
    );
    // Replace Accept button text
    content = content.replace(
        `id="btn-accept-cookie" aria-label="موافق ومتابعة">موافق</button>`,
        `id="btn-accept-cookie" aria-label="موافق ومتابعة"><span data-i18n="cart.cookie_btn">موافق</span></button>`
    );
    
    fs.writeFileSync(filename, content, 'utf8');
    console.log(filename, "processed.");
}

// CHECKOUT REPLACEMENTS
const chkr = [
    { from: 'البيانات والدفع</div>', to: '<span data-i18n="checkout.prog1">البيانات والدفع</span></div>' },
    { from: 'تأكيد الطلب</div>', to: '<span data-i18n="checkout.prog2">تأكيد الطلب</span></div>' },
    { from: 'بيانات التوصيل الشخصية</h2>', to: '<span data-i18n="checkout.step1">بيانات التوصيل الشخصية</span></h2>' },
    { from: 'الاسم بالكامل (رُباعي أو ثُلاثي)', to: '<span data-i18n="checkout.lbl_name">الاسم بالكامل (رُباعي أو ثُلاثي)</span>' },
    { from: 'رقم الهاتف الأساسي', to: '<span data-i18n="checkout.lbl_phone">رقم الهاتف الأساسي</span>' },
    { from: 'المحافظة', to: '<span data-i18n="checkout.lbl_gov">المحافظة</span>' },
    { from: '>اختر المحافظة...</option>', to: ' data-i18n="checkout.lbl_gov_def">اختر المحافظة...</option>' },
    { from: 'المنطقة / تفاصيل المدينة', to: '<span data-i18n="checkout.lbl_city">المنطقة / تفاصيل المدينة</span>' },
    { from: 'العنوان بالتفصيل الدقيق', to: '<span data-i18n="checkout.lbl_address">العنوان بالتفصيل الدقيق</span>' },
    { from: 'ملاحظات الطلب (اختياري)</label>', to: '<span data-i18n="checkout.lbl_notes">ملاحظات الطلب (اختياري)</span></label>' },
    { from: 'placeholder="مثال: أحمد محمد محمود"', to: 'placeholder="مثال: أحمد محمد محمود" data-i18n-placeholder="checkout.place_name"' },
    { from: 'placeholder="مثال: مدينة نصر، شارع مكرم عبيد"', to: 'placeholder="مثال: مدينة نصر، شارع مكرم عبيد" data-i18n-placeholder="checkout.place_city"' },
    { from: 'placeholder="رقم العمارة، الدور، رقم الشقة أو علامة مميزة..."', to: 'placeholder="رقم العمارة، الدور، رقم الشقة أو علامة مميزة..." data-i18n-placeholder="checkout.place_address"' },
    { from: 'placeholder="أية ملاحظات إضافية بخصوص موعد التسليم أو التصميم..."', to: 'placeholder="أية ملاحظات إضافية بخصوص موعد التسليم أو التصميم..." data-i18n-placeholder="checkout.place_notes"' },
    
    { from: 'اختار طريقة الدفع المريحة ليك</h2>', to: '<span data-i18n="checkout.step2">اختار طريقة الدفع المريحة ليك</span></h2>' },
    { from: '💵 الدفع كاش عند الاستلام</div>', to: '💵 <span data-i18n="checkout.pay_cash">الدفع كاش عند الاستلام</span></div>' },
    { from: 'قم بالدفع لمندوب التوصيل يدوياً وقت استلامك للطلب بأمان تام — بدون أي رسوم وعمولات مخفية.</div>', to: '<span data-i18n="checkout.pay_cash_desc">قم بالدفع لمندوب التوصيل يدوياً وقت استلامك للطلب بأمان تام — بدون أي رسوم وعمولات مخفية.</span></div>' },
    { from: '📱 محفظة InstaPay (انستاباي)</div>', to: '📱 <span data-i18n="checkout.pay_insta">محفظة InstaPay (انستاباي)</span></div>' },
    { from: 'سهولة وسرعة وموثوقية في الدفع المباشر من الموبايل.</div>', to: '<span data-i18n="checkout.pay_insta_desc">سهولة وسرعة وموثوقية في الدفع المباشر من الموبايل.</span></div>' },
    { from: '🏧 ماكينات Fawry للمدفوعات</div>', to: '🏧 <span data-i18n="checkout.pay_fawry">ماكينات Fawry للمدفوعات</span></div>' },
    { from: 'ادفع كاش من أقرب ماركت، أو صيدلية بها ماكينة فوري بمنتهى السرعة.</div>', to: '<span data-i18n="checkout.pay_fawry_desc">ادفع كاش من أقرب ماركت، أو صيدلية بها ماكينة فوري بمنتهى السرعة.</span></div>' },
    
    { from: 'مراجعة الطلب النهائي</h3>', to: '<span data-i18n="checkout.review">مراجعة الطلب النهائي</span></h3>' },
    { from: 'مجموع المنتجات:</span>', to: '<span data-i18n="checkout.summ_items">مجموع المنتجات:</span></span>' },
    { from: 'الخصم المستحق:</span>', to: '<span data-i18n="checkout.summ_disc">الخصم المستحق:</span></span>' },
    { from: 'الشحن للمحافظة:</span>', to: '<span data-i18n="checkout.summ_shipping">الشحن للمحافظة:</span></span>' },
    { from: '>مجاني بالكامل!</span>', to: '><span data-i18n="checkout.summ_free">مجاني بالكامل!</span></span>' },
    { from: 'الإجمالي المضاف:</span>', to: '<span data-i18n="checkout.summ_total">الإجمالي المضاف:</span></span>' },
    { from: '>تأكيد وإتمام الطلب الآن</button>', to: '><span data-i18n="checkout.submit">تأكيد وإتمام الطلب الآن</span></button>' },
    { from: '>بالنقر هنا أنت توافق ضمنياً على شروط متجر هيرو.</div>', to: '><span data-i18n="checkout.agree">بالنقر هنا أنت توافق ضمنياً على شروط متجر هيرو.</span></div>' }
];

const chkcode = [
    {
        from: `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';`,
        to: `` // just removing duplicates if I ran accidentaly
    },
    {
        from: `iName.addEventListener('blur', () => checkField(iName, iName.value.trim().length > 2, '* يرجى إدخال اسمك بصيغة معبرة وصحيحة'));`,
        to: `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
          iName.addEventListener('blur', () => checkField(iName, iName.value.trim().length > 2, currentLang==='en'?'* Please enter a valid name':'* يرجى إدخال اسمك بصيغة معبرة وصحيحة'));`
    },
    {
        from: `iPhone.addEventListener('blur', () => checkField(iPhone, validateEgyptianPhone(iPhone.value.trim()), '* رقم هاتف مصري غير صالح (يجب أن يبدأ بـ 01)'));`,
        to: `iPhone.addEventListener('blur', () => checkField(iPhone, validateEgyptianPhone(iPhone.value.trim()), currentLang==='en'?'* Invalid Phone Number':'* رقم هاتف مصري غير صالح (يجب أن يبدأ بـ 01)'));`
    },
    {
        from: `iGov.addEventListener('change', () => checkField(iGov, iGov.value !== '', '* يرجى اختيار المحافظة لتسعير الشحن'));`,
        to: `iGov.addEventListener('change', () => checkField(iGov, iGov.value !== '', currentLang==='en'?'* Required':'* يرجى اختيار المحافظة لتسعير الشحن'));`
    },
    {
        from: `iCity.addEventListener('blur', () => checkField(iCity, iCity.value.trim().length > 1, '* تفاصيل مدينتك/منطقتك هامة جداً'));`,
        to: `iCity.addEventListener('blur', () => checkField(iCity, iCity.value.trim().length > 1, currentLang==='en'?'* City is required':'* تفاصيل مدينتك/منطقتك هامة جداً'));`
    },
    {
        from: `iAddr.addEventListener('blur', () => checkField(iAddr, iAddr.value.trim().length > 5, '* العنوان التفصيلي يجب ألا يكون فارغاً لأمان التوصيل'));`,
        to: `iAddr.addEventListener('blur', () => checkField(iAddr, iAddr.value.trim().length > 5, currentLang==='en'?'* Important detail missing':'* العنوان التفصيلي يجب ألا يكون فارغاً لأمان التوصيل'));`
    },
    {
        from: `const v1 = checkField(iName, iName.value.trim().length > 2, '* يرجى إدخال البيانات المفقودة هنا بشكل سليم');`,
        to: `const v1 = checkField(iName, iName.value.trim().length > 2, currentLang==='en'?'* Missing value':'* يرجى إدخال البيانات المفقودة هنا بشكل سليم');`
    },
    {
        from: `const v2 = checkField(iPhone, validateEgyptianPhone(iPhone.value.trim()), '* راجع رقم الهاتف');`,
        to: `const v2 = checkField(iPhone, validateEgyptianPhone(iPhone.value.trim()), currentLang==='en'?'* Review phone number':'* راجع رقم الهاتف');`
    },
    {
        from: `const v3 = checkField(iGov, iGov.value !== '', '* يرجى المراجعة وتحديد الحقل أدناه');`,
        to: `const v3 = checkField(iGov, iGov.value !== '', currentLang==='en'?'* Please select':'* يرجى المراجعة وتحديد الحقل أدناه');`
    },
    {
        from: `const v4 = checkField(iCity, iCity.value.trim().length > 1, '* يرجى استيفاء بيانات العنوان كلياً');`,
        to: `const v4 = checkField(iCity, iCity.value.trim().length > 1, currentLang==='en'?'* Details required':'* يرجى استيفاء بيانات العنوان كلياً');`
    },
    {
        from: `const v5 = checkField(iAddr, iAddr.value.trim().length > 5, '* يرجى استيفاء بيانات العنوان كلياً لاستلامك الطلب');`,
        to: `const v5 = checkField(iAddr, iAddr.value.trim().length > 5, currentLang==='en'?'* Details required':'* يرجى استيفاء بيانات العنوان كلياً لاستلامك الطلب');`
    },
    {
        from: `window.showToast('عفواً، برجاء مراجعة البيانات المحددة باللون الأحمر وتصليحها لتسهيل التوصيل!', 'error');`,
        to: `window.showToast(currentLang==='en'?'Please review highlighted fields':'عفواً، برجاء مراجعة البيانات المحددة باللون الأحمر وتصليحها لتسهيل التوصيل!', 'error');`
    },
    {
        from: `window.showToast('خطأ بالسيرفر الداخلي. يرجى محاولة تأكيد الطلب مرة أخرى بعد بضع ثوان.', 'error');`,
        to: `window.showToast(currentLang==='en'?'Internal server error, please try again.':'خطأ بالسيرفر الداخلي. يرجى محاولة تأكيد الطلب مرة أخرى بعد بضع ثوان.', 'error');`
    }
];
processFile('checkout.html', chkr, chkcode);

// TRACK-ORDER REPLACEMENTS
const trackr = [
    { from: '>تتبع خط سير طلبك 🚀</h1>', to: '><span data-i18n="track.title">تتبع خط سير طلبك 🚀</span></h1>' },
    { from: '>النتيجة الحية</h2>', to: '><span data-i18n="track.result">النتيجة الحية</span></h2>' },
    { from: '>رقم الطلب (Order ID)</label>', to: '><span data-i18n="track.lbl_id">رقم الطلب (Order ID)</span></label>' },
    { from: '>رقم الهاتف المُطابق للطلب</label>', to: '><span data-i18n="track.lbl_phone">رقم الهاتف المُطابق للطلب</span></label>' },
    { from: '>عرض حالة الطلب</button>', to: '><span data-i18n="track.btn_track">عرض حالة الطلب</span></button>' },
    { from: '>بحث عن طلب آخر</button>', to: '><span data-i18n="track.btn_reset">بحث عن طلب آخر</span></button>' },
    { from: '>تواصل مع خدمة العملاء (واتساب)</button>', to: '><span data-i18n="track.btn_whatsapp">تواصل مع خدمة العملاء (واتساب)</span></button>' }
];
const trackcode = [
    {
        from: `if(!supabaseClient) throw new Error("اتصال فشل");`,
        to: `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
                  if(!supabaseClient) throw new Error("اتصال فشل");`
    },
    {
        from: `rHtml = \`<div style="text-align:center; color:var(--error); padding:24px; font-weight:600;">عذراً لا يوجد طلب بهذا الرقم أو البيانات غير مطابقة.</div>\`;`,
        to: `rHtml = \`<div style="text-align:center; color:var(--error); padding:24px; font-weight:600;">\${currentLang==='en'?'Sorry, no order found with this ID or non-matching data.':'عذراً لا يوجد طلب بهذا الرقم أو البيانات غير مطابقة.'}</div>\`;`
    },
    {
        from: `rHtml = \`<div style="text-align:center; color:var(--error); padding:24px; font-weight:600;">حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً</div>\`;`,
        to: `rHtml = \`<div style="text-align:center; color:var(--error); padding:24px; font-weight:600;">\${currentLang==='en'?'Error searching, please try again later':'حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً'}</div>\`;`
    },
    {
        from: `statTx = 'الطلب قيد المراجعة، سنتواصل معك قريباً لتأكيد موعد التسليم والتصميم.'; statClColor = 'var(--text-muted)';`,
        to: `statTx = currentLang==='en'?'Order under review. We will contact you soon.':'الطلب قيد المراجعة، سنتواصل معك قريباً لتأكيد موعد التسليم والتصميم.'; statClColor = 'var(--text-muted)';`
    },
    {
        from: `statTx = 'تم تأكيد الدفع وجارِ تجهيز طلبك بأعلى جودة.'; statClColor = 'var(--success)';`,
        to: `statTx = currentLang==='en'?'Payment confirmed. Preparing your order.':'تم تأكيد الدفع وجارِ تجهيز طلبك بأعلى جودة.'; statClColor = 'var(--success)';`
    } // the others like shipped are dynamic to admin, we will leave them if not explicitly static in UI.
];
processFile('track-order.html', trackr, trackcode);


// SUGGEST REPLACEMENTS
const sugr = [
    { from: '>العب بلعبتك وصمم منتجك الخاص</h1>', to: '><span data-i18n="suggest.title">العب بلعبتك وصمم منتجك الخاص</span></h1>' },
    { from: '>وصلنا اقتراحك الرهيب!</h2>', to: '><span data-i18n="suggest.success_title">وصلنا اقتراحك الرهيب!</span></h2>' },
    { from: '>فريقنا بيراجع كل فكرة، ولو الفكرة قررنا ننفذها هيوصلك المنتج ده هدية مجانية منا ليك تعبيراً عن شكرنا.</p>', to: '><span data-i18n="suggest.success_desc">فريقنا بيراجع كل فكرة، ولو الفكرة قررنا ننفذها هيوصلك المنتج ده هدية مجانية منا ليك تعبيراً عن شكرنا.</span></p>' },
    { from: '>الاسم الكريم', to: '><span data-i18n="suggest.lbl_name">الاسم الكريم</span>' },
    { from: '>رقم التواصل للواتساب', to: '><span data-i18n="suggest.lbl_phone">رقم التواصل للواتساب</span>' },
    { from: '>المنتج المقترح', to: '><span data-i18n="suggest.lbl_product">المنتج المقترح</span>' },
    { from: '>اشرح لنا فكرتك بالتفصيل', to: '><span data-i18n="suggest.lbl_desc">اشرح لنا فكرتك بالتفصيل</span>' },
    { from: '>عندك صورة توصل فكرتك أسرع؟ (اختياري)</label>', to: '><span data-i18n="suggest.lbl_img">عندك صورة توصل فكرتك أسرع؟ (اختياري)</span></label>' },
    { from: 'placeholder="كيف نحب أن نناديك؟"', to: 'placeholder="كيف نحب أن نناديك؟" data-i18n-placeholder="suggest.place_name"' },
    { from: 'placeholder="أريد تصميم جراب موبايل باللون الأسود وعليه رسمة كذا..."', to: 'placeholder="أريد تصميم جراب موبايل باللون الأسود وعليه رسمة كذا..." data-i18n-placeholder="suggest.place_desc"' },
    { from: '>🚀 أرسل اقتراحك للحياة</button>', to: '><span data-i18n="suggest.btn_submit">🚀 أرسل اقتراحك للحياة</span></button>' },
    { from: '>اقترح فكرة أخرى 💡</button>', to: '><span data-i18n="suggest.btn_reset">اقترح فكرة أخرى 💡</span></button>' },
    { from: '>تسوّق الآن</button>', to: '><span data-i18n="suggest.btn_shop">تسوّق الآن</span></button>' }
];
const sugcode = [
    {
        from: `window.showToast('جاري حجز التصميم ومراجعة طلبك...', 'info');`,
        to: `const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('heru-lang') || 'ar') : 'ar';
                  window.showToast(currentLang==='en'?'Reviewing your design request...':'جاري حجز التصميم ومراجعة طلبك...', 'info');`
    },
    {
        from: `window.showToast('عفواً، برجاء التأكد من كتابة البيانات في كل الحقول', 'warning');`,
        to: `window.showToast(currentLang==='en'?'Please fill all required fields.':'عفواً، برجاء التأكد من كتابة البيانات في كل الحقول', 'warning');`
    },
    {
        from: `window.showToast('حدث خطأ بالأنظمة... تواصل معنا على واتساب الآن', 'error');`,
        to: `window.showToast(currentLang==='en'?'Server Error... reach out on WhatsApp.':'حدث خطأ بالأنظمة... تواصل معنا على واتساب الآن', 'error');`
    }
];
processFile('suggest.html', sugr, sugcode);

