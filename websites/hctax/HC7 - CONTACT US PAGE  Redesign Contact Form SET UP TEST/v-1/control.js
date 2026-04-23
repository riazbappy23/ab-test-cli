(async () => {
    const TEST_ID = "HC7";
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
                    return reject(new Error(`Timeout: ${predicate.toString()}`));
                }
                if (typeof predicate === "function" && predicate()) {
                    clearInterval(interval);
                    return resolve(true);
                }
            }, frequency);
        });
    }

    function fireGA4Event(eventName, eventLabel = "") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "GA4event",
            "ga4-event-name": "cro_event",
            "ga4-event-p1-value": eventName,
            "ga4-event-p2-name": "event_label",
            "ga4-event-p2-value": eventLabel,
        });
        logInfo(`Event fired: ${eventName}${eventLabel ? ` - ${eventLabel}` : ""}`);
    }

    function init() {
        logInfo("Initializing...");
        setTimeout(() => {
            fireGA4Event("HC7_ViewContactPage");
        }, 200);
    }

    function isCorrectPage() {
        return !!document.querySelector("#contact-form");
    }

    try {
        await waitForElementAsync(() => !!document.querySelector("#contact-form"), 10000);
        init();
    } catch (error) {
        logInfo(`Error during initialization: ${error.message}`);
        setTimeout(() => {
            if (isCorrectPage()) {
                init();
            }
        }, 2000);
    }
})();
