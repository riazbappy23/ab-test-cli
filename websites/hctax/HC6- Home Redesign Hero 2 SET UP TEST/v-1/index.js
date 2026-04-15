(async () => {
    const TEST_ID = "HC6";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        page_initials: "AB-HC6",
        test_variation: 1,
        test_version: 0.0003,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

    const SELECTORS = {
        main: "main",
        hero: "main div:first-of-type",
        hero_left: "main div:first-of-type .mantine-Grid-inner div:first-of-type",
    };

    function q(sel, root = document) {
        return root.querySelector(sel);
    }

    function addStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
            .${page_initials} .hc6-hero {
                background: #1f3556;
                color: #fff;
                padding: 80px 20px;
                text-align: left;
            }

            .${page_initials} .hc6-container {
               min-height:calc(39.375rem * var(--mantine-scale));
               display:flex;
               flex-direction:column;
               justify-content:center;
               align-items:center;
            }

            .${page_initials} .hc6-rating {
                font-size: 14px;
                margin-bottom: 20px;
            }

            .${page_initials} .hc6-title {
                font-size: 48px;
                line-height: 1.2;
                font-weight: 600;
                margin-bottom: 20px;
            }

            .${page_initials} .hc6-highlight {
                background: #4a7bbf;
                padding: 5px 10px;
            }

            .${page_initials} .hc6-desc {
                font-size: 16px;
                max-width: 600px;
                line-height: 1.6;
            }

            .${page_initials} .hc7-btn--updated {
                background-color: #F5C518;
                color: #263557 !important;
                font-weight: 600;
                font-size: 20px;
                width: fit-content;
                padding: 20px 40px;
                height: auto;
                cursor: pointer;
                outline: 1px solid #e0b100;
                border: 10px solid white;
                border-radius: 0;
                transition: all 0.2s ease;
                margin-top: 40px;
                display: inline-block;
                text-decoration: none;
            }
        `;
        document.head.appendChild(style);
    }

    function createStarSVG() {
        return `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5C518" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.9 8.6L22 9.3L16.5 14.1L18.2 21L12 17.3L5.8 21L7.5 14.1L2 9.3L9.1 8.6L12 2Z"/>
        </svg>
    `;
    }

    function createRating() {
        const el = document.createElement("div");
        el.className = "hc6-rating";

        const starsWrapper = document.createElement("div");
        starsWrapper.className = "hc6-stars";
        starsWrapper.innerHTML = `
        ${createStarSVG()}
        ${createStarSVG()}
        ${createStarSVG()}
        ${createStarSVG()}
        ${createStarSVG()}
    `;

        const text = document.createElement("span");
        text.className = "hc6-rating-text";
        text.textContent = "5K+ REVIEWS";

        el.appendChild(starsWrapper);
        el.appendChild(text);

        return el;
    }

    function createTitle() {
        const el = document.createElement("h1");
        el.className = "hc6-title";
        el.innerHTML = `
            Property Tax Consultants You Can 
            <span class="hc6-highlight">Rely On</span>
        `;
        return el;
    }

    function createDescription() {
        const el = document.createElement("p");
        el.className = "hc6-desc";
        el.textContent = "Our experts handle the entire property tax protest process, helping homeowners and businesses secure fair tax assessments for over 50 years.";
        return el;
    }

    function createCTA() {
        const link = document.createElement("a");
        link.href = "https://www.hctax.com/contact-us/";
        link.className = "hc7-btn--updated";
        link.textContent = "Schedule Your Free Consultation";
        return link;
    }

    function createHeroSection() {
        const section = document.createElement("div");
        section.className = "hc6-hero";

        const container = document.createElement("div");
        container.className = "hc6-container";

        const wrapper = document.createElement("div");
        wrapper.className = "hc6-wrapper";

        wrapper.appendChild(createRating());
        wrapper.appendChild(createTitle());
        wrapper.appendChild(createDescription());
        wrapper.appendChild(createCTA());

        container.appendChild(wrapper);
        section.appendChild(container);

        return section;
    }

    function applyCoreClasses() {
        const body = document.body;
        if (!body.classList.contains(page_initials)) {
            body.classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version-${test_version}`);
        }

        const heroSection = q(SELECTORS.hero);
        if (heroSection && !heroSection.classList.contains("hc6-hero-section")) {
            heroSection.classList.add("hc6-hero-section");
        }
    }

    function init() {
        if (document.body.classList.contains("hc6-init")) return;

        const heroSection = q(SELECTORS.hero);
        if (heroSection) {
            document.body.classList.add("hc6-init");
            applyCoreClasses();
            addStyles();

            setTimeout(() => {
                const hero = createHeroSection();
                const heroLeft = q(SELECTORS.hero_left);
                heroLeft.innerHTML = hero.innerHTML;
                logInfo("All modifications applied");
            }, 200);
        }
    }

    function checkForItems() {
        return document.body;
    }

    try {
        if (checkForItems()) {
            init();
        }
    } catch (e) {
        console.error(e);
    }
})();
