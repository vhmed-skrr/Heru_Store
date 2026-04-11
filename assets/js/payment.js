import { getSettings } from './data.js';

let instapayNumber = '';
let fawryCode = 'Heru Store';

/**
 * خريطة وهويات طرق الدفع المدعومة بالنظام
 */
export const PAYMENT_METHODS = {
  CASH: {
    id: 'cash',
    name: 'كاش عند الاستلام',
    description: 'سدد نقدًا عند استلام طلبك',
    icon: '💵',
    instructions: null,
    db_status: 'pending_delivery' // حالة التوصيل للطلبات النقدية
  },
  INSTAPAY: {
    id: 'instapay',
    name: 'InstaPay (تحويل بنكي/محافظ)',
    description: 'حوّل على رقم InstaPay ثم أرسل إيصال التحويل للمطابقة',
    icon: '📱',
    instructions: [
      'افتح تطبيق الإنترنت البنكي، InstaPay، أو محافظ الهاتف (فودافون كاش وغيرها)',
      'اختر التحويل على عنوان شبكة المدفوعات اللحظية أو المحفظة',
      'أدخل الرقم السري للوجهة: <strong>[INSTAPAY_NUMBER]</strong>',
      'أدخل المبلغ الإجمالي: <strong>[ORDER_TOTAL] جنيه</strong> بشكل دقيق',
      'في خانة الملاحظات (أو رسالة التحويل) اكتب رقم طلبك: <strong>[ORDER_NUMBER]</strong>',
      'التقط صورة لشاشة الإيصال (Screenshot) وأرسلها على رقم دعم الواتساب لتأكيد الطلب فوراً'
    ],
    db_status: 'pending_verification' // في انتظار مطابقة إيصال التحويل
  },
  FAWRY: {
    id: 'fawry',
    name: 'Fawry (كود الدفع)',
    description: 'ادفع عبر أقرب منفذ Fawry لمعالجة طلبك دون بطاقة بنكية',
    icon: '🏧',
    instructions: [
      'توجه لأقرب منفذ Fawry أو ماكينة صراف Fawry (كشك/صيدلية/سوبر ماركت)',
      'اختر خدمة "دفع فواتير ومشتريات"',
      'ابحث عن كود متجر "<strong>[FAWRY_CODE]</strong>" أو أخبر موظف الكاشير بالبحث عن الدفع باسم المتجر',
      'في حال وجود كود دفع خاص بالمنتجات، قدم كود الطلب <strong>[ORDER_NUMBER]</strong> للكاشير',
      'ادفع إجمالي المبلغ المطلوب: <strong>[ORDER_TOTAL] جنيه</strong> نقدًا للكاشير',
      'احتفظ بإيصال الدفع حتى يقوم النظام آلياً بتحديث حالة طلبك لدينا لبدء التغليف!'
    ],
    db_status: 'pending_payment' // في انتظار التأكيد الآلي من البوابة/ماكينة فوري
  }
};

/**
 * تهيئة المحرك وجلب الإعدادات الحية لأرقام التحويل من Supabase
 */
export async function initPayments() {
    try {
        const { data, error } = await getSettings();
        if (data && !error) {
            instapayNumber = data['instapay_number'] || '[يرجى سؤال خدمة العملاء عن الرقم]';
            fawryCode = data['fawry_code'] || 'Heru Store';
        }
    } catch(err) {
        console.error('فشل في تحميل ارقام وإعدادات بوابات الدفع', err);
    }
}

/**
 * وضع بطاقات طرق الدفع (Radio Cards) في واجهة checkout
 * @param {string} container_id - الـ ID للحاوية في الـ DOM
 */
export function renderPaymentMethods(container_id) {
    const container = document.getElementById(container_id);
    if(!container) return;
    
    let html = '';
    const methodsArray = [PAYMENT_METHODS.CASH, PAYMENT_METHODS.INSTAPAY, PAYMENT_METHODS.FAWRY];
    
    methodsArray.forEach(pm => {
        html += `
            <label class="payment-card" style="display:flex; align-items:center; gap:var(--space-4); background:var(--bg-card); border:1px solid var(--border-strong); padding:var(--space-4); border-radius:var(--radius-md); margin-block-end:var(--space-2); cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border-strong)'">
                <input type="radio" name="payment_method" value="${pm.id}" style="width:20px; height:20px; accent-color:var(--accent);" onchange="window.handlePaymentChange('${pm.id}')">
                <div style="font-size:32px; flex-shrink:0;">${pm.icon}</div>
                <div style="flex:1;">
                    <strong style="display:block; font-size:var(--text-base); margin-block-end:4px; color:var(--text-primary);">${pm.name}</strong>
                    <span style="color:var(--text-secondary); font-size:var(--text-sm); line-height:1.4; display:block;">${pm.description}</span>
                </div>
            </label>
        `;
    });
    container.innerHTML = html;
}

