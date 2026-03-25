(async () => {
    const TEST_ID = "VC125";
    const VARIANT_ID = "V2";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Acadia",
        project: "vicicollection",
        site_url: "https://www.vicicollection.com/",
        test_name: "VC125: [CART] Removed Product Save For Later Banner (2) SET UP TEST",
        page_initials: "AB-VC125",
        test_version: 0.0002,
        test_variation: 2,
    };
    const {test_variation} = TEST_CONFIG;
    const REMOVE_DELAY = test_variation === 1 ? 5000 : 10000;

    const {page_initials, test_version} = TEST_CONFIG;

    function fireGA4Event(eventName, eventLabel = "") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "GA4event",
            "ga4-event-name": "cro_event",
            "ga4-event-p1-name": "event_category",
            "ga4-event-p1-value": eventName,
            "ga4-event-p2-name": "event_label",
            "ga4-event-p2-value": eventLabel,
        });
    }

    const SELECTOR_LIST = {
        readyCheck: ".bag--mini",
        cartRoot: ".bag__items-wrapper",
        checkout: ".bag__items-wrapper button.bag__checkout",
        bagItem: ".bag-item",
        removeBtn: ".bag-item__inner-actions-wrapper .bag-item__remove",
        saveBtn: ".bag-item__inner-actions-wrapper .bag-item__save-for-later-button",
        decrementBtn: ".bag-item__qty .increment__subtr[data-action='remove']",
        itemImage: [".bag-item__photo img", "[class*='bag-item'] img"].join(", "),
        itemTitle: ".bag-item__title",
        itemVariant: ".bag-item__variant",
        qtyInput: ".bag-item__qty .increment__input",
        savedWrapper: ".saved-for-later-item__title-variants-wrapper",
        savedTitle: ".saved-for-later-item__title",
        savedVariants: ".saved-for-later-item__variants",
    };

    const css = `
        .bag__items-wrapper .bag-item {
            padding : 1.125rem 0;
        }
        #vc125-banner-zone {
            width    : 100%;
            overflow : visible;
        }
        .vc125-banner {
            margin: 18px 0;
            background   : #E8E8E8;
            box-sizing   : border-box;
            width        : 100%;
            margin-bottom: 18px;
            transform    : translateX(110%);
            opacity      : 0;
            transition   : transform 0.35s cubic-bezier(.22,.68,0,1.15),
                           opacity   0.25s ease;
        }
        .vc125-banner.vc125-banner--visible {
            transform : translateX(0);
            opacity   : 1;
        }
        .vc125-banner.vc125-banner--exit {
            transform  : translateX(-110%);
            opacity    : 0;
            transition : transform 0.3s ease-in,
                         opacity   0.25s ease;
        }
        .vc125-banner__inner{
            display      : flex;
            align-items  : center;
            justify-content: space-between;
            gap          : 12px;
            padding: 23px 20px 22px 18px;
        }
        .vc125-banner__text {
            display        : flex;
            flex-direction : column;
            gap            : 4px;
            flex           : 1;
            min-width      : 0;
        }
        .vc125-banner__title {
            font-size     : 14px;
            font-weight   : 600;
            line-height   : 14px;
            letter-spacing: 0px;
            color         : #333132;
            white-space   : nowrap;
            overflow      : hidden;
            text-overflow : ellipsis;
            margin        : 0;
            font-family   : Lato !important;
        }
        .vc125-banner__subtitle {
            font-size     : 13px;
            color         : #838383;
            line-height   : 14px;
            font-weight   : 600;
            letter-spacing: 0px;
            margin        : 0;
            font-family   : Lato !important;
        }
        .vc125-banner__save-btn {
            flex-shrink          : 0;
            background           : none;
            border               : none;
            padding              : 0;
            font-size            : 14px;
            font-weight          : 600;
            letter-spacing       : 0px;
            color                : #333132;
            cursor               : pointer;
            white-space          : nowrap;
            text-decoration      : underline !important;
            text-underline-offset: 3px;
            font-family          : Lato !important;
        }
        .vc125-banner__save-btn:hover { opacity: 0.55; }
        .vc125-remove-disabled {
            pointer-events : none !important;
            opacity        : 0.35 !important;
        }
        @media (max-width: 767px) {
            .bag__items-wrapper .bag-item {
                padding : .9rem 0;
            }
            .vc125-banner__inner { padding: 19px 25px 18px 8px; }
        }
    `;

    function q(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qAll(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function injectStyles(cssString) {
        if (document.getElementById("vc125-styles")) return;
        const style = document.createElement("style");
        style.id = "vc125-styles";
        style.textContent = cssString;
        document.head.appendChild(style);
    }

    function escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
    }

    function waitForElement(predicate, timeout = 20000, interval = 150) {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            if (predicate()) return resolve(true);
            const id = setInterval(() => {
                if (Date.now() - start >= timeout) {
                    clearInterval(id);
                    reject(new Error("waitForElement timed out"));
                    return;
                }
                if (predicate()) {
                    clearInterval(id);
                    resolve(true);
                }
            }, interval);
        });
    }

    function clean(str) {
        return (str || "").replace(/\s+/g, " ").trim().toLowerCase();
    }

    function stripLabel(str) {
        return clean(str).replace(/^[^:]+:\s*/, "");
    }

    function getCartVariantSet(bagItem) {
        return new Set(
            qAll(SELECTOR_LIST.itemVariant, bagItem)
                .map((el) => stripLabel(el.textContent))
                .filter(Boolean)
        );
    }

    function getSavedVariantSet(savedWrapper) {
        const raw = clean(q(SELECTOR_LIST.savedVariants, savedWrapper)?.textContent || "");
        return new Set(
            raw
                .split(/[/,]+/)
                .map((s) => s.trim())
                .filter(Boolean)
        );
    }

    function variantSetsMatch(cartSet, savedSet) {
        if (cartSet.size === 0) return false;
        for (const val of cartSet) {
            if (!savedSet.has(val)) return false;
        }
        return true;
    }

    function isAlreadySaved(bagItem) {
        if (!bagItem) return false;
        const cartTitle = clean(q(SELECTOR_LIST.itemTitle, bagItem)?.textContent);
        const cartVariantSet = getCartVariantSet(bagItem);
        if (!cartTitle) return false;
        return qAll(SELECTOR_LIST.savedWrapper).some((wrapper) => {
            const savedTitle = clean(q(SELECTOR_LIST.savedTitle, wrapper)?.textContent);
            const savedVariantSet = getSavedVariantSet(wrapper);
            return savedTitle === cartTitle && variantSetsMatch(cartVariantSet, savedVariantSet);
        });
    }

    const nativeClickAllowed = new Set();

    function triggerNativeRemove(removeBtn) {
        if (!removeBtn) return;
        nativeClickAllowed.add(removeBtn);
        removeBtn.click();
    }

    function getProductInfo(bagItem) {
        if (!bagItem) return {name: "", imgSrc: "", imgAlt: ""};
        const titleEl = q(SELECTOR_LIST.itemTitle, bagItem);
        return {
            name: titleEl ? titleEl.textContent.trim() : "",
        };
    }

    function getOrCreateBannerZone() {
        const existing = document.getElementById("vc125-banner-zone");
        if (existing) return existing;
        const zone = document.createElement("div");
        zone.id = "vc125-banner-zone";
        const checkout = q(SELECTOR_LIST.checkout);
        if (checkout) {
            checkout.after(zone);
        } else {
            (q(SELECTOR_LIST.cartRoot) || document.body).prepend(zone);
        }
        return zone;
    }

    function createBannerElement({name}) {
        const banner = document.createElement("div");
        banner.className = "vc125-banner";
        banner.setAttribute("role", "status");
        banner.setAttribute("aria-live", "polite");
        const safeTitle = name ? escapeHTML(name) : "This item";
        banner.innerHTML = `
            <div class="vc125-banner__inner">
                <div class="vc125-banner__text">
                    <p class="vc125-banner__title">${safeTitle}</p>
                    <p class="vc125-banner__subtitle">was removed from your cart</p>
                </div>
                <button class="vc125-banner__save-btn" type="button">Save For Later</button>
            </div>
        `;
        return banner;
    }

    function dismissBanner(bannerEl, onComplete) {
        if (!bannerEl || !bannerEl.parentNode) {
            onComplete && onComplete();
            return;
        }
        bannerEl.classList.add("vc125-banner--exit");
        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            bannerEl.remove();
            onComplete && onComplete();
        };
        bannerEl.addEventListener("transitionend", finish, {once: true});
        setTimeout(finish, 600);
    }

    function showBanner(removeBtn) {
        const bagItem = removeBtn.closest(SELECTOR_LIST.bagItem);
        const saveBtn = bagItem ? q(SELECTOR_LIST.saveBtn, bagItem) : null;
        const product = getProductInfo(bagItem);

        removeBtn.classList.add("vc125-remove-disabled");

        const zone = getOrCreateBannerZone(bagItem);
        const banner = createBannerElement(product);
        zone.appendChild(banner);

        let timerId = null;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => banner.classList.add("vc125-banner--visible"));
        });

        function onSaveClick() {
            fireGA4Event("VC125_SaveForLaterBannerClick", "Save For Later");
            logInfo("VC125_SaveForLaterBannerClick fired");
            clearTimeout(timerId);
            if (removeBtn && removeBtn.isConnected) removeBtn.classList.remove("vc125-remove-disabled");
            dismissBanner(banner, () => {
                if (saveBtn) saveBtn.click();
            });
        }

        function onTimerExpired() {
            dismissBanner(banner, () => {
                if (removeBtn && removeBtn.isConnected) removeBtn.classList.remove("vc125-remove-disabled");
                triggerNativeRemove(removeBtn);
            });
        }

        q(".vc125-banner__save-btn", banner).addEventListener("click", onSaveClick, {once: true});
        timerId = setTimeout(onTimerExpired, REMOVE_DELAY);
    }

    function onCartClick(e) {
        const removeBtn = e.target.closest(SELECTOR_LIST.removeBtn);
        const decrementBtn = !removeBtn && e.target.closest(SELECTOR_LIST.decrementBtn);
        const btn = removeBtn || decrementBtn;
        if (!btn) return;

        if (decrementBtn) {
            const bagItem = decrementBtn.closest(SELECTOR_LIST.bagItem);
            const qtyInput = bagItem && q(SELECTOR_LIST.qtyInput, bagItem);
            if (!bagItem || parseInt(qtyInput?.value, 10) !== 1) return;
        }

        if (nativeClickAllowed.has(btn)) {
            nativeClickAllowed.delete(btn);
            return;
        }

        fireGA4Event("VC125_RemoveFromCart", "Remove");
        logInfo("VC125_RemoveFromCart fired");

        if (btn.classList.contains("vc125-remove-disabled")) return;

        const bagItem = btn.closest(SELECTOR_LIST.bagItem);
        if (isAlreadySaved(bagItem)) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        showBanner(btn);
    }

    function attachClickInterceptor() {
        const cartRoot = q(SELECTOR_LIST.cartRoot);
        const target = cartRoot || document;
        target.addEventListener("click", onCartClick, true);
    }

    function init() {
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        injectStyles(css);
        attachClickInterceptor();
        logInfo("Initialised.");
    }

    function isCartReady() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q(SELECTOR_LIST.readyCheck));
    }

    try {
        await waitForElement(isCartReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }
})();
