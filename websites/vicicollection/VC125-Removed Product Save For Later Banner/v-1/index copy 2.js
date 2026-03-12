(async () => {
    const TEST_ID    = "VC125";
    const VARIANT_ID = "V1"; // Control | V1 | V2

    function logInfo(message) {
        console.log(
            `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
            "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;",
            "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;",
            message
        );
    }

    logInfo("fired");

    const CONFIG = {
        page_initials : "AB-VC125-V1",
        test_variation: 1,
        test_version  : 0.0003,
        remove_delay  : 5000,
    };

    const SEL = {
        readyCheck: ".bag--mini",
        checkout  : ".bag__items-wrapper button.bag__checkout",
        bagItem   : ".bag-item",
        removeBtn : ".bag-item__inner-actions-wrapper .bag-item__remove",
        saveBtn   : ".bag-item__inner-actions-wrapper .bag-item__save-for-later-button",
        savedTitle: ".saved-for-later-item__title",
        itemImage : [".bag-item__photo img", "[class*='bag-item'] img"].join(", "),
        itemTitle : [".bag-item__title", ".bag-item__name", "[class*='bag-item__title']", "[class*='bag-item__name']"].join(", "),
    };

    const css = `
        #vc125-banner-zone {
            width    : 100%;
            overflow : visible;
        }

        .vc125-banner {
            display      : flex;
            align-items  : center;
            gap          : 12px;
            padding      : 10px 16px;
            background   : #f5f5f5;
            border-bottom: 1px solid #e8e8e8;
            box-sizing   : border-box;
            width        : 100%;
            border-radius: 10px;
            margin       : 10px 0;
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
            gap            : 2px;
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
            font-family   : inherit;
        }

        .vc125-banner__subtitle {
            font-size     : 13px;
            color         : #838383;
            line-height   : 14px;
            font-weight   : 600;
            letter-spacing: 0px;
            margin        : 0;
            font-family   : inherit;
        }

        .vc125-banner__save-btn {
            flex-shrink     : 0;
            background      : none;
            border          : none;
            padding         : 0;
            font-size       : 14px;
            font-weight     : 600;
            letter-spacing  : 0px;
            color           : #333132;
            cursor          : pointer;
            white-space     : nowrap;
            text-decoration : underline;
            font-family     : inherit;
        }

        .vc125-banner__save-btn:hover { opacity: 0.55; }

        .vc125-remove-disabled {
            pointer-events : none !important;
            opacity        : 0.35 !important;
        }
    `;

    /* ─────────────────────────────────────────────
       UTILITIES
    ───────────────────────────────────────────── */

    function q(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qAll(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function injectStyles(cssString) {
        if (document.getElementById("vc125-styles")) return;
        const style       = document.createElement("style");
        style.id          = "vc125-styles";
        style.textContent = cssString;
        document.head.appendChild(style);
    }

    function escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, (c) =>
            ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]
        );
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
                if (predicate()) { clearInterval(id); resolve(true); }
            }, interval);
        });
    }

    /* ─────────────────────────────────────────────
       NATIVE CLICK PASSTHROUGH
       A Set of remove buttons that should be let
       through by our capture listener on the NEXT
       click event only. We add the button here just
       before calling .click(), the listener sees it,
       skips interception, and immediately deletes it.
    ───────────────────────────────────────────── */
    const nativeClickAllowed = new Set();

    function triggerNativeRemove(removeBtn) {
        if (!removeBtn) return;
        logInfo("Triggering native remove click.");
        nativeClickAllowed.add(removeBtn);
        removeBtn.click();
    }

    /* ─────────────────────────────────────────────
       PRODUCT INFO
    ───────────────────────────────────────────── */

    function getProductInfo(bagItem) {
        if (!bagItem) return { name: "", imgSrc: "", imgAlt: "" };

        const titleEl = q(SEL.itemTitle, bagItem);
        const imgEl   = q(SEL.itemImage, bagItem);

        let imgSrc = "";
        if (imgEl) {
            imgSrc = imgEl.src || imgEl.dataset.src || imgEl.dataset.lazySrc || "";
            if (!imgSrc && imgEl.srcset) imgSrc = imgEl.srcset.split(/[\s,]+/)[0];
        }
        if (imgSrc && imgSrc.startsWith("//")) imgSrc = "https:" + imgSrc;

        return {
            name  : titleEl ? titleEl.textContent.trim() : "",
            imgSrc: imgSrc,
            imgAlt: imgEl ? imgEl.alt || "" : "",
        };
    }

    function isAlreadySaved(productName) {
        if (!productName) return false;
        const needle = productName.toLowerCase();
        return qAll(SEL.savedTitle).some(
            (el) => el.textContent.trim().toLowerCase() === needle
        );
    }

    /* ─────────────────────────────────────────────
       BANNER ZONE
       Created lazily on first Remove click so the
       checkout button is guaranteed to be in the DOM.
    ───────────────────────────────────────────── */
    function getOrCreateBannerZone() {
        const existing = document.getElementById("vc125-banner-zone");
        if (existing) return existing;

        const zone = document.createElement("div");
        zone.id    = "vc125-banner-zone";

        const checkout = q(SEL.checkout);
        if (checkout) {
            checkout.parentNode.insertBefore(zone, checkout.nextSibling);
            logInfo("Banner zone → after checkout button.");
        } else {
            (q(".bag__items-wrapper") || document.body).prepend(zone);
            logInfo("WARN: checkout not found — zone at fallback.");
        }

        return zone;
    }

    /* ─────────────────────────────────────────────
       BANNER ELEMENT
    ───────────────────────────────────────────── */
    function createBannerElement({ name, imgSrc, imgAlt }) {
        const banner     = document.createElement("div");
        banner.className = "vc125-banner";
        banner.setAttribute("role", "status");
        banner.setAttribute("aria-live", "polite");

        const safeTitle = name ? escapeHTML(name) : "This item";
        const imgHTML   = imgSrc
            ? `<img class="vc125-banner__img" src="${escapeHTML(imgSrc)}" alt="${escapeHTML(imgAlt)}" />`
            : `<div class="vc125-banner__img"></div>`;

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

    /* ─────────────────────────────────────────────
       DISMISS BANNER — slide left, then remove
    ───────────────────────────────────────────── */
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

        bannerEl.addEventListener("transitionend", finish, { once: true });
        setTimeout(finish, 600);
    }

    /* ─────────────────────────────────────────────
       SHOW BANNER
    ───────────────────────────────────────────── */
    function showBanner(removeBtn) {
        const bagItem = removeBtn.closest(SEL.bagItem);
        const saveBtn = bagItem ? q(SEL.saveBtn, bagItem) : null;
        const product = getProductInfo(bagItem);

        // Lock Remove button while banner is alive
        removeBtn.classList.add("vc125-remove-disabled");

        const zone   = getOrCreateBannerZone();
        const banner = createBannerElement(product);
        zone.appendChild(banner);

        let timerId = null;

        // Double-rAF: paint initial translateX(110%) before adding --visible
        requestAnimationFrame(() => {
            requestAnimationFrame(() => banner.classList.add("vc125-banner--visible"));
        });

        /* ── User clicked Save For Later in banner ── */
        function onSaveClick() {
            logInfo(`Save For Later — "${product.name}"`);
            clearTimeout(timerId);
            // Unlock the Remove button (item is staying in cart)
            removeBtn.classList.remove("vc125-remove-disabled");
            dismissBanner(banner, () => {
                if (saveBtn) {
                    saveBtn.click();
                    logInfo("Triggered native Save For Later.");
                }
            });
        }

        /* ── Timer expired: dismiss banner then fire native remove ── */
        function onTimerExpired() {
            logInfo(`Timer expired — "${product.name}"`);
            // Dismiss banner first, then trigger the original remove click.
            // The remove button stays disabled until the click fires so our
            // capture listener's disabled-check lets it through via nativeClickAllowed.
            dismissBanner(banner, () => {
                removeBtn.classList.remove("vc125-remove-disabled");
                triggerNativeRemove(removeBtn);
            });
        }

        q(".vc125-banner__save-btn", banner)
            .addEventListener("click", onSaveClick, { once: true });

        timerId = setTimeout(onTimerExpired, CONFIG.remove_delay);

        logInfo(`Banner shown for "${product.name}". Removes in ${CONFIG.remove_delay}ms.`);
    }

    /* ─────────────────────────────────────────────
       CLICK INTERCEPTOR
    ───────────────────────────────────────────── */
    function attachClickInterceptor() {
        document.addEventListener(
            "click",
            (e) => {
                const removeBtn = e.target.closest(SEL.removeBtn);
                if (!removeBtn) return;

                // This is our own programmatic click after timer — let it through
                if (nativeClickAllowed.has(removeBtn)) {
                    nativeClickAllowed.delete(removeBtn);
                    logInfo("Native remove click passed through.");
                    return;
                }

                // Banner already active for this item — ignore duplicate user clicks
                if (removeBtn.classList.contains("vc125-remove-disabled")) return;

                const bagItem     = removeBtn.closest(SEL.bagItem);
                const titleEl     = bagItem ? q(SEL.itemTitle, bagItem) : null;
                const productName = titleEl ? titleEl.textContent.trim() : "";

                // Already in Save For Later — let remove happen immediately, no banner
                if (isAlreadySaved(productName)) return;

                // Show banner and delay the remove
                e.preventDefault();
                e.stopImmediatePropagation();
                logInfo(`Remove intercepted for "${productName}".`);
                showBanner(removeBtn);
            },
            true // capture phase — before Shopify's own handlers
        );
    }

    /* ─────────────────────────────────────────────
       INIT
    ───────────────────────────────────────────── */
    function init() {
        const { page_initials, test_variation, test_version } = CONFIG;
        q("body").classList.add(
            page_initials,
            `${page_initials}--v${test_variation}`,
            `${page_initials}--version:${test_version}`
        );
        injectStyles(css);
        attachClickInterceptor();
        logInfo("Initialised.");
    }

    function isCartReady() {
        const { page_initials, test_variation } = CONFIG;
        return !!(
            q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) &&
            q(SEL.readyCheck)
        );
    }

    try {
        await waitForElement(isCartReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }
})();