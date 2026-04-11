import { supabaseClient } from './supabase.js';
import { CONSTANTS } from './constants.js';

/**
 * دالة مساعدة لتسجيل الأخطاء حصرياً في وضع المطور.
 * @param {string} context - اسم الدالة المصابة بالخطأ.
 * @param {any} err - كائن الخطأ الفعلي.
 */
function logError(context, err) {
    if (CONSTANTS.DEV_MODE) {
        console.error(`[Heru Data Layer - ${context}]:`, err);
    }
}

/* ==========================================================================
   ====== قسم إدارة المنتجات (Products Management) ==========================
   ========================================================================== */

/**
 * يجلب منتجات المتجر مع دعم الفلترة والترتيب
 * @param {Object} options - خيارات الفلترة
 * @param {string} [options.category_id] - معرّف التصنيف
 * @param {boolean} [options.featured] - المنتجات المميزة فقط
 * @param {number} [options.limit=8] - عدد المنتجات
 * @param {number} [options.offset=0] - نقطة البداية للـ pagination
 * @param {string} [options.search] - نص البحث
 * @param {string} [options.sort='created_at'] - معيار الترتيب
 * @returns {Promise<{data: Product[], count: number, error: Error|null}>}
 */
export async function getProducts(options = {}) {
    try {
        const { category_id, featured, active = true, limit = 50, offset = 0, search, sort } = options;
        
        let query = supabaseClient.from('products').select(`
            *,
            categories(id, name_ar, color)
        `, { count: 'exact' });

        if (active !== undefined && active !== null) query = query.eq('active', active);
        if (category_id && category_id !== 'all') query = query.eq('category_id', category_id);
        if (featured) query = query.eq('featured', true);
        
        if (options.search && options.search.trim() !== '') {
            query = query.or(`name_ar.ilike.%${options.search}%,name_en.ilike.%${options.search}%,description_ar.ilike.%${options.search}%`);
        }
        
        if (sort) {
            switch(sort) {
                case 'newest': query = query.order('created_at', { ascending: false }); break;
                case 'price_asc': query = query.order('price', { ascending: true }); break;
                case 'price_desc': query = query.order('price', { ascending: false }); break;
                case 'rating': query = query.order('created_at', { ascending: false }); break; // Fallback
                default: query = query.order('created_at', { ascending: false }); break;
            }
        } else {
            query = query.order('created_at', { ascending: false });
        }
        
        query = query.range(offset, offset + limit - 1);
        
        const { data, count, error } = await query;
        if (error) throw error;
        
        return { data: data || [], count: count || 0, error: null };
    } catch (err) {
        logError('getProducts', err);
        return { data: [], count: 0, error: CONSTANTS.MESSAGES.ERROR_FETCHING };
    }
}

/**
 * جلب تفاصيل منتج محدد بناءً على رقمه التعريفي.
 * @param {string} id - الرقم التعريفي Product ID
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function getProductById(id) {
    try {
        if (!id) throw new Error('Missing ID');
        const { data, error } = await supabaseClient.from('products')
            .select('*, categories(id, name_ar, color)')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        if (!data || data.active === false) {
            return { data: null, error: CONSTANTS.MESSAGES.ERROR_NOT_FOUND };
        }
        
        return { data, error: null };
    } catch(err) {
        logError('getProductById', err);
        return { data: null, error: CONSTANTS.MESSAGES.ERROR_FETCHING };
    }
}

/**
 * جلب المنتجات المماثلة التي تشارك القسم.
 * @param {string} category_id - رقم التصنيف المراد البحث عنه.
 * @param {string} exclude_id - رقم المنتج المراد استبعاده من النتيجة.
 * @param {number} [limit=4] - عدد العناصر المجلان.
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getRelatedProducts(category_id, exclude_id, limit = 4) {
    try {
        if (!category_id) return { data: [], error: null };
        const { data, error } = await supabaseClient.from('products')
            .select('*')
            .eq('category_id', category_id)
            .neq('id', exclude_id)
            .eq('active', true)
            .limit(limit);
            
        if (error) throw error;
        return { data: data || [], error: null };
    } catch(err) {
        logError('getRelatedProducts', err);
        return { data: [], error: CONSTANTS.MESSAGES.ERROR_FETCHING };
    }
}


/* ==========================================================================
   ====== قسم إدارة التصنيفات (Categories Management) =======================
   ========================================================================== */

