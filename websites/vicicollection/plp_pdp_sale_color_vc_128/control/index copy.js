(async () => {
    const TEST_ID = "VC128";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Acadia",
        project: "vicicollection",
        site_url: "https://www.vicicollection.com/",
        test_name: "🧡🔥🍿VC128: [COLLECTION PRODUCT] Collection + PDP Sale Color (2) SET UP TEST",
        page_initials: "AB-VC128",
        test_version: 0.0001,
        test_variation: 1,
    };
    const {test_variation} = TEST_CONFIG;
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
        productPrice: "product-item__price",
        globalSaleBadge: "global-sale-message",
        saleCode: "global-sale-message__msg",
        pdpCurrentPrice: "pv-price__original",
        onSaleButton: "pv-essential__badge",
        readyCheck: "body",
    };

    function q(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qAll(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    // ─── Page type helpers ────────────────────────────────────────────────────

    function isAllSalePage() {
        return window.location.pathname.includes("all-sale");
    }

    function isPDP() {
        // PDP has the productPrice element by id and pv-price class
        return !!q("#productPrice.pv-price");
    }

    // ─── CSS ──────────────────────────────────────────────────────────────────

    /*
     * Variant 1: Red badge bg/text + Black bold current price
     * Variant 2: Unchanged badge colours + Black bold current price
     *
     * Shared rules (both variants):
     *   - .pv-price__original  (PDP current price) → black, bold
     *   - .product-item__price (PLP current price) → black, bold (override red from parent)
     *   - .global-sale-message__msg plain text → bold on PDP, normal on PLP
     *     (the code <span> inside stays bold always via its own rule)
     *
     * Variant 1 extra:
     *   - .global-sale-message background → red (#C8102E)
     *   - .global-sale-message color     → white
     *   - inner code <span> bg/color     → red / white (override inline style)
     */

    const cssShared = `
        /* ── Current price: black + bold (PDP) ── */
        .AB-VC128 .pv-price__original {
            color: #000000 !important;
            font-weight: 700 !important;
        }

        /* ── Current price: black + bold (PLP – first text node colour inherits from parent,
               so we target the price wrapper directly) ── */
        .AB-VC128 .product-item__price {
            color: #000000 !important;
            font-weight: 700 !important;
        }

        /* Keep strikethrough/original price grey on both pages */
        .AB-VC128 .product-item__price--original,
        .AB-VC128 .pv-price__compare {
            color: #999999 !important;
            font-weight: 400 !important;
        }

        /* ── global-sale-message badge text ──
           PLP: normal weight for plain text, bold for code span */
        .AB-VC128--plp .global-sale-message__msg {
            font-weight: 400 !important;
        }
        /* The promo code span inside msg is always bold */
        .AB-VC128--plp .global-sale-message__msg > span:last-child {
            font-weight: 700 !important;
        }

        /* PDP: bold for the whole badge text */
        .AB-VC128--pdp .global-sale-message__msg {
            font-weight: 700 !important;
        }

        /* Remove inline styles from the inner code <span> so our CSS takes over */
        .AB-VC128 .global-sale-message__msg > span:last-child {
            background-color: inherit !important;
            color: inherit !important;
        }
    `;

    /* Variant 1 only: turn badge red */
    const cssVariant1 = `
        .AB-VC128--v1 .global-sale-message {
            background-color: #C8102E !important;
            color: #FFFFFF !important;
        }
    `;

    function injectStyles(cssString) {
        if (document.getElementById("vc128-styles")) return;
        const style = document.createElement("style");
        style.id = "vc128-styles";
        style.textContent = cssString;
        document.head.appendChild(style);
    }

    // ─── waitForElement ───────────────────────────────────────────────────────

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

    // ─── Inline-style removal for the code <span> ─────────────────────────────
    // The last child <span> of .global-sale-message__msg carries an inline
    // background-color / color that would override our CSS.  We strip it here
    // and also set up a MutationObserver in case it is re-added dynamically.

    function removeInlineStylesFromCodeSpan() {
        qAll(`.${SELECTOR_LIST.saleCode}`).forEach((msg) => {
            const codeSpan = msg.querySelector("span:last-child");
            if (codeSpan) {
                codeSpan.removeAttribute("style");
            }
        });
    }

    function observeCodeSpan() {
        const observer = new MutationObserver(() => {
            removeInlineStylesFromCodeSpan();
        });
        qAll(`.${SELECTOR_LIST.saleCode}`).forEach((msg) => {
            const codeSpan = msg.querySelector("span:last-child");
            if (codeSpan) {
                observer.observe(codeSpan, {attributes: true, attributeFilter: ["style"]});
            }
        });
    }

    // ─── init ─────────────────────────────────────────────────────────────────

    function init() {
        const body = q("body");

        // Guard: only run on /all-sale pages
        if (!isAllSalePage()) {
            logInfo("Aborted — not an all-sale page.");
            return;
        }

        const pageType = isPDP() ? "pdp" : "plp";

        // Add base classes
        body.classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`, `AB-VC128--${pageType}`);

        // Variant-specific class for CSS scoping
        body.classList.add(`AB-VC128--v${test_variation}`);

        // Build final CSS
        let finalCSS = cssShared;
        if (test_variation === 1) {
            finalCSS += cssVariant1;
        }
        injectStyles(finalCSS);

        // Strip inline styles from code span (Variant 1 needs this for colour
        // to apply; no harm running for Variant 2 either since we inherit)
        removeInlineStylesFromCodeSpan();
        observeCodeSpan();

        // Fire impression event
        fireGA4Event(`${TEST_ID}_impression`, `variant_${test_variation}_${pageType}`);

        logInfo(`Initialised — Variant ${test_variation} | Page: ${pageType}`);
    }

    function isDomReady() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q("body"));
    }

    try {
        await waitForElement(isDomReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }
})();
