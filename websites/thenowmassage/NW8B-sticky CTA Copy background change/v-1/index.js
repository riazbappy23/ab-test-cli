(async () => {
    const TEST_ID = "NW8B";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        page_initials: "AB-NW8B",
        test_variation: 1,
        test_version: 0.0001,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

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

    function q(selector) {
        return document.querySelector(selector);
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

    const css = `
    @media (max-width: 767px) {
        .AB-NW8A--v1 .nav-main__ctas a, .AB-NW8A--v2 .nav-main__ctas a {
            background: #fff !important;
        }
        .AB-NW8A--v1 .nav-main__ctas a .nw8a-cta__label, .AB-NW8A--v2 .nav-main__ctas a .nw8a-cta__label {
            color: #404D6A !important;
        }
        .AB-NW8A--v1 .nav-main__ctas a .nw8a-cta__arrow path, .AB-NW8A--v2 .nav-main__ctas a .nw8a-cta__arrow path {
    fill: #404D6A !important;
     }
     .AB-NW8A--v1 .location-search-form__container{
            margin-top: 25px;
    }
`;

    function injectStyles(cssString) {
        if (document.getElementById("NW8B-styles")) return;
        const style = document.createElement("style");
        style.id = "NW8B-styles";
        style.textContent = cssString;
        document.head.appendChild(style);
    }

    function init() {
        if (!document.body.classList.contains(page_initials)) {
            q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);

            injectStyles(css);

            const anchor = q(".nav-main__ctas a");
            if (!anchor) return;

            anchor.addEventListener("click", () => {
                fireGA4Event("NW8B_StickyCTAClicks", "Sticky CTA Copy");
                logInfo(`NW8B_StickyCTAClicks fired`);
            });

            logInfo("Initialised.");
        }
    }

    function isReady() {
        return !!q(".AB-NW8A");
    }

    try {
        await waitForElement(isReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }
})();
