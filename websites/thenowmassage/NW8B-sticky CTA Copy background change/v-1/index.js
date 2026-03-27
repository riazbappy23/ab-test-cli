(async () => {
    const TEST_ID = "NW8B";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        page_initials: "AB-NW8B",
        test_variation: 2,
        test_version: 0.0001,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

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

    function q(selector) {
        return document.querySelector(selector);
    }

    function waitForElement(predicate, timeout = 20000, interval = 150) {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            if (predicate()) return resolve(true);
            const id = setInterval(() => {
                if (Date.now() - start >= timeout) {
                    clearInterval(id);
                    reject(new Error("waitForElement timed out"));
                    return;
                }
                if (predicate()) {
                    clearInterval(id);
                    resolve(true);
                }
            }, interval);
        });
    }

    const ARROW_SVG = `<svg class="nw8b-cta__arrow" width="50" height="26" viewBox="0 0 50 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 12.5H0.5V13.5H1V12.5ZM49 13.5C49.2762 13.5 49.5 13.2761 49.5 13C49.5 12.7238 49.2761 12.5 49 12.5V13.5ZM37.0691 1V0.5H36.0691V1H37.0691ZM36.0691 25V25.5H37.0691V25H36.0691ZM1 13.5H48.8812V12.5H1V13.5ZM48.8812 13.5H49V12.5H48.8812V13.5ZM36.0691 1C36.0691 2.52907 36.9323 4.06864 38.1095 5.47417C39.2982 6.89336 40.8705 8.25068 42.4238 9.42397C43.9801 10.5996 45.534 11.6027 46.6973 12.3114C47.2794 12.666 47.7649 12.9475 48.1054 13.1407C48.2757 13.2374 48.4098 13.3119 48.5018 13.3625C48.5477 13.3879 48.5831 13.4072 48.6073 13.4203C48.6193 13.4268 48.6286 13.4318 48.6349 13.4352C48.638 13.4369 48.6405 13.4382 48.6422 13.4392C48.643 13.4396 48.6437 13.44 48.6441 13.4402C48.644 13.4402 48.6444 13.4403 48.6441 13.4402C48.6443 13.4403 48.645 13.4407 48.8812 13C49.1174 12.5593 49.1175 12.5593 49.1174 12.5593C49.1171 12.5591 49.1164 12.5588 49.1158 12.5584C49.1145 12.5577 49.1125 12.5566 49.1097 12.5552C49.1042 12.5522 49.0958 12.5476 49.0845 12.5415C49.0621 12.5293 49.0283 12.5109 48.9841 12.4866C48.8957 12.4379 48.7653 12.3654 48.5989 12.271C48.2661 12.0822 47.7897 11.8059 47.2176 11.4574C46.0723 10.7598 44.5482 9.77542 43.0265 8.62603C41.5018 7.47432 39.996 6.16914 38.8761 4.83208C37.7448 3.48136 37.0691 2.17093 37.0691 1H36.0691ZM48.8812 13C48.6957 12.5357 48.6955 12.5358 48.6953 12.5359C48.6952 12.5359 48.6956 12.5358 48.6953 12.5359C48.6948 12.5361 48.6934 12.5366 48.6925 12.537C48.6907 12.5377 48.6882 12.5387 48.6849 12.54C48.6784 12.5427 48.6689 12.5465 48.6566 12.5515C48.6321 12.5616 48.5962 12.5764 48.5498 12.5958C48.4569 12.6347 48.3218 12.6922 48.1505 12.7677C47.808 12.9187 47.3202 13.1417 46.7355 13.4314C45.5673 14.0102 44.0063 14.8582 42.442 15.9331C40.8805 17.0061 39.2976 18.3175 38.1009 19.8279C36.9042 21.3383 36.0691 23.0799 36.0691 25H37.0691C37.0691 23.3804 37.773 21.8521 38.8847 20.4489C39.9966 19.0456 41.4918 17.7994 43.0083 16.7573C44.5221 15.7171 46.039 14.8925 47.1794 14.3275C47.749 14.0453 48.2231 13.8286 48.5538 13.6828C48.7192 13.6099 48.8486 13.5548 48.9361 13.5182C48.9798 13.4998 49.0131 13.4861 49.0351 13.4771C49.0462 13.4726 49.0544 13.4693 49.0597 13.4672C49.0623 13.4661 49.0642 13.4653 49.0654 13.4648C49.066 13.4646 49.0664 13.4644 49.0667 13.4643C49.0666 13.4643 49.0668 13.4643 49.0667 13.4643C49.0666 13.4643 49.0668 13.4643 48.8812 13Z" fill="#404D6A"/>
</svg>
`;

    const css = `
        @media (max-width: 767px) {
            .AB-NW8B .nav-main__ctas {
                position: fixed;
                top: 55px;
                left: 0;
                width: 100%;
                z-index: 9999;
                margin: 0;
                padding: 0;
            }

            .AB-NW8B .nav-main__ctas a {
                display: flex !important;
                align-items: center;
                justify-content: center;
                gap: 10px;
                width: 100%;
                line-height: 100%;
                background:#fff !important;
                padding: 15px;
                box-sizing: border-box;
                text-decoration: none;
                border-radius: 0 !important;
                border: none !important;
            }

            .AB-NW8B .nav-main__ctas a .nw8b-cta__label {
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 5%;
                color: #404D6A !important;
                text-transform: uppercase;
                font-family: inherit;
                white-space: nowrap;
            }

            .AB-NW8B .nav-main__ctas a > span:not(.nw8b-cta__label) {
                display: none;
            }
        }
    `;

    function injectStyles(cssString) {
        if (document.getElementById("NW8B-styles")) return;
        const style = document.createElement("style");
        style.id = "NW8B-styles";
        style.textContent = cssString;
        document.head.appendChild(style);
    }

    function getCTALabel(href) {
        if (test_variation === 1) return "Book Appointment";
        if (href?.includes("boutiques")) return "Find A Location";
        return "Book Appointment";
    }

    function init() {
        if (!document.body.classList.contains(page_initials)) {
            q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);

            injectStyles(css);

            const anchor = q(".nav-main__ctas a");
            if (!anchor) return;

            const href = anchor.getAttribute("href") || "";
            const label = getCTALabel(href);

            anchor.insertAdjacentHTML("afterbegin", `<span class="nw8b-cta__label">${label}</span>${ARROW_SVG}`);
            anchor.setAttribute("aria-label", label);

            anchor.addEventListener("click", () => {
                fireGA4Event("NW8A_StickyCTAClicks", "Sticky CTA Copy");
                logInfo(`NW8A_StickyCTAClicks fired — "${label}"`);
            });

            logInfo("Initialised.");
        }
    }

    function isReady() {
        return !!(isMobile() && q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q(".nav-main__ctas a"));
    }

    try {
        await waitForElement(isReady);
        init();
    } catch (err) {
        logInfo(`Aborted — ${err.message}`);
    }

    function destroyTest() {
        if (!document.body.classList.contains(page_initials)) return;

        document.body.classList.remove(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);

        document.querySelector(".nw8b-cta__label")?.remove();
        document.querySelector(".nw8b-cta__arrow")?.remove();

        logInfo("Test removed (desktop view)");
    }

    const resizeObserver = new ResizeObserver(() => {
        if (isMobile() && !document.body.classList.contains(page_initials) && q(".nav-main__ctas a")) {
            init();
        }

        if (!isMobile()) {
            destroyTest();
        }
    });

    resizeObserver.observe(document.body);
})();
