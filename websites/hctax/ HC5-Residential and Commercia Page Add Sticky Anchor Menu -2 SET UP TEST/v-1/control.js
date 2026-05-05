(async () => {
    const TEST_ID = "HC5";
    const VARIANT_ID = "V0";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;", message);
    }

    logInfo("fired");

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

    function isExpectedPage() {
        const path = window.location.pathname.toLowerCase();
        return path.includes("/commercial") || path.includes("/residential");
    }

    function isCommercialPage() {
        return window.location.pathname.toLowerCase().includes("/commercial");
    }

    async function waitForElementAsync(predicate, timeout = 20000, frequency = 150) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            if (typeof predicate === "function" && predicate()) return resolve(true);
            const interval = setInterval(() => {
                if (Date.now() - startTime >= timeout) {
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

    function checkForItems() {
        if (!isExpectedPage()) return false;
        if (!document.querySelector("main > div:first-of-type")) return false;
        if (document.readyState !== "complete") return false;
        return true;
    }

    function setupScrollDepthTracking() {
        const thresholds = [25, 50, 75, 100];
        const fired = new Set();

        const onScroll = () => {
            const docEl = document.documentElement;
            const scrollable = (docEl.scrollHeight || 0) - window.innerHeight;
            if (scrollable <= 0) return;
            const scrollPct = (window.scrollY / scrollable) * 100;

            thresholds.forEach((pct) => {
                if (!fired.has(pct) && scrollPct >= pct) {
                    fired.add(pct);
                    fireGA4Event("HC5_Scrolldepth", String(pct));
                }
            });

            if (fired.size === thresholds.length) {
                window.removeEventListener("scroll", onScroll);
            }
        };

        window.addEventListener("scroll", onScroll, {passive: true});
        onScroll();
    }

    async function init_HC5() {
        if (!isExpectedPage()) return;

        fireGA4Event("HC5_ViewedServicePage", isCommercialPage() ? "Commercial" : "Residential");

        try {
            await waitForElementAsync(checkForItems);
            setupScrollDepthTracking();
            logInfo("Scroll depth tracking active");
        } catch (error) {
            logInfo(`Init failed: ${error.message}`);
        }
    }

    init_HC5();
})();
