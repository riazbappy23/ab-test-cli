(async () => {
    const TEST_ID = "MMI47";
    const VARIANT_ID = "control";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    async function waitForElementAsync(predicate, timeout = 20000, frequency = 150) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            if (typeof predicate === "function" && predicate()) return resolve(true);

            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;

                if (elapsed >= timeout) {
                    clearInterval(interval);
                    return reject(new Error(`Timeout of ${timeout}ms reached while waiting for condition: ${predicate.toString()}`));
                }

                if (typeof predicate === "function" && predicate()) {
                    clearInterval(interval);
                    return resolve(true);
                }
            }, frequency);
        });
    }

    function q(selector, scope = document) {
        return scope.querySelector(selector);
    }

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

    const TARGETTED_SHOPIFY_SECTION = ".shopify-section--announce-bar";
    let isInitialized = false;

    function clickFunction() {
        document.body.addEventListener("click", (e) => {
            const announceBar = e.target.closest(TARGETTED_SHOPIFY_SECTION);
            const announcePill = e.target.closest(".announce-bar__pill");

            if (announceBar && announcePill) {
                fireGA4Event("MMI47_EyebrowClick", "control");
            }
        });
    }

    function init() {
        isInitialized = true;
        clickFunction();
    }

    function checkForItems() {
        return !isInitialized && !!q(`${TARGETTED_SHOPIFY_SECTION} .announce-bar__pill`);
    }

    try {
        await waitForElementAsync(checkForItems);
        init();
    } catch (error) {
        logInfo(error.message);
    }
})();