/**
 * الحصول على معرف الطريقة المختارة من قبل المستخدم
 * @returns {string|null} - يعيد 'cash', 'instapay', أو 'fawry'
 */
export function getSelectedPaymentMethod() {
    const selected = document.querySelector('input[name="payment_method"]:checked');
    return selected ? selected.value : null;
}

/**
 * التحقق المنطقي من أنه تم تحديد طريقة الدفع فعلياً
 * @returns {boolean}
 */
export function validatePaymentSelection() {
    return getSelectedPaymentMethod() !== null;
}

/**
 * تصيير وعرض التعليمات المخصصة للمشتري بناءً على ما اختاره
 * وتعبئة الأرقام الفعلية والإجماليات في النصوص.
 * @param {string} methodId 
 * @param {number} orderTotal 
 * @param {string} orderNumber 
 * @param {string} container_id 
 */
export function renderPaymentInstructions(methodId, orderTotal, orderNumber, container_id) {
    const container = document.getElementById(container_id);
    if(!container) return;
    
    container.innerHTML = '';
    
    const methodsArray = [PAYMENT_METHODS.CASH, PAYMENT_METHODS.INSTAPAY, PAYMENT_METHODS.FAWRY];
    const meth = methodsArray.find(m => m.id === methodId);
    
    if(!meth || !meth.instructions) {
        container.style.display = 'none';
        return;
    }
    
    let instHtml = `<div style="background:rgba(240, 235, 225, 0.05); border-right:4px solid var(--accent); padding:var(--space-4); border-radius:var(--radius-sm); margin-top:var(--space-4);">`;
    instHtml += `<h4 style="margin:0 0 12px 0; color:var(--text-primary); font-size:14px;">خطوات سداد ${meth.name}:</h4>`;
    instHtml += `<ul style="margin:0; padding-inline-start:20px; color:var(--text-secondary); font-size:14px; line-height:1.8;">`;
    
    meth.instructions.forEach(line => {
        let text = line
            .replace('[ORDER_TOTAL]', orderTotal)
            .replace('[ORDER_NUMBER]', orderNumber || 'سيظهر بعد التأكيد')
            .replace('[INSTAPAY_NUMBER]', instapayNumber)
            .replace('[FAWRY_CODE]', fawryCode);
            
        instHtml += `<li>${text}</li>`;
    });
    
    instHtml += `</ul></div>`;
    
    container.innerHTML = instHtml;
    container.style.display = 'block';
}

/**
 * إرجاع الحالة الآمنة لحفظ الطلب في Database بناءً على الطريقة المختارة
 * @param {string} methodId 
 * @returns {string} - 'pending_delivery', 'pending_verification', 'pending_payment'
 */
export function getPaymentInitialStatus(methodId) {
    const methodsArray = [PAYMENT_METHODS.CASH, PAYMENT_METHODS.INSTAPAY, PAYMENT_METHODS.FAWRY];
    const meth = methodsArray.find(m => m.id === methodId);
    return meth ? meth.db_status : 'pending';
}

/**
 * تحرير رسالة نصية قصيرة وواضحة (Note) لترفق على نص الواتس اب الآلي للطلبات
 * @param {string} methodId 
 * @param {string} orderNumber 
 * @returns {string}
 */
export function buildPaymentNote(methodId, orderNumber) {
    if(methodId === 'instapay') {
        return `مرحباً، أرجو مطابقة إيصال التحويل البنكي המرفق بهذا الشات لطلبي رقم ${orderNumber}، وشكراً.`;
    }
    if(methodId === 'fawry') {
        return `لقد اخترت الدفع عبر كشك فوري للطلب رقم ${orderNumber}. في انتظار تأكيد السداد من قِبلكم.`;
    }
    return 'قمت باختيار الدفع الكاش المباشر. يُرجى التوجه لتجهيز الطلب.';
}
