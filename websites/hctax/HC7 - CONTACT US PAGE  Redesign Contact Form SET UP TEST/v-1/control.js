(async () => {
    const TEST_ID = "HC7";
    const VARIANT_ID = "V1";

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


    function init() {
        logInfo("Initializing...");
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
