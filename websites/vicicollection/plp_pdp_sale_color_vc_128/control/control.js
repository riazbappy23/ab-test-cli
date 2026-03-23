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
        test_name: "🧡🔥🍿VC128: [COLLECTION PRODUCT] Collection + PDP Sale Color (2) SET UP TEST",
        page_initials: "AB-VC128",
        test_version: 0.0001,
    };

    const { page_initials } = TEST_CONFIG;

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

    function q(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qAll(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function isAllSalePage() {
        return window.location.pathname.includes("all-sale");
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

    function init() {
        if (!isAllSalePage()) return;

        const pageType = isPDP() ? "pdp" : "plp";

        if (pageType === "pdp") {
            const hasCompareAtPDP = !!q(".pv-price__compare");
            if (hasCompareAtPDP) {
                fireGA4Event("VC128_Control_ViewedSalePDP", "control");
                logInfo("Event fired: VC128_Control_ViewedSalePDP");
            }
        } else {
            const saleCards = qAll(".product-item__price--original");
            if (saleCards.length > 0) {
                fireGA4Event("VC128_Control_ViewedSaleProductCard", "control");
                logInfo(`Event fired: VC128_Control_ViewedSaleProductCard (${saleCards.length} sale card(s) found)`);
            }
        }
    }

    function isDomReady() {
        return !!q("body");
    }

    try {
        await waitForElement(isDomReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }
})();