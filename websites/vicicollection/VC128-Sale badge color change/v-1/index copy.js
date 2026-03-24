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
        test_name: "VC128: [COLLECTION PRODUCT] Collection + PDP Sale Color (2) SET UP TEST",
        page_initials: "AB-VC128",
        test_version: 0.0001,
    };
    const test_variation = 1;
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

    function iSalePage() {
        return window.location.pathname.includes("sale");
    }

    function isPDP() {
        return !!q("#productPrice.pv-price");
    }

    const cssShared = `
        .AB-VC128 .pv-price__original {
            color: #000000 !important;
            font-weight: 700 !important;
        }
        .AB-VC128 .product-item__price {
            color: #000000 !important;
        }
        .AB-VC128--plp .product-item__price {
            font-weight: 400 !important;
        }
        .AB-VC128--pdp .product-item__price {
            font-weight: 700 !important;
        }
        .AB-VC128 .product-item__price--original,
        .AB-VC128 .pv-price__compare {
            color: #999999 !important;
            font-weight: 400 !important;
        }
        .AB-VC128 .global-sale-message__msg > span:last-child {
            background-color: inherit !important;
            color: inherit !important;
        }
       .AB-VC128--plp .global-sale-message__msg {
          font-weight: 400 !important;
          text-transform: lowercase;
        }
        .AB-VC128--plp .global-sale-message__msg > span:last-child {
          font-weight: 700 !important;
          text-transform: none !important;
        }
          .AB-VC128--pdp .global-sale-message__msg {
            font-weight: 700 !important;
            text-transform: uppercase !important;
          }

        @media (max-width: 390px) {
        .AB-VC128--pdp #product:has(.pv-price__original.has-compare-price)
        .global-sale-message__outer.hide-desktop
        .global-sale-message {
          max-width: 100% !important;
       }
}
    `;

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

    function init() {
        const body = q("body");

        if (!iSalePage()) {
            logInfo("Aborted — not an sale page.");
            return;
        }

        const pageType = isPDP() ? "pdp" : "plp";

        body.classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`, `AB-VC128--${pageType}`);

        body.classList.add(`AB-VC128--v${test_variation}`);

        const onSaleButton = q(`.${SELECTOR_LIST.onSaleButton}`);
        if (onSaleButton) {
            onSaleButton.style.display = "none";
        }

        let finalCSS = cssShared;
        if (test_variation === 1) {
            finalCSS += cssVariant1;
        }
        injectStyles(finalCSS);
        removeInlineStylesFromCodeSpan();
        observeCodeSpan();

        if (pageType === "pdp") {
            const hasCompareAtPDP = !!q(".pv-price__compare");
            if (hasCompareAtPDP) {
                fireGA4Event("VC128_ViewedSalePDP", `variant_${test_variation}`);
                logInfo("Event fired: VC128_ViewedSalePDP");
            }
        } else {
            const saleCards = qAll(".product-item__price--original");
            if (saleCards.length > 0) {
                fireGA4Event("VC128_ViewedSaleProductCard", `variant_${test_variation}`);
                logInfo(`Event fired: VC128_ViewedSaleProductCard (${saleCards.length} sale card(s) found)`);
            }
        }

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
