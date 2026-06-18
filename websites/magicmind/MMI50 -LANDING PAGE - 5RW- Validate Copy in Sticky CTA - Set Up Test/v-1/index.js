
(() => {
    const TEST_ID = "MMI50";
    const VARIANT_ID = "V2";
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

    function removeDuplicateTextDivs(btn) {
        const textDivs = Array.from(btn.children).filter(el => el.tagName === "DIV" && !el.hasAttribute("data-typewrite"));
        if (textDivs.length > 1) {
            textDivs.slice(1).forEach(div => div.remove());
        }
    }

    function processButton(btn) {
        if (btn.dataset.abProcessed) return;
        btn.dataset.abProcessed = "true";

        const typewriteEl = btn.querySelector("[data-typewrite]");
        if (typewriteEl) typewriteEl.remove();

        const textEl = btn.querySelector("p");
        if (textEl) textEl.textContent = BUTTON_COPIES[VARIANT_ID];

        btn.addEventListener("click", () => fireGA4Event("MMI50_StickyCTAClick"), true);

        const btnObserver = new MutationObserver(() => removeDuplicateTextDivs(btn));
        btnObserver.observe(btn, { childList: true });
    }

    function setupButtons(buttons) {
        buttons.forEach(processButton);

        const observer = new MutationObserver(() => {
            document.querySelectorAll('[data-intelligems-event="atf-button-click"]').forEach(processButton);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function mainJs([body]) {
        document.body.classList.add(TEST_ID, `${TEST_ID}-${VARIANT_ID}`);
        waitForElem('[data-intelligems-event="atf-button-click"]', setupButtons);
    }

    waitForElem("body", mainJs);
})();
