(async () => {
    const TEST_ID = "NW7";
    const VARIANT_ID = "control";

    function logInfo(message, data = "") {
        console.log(
            `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
            "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;",
            "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;",
            message,
            data
        );
    }

    logInfo("control fired");

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
        logInfo(`Event fired: ${eventName}${eventLabel ? ` - ${eventLabel}` : ""}`);
    }

    function waitForElement(selector, timeout = 20000, interval = 150) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const start = Date.now();
            const id = setInterval(() => {
                if (Date.now() - start >= timeout) {
                    clearInterval(id);
                    reject(new Error(`Timed out waiting for ${selector}`));
                    return;
                }
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(id);
                    resolve(el);
                }
            }, interval);
        });
    }

    async function setupHeroCTAEvent() {
        try {
            const heroCta = await waitForElement(".location-hero__cta");

            if (!heroCta.dataset.nw7Bound) {
                heroCta.dataset.nw7Bound = "true";

                heroCta.addEventListener("click", (e) => {
                    const clickedLink = e.target.closest("a, button");
                    const label = (clickedLink ? clickedLink.textContent : heroCta.textContent)
                        .replace(/\s+/g, " ")
                        .trim();
                    fireGA4Event("NW7_HeroCTAClick", label);
                });

                logInfo("Hero CTA event attached");
            }
        } catch (e) {
            logInfo("Hero CTA not found", e.message);
        }
    }

    async function setupScrollEvent() {
        try {
            const heroSection = await waitForElement(".location-hero__main-container");

            logInfo("Hero section found ✅", heroSection);

            let fired = false;

            const fireOnce = () => {
                if (fired) return;
                fired = true;
                fireGA4Event("NW7_ViewBTF");
                logInfo("BTF event fired");
            };

            const observer = new IntersectionObserver(
                (entries) => {
                    if (!entries[0].isIntersecting) {
                        fireOnce();
                        observer.disconnect();
                    }
                },
                { threshold: 0 }
            );

            observer.observe(heroSection);
            logInfo("Scroll observer attached");

            setTimeout(() => {
                const rect = heroSection.getBoundingClientRect();
                if (rect.bottom < 0) {
                    logInfo("Hero already above viewport → firing manually");
                    fireOnce();
                    observer.disconnect();
                }
            }, 500);
        } catch (e) {
            logInfo("Scroll setup failed", e.message);
        }
    }

    async function setupBTFClickEvents() {
        try {
            const mapContainer = await waitForElement(".location-info-map__actions").catch(() => null);

            if (mapContainer) {
                const bookingBtn = mapContainer.querySelector("a:first-child");

                if (bookingBtn && !bookingBtn.dataset.nw7Bound) {
                    bookingBtn.dataset.nw7Bound = "true";

                    bookingBtn.addEventListener("click", () => {
                        fireGA4Event("NW7_BTFClick", "Maps Section");
                    });

                    logInfo("Maps CTA event attached");
                }
            }

            const appointmentContainer = await waitForElement(".location-info-map__appointments-container").catch(() => null);

            if (appointmentContainer) {
                const bookingBtn = appointmentContainer.querySelector(".location-info-map__next-appointments__card__cta");

                if (bookingBtn && !bookingBtn.dataset.nw7Bound) {
                    bookingBtn.dataset.nw7Bound = "true";

                    bookingBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        fireGA4Event("NW7_BTFClick", "Booking Section");
                    });

                    logInfo("Booking CTA event attached");
                }
            }
        } catch (e) {
            logInfo("BTF setup failed", e.message);
        }
    }

    function init() {
        setupHeroCTAEvent();
        setupScrollEvent();
        setupBTFClickEvents();
        logInfo("control initialised");
    }

    init();
})();