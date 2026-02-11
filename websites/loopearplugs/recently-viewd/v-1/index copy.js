const product = {
    id: 9552770171215,
    title: "Loop Dream",
    handle: "dream",
    description: '<p>Prepare for a restful night’s sleep with Loop Dream earplugs. Experience fewer noisy distractions for uninterrupted nights, whether you\'re side-sleeping, muffling a snoring partner – or both.</p>\n<ul>\n<li>\n<strong>Comfortable earplugs for side sleepers</strong><br>Low-profile shape with our softest silicone reduces pressure for all-night comfort.<br>\n</li>\n<li>\n<strong>Two types of ear tips<br></strong>Preloaded with Loop Dream Foam-Silicone Ear Tips – plus Loop Dream Double Tips for more customization</li>\n<li>\n<strong>Approved by sleep scientists</strong><br><meta charset="utf-8"> <span></span><span></span><span>Recommended by top sleep expert Matt Walker, PhD</span>\n</li>\n<li>\n<strong>Loop Dream Ear Tips</strong><br>Oval foam-silicone ear tips follow your ear’s natural shape for a snug fit<br>\n</li>\n<li>\n<strong>Noise reduction for snoring and night noise</strong><br>27 dB (SNR) to muffle partner snoring, city sounds, or other nighttime distractions.<br>\n</li>\n<li>\n<strong>Secure fit while sleeping</strong><br>Designed to stay in your ears through side-sleeping and all-night movement.<br>\n</li>\n<li>\n<strong>Loop Dream Carry Case</strong><br>With a no-slip bottom and roomy compartment for easy bedside access<br>\n</li>\n<li>\n<strong>Customizable fit</strong><br>Four different ear tip sizes for a snug  fit, even in smaller ears<br>\n</li>\n<li>\n<strong>Reusable and easy to clean</strong><br>Made from durable silicone so you can sleep soundly night after night<br>\n</li>\n<li>\n<strong>Certified hearing protection</strong><br><meta charset="utf-8"> <span></span><span></span><span>Protects your ears from damaging noise </span><br>\n</li>\n</ul>',
    published_at: "2024-10-10T08:03:28+02:00",
    created_at: "2024-09-05T13:20:05+02:00",
    vendor: "Loop Earplugs",
    type: "Earplugs",
    tags: ["bestseller", "dream", "earplugs", "Narvar_Field_Quality", "nvgroup_", "YGroup_dream"],
    price: 4495,
    price_min: 4495,
    price_max: 4495,
    available: true,
    price_varies: false,
    compare_at_price: null,
    compare_at_price_min: 0,
    compare_at_price_max: 0,
    compare_at_price_varies: false,
    variants: [
        {
            id: 49607655424335,
            title: "Black",
            option1: "Black",
            option2: null,
            option3: null,
            sku: "en-dr-blk-03",
            requires_shipping: true,
            taxable: true,
            featured_image: {
                id: 59139197075791,
                product_id: 9552770171215,
                position: 7,
                created_at: "2024-10-10T22:49:35+02:00",
                updated_at: "2025-09-03T09:25:16+02:00",
                alt: "#color_black",
                width: 1080,
                height: 1080,
                src: "//www.loopearplugs.com/cdn/shop/files/PDP_DREAM_BLACK_1-917582.png?v=1756884316",
                variant_ids: [49607655424335],
            },
            available: true,
            name: "Loop Dream - Black",
            public_title: "Black",
            options: ["Black"],
            price: 4495,
            weight: 0,
            compare_at_price: null,
            inventory_quantity: 140,
            inventory_management: "shopify",
            inventory_policy: "deny",
            barcode: "5407009942815",
            featured_media: {
                alt: "#color_black",
                id: 51113818620239,
                position: 10,
                preview_image: {
                    aspect_ratio: 1,
                    height: 1080,
                    width: 1080,
                    src: "//www.loopearplugs.com/cdn/shop/files/PDP_DREAM_BLACK_1-917582.png?v=1756884316",
                },
            },
            requires_selling_plan: false,
            selling_plan_allocations: [],
            quantity_rule: {
                min: 1,
                max: null,
                increment: 1,
            },
        },
        //   other are same like above one, just different color and image
    ],
    featured_image: "//www.loopearplugs.com/cdn/shop/files/PDP_DREAM_LILAC_1-270685.png?v=1728593375",
    options: ["Color"],
    requires_selling_plan: false,
    selling_plan_groups: [],
    content: '<p>Prepare for a restful night’s sleep with Loop Dream earplugs. Experience fewer noisy distractions for uninterrupted nights, whether you\'re side-sleeping, muffling a snoring partner – or both.</p>\n<ul>\n<li>\n<strong>Comfortable earplugs for side sleepers</strong><br>Low-profile shape with our softest silicone reduces pressure for all-night comfort.<br>\n</li>\n<li>\n<strong>Two types of ear tips<br></strong>Preloaded with Loop Dream Foam-Silicone Ear Tips – plus Loop Dream Double Tips for more customization</li>\n<li>\n<strong>Approved by sleep scientists</strong><br><meta charset="utf-8"> <span></span><span></span><span>Recommended by top sleep expert Matt Walker, PhD</span>\n</li>\n<li>\n<strong>Loop Dream Ear Tips</strong><br>Oval foam-silicone ear tips follow your ear’s natural shape for a snug fit<br>\n</li>\n<li>\n<strong>Noise reduction for snoring and night noise</strong><br>27 dB (SNR) to muffle partner snoring, city sounds, or other nighttime distractions.<br>\n</li>\n<li>\n<strong>Secure fit while sleeping</strong><br>Designed to stay in your ears through side-sleeping and all-night movement.<br>\n</li>\n<li>\n<strong>Loop Dream Carry Case</strong><br>With a no-slip bottom and roomy compartment for easy bedside access<br>\n</li>\n<li>\n<strong>Customizable fit</strong><br>Four different ear tip sizes for a snug  fit, even in smaller ears<br>\n</li>\n<li>\n<strong>Reusable and easy to clean</strong><br>Made from durable silicone so you can sleep soundly night after night<br>\n</li>\n<li>\n<strong>Certified hearing protection</strong><br><meta charset="utf-8"> <span></span><span></span><span>Protects your ears from damaging noise </span><br>\n</li>\n</ul>',
};



