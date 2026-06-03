(() => {
    window.__ab_variant = "v2_BW137";

    const TEST_ID = "BW137";
    const VARIANT_ID = "V2";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
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

    const PILLS = [
        {
            label: "Soft Toe",
            gaLabel: "Soft_Toe",
            url: "https://bruntworkwear.com/collections/boots?filter.p.m.custom.toe_type=Soft+Toe",
        },
        {
            label: "Comp Toe",
            gaLabel: "Comp_Toe",
            url: "https://bruntworkwear.com/collections/boots?filter.p.m.custom.toe_type=Comp+Toe",
        },
        {
            label: "Brunt Toe",
            gaLabel: "BRUNT_Toe",
            url: "https://bruntworkwear.com/collections/boots?filter.p.m.custom.toe_type=BRUNT+Toe",
        },
    ];

    function buildSection() {
        const wrapper = document.createElement("section");
        wrapper.className = "ab-bw137 ab-bw137--v2";
        wrapper.innerHTML = `
      <div class="ab-bw137__inner">
        <h2 class="ab-bw137__title">SHOP BY TOE</h2>
        <div class="ab-bw137__pills">
          ${PILLS.map(
              (p) => `
            <a class="ab-bw137__pill" href="${p.url}" data-ab-ga-label="${p.gaLabel}">
              <span class="ab-bw137__pill-label">${p.label}</span>
            </a>`
          ).join("")}
        </div>
      </div>
    `;
        return wrapper;
    }

    function attachClicks() {
        document.body.addEventListener("click", (e) => {
            const pill = e.target.closest(".ab-bw137__pill");
            if (pill) {
                fireGA4Event("BW137_ShopByToeClick", pill.dataset.abGaLabel || "");
            }
        });
    }

    function patchTabbedSection() {
        waitForElem(".shopify-section.tabbed-collections-section > div", () => {
            const inner = document.querySelector(".shopify-section.tabbed-collections-section > div");
            if (!inner) return;
            inner.classList.remove("py-12", "md:py-16");
            inner.classList.add("ab-bw137__tabbed-inner");
        });
    }

    function injectSection() {
        waitForElem(".shopify-section.tabbed-collections-section", () => {
            if (document.querySelector(".ab-bw137")) return;
            const target = document.querySelector(".shopify-section.tabbed-collections-section");
            const section = buildSection();
            target.insertAdjacentElement("beforebegin", section);
        });
    }

    function mainJs() {
        document.body.classList.add("ab-bw137--variation-2");
        patchTabbedSection();
        injectSection();
        attachClicks();
    }

    waitForElem("body", mainJs);
})();
