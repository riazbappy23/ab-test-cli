(() => {
  // utils/common.js
  function poll(t, i, o = false, e = 1e4, a = 25) {
    e < 0 || (t() ? i() : setTimeout(() => {
      poll(t, i, o, o ? e : e - a, a);
    }, a));
  }
  function q(s, o) {
    return o ? s.querySelector(o) : document.querySelector(s);
  }

  // src/BRECKS/PLP-Display_Secondary_Image/1/info.js
  var ID = "PLP-Display_Secondary_Image";
  var VAR = "1";
  function expLog() {
    window.runningExperiments[ID].logs.push([...arguments]);
    console.debug(...arguments);
  }

  // src/BRECKS/PLP-Display_Secondary_Image/1/index.js
  window.runningExperiments = window.runningExperiments || {};
  window.runningExperiments[ID] = { name: "", variation: `${VAR}`, logs: [] };
  var SELECTORS = {
    collection: ".collection__products, .collection__infinite-container",
    productItem: ".product-item",
    productImg: "img.image__img",
    loading: ".collection__loading",
    quickViewIcon: ".product-item__floating-action-buttons"
  };
  var initCollection = () => {
    const container = q(SELECTORS.collection);
    if (!container)
      return;
    const cache = window._plpSecondaryImageCache = window._plpSecondaryImageCache || {};
    if (container.querySelector(SELECTORS.productItem)) {
      setupAllCards(container, cache);
    } else {
      const waiter = new MutationObserver((_, obs) => {
        if (container.querySelector(SELECTORS.productItem)) {
          obs.disconnect();
          setupAllCards(container, cache);
        }
      });
      waiter.observe(container, { childList: true, subtree: true });
    }
    observeCollection(cache, setupAllCards);
  };
  var getHandle = (card) => {
    const dataUrl = card.getAttribute("data-url") || "";
    const part = (dataUrl.split("/products/")[1] || "").split(/[/?#]/)[0];
    return part ? decodeURIComponent(part) : null;
  };
  var pickSecondaryImage = (product, currentSrc) => {
    const images = product?.images;
    if (!images || images.length < 2)
      return null;
    const currentBase = currentSrc.split("?")[0];
    const candidate = images[1];
    if (candidate.split("?")[0] === currentBase) {
      return images.length > 2 ? images[2] : null;
    }
    return candidate;
  };
  var prefetchCards = (cards, cache) => {
    cards.forEach((card) => {
      const handle = getHandle(card);
      if (!handle || cache[handle])
        return;
      const cleanHandle = handle.split("?")[0];
      cache[cleanHandle] = fetch(`/products/${cleanHandle}.js`).then((res) => res.ok ? res.json() : null).catch(() => null);
    });
  };
  var bindHover = (card, cache) => {
    if (window.innerWidth <= 768)
      return;
    if (card.getAttribute("data-hover-init"))
      return;
    card.setAttribute("data-hover-init", "1");
    const handle = getHandle(card);
    if (!handle)
      return;
    let originalSrc = null;
    let originalSrcset = null;
    let secondarySrc = null;
    card.addEventListener("mouseenter", async () => {
      if (!secondarySrc) {
        const product = await cache[handle];
        const img = card.querySelector(SELECTORS.productImg);
        secondarySrc = pickSecondaryImage(product, img?.src || "");
      }
      if (secondarySrc) {
        const img = card.querySelector(SELECTORS.productImg);
        if (!img)
          return;
        originalSrc = img.src;
        originalSrcset = img.srcset;
        img.src = secondarySrc;
        img.srcset = secondarySrc;
      }
    });
    card.addEventListener("mouseleave", () => {
      if (!originalSrc)
        return;
      const img = card.querySelector(SELECTORS.productImg);
      if (!img)
        return;
      img.src = originalSrc;
      img.srcset = originalSrcset;
    });
  };
  var setupAllCards = (container, cache) => {
    const cards = [...container.querySelectorAll(SELECTORS.productItem)];
    prefetchCards(cards, cache);
    cards.forEach((card) => bindHover(card, cache));
  };
  var loadSwiperAssets = () => {
    if (window.Swiper) {
      expLog("Swiper already on page (theme) — skipping CDN inject");
      return Promise.resolve();
    }
    if (document.getElementById("swiper-js"))
      return Promise.resolve();
    expLog("Swiper not found — injecting from CDN");
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
  var buildSwiper = (card, images) => {
    const imageWrapper = card.querySelector(".product-item__image");
    if (!imageWrapper)
      return;
    if (imageWrapper.querySelector(`.${ID}-swiper`))
      return;
    const w = imageWrapper.offsetWidth || card.offsetWidth || Math.round((q(SELECTORS.collection)?.offsetWidth || 400) / 2);
    imageWrapper.style.cssText = `height:${w}px;padding-bottom:0;overflow:hidden;position:relative;`;
    const existingImg = imageWrapper.querySelector(SELECTORS.productImg);
    const slides = images.map((src, i) => `<div class="swiper-slide"><img src="${src}" loading="eager" decoding="async" class="lazyloaded" data-swiper-img="${i}" alt=""></div>`).join("");
    const swiperContainer = document.createElement("div");
    swiperContainer.className = `swiper ${ID}-swiper`;
    swiperContainer.innerHTML = `
    <div class="swiper-wrapper">${slides}</div>
    <div class="swiper-pagination"></div>
  `;
    swiperContainer.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;transition:opacity .2s;pointer-events:none;";
    imageWrapper.appendChild(swiperContainer);
    const swiperEl = swiperContainer;
    requestAnimationFrame(() => {
      new Swiper(swiperEl, {
        loop: false,
        pagination: { el: swiperEl.querySelector(".swiper-pagination"), clickable: true }
      });
      const imgs = Array.from(swiperEl.querySelectorAll("img"));
      Promise.all(
        imgs.map((img) => {
          return img.complete ? Promise.resolve() : img.decode().catch(() => {
          });
        })
      ).then(() => {
        swiperEl.style.pointerEvents = "auto";
        swiperEl.style.opacity = "1";
        if (existingImg)
          existingImg.style.visibility = "hidden";
      }).catch(() => {
        swiperEl.style.opacity = "1";
        if (existingImg)
          existingImg.style.visibility = "hidden";
      });
    });
  };
  var setupMobileCards = (container, cache) => {
    const cards = [...container.querySelectorAll(SELECTORS.productItem)];
    expLog("setupMobileCards — found", cards.length, "cards");
    prefetchCards(cards, cache);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (!entry.isIntersecting)
            return;
          io.unobserve(entry.target);
          const card = entry.target;
          if (card.querySelector(`.${ID}-swiper`))
            return;
          const handle = getHandle(card);
          if (!handle)
            return;
          if (!cache[handle]) {
            cache[handle] = fetch(`/products/${handle}.js`).then((r) => r.ok ? r.json() : null).catch(() => null);
          }
          const product = await cache[handle];
          if (!product?.images?.length)
            return;
          if (card.querySelector(`.${ID}-swiper`))
            return;
          buildSwiper(card, product.images);
        });
      },
      { rootMargin: "200px 0px" }
    );
    cards.forEach((card) => {
      if (!card.querySelector(`.${ID}-swiper`))
        io.observe(card);
    });
  };
  var _collectionBodyObserver = null;
  var observeCollection = (cache, setupFn) => {
    if (_collectionBodyObserver) {
      try {
        _collectionBodyObserver.disconnect();
      } catch (e) {
      }
    }
    const callback = (mutations) => {
      const relevant = mutations.some((m) => {
        const nodes = [...m.addedNodes, ...m.removedNodes];
        return nodes.some((n) => {
          if (n.nodeType !== 1)
            return false;
          if (n.matches?.(SELECTORS.collection))
            return true;
          if (n.querySelector?.(SELECTORS.productItem))
            return true;
          return false;
        });
      });
      if (!relevant)
        return;
      const current = q(SELECTORS.collection);
      if (!current)
        return;
      expLog("collectionSection: change detected — re-running setup");
      setupFn(current, cache);
    };
    const obs = new MutationObserver(callback);
    obs.observe(document.body, { childList: true, subtree: true });
    _collectionBodyObserver = obs;
  };
  var initForMobile = () => {
    const container = q(SELECTORS.collection);
    if (!container)
      return;
    const cache = window._plpSecondaryImageCache = window._plpSecondaryImageCache || {};
    loadSwiperAssets().then(() => {
      if (container.querySelector(SELECTORS.productItem)) {
        setupMobileCards(container, cache);
      } else {
        const waiter = new MutationObserver((_, obs) => {
          if (container.querySelector(SELECTORS.productItem)) {
            obs.disconnect();
            setupMobileCards(container, cache);
          }
        });
        waiter.observe(container, { childList: true, subtree: true });
      }
      observeCollection(cache, setupMobileCards);
    });
  };
  poll(
    () => q("body") && q(SELECTORS.collection) && q(SELECTORS.loading),
    () => {
      q("body").classList.add(`${ID}_${VAR}`);
      expLog("RUNNING EXPERIMENT:", ID, "::", VAR);
      const isDesktop = window.innerWidth > 768;
      if (isDesktop) {
        initCollection();
        return;
      }
      ;
      if (!isDesktop) {
        initForMobile();
        const icon = q(SELECTORS.quickViewIcon);
        console.log("quick view icon", icon);
      }
    }
  );
})();

//last updated on: 8:55:38 PM
//# sourceURL=ABtest/PLP-Display_Secondary_Image_1.js