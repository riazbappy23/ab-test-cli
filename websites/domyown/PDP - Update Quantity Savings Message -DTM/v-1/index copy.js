(() => {
    const testInfo = {
        id: "pdp-qty-savings",
        name: "PDP - Update Quantity Savings Message [DTM]",
        variation: 1,
        version: "001",
    };

    const TEST_ID = "pdp-qty-savings";
    const VARIANT_ID = "V1";
    const BODY_CLASS = "AB-pdp-qty-savings";

    function logInfo(message) {
        console.log(`%cROI%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    let contentObserver = null;

    function debounce(fn, wait) {
        let t;
        return function () {
            clearTimeout(t);
            t = setTimeout(fn, wait);
        };
    }

    function parsePrice(str) {
        const num = parseFloat(String(str).replace(/[^0-9.]/g, ""));
        return isNaN(num) ? 0 : num;
    }

    // Locate the price block by its "Price/Ea." title (no nth-child, no tailwind-only lookup),
    // then work within that container using the custom price classes.
    function getPriceContainer() {
        const offers = document.querySelector("#product-page-offers");
        if (!offers) return null;

        const titles = offers.querySelectorAll("div");
        for (const el of titles) {
            if (el.children.length === 0 && el.textContent.trim().replace(/\.$/, "") === "Price/Ea") {
                return el.parentElement;
            }
        }
        return null;
    }

    // The actual test: only touch / bucket when a "Buy N or more" break exists for the
    // currently selected product; otherwise it is a no-op.
    function applySavings() {
        const container = getPriceContainer();
        if (!container) return;

        const baseEl = container.querySelector("#price-block .current-price") || container.querySelector(".current-price");
        const breaks = container.querySelectorAll(".price-breaks p");
        if (!baseEl || !breaks.length) return;

        const basePrice = parsePrice(baseEl.textContent);
        if (!basePrice) return;

        // Prices change when a different size is selected, so always recompute from scratch.
        container.querySelectorAll(".AB-savings-text").forEach((el) => el.remove());

        breaks.forEach((p) => {
            if (!/Buy\s+\d+\s+or more/i.test(p.textContent)) return;

            const priceEl = p.querySelector("span:not(.AB-savings-text)");
            if (!priceEl) return;

            const breakPrice = parsePrice(priceEl.textContent);
            if (!breakPrice) return;

            const savings = basePrice - breakPrice;
            if (savings <= 0) return;


            const savingsEl = document.createElement("span");
            savingsEl.className = "AB-savings-text";
            savingsEl.textContent = ` (save $${savings.toFixed(2)} per unit)`;
            priceEl.insertAdjacentElement("afterend", savingsEl);
        });

    }

    // Detach the content observer while we mutate the DOM so our own inserts don't
    // retrigger it (which would loop), then re-attach.
    function safeApply(root) {
        if (contentObserver) contentObserver.disconnect();
        applySavings();
        if (contentObserver && root) {
            contentObserver.observe(root, { childList: true, subtree: true, characterData: true });
        }
    }

    function init() {
        const offers = document.querySelector("#product-page-offers");
        if (!offers) return;

        document.body.classList.contains(BODY_CLASS) || document.body.classList.add(BODY_CLASS);

        const run = debounce(() => safeApply(offers), 60);

        const grid = document.querySelector("#products-grid");
        if (grid) {
            new MutationObserver(run).observe(grid, {
                attributes: true,
                attributeFilter: ["data-selected-products-id"],
            });
        }

        contentObserver = new MutationObserver(run);
        contentObserver.observe(offers, { childList: true, subtree: true, characterData: true });

        safeApply(offers);
    }

    if (document.readyState === "complete") {
        init();
    } else {
        window.addEventListener("load", init);
    }
})();
