(async () => {
    const TEST_ID = "VC125";
    const VARIANT_ID = "V1";

    // Small helper to print structured logs in console for debugging the experiment
    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;", message);
    }

    logInfo("fired");

    // Global configuration for the experiment
    const CONFIG = {
        page_initials: "AB-VC125-V1",
        test_variation: 1,
        test_version: 0.0003,
        remove_delay: 5000, // delay before the actual remove happens
    };

    // All selectors used in the script are centralized here
    const SEL = {
        readyCheck: ".bag--mini",
        checkout: ".bag__items-wrapper button.bag__checkout",
        bagItem: ".bag-item",
        removeBtn: ".bag-item__inner-actions-wrapper .bag-item__remove",
        saveBtn: ".bag-item__inner-actions-wrapper .bag-item__save-for-later-button",
        itemImage: [".bag-item__photo img", "[class*='bag-item'] img"].join(", "),
        itemTitle: ".bag-item__title",
        itemVariant: ".bag-item__variant",
        savedWrapper: ".saved-for-later-item__title-variants-wrapper",
        savedTitle: ".saved-for-later-item__title",
        savedVariants: ".saved-for-later-item__variants",
    };

    // Styles injected dynamically for the banner UI
    const css = `
        #vc125-banner-zone {
            width    : 100%;
            overflow : visible;
        }

        .vc125-banner {
            display      : flex;
            align-items  : center;
            gap          : 12px;
            padding      : 8px 20px 8px 8px;
            background   : #E8E8E8;
            box-sizing   : border-box;
            width        : 100%;
            margin       : 18px 0;
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

        .vc125-banner__img {
            flex-shrink : 0;
            width       : 49px;
            height      : 61.25px;
            object-fit  : cover;
            display     : block;
            background  : #e8e8e8;
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
            text-decoration      : underline;
            text-underline-offset: 3px;
            font-family          : Lato !important;
        }

        .vc125-banner__save-btn:hover { opacity: 0.55; }

        .vc125-remove-disabled {
            pointer-events : none !important;
            opacity        : 0.35 !important;
        }

        @media (max-width: 767px) {
            .vc125-banner {
                padding: 23px 20px 22px 18px;
            }
            .vc125-banner__img {
                display: none;
            }
        }
    `;

    // Shortcut for querySelector
    function q(selector, root) {
        return (root || document).querySelector(selector);
    }

    // Shortcut for querySelectorAll returning array
    function qAll(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    // Injects CSS into the document only once
    function injectStyles(cssString) {
        if (document.getElementById("vc125-styles")) return;
        const style = document.createElement("style");
        style.id = "vc125-styles";
        style.textContent = cssString;
        document.head.appendChild(style);
    }

    // Escapes HTML characters to avoid injection issues when rendering user content
    function escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
    }

    // Generic wait function used to delay script initialization until DOM is ready
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

    /* Strip "Label: " prefix from cart variant spans.
       e.g. "Color: Pearl" → "pearl",  "Size: 29" → "29" */
    function stripLabel(str) {
        return clean(str).replace(/^[^:]+:\s*/, "");
    }

    /* Build a Set of individual variant values from the cart item.
       Each .bag-item__variant span becomes one entry after label removal.
       e.g. {"pearl", "29"} */
    function getCartVariantSet(bagItem) {
        return new Set(
            qAll(SEL.itemVariant, bagItem)
                .map((el) => stripLabel(el.textContent))
                .filter(Boolean)
        );
    }

    /* Build a Set of individual variant values from a saved-for-later wrapper.
       The variants string is "Pearl/31" — split on "/" or "," or whitespace runs.
       e.g. {"pearl", "31"} */
    function getSavedVariantSet(savedWrapper) {
        const raw = clean(q(SEL.savedVariants, savedWrapper)?.textContent || "");
        return new Set(
            raw
                .split(/[/,]+/)
                .map((s) => s.trim())
                .filter(Boolean)
        );
    }

    // Compares two variant sets to ensure they represent the same product
    function variantSetsMatch(cartSet, savedSet) {
        if (cartSet.size === 0) return false;

        for (const val of cartSet) {
            if (!savedSet.has(val)) return false;
        }

        return true;
    }

    // Determines if a cart item already exists in the "Saved For Later" section
    function isAlreadySaved(bagItem) {
        if (!bagItem) return false;

        const cartTitle = clean(q(SEL.itemTitle, bagItem)?.textContent);
        const cartVariantSet = getCartVariantSet(bagItem);

        if (!cartTitle) return false;

        return qAll(SEL.savedWrapper).some((wrapper) => {
            const savedTitle = clean(q(SEL.savedTitle, wrapper)?.textContent);
            const savedVariantSet = getSavedVariantSet(wrapper);

            return savedTitle === cartTitle && variantSetsMatch(cartVariantSet, savedVariantSet);
        });
    }

    // Used to allow a script-triggered click to bypass the interception logic
    const nativeClickAllowed = new Set();

    // Triggers the actual remove button click while allowing it to bypass interception
    function triggerNativeRemove(removeBtn) {
        if (!removeBtn) return;

        nativeClickAllowed.add(removeBtn);
        removeBtn.click();
    }

    // Extracts product name and image information from a cart item
    function getProductInfo(bagItem) {
        if (!bagItem) return {name: "", imgSrc: "", imgAlt: ""};

        const titleEl = q(SEL.itemTitle, bagItem);
        const imgEl = q(SEL.itemImage, bagItem);

        let imgSrc = "";

        if (imgEl) {
            imgSrc = imgEl.src || imgEl.dataset.src || imgEl.dataset.lazySrc || "";

            // fallback if srcset is used
            if (!imgSrc && imgEl.srcset) {
                imgSrc = imgEl.srcset.split(/[\s,]+/)[0];
            }
        }

        // ensure protocol is valid
        if (imgSrc && imgSrc.startsWith("//")) imgSrc = "https:" + imgSrc;

        return {
            name: titleEl ? titleEl.textContent.trim() : "",
            imgSrc: imgSrc,
            imgAlt: imgEl ? imgEl.alt || "" : "",
        };
    }

    // Creates or retrieves the container that holds all banners
    function getOrCreateBannerZone() {
        const existing = document.getElementById("vc125-banner-zone");
        if (existing) return existing;

        const zone = document.createElement("div");
        zone.id = "vc125-banner-zone";

        const checkout = q(SEL.checkout);

        // Insert banner zone directly under checkout button
        if (checkout) {
            checkout.after(zone);
        } else {
            (q(".bag__items-wrapper") || document.body).prepend(zone);
        }

        return zone;
    }

    // Creates the banner DOM element for a removed item
    function createBannerElement({name, imgSrc, imgAlt}) {
        const banner = document.createElement("div");
        banner.className = "vc125-banner";

        banner.setAttribute("role", "status");
        banner.setAttribute("aria-live", "polite");

        const safeTitle = name ? escapeHTML(name) : "This item";

        const imgHTML = imgSrc ? `<img class="vc125-banner__img" src="${escapeHTML(imgSrc)}" alt="${escapeHTML(imgAlt)}" />` : `<div class="vc125-banner__img"></div>`;

        banner.innerHTML = `
            ${imgHTML}
            <div class="vc125-banner__text">
                <p class="vc125-banner__title">${safeTitle}</p>
                <p class="vc125-banner__subtitle">was removed from your cart</p>
            </div>
            <button class="vc125-banner__save-btn" type="button">Save For Later</button>
        `;

        return banner;
    }

    // Handles banner exit animation and safe DOM removal
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

        // fallback if transition event fails
        setTimeout(finish, 600);
    }

    // Displays the banner and manages timer + save interaction
    function showBanner(removeBtn) {
        const bagItem = removeBtn.closest(SEL.bagItem);
        const saveBtn = bagItem ? q(SEL.saveBtn, bagItem) : null;
        const product = getProductInfo(bagItem);

        // disable remove button temporarily
        removeBtn.classList.add("vc125-remove-disabled");

        const zone = getOrCreateBannerZone();
        const banner = createBannerElement(product);

        zone.appendChild(banner);

        let timerId = null;

        // double RAF ensures CSS transition triggers reliably
        requestAnimationFrame(() => {
            requestAnimationFrame(() => banner.classList.add("vc125-banner--visible"));
        });

        function onSaveClick() {
            clearTimeout(timerId);

            if (removeBtn && removeBtn.isConnected) {
                removeBtn.classList.remove("vc125-remove-disabled");
            }

            dismissBanner(banner, () => {
                if (saveBtn) saveBtn.click();
            });
        }

        function onTimerExpired() {
            dismissBanner(banner, () => {
                if (removeBtn && removeBtn.isConnected) {
                    removeBtn.classList.remove("vc125-remove-disabled");
                }

                triggerNativeRemove(removeBtn);
            });
        }

        q(".vc125-banner__save-btn", banner).addEventListener("click", onSaveClick, {once: true});

        timerId = setTimeout(onTimerExpired, CONFIG.remove_delay);
    }

    // Intercepts remove button clicks to show banner instead of immediate removal
    function attachClickInterceptor() {
        document.addEventListener(
            "click",
            (e) => {
                const removeBtn = e.target.closest(SEL.removeBtn);
                if (!removeBtn) return;

                // allow script-triggered remove clicks
                if (nativeClickAllowed.has(removeBtn)) {
                    nativeClickAllowed.delete(removeBtn);
                    return;
                }

                if (removeBtn.classList.contains("vc125-remove-disabled")) return;

                const bagItem = removeBtn.closest(SEL.bagItem);

                if (isAlreadySaved(bagItem)) return;

                e.preventDefault();
                e.stopImmediatePropagation();

                showBanner(removeBtn);
            },
            true // capture phase ensures interception before native handlers
        );
    }

    // Initializes the experiment
    function init() {
        const {page_initials, test_variation, test_version} = CONFIG;

        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);

        injectStyles(css);
        attachClickInterceptor();

        logInfo("Initialised.");
    }

    // Determines if the cart page is ready for experiment initialization
    function isCartReady() {
        const {page_initials, test_variation} = CONFIG;

        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q(SEL.readyCheck));
    }

    try {
        await waitForElement(isCartReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }
})();
