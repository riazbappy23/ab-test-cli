(function () {
    var interval = setInterval(function () {
        if (document.head) {
            // Check if <head> exists
            clearInterval(interval); // Stop checking once found
            var style = document.createElement("style");
            style.innerHTML = `
      .PLP-Display_Secondary_Image-swiper {
   height: 100%;
   width: 100%;
   z-index:0;
 }

.PLP-Display_Secondary_Image-swiper .swiper-slide {
display:flex;
}

.PLP-Display_Secondary_Image-swiper .swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
}

.PLP-Display_Secondary_Image-swiper .swiper-pagination {
  bottom: 0px;
}

.PLP-Display_Secondary_Image-swiper .swiper-pagination-bullet {
  background: #8a8a8a;
  opacity: 0.7;
}

@supports (-webkit-touch-callout: none) {
  .PLP-Display_Secondary_Image-swiper .swiper-pagination {
    gap: 4px;
  }
}

.PLP-Display_Secondary_Image-swiper .swiper-pagination-bullet-active {
  background: black;
  padding: 0 10px;
  border-radius: 4px;
  opacity: 1;
}

@media only screen and (max-width: 1024px) {
:where(wishlist-button-collection) .wk-button {
  display: none !important;
}
}
`;
            document.head.appendChild(style);
            setTimeout(() => {
                clearInterval(interval); // Clear the interval after 5 seconds
            }, 5000);
        }
    }, 100); // Check every 100ms for <head>
})();
(() => {
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
    window.runningExperiments[ID] = {name: "", variation: VAR, logs: []};

    const log = (...a) => console.debug(...a);

    const SELECTORS = {
        collection: ".collection__products, .collection__infinite-container",
        productItem: ".product-item",
        productImg: "img.image__img",
    };

    const getCache = () => (window._plpImgCache = window._plpImgCache || {});

    const getHandle = (card) => {
        const url = card.getAttribute("data-url") || "";
        const part = (url.split("/products/")[1] || "").split(/[/?#]/)[0];
        return part ? decodeURIComponent(part) : null;
    };

    const fetchImages = (handle, cache) => {
        if (cache[handle]) return cache[handle];

        cache[handle] = fetch(`/products/${handle}.js`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data?.images || [])
            .catch(() => null);

        return cache[handle];
    };

    const preloadImages = (images, count = 2) => {
        images.slice(0, count).forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    };

    const setLoading = (card, on) => {
        card.style.opacity = on ? "0.6" : "";
    };

    const pickSecondary = (images, currentSrc) => {
        if (!images || images.length < 2) return null;

        const base = currentSrc.split("?")[0];

        if (images[1].split("?")[0] === base) return images[2] || null;

        return images[1];
    };

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

    const buildSwiperSlides = (images) =>
        images
            .map(
                (src, i) => `
            <div class="swiper-slide">
                <img
                    src="${src}"
                    loading="${i < 2 ? "eager" : "lazy"}"
                    decoding="async"
                    alt="">
            </div>
        `
            )
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
        swiperEl.style.opacity = "1";
        swiperEl.style.pointerEvents = "auto";

        const firstImg = swiperEl.querySelector("img");

        if (firstImg) {
            if (firstImg.complete) {
                existingImg && (existingImg.style.visibility = "hidden");
            } else {
                firstImg.onload = () => {
                    existingImg && (existingImg.style.visibility = "hidden");
                };
            }
        }
    };

    const buildSwiper = (card, images) => {
        const imageWrapper = card.querySelector(".product-item__image");
        if (!imageWrapper) return;
        if (imageWrapper.querySelector(`.${ID}-swiper`)) return;

        const existingImg = imageWrapper.querySelector(SELECTORS.productImg);

        imageWrapper.style.position = "relative";
        imageWrapper.style.overflow = "hidden";

        const swiperEl = createSwiperContainer(images);
        imageWrapper.insertAdjacentElement("afterend", swiperEl);

        requestAnimationFrame(() => {
            new window.Swiper(swiperEl, {
                loop: false,
                pagination: {
                    el: swiperEl.querySelector(".swiper-pagination"),
                    clickable: true,
                },
            });

            revealSwiperOnLoad(swiperEl, existingImg);
        });
    };

    const processCard = async (card, cache, isDesktop) => {
        if (card.classList.contains("AB-PLP-added")) return;
        card.classList.add("AB-PLP-added");
        const handle = getHandle(card);
        if (!handle) return;

        setLoading(card, true);

        const images = await fetchImages(handle, cache);
        setLoading(card, false);

        if (!images?.length) return;

        if (isDesktop) {
            bindHover(card, images);
        } else {
            preloadImages(images);
            buildSwiper(card, images);
        }
    };

    const createObserver = (container, cache, isDesktop) => {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    io.unobserve(entry.target);
                    processCard(entry.target, cache, isDesktop);
                });
            },
            {rootMargin: "200px"}
        );

        const observeNewCards = () => {
            qAll(SELECTORS.productItem, container).forEach((card) => {
                if (!card.classList.contains("AB-PLP-added")) io.observe(card);
            });
        };

        observeNewCards();

        new MutationObserver(observeNewCards).observe(container, {
            childList: true,
            subtree: true,
        });
    };

    const init = (isDesktop) => {
        const container = q(SELECTORS.collection);
        if (!container) return;

        const cache = getCache();

        createObserver(container, cache, isDesktop);
    };

    waitForElem(SELECTORS.collection, async () => {
        document.body.classList.add(`${ID}_${VAR}`);
        log("RUNNING EXPERIMENT:", ID, VAR);

        const isDesktop = window.innerWidth > 1024;

        if (!isDesktop) await loadSwiper();

        init(isDesktop);
    });
})();