(() => {
    // Mobile only
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    if (location.pathname.includes('/checkout')) return;

    const STORAGE_KEY = 'recently_viewed_products';
    const MAX_ITEMS = 10;

    // CSS STYLES
    const css = `
        .loop-rv-section {
            background: #f8f8f8;
            padding: 32px 16px 64px 16px;
        }

        .loop-rv-heading {
            color: #111;
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 20px 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .loop-rv-swiper {
            overflow: hidden;
            position: relative;
        }

        .loop-rv-swiper .swiper-wrapper {
            display: flex;
        }

        .loop-rv-swiper .swiper-slide {
            flex-shrink: 0;
            width: 100%;
        }

        .loop-rv-slide-content {
            display: flex;
            gap: 12px;
        }

        .loop-rv-product-card {
            flex: 0 0 calc(50% - 6px);
            max-width: calc(50% - 6px);
        }

        .loop-rv-card {
            background: #f6f6f6;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .loop-rv-image {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: contain;
            margin-bottom: 12px;
            border-radius: 8px;
        }

        .loop-rv-swatch-container {
            text-align: center;
            margin-bottom: 12px;
            min-height: 26px;
        }

        .loop-rv-color-swatch {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid transparent;
            margin: 0 3px;
            cursor: pointer;
            padding: 0;
            outline-offset: 2px;
            transition: border 0.2s;
        }

        .loop-rv-color-swatch.loop-rv-selected {
            border-color: #000;
        }

        .loop-rv-title {
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #111;
            text-align: left;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.3;
        }

        .loop-rv-price {
            font-size: 16px;
            font-weight: 700;
            margin: 0 0 12px 0;
            color: #111;
            text-align: left;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .loop-rv-atc {
            width: 100%;
            background: #111;
            color: #fff;
            border: none;
            border-radius: 30px;
            padding:6px 14px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin-top: auto;
        }

        .loop-rv-atc:hover {
            background: #333;
        }

        .loop-rv-atc:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .loop-rv-pagination {
            margin-top: 20px;
            text-align: center;
        }

        .loop-rv-bullet {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: #ccc;
            margin: 0 4px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .loop-rv-bullet.loop-rv-active {
            background: #111;
        }
    `;

    // Inject CSS
    if (!document.getElementById("loop-rv-style")) {
        const style = document.createElement("style");
        style.id = "loop-rv-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }
    
    /**
     * Wait for element to appear in DOM
     */
    const waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        const conditionMet = isVariable
            ? typeof window[waitFor] !== "undefined"
            : elements.length >= minElements;
        conditionMet
            ? callback(elements)
            : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    };

    /**
     * Normalize image URLs (add https: if needed)
     */
    const normalizeImg = (src) => {
        if (!src) return '';
        return src.startsWith('//') ? `https:${src}` : src;
    };
    
    /**
     * Get color code from color name
     */
    const getColorCode = (colorName) => {
        return window?.allColorSwatchesObject?.[colorName]?.color || '#ccc';
    };
    
    /**
     * Get stored product IDs from localStorage
     */
    const getStoredIds = () => {
        try { 
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; 
        } catch { 
            return []; 
        }
    };

    /**
     * Save product IDs to localStorage
     */
    const setStoredIds = (ids) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    };

    /**
     * Save current product to recently viewed
     */
    const saveCurrentProduct = () => {
        if (!window.meta?.product) return;
        
        const productId = window.meta.product.id;
        const handle = window.meta.product.handle;
        
        let storedItems = getStoredIds();
        
        // Remove if already exists
        storedItems = storedItems.filter(item => item.id !== productId);
        
        // Add to beginning
        storedItems.unshift({ id: productId, handle: handle });
        
        // Limit to MAX_ITEMS
        if (storedItems.length > MAX_ITEMS) {
            storedItems = storedItems.slice(0, MAX_ITEMS);
        }
        
        setStoredIds(storedItems);
    };
    
    /**
     * Fetch product data by handle from Shopify
     */
    const fetchProductData = async (handle) => {
        try {
            const response = await fetch(`/products/${handle}.js`);
            if (!response.ok) throw new Error('Product not found');
            return await response.json();
        } catch (error) {
            return null;
        }
    };

    /**
     * Fetch all products data
     */
    const fetchAllProducts = async (storedItems) => {
        const productPromises = storedItems.map(item => fetchProductData(item.handle));
        const products = await Promise.all(productPromises);
        return products.filter(p => p !== null);
    };
    
    /**
     * Generate color swatch HTML
     */
    const generateColorSwatches = (variants) => {
        return variants.map((variant, index) => {
            const colorName = variant.option1 || variant.public_title || '';
            const isSelected = index === 0; 
            const variantImg = normalizeImg(variant.featured_image?.src || '');
            const colorCode = getColorCode(colorName);
            
            return `
                <button 
                    class="loop-rv-color-swatch ${isSelected ? 'loop-rv-selected' : ''}" 
                    data-variant-id="${variant.id}"
                    data-image="${variantImg}"
                    data-price="${variant.price}"
                    aria-label="${colorName}"
                    style="background: ${colorCode};"
                ></button>
            `;
        }).join('');
    };

    /**
     * Generate product card HTML
     */
    const generateProductCard = (product) => {
        const selectedVariant = product.variants[0];
        const img = normalizeImg(
            selectedVariant.featured_image?.src || 
            product.featured_image || 
            ''
        );
        const price = selectedVariant.price;
        const formattedPrice = `€${(price / 100).toFixed(2)}`;
        const colorSwatches = generateColorSwatches(product.variants);

        return `
            <div class="loop-rv-product-card" data-product-id="${product.id}">
                <div class="loop-rv-card">
                    <img 
                        class="loop-rv-image"
                        src="${img}" 
                        loading="lazy"
                        alt="${product.title}"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E'"
                    >
                    <div class="loop-rv-swatch-container">
                        ${colorSwatches}
                    </div>
                    <h3 class="loop-rv-title">${product.title}</h3>
                    <p class="loop-rv-price">${formattedPrice}</p>
                    <button 
                        class="loop-rv-atc" 
                        data-id="${selectedVariant.id}"
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        `;
    };

    /**
     * Split products into pages of 2 and generate slides HTML
     */
    const generateSlidesHTML = (products) => {
        const pages = [];
        for (let i = 0; i < products.length; i += 2) {
            pages.push(products.slice(i, i + 2));
        }

        const slidesHTML = pages.map(pageProducts => {
            const productsHTML = pageProducts.map(generateProductCard).join('');
            return `
                <div class="swiper-slide">
                    <div class="loop-rv-slide-content">
                        ${productsHTML}
                    </div>
                </div>
            `;
        }).join('');

        return { slidesHTML, totalPages: pages.length };
    };

    /**
     * Generate pagination bullets HTML
     */
    const generatePaginationHTML = (totalPages) => {
        if (totalPages <= 1) return '';
        
        const bullets = Array.from({ length: totalPages }, (_, index) => 
            `<span class="loop-rv-bullet ${index === 0 ? 'loop-rv-active' : ''}" data-index="${index}"></span>`
        ).join('');
        
        return `<div class="loop-rv-pagination">${bullets}</div>`;
    };

    /**
     * Handle color swatch click
     */
    const handleSwatchClick = (e) => {
        const swatch = e.target.closest('.loop-rv-color-swatch');
        if (!swatch) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const card = swatch.closest('.loop-rv-product-card');
        const newImage = swatch.dataset.image;
        const newPrice = swatch.dataset.price;
        const img = card.querySelector('.loop-rv-image');
        const priceEl = card.querySelector('.loop-rv-price');
        
        // Update image
        if (newImage && img) {
            img.src = newImage;
        }
        
        // Update price
        if (newPrice && priceEl) {
            priceEl.textContent = `€${(newPrice / 100).toFixed(2)}`;
        }
        
        // Update selected state
        card.querySelectorAll('.loop-rv-color-swatch').forEach(s => {
            s.classList.remove('loop-rv-selected');
        });
        swatch.classList.add('loop-rv-selected');
        
        // Update button variant ID
        const btn = card.querySelector('.loop-rv-atc');
        if (btn) {
            btn.dataset.id = swatch.dataset.variantId;
        }
    };

    /**
     * Handle add to cart click
     */
    const handleAddToCart = async (e) => {
        const btn = e.target.closest('.loop-rv-atc');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const originalText = btn.textContent;
        btn.textContent = 'Adding...';
        btn.disabled = true;

        try {
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: btn.dataset.id, quantity: 1 })
            });
            
            await response.json();
            
            btn.textContent = 'Added ✓';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
            
            // Trigger cart update events
            if (typeof window.theme !== 'undefined' && window.theme.cartUpdateCallbacks) {
                window.theme.cartUpdateCallbacks.forEach(cb => cb());
            }
            document.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (err) {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    };

    /**
     * Update pagination bullets on slide change
     */
    const updatePagination = (activeIndex, section) => {
        const bullets = section.querySelectorAll('.loop-rv-bullet');
        bullets.forEach((bullet, index) => {
            if (index === activeIndex) {
                bullet.classList.add('loop-rv-active');
            } else {
                bullet.classList.remove('loop-rv-active');
            }
        });
    };

    /**
     * Initialize Swiper
     */
    const initializeSwiper = (section, totalPages) => {
        waitForElem('Swiper', () => {
            const swiperInstance = new Swiper(section.querySelector('.loop-rv-swiper'), {
                slidesPerView: 1,
                spaceBetween: 0,
                touchRatio: 1,
                touchAngle: 45,
                grabCursor: true,
                simulateTouch: true,
                allowTouchMove: true,
                threshold: 5,
                speed: 300,
                resistance: true,
                resistanceRatio: 0.85,
                on: {
                    slideChange: function() {
                        updatePagination(this.activeIndex, section);
                    }
                }
            });

            // Pagination click handler
            section.querySelectorAll('.loop-rv-bullet').forEach(bullet => {
                bullet.addEventListener('click', () => {
                    const index = parseInt(bullet.dataset.index);
                    swiperInstance.slideTo(index);
                });
            });

            console.log('Loop RV: Swiper initialized with', totalPages, 'slides');
        }, 1, true);
    };
    
    /**
     * Render the recently viewed section
     */
    const render = async () => {
        if (document.querySelector('.loop-rv-section')) return;

        const main = document.querySelector('#MainContent') || document.querySelector('main');
        if (!main) return;

        const storedItems = getStoredIds();
        if (!storedItems.length) return;

        // Fetch all products
        const validProducts = await fetchAllProducts(storedItems);
        if (!validProducts.length) return;

        // Generate HTML
        const { slidesHTML, totalPages } = generateSlidesHTML(validProducts);
        const paginationHTML = generatePaginationHTML(totalPages);

        // Create section
        const section = document.createElement('div');
        section.className = 'loop-rv-section';
        section.innerHTML = `
            <h2 class="loop-rv-heading">Recently viewed</h2>
            <swiper-products class="swiper loop-rv-swiper">
                <div class="swiper-wrapper">
                    ${slidesHTML}
                </div>
                ${paginationHTML}
            </swiper-products>
        `;

        main.insertAdjacentElement('afterend', section);

        // Attach event listeners
        section.addEventListener('click', handleSwatchClick);
        section.addEventListener('click', handleAddToCart);

        // Initialize Swiper
        initializeSwiper(section, totalPages);
    };
    
    // Save current product
    saveCurrentProduct();

    // Render section when page is ready
    waitForElem('#MainContent, main', render);

})();