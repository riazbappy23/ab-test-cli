(() => {
    console.log("Loopearplugs Color Swatches v2 Loaded");

    // WAIT FOR ELEMENT POLL FUNCTION
    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);

        if (timer <= 0) return;

        const conditionMet = isVariable ? typeof window[waitFor] !== "undefined" : elements.length >= minElements;

        conditionMet ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    };

    // UPDATE ACTIVE SWATCH
    function updateActiveState(color) {
        document.querySelectorAll(".loop-color-swatch").forEach((el) => {
            el.classList.toggle("active", el.dataset.color === color);
        });
    }

    // UPDATE HEADER VALUE
    function updateHeaderValue(color) {
        const value = document.querySelector(".loop-color-header .swatch-value");
        if (value) value.textContent = color;
    }

    // CHECK URL FOR VARIANT
    function hasVariantInUrl() {
        return new URLSearchParams(window.location.search).has("variant");
    }

    // CHECK PRODUCT DATA AND PRODUCT
    function isValidProduct() {
        return window.product && product.variants && hasVariantInUrl();
    }

    // WAIT FOR PRODUCT & DOM
    waitForElem(
        "product",
        function () {
            waitForElem(".product-form__input", initColorSwatches);
        },
        1,
        true
    );

    // ADD CLASS AND CREATE SWATCHES FOR MULTIPLE PRODUCTS ON PAGE
    waitForElem(".product__info-wrapper", () => {
        document.querySelectorAll(".product__info-wrapper").forEach((parentDiv) => {
            const targetFieldset = parentDiv.querySelector("variant-radios fieldset.product-form__input");
            if (!targetFieldset) return;
            targetFieldset.classList.add("loop-color-swatch-loaded");

            // create swatch container for this fieldset
            if (!targetFieldset.querySelector(".loop-color-wrapper")) {
                const selectedColor = targetFieldset.querySelector('input[name="Color"]:checked')?.value || "";
                const swatchContainer = createSwatchContainer(selectedColor);
                buildSwatches(swatchContainer, selectedColor);
                hideOriginalLabels(targetFieldset);

                targetFieldset.prepend(swatchContainer);
            }
        });
    });

    // MAIN ENTRY
    function initColorSwatches() {
        if (!isValidProduct()) return;

        const colorFieldset = getColorFieldset();
        if (!colorFieldset) return;

        const selectedColor = getSelectedColor(colorFieldset);

        // If UI already exists, just sync state
        if (isSwatchUIInitialized(colorFieldset)) {
            updateActiveState(selectedColor);
            updateHeaderValue(selectedColor);
            return;
        }

        const swatchContainer = createSwatchContainer(selectedColor);
        buildSwatches(swatchContainer, selectedColor);
        hideOriginalLabels(colorFieldset);

        colorFieldset.prepend(swatchContainer);
    }

    // FIND COLOR FIELDSET
    function getColorFieldset() {
        const fieldsets = document.querySelectorAll(".loop-color-swatch-loaded");
        return [...fieldsets].find((fs) => fs.querySelector('input[name="Color"]'));
    }

    // GET SELECTED COLOR
    function getSelectedColor(fieldset) {
        const checked = fieldset.querySelector('input[name="Color"]:checked');
        return checked ? checked.value : "";
    }

    // CHECK IF UI EXISTS
    function isSwatchUIInitialized(fieldset) {
        return !!fieldset.querySelector(".loop-color-wrapper");
    }

    // CREATE MAIN CONTAINER
    function createSwatchContainer(selectedColor) {
        const container = document.createElement("div");
        container.className = "loop-color-wrapper";

        container.innerHTML = `
        <div class="loop-color-header">
            <span class="swatch-label">Color:</span>
            <span class="swatch-value">${selectedColor}</span>
        </div>
        <div class="loop-color-swatches"></div>
    `;

        return container;
    }

    // BUILD SWATCH BUTTONS
    function buildSwatches(container, selectedColor) {
        const swatchWrapper = container.querySelector(".loop-color-swatches");

        product.variants.forEach((variant) => {
            if (!variant.featured_image || !variant.featured_image.src) return;

            const color = variant.option1;
            const swatch = createSwatchButton(variant, color, selectedColor);

            swatchWrapper.appendChild(swatch);
        });
    }

    // CREATE SINGLE SWATCH
    function createSwatchButton(variant, color, selectedColor) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "loop-color-swatch" + (color === selectedColor ? " active" : "");
        btn.dataset.color = color;

        btn.innerHTML = `
        <img src="${variant.featured_image.src}" alt="${color}" />
    `;

        btn.addEventListener("click", function () {
            selectColor(color);
        });

        return btn;
    }

    // HIDE ORIGINAL LABELS
    function hideOriginalLabels(fieldset) {
        fieldset.querySelectorAll("label").forEach((label) => {
            label.style.display = "none";
        });
    }

    // SELECT COLOR
    function selectColor(color) {
        const input = document.querySelector(`input[name="Color"][value="${color}"]`);
        if (!input) return;

        input.checked = true;
        input.dispatchEvent(new Event("change", {bubbles: true}));

        updateActiveState(color);
        updateHeaderValue(color);
    }
})();
