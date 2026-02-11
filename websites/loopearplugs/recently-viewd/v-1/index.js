(() => {
    // Mobile only
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const allowedProducts = ["switch", "dream", "quiet", "engage", "experience", "mclaren"];
    if (!allowedProducts.some((p) => location?.pathname?.includes(p))) return;

    const STORAGE_KEY = "recently_viewed_products";
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
            background: #ccc;
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
            padding: 6px 14px;
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

    if (!document.getElementById("loop-rv-style")) {
        const style = document.createElement("style");
        style.id = "loop-rv-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // WAIT FOR ELEMENT POLL FUNCTION
    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 3000, frequency = 100) => {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);

        if (timer <= 0) return;

        const conditionMet = isVariable ? typeof window[waitFor] !== "undefined" : elements.length >= minElements;

        conditionMet ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    };

    // Injecting Swiper to create slider
    const injectSwiper = (cb) => {
        if (window.Swiper) return cb();

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
        script.onload = cb;
        document.body.appendChild(script);
    };

    // Create image URL from variant image src
    const normalizeImg = (src) => {
        if (!src) return "";
        return src.startsWith("//") ? `https:${src}` : src;
    };

    // Get color code from global allColorSwatchesObject based on color name
    const getColorCode = (colorName) => {
        return window?.allColorSwatchesObject?.[colorName]?.color || "#ccc";
    };

    // Get stored product ids from localStorage
    const getStoredIds = () => {
        try {
            return JSON?.parse(localStorage?.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    };

    // store product id and handle in localStorage
    const setStoredIds = (ids) => {
        localStorage?.setItem(STORAGE_KEY, JSON.stringify(ids));
    };

    const saveCurrentProduct = () => {
        if (!window.meta?.product) return;
        const {id, handle} = window?.meta?.product;
        const items = getStoredIds()?.filter((p) => p?.id !== id);
        items?.unshift({id, handle});
        setStoredIds(items?.slice(0, MAX_ITEMS));
    };

    // Fetches product data from the Shopify endpoint based on the product handle
    const fetchProduct = async (handle) => {
        const r = await fetch(`/products/${handle}.js`);
        return r.ok ? r.json() : null;
    };

    // Generates the HTML for color swatches based on product variants
    const generateColorSwatches = (variants) => {
        return variants
            .map((variant, index) => {
                const colorName = variant?.option1 || variant?.public_title || "";
                const isSelected = index === 0;
                const variantImg = normalizeImg(variant?.featured_image?.src || "");
                const colorCode = getColorCode(colorName);

                return `
                <button 
                    class="loop-rv-color-swatch ${isSelected ? "loop-rv-selected" : ""}" 
                    data-variant-id="${variant?.id}"
                    data-image="${variantImg}"
                    data-price="${variant?.price}"
                    aria-label="${colorName}"
                    style="background: ${colorCode};"
                ></button>
            `;
            })
            .join("");
    };

    // Generates the HTML for a single product card
    const generateProductCard = (product) => {
        const {variants, featured_image, title, id} = product || {};
        const selectedVariant = variants?.[0] || {};
        const img = normalizeImg(selectedVariant?.featured_image?.src || featured_image || "");
        const selectedPrice = selectedVariant?.price;
        const formattedPrice = `€${(selectedPrice / 100).toFixed(2)}`;
        const colorSwatches = generateColorSwatches(variants);

        return `
            <div class="loop-rv-product-card" data-product-id="${id}">
                <div class="loop-rv-card">
                    <img 
                        class="loop-rv-image"
                        src="${img}" 
                        loading="lazy"
                        alt="${title}"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E'"
                    >
                    <div class="loop-rv-swatch-container">
                        ${colorSwatches}
                    </div>
                    <h3 class="loop-rv-title">${title}</h3>
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

    // Event delegation for swatch clicks
    const handleSwatchClick = (e) => {
        const swatch = e.target.closest(".loop-rv-color-swatch");
        if (!swatch) return;

        e.preventDefault();
        e.stopPropagation();

        const card = swatch.closest(".loop-rv-product-card");
        const newImage = swatch.dataset.image;
        const newPrice = swatch.dataset.price;
        const img = card.querySelector(".loop-rv-image");
        const priceEl = card.querySelector(".loop-rv-price");

        // Update image
        if (newImage && img) {
            img.src = newImage;
        }

        // Update price
        if (newPrice && priceEl) {
            priceEl.textContent = `€${(newPrice / 100).toFixed(2)}`;
        }

        // Update selected state
        card.querySelectorAll(".loop-rv-color-swatch").forEach((s) => {
            s.classList.remove("loop-rv-selected");
        });
        swatch.classList.add("loop-rv-selected");

        // Update button variant ID
        const btn = card.querySelector(".loop-rv-atc");
        if (btn) {
            btn.dataset.id = swatch.dataset.variantId;
        }
    };

    // Handle adding product to cart.
    const handleAddToCart = async (e) => {
        const btn = e.target.closest(".loop-rv-atc");
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const originalText = btn.textContent;
        btn.textContent = "Adding...";
        btn.disabled = true;

        try {
            const response = await fetch("/cart/add.js", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: btn.dataset.id, quantity: 1}),
            });

            await response.json();

            btn.textContent = "Added ✓";
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);

            // Trigger cart update events
            if (typeof window.theme !== "undefined" && window.theme.cartUpdateCallbacks) {
                window.theme.cartUpdateCallbacks.forEach((cb) => cb());
            }
            document.dispatchEvent(new CustomEvent("cart:updated"));
        } catch (err) {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    };

    // Create and render RV section with Swiper slider
    const render = async () => {
        if (document.querySelector(".loop-rv-section")) return;

        const products = await Promise.all(getStoredIds().map((p) => fetchProduct(p.handle)));

        const valid = products.filter(Boolean);
        if (!valid.length) return;

        // Chunk products into pairs (2 per slide)
        const chunks = [];
        for (let i = 0; i < valid.length; i += 2) {
            chunks.push(valid.slice(i, i + 2));
        }

        const section = document.createElement("div");
        section.className = "loop-rv-section";

        section.innerHTML = `
            <h2 class="loop-rv-heading">Recently viewed</h2>
            <div class="swiper loop-rv-swiper" style="width: 100%; height: auto;">
                <div class="swiper-wrapper">
                    ${chunks
                        .map(
                            (chunk) => `
                        <div class="swiper-slide">
                            <div class="loop-rv-slide-content">
                                ${chunk.map((p) => generateProductCard(p)).join("")}
                            </div>
                        </div>
                    `
                        )
                        .join("")}
                </div>
            </div>
            <div class="loop-rv-pagination">
                ${chunks.map((_, i) => `<span class="loop-rv-bullet ${i === 0 ? "loop-rv-active" : ""}" data-index="${i}"></span>`).join("")}
            </div>
        `;

        const main = document.querySelector("main");
        main?.insertAdjacentElement("afterend", section);

        // Attach event listeners
        section.addEventListener("click", handleSwatchClick);
        section.addEventListener("click", handleAddToCart);

        // Handle pagination bullet clicks
        section.querySelectorAll(".loop-rv-bullet").forEach((bullet) => {
            bullet.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                if (window.swiperInstance) {
                    window.swiperInstance.slideTo(index);
                }
            });
        });

        // Inject Swiper and initialize
        injectSwiper(() => {
            // Wait a moment for Swiper to be available
            setTimeout(() => {
                if (window.Swiper) {
                    window.swiperInstance = new window.Swiper(section.querySelector(".swiper"), {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        loop: false,
                        on: {
                            slideChange: function () {
                                section.querySelectorAll(".loop-rv-bullet").forEach((b, i) => b.classList.toggle("loop-rv-active", i === this.activeIndex));
                            },
                        },
                    });
                } else {
                    console.error("Swiper failed to load");
                }
            }, 100);
        });
    };

    saveCurrentProduct();
    waitForElem("main", render);
})();
