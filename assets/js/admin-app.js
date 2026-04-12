import { supabaseClient } from './supabase.js';
import { CONSTANTS } from './constants.js';

window.appAdmin = {};
window.adminModals = {};
let currentOrderEditId = null;
let currentProductEditId = null;
let cachedProductsImages = [];

async function checkAdminAuth() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (!session || error) {
        window.location.replace('/admin/login.html');
        return false;
    }
    return true;
}

/** Core Boot & Auth Guard */
document.addEventListener('DOMContentLoaded', async () => {
    
    // Toast Utility
    window.showToast = (msg, type='info') => {
        const c = document.getElementById('toast-container');
        if(c){ const t = document.createElement('div'); t.className = `toast toast-${type}`; t.innerText = msg; c.appendChild(t); setTimeout(()=>t.remove(), 4000); }
    };

    // Quick Auth Check
    const isAuth = await checkAdminAuth();
    if (!isAuth) return;
    
    document.getElementById('auth-guard').style.display = 'none';

    // Auth Watcher
    supabaseClient.auth.onAuthStateChange((event, s) => {
        if (!s) window.location.replace('/admin/login.html');
    });

    // Security: Auto-Logout Activity Tracker (2 Hours)
    let idleTimer;
    const IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1000; 
    const resetIdle = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(async () => {
             await supabaseClient.auth.signOut();
             window.location.replace('/admin/login.html');
        }, IDLE_TIMEOUT_MS);
    };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keypress', resetIdle);
    window.addEventListener('click', resetIdle);
    resetIdle();

    document.getElementById('btn-logout').onclick = async () => {
        await supabaseClient.auth.signOut();
    };

    // Setup SPA Navigation
    const navs = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view-panel');
    
    navs.forEach(nav => {
        nav.addEventListener('click', (e) => {
            navs.forEach(n => n.classList.remove('active'));
            e.target.classList.add('active');
            
            const targetId = e.target.getAttribute('data-target');
            views.forEach(v => {
                if(v.id === `view-${targetId}`) { v.classList.add('active-view'); } 
                else { v.classList.remove('active-view'); }
            });
            
            loadViewData(targetId);
        });
    });

    // Initial Load
    loadViewData('dashboard');

    // Attach File Listeners for Cloudinary
    setupCloudinaryUploader();
});

/** View Router */
function loadViewData(view) {
    if(view === 'dashboard') loadDashboard();
    else if(view === 'orders') loadOrders();
    else if(view === 'products') loadProducts();
    else if(view === 'categories') loadCategories();
    else if(view === 'coupons') loadCoupons();
    else if(view === 'reviews') loadReviews();
    else if(view === 'suggestions') loadSuggestions();
    else if(view === 'settings') loadSettings();
}

/** =============== [VIEW 1: Dashboard] =============== */
async function loadDashboard() {
    try {
        const d = new Date(); document.getElementById('dash-time').innerText = d.toLocaleString('ar-EG');
        const { data: ords } = await supabaseClient.from('orders').select('id, total, status, order_number, customer_name, phone, payment_method').order('created_at', { ascending: false });
        
        let sales = 0, deliveredCount = 0, pendingCount = 0;
        const oList = ords || [];
        oList.forEach(o => {
            if(o.status === 'delivered') { sales += parseFloat(o.total); deliveredCount++; }
            if(o.status === 'pending') pendingCount++;
        });
        
        document.getElementById('st-sales').innerText = sales.toLocaleString();
        document.getElementById('st-orders').innerText = deliveredCount;
        document.getElementById('st-pending').innerText = pendingCount;
        
        const { count: revCount } = await supabaseClient.from('reviews').select('*', { count: 'exact' }).eq('approved', false);
        document.getElementById('st-reviews').innerText = revCount || 0;
        
        // Render 10 recent
        const tbody = document.getElementById('tbl-recent-orders');
        tbody.innerHTML = '';
        oList.slice(0, 10).forEach(o => {
            tbody.innerHTML += `<tr>
                <td style="color:var(--accent);">${o.order_number}</td>
                <td>${o.customer_name}</td>
                <td class="font-num">${o.phone}</td>
                <td class="font-num">${o.total} ج</td>
                <td>${o.payment_method === 'cash' ? 'كاش' : o.payment_method}</td>
                <td><span class="badge ${o.status}">${o.status}</span></td>
            </tr>`;
        });
        
    } catch(e) { console.error(e); }
}

