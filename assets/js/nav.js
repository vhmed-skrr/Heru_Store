/**
 * nav.js - Dynamic Navigation Rendering & Mobile Sidebar Toggle
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Mobile Menu Toggle Logic
    function setupMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const toggleButtons = document.querySelectorAll('.mobile-menu-toggle');
        
        if (mobileMenu && toggleButtons.length > 0) {
            toggleButtons.forEach(btn => {
                // Prevent duplicate listeners
                if (!btn.dataset.initialized) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (mobileMenu.classList.contains('open')) {
                            mobileMenu.classList.remove('open');
                            btn.setAttribute('aria-expanded', 'false');
                        } else {
                            mobileMenu.classList.add('open');
                            btn.setAttribute('aria-expanded', 'true');
                        }
                    });
                    btn.dataset.initialized = "true";
                }
            });
        }
        const menuLinks = document.querySelectorAll('.mobile-menu a');
        menuLinks.forEach(link => {
            if (!link.dataset.initialized) {
                link.addEventListener('click', () => {
                    if (mobileMenu && mobileMenu.classList.contains('open')) {
                        mobileMenu.classList.remove('open');
                        const btn = document.querySelector('.mobile-menu-toggle[aria-expanded="true"]');
                        if (btn) btn.setAttribute('aria-expanded', 'false');
                    }
                });
                link.dataset.initialized = "true";
            }
        });
    }

    // Initialize toggle first so it works immediately
    setupMobileMenu();

    // 2. Dynamic Fetch & Render
    try {
        const module = await import('/assets/js/supabase.js');
        const supabaseClient = module.supabaseClient;
        if (!supabaseClient) return;

        // Fetch Settings & Categories concurrently
        const [settingsResult, categoriesResult] = await Promise.all([
            supabaseClient.from('settings').select('key, value').in('key', ['logo_type', 'logo_value', 'logo_height', 'nav_links', 'store_name']),
            supabaseClient.from('categories').select('*').eq('active', true).order('sort_order')
        ]);
        
        const s = {};
        if (settingsResult.data) {
            settingsResult.data.forEach(row => s[row.key] = row.value);
        }
        const categories = categoriesResult.data;

        const currentLang = localStorage.getItem('heru-lang') || 'ar';
        const isRtl = currentLang === 'ar';

        // Render Logo
        const logoEl = document.querySelector('.navbar-logo');
        if (logoEl) {
            const logoType = s.logo_type || 'text';
            const logoHeight = s.logo_height || '40';
            const storeName = s.store_name || s.logo_value || 'HERU';

            if (logoType === 'image' && s.logo_value) {
                // If it's Cloudinary, we could optionally optimize here
                let optUrl = s.logo_value;
                if(optUrl.includes('cloudinary.com') && !optUrl.includes('/upload/h_')) {
                    optUrl = optUrl.replace('/upload/', `/upload/h_${logoHeight * 2},c_scale,q_auto,f_auto/`);
                }
                
                logoEl.innerHTML = `<img src="${optUrl}" alt="${storeName}" style="height:${logoHeight}px; width:auto; vertical-align:middle; display:block;">`;
                logoEl.style.textDecoration = 'none';
            } else {
                logoEl.textContent = storeName;
            }
        }

        // Render Links
        const linksContainer = document.querySelector('.navbar-links');
        const mobileContainer = document.querySelector('.mobile-menu');

        let linksJson = [];
        try { linksJson = JSON.parse(s.nav_links || '[]'); } catch(e) {}

        // Fallback to static if JSON is empty and we haven't configured it
        if (linksContainer && linksJson.length > 0) {
            let ulHtml = '';
            linksJson.forEach(link => {
                if(link.active !== false) {
                    const label = isRtl ? (link.label_ar || link.label_en) : (link.label_en || link.label_ar);
                    // Add proper base if relative
                    let url = link.url;
                    ulHtml += `<li><a href="${url}"><span>${label}</span></a></li>`;
                }
            });

            // Construct Categories Dropdown
            if (categories && categories.length > 0) {
                const exploreLabel = isRtl ? 'استكشف' : 'Explore';
                let dropdownHtml = `
                <li class="nav-dropdown">
                    <a href="javascript:void(0)" aria-haspopup="true" aria-expanded="false" style="display:flex; align-items:center; gap:4px; padding-block:var(--space-2);">
                        <span>${exploreLabel}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="dropdown-chevron" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </a>
                    <div class="nav-dropdown-menu">`;
                
                categories.forEach(cat => {
                    const cLabel = isRtl ? cat.name_ar : (cat.name_en || cat.name_ar);
                    const cIcon = cat.icon || '';
                    dropdownHtml += `<a href="/shop?category=${cat.id}" class="nav-dropdown-item"><span class="cat-icon">${cIcon}</span> <span>${cLabel}</span></a>`;
                });

                dropdownHtml += `</div></li>`;
                ulHtml += dropdownHtml;
            }

            linksContainer.innerHTML = ulHtml;
        }

        // Re-inject mobile dynamic links preserving just the close button
        if (mobileContainer && linksJson.length > 0) {
            const closeBtn = mobileContainer.querySelector('.mobile-menu-toggle.open');
            mobileContainer.innerHTML = '';
            if (closeBtn) {
                mobileContainer.appendChild(closeBtn);
            } else {
                 mobileContainer.insertAdjacentHTML('beforeend', `<button class="mobile-menu-toggle open font-display" style="align-self: flex-end; font-size: 24px; display: block;" aria-label="إغلاق">✕</button>`);
            }

            linksJson.forEach(link => {
                if(link.active !== false) {
                    const label = isRtl ? (link.label_ar || link.label_en) : (link.label_en || link.label_ar);
                    mobileContainer.insertAdjacentHTML('beforeend', `<a href="${link.url}" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-xl);"><span>${label}</span></a>`);
                }
            });
            
            // Add categories in mobile menu
            if (categories && categories.length > 0) {
                const exploreLabel = isRtl ? 'استكشف' : 'Explore';
                mobileContainer.insertAdjacentHTML('beforeend', `<div style="padding: var(--space-4) var(--space-4) var(--space-2); font-weight:700; color:var(--text-muted); border-top:1px solid var(--border); font-size:var(--text-sm);">${exploreLabel}</div>`);
                categories.forEach(cat => {
                    const cLabel = isRtl ? cat.name_ar : (cat.name_en || cat.name_ar);
                    const cIcon = cat.icon || '';
                    mobileContainer.insertAdjacentHTML('beforeend', `<a href="/shop?category=${cat.id}" class="btn btn-ghost" style="justify-content: flex-start; font-size: var(--text-lg); padding-inline-start: var(--space-6);"><span class="cat-icon" style="margin-inline-end: 12px; font-size:24px;">${cIcon}</span> <span>${cLabel}</span></a>`);
                });
            }

            // Reattach listeners to newly created links
            setupMobileMenu();
        }

    } catch (e) {
        console.error('Navbar dynamics failed to load:', e);
    }
});

// ==== Global Product Card Handlers ====
window.switchProductCardImage = function(e, imageUrl, dotElement) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (!dotElement) return;
    
    const card = dotElement.closest('.card-product');
    if (!card) return;
    
    const img = card.querySelector('.product-img');
    if (img) img.src = imageUrl;
    
    const allDots = card.querySelectorAll('.multi-image-dot');
    allDots.forEach(d => d.classList.remove('active'));
    dotElement.classList.add('active');
};

window.quickAddToCart = function(e, productId, productDataStr, btnElement) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    let product;
    try {
        product = JSON.parse(decodeURIComponent(productDataStr));
    } catch (err) {
        console.error("Quick add failed parsing product data.");
        return;
    }
    
    // Check for variants/attributes if any, requiring navigation
    if (product.has_variants || product.variants || product.attributes) {
        window.location.href = './product?id=' + product.id;
        return;
    }
    
    const qty = 1;
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('heru_cart')) || [];
    } catch(err) {
        cart = [];
    }
    
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.quantity += qty;
    } else {
        const lang = localStorage.getItem('heru-lang') || 'ar';
        const name = lang === 'ar' ? product.name_ar : (product.name_en || product.name_ar);
        let image = '';
        if (product.images && product.images.length > 0) image = product.images[0];
        
        cart.push({
            id: product.id,
            name: name,
            price: product.price,
            image: image,
            quantity: qty,
            maxStock: product.stock || 0
        });
    }
    
    localStorage.setItem('heru_cart', JSON.stringify(cart));
    
    // Update Badge
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.setAttribute('data-count', count);
    }
    
    // Success feedback
    if (btnElement) {
        btnElement.classList.add('success');
        setTimeout(() => {
            btnElement.classList.remove('success');
        }, 600);
    }
};
