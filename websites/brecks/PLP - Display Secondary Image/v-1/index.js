(function () {
    var interval = setInterval(function () {
        if (document.head) {
            clearInterval(interval);
            var style = document.createElement("style");
            style.innerHTML = `
.AB-PLP-added .product-item__inner .badger,
.AB-PLP-added .product-item__inner .soldoutstrip {
    z-index: 2;
}
.AB-PLP-added .product-item__inner .badger {
    pointer-events: none;
}
.AB-PLP-added .product-item__inner .badger img {
    pointer-events: none;
}
.PLP-Display_Secondary_Image-swiper {
  height:100%;
  width:100%;
}
.PLP-Display_Secondary_Image-swiper .swiper-slide {
  display:flex;
}
.PLP-Display_Secondary_Image-swiper .swiper-pagination {
  position:absolute !important;
  bottom:8px !important;
  top:auto !important;
  left:0;
  right:0;
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:5;
  pointer-events:none;
}
.PLP-Display_Secondary_Image-swiper .swiper-pagination-bullet {
  width:6px;
  height:6px;
  background:rgba(225, 225, 225, 0.65);
  opacity:1;
  margin:0 3px !important;
  transition:all .25s ease;
  pointer-events:auto;
}
.PLP-Display_Secondary_Image-swiper .swiper-pagination-bullet-active {
  width:18px;
  height:6px;
  border-radius:6px;
  background:rgba(255,255,255,0.65);
  opacity:1;
}
.product-item__image img {
  transition: opacity 0.4s ease;
  display: block;
  width: 100%;
  height: 100%;
}
.product-item__image:hover img {
  transform: scale(1.02);
  transition: opacity 0.4s ease, transform 0.4s ease;
}


@media only screen and (max-width: 1180px) {
  .product-item__floating-action-buttons {
    top:unset;
    bottom:20px;
  }
  :where(wishlist-button-collection) .wk-button {
    display:none !important;
  }
}
`;
            document.head.appendChild(style);
            setTimeout(() => clearInterval(interval), 5000);
        }
    }, 100);
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

    const shouldUseSwiper = window.matchMedia("(max-width: 1180px)").matches;

    const getCache = () => (window._plpImgCache = window._plpImgCache || {});

    const getHandle = (card) => {
        const url = card.getAttribute("data-url") || "";
        const part = (url.split("/products/")[1] || "").split(/[/?#]/)[0];
        return part ? decodeURIComponent(part) : null;
    };

    const fetchImages = (handle, cache) => {
        if (cache[handle]) return cache[handle];
        cache[handle] = fetch(`/products/${handle}.json`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data?.product?.images?.map((img) => img.src) || [])
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
        if (images[1] && images[1].split("?")[0] === base) return images[2] || null;
        return images[1] || null;
    };

    const bindHover = (card, images) => {
        if (card.dataset.hoverInit) return;
        card.dataset.hoverInit = "1";

        const img = q(SELECTORS.productImg, card);
        if (!img) return;

        const secondary = pickSecondary(images, img.src);
        if (!secondary) return;

        const preload = new Image();
        preload.src = secondary;

        let originalSrc, originalSet;

        card.addEventListener("mouseenter", () => {
            originalSrc = img.src;
            originalSet = img.srcset;
            img.style.opacity = "0";
            img.style.transform = "scale(1.04)";
            setTimeout(() => {
                img.src = secondary;
                img.srcset = secondary;
                img.style.opacity = "1";
                img.style.transform = "scale(1)";
            }, 120);
        });

        card.addEventListener("mouseleave", () => {
            if (originalSrc) {
                img.style.opacity = "0";
                img.style.transform = "scale(1.04)";
                setTimeout(() => {
                    img.src = originalSrc;
                    img.srcset = originalSet;
                    img.style.opacity = "1";
                    img.style.transform = "scale(1)";
                }, 120);
            }
        });
    };

    let swiperReady = null;

    const loadSwiper = () => {
        if (swiperReady) return swiperReady;
        if (window.Swiper) return (swiperReady = Promise.resolve());

        if (!document.getElementById("swiper-css")) {
            document.head.insertAdjacentHTML("beforeend", `<link id="swiper-css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css">`);
        }

        swiperReady = new Promise((resolve) => {
            const js = document.createElement("script");
            js.src = "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js";
            js.onload = resolve;
            document.head.appendChild(js);
        });

        return swiperReady;
    };

    const buildSwiperSlides = (images) =>
        images
            .map(
                (src, i) => `
            <div class="swiper-slide">
                <img src="${src}" loading="${i < 2 ? "eager" : "lazy"}" decoding="async" alt="">
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
        el.style.cssText = "position:absolute;top:0;left:0;width:100.2%;height:100%;opacity:0;transition:opacity .25s;pointer-events:none;";
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
            if (!window.Swiper) {
                console.warn("Swiper library not loaded");
                return;
            }
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

    const processCard = async (card, cache) => {
        if (!card.classList.contains("AB-PLP-added")) {
            card.classList.add("AB-PLP-added");

            const handle = getHandle(card);
            if (handle) {
                setLoading(card, true);
                const images = await fetchImages(handle, cache);
                console.log("images: ", images);
                setLoading(card, false);

                if (images?.length) {
                    if (shouldUseSwiper) {
                        preloadImages(images);
                        await loadSwiper();
                        buildSwiper(card, images);
                    } else {
                        bindHover(card, images);
                    }
                }
            }
        }
    };

    const createObserver = (container, cache) => {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    io.unobserve(entry.target);
                    processCard(entry.target, cache);
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
        new MutationObserver(observeNewCards).observe(container, {childList: true, subtree: true});
    };

    const init = () => {
        const container = q(SELECTORS.collection);
        if (container) createObserver(container, getCache());
    };

    const watchFilters = () => {
        let debounceTimer;

        const onFilterChange = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                qAll(SELECTORS.productItem).forEach((card) => {
                    card.classList.remove("AB-PLP-added");
                    card.dataset.hoverInit = "";
                });
                window._plpImgCache = {};
                init();
            }, 300);
        };

        [".filter-topbar-wrap", ".filter-drawer"].forEach((sel) => {
            const el = q(sel);
            if (el) new MutationObserver(onFilterChange).observe(el, {childList: true, subtree: true, attributes: true});
        });
    };

    loadSwiper();

    waitForElem(SELECTORS.collection, () => {
        document.body.classList.add(`${ID}_${VAR}`);
        log("RUNNING EXPERIMENT:", ID, VAR);
        init();
        watchFilters();
    });
})();
