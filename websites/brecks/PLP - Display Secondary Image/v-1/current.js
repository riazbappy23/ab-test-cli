(() => {

    /* ---------- WAIT FOR ELEMENT ---------- */

    const waitForElem = (selector, callback, timer = 30000, frequency = 100) => {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        if (timer <= 0) return;
        setTimeout(() => waitForElem(selector, callback, timer - frequency, frequency), frequency);
    };

    const q = (s, r = document) => r.querySelector(s);
    const qAll = (s, r = document) => [...r.querySelectorAll(s)];

    const ID = "PLP-Display_Secondary_Image";
    const VAR = "1";

    window.runningExperiments = window.runningExperiments || {};
    window.runningExperiments[ID] = { name: "", variation: VAR, logs: [] };

    const log = (...a) => console.debug(...a);

    const SELECTORS = {
        collection: ".collection__products, .collection__infinite-container",
        productItem: ".product-item",
        productImg: "img.image__img",
    };

    /* ---------- LIGHTWEIGHT IMAGE CACHE (PROMISE BASED) ---------- */

    const getCache = () =>
        (window._plpImgCache = window._plpImgCache || {});

    /* ---------- HANDLE FROM CARD ---------- */

    const getHandle = (card) => {
        const url = card.getAttribute("data-url") || "";
        const part = (url.split("/products/")[1] || "").split(/[/?#]/)[0];
        return part ? decodeURIComponent(part) : null;
    };

    /* ---------- FETCH ONLY IMAGES ---------- */

    const fetchImages = (handle, cache) => {

        if (cache[handle]) return cache[handle]; // return existing Promise

        cache[handle] = fetch(`/products/${handle}.js`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data?.images || [])
            .catch(() => null);

        return cache[handle];
    };

    /* ---------- LOADING STATE ---------- */

    const setLoading = (card, on) => {
        card.style.opacity = on ? "0.6" : "";
    };

    /* ---------- SECONDARY IMAGE PICK ---------- */

    const pickSecondary = (images, currentSrc) => {
        if (!images || images.length < 2) return null;

        const base = currentSrc.split("?")[0];

        if (images[1].split("?")[0] === base)
            return images[2] || null;

        return images[1];
    };

    /* ---------- DESKTOP HOVER ---------- */

    const bindHover = (card, images) => {

        if (card.dataset.hoverInit) return;
        card.dataset.hoverInit = "1";

        const img = q(SELECTORS.productImg, card);
        if (!img) return;

        const secondary = pickSecondary(images, img.src);
        if (!secondary) return;

        let originalSrc;
        let originalSet;

        card.addEventListener("mouseenter", () => {
            originalSrc = img.src;
            originalSet = img.srcset;
            img.src = secondary;
            img.srcset = secondary;
        });

        card.addEventListener("mouseleave", () => {
            if (originalSrc) {
                img.src = originalSrc;
                img.srcset = originalSet;
            }
        });
    };

    /* ---------- SWIPER LOADER ---------- */

    const loadSwiper = () => {
        if (window.Swiper) return Promise.resolve();

        if (!document.getElementById("swiper-css")) {
            document.head.insertAdjacentHTML(
                "beforeend",
                `<link id="swiper-css" rel="stylesheet"
                 href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css">`
            );
        }

        return new Promise((resolve) => {
            const js = document.createElement("script");
            js.src = "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js";
            js.onload = resolve;
            document.head.appendChild(js);
        });
    };

    /* ---------- BUILD SWIPER ---------- */

    const buildSwiperSlides = (images) =>
        images
            .map(
                (src, i) =>
                    `<div class="swiper-slide">
                        <img src="${src}" loading="eager" decoding="async" data-swiper-img="${i}" alt="">
                    </div>`
            )
            .join("");

    const createSwiperContainer = (images) => {

        const el = document.createElement("div");
        el.className = `swiper ${ID}-swiper`;

        el.innerHTML = `
            <div class="swiper-wrapper">${buildSwiperSlides(images)}</div>
            <div class="swiper-pagination"></div>
        `;

        // keep only required styles
        el.style.position = "absolute";
        el.style.inset = "0";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.style.transition = "opacity .2s";

        return el;
    };

    const revealSwiperOnLoad = (swiperEl, existingImg) => {

        const imgs = qAll("img", swiperEl);

        Promise.all(
            imgs.map((img) =>
                img.complete ? Promise.resolve() : img.decode().catch(() => {})
            )
        ).finally(() => {
            swiperEl.style.opacity = "1";
            swiperEl.style.pointerEvents = "auto";
            if (existingImg) existingImg.style.visibility = "hidden";
        });
    };

    const buildSwiper = (card, images) => {

        const imageWrapper = card.querySelector(".product-item__image");
        if (!imageWrapper) return;
        if (imageWrapper.querySelector(`.${ID}-swiper`)) return;

        const existingImg = imageWrapper.querySelector(SELECTORS.productImg);

        imageWrapper.style.position = "relative";
        imageWrapper.style.overflow = "hidden";

        const swiperEl = createSwiperContainer(images);
        imageWrapper.appendChild(swiperEl);

        requestAnimationFrame(() => {

            new Swiper(swiperEl, {
                loop: false,
                pagination: {
                    el: swiperEl.querySelector(".swiper-pagination"),
                    clickable: true,
                },
            });

            revealSwiperOnLoad(swiperEl, existingImg);
        });
    };

    /* ---------- PROCESS SINGLE CARD ---------- */

    const processCard = async (card, cache, isDesktop) => {

        if (card.classList.contains("AB-PLP-added")) return;
        card.classList.add("AB-PLP-added");

        const handle = getHandle(card);
        if (!handle) return;

        setLoading(card, true);

        const images = await fetchImages(handle, cache);

        setLoading(card, false);

        if (!images?.length) return;

        if (isDesktop) bindHover(card, images);
        else buildSwiper(card, images);
    };

    /* ---------- OBSERVE CARDS ---------- */

    const createObserver = (container, cache, isDesktop) => {

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    io.unobserve(entry.target);
                    processCard(entry.target, cache, isDesktop);
                });
            },
            { rootMargin: "200px" }
        );

        const observeNewCards = () => {
            qAll(SELECTORS.productItem, container).forEach((card) => {
                if (!card.classList.contains("AB-PLP-added"))
                    io.observe(card);
            });
        };

        observeNewCards();

        new MutationObserver(observeNewCards).observe(container, {
            childList: true,
            subtree: true,
        });
    };

    /* ---------- INIT ---------- */

    const init = (isDesktop) => {

        const container = q(SELECTORS.collection);
        if (!container) return;

        const cache = getCache();

        createObserver(container, cache, isDesktop);
    };

    /* ---------- START ---------- */

    waitForElem(SELECTORS.collection, async () => {

        document.body.classList.add(`${ID}_${VAR}`);
        log("RUNNING EXPERIMENT:", ID, VAR);

        const isDesktop = window.innerWidth > 1025;

        if (!isDesktop) await loadSwiper();

        init(isDesktop);
    });

})();