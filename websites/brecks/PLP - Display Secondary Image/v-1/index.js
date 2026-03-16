(() => {
    const waitForElem = (selector, callback, timer = 30000, frequency = 100) => {
        const el = document.querySelector(selector);
        if (!el) {
            if (timer <= 0) return;
            setTimeout(() => waitForElem(selector, callback, timer - frequency, frequency), frequency);
        } else {
            callback(el);
        }
    };

    function q(sel, root = document) {
        return root.querySelector(sel);
    }
    function qAll(sel, root = document) {
        return [...root.querySelectorAll(sel)];
    }

    const ID = "PLP-Display_Secondary_Image";
    const VAR = "1";

    function expLog() {
        window.runningExperiments[ID].logs.push([...arguments]);
        console.debug(...arguments);
    }

    window.runningExperiments = window.runningExperiments || {};
    window.runningExperiments[ID] = { name: "", variation: `${VAR}`, logs: [] };

    const SELECTORS = {
        collection: ".collection__products, .collection__infinite-container",
        productItem: ".product-item",
        productImg: "img.image__img",
        loading: ".collection__loading",
        quickViewIcon: ".product-item__floating-action-buttons",
    };

    const getCache = () => (window._plpSecondaryImageCache = window._plpSecondaryImageCache || {});

    const getHandle = (card) => {
        const dataUrl = card.getAttribute("data-url") || "";
        const part = (dataUrl.split("/products/")[1] || "").split(/[/?#]/)[0];
        return part ? decodeURIComponent(part) : null;
    };

    const fetchProduct = (handle, cache) => {
        const cleanHandle = handle.split("?")[0];
        if (!cache[cleanHandle]) {
            cache[cleanHandle] = fetch(`/products/${cleanHandle}.js`)
                .then((res) => (res.ok ? res.json() : null))
                .catch(() => null);
        }
        return cache[cleanHandle];
    };

    const prefetchCards = (cards, cache) => {
        cards.forEach((card) => {
            const handle = getHandle(card);
            if (!handle || cache[handle]) return;
            fetchProduct(handle, cache);
        });
    };

    let _collectionBodyObserver = null;

    const observeCollection = (cache, setupFn) => {
        if (_collectionBodyObserver) {
            try { _collectionBodyObserver.disconnect(); } catch (e) {}
        }

        const isRelevantMutation = (mutations) =>
            mutations.some((m) =>
                [...m.addedNodes, ...m.removedNodes].some((n) => {
                    if (n.nodeType !== 1) return false;
                    if (n.matches?.(SELECTORS.collection)) return true;
                    if (n.querySelector?.(SELECTORS.productItem)) return true;
                    return false;
                })
            );

        const callback = (mutations) => {
            if (!isRelevantMutation(mutations)) return;
            const current = q(SELECTORS.collection);
            if (!current) return;
            setupFn(current, cache);
        };

        _collectionBodyObserver = new MutationObserver(callback);
        _collectionBodyObserver.observe(document.body, { childList: true, subtree: true });
    };

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

    const swapImageOnHover = (card, cache) => {
        const handle = getHandle(card);
        if (!handle) return;

        let originalSrc = null;
        let originalSrcset = null;
        let secondarySrc = null;

        const getImg = () => card.querySelector(SELECTORS.productImg);

        card.addEventListener("mouseenter", async () => {
            if (!secondarySrc) {
                const product = await cache[handle];
                secondarySrc = pickSecondaryImage(product, getImg()?.src || "");
            }
            if (!secondarySrc) return;
            const img = getImg();
            if (!img) return;
            originalSrc = img.src;
            originalSrcset = img.srcset;
            img.src = secondarySrc;
            img.srcset = secondarySrc;
        });

        card.addEventListener("mouseleave", () => {
            if (!originalSrc) return;
            const img = getImg();
            if (!img) return;
            img.src = originalSrc;
            img.srcset = originalSrcset;
        });
    };

    const bindHover = (card, cache) => {
        if (window.innerWidth <= 768) return;
        if (card.getAttribute("data-hover-init")) return;
        card.setAttribute("data-hover-init", "1");
        swapImageOnHover(card, cache);
    };

    const setupAllCards = (container, cache) => {
        const cards = qAll(SELECTORS.productItem, container);
        prefetchCards(cards, cache);
        cards.forEach((card) => bindHover(card, cache));
    };

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

    const initForDesktop = () => {
        const container = q(SELECTORS.collection);
        if (!container) return;
        const cache = getCache();
        waitForProductItems(container, () => setupAllCards(container, cache));
        observeCollection(cache, setupAllCards);
    };

    const loadSwiperAssets = () => {
        if (window.Swiper) {
            return Promise.resolve();
        }
        if (document.getElementById("swiper-js")) return Promise.resolve();

        if (!document.getElementById("swiper-css")) {
            const css = `<link id="swiper-css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css">`;
            document.head.insertAdjacentHTML("beforeend", css);
        }

        return new Promise((resolve) => {
            const js = document.createElement("script");
            js.id = "swiper-js";
            js.src = "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js";
            js.onload = resolve;
            document.head.appendChild(js);
        });
    };

    const buildSwiperSlides = (images) =>
        images
            .map((src, i) => `<div class="swiper-slide"><img src="${src}" loading="eager" decoding="async" class="lazyloaded" data-swiper-img="${i}" alt=""></div>`)
            .join("");

    const createSwiperContainer = (images) => {
        const el = document.createElement("div");
        el.className = `swiper ${ID}-swiper`;
        el.innerHTML = `
            <div class="swiper-wrapper">${buildSwiperSlides(images)}</div>
            <div class="swiper-pagination"></div>
        `;
        el.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;transition:opacity .2s;pointer-events:none;";
        return el;
    };

    const revealSwiperOnLoad = (swiperEl, existingImg) => {
        const imgs = Array.from(qAll("img", swiperEl));
        Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))))
            .then(() => {
                swiperEl.style.pointerEvents = "auto";
                swiperEl.style.opacity = "1";
                if (existingImg) existingImg.style.visibility = "hidden";
            })
            .catch(() => {
                swiperEl.style.opacity = "1";
                if (existingImg) existingImg.style.visibility = "hidden";
            });
    };

    const buildSwiper = (card, images) => {
        const imageWrapper = card.querySelector(".product-item__image");
        if (!imageWrapper) return;
        if (imageWrapper.querySelector(`.${ID}-swiper`)) return;

        const w = imageWrapper.offsetWidth || card.offsetWidth || Math.round((q(SELECTORS.collection)?.offsetWidth || 400) / 2);
        imageWrapper.style.cssText = `height:${w}px;padding-bottom:0;overflow:hidden;position:relative;`;

        const existingImg = imageWrapper.querySelector(SELECTORS.productImg);
        const swiperEl = createSwiperContainer(images);
        imageWrapper.appendChild(swiperEl);

        requestAnimationFrame(() => {
            new Swiper(swiperEl, {
                loop: false,
                pagination: { el: swiperEl.querySelector(".swiper-pagination"), clickable: true },
            });
            revealSwiperOnLoad(swiperEl, existingImg);
        });
    };

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
                    if (card.querySelector(`.${ID}-swiper`)) continue;
                    buildSwiper(card, product.images);
                }
            },
            { rootMargin: "200px 0px" }
        );
        cards.forEach((card) => {
            if (!card.querySelector(`.${ID}-swiper`)) io.observe(card);
        });
    };

    const setupMobileCards = (container, cache) => {
        const cards = qAll(SELECTORS.productItem, container);
        prefetchCards(cards, cache);
        observeCardIntersection(cards, cache);
    };

    const initForMobile = () => {
        const container = q(SELECTORS.collection);
        if (!container) return;
        const cache = getCache();
        loadSwiperAssets().then(() => {
            waitForProductItems(container, () => setupMobileCards(container, cache));
            observeCollection(cache, setupMobileCards);
        });
    };

    waitForElem(SELECTORS.collection, () => {
        if (!q(SELECTORS.loading)) return;

        document.body.classList.add(`${ID}_${VAR}`);
        expLog("RUNNING EXPERIMENT:", ID, "::", VAR);

        if (window.innerWidth > 768) {
            initForDesktop();
        } else {
            initForMobile();
        }
    });
})();