/* 

Ticket: https://trello.com/c/GaLBAkwG/5089-%F0%9F%92%9B-icon25-sitewide-countdown-to-deadline-promo-bar-2-set-up-test
Figma Design: https://www.figma.com/design/4QmluoK4icCDESChcVvgR5/ICON25---SITEWIDE--Countdown-to-Deadline-Promo-Bar?node-id=12-2&p=f&t=UtTy2T3CdFvDB9dn-0
Test container: https://marketer.monetate.net/control/a-0e709fac/p/iconpropertytax.com/experience/2103890#c2642366:what
https://www.iconpropertytax.com/trends/
https://www.iconpropertytax.com/signup/state-lead/

Preview URL:
Excluding other experiences:
V1: https://marketer.monetate.net/control/preview/12917/F2RGHD4QWUUIZJQKCNYUTZ172H58CR8V/icon25-sitewide-countdown-to-deadline-promo-bar

Including all experiences:
V1: https://marketer.monetate.net/control/preview/12917/R0KWJCIY7C3PS4KU6DGUCCYD52WO6ZF9/icon25-sitewide-countdown-to-deadline-promo-bar



*/

(async () => {
    const TEST_ID = "ICON25";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(
            `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
            "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
            "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
            message,
        );
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Acadia",
        project: "iconpropertytax",
        site_url: "https://www.iconpropertytax.com",
        test_name: "ICON25: [SITEWIDE] Countdown to Deadline Promo Bar - (2) SET UP TEST",
        page_initials: "AB-ICON25",
        test_variation: 1,
        test_version: 0.0001,
    };

    const { page_initials, test_variation, test_version } = TEST_CONFIG;

    const DATA = [
        // Date format: MM-DD-YYYY
        // Timezone: USA Eastern
        {
            start_date: "" /* Now */,
            end_date: "04-22-2026",
            location: "Wake County",
        },
        {
            start_date: "04-23-2026",
            end_date: "05-04-2026",
            location: "Mecklenburg County",
        },
        {
            start_date: "05-05-2026",
            end_date: "05-08-2026",
            location: "Durham County",
        },
        {
            start_date: "05-09-2026",
            end_date: "05-15-2026",
            location: "Guildord County",
        },
        {
            start_date: "05-16-2026",
            end_date: "05-20-2026",
            location: "Cumberland County",
        },
        {
            start_date: "05-21-2026",
            end_date: "06-30-2026",
            location: "Forsyth County",
        },
    ];

    async function waitForElementAsync(predicate, timeout = 20000, frequency = 150) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            if (typeof predicate === "function" && predicate()) {
                return resolve(true);
            }

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

    function q(s, o) {
        return o ? s.querySelector(o) : document.querySelector(s);
    }

    function qq(s, o) {
        return o ? [...s.querySelectorAll(o)] : [...document.querySelectorAll(s)];
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const fontCDN = /* HTML */ `
        <!-- Montserrat -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

        <!-- Bitter -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    `;

    const layout = /* HTML */ `
        <div class="ab-deadline-promo-bar">
            <div class="ab-deadline-promo-bar__location-with-end-date">
                <span class="ab-deadline-promo-bar__country">Wake County</span>
                Appeals <br />
                Open — Deadline:
                <span class="ab-deadline-promo-bar__end-date"> April 22</span>
            </div>
            <ul class="ab-deadline-promo-bar__countdown">
                <li class="ab-deadline-promo-bar__countdown-item">
                    <span class="ab-deadline-promo-bar__countdown-item-value">00</span>
                    <span class="ab-deadline-promo-bar__countdown-item-label">DAYS</span>
                </li>
                <li class="ab-deadline-promo-bar__countdown-item-separator">:</li>
                <li class="ab-deadline-promo-bar__countdown-item">
                    <span class="ab-deadline-promo-bar__countdown-item-value">00</span>
                    <span class="ab-deadline-promo-bar__countdown-item-label">HRS</span>
                </li>
                <li class="ab-deadline-promo-bar__countdown-item-separator">:</li>
                <li class="ab-deadline-promo-bar__countdown-item">
                    <span class="ab-deadline-promo-bar__countdown-item-value">00</span>
                    <span class="ab-deadline-promo-bar__countdown-item-label">MINS</span>
                </li>
                <li class="ab-deadline-promo-bar__countdown-item-separator">:</li>
                <li class="ab-deadline-promo-bar__countdown-item">
                    <span class="ab-deadline-promo-bar__countdown-item-value">00</span>
                    <span class="ab-deadline-promo-bar__countdown-item-label">SECS</span>
                </li>
            </ul>
        </div>
    `;

    function createLayout() {
        q("head").insertAdjacentHTML("beforeend", fontCDN);
        q("body").insertAdjacentHTML("afterbegin", layout);

        q("body").classList.add(`${page_initials}--show-sticky-deadline-promo-bar`);
    }

    let countdownInterval = null;

    // Converts a MM-DD-YYYY end_date string to the UTC timestamp for
    // 23:59:59 on that day in US Eastern time (handles EST/EDT automatically)
    function parseEasternEndDate(dateStr) {
        const [month, day, year] = dateStr.split("-");
        const isoStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T23:59:59`;
        const ref = new Date(isoStr);
        const easternRef = new Date(ref.toLocaleString("en-US", { timeZone: "America/New_York" }));
        return new Date(ref.getTime() + (ref - easternRef));
    }

    // Step 1-5: Walk DATA and return the first entry whose end_date has not yet passed
    function getActiveEntry() {
        const now = new Date();
        const nowEastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
        for (let i = 0; i < DATA.length; i++) {
            if (nowEastern <= parseEasternEndDate(DATA[i].end_date)) {
                return DATA[i];
            }
        }
        return null; // Step 4: past every end_date
    }

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    function tick() {
        const entry = getActiveEntry();
        const countryEl = q(".ab-deadline-promo-bar__country");
        const endDateEl = q(".ab-deadline-promo-bar__end-date");
        const valueEls = qq(".ab-deadline-promo-bar__countdown-item-value");

        // Step 4: all deadlines passed — zero out and stop
        if (!entry) {
            const lastEntry = DATA[DATA.length - 1];
            const [month, day, year] = lastEntry.end_date.split("-");
            const endDateDisplay = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
            });

            if (countryEl) countryEl.textContent = lastEntry.location;
            if (endDateEl) endDateEl.textContent = ` ${endDateDisplay}`;
            valueEls.forEach((el) => (el.textContent = "00"));

            clearInterval(countdownInterval);
            return;
        }

        // Step 8a: update location label
        if (countryEl) countryEl.textContent = entry.location;

        // Step 8b: update end-date label (e.g. " April 22")
        const [month, day, year] = entry.end_date.split("-");
        const endDateDisplay = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
        });
        if (endDateEl) endDateEl.textContent = ` ${endDateDisplay}`;

        // Step 6: difference in milliseconds
        const now = new Date();
        const endTimestamp = parseEasternEndDate(entry.end_date);
        const diff = Math.max(0, endTimestamp - now);

        // Step 7: break into days / hours / minutes / seconds
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Step 8c: push values into the four countdown spans
        if (valueEls[0]) valueEls[0].textContent = pad(days);
        if (valueEls[1]) valueEls[1].textContent = pad(hours);
        if (valueEls[2]) valueEls[2].textContent = pad(minutes);
        if (valueEls[3]) valueEls[3].textContent = pad(seconds);

        const targetNodes = qq(".ab-deadline-promo-bar__countdown > li:nth-child(1), .ab-deadline-promo-bar__countdown > li:nth-child(2)");

        if (days <= 0) {
            targetNodes.forEach((node) => node.classList.add("ab-hidden"));
        } else {
            targetNodes.forEach((node) => node.classList.remove("ab-hidden"));
        }

        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0 && entry.location !== DATA[DATA.length - 1].location) {
            initCountdown();
        }
    }

    function initCountdown() {

        if (countdownInterval) clearInterval(countdownInterval);

        tick();
        countdownInterval = setInterval(tick, 1000);
    }

    function handleLocationChanges() {
        if (q(".ab-deadline-promo-bar")) return;

        document.body.classList.remove(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        window[page_initials] = false;

        init_ICON25();
    }

    function urlObserver() {
        const debouncedChanges = debounce(handleLocationChanges, 150);

        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(history, arguments);
            window.dispatchEvent(new Event("pushstate"));
        };

        // Listen for back/forward button clicks
        window.addEventListener("popstate", function (event) {
            debouncedChanges();
        });

        window.addEventListener("pushstate", function () {
            debouncedChanges();
        });
    }

    function showHidePromoBarOnScroll() {
        if(window.scrollY > 100) {
            q("body").classList.remove(`${page_initials}--show-sticky-deadline-promo-bar`);
        }

        window.addEventListener("scroll", () => {
            if (q("header") && window.scrollY <= 10 && window.innerWidth >= 991) {
                q("body").classList.add(`${page_initials}--show-sticky-deadline-promo-bar`);
            } else {
                q("body").classList.remove(`${page_initials}--show-sticky-deadline-promo-bar`);
            }
        });
    }

    async function init_ICON25() {
        if (window[page_initials] === true) return;

        try {
            await waitForElementAsync(checkForItems);

            window[page_initials] = true;
            q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);

            createLayout();
            initCountdown();
            showHidePromoBarOnScroll();
        } catch (error) {
            return false;
        }
    }

    function checkForItems() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && document.readyState === "complete");
    }

    init_ICON25();
    urlObserver();
})();
