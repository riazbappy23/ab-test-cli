(async () => {
    const TEST_ID = "TTP30";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0,0,57); font-weight:700; padding:2px 4px;", "margin-left:8px; color:white; background:rgb(0,57,57); font-weight:700; padding:2px 4px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        page_initials: "AB-TTP30",
        test_variation: 1,
        test_version: 0.0002,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

    function q(sel, root = document) {
        return root.querySelector(sel);
    }

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    function waitFrames(n) {
        return new Promise((resolve) => {
            let i = 0;
            function next() {
                if (++i >= n) resolve();
                else requestAnimationFrame(next);
            }
            requestAnimationFrame(next);
        });
    }

    async function waitForElementAsync(predicate, timeout = 20000, freq = 150) {
        const start = Date.now();

        return new Promise((resolve, reject) => {
            if (predicate()) return resolve(true);

            const int = setInterval(() => {
                if (Date.now() - start >= timeout) {
                    clearInterval(int);
                    reject(new Error("Timeout"));
                }

                if (predicate()) {
                    clearInterval(int);
                    resolve(true);
                }
            }, freq);
        });
    }

    function highlightCounty(text) {
        const match = text.match(/In\s(.+?)\sCounty/i);
        if (!match) return text;
        return isMobile() ? `in<br><span class="AB-county-name">${match[1]}</span> County` : `in <span class="AB-county-name">${match[1]}</span> County`;
    }

    function buildTitleHTML(countyText) {
        return isMobile() ? `Lower Your<br>Property Taxes ${highlightCounty(countyText)}` : `Lower Your Property Taxes<br>${highlightCounty(countyText)}`;
    }

    function replaceText() {
        const counties = [ "In Harris County", "In Dallas County", "In Tarrant County", "In Travis County", "In Collin County", "In Denton County", "In Fort Bend County","In Montgomery County", "In Williamson County"];

        const root = q(".mantine-Container-root");
        const title = q(".mantine-Stack-root h1", root);

        if (!title) return;

        title.style.visibility = "hidden";

        if (!q("#AB-county-styles")) {
            const style = document.createElement("style");
            style.id = "AB-county-styles";
            style.textContent = `
            .mantine-Title-root.AB-county-title {
                font-size: clamp(calc(1.75rem * var(--mantine-scale)), 3.8vw, calc(2.95rem * var(--mantine-scale))) !important;
                line-height: 1.25 !important;
                text-align: center !important;
                opacity: .8;
                transition: opacity 0.5s ease;
            }

            .mantine-Title-root.AB-county-title.AB-show {
                opacity: 1;
            }

            .AB-county-name {
                color: #FFE9D9 !important;
                text-decoration: underline;
                text-underline-offset: 4px;
            }

            @media (max-width: 767px) {
                .mantine-Title-root.AB-county-title {
                    font-size: calc(2.3rem * var(--mantine-scale)) !important;
                    line-height: 1.1 !important;
                    max-width:350px;
                    width: 100%;
                }
                .mantine-Stack-root:has(.AB-county-title) {
                    flex-grow: 1;
                    min-width: 0;
                    width: 100%;
                }
                .AB-TTP30 .mantine-Container-root:has(.AB-county-title) {
                  margin: unset !important;
                  width:100% !important;
                }
            }
        `;
            document.head.appendChild(style);
        }

        title.classList.add("AB-county-title");

        title.innerHTML = buildTitleHTML(counties[0]);
        title.style.visibility = "visible";

        requestAnimationFrame(() => {
            title.classList.add("AB-show");
        });

        let index = 0;

        setInterval(() => {
            title.classList.remove("AB-show");

            setTimeout(() => {
                index = (index + 1) % counties.length;
                title.innerHTML = buildTitleHTML(counties[index]);
                title.classList.add("AB-show");
            }, 500);
        }, 1800);
    }


    function init() {
        document.body.classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        replaceText();
    }

    function checkForItems() {
        return q(`body:not(.${page_initials})`) && q(".mantine-Container-root .mantine-Stack-root h1");
    }

    try {
        await waitForElementAsync(checkForItems);
        await waitFrames(5);
        init();
    } catch (e) {
        console.error(e);
    }
})();