/** =============== [VIEW 2: Orders] =============== */
async function loadOrders(statusFilt = 'all', search = '') {
    try {
        let q = supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
        if(statusFilt !== 'all') q = q.eq('status', statusFilt);
        if(search) q = q.or(`order_number.ilike.%${search}%,phone.ilike.%${search}%`);
        
        const { data, error } = await q.limit(50);
        if(error) throw error;
        
        const tb = document.getElementById('tbl-orders');
        tb.innerHTML = '';
        data.forEach(o => {
            const dStr = new Date(o.created_at).toLocaleDateString('ar-EG');
            tb.innerHTML += `<tr>
                <td class="font-num" style="color:var(--accent);">${o.order_number}</td>
                <td>${o.customer_name}</td>
                <td>${o.governorate}</td>
                <td>${o.payment_method}</td>
                <td class="font-num">${o.total} ج</td>
                <td><span class="badge ${o.status}">${o.status}</span></td>
                <td class="font-num">${dStr}</td>
                <td><button class="action-btn" onclick="appAdmin.openOrder('${o.id}')">إدارة ومراجعة</button></td>
            </tr>`;
        });
        
    } catch(e) { window.showToast('فشل في جلب الطلبات', 'error'); }
}

// Attach filters
document.querySelectorAll('#order-tabs .btn').forEach(b => {
    b.addEventListener('click', (e) => {
        document.querySelectorAll('#order-tabs .btn').forEach(btn => {
            btn.className = 'btn btn-ghost btn-sm'; btn.style.borderColor = 'transparent';
        });
        e.target.className = 'btn btn-secondary btn-sm';
        e.target.style.borderColor = 'var(--accent)';
        loadOrders(e.target.dataset.status, document.getElementById('srch-orders').value);
    });
});
document.getElementById('srch-orders').addEventListener('input', (e) => {
    const activeStat = document.querySelector('#order-tabs .btn-secondary').dataset.status;
    loadOrders(activeStat, e.target.value);
});

window.appAdmin.openOrder = async (id) => {
    try {
        const { data, error } = await supabaseClient.from('orders').select('*').eq('id', id).single();
        if(error) throw error;
        currentOrderEditId = data.id;
        
        document.getElementById('m-o-num').innerText = data.order_number;
        document.getElementById('m-o-status').value = data.status;
        
        document.getElementById('m-o-customer').innerHTML = `
            <strong>الاسم:</strong> ${data.customer_name}<br>
            <strong>الهاتف:</strong> ${data.phone}<br>
            <strong>العنوان:</strong> ${data.governorate}، ${data.city} - ${data.address}<br>
            <strong>التاريخ:</strong> ${new Date(data.created_at).toLocaleString('ar-EG')}<br>
        `;
        document.getElementById('m-o-bill').innerHTML = `
            <strong>الأساس:</strong> ${data.subtotal} ج<br>
            <strong>الخصم:</strong> ${data.discount} ج (${data.coupon_code || 'بدون كوبون'})<br>
            <strong>الإجمالي:</strong> <span style="color:var(--accent); font-weight:700;">${data.total} ج</span><br>
            <strong>طريقة الدفع:</strong> ${data.payment_method}<br>
        `;
        
        let is = '';
        data.items.forEach(i => {
           is += `<tr><td>${i.name}</td><td class="font-num">×${i.quantity}</td><td class="font-num">${i.price * i.quantity} ج</td></tr>`;
        });
        document.getElementById('m-o-items').innerHTML = is;
        
        const wMsg = `مرحباً بك عميل Heru الكريم (طلب رقم ${data.order_number})\nنتواصل معك بخصوص...`;
        document.getElementById('m-o-wa').href = `https://wa.me/2${data.phone}?text=${encodeURIComponent(wMsg)}`;
        
        document.getElementById('modal-order').classList.add('active');
    } catch(e) { window.showToast('خطأ في جلب بيانات المعاملة', 'error'); }
};

window.appAdmin.triggerOrderStatusChange = async (status) => {
    if(!currentOrderEditId) return;
    try {
        const { error } = await supabaseClient.from('orders').update({status}).eq('id', currentOrderEditId);
        if(error) throw error;
        window.showToast('تم حفظ تغيير الحالة بنجاح وبشكل فوري', 'success');
        
        // hard refresh list
        const activeStat = document.querySelector('#order-tabs .btn-secondary').dataset.status;
        loadOrders(activeStat, document.getElementById('srch-orders').value);
    } catch(e) { window.showToast('تعذر تغيير الحالة', 'error'); }
};