/**
 * جلب التصنيفات والأقسام النشطة.
 * @param {boolean} [active_only=true] - جلب النشط فقط.
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getCategories(active_only = true) {
    try {
        let query = supabaseClient.from('categories').select('id, name_ar, name_en, color, icon, sort_order, image_url, display_type').order('sort_order', { ascending: true });
        if (active_only) query = query.eq('active', true);
        
        const { data, error } = await query;
        if (error) throw error;
        
        return { data: data || [], error: null };
    } catch(err) {
        logError('getCategories', err);
        return { data: [], error: CONSTANTS.MESSAGES.ERROR_FETCHING };
    }
}


/* ==========================================================================
   ====== قسم إدارة الطلبات (Orders Management) =============================
   ========================================================================== */

/**
 * تخليق وتخزين طلب شامل جديد في سجلات النظام.
 * @param {Object} orderData - كائن بيانات المشتري وتفاصيل السلة.
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function createOrder(orderData) {
    try {
        const orderNumRes = await generateOrderNumber();
        if (orderNumRes.error) throw new Error(orderNumRes.error);
        const order_number = orderNumRes.data;
        
        const payload = {
            order_number,
            customer_name: sanitizeInput(orderData.customer_name).data,
            phone: orderData.phone,
            governorate: sanitizeInput(orderData.governorate).data,
            city: sanitizeInput(orderData.city).data,
            address: sanitizeInput(orderData.address).data,
            items: orderData.items,
            subtotal: parseFloat(orderData.subtotal),
            discount: parseFloat(orderData.discount || 0),
            coupon_code: sanitizeInput(orderData.coupon_code).data || null,
            total: parseFloat(orderData.total),
            payment_method: sanitizeInput(orderData.payment_method).data,
            notes: sanitizeInput(orderData.notes).data || null,
            status: 'pending',
            payment_status: 'unpaid'
        };

        const { data, error } = await supabaseClient.from('orders').insert([payload]).select();
        if (error) throw error;
        
        return { data: data[0], error: null };
    } catch(err) {
        logError('createOrder', err);
        return { data: null, error: CONSTANTS.MESSAGES.ERROR_DB };
    }
}

/**
 * جلب تفاصيل طلب عبر رقمه المتسلسل وهاتف المشتري لضمان هويته (للتتبع).
 * @param {string} order_number - رقم الطلب الفريد.
 * @param {string} phone - رقم هاتف العميل.
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function getOrderByNumberAndPhone(order_number, phone) {
    try {
        const { data, error } = await supabaseClient.from('orders')
            .select('*')
            .eq('order_number', order_number)
            .eq('phone', phone)
            .single();
            
        if (error) throw error;
        if (!data) return { data: null, error: CONSTANTS.MESSAGES.ERROR_NOT_FOUND };
        
        return { data, error: null };
    } catch (err) {
        logError('getOrderByNumberAndPhone', err);
        return { data: null, error: CONSTANTS.MESSAGES.ERROR_FETCHING };
    }
}

/**
 * تحديث حالة مسار وتتبع الطلب (للأدمنية فقط).
 * @param {string} id - رقم تعريف الطلب بنظام الـ UUID.
 * @param {string} status - الحالة الجديدة.
 * @returns {Promise<{data: boolean, error: string|null}>}
 */
export async function updateOrderStatus(id, status) {
    try {
        const { error } = await supabaseClient.from('orders')
            .update({ status: status })
            .eq('id', id);
        if (error) throw error;
        return { data: true, error: null };
    } catch(err) {
        logError('updateOrderStatus', err);
        return { data: false, error: CONSTANTS.MESSAGES.ERROR_DB };
    }
}


/* ==========================================================================
   ====== قسم إدارة الكوبونات (Coupons) =====================================
   ========================================================================== */

/**
 * التحقق من حيوية كود الخصم وإيفائه بالمتطلبات المعمول بها حالياً.
 * @param {string} code - النص المدخل للكوبون.
 * @param {number} subtotal - المجموع الحالي للطلب قبل الخصم.
 * @returns {Promise<{valid: boolean, discount: number, type: string, message: string}>}
 */
