(() => {
    // WAIT FOR ELEMENT POLL FUNCTION - FIXED VERSION
    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);

        if (timer <= 0) {
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

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    // ─── DELIVERY DATE OBSERVER ───────────────────────────────────────────────────

    const getDeliveryDateInfo = () => {
        const updatedDate = document.querySelector(".pdp-sticky-footer-new .delivery_date");
        return `<div class="delivery-info pdp-delivery-info-slot">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7.5 1V4H12.6562L11.5938 1.59375C11.4375 1.25 11.0938 1 10.6875 1H7.5ZM7.5 5H6.5H1V12C1 12.5625 1.4375 13 2 13H12C12.5312 13 13 12.5625 13 12V5H7.5ZM6.5 4V1H3.28125C2.875 1 2.53125 1.25 2.375 1.59375L1.3125 4H6.5ZM12.5 1.1875L13.8125 4.125C13.9375 4.375 14 4.65625 14 4.9375V12C14 13.125 13.0938 14 12 14H2C0.875 14 0 13.125 0 12V4.9375C0 4.65625 0.03125 4.375 0.15625 4.125L1.46875 1.1875C1.78125 0.46875 2.5 0 3.28125 0H10.6875C11.4688 0 12.1875 0.46875 12.5 1.1875ZM10.3438 6.875L6.34375 10.875C6.15625 11.0625 5.8125 11.0625 5.625 10.875L3.625 8.875C3.4375 8.6875 3.4375 8.34375 3.625 8.15625C3.8125 7.96875 4.15625 7.96875 4.34375 8.15625L6 9.8125L9.625 6.15625C9.8125 5.96875 10.1562 5.96875 10.3438 6.15625C10.5312 6.34375 10.5312 6.6875 10.3438 6.875Z" fill="#02B67A"></path>
                </svg>
                <span>You could have it by:</span>
                <span class="delivery-date">${updatedDate ? updatedDate.textContent : ""}</span>
            </div>`;
    };

    function observeDeliveryDateUpdate() {
        const deliveryDateEl = document.querySelector(".pdp-sticky-footer-new .delivery_date");
        if (!deliveryDateEl) return;

        const deliveryObserver = new MutationObserver(() => {
            const slots = Array.from(document.querySelectorAll(".pdp-delivery-info-slot"));
            slots.forEach((slot) => {
                slot.insertAdjacentHTML("beforebegin", getDeliveryDateInfo());
                slot.remove();
            });
        });

        deliveryObserver.observe(deliveryDateEl, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }

    const getNonRefundableBadge = () => `<div class="non-refundable-badge">
  <span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none" class="flex-shrink-0">
                    <path d="M1.0625 12.1562C1 12.25 1 12.3438 1 12.4375C1 12.75 1.25 13.0312 1.5625 13.0312H14.4062C14.7188 13.0312 15 12.75 15 12.4375C15 12.3438 14.9688 12.25 14.9062 12.1562L8.625 1.375C8.5 1.15625 8.25 1 8 1C7.71875 1 7.46875 1.15625 7.34375 1.375L1.0625 12.1562ZM0.1875 11.6562L6.46875 0.875C6.78125 0.34375 7.375 0 8 0C8.59375 0 9.1875 0.34375 9.5 0.875L15.7812 11.6562C15.9062 11.875 16 12.1562 16 12.4375C16 13.3125 15.2812 14 14.4062 14H1.5625C0.6875 14 0 13.3125 0 12.4375C0 12.1562 0.0625 11.875 0.1875 11.6562ZM8 4C8.25 4 8.5 4.25 8.5 4.5V8.5C8.5 8.78125 8.25 9 8 9C7.71875 9 7.5 8.78125 7.5 8.5V4.5C7.5 4.25 7.71875 4 8 4ZM7.25 11C7.25 10.5938 7.5625 10.25 8 10.25C8.40625 10.25 8.75 10.5938 8.75 11C8.75 11.4375 8.40625 11.75 8 11.75C7.5625 11.75 7.25 11.4375 7.25 11Z" fill="#E30613"></path>
                </svg></span>
   <span>Made to order and non refundable</span>
</div>
`;

    const getGreenCheck = () => `
    <div class="stock-green-check">
        <span class="icon">✓</span>
    </div>`;

    const getStockBadge = (text, textColor = "black") => `
    <div class="stock-info">
        ${getGreenCheck()}
        <span class="stock-text ${textColor}">${text}</span>
    </div>`;

    const getAllBadges = () => `
    <div class="stock-badge-wrapper">
        ${getStockBadge("In Stock")}
        ${getStockBadge("Express Delivery")}
        ${getStockBadge("Free Delivery in Great Britain")}
    </div>
`;

    const applyCartPosition = () => {
        const miniCart = document.querySelector(".pdp-sticky-footer-new");
        if (!miniCart) return;

        const whiteTextElements = miniCart.querySelectorAll(".text-white");

        if (isMobile()) {
            // Mobile: stick to bottom
            miniCart.classList.remove("top-0", "fixed", "left-0", "right-0");
            miniCart.classList.add("bottom-0", "sticky");
        } else {
            // Desktop: fix to top
            miniCart.classList.remove("bottom-0", "sticky");
            miniCart.classList.add("top-0", "fixed", "left-0", "right-0");
        }
        miniCart.classList.remove("bg-dark");
        miniCart.classList.add("bg-[#F4F0EB]");

        whiteTextElements.forEach((el) => {
            // Skip if it's inside a button (Add to Cart button)
            if (!el.closest("button")) {
                el.classList.remove("text-white");
            }
        });
    };

    function moveQtyNextToCart() {
        const qtyWrapper = document.querySelector('[x-data="initQtyField()"]');
        const addToCartBtn = document.querySelector("#product-addtocart-button");

        if (!qtyWrapper || !addToCartBtn) return;
        if (document.querySelector(".custom-cart-wrapper")) return;

        qtyWrapper.querySelectorAll(":scope >div").forEach((el) => {
            el.classList.remove("inline-block");
            el.classList.add("inline-flex");
        });

        const originalParent = addToCartBtn.parentNode;

        const wrapper = document.createElement("div");
        wrapper.className = "custom-cart-wrapper";

        wrapper.appendChild(qtyWrapper);
        wrapper.appendChild(addToCartBtn);

        originalParent.appendChild(wrapper);
    }

    function replaceGuaranteeBadges() {
        const guaranteeBadge = document.querySelector(".product-details > div:nth-of-type(10)");
        guaranteeBadge.classList.remove("flex", "justify-between", "gap-4", "flex-wrap");

        if (!guaranteeBadge) return;

        guaranteeBadge.innerHTML = `
        <div class="flex flex-row gap-4 mb-5">
    <div class="w-1/2 flex justify-start">
            <img src="https://www.barriersdirect.co.uk/static/version1770743574/frontend/BarriersDirect/hyva/en_GB/images/product-v2/largest-mobile.png" alt="Largest Range in the UK" class="">
    </div>
    <div class="w-1/2 flex justify-end">
            <img src="https://www.barriersdirect.co.uk/static/version1770743574/frontend/BarriersDirect/hyva/en_GB/images/product-v2/low-prices-mobile.png" alt="Low Prices Guaranteed" class="">
    </div>
</div>
    `;
    }

    const getRedirectToReviewSection = () => {
        return `
    <section id="productReviewsLink"
        class="border border-[#CCC6C6] flex flex-col cursor-pointer mt-2 bg-[#F4F0EB] hover:bg-[#E8E4D9]">

        <div class="flex justify-between">
            <div class="w-full flex justify-between items-center px-8 py-8">
                <div class="flex md:flex-row items-center gap-4 w-full justify-between mr-5">
                    <h2 class="font-tondo font-bold text-dark text-[18px]">
                        Product Reviews
                    </h2>
                </div>

                <div class="rating-container hidden lg:block flex-shrink-0"></div>

                <div class="ml-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                        <path d="M6.91406 17.2266L0.351562 10.3516C0 9.96094 0 9.375 0.390625 9.02344C0.78125 8.67188 1.36719 8.67188 1.71875 9.0625L6.67969 14.2578V0.9375C6.67969 0.429688 7.07031 0 7.61719 0C8.125 0 8.55469 0.429688 8.55469 0.9375V14.2578L13.4766 9.0625C13.8281 8.67188 14.4531 8.67188 14.8047 9.02344C15.1953 9.375 15.1953 9.96094 14.8438 10.3516L8.28125 17.2266C8.08594 17.4219 7.85156 17.5 7.61719 17.5C7.34375 17.5 7.10938 17.4219 6.91406 17.2266Z" fill="#E30614"></path>
                    </svg>
                </div>
            </div>
        </div>
    </section>
    `;
    };

    const getReviewContent = () => {
        return `

            <!-- Review Text -->
            <p class="text-[#2B2B2B] text-[15px] leading-[26px] font-normal mb-6">
                "I recently ordered bollards from this company and I'm very impressed.
                The ordering process was straightforward and hassle-free, making it easy to select exactly what I needed.
                Delivery was prompt, arriving well within the expected timeframe.
                The quality of the bollards is excellent, and they were packaged securely.
                Overall, a great experience from start to finish—I would happily recommend this company to anyone needing reliable bollard suppliers.
                We look forward to using them again in the near future."
            </p>

            <!-- Reviewer Name -->
            <p class="font-semibold text-[#1A1A1A] text-[14px] mb-4">
                KC
            </p>

            <!-- Reviews Link -->

            <p class="read-more-text">
    <a href="https://uk.trustpilot.com/review/www.barriersdirect.co.uk?stars=5"
       target="_blank"
       rel="noopener noreferrer"
       >
        Read Our 1,000+ Reviews
    </a>
</p>
    `;
    };

    function createMiniCartTopSection(miniCartProductInfo) {
        const productImage = document.querySelector(".gallery-container-main-image img");
        const imgSrc = productImage ? productImage.src : "";
        const imgAlt = productImage ? productImage.alt : "Product Image";

        const productTitle = document.querySelector(".product-details h1");

        const wrapper = document.createElement("div");
        wrapper.className = "flex flex-row items-center sm:items-start gap-4 w-full pdp-sticky-footer-new-body px-4 py-3";

        const imageCol = document.createElement("div");
        imageCol.className = "flex-shrink-0 mini-cart-product-image hidden sm:block";
        imageCol.innerHTML = `
        <img 
            src="${imgSrc}" 
            alt="${imgAlt}" 
            class="w-[56px] h-[56px] object-contain"
        />
    `;

        const rightCol = document.createElement("div");
        rightCol.className = "flex flex-col flex-1 min-w-0 pdp-sticky-footer-new-right-col";

        const newTitle = document.createElement("h1");
        newTitle.className = "text-[#252525] font-tondo text-[14px] font-bold leading-[20px] line-clamp-2 mb-1 mx-w-[60%] hidden sm:block";
        newTitle.textContent = productTitle ? productTitle.textContent : "";

        rightCol.appendChild(newTitle);

        // Insert wrapper into the DOM BEFORE moving miniCartProductInfo
        miniCartProductInfo.parentNode.insertBefore(wrapper, miniCartProductInfo);

        rightCol.appendChild(miniCartProductInfo);
        wrapper.appendChild(imageCol);
        wrapper.appendChild(rightCol);
    }

    function createMiniCartFooterSection() {
        const footerSection = document.createElement("div");
        footerSection.className = "border-t border-gray-200 mt-3 pdp-mini-cart-footer";

        const container = document.createElement("div");
        container.className = "max-w-[1320px] mx-auto text-[#b9b9b9] text-[14px] font-normal";

        const flexWrapper = document.createElement("div");
        flexWrapper.className = "flex flex-col lg:flex-row gap-2 justify-between items-center pt-2";

        // Get original accordion redirect URL
        const accordionRedirects = document.querySelector('.product-info-main > section:nth-of-type(1) [x-data="productTabs"]');
        accordionRedirects.classList.remove("mb-2", "p-4");

        // Left side
        const leftSide = document.createElement("div");
        leftSide.className = "flex flex-col lg:flex-row gap-2";

        if (accordionRedirects) {
            leftSide.appendChild(accordionRedirects);
        }

        // Right side (rating)
        const originalRating = document.querySelector(".product-details .rating-summary");
        const rightSide = document.createElement("div");
        rightSide.className = "flex";

        if (originalRating) {
            const clonedRating = originalRating.cloneNode(true);
            rightSide.appendChild(clonedRating);
        }

        flexWrapper.appendChild(leftSide);
        flexWrapper.appendChild(rightSide);
        container.appendChild(flexWrapper);
        footerSection.appendChild(container);

        return footerSection;
    }

    // Flag to prevent multiple executions
    let hasRun = false;

    // replace with new design
    const replaceSpan = () => {
        // Prevent multiple executions
        if (hasRun) {
            return;
        }
        hasRun = true;
        // replace stock badge with product information link
        const stockBadge = document.querySelector(".product-details > div:nth-of-type(2) > div > span");

        if (stockBadge) {
            const link = document.createElement("a");
            link.href = "https://www.barriersdirect.co.uk/easy-lift-arm-barrier-2-8mtr-s-heavy-duty-assist-gas-strut-effortlessly-controlled-access-p56541-v2#description";
            link.textContent = "View All Products Information";
            link.className = "view_all_prouct_info";

            stockBadge.replaceWith(link);
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
                     ${getStockBadge("faded")}
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

        // Hide original price cards-
        if (priceAndQuantitySection.children[1]) {
            priceAndQuantitySection.children[1].style.display = "none";
        }

        // Hide free delivery badge
        if (priceAndQuantitySection.children[2]) {
            priceAndQuantitySection.children[2].style.display = "none";
        }

        // hide quantity section
        const qtyWrapper = document.querySelector('[x-data="initQtyField()"]');

        if (qtyWrapper) {
            // hide heading
            const heading = qtyWrapper.querySelector("h4");
            if (heading) heading.style.display = "none";
            qtyWrapper.classList.remove("bg-black", "py-[7px]", "px-3");
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
            currentTotalCard.classList.add("new-product-total-card");
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

            // product delivery warning
            const oldDiv = document.querySelector(".product-details > div:nth-of-type(9) > div > div > div:nth-of-type(2)");

            if (oldDiv) {
                const newDiv = document.createElement("div");
                newDiv.innerHTML = `
                <div class="product-total-delivery-info">
                ${getNonRefundableBadge()}
                ${getDeliveryDateInfo()}
                </div>`;

                oldDiv.replaceWith(newDiv);
            }

            // add to cart section
            moveQtyNextToCart();

            // replace stock badge with all badges
            const oldBadge = document.querySelector(".product-details > div:nth-of-type(9) > span");
            if (oldBadge) {
                oldBadge.classList.add("text-red");

                const badgesWrapper = document.createElement("div");
                badgesWrapper.class = "additional-badges";
                badgesWrapper.innerHTML = getAllBadges();

                oldBadge.replaceWith(badgesWrapper);
            }
        }

        // Guarantee badge
        replaceGuaranteeBadges();

        // reposition accordion and review section
        if (!isMobile()) {
            const mediaSection = document.querySelector(".product-info-main > section:nth-of-type(1) > div > div > div");
            const accordionSection = document.querySelector(".product-info-main > section:nth-of-type(3)");
            const reviewsSection = document.querySelector(".product-details > div:nth-of-type(12)");
            const customerReviewList = document.querySelector("#customer-review-list");
            const rating = reviewsSection.querySelector(":scope > div > span");
            const reviewContent = reviewsSection.querySelector(":scope > p");
            const accordionWarpperBody = accordionSection.querySelector(":scope > div");
            const accordionContainer = accordionSection.querySelector("div");

            accordionContainer.querySelectorAll("section").forEach((el) => {
                el.classList.add("bg-[#F4F0EB]");
            });

            if (mediaSection && accordionSection && reviewsSection) {
                accordionSection.classList.remove("container");
                accordionWarpperBody.classList.remove("pb-10", "lg:pb-[72px]");
                rating.style.display = "none";
                reviewContent.innerHTML = getReviewContent();
                mediaSection.appendChild(accordionSection);

                mediaSection.insertAdjacentHTML("beforeend", getRedirectToReviewSection());

                const originalRating = document.querySelector(".product-details .rating-summary");
                const ratingCard = document.querySelector("#productReviewsLink");
                const ratingContainer = document.querySelector("#productReviewsLink .rating-container");

                if (originalRating && ratingContainer) {
                    const clonedRating = originalRating.cloneNode(true);
                    ratingContainer.appendChild(clonedRating);

                    // Scroll to the MOVED reviews section directly
                    ratingCard.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const offset = 10;
                        const elementPosition = customerReviewList.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                        });
                    });
                }

                mediaSection.appendChild(reviewsSection);
            }
        }

        // move mini cart section and show after scroll
        const miniCart = document.querySelector(".pdp-sticky-footer-new");
        if (miniCart) {
            // Hide initially
            miniCart.style.display = "none";

            // Show after scrolling down
            let scrollThreshold = 500;
            window.addEventListener("scroll", () => {
                if (window.pageYOffset > scrollThreshold) {
                    miniCart.style.display = "block";
                } else {
                    miniCart.style.display = "none";
                }
            });

            // Apply immediately on load
            applyCartPosition();

            // Re-apply instantly on viewport resize (pc <-> mobile switching)
            const resizeObserver = new ResizeObserver(() => {
                applyCartPosition();
            });
            resizeObserver.observe(document.body);

            // mini cart main div
            const miniCartProductInfo = document.querySelector(".pdp-sticky-footer-new > div:nth-of-type(1)");
            createMiniCartTopSection(miniCartProductInfo);

            // ✅ Start observing delivery date after mini cart is fully built
            observeDeliveryDateUpdate();

            // hide some desing class for mini cart
            const firstDiv = document.querySelector(".pdp-sticky-footer-new-right-col > div");
            const thirdDiv = document.querySelector(".pdp-sticky-footer-new-right-col > div > div:nth-of-type(3)");

            firstDiv?.classList.remove("m-auto");
            thirdDiv?.classList.add("justify-between");

            // update design in price section
            const productTotal = miniCart.querySelector(".price-div-new");
            productTotal.querySelector(":scope > h1").style.display = "none";
            const productPrice = productTotal.querySelector(":scope > div");
            productPrice.classList.remove("md:flex-col");
            productPrice.classList.add("items-center", "gap-2");
            const baseDiv = productPrice.querySelector("div:nth-of-type(2)");
            baseDiv.classList.remove("mt-2", "md:mt-3");

            // change formatted price color
            const formattedDiv = productPrice.querySelector("div:nth-of-type(1)");
            formattedDiv.querySelector(":scope > div > p").classList.add("text-red");
            const formattedPrice = document.querySelectorAll('.pdp-sticky-footer-new [x-html*="getFormattedFinalPrice"]');
            const basePrice = document.querySelectorAll('.pdp-sticky-footer-new [x-html*="getFormattedBasePrice"]');

            formattedPrice.forEach((el) => {
                el.classList.remove("bg-red", "px-3");
                el.classList.add("text-red");
            });
            basePrice.forEach((el) => {
                el.classList.remove("text-white", "mt-4");
                el.classList.add("text-black");
            });

            // add product delivery info
            const notRefundableBadge = document.querySelector(".pdp-sticky-footer-new-body > div:nth-of-type(2) > div > div > p");
            if (notRefundableBadge) {
                notRefundableBadge.innerHTML = `<div class="flex flex-col lg:flex-row gap-2">${getDeliveryDateInfo()} ${getNonRefundableBadge()}</div>`;
            }

            // hide old delivery date and warning
            const oldDeliveryDateDiv = document.querySelector(".pdp-sticky-footer-new-body > div:nth-of-type(2) > div > div > p");
            if (oldDeliveryDateDiv) {
                oldDeliveryDateDiv.style.display = "none";
            }

            // hide date
            const dateDiv = document.querySelector(".pdp-sticky-footer-new-body > div:nth-of-type(2) > div > div:nth-of-type(2)");
            if (dateDiv) {
                dateDiv.style.display = "none";
            }

            // mini cart footer section
            const footerSection = createMiniCartFooterSection();
            miniCart.appendChild(footerSection);
        }
    };

    waitForElem(".product-info-main", () => {
        replaceSpan();
        waitForElem("#product-addtocart-button", moveQtyNextToCart);
    });
})();
