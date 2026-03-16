(() => { // IIFE — runs immediately and keeps variables out of global scope

    // Wait until an element appears in DOM (polling approach)
    const waitForElem = (selector, callback, timer = 30000, frequency = 100) => {
        const el = document.querySelector(selector); // try to find element now

        if (!el) { // if element not found
            if (timer <= 0) return; // stop trying if timeout exceeded

            // try again after "frequency" ms
            setTimeout(
                () => waitForElem(selector, callback, timer - frequency, frequency),
                frequency
            );
        } else {
            callback(el); // element found → run callback
        }
    };

    // Short helper for querySelector
    function q(sel, root = document) {
        return root.querySelector(sel); // find first matching element inside root
    }

    // Short helper for querySelectorAll that returns REAL array
    function qAll(sel, root = document) {
        return [...root.querySelectorAll(sel)];
    }

    // Experiment identifiers
    const ID = "PLP-Display_Secondary_Image";
    const VAR = "1";

    // Logging helper (stores logs + prints to console)
    function expLog() {
        window.runningExperiments[ID].logs.push([...arguments]);
        console.debug(...arguments);
    }

    // Ensure global experiment container exists
    window.runningExperiments = window.runningExperiments || {};

    // Register this experiment
    window.runningExperiments[ID] = {
        name: "",
        variation: `${VAR}`,
        logs: []
    };

    // Centralized selectors
    const SELECTORS = {
        collection: ".collection__products, .collection__infinite-container", // main product grid
        productItem: ".product-item", // each product card
        productImg: "img.image__img", // product image inside card
        loading: ".collection__loading", // loading spinner
        quickViewIcon: ".product-item__floating-action-buttons",
    };

    // Get (or create) global product cache object
    const getCache = () =>
        (window._plpSecondaryImageCache =
            window._plpSecondaryImageCache || {});

    // Extract product handle from card's data-url
    const getHandle = (card) => {
        const dataUrl = card.getAttribute("data-url") || ""; // product link
        const part = (dataUrl.split("/products/")[1] || "").split(/[/?#]/)[0];
        return part ? decodeURIComponent(part) : null; // decoded handle
    };

    // Fetch product JSON and cache it
    const fetchProduct = (handle, cache) => {
        const cleanHandle = handle.split("?")[0];

        // If not already fetched → fetch now
        if (!cache[cleanHandle]) {
            cache[cleanHandle] = fetch(`/products/${cleanHandle}.js`)
                .then((res) => (res.ok ? res.json() : null))
                .catch(() => null);
        }

        return cache[cleanHandle]; // return cached Promise
    };

    // Prefetch product data for visible cards
    const prefetchCards = (cards, cache) => {
        cards.forEach((card) => {
            const handle = getHandle(card);
            if (!handle || cache[handle]) return;
            fetchProduct(handle, cache);
        });
    };

    // MutationObserver instance reference
    let _collectionBodyObserver = null;

    // Observe page for collection changes (infinite scroll etc.)
    const observeCollection = (cache, setupFn) => {

        // Disconnect previous observer if exists
        if (_collectionBodyObserver) {
            try { _collectionBodyObserver.disconnect(); } catch (e) {}
        }

        // Check if mutation affects collection or product items
        const isRelevantMutation = (mutations) =>
            mutations.some((m) =>
                [...m.addedNodes, ...m.removedNodes].some((n) => {
                    if (n.nodeType !== 1) return false; // only element nodes
                    if (n.matches?.(SELECTORS.collection)) return true;
                    if (n.querySelector?.(SELECTORS.productItem)) return true;
                    return false;
                })
            );

        const callback = (mutations) => {
            if (!isRelevantMutation(mutations)) return;

            const current = q(SELECTORS.collection);
            if (!current) return;

            setupFn(current, cache); // re-run setup when grid changes
        };

        _collectionBodyObserver = new MutationObserver(callback);

        // Observe whole body for subtree changes
        _collectionBodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Choose secondary image (not same as current)
    const pickSecondaryImage = (product, currentSrc) => {
        const images = product?.images;
        if (!images || images.length < 2) return null;

        const currentBase = currentSrc.split("?")[0];
        const candidate = images[1];

        if (candidate.split("?")[0] === currentBase) {
            return images.length > 2 ? images[2] : null;
        }

        return candidate;
    };

    // Swap image on hover (desktop)
    const swapImageOnHover = (card, cache) => {

        const handle = getHandle(card);
        if (!handle) return;

        let originalSrc = null;
        let originalSrcset = null;
        let secondarySrc = null;

        // Helper to get image element
        const getImg = () => card.querySelector(SELECTORS.productImg);

        // Mouse enter → show secondary image
        card.addEventListener("mouseenter", async () => {

            if (!secondarySrc) {
                const product = await cache[handle];
                secondarySrc = pickSecondaryImage(product, getImg()?.src || "");
            }

            if (!secondarySrc) return;

            const img = getImg();
            if (!img) return;

            // Save original image
            originalSrc = img.src;
            originalSrcset = img.srcset;

            // Replace with secondary image
            img.src = secondarySrc;
            img.srcset = secondarySrc;
        });

        // Mouse leave → restore original image
        card.addEventListener("mouseleave", () => {
            if (!originalSrc) return;

            const img = getImg();
            if (!img) return;

            img.src = originalSrc;
            img.srcset = originalSrcset;
        });
    };

    // Attach hover behavior only on desktop
    const bindHover = (card, cache) => {
        if (window.innerWidth <= 768) return; // skip mobile
        if (card.getAttribute("data-hover-init")) return; // avoid duplicates

        card.setAttribute("data-hover-init", "1");
        swapImageOnHover(card, cache);
    };

    // Setup all cards (desktop)
    const setupAllCards = (container, cache) => {
        const cards = qAll(SELECTORS.productItem, container);

        prefetchCards(cards, cache);
        cards.forEach((card) => bindHover(card, cache));
    };

    // Wait until product items appear inside container
    const waitForProductItems = (container, onReady) => {

        if (q(SELECTORS.productItem, container)) {
            onReady();
            return;
        }

        const waiter = new MutationObserver((_, obs) => {
            if (q(SELECTORS.productItem, container)) {
                obs.disconnect();
                onReady();
            }
        });

        waiter.observe(container, { childList: true, subtree: true });
    };

    // Initialize desktop behavior
    const initCollection = () => {
        const container = q(SELECTORS.collection);
        if (!container) return;

        const cache = getCache();

        waitForProductItems(container, () =>
            setupAllCards(container, cache)
        );

        observeCollection(cache, setupAllCards);
    };

    // Load Swiper library if not already loaded
    const loadSwiperAssets = () => {

        if (window.Swiper) return Promise.resolve();

        if (!document.getElementById("swiper-js")) {
            document.head.insertAdjacentHTML(
                "beforeend",
                `<link id="swiper-css" rel="stylesheet"
                 href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css">`
            );

            return new Promise((resolve) => {
                const js = document.createElement("script");
                js.id = "swiper-js";
                js.src =
                    "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js";
                js.onload = resolve;
                document.head.appendChild(js);
            });
        }

        return Promise.resolve();
    };

    // Build HTML slides for Swiper
    const buildSwiperSlides = (images) =>
        images
            .map(
                (src, i) =>
                    `<div class="swiper-slide">
                        <img src="${src}" loading="eager"
                             decoding="async"
                             class="lazyloaded"
                             data-swiper-img="${i}" alt="">
                     </div>`
            )
            .join("");

    // Create Swiper container element
    const createSwiperContainer = (images) => {
        const el = document.createElement("div");

        el.className = `swiper ${ID}-swiper`;

        el.innerHTML = `
            <div class="swiper-wrapper">
                ${buildSwiperSlides(images)}
            </div>
            <div class="swiper-pagination"></div>
        `;

        el.style.cssText =
            "position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;transition:opacity .2s;pointer-events:none;";

        return el;
    };

    // Show Swiper after images load
    const revealSwiperOnLoad = (swiperEl, existingImg) => {

        const imgs = Array.from(qAll("img", swiperEl));

        Promise.all(
            imgs.map((img) =>
                img.complete
                    ? Promise.resolve()
                    : img.decode().catch(() => {})
            )
        ).then(() => {

            swiperEl.style.pointerEvents = "auto";
            swiperEl.style.opacity = "1";

            if (existingImg) existingImg.style.visibility = "hidden";
        });
    };

    // Build Swiper slider inside a product card
    const buildSwiper = (card, images) => {

        const imageWrapper =
            card.querySelector(".product-item__image");

        if (!imageWrapper) return;
        if (imageWrapper.querySelector(`.${ID}-swiper`)) return;

        // Make wrapper square
        const w =
            imageWrapper.offsetWidth ||
            card.offsetWidth ||
            Math.round(
                (q(SELECTORS.collection)?.offsetWidth || 400) / 2
            );

        imageWrapper.style.cssText =
            `height:${w}px;padding-bottom:0;overflow:hidden;position:relative;`;

        const existingImg =
            imageWrapper.querySelector(SELECTORS.productImg);

        const swiperEl = createSwiperContainer(images);

        imageWrapper.appendChild(swiperEl);

        // Initialize Swiper after DOM update
        requestAnimationFrame(() => {

            new Swiper(swiperEl, {
                loop: false,
                pagination: {
                    el: swiperEl.querySelector(".swiper-pagination"),
                    clickable: true
                },
            });

            revealSwiperOnLoad(swiperEl, existingImg);
        });
    };

    // Lazy-build Swiper when card enters viewport
    const observeCardIntersection = (cards, cache) => {

        const io = new IntersectionObserver(
            async (entries) => {

                for (const entry of entries) {

                    if (!entry.isIntersecting) continue;

                    io.unobserve(entry.target);

                    const card = entry.target;

                    if (card.querySelector(`.${ID}-swiper`)) continue;

                    const handle = getHandle(card);
                    if (!handle) continue;

                    const product = await fetchProduct(handle, cache);
                    if (!product?.images?.length) continue;

                    buildSwiper(card, product.images);
                }
            },
            { rootMargin: "200px 0px" }
        );

        cards.forEach((card) => io.observe(card));
    };

    // Setup mobile cards
    const setupMobileCards = (container, cache) => {
        const cards = qAll(SELECTORS.productItem, container);

        prefetchCards(cards, cache);
        observeCardIntersection(cards, cache);
    };

    // Initialize mobile behavior
    const initForMobile = () => {

        const container = q(SELECTORS.collection);
        if (!container) return;

        const cache = getCache();

        loadSwiperAssets().then(() => {

            waitForProductItems(container, () =>
                setupMobileCards(container, cache)
            );

            observeCollection(cache, setupMobileCards);
        });
    };

    // START: wait for collection grid to exist
    waitForElem(SELECTORS.collection, () => {

        if (!q(SELECTORS.loading)) return;

        document.body.classList.add(`${ID}_${VAR}`);

        expLog("RUNNING EXPERIMENT:", ID, "::", VAR);

        if (window.innerWidth > 768) {
            initCollection(); // desktop
        } else {
            initForMobile(); // mobile
        }
    });

})(); // end IIFE