export async function validateCoupon(code, subtotal) {
    try {
        if (!code || code.trim() === '') return { valid: false, discount: 0, type: '', message: '' };
        
        const safeCode = code.trim().toUpperCase();
        const { data, error } = await supabaseClient.from('coupons')
            .select('*').eq('code', safeCode).eq('active', true).single();
            
        if (error || !data) return { valid: false, discount: 0, type: '', message: CONSTANTS.MESSAGES.COUPON_INVALID };
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return { valid: false, discount: 0, type: '', message: CONSTANTS.MESSAGES.COUPON_EXPIRED };
        }
        if (data.max_uses && data.uses_count >= data.max_uses) {
            return { valid: false, discount: 0, type: '', message: CONSTANTS.MESSAGES.COUPON_MAX_USES };
        }
        if (data.min_order && subtotal < data.min_order) {
            return { valid: false, discount: 0, type: '', message: `${CONSTANTS.MESSAGES.COUPON_MIN_ORDER} (الحد الأدنى ${data.min_order} ج.م)` };
        }

        let calculatedDiscount = 0;
        if (data.type === 'percentage') {
            calculatedDiscount = subtotal * (data.value / 100);
        } else {
            calculatedDiscount = data.value;
        }

        return { valid: true, discount: calculatedDiscount, type: data.type, message: 'الكوبون يعمل بنجاح' };
    } catch(err) {
        logError('validateCoupon', err);
        return { valid: false, discount: 0, type: '', message: CONSTANTS.MESSAGES.ERROR_DB };
    }
}

/**
 * زيادة عدد مرات استهلاك واستعمال الكود في النظام.
 * @param {string} code - الكود الفعلي المستهلك.
 * @returns {Promise<{data: boolean, error: string|null}>}
 */
export async function applyCoupon(code) {
    try {
        const safeCode = code.trim().toUpperCase();
        // Read old
        const { data: cData, error: cErr } = await supabaseClient.from('coupons').select('id, uses_count').eq('code', safeCode).single();
        if (cErr || !cData) throw new Error("Coupon logic failed or missing");
        
        // Write new
        const newUses = (cData.uses_count || 0) + 1;
        const { error } = await supabaseClient.from('coupons').update({ uses_count: newUses }).eq('id', cData.id);
        if (error) throw error;
        
        return { data: true, error: null };
    } catch(err) {
        logError('applyCoupon', err);
        return { data: false, error: CONSTANTS.MESSAGES.ERROR_DB };
    }
}


/* ==========================================================================
   ====== قسم إدارة التقييمات والاقتراحات (Reviews & Suggestions) ===========
   ========================================================================== */

/**
 * عرض مراجعات المنتج المُعتمدة ليراها العملاء.
 * @param {string} product_id - رقم المنتج المعني.
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getApprovedProductReviews(product_id) {
    try {
        const { data, error } = await supabaseClient.from('reviews')
            .select('*').eq('product_id', product_id).eq('approved', true).order('created_at', { ascending: false });
        if (error) throw error;
        return { data: data || [], error: null };
    } catch(err) {
        logError('getApprovedProductReviews', err); return { data: [], error: CONSTANTS.MESSAGES.ERROR_FETCHING };
    }
}

/**
 * عرض مراجعات المتجر المجتمعية.
 * @param {number} [limit=10] - حد العرض.
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getApprovedStoreReviews(limit = 10) {
    try {
        const { data, error } = await supabaseClient.from('store_reviews')
            .select('*').eq('approved', true).order('created_at', { ascending: false }).limit(limit);
        if (error) throw error;
        return { data: data || [], error: null };
    } catch(err) {
        logError('getApprovedStoreReviews', err); return { data: [], error: CONSTANTS.MESSAGES.ERROR_FETCHING };
    }
}

/**
 * تقديم مراجعة لمنتج محدد.
 * @param {Object} data - الكائن المعبر عن كيت المراجعة.
 * @returns {Promise<{data: boolean, error: string|null}>}
 */
export async function submitProductReview(data) {
    try {
        const payload = {
            product_id: data.product_id,
            reviewer_name: sanitizeInput(data.reviewer_name).data,
            rating: data.rating,
            comment: sanitizeInput(data.comment).data,
            approved: false
        };
        const { error } = await supabaseClient.from('reviews').insert([payload]);
        if (error) throw error;
        return { data: true, error: null };
    } catch(err) {
        logError('submitProductReview', err); return { data: false, error: CONSTANTS.MESSAGES.ERROR_DB };
    }
}

