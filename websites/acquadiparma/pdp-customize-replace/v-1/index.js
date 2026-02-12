(() => {
    // Wait for element helper
    const waitForElem = (selector, callback, timer = 30000, frequency = 100) => {
        const el = document.querySelector(selector);
        if (!el) {
            if (timer <= 0) return;
            setTimeout(() => waitForElem(selector, callback, timer - frequency, frequency), frequency);
        } else {
            callback(el);
        }
    };

    // Helpers
    const modalSelector = "#engravingModal";

    // Set default option in modal
    const setFrontAsDefault = () => {
        waitForElem(modalSelector, (m) => {
            m.querySelectorAll(".option-toggler").forEach((t) => t.classList.remove("active"));
            m.querySelector('[data-option-value="front"]')?.classList.add("active");
            m.querySelector(".option-engraving-front-customization-wrapper")?.classList.remove("d-none");
            m.querySelector(".option-engraving-back-customization-wrapper")?.classList.add("d-none");
        });
    };

    // Open modal using website's default trigger
    const openModal = () => {
        if (window.$ && $(modalSelector).length) {
            $(modalSelector).modal('show');
            
            // Set defaults immediately after triggering
            setFrontAsDefault();
            waitForElem("#engravingLabel", (label) => (label.textContent = "TEST TEXT"));
        }
    };

    // Replace CTA
    const replaceWithCustomContent = (container) => {
        container.innerHTML = `
            <div class="engraving-block">
                <div class="engraving-block__label">Service de gravure offert</div>
                <button type="button" class="engraving-block__button">
                    <img
                        src="/on/demandware.static/-/Library-Sites-acquadiparmaLibrary/default/dw04c88f85/images/benefits/engraving.svg"
                        alt=""
                        class="engraving-block__icon"
                    />
                    <span>Personnaliser</span>
                </button>
            </div>
        `;

        container.querySelector(".engraving-block__button")?.addEventListener("click", openModal);
    };

    // Setup MutationObserver
    const setupObserver = () => {
        waitForElem('.product-options-wrapper', (productOptionsWrapper) => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const ctaWrapper = productOptionsWrapper.querySelector('.product-options .product-option .engraving-cta-wrapper');
                        const hasCustomBlock = ctaWrapper?.querySelector('.engraving-block');
                        
                        if (ctaWrapper && !hasCustomBlock) {
                            replaceWithCustomContent(ctaWrapper);
                        }
                    }
                });
            });

            observer.observe(productOptionsWrapper, {
                childList: true,
                subtree: true
            });

            // Initial replacement
            const ctaWrapper = productOptionsWrapper.querySelector('.product-options .product-option .engraving-cta-wrapper');
            if (ctaWrapper) {
                replaceWithCustomContent(ctaWrapper);
            }
        });
    };

    // Init
    setupObserver();
})();