/** =============== [VIEW 3: Products] =============== */
async function loadProducts() {
    try {
        const { data, error } = await supabaseClient.from('products').select('*, categories(name_ar)').order('created_at', { ascending: false });
        if(error) throw error;
        
        const grid = document.getElementById('grid-products');
        grid.innerHTML = '';
        data.forEach(p => {
            const img = (p.images && p.images.length) ? p.images[0] : '/assets/images/placeholder.jpg';
            grid.innerHTML += `
               <div style="background:var(--bg-elevated); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden;">
                   <img src="${img}" style="width:100%; height:160px; object-fit:cover;">
                   <div style="padding:16px;">
                       <h4 style="margin:0 0 8px 0; font-size:16px;">${p.name_ar} ${p.featured ? '⭐' : ''}</h4>
                       <div style="color:var(--text-muted); font-size:12px; margin-bottom:12px;">مخزون: ${p.stock} | السعر: ${p.price}</div>
                       <div style="display:flex; justify-content:space-between;">
                           <a href="/admin/edit-product?id=${p.id}" class="action-btn" style="margin:0; text-decoration:none;">تعديل المنتج</a>
                           <button class="action-btn" style="margin:0; color:var(--error);" onclick="appAdmin.deleteProduct('${p.id}')">حذف</button>
                       </div>
                   </div>
               </div>
            `;
        });
    } catch(e) { window.showToast('حدث خطأ في تحميل الكتالوج', 'error'); }
}

window.adminModals.openProduct = async () => {
    currentProductEditId = null; cachedProductsImages = [];
    document.getElementById('form-product').reset();
    document.getElementById('p-images-preview').innerHTML = '';
    document.getElementById('p-upl-progress').style.width = '0%';
    document.getElementById('p-modal-title').innerText = 'تكوين منتج جديد';
    
    await populateCatSel('p-category');
    document.getElementById('modal-product').classList.add('active');
};

window.adminModals.closeProduct = () => { document.getElementById('modal-product').classList.remove('active'); };

window.adminModals.editProduct = async (id) => {
    try {
        const { data, error } = await supabaseClient.from('products').select('*').eq('id', id).single();
        if(error) throw error;
        currentProductEditId = data.id;
        
        await populateCatSel('p-category');
        document.getElementById('p-name-ar').value = data.name_ar;
        document.getElementById('p-name-en').value = data.name_en;
        document.getElementById('p-price').value = data.price;
        document.getElementById('p-stock').value = data.stock;
        document.getElementById('p-category').value = data.category_id;
        document.getElementById('p-desc').value = data.description_ar;
        document.getElementById('p-active').checked = data.active;
        document.getElementById('p-featured').checked = data.featured;
        
        cachedProductsImages = data.images || [];
        renderFilePreviews();
        
        document.getElementById('p-modal-title').innerText = 'تعديل الصنف والمخزون';
        document.getElementById('modal-product').classList.add('active');
    } catch(e) { window.showToast('تعذر فك بيانات المنتج', 'error'); }
};

window.appAdmin.deleteProduct = async (id) => {
    if(!confirm("تحذير نهائي: هل أنت متأكد من رغبتك في حذف هذا المنتج تماماً من قاعدة البيانات؟ (لا يمكن التراجع)")) return;
    try {
        const { error } = await supabaseClient.from('products').delete().eq('id', id);
        if(error) throw error;
        window.showToast('تم التدمير والحذف بنجاح', 'success');
        loadProducts();
    } catch(e) { window.showToast('فشل أثناء الحذف النهائي.', 'error'); }
};

window.appAdmin.saveProduct = async () => {
    try {
        const payload = {
            name_ar: document.getElementById('p-name-ar').value,
            name_en: document.getElementById('p-name-en').value,
            price: parseFloat(document.getElementById('p-price').value),
            stock: parseInt(document.getElementById('p-stock').value, 10),
            category_id: document.getElementById('p-category').value,
            description_ar: document.getElementById('p-desc').value,
            description_en: document.getElementById('p-desc').value, // auto-copy
            images: cachedProductsImages,
            active: document.getElementById('p-active').checked,
            featured: document.getElementById('p-featured').checked
        };
        
        let errorObj;
        if(currentProductEditId) {
            const { error } = await supabaseClient.from('products').update(payload).eq('id', currentProductEditId);
            errorObj = error;
        } else {
            const { error } = await supabaseClient.from('products').insert([payload]);
            errorObj = error;
        }
        
        if(errorObj) throw errorObj;
        window.showToast('تم تحديث البيانات، ونشر المنتج للعامة بنجاح.', 'success');
        adminModals.closeProduct();
        loadProducts();
    } catch(e) { window.showToast('حدث خطأ بالاتصال وحفظ التغييرات', 'error'); }
};

