(async () => {
    const TEST_ID = "VC125";
    const VARIANT_ID = "control";

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
        test_version: 0.0003,
    };

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
        removeBtn: ".bag-item__inner-actions-wrapper .bag-item__remove",
        saveBtn: ".bag-item__inner-actions-wrapper .bag-item__save-for-later-button",
    };

    function q(selector, root) {
        return (root || document).querySelector(selector);
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

    function onCartClick(e) {
        if (e.target.closest(SELECTOR_LIST.removeBtn)) {
            fireGA4Event("VC125_RemoveFromCart");
            logInfo("VC125_RemoveFromCart fired");
            return;
        }
    }

    function attachClickInterceptor() {
        const cartRoot = q(SELECTOR_LIST.cartRoot);
        const target = cartRoot || document;
        target.addEventListener("click", onCartClick, true);
    }

    function init() {
        q("body").classList.add(page_initials, `${page_initials}--control`, `${page_initials}--version:${test_version}`);
        attachClickInterceptor();
        logInfo("Initialised.");
    }

    function isCartReady() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--control)`) && q(SELECTOR_LIST.readyCheck));
    }

    try {
        await waitForElement(isCartReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }
})();
