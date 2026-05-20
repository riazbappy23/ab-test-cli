(async () => {
    const TEST_ID = "MMI47";
    const VARIANT_ID = 1;
    const PRODUCT_URL = "https://magicmind.com/products/mental-performance-shot-original?selling_plan=2814476422&variant=40802379268230";

    const items = ["Clinically-Backed Ingredients", "Patented Technology", "10+ Years Of Research", "Third-Party Tested"];
    
    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    async function waitForElementAsync(predicate, timeout = 20000, frequency = 150) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            if (typeof predicate === "function" && predicate()) return resolve(true);

            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;

                if (elapsed >= timeout) {
                    clearInterval(interval);
                    return reject(new Error(`Timeout of ${timeout}ms reached while waiting for condition: ${predicate.toString()}`));
                }

                if (typeof predicate === "function" && predicate()) {
                    clearInterval(interval);
                    return resolve(true);
                }
            }, frequency);
        });
    }

    function q(selector, scope = document) {
        return scope.querySelector(selector);
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

    function clickFunction() {
        document.body.addEventListener("click", (e) => {
            const item = e.target.closest(`.${PAGE_INITIALS}__item`);

            if (item) {
                fireGA4Event("MMI47_EyebrowClick", item.dataset.eventLabel || "");
            }
        });
    }

    const PAGE_INITIALS = "MMI47";
    const TARGETTED_SHOPIFY_SECTION = ".shopify-section--announce-bar";

    function getAnnouncementItemMarkup(item) {
        return `
      <a class="${PAGE_INITIALS}__item" href="${PRODUCT_URL}" data-event-label="${item}">
        <span class="${PAGE_INITIALS}__icon" aria-hidden="true">
          <svg stroke="#00A087" fill="#00A087" stroke-width="0" viewBox="0 0 16 16" role="presentation" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path></svg>
        </span>
        <span>${item}</span>
      </a>
    `;
    }

    function getAnnouncementMarkup() {
        const itemMarkup = items.map(getAnnouncementItemMarkup).join("");

        return `
      <div class="shopify-section--announce-bar ${PAGE_INITIALS}__announce-bar">
        <section class="${PAGE_INITIALS}__announcement" aria-label="Product benefits">
          <div class="${PAGE_INITIALS}__track">
            <div class="${PAGE_INITIALS}__group">
              ${itemMarkup}
            </div>
            <div class="${PAGE_INITIALS}__group ${PAGE_INITIALS}__group--clone" aria-hidden="true">
              ${itemMarkup}
            </div>
          </div>
        </section>
      </div>
    `;
    }

    function init() {
        const announceBar = q(TARGETTED_SHOPIFY_SECTION);

        document.body.classList.add(PAGE_INITIALS, `${PAGE_INITIALS}--${VARIANT_ID}`);
        announceBar.outerHTML = getAnnouncementMarkup();
        clickFunction();
    }

    function checkForItems() {
        return !!q(`body:not(.${PAGE_INITIALS})`) && !!q(TARGETTED_SHOPIFY_SECTION);
    }

    try {
        await waitForElementAsync(checkForItems);
        init();
    } catch (error) {
        logInfo(error.message);
    }
})();
