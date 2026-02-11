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
    const backdropSelector = ".modal-backdrop";

    const addBackdrop = () => {
        waitForElem("body", (body) => {
            if (document.querySelector(backdropSelector)) return;

            const backdrop = document.createElement("div");
            backdrop.className = "modal-backdrop fade show";
            body.appendChild(backdrop);

            waitForElem(backdropSelector, (b) => {
                b.addEventListener("click", closeModal);
            });
        });
    };

    const removeBackdrop = () => {
        waitForElem(backdropSelector, (b) => b.remove());
    };

    // Set default option in modal
    const setFrontAsDefault = () => {
        waitForElem(modalSelector, (m) => {
            m.querySelectorAll(".option-toggler").forEach((t) => t.classList.remove("active"));
            m.querySelector('[data-option-value="front"]')?.classList.add("active");
            m.querySelector(".option-engraving-front-customization-wrapper")?.classList.remove("d-none");
            m.querySelector(".option-engraving-back-customization-wrapper")?.classList.add("d-none");
        });
    };

    // Open modal
    const openModal = () => {
        waitForElem(modalSelector, (m) => {
            document.body.classList.add("modal-open");

            m.classList.add("show");
            m.style.display = "block";
            m.removeAttribute("aria-hidden");

            addBackdrop();
            setFrontAsDefault();

            waitForElem("#engravingLabel", (label) => (label.textContent = "TEST TEXT"));

            bindClose();
            bindOutsideClick();
        });
    };

    // Close modal
    const closeModal = () => {
        waitForElem(modalSelector, (m) => {
            m.classList.remove("show");
            m.style.display = "none";
            m.setAttribute("aria-hidden", "true");

            document.body.classList.remove("modal-open");
            removeBackdrop();
        });
    };

    // Close bindings
    const bindClose = () => {
        waitForElem("#engravingModal .close", (btn) => {
            if (btn.dataset.bound) return;

            btn.dataset.bound = "true";
            btn.addEventListener("click", closeModal);
        });
    };

    // Close on outside click
    const bindOutsideClick = () => {
        waitForElem(modalSelector, (m) => {
            if (m.dataset.outsideBound) return;

            m.dataset.outsideBound = "true";
            m.addEventListener("click", (e) => {
                if (e.target === m) {
                    closeModal();
                }
            });
        });
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

    // Init
    waitForElem(
        ".product-options-wrapper .product-options .product-option .engraving-cta-wrapper",
        replaceWithCustomContent
    );
})();