/**
 * تقديم تقييم عام للمتجر بأكمله.
 * @param {Object} data - الكائن.
 * @returns {Promise<{data: boolean, error: string|null}>}
 */
export async function submitStoreReview(data) {
    try {
        const payload = {
            reviewer_name: sanitizeInput(data.reviewer_name).data,
            rating: data.rating,
            comment: sanitizeInput(data.comment).data,
            approved: false
        };
        const { error } = await supabaseClient.from('store_reviews').insert([payload]);
        if (error) throw error;
        return { data: true, error: null };
    } catch(err) {
        logError('submitStoreReview', err); return { data: false, error: CONSTANTS.MESSAGES.ERROR_DB };
    }
}

/**
 * حفظ وتنظيم مقترحات التصميم التي أرسلها المستخدمون.
 * @param {Object} data - بيانات المقترح الذي ارسله العميل.
 * @returns {Promise<{data: boolean, error: string|null}>}
 */
export async function submitSuggestion(data) {
    try {
        const payload = {
            name: sanitizeInput(data.name).data,
            phone: data.phone,
            description: sanitizeInput(data.description).data,
            image_url: data.image_url || null,
            status: 'new'
        };
        const { error } = await supabaseClient.from('suggestions').insert([payload]);
        if (error) throw error;
        return { data: true, error: null };
    } catch(err) {
        logError('submitSuggestion', err); return { data: false, error: CONSTANTS.MESSAGES.ERROR_DB };
    }
}


/* ==========================================================================
   ====== قسم إدارة الإعدادات والحفظ (Settings) =============================
   ========================================================================== */

/**
 * قراءة وإرجاع معلومات وإعدادات المتجر في كائن واحد.
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function getSettings() {
    try {
        const { data, error } = await supabaseClient.from('settings').select('*');
        if (error) throw error;
        
        let map = {};
        if (data) {
            data.forEach(item => { map[item.key] = item.value; });
        }
        return { data: map, error: null };
    } catch(err) {
        logError('getSettings', err); return { data: {}, error: CONSTANTS.MESSAGES.ERROR_FETCHING };
    }
}

/**
 * تحديث حقل الإعدادات على قاعدة البيانات بمبدأ (Upsert).
 * @param {Object} settings_object - إعدادات لوحة التحكم.
 * @returns {Promise<{data: boolean, error: string|null}>}
 */
export async function updateSettings(settings_object) {
    try {
        const arr = Object.entries(settings_object).map(([key, value]) => ({ key, value }));
        const { error } = await supabaseClient.from('settings').upsert(arr, { onConflict: 'key' });
        if (error) throw error;
        return { data: true, error: null };
    } catch(err) {
        logError('updateSettings', err); return { data: false, error: CONSTANTS.MESSAGES.ERROR_DB };
    }
}


/* ==========================================================================
   ====== القسم المحلي (Cart / localStorage) ================================
   ========================================================================== */

/** @returns {{data: Array, error: null}} */
export function getCart() {
    try {
        const c = localStorage.getItem(CONSTANTS.STORAGE_KEYS.CART);
        return { data: c ? JSON.parse(c) : [], error: null };
    } catch(e) { logError('getCart', e); return { data: [], error: null }; }
}

/** 
 * تعيد البيانات بنجاح في كلا الحالتين لعدم التأثر بانقطاعات الشبكات
 * @param {Object} product 
 * @param {number} quantity 
 */
export function addToCart(product, quantity) {
    try {
        let cart = getCart().data;
        const existsRefIndex = cart.findIndex(c => c.id === product.id);
        const stockMax = product.stock || 0;
        
        if (existsRefIndex > -1) {
            cart[existsRefIndex].quantity = Math.min(cart[existsRefIndex].quantity + quantity, stockMax);
        } else {
            cart.push({
                id: product.id,
                name: product.name_ar,
                price: parseFloat(product.price),
                image: (product.images && product.images.length > 0) ? product.images[0] : null,
                quantity: Math.min(quantity, stockMax),
                maxStock: stockMax
            });
        }
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.CART, JSON.stringify(cart));
        return { data: true, error: null };
    } catch(e) { logError('addToCart', e); return { data: false, error: 'Internal Cache Logic Failed' }; }
}

