(async () => {
    const TEST_ID = "TTP30";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Acadia",
        project: "texastaxprotest",
        site_url: "https://www.texastaxprotest.com/",
        test_name: "TTP30: [LANDING PAGE] Hero Copy Animation Cycling Through Texas Counties - (2) SET UP",
        page_initials: "AB-TTP30-V1",
        test_variation: 1,
        test_version: 0.0001,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

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

    function q(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qAll(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function waitFrames(n) {
        return new Promise((resolve) => {
            let count = 0;
            function next() {
                if (++count >= n) resolve();
                else requestAnimationFrame(next);
            }
            requestAnimationFrame(next);
        });
    }

    function replaceText() {
        const counties = ["Harris", "Dallas", "Tarrant", "Travis", "Collin", "Denton", "Fort Bend", "Montgomery", "Williamson"];

        const wantToLowerRoot = q(".mantine-Grid-inner");
        const wantToLowerText = q(".mantine-Stack-root h1", wantToLowerRoot);

        if (!wantToLowerText) {
            return;
        }

        wantToLowerText.style.visibility = "hidden";

        if (!q("#AB-county-styles")) {
            const style = document.createElement("style");
            style.id = "AB-county-styles";
            style.textContent = `
                @keyframes AB-county-fadeOut {
                    0%   { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes AB-county-fadeIn {
                    0%   { opacity: 0; }
                    100% { opacity: 1; }
                }

                .mantine-Title-root.AB-county-title {
                    font-size: calc(2.95rem * var(--mantine-scale)) !important;
                    line-height: 1.25 !important;
                    text-align: center !important;
                }

                @media (max-width: 768px) {
                    .mantine-Title-root.AB-county-title {
                        font-size: calc(2.6rem * var(--mantine-scale)) !important;
                        line-height: 1.3 !important;
                        text-align: center !important;
                    }
                }

                .AB-county-span {
                    color: #FFE9D9 !important;
                    display: inline;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                    transition: none;
                }
                .AB-county-span.AB-county-out {
                    animation: AB-county-fadeOut 0.35s ease forwards;
                }
                .AB-county-span.AB-county-in {
                    animation: AB-county-fadeIn 0.35s ease forwards;
                }
            `;
            document.head.appendChild(style);
        }

        wantToLowerText.classList.add("AB-county-title");

        wantToLowerText.innerHTML = `Lower Your Property Taxes In <span class="AB-county-span">${counties[7]}</span> County`;

        wantToLowerText.style.visibility = "visible";
        const countySpan = q(".AB-county-span", wantToLowerText);

        if (!countySpan) {
            return;
        }

        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % counties.length;
            const nextCounty = counties[currentIndex];

            countySpan.classList.remove("AB-county-in");
            countySpan.classList.add("AB-county-out");

            setTimeout(() => {
                countySpan.textContent = nextCounty;
                countySpan.classList.remove("AB-county-out");
                countySpan.classList.add("AB-county-in");
            }, 350);
        }, 1800);
    }

    const replaceReviewText = () => {
        const root = q(".mantine-Grid-inner");
        const reviewText = qAll(".mantine-Text-root", root);

        if (!reviewText) return;

        reviewText.forEach((text) => {
            text.innerText = text.innerText.replace("500+ Reviews", "1000+ Reviews");
        });
    };

    function init() {
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        replaceText();
        replaceReviewText();
    }

    function checkForItems() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q(".mantine-Grid-inner .mantine-Stack-root h1"));
    }

    try {
        await waitForElementAsync(checkForItems);
        await waitFrames(5);
        init();
    } catch (error) {
        return false;
    }
})();