// -- Cloudinary -- //
function setupCloudinaryUploader() {
    const b = document.getElementById('p-upl-box');
    const f = document.getElementById('p-file');
    const pBar = document.getElementById('p-upl-progress');
    
    if (!b || !f) return;
    
    b.addEventListener('click', () => f.click());
    f.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if(!files.length) return;
        if(cachedProductsImages.length + files.length > 5) { window.showToast('خطأ: 5 صور كحد أقصى مسموح بها', 'error'); return; }
        
        // You should define VITE_CLOUDINARY_CLOUD_NAME config or fetch from Settings DB
        let clName = 'demo', clPreset = 'unsigned_preset_heru';
        // Check settings table via global caching if available. Using fallbacks.
        
        for (let file of files) {
            await new Promise((resolve) => {
                const xr = new XMLHttpRequest();
                const fd = new FormData();
                fd.append('file', file);
                fd.append('upload_preset', clPreset);
                
                xr.open('POST', `https://api.cloudinary.com/v1_1/${clName}/image/upload`, true);
                xr.upload.onprogress = (ev) => { if(ev.lengthComputable) pBar.style.width = (ev.loaded/ev.total*100)+'%'; };
                xr.onload = () => {
                    pBar.style.width = '0%';
                    if(xr.status === 200) {
                        const r = JSON.parse(xr.responseText);
                        cachedProductsImages.push(r.secure_url);
                        renderFilePreviews();
                    } else { window.showToast('فشل في رفع إحدى الصور', 'error'); }
                    resolve();
                };
                xr.onerror = () => { pBar.style.width = '0%'; resolve(); window.showToast('خطأ شبكة أثناء الرفع', 'error'); };
                xr.send(fd);
            });
        }
    });
}
function renderFilePreviews() {
    let hs = '';
    cachedProductsImages.forEach((img, ix) => {
        hs += `<div style="position:relative; width:60px; height:60px; border-radius:4px; overflow:hidden; border:1px solid var(--border);">
            <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; inset:0; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; cursor:pointer;" onclick="appAdmin.removeImg(${ix})"><span style="color:#fff; font-size:24px;">×</span></div>
        </div>`;
    });
    document.getElementById('p-images-preview').innerHTML = hs;
}
window.appAdmin.removeImg = (i) => { cachedProductsImages.splice(i, 1); renderFilePreviews(); };


/** =============== [VIEW 4, 5, 6, 7, 8 Mocks Simplified ] =============== */
async function loadCategories() {
    const { data } = await supabaseClient.from('categories').select('*').order('sort_order', { ascending: true });
    let s = '';
    (data||[]).forEach(c => { s+=`<tr><td>${c.name_ar}</td><td>${c.color||'-'}</td><td><a href="/admin/edit-category?id=${c.id}" class="action-btn" style="text-decoration:none;">تعديل</a> <button class="action-btn" style="color:var(--error);" onclick="appAdmin.deleteCat('${c.id}')">حذف</button></td></tr>`; });
    document.getElementById('list-categories').innerHTML = s || '<tr><td colspan="3">لم يتم العثور على أية أقسام</td></tr>';
}
window.appAdmin.deleteCat = async (id) => {
    if(!confirm("حذف القسم؟")) return; await supabaseClient.from('categories').delete().eq('id',id); loadCategories();
};
window.adminModals.openCategory = () => { alert("Modal logic for Categories mapping to insert"); };


async function loadCoupons() {
    const { data } = await supabaseClient.from('coupons').select('*').order('created_at', { ascending: false });
    let s = '';
    (data||[]).forEach(c => { s+=`<tr><td>${c.code}</td><td>${c.value}</td><td>${c.uses_count}/${c.max_uses||'∞'}</td><td>${c.active?'نشط':'مُعطل'}</td><td><button class="action-btn" onclick="appAdmin.deleteCup('${c.id}')">حذف</button></td></tr>`; });
    document.getElementById('tbl-coupons').innerHTML = s || '<tr><td colspan="5">لا يوجد كوبونات</td></tr>';
}
window.appAdmin.deleteCup = async (id) => {
    if(!confirm("إتلاف الكود؟")) return; await supabaseClient.from('coupons').delete().eq('id',id); loadCoupons();
};
window.adminModals.openCoupon = () => { alert("Modal logic for Coupons mapping to insert"); };