export function updateCartItem(product_id, quantity) {
    try {
        let cart = getCart().data;
        const idx = cart.findIndex(c => c.id === product_id);
        if (idx > -1) {
            if (quantity <= 0) {
                return removeFromCart(product_id);
            }
            cart[idx].quantity = Math.min(quantity, cart[idx].maxStock);
            localStorage.setItem(CONSTANTS.STORAGE_KEYS.CART, JSON.stringify(cart));
        }
        return { data: true, error: null };
    } catch(e) { logError('updateCartItem', e); return { data: false, error: 'Updating Error' }; }
}

export function removeFromCart(product_id) {
    try {
        let cart = getCart().data.filter(c => c.id !== product_id);
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.CART, JSON.stringify(cart));
        return { data: true, error: null };
    } catch(e) { logError('removeFromCart', e); return { data: false, error: 'Cache Clear Action Error' }; }
}

export function clearCart() {
    try {
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.CART);
        return { data: true, error: null };
    } catch(e) { logError('clearCart', e); return { data: false, error: 'Clearing Failed' }; }
}

export function getCartCount() {
    const arr = getCart().data;
    return { data: arr.reduce((a, c) => a + c.quantity, 0), error: null };
}

export function getCartTotal() {
    const arr = getCart().data;
    return { data: arr.reduce((a, c) => a + (c.price * c.quantity), 0), error: null };
}


/* ==========================================================================
   ====== قسم دعم الواتساب السريع (WhatsApp Handlers) =======================
   ========================================================================== */

/**
 * تنسيق وتجهيز كود الرسالة الضخمة المُعنونه للمتجر.
 * @param {Object} order - بيانات العميل والتسليم بالكامل.
 * @returns {{data: string|null, error: string|null}}
 */
export function buildOrderMessage(order) {
    try {
        let parsedItems = '';
        order.items.forEach(i => {
           parsedItems += `- ${i.name} × ${i.quantity} = ${i.price * i.quantity} ج.م\n`;
        });
        
        let pExtra = '';
        let pName = '';
        if (order.payment_method === 'instapay') {
            pName = 'المحفظة البنكية (InstaPay)';
            pExtra = '\n(بانتظار ارفاق إيصال التحويل على هذا التشات)';
        } else if (order.payment_method === 'fawry') {
            pName = 'ماكينات كاش (Fawry)';
            pExtra = `\n(يرجى تسديد المبلغ عبر الكود المرجعي: ${order.order_number})`;
        } else {
            pName = 'كاش عند الاستلام بالمنزل';
        }
        
        let msg = CONSTANTS.WHATSAPP_TEMPLATE
            .replace('{ORDER_NUMBER}', order.order_number)
            .replace('{CUSTOMER_NAME}', order.customer_name)
            .replace('{PHONE}', order.phone)
            .replace('{GOV}', order.governorate)
            .replace('{CITY}', order.city)
            .replace('{ADDRESS}', order.address)
            .replace('{ITEMS}', parsedItems.trim())
            .replace('{SUBTOTAL}', order.subtotal)
            .replace('{DISCOUNT}', order.discount)
            .replace('{TOTAL}', order.total)
            .replace('{PAYMENT_METHOD}', pName)
            .replace('{PAYMENT_EXTRA}', pExtra)
            .replace('{NOTES}', order.notes || 'لا يوجد ملحوظات');
            
        return { data: msg, error: null };
    } catch(err) {
        logError('buildOrderMessage', err); return { data: null, error: 'فشل في توليد الرسالة' };
    }
}

/**
 * إجراء توجيه متصفح الويب لفتح كود وتطبيق الواتساب بسلاسة.
 * @param {Object} order - كائن الطلب الجاهز تماماً.
 * @returns {{data: boolean, error: string|null}}
 */
export function openWhatsApp(order) {
    try {
        const res = buildOrderMessage(order);
        if (res.error) throw new Error(res.error);
        const waLink = `https://wa.me/${CONSTANTS.WHATSAPP_NUMBER}?text=${encodeURIComponent(res.data)}`;
        
        // Timeout workaround to trick adblocks during programmatic submissions rarely
        setTimeout(() => window.open(waLink, '_blank'), 50);
        return { data: true, error: null };
    } catch(e) {
        logError('openWhatsApp', e); return { data: false, error: 'حدثت مصاعب بفتح الواتساب' };
    }
}


