(async () => {
    const TEST_ID = "HC7";
    const VARIANT_ID = "V1"; /* Control, V1, V2 */

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Acadia",
        project: "hctax",
        site_url: "https://www.hctax.com",
        test_name: "HC7 - CONTACT US PAGE Redesign Contact Form SET UP TEST",
        page_initials: "AB-HC7-V1",
        test_variation: 1, // 1 = V1, 2 = V2
        test_version: 0.0001,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

    // ─── Utility: Wait for element ────────────────────────────────────────────────
    async function waitForElementAsync(predicate, timeout = 20000, frequency = 150) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            if (typeof predicate === "function" && predicate()) return resolve(true);
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= timeout) {
                    clearInterval(interval);
                    return reject(new Error(`Timeout: ${predicate.toString()}`));
                }
                if (typeof predicate === "function" && predicate()) {
                    clearInterval(interval);
                    return resolve(true);
                }
            }, frequency);
        });
    }

    const q = (s, r = document) => r.querySelector(s);
    const qAll = (s, r = document) => [...r.querySelectorAll(s)];

    // ─── Selector Map ─────────────────────────────────────────────────────────────
    const SELECTORS_LIST = {
        main: "main",
        top_section: "main .mantine-Container-root",
        form_wrapper: ".mantine-Grid-inner",
        contact_form: "#contact-form",
        info_card: ".mantine-Grid-inner > div:first-child",
        btn_text: "#contact-form button span span",
    };

    // ─── SVG Icons ────────────────────────────────────────────────────────────────
    const ICONS = Object.freeze({
        never_miss: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>`,
        tax_savings: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
        peace_of_mind: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
        fifty_years: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    });

    // ─── Top Cards Data ───────────────────────────────────────────────────────────
    const TOP_CARDS_DATA = [
        {icon: ICONS.never_miss, text: "Never Miss A Deadline Again"},
        {icon: ICONS.tax_savings, text: "Unlock Tax Savings"},
        {icon: ICONS.peace_of_mind, text: "Complete Peace Of Mind"},
    ];

    // ─── Create Top Cards (Variant 2) ─────────────────────────────────────────────
    function createTopCards() {
        const wrapper = document.createElement("div");
        wrapper.className = "hc7-top-cards";
        TOP_CARDS_DATA.forEach(({icon, text}) => {
            const card = document.createElement("div");
            card.className = "hc7-top-card";
            card.innerHTML = `
                <span class="hc7-top-card__icon">${icon}</span>
                <span class="hc7-top-card__text">${text}</span>
            `;
            wrapper.appendChild(card);
        });
        return wrapper;
    }

    // ─── Top Section Modification ─────────────────────────────────────────────────
    function modifyTopSection(variation) {
        const topSection = q(SELECTORS_LIST.top_section);
        if (!topSection) return;
        topSection.classList.add("hc7-top-section");

        // Target <p> tags in the top section
        const paragraphs = qAll("p", topSection);
        paragraphs.forEach((p) => {
            const html = p.innerHTML;
            const brIndex = html.indexOf("<br>");
            if (brIndex === -1) return;

            const firstPart = html.substring(0, brIndex).trim();
            // Keep only the first part text
            p.innerHTML = firstPart;
            p.classList.add("hc7-top-section__p--trimmed");

            if (variation === 1) {
                // V1: hide remaining description — already removed above
            } else if (variation === 2) {
                // V2: replace rest with top cards — insert after the paragraph
                const cards = createTopCards();
                p.parentNode.insertBefore(cards, p.nextSibling);
            }
        });
    }

    // ─── Move Info Cards to Bottom ────────────────────────────────────────────────
    function moveInfoCards() {
        const formWrapper = q(SELECTORS_LIST.form_wrapper);
        if (!formWrapper) return;

        const infoCard = q(SELECTORS_LIST.info_card);
        if (!infoCard) return;

        infoCard.classList.add("hc7-info-card--moved");

        // Create bottom container
        const bottomContainer = document.createElement("div");
        bottomContainer.className = "hc7-bottom-info-cards";

        // Move the info card into bottom container
        bottomContainer.appendChild(infoCard);

        // Insert bottom container after form wrapper's parent
        formWrapper.parentNode.insertAdjacentElement("afterend", bottomContainer);
    }

    // ─── Update Button Text ───────────────────────────────────────────────────────
    function updateButtonText() {
        const btnSpan = q(SELECTORS_LIST.btn_text);
        if (btnSpan) {
            btnSpan.textContent = "Schedule Your Free Consultation";
            btnSpan.closest("button")?.classList.add("hc7-btn--updated");
        }
    }

    // ─── Add "Proudly Serving 50 Years" Badge ────────────────────────────────────
    function addFiftyYearsBadge() {
        const contactForm = q(SELECTORS_LIST.contact_form);
        if (!contactForm) return;

        const badge = document.createElement("div");
        badge.className = "hc7-fifty-badge";
        badge.innerHTML = `
            <span class="hc7-fifty-badge__icon">${ICONS.fifty_years}</span>
            <span class="hc7-fifty-badge__text">Proudly Serving for Over 50 Years</span>
        `;
        contactForm.insertAdjacentElement("afterend", badge);
    }

    // ─── Mobile Layout via ResizeObserver ─────────────────────────────────────────
    function setupMobileLayout() {
        const contactForm = q(SELECTORS_LIST.contact_form);
        if (!contactForm) return;

        function applyMobileLayout(isMobile) {
            // Form first child: first name + last name row
            const firstRow = contactForm.querySelector(".mantine-Grid-inner > div:first-child, .mantine-SimpleGrid-root, .hc7-form-first-row");

            // Scope to the inner grid of the form
            const formGrid = q(".mantine-Grid-inner", contactForm);
            if (!formGrid) return;

            const formChildren = Array.from(formGrid.children);

            // Row 1: first name + last name (index 0)
            if (formChildren[0]) {
                formChildren[0].classList.toggle("hc7-mobile-col", isMobile);
            }

            // Row 5 (0-indexed: 4): active client + preferred contact method
            if (formChildren[4]) {
                formChildren[4].classList.toggle("hc7-mobile-col", isMobile);
            }
        }

        const resizeObserver = new ResizeObserver(() => {
            const isMobile = document.body.offsetWidth < 768;
            applyMobileLayout(isMobile);
        });

        resizeObserver.observe(document.body);
        // Run once immediately
        applyMobileLayout(document.body.offsetWidth < 768);
    }

    // ─── Inject CSS ───────────────────────────────────────────────────────────────
    function injectStyles() {
        const style = document.createElement("style");
        style.id = "hc7-styles";
        style.textContent = `
            /* ── Top Section ─────────────────────────────────────────────────── */
            .${page_initials} .hc7-top-section {}

            /* ── Top Cards (V2) ──────────────────────────────────────────────── */
            .${page_initials} .hc7-top-cards {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                margin-top: 16px;
            }

            .${page_initials} .hc7-top-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                background: rgba(255,255,255,0.12);
                border-radius: 8px;
                padding: 12px 16px;
                min-width: 120px;
                flex: 1;
                text-align: center;
            }

            .${page_initials} .hc7-top-card__icon {
                color: #F5C518;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .${page_initials} .hc7-top-card__text {
                font-size: 13px;
                font-weight: 600;
                color: #fff;
                line-height: 1.3;
            }

            /* ── Bottom Info Cards ───────────────────────────────────────────── */
            .${page_initials} .hc7-bottom-info-cards {
                width: 100%;
                margin-top: 32px;
            }

            /* Cards moved to bottom: display as horizontal row */
            .${page_initials} .hc7-info-card--moved {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: wrap !important;
                gap: 16px !important;
                width: 100% !important;
                max-width: 100% !important;
                flex: 0 0 100% !important;
            }

            /* ── 50 Years Badge ──────────────────────────────────────────────── */
            .${page_initials} .hc7-fifty-badge {
                display: flex;
                align-items: center;
                gap: 12px;
                justify-content: center;
                margin-top: 20px;
                padding: 12px 0;
            }

            .${page_initials} .hc7-fifty-badge__icon {
                color: #F5C518;
                display: flex;
                align-items: center;
            }

            .${page_initials} .hc7-fifty-badge__text {
                font-weight: 600;
                font-size: 15px;
                color: #333;
            }

            /* ── Button ──────────────────────────────────────────────────────── */
            .${page_initials} .hc7-btn--updated {
                background-color: #F5C518 !important;
                color: #1a1a3e !important;
                font-weight: 700 !important;
                text-transform: none !important;
                letter-spacing: 0 !important;
                border-radius: 4px !important;
                padding: 12px 24px !important;
                width: 100% !important;
            }

            /* ── Mobile Column Layout ────────────────────────────────────────── */
            .${page_initials} .hc7-mobile-col {
                flex-direction: column !important;
                flex-wrap: nowrap !important;
            }

            .${page_initials} .hc7-mobile-col > * {
                width: 100% !important;
                max-width: 100% !important;
                flex: 0 0 100% !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ─── Page Guard: only run on contact page ────────────────────────────────────
    function isContactPage() {
        return !!document.querySelector(".mantine-AppShell-root:has(#contact-form)");
    }

    function applyCoreChanges() {
        const body = document.body;
        const mainEl = q(SELECTORS_LIST.main);

        if (!body.classList.contains(page_initials)) {
            body.classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version-${test_version}`);
        }

        if (mainEl && !mainEl.classList.contains("hc7-main")) {
            mainEl.classList.add("hc7-main");
        }
    }
    function applyElementClasses() {
        const tryApply = () => {
            const topSection = q(SELECTORS_LIST.top_section);
            const formWrapper = q(SELECTORS_LIST.form_wrapper);
            const contactForm = q(SELECTORS_LIST.contact_form);
            const infoCard = q(SELECTORS_LIST.info_card);

            if (!topSection || !formWrapper) return false;

            topSection.classList.add("hc7-top-section");
            formWrapper.classList.add("hc7-form-wrapper");
            contactForm?.classList.add("hc7-contact-form");
            infoCard?.classList.add("hc7-info-card");

            return true;
        };

        // retry until found
        let attempts = 0;
        const interval = setInterval(() => {
            if (tryApply() || attempts > 20) {
                clearInterval(interval);
            }
            attempts++;
        }, 200);
    }

    function observeDOMAndReapply() {
        let timeout;

        const observer = new MutationObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                applyCoreChanges();
                applyElementClasses();
            }, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function init() {
        applyCoreChanges();
        applyElementClasses(); // 🔥 ADD THIS

        injectStyles();

        console.log("top_section after render:", q(SELECTORS_LIST.top_section));


        if (test_variation === 1) {
            modifyTopSection(1);
        } else if (test_variation === 2) {
            modifyTopSection(2);
        }

        moveInfoCards();
        updateButtonText();
        addFiftyYearsBadge();
        setupMobileLayout();

        observeDOMAndReapply(); // 🔥 ADD THIS

        logInfo("init complete");
    }

    function checkForItems() {
        const alreadyInit = document.body.classList.contains(page_initials);
        const hasContactForm = isContactPage();
        const hasGrid = !!q(SELECTORS_LIST.form_wrapper);
        return !alreadyInit && hasContactForm && hasGrid;
    }

    try {
        await waitForElementAsync(checkForItems);
        init();
    } catch (error) {
        logInfo(`error: ${error.message}`);
        return false;
    }
})();
