(() => {
    const css = `:root {
    --warning-red: rgb(227 6 20) !important;
}

.view_all_prouct_info {
    color: var(--warning-red) !important;
    text-decoration: underline !important;
}

.amshopby-option-link-up {
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
}

.delivery-stock-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
}

.stock-green-check {
    background: #00a651;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.delivery-info,
.stock-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    .icon {
        font-size: 10px;
        font-weight: 700;
        color: white;
    }
    .delivery-date {
        color: #00a651;
        font-weight: 600;
    }
    .stock-text {
        font-weight: 600;
        &.black {
            color: #000;
        }
        &.faded {
            color: #666;
        }
    }
}

.new-price-card {
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    .price-card-header {
        display: flex;
        justify-content: space-between;
        align-items: end;
        background: #fff;
        .price-info {
            line-height: normal !important;
            .current-total-label {
                font-size: 14px;
                font-weight: 700;
                color: #000;
                margin-bottom: 8px;
            }
            .price-main {
                font-size: 24px;
                font-weight: 700;
                color: #e60000;
                .vat-label {
                    font-size: 14px;
                    font-weight: 400;
                    color: #666;
                }
            }

            .price-secondary {
                font-size: 24px;
                font-weight: 700;
                color: #000;
                .vat-label {
                    font-size: 14px;
                    font-weight: 400;
                    color: #666;
                }
            }
        }
        .guarantee-badge {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }

    .quantity-pricing {
        padding: 16px 20px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        .pricing-tier {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;

            &:last-child {
                border-top: 1px solid #e0e0e0;
            }

            .price {
                font-size: 20px;
                font-weight: 700;
                color: #000;
            }

            .vat-label {
                font-size: 14px;
                color: #666;
            }

            .quantity {
                margin-left: auto;
                font-weight: 600;
                color: #000;
            }

            &.discount-tier {
                .discount-badge {
                    background: #e60000;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 700;
                }
            }
        }
    }
}

.non-refundable-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--warning-red);
    font-size: 13px;
    font-weight: 700;
}

.new-product-total-card {
    color: black !important;
    background: #f4f0eb !important;
    .custom-cart-wrapper {
        display: flex;
        gap: 15px;
        align-items: center;
        width: 100%;

        #product-addtocart-button {
            flex: 1;
            width: 100%;
        }

        [x-data="initQtyField()"] {
            width: 140px;

            h4 {
                display: none;
            }
        }
    }
}

.stock-badge-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.read-more-text {
    color: var(--warning-red);
    text-decoration: underline;
    font-size: 1rem;
    line-height: 1.5rem;
}

.new-pdp-gallery-image-wrapper {
    aspect-ratio: 1 / 1;
}

.new-pdp-gallery-image-wrapper img {
    height: 100%;
    object-fit: cover;
}

// Hide view all product info link if needed
.view_all_prouct_info {
    display: inline-block;
    color: #0066c0;
    text-decoration: none;
    font-size: 14px;

    &:hover {
        text-decoration: underline;
    }
}
@media screen and (max-width: 768px) {
    .pdp-mini-cart-footer {
        display: none;
    }
}
`;

    if (!document.getElementById("barriersdirect-new-pdp-page-style")) {
        const style = document.createElement("style");
        style.id = "barriersdirect-new-pdp-page-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // Helper to poll for element or variable
    const waitForElement = (selector, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        if (timer <= 0) return;

        const elements = isVariable ? window[selector] : document.querySelectorAll(selector);
        const conditionMet = isVariable ? typeof elements !== "undefined" : elements.length >= minElements;

        if (conditionMet) {
            callback(elements);
            return;
        }

        setTimeout(() => waitForElement(selector, callback, minElements, isVariable, timer - frequency, frequency), frequency);
    };

    // Check if mobile viewport
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    // Create delivery date HTML block
    const getDeliveryDateInfo = () => {
        const updatedDate = document.querySelector(".pdp-sticky-footer-new .delivery_date");
        return `<div class="delivery-info pdp-delivery-info-slot">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7.5 1V4H12.6562L11.5938 1.59375C11.4375 1.25 11.0938 1 10.6875 1H7.5ZM7.5 5H6.5H1V12C1 12.5625 1.4375 13 2 13H12C12.5312 13 13 12.5625 13 12V5H7.5ZM6.5 4V1H3.28125C2.875 1 2.53125 1.25 2.375 1.59375L1.3125 4H6.5ZM12.5 1.1875L13.8125 4.125C13.9375 4.375 14 4.65625 14 4.9375V12C14 13.125 13.0938 14 12 14H2C0.875 14 0 13.125 0 12V4.9375C0 4.65625 0.03125 4.375 0.15625 4.125L1.46875 1.1875C1.78125 0.46875 2.5 0 3.28125 0H10.6875C11.4688 0 12.1875 0.46875 12.5 1.1875ZM10.3438 6.875L6.34375 10.875C6.15625 11.0625 5.8125 11.0625 5.625 10.875L3.625 8.875C3.4375 8.6875 3.4375 8.34375 3.625 8.15625C3.8125 7.96875 4.15625 7.96875 4.34375 8.15625L6 9.8125L9.625 6.15625C9.8125 5.96875 10.1562 5.96875 10.3438 6.15625C10.5312 6.34375 10.5312 6.6875 10.3438 6.875Z" fill="#02B67A"></path>
                </svg>
                <span class="hidden md:block">You could have it by:</span>
                <span class="md:hidden">Delivered by:</span>
                <span class="delivery-date">${updatedDate ? updatedDate.textContent : ""}</span>
            </div>`;
    };

    // Observe mutations on delivery date and update slots
    const observeDeliveryDateUpdate = () => {
        const deliveryDateEl = document.querySelector(".pdp-sticky-footer-new .delivery_date");
        if (!deliveryDateEl) return;

        const deliveryObserver = new MutationObserver(() => {
            const slots = Array.from(document.querySelectorAll(".pdp-delivery-info-slot"));
            slots.forEach((slot) => {
                slot.insertAdjacentHTML("beforebegin", getDeliveryDateInfo());
                slot.remove();
            });
        });

        deliveryObserver.observe(deliveryDateEl, {childList: true, subtree: true, characterData: true});
    };

    // Create non-refundable badge HTML
    const getNonRefundableBadge = () => `<div class="non-refundable-badge">
        <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none" class="flex-shrink-0">
            <path d="M1.0625 12.1562C1 12.25 1 12.3438 1 12.4375C1 12.75 1.25 13.0312 1.5625 13.0312H14.4062C14.7188 13.0312 15 12.75 15 12.4375C15 12.3438 14.9688 12.25 14.9062 12.1562L8.625 1.375C8.5 1.15625 8.25 1 8 1C7.71875 1 7.46875 1.15625 7.34375 1.375L1.0625 12.1562ZM0.1875 11.6562L6.46875 0.875C6.78125 0.34375 7.375 0 8 0C8.59375 0 9.1875 0.34375 9.5 0.875L15.7812 11.6562C15.9062 11.875 16 12.1562 16 12.4375C16 13.3125 15.2812 14 14.4062 14H1.5625C0.6875 14 0 13.3125 0 12.4375C0 12.1562 0.0625 11.875 0.1875 11.6562ZM8 4C8.25 4 8.5 4.25 8.5 4.5V8.5C8.5 8.78125 8.25 9 8 9C7.71875 9 7.5 8.78125 7.5 8.5V4.5C7.5 4.25 7.71875 4 8 4ZM7.25 11C7.25 10.5938 7.5625 10.25 8 10.25C8.40625 10.25 8.75 10.5938 8.75 11C8.75 11.4375 8.40625 11.75 8 11.75C7.5625 11.75 7.25 11.4375 7.25 11Z" fill="#E30613"></path>
        </svg></span>
        <span></span>
        <span class="hidden md:block">Made to order and non refundable</span>
                <span class="md:hidden">Non refundable</span>
    </div>`;

    // Create green check icon HTML
    const getGreenCheck = () => `
        <div class="stock-green-check">
            <span class="icon">✓</span>
        </div>`;

    // Create stock badge HTML
    const getStockBadge = (text, textColor = "black") => `
        <div class="stock-info">
            ${getGreenCheck()}
            <span class="stock-text ${textColor}">${text}</span>
        </div>`;

    // Create all stock badges wrapper HTML
    const getAllBadges = () => `
        <div class="stock-badge-wrapper">
            ${getStockBadge("In Stock")}
            ${getStockBadge("Express Delivery")}
            ${getStockBadge("Free Delivery in Great Britain")}
        </div>`;

    // Update mini-cart position and styles based on viewport
    const applyCartPosition = () => {
        const miniCart = document.querySelector(".pdp-sticky-footer-new");
        if (!miniCart) return;

        const whiteTextElements = miniCart.querySelectorAll(".text-white");

        if (isMobile()) {
            miniCart.classList.remove("top-0", "fixed", "left-0", "right-0");
            miniCart.classList.add("bottom-0", "sticky");
        } else {
            miniCart.classList.remove("bottom-0", "sticky");
            miniCart.classList.add("top-0", "fixed", "left-0", "right-0");
        }
        miniCart.classList.remove("bg-dark");
        miniCart.classList.add("bg-[#F4F0EB]");

        whiteTextElements.forEach((el) => {
            if (!el.closest("button")) {
                el.classList.remove("text-white");
            }
        });
    };

    // Move quantity field next to add-to-cart button
    const moveQtyNextToCart = () => {
        const qtyWrapper = document.querySelector('[x-data="initQtyField()"]');
        const addToCartBtn = document.querySelector("#product-addtocart-button");

        if (!qtyWrapper || !addToCartBtn || document.querySelector(".custom-cart-wrapper")) return;

        qtyWrapper.querySelectorAll(":scope > div").forEach((el) => {
            el.classList.remove("inline-block");
            el.classList.add("inline-flex");
        });

        const originalParent = addToCartBtn.parentNode;
        const wrapper = document.createElement("div");
        wrapper.className = "custom-cart-wrapper";

        wrapper.appendChild(qtyWrapper);
        wrapper.appendChild(addToCartBtn);
        originalParent.appendChild(wrapper);
    };

    // Replace guarantee badges with new images
    const replaceGuaranteeBadges = () => {
        const guaranteeBadge = document.querySelector(".product-details > div:nth-of-type(10)");
        if (!guaranteeBadge) return;

        guaranteeBadge.classList.remove("flex", "justify-between", "gap-4", "flex-wrap");

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
    };

    // Get HTML for redirect to reviews section
    const getRedirectToReviewSection = () => `
        <section id="productReviewsLink" class="border border-[#CCC6C6] flex flex-col cursor-pointer mt-2 bg-[#F4F0EB] hover:bg-[#E8E4D9]">
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
        </section>`;

    // Get HTML for review content
    const getReviewContent = () => `
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
                   rel="noopener noreferrer">
                    Read Our 1,000+ Reviews
                </a>
            </p>`;

    // Create top section for mini-cart
    const createMiniCartTopSection = (miniCartProductInfo) => {
        const productImage = document.querySelector(".gallery-container-main-image img");
        const imgSrc = productImage ? productImage.src : "";
        const imgAlt = productImage ? productImage.alt : "Product Image";

        const productTitle = document.querySelector(".product-details h1");

        const wrapper = document.createElement("div");
        wrapper.className = "flex flex-row items-center sm:items-start gap-4 w-full pdp-sticky-footer-new-body px-4 py-3";

        const imageCol = document.createElement("div");
        imageCol.className = "flex-shrink-0 mini-cart-product-image hidden md:block";
        imageCol.innerHTML = `
            <img src="${imgSrc}" alt="${imgAlt}" class="w-[56px] h-[56px] object-contain"/>
        `;

        const rightCol = document.createElement("div");
        rightCol.className = "flex flex-col flex-1 min-w-0 pdp-sticky-footer-new-right-col";

        const newTitle = document.createElement("h1");
        newTitle.className = "text-[#252525] font-tondo text-[14px] font-bold leading-[20px] line-clamp-2 mb-1 mx-w-[60%] hidden md:block";
        newTitle.textContent = productTitle ? productTitle.textContent : "";

        rightCol.appendChild(newTitle);
        miniCartProductInfo.parentNode.insertBefore(wrapper, miniCartProductInfo);
        rightCol.appendChild(miniCartProductInfo);
        wrapper.appendChild(imageCol);
        wrapper.appendChild(rightCol);
    };

    // Create footer section for mini-cart
    const createMiniCartFooterSection = () => {
        const footerSection = document.createElement("div");
        footerSection.className = "border-t border-gray-200 mt-3 pdp-mini-cart-footer";

        const container = document.createElement("div");
        container.className = "max-w-[1320px] mx-auto text-[#b9b9b9] text-[14px] font-normal";

        const flexWrapper = document.createElement("div");
        flexWrapper.className = "flex flex-col lg:flex-row gap-2 justify-between items-center pt-2";

        const accordionRedirects = document.querySelector('.product-info-main > section:nth-of-type(1) [x-data="productTabs"]');
        if (accordionRedirects) {
            accordionRedirects.classList.remove("mb-2", "p-4");
        }

        const leftSide = document.createElement("div");
        leftSide.className = "flex flex-col lg:flex-row gap-2";
        if (accordionRedirects) leftSide.appendChild(accordionRedirects);

        const originalRating = document.querySelector(".product-details .rating-summary");
        const rightSide = document.createElement("div");
        rightSide.className = "flex";
        if (originalRating) rightSide.appendChild(originalRating.cloneNode(true));

        flexWrapper.appendChild(leftSide);
        flexWrapper.appendChild(rightSide);
        container.appendChild(flexWrapper);
        footerSection.appendChild(container);

        return footerSection;
    };

    // Replace stock badge with product info link
    const replaceStockBadgeWithLink = () => {
        const stockBadge = document.querySelector(".product-details > div:nth-of-type(2) > div > span");
        if (!stockBadge) return;

        const link = document.createElement("a");
        link.href = "https://www.barriersdirect.co.uk/easy-lift-arm-barrier-2-8mtr-s-heavy-duty-assist-gas-strut-effortlessly-controlled-access-p56541-v2#description";
        link.textContent = "View All Products Information";
        link.className = "view_all_prouct_info";

        stockBadge.replaceWith(link);
    };

    // Hide high/low title section
    const hideHighLowTitle = () => {
        const highLowTitle = document.querySelector(".product-details > div:nth-of-type(3)");
        if (highLowTitle) highLowTitle.style.display = "none";
    };

    // Update amshopby options layout
    const updateAmshopbyOptionsLayout = () => {
        const amshopbyOptions = document.querySelector(".product-details > div:nth-of-type(4)");
        if (amshopbyOptions) {
            amshopbyOptions.classList.add("flex");
            amshopbyOptions.classList.remove("mt-6");
        }
    };

    // Hide links section
    const hideLinksSection = () => {
        const linksSection = document.querySelector(".product-details > div:nth-of-type(5)");
        if (linksSection) linksSection.style.display = "none";
    };

    // Enhance price and quantity section
    const enhancePriceAndQuantitySection = () => {
        const section = document.querySelector(".product-details > div:nth-of-type(6)");
        if (!section) return;

        section.classList.remove("bg-gray-light");

        if (document.querySelector(".new-price-card")) return;

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
                ${getStockBadge("In sctock", "faded")}
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

        section.insertBefore(newCard, section.firstChild);

        if (section.children[1]) section.children[1].style.display = "none";
        if (section.children[2]) section.children[2].style.display = "none";
    };

    // Hide quantity heading and remove classes
    const hideQuantityHeading = () => {
        const qtyWrapper = document.querySelector('[x-data="initQtyField()"]');
        if (!qtyWrapper) return;

        const heading = qtyWrapper.querySelector("h4");
        if (heading) heading.style.display = "none";

        qtyWrapper.classList.remove("bg-black", "py-[7px]", "px-3");
    };

    // Hide checkbox images in options
    const hideOptionImages = () => {
        const optionWrapper = document.querySelector(".product-options-wrapper .fieldset > div:nth-of-type(2)");
        if (!optionWrapper) return;

        const images = optionWrapper.querySelectorAll("img");
        images.forEach((img) => (img.style.display = "none"));
    };

    // Enhance current total card
    const enhanceCurrentTotalCard = () => {
        const currentTotalCard = document.querySelector(".product-details > div:nth-of-type(9)");
        if (!currentTotalCard) return;

        currentTotalCard.classList.remove("bg-dark", "text-white");
        currentTotalCard.classList.add("new-product-total-card");

        const formattedPrices = document.querySelectorAll('.product-details [x-html*="getFormattedFinalPrice"]');
        const basePrices = document.querySelectorAll('.product-details [x-html*="getFormattedBasePrice"]');

        basePrices.forEach((el) => {
            const parent = el.closest(".mt-4");
            if (parent) parent.classList.remove("mt-4");
        });

        formattedPrices.forEach((el) => {
            el.classList.remove("bg-red", "px-3");
            el.classList.add("text-red");
        });

        basePrices.forEach((el) => {
            el.classList.remove("text-white", "mt-4");
            el.classList.add("text-black");
        });

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

        moveQtyNextToCart();

        const oldBadge = document.querySelector(".product-details > div:nth-of-type(9) > span");
        if (oldBadge) {
            oldBadge.classList.add("text-red");

            const badgesWrapper = document.createElement("div");
            badgesWrapper.className = "additional-badges";
            badgesWrapper.innerHTML = getAllBadges();
            oldBadge.replaceWith(badgesWrapper);
        }
    };

    // Reposition accordion and reviews for desktop
    const repositionAccordionAndReviewsForDesktop = () => {
        if (isMobile()) return;

        const mediaSection = document.querySelector(".product-info-main > section:nth-of-type(1) > div > div > div");
        const accordionSection = document.querySelector(".product-info-main > section:nth-of-type(3)");
        const reviewsSection = document.querySelector(".product-details > div:nth-of-type(12)");
        const customerReviewList = document.querySelector("#customer-review-list");

        if (!mediaSection || !accordionSection || !reviewsSection) return;

        const rating = reviewsSection.querySelector(":scope > div > span");
        const reviewContent = reviewsSection.querySelector(":scope > p");
        const accordionWrapperBody = accordionSection.querySelector(":scope > div");
        const accordionContainer = accordionSection.querySelector("div");

        accordionContainer.querySelectorAll("section").forEach((el) => el.classList.add("bg-[#F4F0EB]"));

        accordionSection.classList.remove("container");
        accordionWrapperBody.classList.remove("pb-10", "lg:pb-[72px]");
        if (rating) rating.style.display = "none";
        reviewContent.innerHTML = getReviewContent();

        mediaSection.appendChild(accordionSection);
        mediaSection.insertAdjacentHTML("beforeend", getRedirectToReviewSection());

        const originalRating = document.querySelector(".product-details .rating-summary");
        const ratingCard = document.querySelector("#productReviewsLink");
        const ratingContainer = document.querySelector("#productReviewsLink .rating-container");

        if (originalRating && ratingContainer) {
            ratingContainer.appendChild(originalRating.cloneNode(true));

            ratingCard.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const offset = 200;
                const elementPosition = customerReviewList.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({top: offsetPosition, behavior: "smooth"});
            });
        }

        mediaSection.appendChild(reviewsSection);
    };

    // Enhance mini-cart features
    const enhanceMiniCart = () => {
        const miniCart = document.querySelector(".pdp-sticky-footer-new");
        if (!miniCart) return;

        miniCart.style.display = "none";

        const scrollThreshold = 500;
        window.addEventListener("scroll", () => {
            miniCart.style.display = window.pageYOffset > scrollThreshold ? "block" : "none";
        });

        applyCartPosition();

        const resizeObserver = new ResizeObserver(applyCartPosition);
        resizeObserver.observe(document.body);

        const miniCartProductInfo = document.querySelector(".pdp-sticky-footer-new > div:nth-of-type(1)");
        if (miniCartProductInfo) createMiniCartTopSection(miniCartProductInfo);

        observeDeliveryDateUpdate();

        const firstDiv = document.querySelector(".pdp-sticky-footer-new-right-col > div");
        if (firstDiv) firstDiv.classList.remove("m-auto");

        const thirdDiv = document.querySelector(".pdp-sticky-footer-new-right-col > div > div:nth-of-type(3)");
        if (thirdDiv) thirdDiv.classList.add("justify-between");

        const productTotal = miniCart.querySelector(".price-div-new");
        if (productTotal) {
            productTotal.querySelector(":scope > h1").style.display = "none";

            const productPrice = productTotal.querySelector(":scope > div");
            productPrice.classList.remove("md:flex-col");
            productPrice.classList.add("items-center", "gap-2");

            const baseDiv = productPrice.querySelector("div:nth-of-type(2)");
            baseDiv.classList.remove("mt-2", "md:mt-3");

            const formattedDiv = productPrice.querySelector("div:nth-of-type(1)");
            formattedDiv.querySelector(":scope > div > p").classList.add("text-red");
        }

        const formattedPrices = document.querySelectorAll('.pdp-sticky-footer-new [x-html*="getFormattedFinalPrice"]');
        formattedPrices.forEach((el) => {
            el.classList.remove("bg-red", "px-3");
            el.classList.add("text-red");
        });

        const basePrices = document.querySelectorAll('.pdp-sticky-footer-new [x-html*="getFormattedBasePrice"]');
        basePrices.forEach((el) => {
            el.classList.remove("text-white", "mt-4");
            el.classList.add("text-black");
        });

        const notRefundableBadge = document.querySelector(".pdp-sticky-footer-new-body > div:nth-of-type(2) > div > div > p");
        if (notRefundableBadge) {
            notRefundableBadge.innerHTML = `<div class="flex flex-col lg:flex-row gap-2">${getDeliveryDateInfo()} ${getNonRefundableBadge()}</div>`;
        }

        const oldDeliveryDateDiv = document.querySelector(".pdp-sticky-footer-new-body > div:nth-of-type(2) > div > div > p");
        if (oldDeliveryDateDiv) oldDeliveryDateDiv.style.display = "none";

        const dateDiv = document.querySelector(".pdp-sticky-footer-new-body > div:nth-of-type(2) > div > div:nth-of-type(2)");
        if (dateDiv) dateDiv.style.display = "none";

        const footerSection = createMiniCartFooterSection();
        miniCart.appendChild(footerSection);
    };

    // add class to gallery image
    const addGalleryImageClass = () => {
        document.querySelectorAll(".gallery-container .gallery-container-2 img").forEach((img) => {
            img.closest("div").classList.add("new-pdp-gallery-image-wrapper");
        });
    };

    // Main replacement function with execution guard
    let hasRun = false;
    const replacePdp = () => {
        if (hasRun) return;
        hasRun = true;

        replaceStockBadgeWithLink();
        hideHighLowTitle();
        updateAmshopbyOptionsLayout();
        hideLinksSection();
        enhancePriceAndQuantitySection();
        hideQuantityHeading();
        hideOptionImages();
        enhanceCurrentTotalCard();
        replaceGuaranteeBadges();
        repositionAccordionAndReviewsForDesktop();
        enhanceMiniCart();
        moveQtyNextToCart()
        addGalleryImageClass();
    };

    // Entry point
    waitForElement(".product-info-main", () => {
        replacePdp();
    });
})();
