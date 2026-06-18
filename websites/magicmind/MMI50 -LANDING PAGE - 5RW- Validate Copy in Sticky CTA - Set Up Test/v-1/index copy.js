
(() => {
    const TEST_ID = "MMI50";
    const VARIANT_ID = "V1";
    console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "fired");

    const BUTTON_COPIES = {
        V1: "Try Risk Free",
        V2: "Get Started",
    };

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function fireGA4Event(eventName) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "GA4event",
            "ga4-event-name": "cro_event",
            "ga4-event-p1-name": "event_category",
            "ga4-event-p1-value": eventName,
        });
    }

    function setupButton([btn]) {
        const textEl = btn.querySelector("p");
        if (textEl) {
            textEl.textContent = BUTTON_COPIES[VARIANT_ID];
        }
        btn.addEventListener("click", () => {
            fireGA4Event("MMI50_StickyCTAClick");
        });
    }

    function mainJs([body]) {
        document.body.classList.add(TEST_ID, `${TEST_ID}-${VARIANT_ID}`);
        waitForElem('[data-intelligems-event="atf-button-click"]', setupButton);
    }

    waitForElem("body", mainJs);
})();
