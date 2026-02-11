(() => {
    // WAIT FOR ELEMENT POLL FUNCTION
    const waitForElem = (selector, callback, timer = 30000, frequency = 100) => {
        const element = document.querySelector(selector);
        if (!element) {
            if (timer <= 0) return;
            setTimeout(() => waitForElem(selector, callback, timer - frequency), frequency);
        } else {
            callback(element);
        }
    };

    // REPLACE CONTENT FUNCTION
 function replaceWithCustomContent(replaceableElement) {
        const customContent = `
            <div class="engraving-block">
                <div class="engraving-block__label">
                    Service de gravure offert
                </div>
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
                replaceableElement.innerHTML = customContent;
    }

    // INITIATE WAIT FOR ELEMENT
    waitForElem(".product-options-wrapper .product-options", (element) => {
        replaceWithCustomContent(element);
    });
})();
