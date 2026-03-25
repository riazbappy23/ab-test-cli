(async () => {
    const TEST_ID = "VC128";
    const VARIANT_ID = "control";

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
        test_version: 0.0002,
    };
    const test_variation = "control";
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

    function isEligibleRoute() {
        return window.location.pathname.includes("/collections/") || window.location.pathname.includes("/products/");
    }

    function isPDP() {
        return !!q("#productPrice.pv-price");
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

    function observePLPSaleCards() {
        const container = q("body");
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
            const saleCards = qAll(".product-item__price--on-sale");
            if (saleCards.length > 0) {
                fireGA4Event("VC128_ViewedSaleProductCard", `${test_variation}`);
                logInfo(`Event fired: VC128_ViewedSaleProductCard (${saleCards.length} sale card(s) found)`);
                observer.disconnect();
            }
        });

        observer.observe(container, {childList: true, subtree: true});
    }

    function init() {
        const body = q("body");

        if (!isEligibleRoute()) {
            logInfo("Aborted — not an sale page.");
            return;
        }

        const pageType = isPDP() ? "pdp" : "plp";

        body.classList.add(page_initials, `${page_initials}--${test_variation}`, `${page_initials}--version:${test_version}`, `AB-VC128--${pageType}`);

        body.classList.add(`AB-VC128--${test_variation}`);

        const onSaleButton = q(`.${SELECTOR_LIST.onSaleButton}`);
        if (onSaleButton) {
            onSaleButton.style.display = "none";
        }

        if (pageType === "pdp") {
            try {
                const hasCompareAtPDP = !!q(".pv-price__compare");
                if (hasCompareAtPDP) {
                    fireGA4Event("VC128_ViewedSalePDP", `${test_variation}`);
                    logInfo("Event fired: VC128_ViewedSalePDP");
                }
            } catch {
                logInfo("No PDP sale detected — skipping GA4 event");
            }
        } else {
            observePLPSaleCards();
        }

        logInfo(`Initialised — ${test_variation} | Page: ${pageType}`);
    }

    function isDomReady() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--${test_variation})`) && q("body"));
    }

    try {
        await waitForElement(isDomReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }
})();
