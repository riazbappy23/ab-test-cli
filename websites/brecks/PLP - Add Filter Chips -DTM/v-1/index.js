(() => {
    window.__ab_variant = "v1_PLP_FilterChips";
    const testInfo = {
        id: "PLP-FilterChips",
        name: "PLP - Add Filter Chips - DTM",
        variation: 1,
    };

    const TEST_ID = "PLP-FilterChips";
    const VARIANT_ID = "V1";

    const FILTER_ZONE = "filter.v.m.custom.filter_zone";
    const FILTER_SHIPPING = "filter.v.m.custom.filter_shipping_season";
    const FILTER_NEW = "filter.v.m.custom.filter_new_products";

    function logInfo(message) {
        console.log(
            `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
            "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
            "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
            message
        );
    }

    logInfo("fired");

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined")
            ? callback(elements)
            : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? decodeURIComponent(match[2]) : null;
    }

    function getPlantingZone() {
        const raw = getCookie("PlantingZone");
        if (!raw) return null;
        const match = raw.match(/^(\d+)/);
        return match ? match[1] : null;
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

    function findFilterGroup(label) {
        return document.querySelector(`.filter-form__group[data-filter-label="${label}"]`);
    }

    // Pick a single input — prefer the visible sidebar one to mirror manual clicks exactly.
    function getFilterInput(filterName, value) {
        const all = document.querySelectorAll(`input[name="${filterName}"][value="${value}"]`);
        if (!all.length) return null;
        for (const input of all) {
            if (input.id && input.id.includes("--sidebar")) return input;
        }
        return all[0];
    }

    // Toggle the filter checkbox programmatically (no label click → no focus/scroll).
    function toggleFilter(filterName, value) {
        const input = getFilterInput(filterName, value);
        if (!input) return false;
        input.checked = !input.checked;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
    }

    function toggleChipActive(chip) {
        if (chip) chip.classList.toggle("ab--chip-active");
    }

    function applyZoneFilter(e) {
        const zone = getPlantingZone();
        if (!zone) return;
        fireGA4Event("PLP_FilterChip_Click", "Shop My Zone");
        if (toggleFilter(FILTER_ZONE, zone)) toggleChipActive(e.currentTarget);
    }

    function applyShipsNowFilter(e) {
        fireGA4Event("PLP_FilterChip_Click", "Ships Now");
        let toggled = false;
        if (getFilterInput(FILTER_SHIPPING, "Fall")) {
            toggled = toggleFilter(FILTER_SHIPPING, "Fall");
        } else if (getFilterInput(FILTER_SHIPPING, "Both Spring and Fall")) {
            toggled = toggleFilter(FILTER_SHIPPING, "Both Spring and Fall");
        }
        if (toggled) toggleChipActive(e.currentTarget);
    }

    function applyNewArrivalFilter(e) {
        fireGA4Event("PLP_FilterChip_Click", "New Arrival");
        if (toggleFilter(FILTER_NEW, "Yes")) toggleChipActive(e.currentTarget);
    }

    function buildChipsContainer() {
        const wrapper = document.createElement("div");
        wrapper.className = "ab--filter-chips-wrap";

        const inner = document.createElement("div");
        inner.className = "ab--filter-chips";
        wrapper.appendChild(inner);

        const zone = getPlantingZone();
        const hasZoneGroup = !!findFilterGroup("zone");
        const hasShippingGroup = !!findFilterGroup("shipping-season");
        const hasNewProductsGroup = !!findFilterGroup("new-products");

        if (zone && hasZoneGroup) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "ab--filter-chip ab--chip-zone";
            chip.setAttribute("data-chip", "shop-my-zone");
            chip.innerHTML = `<span class="ab--chip-label">Shop Your Zone: ${zone}</span>`;
            chip.addEventListener("click", applyZoneFilter);
            inner.appendChild(chip);
        }

        if (hasNewProductsGroup) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "ab--filter-chip ab--chip-new";
            chip.setAttribute("data-chip", "new-arrival");
            chip.innerHTML = `<span class="ab--chip-label">New Arrivals</span>`;
            chip.addEventListener("click", applyNewArrivalFilter);
            inner.appendChild(chip);
        }

        if (hasShippingGroup) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "ab--filter-chip ab--chip-ships-now";
            chip.setAttribute("data-chip", "ships-now");
            chip.innerHTML = `<span class="ab--chip-label">Ships Now</span>`;
            chip.addEventListener("click", applyShipsNowFilter);
            inner.appendChild(chip);
        }

        return inner.children.length ? wrapper : null;
    }

    function injectChips() {
        if (document.querySelector(".ab--filter-chips-wrap")) return;
        const topbar = document.querySelector(".filter-topbar-wrap");
        if (!topbar) return;
        const chips = buildChipsContainer();
        if (!chips) return;
        topbar.parentNode.insertBefore(chips, topbar);
        logInfo("chips injected");
    }

    function mainJs([body]) {
        console.table({ ID: testInfo.id, Variation: testInfo.name });

        if (!document.body.classList.contains("ab--plp-filter-chips")) {
            document.body.classList.add("ab--plp-filter-chips");
        }

        waitForElem(".filter-topbar-wrap", () => {
            injectChips();
        });
    }

    waitForElem("body", mainJs);
})();
