(() => {
    const testInfo = {
        id: "minimize-pd",
        name: "PLP - Minimize Product Description Copy[M]",
        variation: 1,
    };

    const TEST_ID = "minimize-pd";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function collapseAll(except) {
        document.querySelectorAll(".AB-minimize-pd-desc-text.AB-minimize-pd-desc-expanded").forEach((descEl) => {
            if (descEl === except) return;
            descEl.classList.remove("AB-minimize-pd-desc-expanded");
            const btn = descEl.nextElementSibling;
            if (btn?.classList.contains("AB-minimize-pd-chevron-btn")) {
                btn.classList.remove("AB-minimize-pd-chevron-expanded");
                btn.setAttribute("aria-expanded", "false");
            }
        });
    }

    function initDescriptionToggles() {
        const pricingTexts = document.querySelectorAll(".product-list-product-inner .product-text .pricing-text");

        pricingTexts.forEach((pricingText) => {
            const descEl = pricingText.nextElementSibling;
            if (!descEl || descEl.dataset.abMinPdInit) return;

            descEl.dataset.abMinPdInit = "true";
            descEl.classList.add("AB-minimize-pd-desc-text");

            const chevronBtn = document.createElement("button");
            chevronBtn.className = "AB-minimize-pd-chevron-btn";
            chevronBtn.setAttribute("aria-label", "Toggle description");
            chevronBtn.setAttribute("aria-expanded", "false");
            chevronBtn.innerHTML = `<svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 6.70715L6.5 0.707153L0.5 6.70715" stroke="black" stroke-linecap="round"/>
</svg>
`;

            descEl.after(chevronBtn);

            chevronBtn.addEventListener("click", () => {
                const willExpand = !descEl.classList.contains("AB-minimize-pd-desc-expanded");
                collapseAll(willExpand ? descEl : null);
                descEl.classList.toggle("AB-minimize-pd-desc-expanded", willExpand);
                chevronBtn.classList.toggle("AB-minimize-pd-chevron-expanded", willExpand);
                chevronBtn.setAttribute("aria-expanded", willExpand);
            });
        });
    }

    function mainJs([body]) {
        !body.classList.contains("AB-minimize-pd") && body.classList.add("AB-minimize-pd");

        initDescriptionToggles();

        const observer = new MutationObserver(initDescriptionToggles);
        observer.observe(body, {childList: true, subtree: true});
    }

    waitForElem("body", mainJs);
})();