/* ==========================================================================
   ====== قسم المساعدات العامة والأمان (Helpers & Security Tools) ===========
   ========================================================================== */

/**
 * يصنع رقم تسلسلي متوازن زمنياً وغير متطابق استناداً لأقوى بيانات السيرفر.
 * @returns {Promise<{data: string|null, error: string|null}>}
 */
export async function generateOrderNumber() {
    try {
        const year = new Date().getFullYear();
        const prefix = `ORD-${year}-`;
        
        const { data, error } = await supabaseClient.from('orders')
            .select('order_number')
            .ilike('order_number', `${prefix}%`)
            .order('created_at', { ascending: false })
            .limit(1);
            
        if (error) throw error;
        
        let counter = 1;
        if (data && data.length > 0) {
            const latest = data[0].order_number;
            const segments = latest.split('-');
            if (segments.length === 3) {
                const countMatched = parseInt(segments[2], 10);
                if (!isNaN(countMatched)) {
                    counter = countMatched + 1;
                }
            }
        }
        
        const stringCounter = counter.toString().padStart(4, '0');
        const finalOrdStr = `${prefix}${stringCounter}`;
        
        return { data: finalOrdStr, error: null };
    } catch(err) {
        logError('generateOrderNumber', err); return { data: null, error: CONSTANTS.MESSAGES.ERROR_DB }; 
    }
}

/**
 * فلترة وفحص أرقام الهواتف استناداً للشبكات المصرية المحلية.
 * @param {string} phone 
 * @returns {{valid: boolean, message: string|null}}
 */
export function validateEgyptianPhone(phone) {
    const regex = /^01[0125][0-9]{8}$/;
    if (regex.test(phone)) return { valid: true, message: null };
    return { valid: false, message: CONSTANTS.MESSAGES.PHONE_INVALID };
}

/**
 * وسيلة آمنة لتنظيف الرموز النصية من الثغرات أو مدخلات الـ Script (XSS Protection Filter).
 * @param {string} text - النص الجاري التلاعب فيه.
 * @returns {{data: string, error: null}}
 */
export function sanitizeInput(text) {
    if (!text) return { data: text || '', error: null };
    const htmlMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', "/": '&#x2F;' };
    const regxLayer = /[&<>"'/]/ig;
    const cleanOutput = String(text).replace(regxLayer, (m) => (htmlMap[m]));
    return { data: cleanOutput, error: null };
}

/* ==========================================================================
   ====== قسم إضافي لإدارة إدخال وتعديل المنتجات والأقسام ===================
   ========================================================================== */

export async function addProduct(productData) {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) { window.location.href = '/admin/login.html'; return { error: 'اتصال غير موثق. يرجى تسجيل الدخول' }; }

        const { data, error } = await supabaseClient.from('products').insert([productData]).select();
        if (error) throw error;
        return { data: data[0], error: null };
    } catch(err) {
        logError('addProduct', err);
        return { data: null, error: err.message };
    }
}

export async function updateProduct(id, productData) {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) { window.location.href = '/admin/login.html'; return { error: 'اتصال غير موثق. يرجى تسجيل الدخول' }; }

        const { data, error } = await supabaseClient.from('products').update(productData).eq('id', id).select();
        if (error) throw error;
        return { data: data[0], error: null };
    } catch(err) {
        logError('updateProduct', err);
        return { data: null, error: err.message };
    }
}

export async function addCategory(categoryData) {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) { window.location.href = '/admin/login.html'; return { error: 'اتصال غير موثق. يرجى تسجيل الدخول' }; }

        const { data, error } = await supabaseClient.from('categories').insert([categoryData]).select();
        if (error) throw error;
        return { data: data[0], error: null };
    } catch(err) {
        logError('addCategory', err);
        return { data: null, error: err.message };
    }
}

export async function updateCategory(id, categoryData) {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) { window.location.href = '/admin/login.html'; return { error: 'اتصال غير موثق. يرجى تسجيل الدخول' }; }

        const { data, error } = await supabaseClient.from('categories').update(categoryData).eq('id', id).select();
        if (error) throw error;
        return { data: data[0], error: null };
    } catch(err) {
        logError('updateCategory', err);
        return { data: null, error: err.message };
    }
}

