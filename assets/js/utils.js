/**
 * utils.js - Security, Sanitization & Validations
 * يستخدم لتنظيف المدخلات ومنع ثغرات XSS وضبط معدل الطلبات محلياً.
 */

export function sanitizeHTML(input) {
    if (typeof input !== 'string') return input;
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return input.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * يعين النصوص للمتصفح عبر textContent للحيلولة دون تفاصيل innerHTML الخبيثة.
 */
export function sanitizeForDisplay(element, text) {
    if (!element) return;
    element.textContent = text;
}

export function validateEgyptianPhone(phone) {
    return /^(010|011|012|015)[0-9]{8}$/.test(String(phone).trim());
}

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim());
}

export function validatePositiveNumber(value, max = null) {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return false;
    if (max !== null && num > max) return false;
    return true;
}

/**
 * محدد معدلات حد الطلبات محلياً (Rate Limiting Deterrent) لصد الروبوتات البدائية والإساءة.
 * @param {string} action_key - معرف الحركة
 * @param {number} max_attempts - عدد المحاولات القصوى
 * @param {number} window_ms - المدة الزمنية للتقييد
 * @returns {boolean} - True إذا كان مسموحاً، False إذا تخطى الحدود
 */
export function rateLimiter(action_key, max_attempts, window_ms) {
    const now = Date.now();
    const key = `heru_rate_${action_key}`;
    let data;
    try {
        data = JSON.parse(localStorage.getItem(key)) || { count: 0, first_attempt: 0 };
    } catch {
        data = { count: 0, first_attempt: 0 };
    }
    
    // إذا انتهت المدة، ابدأ من جديد
    if (now - data.first_attempt > window_ms) {
        data = { count: 1, first_attempt: now };
        localStorage.setItem(key, JSON.stringify(data));
        return true; 
    }
    
    // إذا كانت المدة مازالت جارية وتخطينا الحد
    if (data.count >= max_attempts) {
        return false; 
    }
    
    // زيادة العداد
    data.count += 1;
    localStorage.setItem(key, JSON.stringify(data));
    return true; 
}

/**
 * Cloudinary Transformations Helper Functions
 */
export function clThumb(url) {
    if(!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/image/upload/', '/image/upload/w_400,q_auto,f_auto/');
}

export function clFull(url) {
    if(!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/image/upload/', '/image/upload/w_800,q_auto,f_auto/');
}

export function clOG(url) {
    if(!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/image/upload/', '/image/upload/w_1200,h_630,c_fill,q_auto,f_auto/');
}
