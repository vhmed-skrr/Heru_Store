/**
 * Constants and Configuration mappings for Heru Store v2
 */

export const CONSTANTS = {
    // Toggle for Dev Mode (Errors will only show if this is true)
    DEV_MODE: true,
    
    WHATSAPP_NUMBER: '201124519232',
    
    // LocalStorage key mappings
    STORAGE_KEYS: {
        CART: 'heru_cart',
        ACTIVE_COUPON: 'heru_active_coupon',
        STORE_REVIEWED: 'heru_store_reviewed'
    },
    
    // Centralized Application Messages
    MESSAGES: {
        ERROR_FETCHING: 'حدث خطأ أثناء جلب البيانات',
        ERROR_NOT_FOUND: 'العنصر المطلوب غير موجود أو غير متاح حالياً',
        ERROR_DB: 'توقف مؤقت في قاعدة البيانات',
        ERROR_VALIDATION: 'البيانات المدخلة غير متطابقة',
        COUPON_INVALID: 'عفواً، كود الخصم غير صالح أو غير موجود',
        COUPON_EXPIRED: 'كود الخصم منتهي الصلاحية',
        COUPON_MAX_USES: 'انتهى الحد الأقصى المسموح لاستخدام هذا الكود',
        COUPON_MIN_ORDER: 'الحد الأدنى للطلب لم يتحقق لتطبيق هذا الكوبون',
        CART_EMPTY: 'لا توجد منتجات لتنفيذ العملية',
        PHONE_INVALID: 'عفواً! رقم الهاتف غير صالح. اقبل فقط أرقام الهاتف المصرية (تبدأ بـ 01)'
    },
    
    // Master WhatsApp Template for generating automated Order Invoice string
    WHATSAPP_TEMPLATE: `🛍️ طلب جديد من متجر Heru
━━━━━━━━━━━━━━━━━━━━━━
🔖 رقم الطلب المرجعي: {ORDER_NUMBER}

👤 تفاصيل شحن العميل:
الاسم: {CUSTOMER_NAME}
رقم الاتصال: {PHONE}
المحافظة: {GOV}
المدينة: {CITY}
العنوان: {ADDRESS}

📦 محتويات الطرد:
{ITEMS}

🧾 حساب الفاتورة:
المجموع الفرعي: {SUBTOTAL} ج.م
خصومات مضافة: {DISCOUNT} ج.م
أجرة الشحن: مجاني
الإجمالي المستحق النهائي: {TOTAL} ج.م

💳 مسار الدفع المختار: {PAYMENT_METHOD}
{PAYMENT_EXTRA}

📝 ملحوظات المشتري: {NOTES}
━━━━━━━━━━━━━━━━━━━━━━
تم إعداد هذا السجل بشكل آلي.`
};