async function loadReviews() {
    const { data } = await supabaseClient.from('store_reviews').select('*').order('created_at', { ascending: false });
    let s = '';
    (data||[]).forEach(c => { s+=`<tr><td>${c.reviewer_name}</td><td>${c.rating}★</td><td>${c.comment}</td><td>${c.approved?'مقبول':'بالانتظار'}</td>
      <td>
        <button class="action-btn" onclick="appAdmin.toggleReview('${c.id}', true)">اعتماد</button>
        <button class="action-btn" style="color:var(--error)" onclick="appAdmin.deleteRev('${c.id}')">مسح</button>
      </td></tr>`; 
    });
    document.getElementById('tbl-reviews').innerHTML = s || '<tr><td colspan="5">الصندوق فارغ تماما</td></tr>';
}
window.appAdmin.toggleReview = async (id, to) => { await supabaseClient.from('store_reviews').update({approved:to}).eq('id',id); loadReviews(); };
window.appAdmin.deleteRev = async (id) => { if(!confirm("حذف التقييم؟")) return; await supabaseClient.from('store_reviews').delete().eq('id',id); loadReviews(); };


async function loadSuggestions() {
    const { data } = await supabaseClient.from('suggestions').select('*').order('created_at', { ascending: false });
    const g = document.getElementById('grid-suggestions'); g.innerHTML = '';
    (data||[]).forEach(s => {
        g.innerHTML += `<div style="background:var(--bg-elevated); padding:16px; border-radius:8px;">
            <h4>${s.name}</h4><div style="font-size:14px; margin-bottom:8px; color:var(--text-muted);">${s.description}</div>
            <a href="https://wa.me/2${s.phone}" target="_blank" class="btn btn-sm btn-whatsapp">محادثة على الواتساب (${s.status})</a>
        </div>`;
    });
}


async function loadSettings() {
    const { data } = await supabaseClient.from('settings').select('*');
    if(!data) return;
    const map = {}; data.forEach(d => map[d.key] = d.value);
    document.getElementById('set-whatsapp').value = map['whatsapp_number'] || '';
    document.getElementById('set-preset').value = map['cloudinary_preset'] || '';
}

window.appAdmin.saveSettings = async () => {
    const p1 = document.getElementById('set-whatsapp').value;
    const p2 = document.getElementById('set-preset').value;
    await supabaseClient.from('settings').upsert({key: 'whatsapp_number', value: p1}, {onConflict:'key'});
    await supabaseClient.from('settings').upsert({key: 'cloudinary_preset', value: p2}, {onConflict:'key'});
    window.showToast('تم حفظ الإعدادات القسرية', 'success');
};


// Utils
async function populateCatSel(selId) {
    const { data } = await supabaseClient.from('categories').select('id, name_ar').eq('active', true);
    let s = ''; (data||[]).forEach(c => s+=`<option value="${c.id}">${c.name_ar}</option>`);
    document.getElementById(selId).innerHTML = s;
}

window.appAdmin.exportOrdersCSV = async () => {
    try {
        const { data, error } = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
        if(error) throw error;
        if(!data || data.length === 0) { window.showToast('لا توجد طلبات لتصديرها', 'error'); return; }

        const header = ["رقم الطلب", "العميل", "الهاتف", "المحافظة", "المنتجات", "الإجمالي", "الحالة", "التاريخ"];
        const rows = [header];

        data.forEach(o => {
            let productsStr = '';
            if(o.items && Array.isArray(o.items)) {
                productsStr = o.items.map(i => `${i.name} (x${i.quantity})`).join(" + ");
            }
            const dateStr = new Date(o.created_at).toLocaleString('ar-EG');
            const sanitize = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

            rows.push([
                sanitize(o.order_number), sanitize(o.customer_name), sanitize(o.phone), sanitize(o.governorate),
                sanitize(productsStr), sanitize(o.total), sanitize(o.status), sanitize(dateStr)
            ].join(','));
        });

        const csvContent = "\uFEFF" + rows.join('\n'); // Use BOM for Excel Arabic fix
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `heru_orders_backup_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.showToast('تم تصدير ملف الطلبات (CSV) بنجاح لضمان حفظ البيانات.', 'success');
    } catch (e) {
        window.showToast('فشل في تصدير الطلبات', 'error');
    }
};
