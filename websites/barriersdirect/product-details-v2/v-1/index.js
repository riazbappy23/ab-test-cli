(() => {
    // WAIT FOR ELEMENT POLL FUNCTION - FIXED VERSION
    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);

        if (timer <= 0) {
            console.log("waitForElem timed out for:", waitFor);
            return;
        }

        const conditionMet = isVariable ? typeof window[waitFor] !== "undefined" : elements.length >= minElements;

        if (conditionMet) {
            callback(elements);
            // IMPORTANT: Don't continue polling after callback executes
            return;
        } else {
            setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency, frequency), frequency);
        }
    };

    const getDeliveryDateInfo = () => `<div class="delivery-info">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7.5 1V4H12.6562L11.5938 1.59375C11.4375 1.25 11.0938 1 10.6875 1H7.5ZM7.5 5H6.5H1V12C1 12.5625 1.4375 13 2 13H12C12.5312 13 13 12.5625 13 12V5H7.5ZM6.5 4V1H3.28125C2.875 1 2.53125 1.25 2.375 1.59375L1.3125 4H6.5ZM12.5 1.1875L13.8125 4.125C13.9375 4.375 14 4.65625 14 4.9375V12C14 13.125 13.0938 14 12 14H2C0.875 14 0 13.125 0 12V4.9375C0 4.65625 0.03125 4.375 0.15625 4.125L1.46875 1.1875C1.78125 0.46875 2.5 0 3.28125 0H10.6875C11.4688 0 12.1875 0.46875 12.5 1.1875ZM10.3438 6.875L6.34375 10.875C6.15625 11.0625 5.8125 11.0625 5.625 10.875L3.625 8.875C3.4375 8.6875 3.4375 8.34375 3.625 8.15625C3.8125 7.96875 4.15625 7.96875 4.34375 8.15625L6 9.8125L9.625 6.15625C9.8125 5.96875 10.1562 5.96875 10.3438 6.15625C10.5312 6.34375 10.5312 6.6875 10.3438 6.875Z" fill="#02B67A"></path>
                                </svg>
                        <span>You could have it by:</span>
                        <span class="delivery-date">Mon 16 Feb</span>
                    </div>
                `;

    // Flag to prevent multiple executions
    let hasRun = false;

    // replace with new design
    const replaceSpan = () => {
        // Prevent multiple executions
        if (hasRun) {
            console.log("replaceSpan already executed, skipping");
            return;
        }
        hasRun = true;

        console.log("Starting replaceSpan...");

        // replace stock badge with product information link
        const stockBadge = document.querySelector(".product-details > div:nth-of-type(2) > div > span");

        if (stockBadge) {
            const link = document.createElement("a");
            link.href = "https://www.barriersdirect.co.uk/easy-lift-arm-barrier-2-8mtr-s-heavy-duty-assist-gas-strut-effortlessly-controlled-access-p56541-v2#description";
            link.textContent = "View All Products Information";
            link.className = "view_all_prouct_info";

            stockBadge.replaceWith(link);
            console.log("Stock badge replaced");
        }

        // hide links section
        const HighLowTitle = document.querySelector(".product-details > div:nth-of-type(3)");
        if (HighLowTitle) {
            HighLowTitle.style.display = "none";
        }

        // change amshopby options layout to flex
        const amshopbyOptions = document.querySelector(".product-details > div:nth-of-type(4)");
        if (amshopbyOptions) {
            amshopbyOptions.classList.add("flex");
            amshopbyOptions.classList.remove("mt-6");
        }

        // hide links section
        const linksSection = document.querySelector(".product-details > div:nth-of-type(5)");
        if (linksSection) {
            linksSection.style.display = "none";
        }

        // update price and quantity layout
        const priceAndQuantitySection = document.querySelector(".product-details > div:nth-of-type(6)");
        if (!priceAndQuantitySection) {
            return;
        }
        priceAndQuantitySection.classList.remove("bg-gray-light");

        if (!document.querySelector(".new-price-card")) {
            const newCard = document.createElement("div");
            newCard.className = "new-price-card";

            newCard.innerHTML = `
                <div class="price-card-header">
                    <div class="price-info">
                        <div class="current-total-label">Current Total</div>
                        <div class="price-main">£810.00 <span class="vat-label">Inc. VAT</span></div>
                        <div class="price-secondary">£675.00 <span class="vat-label">Excl. VAT</span></div>
                    </div>
                    <div class="guarantee-badge">
                      <img src="https://www.barriersdirect.co.uk/static/version1770743574/frontend/BarriersDirect/hyva/en_GB/images/product-v2/low-price-granted-small.png" alt="Low prices guaranteed" class="">
                    </div>
                </div>

                <div class="delivery-stock-info">
  ${getDeliveryDateInfo()}
                    <div class="stock-info">
                       <div class="stock-badge"> <span class="icon">✓</span></div>
                        <span class="stock-text">In stock</span>
                    </div>
                </div>
                
              
                <div class="quantity-pricing">
                    <div class="pricing-tier">
                        <span class="price">£810.00</span>
                        <span class="vat-label">Exc. VAT</span>
                        <span class="quantity">1 Item</span>
                    </div>
                    <div class="pricing-tier discount-tier">
                        <span class="price">£661.50</span>
                        <span class="vat-label">Exc. VAT</span>
                        <span class="discount-badge">Save 2%</span>
                        <span class="quantity">2+ Items</span>
                    </div>
                </div>
            `;

            // Insert at the beginning of priceAndQuantitySection
            priceAndQuantitySection.insertBefore(newCard, priceAndQuantitySection.firstChild);
        }

        // Hide original price card
        if (priceAndQuantitySection.children[1]) {
            priceAndQuantitySection.children[1].style.display = "none";
        }

        // Hide free delivery badge
        if (priceAndQuantitySection.children[2]) {
            priceAndQuantitySection.children[2].style.display = "none";
        }

        // hide quantity section
        const quantitySection = document.querySelector(".product-options-wrapper .fieldset");
        if (quantitySection) {
            const firstP = quantitySection.querySelector(":scope > p");
            const firstDiv = quantitySection.querySelector(":scope > div");

            if (firstP) firstP.style.display = "none";
            if (firstDiv) firstDiv.style.display = "none";
        }

        // hide checkbox
        const optionWrapper = document.querySelector(".product-options-wrapper .fieldset > div:nth-of-type(2)");

        if (optionWrapper) {
            const images = optionWrapper.querySelectorAll("img");
            if (images.length > 0) {
                images.forEach((img) => (img.style.display = "none"));
            }
        }

        // Current total card
        const currentTotalCard = document.querySelector(".product-details > div:nth-of-type(9)");
        if (currentTotalCard) {
            currentTotalCard.classList.remove("bg-dark", "text-white");
            currentTotalCard.classList.add("text-dark", "bg-[#F4F0EB]");
            const formattedPrice = document.querySelectorAll('.product-details [x-html*="getFormattedFinalPrice"]');
            const basePrice = document.querySelectorAll('.product-details [x-html*="getFormattedBasePrice"]');

            basePrice.forEach((el) => {
                const parent = el.closest(".mt-4");
                if (parent) parent.classList.remove("mt-4");
            });

            formattedPrice.forEach((el) => {
                el.classList.remove("bg-red", "px-3");
                el.classList.add("text-red");
            });
            basePrice.forEach((el) => {
                el.classList.remove("text-white", "mt-4");
                el.classList.add("text-black");
            });

            const oldDiv = document.querySelector(".product-details > div:nth-of-type(9) > div > div > div:nth-of-type(2)");

            if (oldDiv) {
                const newDiv = document.createElement("div");
                newDiv.innerHTML = getDeliveryDateInfo();

                oldDiv.replaceWith(newDiv);
            }
        }
    };

    console.log("Waiting for .product-info-main...");
    waitForElem(".product-info-main", replaceSpan);
})();
