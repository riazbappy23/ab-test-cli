(async () => {
    const TEST_ID = "HC7";
    const VARIANT_ID = "V2";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Acadia",
        project: "hctax",
        site_url: "https://www.hctax.com",
        test_name: "HC7 - CONTACT US PAGE Redesign Contact Form SET UP TEST",
        page_initials: "AB-HC7-V2",
        test_variation: 2,
        test_version: 0.0002,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

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

    // ── SELECTORS — your original, unchanged ──────────────────────────────────────
    const SELECTORS_LIST = {
        main: "main",
        topSectionContainer: "div[style*='padding-block']",
        topSectionInner: ".mantine-Container-root .mantine-Center-root + p",
        formWrapper: ".mantine-Grid-inner",
        contactForm: "#contact-form",
        infoCardColumn: ".mantine-Grid-inner > .mantine-Grid-col:first-of-type",
        infoCards: ".mantine-Grid-inner > div:first-child .mantine-Card-root",
        btnText: "#contact-form button span span",
        formCard: "#contact-form",
        formParentContainer: ".mantine-Grid-root",
        formRow: "main div:nth-child(3) .mantine-Container-root",
    };

    // ── ICONS — your original + fifty_years badge SVG added ───────────────────────
    const ICONS = Object.freeze({
        never_miss: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>`,
        tax_savings: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
        peace_of_mind: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
        // Placeholder — swap from Figma later
        fifty_years: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    });

    const TOP_CARDS_DATA = [
        {icon: ICONS.never_miss, text: `Never Miss A <br> Deadline Again`},
        {icon: ICONS.tax_savings, text: `Unlock <br> Tax Savings`},
        {icon: ICONS.peace_of_mind, text: `Complete <br> Peace Of Mind`},
    ];

    // ── createTopCards — your original, unchanged ─────────────────────────────────
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

    // ── modifyTopSection — your original + overlay div injected ───────────────────
    function modifyTopSection() {
        const topSectionContainer = q(SELECTORS_LIST.topSectionContainer);
        console.log("topSectionContainer: ", topSectionContainer);

        if (topSectionContainer) {
            topSectionContainer.removeAttribute("style");
            topSectionContainer.classList.add("hc7-top-section-bg");

            // FIX: inject overlay div so the image fades seamlessly into the navy
            // form band below (can't use ::before on arbitrary elements via JS)
            if (!topSectionContainer.querySelector(".hc7-bg-overlay")) {
                const overlay = document.createElement("div");
                overlay.className = "hc7-bg-overlay";
                topSectionContainer.insertBefore(overlay, topSectionContainer.firstChild);
            }
        }

        const topParagraph = q(SELECTORS_LIST.topSectionInner);
        if (!topParagraph) {
            logInfo("Top paragraph not found");
            return;
        }

        const parentContainer = topParagraph.parentNode;
        const htmlContent = topParagraph.innerHTML;
        const brIndex = htmlContent.indexOf("<br>");
        let firstSentence = htmlContent;
        if (brIndex !== -1) {
            firstSentence = htmlContent.substring(0, brIndex).trim();
        }

        topParagraph.innerHTML = firstSentence;
        topParagraph.classList.add("hc7-top-section__p--trimmed");

        if (test_variation === 2) {
            const cards = createTopCards();
            parentContainer.insertBefore(cards, topParagraph.nextSibling);
        }
    }

    // ── moveInfoCardsBelowForm — your original + hc7-form-col--full added ─────────
    function moveInfoCardsBelowForm() {
        const infoColumn = q(".hc7-main " + SELECTORS_LIST.infoCardColumn);
        const formCard = q(SELECTORS_LIST.formCard);

        const formRow = q(SELECTORS_LIST.formRow);
        formRow.style.setProperty("--container-size", "var(--container-size-md)");

        if (!infoColumn || !formCard) {
            logInfo("Info column or form card not found");
            return;
        }

        const gridRoot = q(SELECTORS_LIST.formParentContainer);
        console.log("gridRoot: ", gridRoot);
        if (!gridRoot) {
            logInfo("Grid root not found");
            return;
        }

        const infoCardsHTML = infoColumn.innerHTML;

        let bottomContainer = q(".hc7-bottom-info-cards");
        if (!bottomContainer) {
            bottomContainer = document.createElement("div");
            bottomContainer.className = "hc7-bottom-info-cards";
            formRow.insertAdjacentElement("afterend", bottomContainer);
        }

        bottomContainer.innerHTML = `
    <div class="hc7-info-cards-container" >
        <div class="hc7-info-cards-wrapper">
            ${infoCardsHTML}
        </div>
    </div>
`;

        const infoCard = q(".hc7-info-cards-container");
        infoCard.style.setProperty("--container-size", "var(--container-size-md)");

        infoColumn.style.display = "none";

        const wrapper = q(".hc7-info-cards-wrapper", bottomContainer);
        if (wrapper) {
            wrapper.style.display = "flex";
            wrapper.style.flexWrap = "wrap";
            wrapper.style.gap = "16px";
            wrapper.style.justifyContent = "space-between";
            wrapper.style.marginTop = "32px";
            wrapper.style.marginBottom = "20px";
        }

        // FIX: mark the right (form) column so CSS can make it full-width + centred
        const gridInner = gridRoot.querySelector(".mantine-Grid-inner");
        if (gridInner) {
            const formCol = gridInner.querySelector(".mantine-Grid-col:last-child");
            if (formCol) formCol.classList.add("hc7-form-col--full");
        }

        logInfo("Info cards moved below contact form");
    }

    // ── updateButton — your original + yellow border lines added ──────────────────
    function updateButton() {
        const btnSpan = q(SELECTORS_LIST.btnText);
        if (btnSpan) {
            btnSpan.textContent = "Schedule Your Free Consultation";
            const button = btnSpan.closest("button");
            if (button) {
                button.classList.add("hc7-btn--updated");
                button.style.backgroundColor = "#F5C518";
                button.style.color = "#1a1a3e";
                button.style.fontWeight = "700";
                button.style.textTransform = "none";
                button.style.width = "100%";
                button.style.padding = "12px 24px";
                button.style.cursor = "pointer";
                // FIX: yellow border
                button.style.border = "3px solid #F5C518";
                button.style.outline = "2px solid #F5C518";
                button.style.outlineOffset = "2px";
                button.style.borderRadius = "8px";
            }
        }
    }

    // ── addFiftyYearsBadge — FIX: SVG icon now included ──────────────────────────
    function addFiftyYearsBadge() {
        const formCard = q(SELECTORS_LIST.formCard);
        if (!formCard) return;
        if (q(".hc7-fifty-badge")) return;

        const badge = document.createElement("div");
        badge.className = "hc7-fifty-badge";
        badge.innerHTML = `
            <span class="hc7-fifty-badge__icon">${ICONS.fifty_years}</span>
            <span class="hc7-fifty-badge__text">Proudly Serving for Over 50 Years</span>
        `;
        formCard.insertAdjacentElement("afterend", badge);
    }

    // ── NEW: addFormHeader — "Contact Us" + subtext inside the white card ─────────
    function addFormHeader() {
        const contactForm = q(SELECTORS_LIST.contactForm);
        if (!contactForm) return;
        if (contactForm.querySelector(".hc7-form-header")) return;

        const header = document.createElement("div");
        header.className = "hc7-form-header";
        header.innerHTML = `
            <p class="hc7-form-header__title">Contact Us</p>
            <p class="hc7-form-header__sub">You may reach us by phone, email, or click sign up to<br>schedule a property tax consultation today.</p>
        `;
        contactForm.insertBefore(header, contactForm.firstChild);
    }

    // ── setupMobileResponsive — your original, unchanged ──────────────────────────
    function setupMobileResponsive() {
        function applyResponsiveStyles() {
            const isMobile = window.innerWidth < 768;
            const bottomCards = qAll(".hc7-info-card--moved");
            bottomCards.forEach((card) => {
                if (isMobile) {
                    card.style.width = "100%";
                } else {
                    card.style.width = "calc(25% - 12px)";
                }
            });

            const formRows = qAll(".mantine-SimpleGrid-root");
            formRows.forEach((row) => {
                if (isMobile) {
                    row.style.display = "flex";
                    row.style.flexDirection = "column";
                    row.style.gap = "12px";
                } else {
                    row.style.display = "";
                    row.style.flexDirection = "";
                }
            });
        }

        applyResponsiveStyles();
        window.addEventListener("resize", applyResponsiveStyles);
    }

    // ── injectStyles — your original restructured sections + fixes ────────────────
    function injectStyles() {
        const existingStyle = document.getElementById("hc7-styles");
        if (existingStyle) existingStyle.remove();

        const style = document.createElement("style");
        style.id = "hc7-styles";
        style.textContent = `

            /* ── BACKGROUND ─────────────────────────────────────────────────────
               Hero band: city image. Overlay div fades from transparent at
               top-centre → navy at bottom, so it merges into the form band
               below with zero visible border between the two sections.       */

            .${page_initials} .hc7-top-section-bg {
                position: relative;
                background:
                    url("https://sb.monetate.net/img/1/1723/6071695.png")
                    center center / cover no-repeat !important;
                padding: 71px 0 60px 0 !important;
                overflow: hidden;
            }

            .${page_initials} .hc7-bg-overlay {
                position: absolute;
                inset: 0;
                z-index: 0;
                pointer-events: none;
                background: radial-gradient(
                    ellipse 130% 90% at 50% 10%,
                    rgba(22, 37, 94, 0.25) 0%,
                    rgba(22, 37, 94, 0.72) 55%,
                    rgba(22, 37, 94, 0.97) 100%
                );
            }

            .${page_initials} .hc7-top-section-bg h1,
.${page_initials} .hc7-top-section-bg h2 {
    color: #ffffff !important;
}

            /* All content inside the hero sits above the overlay */
            .${page_initials} .hc7-top-section-bg > *:not(.hc7-bg-overlay) {
                position: relative;
                z-index: 1;
            }

            .${page_initials} .hc7-top-section__p--trimmed {
                color: rgba(255, 255, 255, 0.88) !important;
                font-size: 15px;
                line-height: 1.55;
                margin-bottom: 0;
            }

            .${page_initials} .hc7-top-cards {
                display: flex;
                gap: 20px;
                margin-top: 24px;
                justify-content: center;
            }

            .${page_initials} .hc7-top-card {
                display: flex;
                align-items: center;
                gap: 10px;
                background: transparent !important;
                padding: 0 !important;
            }

            .${page_initials} .hc7-top-card__icon {
                color: #F5C518;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .${page_initials} .hc7-top-card__icon svg {
                width: 40px;
                height: 40px;
            }

            .${page_initials} .hc7-top-card__text {
                text-align: start;
                font-size: 14px;
                font-weight: 600;
                color: #ffffff;
                line-height: 1.3;
                letter-spacing: 0.3px;
            }

            .${page_initials} .hc7-form-col--full {
                flex: 0 0 100% !important;
                max-width: 100% !important;
            }

            .${page_initials} .hc7-form-col--full #contact-form{
             padding: 40px 60px !important;
            } 

            .${page_initials} .hc7-form-header {
                text-align: center;
                margin-bottom: 18px;
                padding-bottom: 14px;
            }

            .${page_initials} .hc7-form-header__title {
                font-size: 22px !important;
                font-weight: 700 !important;
                color: var(--mantine-color-secondary-filled, #16255e) !important;
                margin: 0 0 6px !important;
                line-height: 1.2;
            }

            .${page_initials} .hc7-form-header__sub {
                font-size: 12px !important;
                color: #555 !important;
                margin: 0 !important;
                line-height: 1.6;
            }

            /* ── BUTTON ──────────────────────────────────────────────────────── */

            .${page_initials} .hc7-btn--updated {
                transition: all 0.2s ease;
            }

            .${page_initials} .hc7-btn--updated:hover {
                opacity: 0.9;
                transform: scale(1.01);
            }

            /* ── 50 YEARS BADGE ──────────────────────────────────────────────── */

            .${page_initials} .hc7-fifty-badge {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-top: 16px;
                padding: 12px 20px;
                text-align: center;
                background: transparent !important;
            }

            .${page_initials} .hc7-fifty-badge__icon {
                color: #F5C518;
                display: flex;
                align-items: center;
                flex-shrink: 0;
            }

            .${page_initials} .hc7-fifty-badge__text {
                font-weight: 600;
                font-size: 15px;
                color: #555;
                letter-spacing: 0.3px;
            }

            /* ── BOTTOM INFO CARDS ───────────────────────────────────────────── */
/* OUTER container (same padding as form) */
.${page_initials} .hc7-info-cards-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 9.2em;
}

/* FLEX wrapper */
.${page_initials} .hc7-info-cards-wrapper {
    display: flex;
    justify-content: center;
    gap: 20px;
}

/* EACH CARD */
.${page_initials} .hc7-info-cards-wrapper .mantine-Card-root {
    width: 280px !important;
    flex: 0 0 280px !important;
}

            /* ── RESPONSIVE ──────────────────────────────────────────────────── */

            @media (max-width: 992px) {
                .${page_initials} .hc7-info-card--moved {
                    width: calc(50% - 12px) !important;
                }
            }

            @media (max-width: 768px) {
                .${page_initials} .hc7-top-cards {
                    flex-direction: column;
                    gap: 16px;
                }
                .${page_initials} .hc7-top-card {
                    flex-direction: row;
                    justify-content: flex-start;
                    gap: 16px;
                }
                .${page_initials} .hc7-top-card__icon svg {
                    width: 28px;
                    height: 28px;
                }
                .${page_initials} .hc7-info-card--moved {
                    width: 100% !important;
                }
                .${page_initials} .hc7-form-col--full .mantine-Card-root {
                    max-width: 100%;
                }
            }

            @media (max-width: 480px) {
                .${page_initials} .hc7-bottom-info-cards {
                    margin-top: 24px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ── applyCoreClasses — your original, unchanged ───────────────────────────────
    function applyCoreClasses() {
        const body = document.body;
        if (!body.classList.contains(page_initials)) {
            body.classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version-${test_version}`);
        }

        const mainEl = q("main");
        if (mainEl && !mainEl.classList.contains("hc7-main")) {
            mainEl.classList.add("hc7-main");
        }
    }

    // ── init — your original + addFormHeader() call added ─────────────────────────
    function init() {
        logInfo("Initializing...");

        applyCoreClasses();
        injectStyles();

        setTimeout(() => {
            modifyTopSection();
            moveInfoCardsBelowForm();
            addFormHeader(); // NEW: "Contact Us" header inside white card
            updateButton();
            addFiftyYearsBadge();
            setupMobileResponsive();
            logInfo("All modifications applied successfully");
        }, 200);
    }

    function isCorrectPage() {
        return !!document.querySelector("#contact-form");
    }

    // ── wait + trigger — your original, unchanged ─────────────────────────────────
    try {
        await waitForElementAsync(() => !!document.querySelector("#contact-form"), 10000);
        await waitForElementAsync(() => !!document.querySelector(".mantine-Grid-inner"), 5000);
        init();
    } catch (error) {
        logInfo(`Error during initialization: ${error.message}`);
        setTimeout(() => {
            if (isCorrectPage()) {
                logInfo("Fallback initialization");
                init();
            }
        }, 2000);
    }
})();
