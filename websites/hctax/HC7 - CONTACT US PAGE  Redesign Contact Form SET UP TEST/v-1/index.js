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
        page_initials: "AB-HC7",
        test_variation: 2,
        test_version: 0.0002,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

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

    function waitForElementAsync(waitFor, timeout = 30000, frequency = 100) {
        return new Promise((resolve, reject) => {
            const check = () => {
                if (typeof waitFor === "function" ? waitFor() : document.querySelector(waitFor)) {
                    resolve();
                } else if ((timeout -= frequency) <= 0) {
                    reject(new Error(`Timeout waiting for: ${waitFor}`));
                } else {
                    setTimeout(check, frequency);
                }
            };
            check();
        });
    }

    const q = (s, r = document) => r.querySelector(s);
    function qAll(s, r) {
        return Array.from((r || document).querySelectorAll(s));
    }

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
    const isSmallerDisplay = () => window.matchMedia("(max-width: 1200px)").matches;

    const SELECTORS_LIST = {
        main: "main",
        topSectionContainer: "main div:nth-child(2) .mantine-Container-root",
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

    const ICONS = Object.freeze({
        never_miss: `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="50" height="50" fill="white" fill-opacity="0.1"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.3335 11.6667H41.6668V23.2553L36.3817 19.349L21.7537 39.1398H31.4392L29.583 41.6667H8.3335V11.6667ZM41.6668 29.1398V29.0223L41.58 29.1398H41.6668Z" fill="white" fill-opacity="0.15"/>
<path d="M41.6668 11.6667H8.3335V18.3333H41.6668V11.6667Z" fill="#FFC200"/>
<path d="M26.6668 41.6667H8.3335V11.6667H41.6668V21.6667" stroke="white" stroke-width="2"/>
<path d="M8.3335 18.3333H41.6668" stroke="white" stroke-width="2"/>
<path d="M15 6.66666V11.6667" stroke="white" stroke-width="2"/>
<path d="M35 6.66666V11.6667" stroke="white" stroke-width="2"/>
<path d="M38.4213 25L31.667 34.1383H41.3162L34.5617 43.3333" stroke="white" stroke-width="2"/>
</svg>
`,
        tax_savings: `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="50" height="50" fill="white" fill-opacity="0.1"/>
<g clip-path="url(#clip0_3_527)">
<path d="M31.6667 43.3332C38.11 43.3332 43.3333 40.7747 43.3333 37.6188V31.6667H20V37.6188C20 40.7747 25.2233 43.3332 31.6667 43.3332Z" fill="#FFC200"/>
<path d="M18.3911 36.6666C24.8343 36.6666 30.0578 34.1083 30.0578 30.9523L29.9998 18.3333H6.6665L6.72444 30.9523C6.72444 34.1083 11.9478 36.6666 18.3911 36.6666Z" fill="#FFC200"/>
<path d="M20 31.6667C20 32.9927 21.2292 34.2645 23.4171 35.2022C25.605 36.1399 28.5725 36.6667 31.6667 36.6667C34.7609 36.6667 37.7283 36.1399 39.9162 35.2022C42.1042 34.2645 43.3333 32.9927 43.3333 31.6667C43.3333 30.3406 42.1042 29.0688 39.9162 28.1311C37.7283 27.1934 34.7609 26.6667 31.6667 26.6667C28.5725 26.6667 25.605 27.1934 23.4171 28.1311C21.2292 29.0688 20 30.3406 20 31.6667Z" fill="white" fill-opacity="0.15"/>
<path d="M6.6665 18.3333C6.6665 19.6594 7.89567 20.9312 10.0836 21.8688C12.2715 22.8065 15.239 23.3333 18.3332 23.3333C21.4274 23.3333 24.3948 22.8065 26.5828 21.8688C28.7707 20.9312 29.9998 19.6594 29.9998 18.3333C29.9998 17.0072 28.7707 15.7355 26.5828 14.7978C24.3948 13.8601 21.4274 13.3333 18.3332 13.3333C15.239 13.3333 12.2715 13.8601 10.0836 14.7978C7.89567 15.7355 6.6665 17.0072 6.6665 18.3333Z" fill="white" fill-opacity="0.15"/>
<path d="M6.6665 18.345V30.9517C6.6665 33.5402 10.1807 35.7268 14.9998 36.4293" stroke="white" stroke-width="2"/>
<path d="M31.2441 18.7557L43.3331 6.66666" stroke="white" stroke-width="2"/>
<path d="M32.1924 8.29342L32.8719 7.61392L33.5514 8.29342L32.8719 8.97294L32.1924 8.29342Z" stroke="white" stroke-width="2"/>
<path d="M41.0254 17.1281L41.7049 16.4485L42.3844 17.1281L41.7049 17.8076L41.0254 17.1281Z" stroke="white" stroke-width="2"/>
<path d="M20 31.6667C20 32.9927 21.2292 34.2645 23.4171 35.2022C25.605 36.1399 28.5725 36.6667 31.6667 36.6667C34.7609 36.6667 37.7283 36.1399 39.9162 35.2022C42.1042 34.2645 43.3333 32.9927 43.3333 31.6667C43.3333 30.3406 42.1042 29.0688 39.9162 28.1311C37.7283 27.1934 34.7609 26.6667 31.6667 26.6667C28.5725 26.6667 25.605 27.1934 23.4171 28.1311C21.2292 29.0688 20 30.3406 20 31.6667Z" stroke="white" stroke-width="2"/>
<path d="M6.6665 24.2855C6.6665 26.874 10.1807 29.0607 14.9998 29.7632" stroke="white" stroke-width="2"/>
<path d="M20 31.6667V37.6188C20 40.7747 25.2233 43.3332 31.6667 43.3332C38.11 43.3332 43.3333 40.7747 43.3333 37.6188V31.6667" stroke="white" stroke-width="2"/>
<path d="M27.4998 15.24C25.3635 14.0788 22.0515 13.3333 18.3332 13.3333C11.8899 13.3333 6.6665 15.5719 6.6665 18.3333C6.6665 21.0947 11.8899 23.3333 18.3332 23.3333C22.0515 23.3333 25.3635 22.5878 27.4998 21.4266" stroke="white" stroke-width="2"/>
</g>
<defs>
<clipPath id="clip0_3_527">
<rect width="40" height="40" fill="white" transform="translate(5 5)"/>
</clipPath>
</defs>
</svg>
`,
        peace_of_mind: `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="50" height="50" fill="white" fill-opacity="0.1"/>
<path d="M43.3332 43.3343C36.6665 28.0005 13.3332 36.6667 6.6665 41.669V43.3332L43.3332 43.3343Z" fill="#FFC200"/>
<path d="M43.3333 12.5C43.3333 14.8012 41.4678 16.6667 39.1667 16.6667C36.8655 16.6667 35 14.8012 35 12.5C35 10.1988 36.8655 8.33334 39.1667 8.33334C41.4678 8.33334 43.3333 10.1988 43.3333 12.5Z" fill="white" fill-opacity="0.15"/>
<path d="M18.694 15.7375C13.0196 17.258 9.07728 22.0162 8.32227 27.492L20.9379 24.1117L33.5535 20.7313C30.1618 16.3667 24.3685 14.217 18.694 15.7375Z" fill="#FFC200"/>
<path d="M6.6665 41.6692C13.3332 36.6667 36.6665 28.0005 43.3332 43.3343" stroke="white" stroke-width="2"/>
<path d="M43.3333 12.5C43.3333 14.8012 41.4678 16.6667 39.1667 16.6667C36.8655 16.6667 35 14.8012 35 12.5C35 10.1988 36.8655 8.33334 39.1667 8.33334C41.4678 8.33334 43.3333 10.1988 43.3333 12.5Z" stroke="white" stroke-width="2"/>
<path d="M18.694 15.7375C13.0196 17.258 9.07728 22.0162 8.32227 27.492L20.9379 24.1117L33.5535 20.7313C30.1618 16.3667 24.3685 14.217 18.694 15.7375Z" stroke="white" stroke-width="2"/>
<path d="M23.8546 35.0017L20.9375 24.1145" stroke="white" stroke-width="2"/>
<path d="M18.6937 15.7402L17.6152 11.7155" stroke="white" stroke-width="2"/>
</svg>
`,
        phone_icon: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.4569 12.9985C17.4569 9.98555 15.0144 7.54309 12.0015 7.54309" stroke="#273658" stroke-width="1.5"/>
<path d="M22.4702 12.9985C22.4702 7.2168 17.7832 2.52979 12.0015 2.52979" stroke="#273658" stroke-width="1.5"/>
<path d="M4.89079 6.06165L2.60815 6.33511C2.75132 8.91948 3.47991 11.4775 4.79395 13.7934C5.53491 15.0993 6.46201 16.3282 7.57527 17.4414C8.68851 18.5546 9.91743 19.4818 11.2233 20.2228C13.5392 21.5367 16.0972 22.2654 18.6816 22.4085L18.9551 20.1259" stroke="#273658" stroke-width="1.5"/>
<path d="M11.2231 20.2227L13.6026 16.2358L19.2283 17.8432L18.9549 20.1258" stroke="#273658" stroke-width="1.5"/>
<path d="M4.7937 13.7934L8.78053 11.4139L7.17319 5.78821L4.89055 6.06167" stroke="#273658" stroke-width="1.5"/>
</svg>
`,
        mail_icon: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.51489 18.4822V22.4703" stroke="#273657" stroke-width="1.5"/>
<path d="M17.4851 18.4822V22.4703" stroke="#273657" stroke-width="1.5"/>
<path d="M12.5 18.4822V24.4643" stroke="#273657" stroke-width="1.5"/>
<path d="M3.52686 1.53271H21.4733V15.491H3.52686V1.53271Z" stroke="#273657" stroke-width="1.5"/>
<path d="M3.52686 3.52673L12.5001 8.51185L21.4733 3.52673" stroke="#273657" stroke-width="1.5"/>
</svg>
`,
        location_icon: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.4762 17.4851L22.4703 23.4673H2.52979L4.52383 17.4851" stroke="#263557" stroke-width="1.5"/>
<path d="M12.9985 9.01045H12.0015V8.01343H12.9985V9.01045Z" stroke="#263557" stroke-width="1.5"/>
<path d="M5.52075 8.54626C5.52075 13.2219 12.4999 18.4821 12.4999 18.4821C12.4999 18.4821 19.4791 13.2219 19.4791 8.54626C19.4791 4.67279 16.3544 1.53271 12.4999 1.53271C8.64543 1.53271 5.52075 4.67279 5.52075 8.54626Z" stroke="#263557" stroke-width="1.5"/>
</svg>
`,
    });

    const TOP_CARDS_DATA = [
        {icon: ICONS.never_miss, text: `Never Miss A <br> Deadline Again`},
        {icon: ICONS.tax_savings, text: `Unlock <br> Tax Savings`},
        {icon: ICONS.peace_of_mind, text: `Complete <br> Peace Of Mind`},
    ];

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

    function modifyTopSection() {
        const main = q("main");
        const sections = main ? main.children : [];

        const topSectionContainer = q(SELECTORS_LIST.topSectionContainer);
        const secondSection = sections[1];

        if (topSectionContainer) {
            topSectionContainer.removeAttribute("style");
            topSectionContainer.classList.add("hc7-top-section");
        }

        if (secondSection) {
            secondSection.removeAttribute("style");
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

    function moveInfoCardsBelowForm() {
        const infoColumn = q(".hc7-main " + SELECTORS_LIST.infoCardColumn);
        const formCard = q(SELECTORS_LIST.formCard);

        const formRow = q(SELECTORS_LIST.formRow);
        if (isSmallerDisplay()) {
            formRow.style.setProperty("--container-size", "var(--container-size-sm)");
        } else {
            formRow.style.setProperty("--container-size", "var(--container-size-md)");
        }

        if (!infoColumn || !formCard) {
            logInfo("Info column or form card not found");
            return;
        }

        const gridRoot = q(SELECTORS_LIST.formParentContainer);
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
            <div class="hc7-info-cards-container">
                <div class="hc7-info-cards-wrapper">
                    ${infoCardsHTML}
                </div>
            </div>
        `;

        infoColumn.style.display = "none";

        const gridInner = gridRoot.querySelector(".mantine-Grid-inner");
        if (gridInner) {
            const formCol = gridInner.querySelector(".mantine-Grid-col:last-child");
            if (formCol) formCol.classList.add("hc7-form-col--full");
        }

        logInfo("Info cards moved below contact form");
    }

    function updateButton() {
        const btnSpan = q(SELECTORS_LIST.btnText);
        if (btnSpan) {
            btnSpan.textContent = "Schedule Your Free Consultation";
            const button = btnSpan.closest("button");
            if (button) {
                button.removeAttribute("style");
                button.classList.add("hc7-btn--updated");
            }
        }
    }

    function addFiftyYearsBadge() {
        const formCard = q(SELECTORS_LIST.formCard);
        if (!formCard) return;
        if (q(".hc7-fifty-badge")) return;

        const badge = document.createElement("div");
        badge.className = "hc7-fifty-badge";
        badge.innerHTML = `
             <span class="hc7-fifty-badge__icon"><img src="https://sb.monetate.net/img/1/1722/6076651.png" alt="50 Years of Service" /></span>
            <span class="hc7-fifty-badge__text">${isMobile() ? "Proudly Serving <br /> for Over 50 Years" : "Proudly Serving for Over 50 Years"} </span>
        `;
        formCard.insertAdjacentElement("afterend", badge);
    }

    function modifyFormPadding() {
        const contactForm = q(SELECTORS_LIST.contactForm);
        if (contactForm) {
            const formSection = contactForm.closest(".mantine-Grid-root")?.closest(".mantine-Container-root")?.parentElement;

            if (formSection && formSection.hasAttribute("style")) {
                formSection.style.setProperty("padding-block", "calc(3rem * var(--mantine-scale))");
            }
        }
    }

    function addFormHeader() {
        const contactForm = q(SELECTORS_LIST.contactForm);
        if (!contactForm) return;
        if (contactForm.querySelector(".hc7-form-header")) return;

        const header = document.createElement("div");
        header.className = "hc7-form-header";
        header.innerHTML = `
            <p class="hc7-form-header__title">Contact Us</p>
            <p class="hc7-form-header__sub">You may reach us by phone, email, or click sign up to schedule a property tax consultation today.</p>
        `;
        contactForm.insertBefore(header, contactForm.firstChild);

        const grids = qAll("#contact-form .mantine-SimpleGrid-root");
        if (grids.length > 1) {
            grids[grids.length - 1].classList.add("hc7-last-grid");
        }
    }

    function groupEmailAndPhone() {
        const form = document.querySelector("#contact-form form");
        if (!form) return;

        const fields = [...form.children];

        let emailField = null;
        let phoneField = null;

        fields.forEach((el) => {
            const label = el.querySelector("label")?.textContent?.toLowerCase();

            if (label?.includes("email")) emailField = el;
            if (label?.includes("phone")) phoneField = el;
        });

        if (!emailField || !phoneField) return;

        if (document.querySelector(".hc7-email-phone-grid")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "mantine-SimpleGrid-root hc7-email-phone-grid";

        emailField.parentNode.insertBefore(wrapper, emailField);
        wrapper.appendChild(emailField);
        wrapper.appendChild(phoneField);
    }

    function replaceInfoCardIcons() {
        const svgs = qAll(".hc7-main .mantine-Card-root svg");

        if (!svgs.length) return;

        svgs.forEach((svg) => {
            const iconType = svg.getAttribute("data-icon");

            if (!iconType) return;

            let newIcon = "";

            if (iconType.includes("phone")) newIcon = ICONS.phone_icon;
            else if (iconType.includes("envelope") || iconType.includes("mail")) newIcon = ICONS.mail_icon;
            else if (iconType.includes("location")) newIcon = ICONS.location_icon;

            if (!newIcon) return;

            if (svg.classList.contains("hc7-replaced")) return;

            const wrapper = document.createElement("div");
            wrapper.innerHTML = newIcon;

            const newSvg = wrapper.firstElementChild;

            if (newSvg) {
                newSvg.classList.add("hc7-replaced");
                svg.replaceWith(newSvg);
            }
        });
    }

    function fixThirdInfoCardAddress() {
        const cards = document.querySelectorAll(".mantine-Card-root");
        const thirdCard = cards[2];
        if (!thirdCard) return;

        const addressDiv = thirdCard.querySelector(".mantine-Stack-root > div:last-child");
        if (!addressDiv) return;

        const plainText = addressDiv.innerText.replace(/\s+/g, " ").trim();
        addressDiv.innerHTML = plainText;
    }

    setInterval(fixThirdInfoCardAddress, 500);

    function injectStyles() {
        const existingStyle = document.getElementById("hc7-styles");
        if (existingStyle) existingStyle.remove();

        const style = document.createElement("style");
        style.id = "hc7-styles";
        style.textContent = `
                .${page_initials} .hc7-main:has(.hc7-top-section),
                .${page_initials} .hc7-main:has(.hc7-form-col--full) {
                    position: relative;
                    background: 
                        url("https://sb.monetate.net/img/1/1723/6071695.png") top center / 100% auto no-repeat,
                        #263557;
                }

                .${page_initials} .hc7-main:has(.hc7-top-section)::before,
                .${page_initials} .hc7-main:has(.hc7-form-col--full)::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: #263557;
                    opacity: 0.2;
                    pointer-events: none;
                    z-index: 0;
                }

            .${page_initials} .hc7-main > * {
                position: relative;
                z-index: 1;
            }

            .${page_initials} .hc7-main > div:not(:last-child) {
                background: transparent !important;
            }

            .${page_initials} .hc7-top-section {
                padding-top: 71px !important;
            }

             .${page_initials} .hc7-top-section div:has(h1){
                margin-bottom: 45px !important;
                }

            .${page_initials} .hc7-top-section h1 {
                width: 70%;
                margin: 0 auto;
                color: #ffffff !important;
                font-size: 55px !important;
                font-weight: 600 !important;
                line-height: 65px;
                letter-spacing: 0%;
                font-family: "Roboto Serif", serif;
            }

            .${page_initials} .hc7-top-section p {
                text-align: center !important;
                font-family: "Roboto Serif", serif;
                font-size: 20px !important;
                font-weight: 400 !important;
                color: #FFFFFF !important;
                opacity: 0.8;
                line-height: 34px;
                letter-spacing: 0%;
            }

            .${page_initials} .hc7-top-section__p--trimmed {
                color: rgba(255, 255, 255, 0.88) !important;
                font-size: 15px;
                line-height: 1.55;
                margin-bottom: 0;
            }

            .${page_initials} .hc7-top-cards {
                display: flex;
                gap: 60px;
                margin-top: 50px;
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
                flex: 0 0 auto !important;
            }

            .${page_initials} .hc7-top-card__icon svg {
                width: 50px;
                height: 50px;
                min-width: 50px;
                min-height: 50px;
            }

            .${page_initials} .hc7-top-card__text {
                text-align: start;
                font-size: 16px;
                font-weight: 500;
                color: #ffffff;
                line-height: 1.3;
                letter-spacing: 0.3px;
            }

            .${page_initials} .hc7-form-col--full {
                flex: 0 0 100% !important;
                max-width: 100% !important;
            }
            .${page_initials}  .hc7-form-col--full .mantine-Card-root {
                padding: 0 !important;
                border-radius: 5px !important;
                filter: drop-shadow(0px 5px 5px #26355708) !important;
                }
            .${page_initials} .hc7-form-col--full #contact-form {
                padding: 40px 60px 30px 40px !important;
            }

            .${page_initials} .hc7-form-header {
                text-align: center;
                max-width: 80%;
                margin: 0 auto;
                padding-bottom: 14px;
            }

            .${page_initials} .hc7-form-header__title {
                font-size: 36px !important;
                font-weight: 500 !important;
                color: #263557 !important;
                margin: 0 0 6px !important;
                line-height: 100%;
                letter-spacing: 0%;
            }

            .${page_initials} .hc7-form-header__sub {
                max-width: 80%;
                margin: 0 auto;
                font-family: "Roboto Serif", serif;
                font-size: 18px !important;
                font-weight: 400 !important;
                color: #263557CC !important;
                line-height: 30px;
                letter-spacing: 0%;
            }

            .${page_initials} #contact-form label {
                margin-bottom: 15px !important;
                color: #263557;
                font-family: "Roboto Serif", serif;
                font-weight: 500;
                font-size: 14px;
                line-height: 100%;
                text-transform: capitalize;
           }
            .${page_initials} #contact-form input,
            .${page_initials} #contact-form textarea, 
            .${page_initials} #contact-form select {
                border: 1px solid #C1C8CD !important;
                border-radius: 2px !important;
                filter: drop-shadow(0px 5px 5px #26355708);
                }

            .${page_initials} #contact-form .hc7-email-phone-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .${page_initials} #contact-form form > * {
                margin: 12px 0 !important;
            }
          .${page_initials} #contact-form textarea {
    margin-bottom: 0 !important;
}
            .${page_initials} #contact-form .hc7-last-grid {
                padding-top: 10px !important;
            }

            .${page_initials} .hc7-btn--updated {
                background-color: #F5C518;
                color: #263557 !important;
                font-weight: 600;
                font-size: 20px;
                width: 100%;
                height: 80px;
                cursor: pointer;
                outline: 1px solid #e0b100;
                border: 10px solid white;
                border-radius: 0;
                transition: all 0.2s ease;
                margin-top: 40px;
            }

            .${page_initials} .hc7-btn--updated:hover {
                opacity: 0.9;
                transform: scale(1.01);
            }

            .${page_initials} .hc7-fifty-badge {
                padding-bottom: 40px !important;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                text-align: center;
                background: transparent !important;
            }

            .${page_initials} .hc7-fifty-badge__icon {
                 flex: 0 0 auto;
            }

            .${page_initials} .hc7-fifty-badge__icon img {
                width: 70px;
                height: 75px;
            }

            .${page_initials} .hc7-fifty-badge__text {
                font-weight: 400;
                font-size: 14px;
                color: #263557;
                letter-spacing: 2%;
                line-height: 100%;
            }

            .${page_initials} .hc7-bottom-info-cards {
                margin-top: 90px;
            }

            .${page_initials} .hc7-info-cards-container {
                max-width: 100%;
                margin: 0 auto;
                padding: 0 calc(9.2vw + 10px);
            }

            .${page_initials} .hc7-info-cards-wrapper {
                display: flex;
                justify-content: center;
                gap: 20px;
            }

            .${page_initials} .hc7-info-cards-wrapper .mantine-Card-root {
                position: relative;
                width: 280px !important;
                flex: 1 !important;
                padding-top: 50px !important;
                padding-bottom: 30px !important;
                text-align: center;
                border-radius:5px !important;
                filter: drop-shadow(0px 5px 5px #26355708);
            }

            .${page_initials} .hc7-info-cards-wrapper .mantine-Stack-root {
                margin-top: 0 !important;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                gap: 12px;
                font-family: "Roboto Serif", serif;
                font-weight: 500;
                font-size: 18px;
                color: #263557 !important;
                line-height: 30px;
                letter-spacing: 0%;
            }

            .${page_initials} .hc7-info-cards-wrapper .mantine-Stack-root > div:first-child {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                padding: var(--mantine-spacing-xs);
                background: var(--mantine-color-primary-filled);
                width: calc(3.375rem * var(--mantine-scale));
                border-radius: var(--mantine-radius-xs);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
            }

            .${page_initials} .hc7-info-cards-wrapper .mantine-Stack-root > div:last-child {
                text-align: center;
                font-size: 16px;
                line-height: 1.5;
            }

            .hc7-info-cards-wrapper .mantine-Card-root{
            margin-top: 0 !important;
            }
       .${page_initials} .hc7-bottom-info-cards .mantine-Stack-root > div:first-child {
            border-radius: 5px !important;
            }

            @media (max-width: 1400px) {
                .${page_initials} .hc7-info-cards-container {
                    padding: 0 calc(3.2vw + 10px);
                }
            }

            @media (max-width: 992px) {
              .${page_initials} .hc7-top-section h1 {
                width: 85%;
            }
                .${page_initials} .hc7-info-card--moved {
                    width: calc(50% - 12px) !important;
                }
                .${page_initials} .hc7-info-cards-container {
                    padding: 0 calc(1.25vw + 10px);
                }
            }
            @media (min-width: 769px) {
           .${page_initials} .hc7-info-cards-wrapper .mantine-Stack-root > div:last-child {
                max-width: 200px;
            }
            }

            @media (max-width: 768px) {
             .${page_initials} .hc7-main:has(.hc7-top-section),
                .${page_initials} .hc7-main:has(.hc7-form-col--full)  {
               background-size: 150%;
               background-position: center 100px;
            }
                .${page_initials} .hc7-top-section {
                    padding-top: 40px !important;
                }
                .${page_initials} .hc7-top-section div:has(h1){
                margin-bottom: 30px !important;
                }
                .${page_initials} .hc7-top-section h1 {
                    width: 85%;
                    font-size: 40px !important;
                    line-height: 45px;
                }
                .${page_initials} .hc7-top-section p{
                font-size: 16px !important;
                line-height: 26px !important;
                }
                .${page_initials} .hc7-top-cards {
                gap: 20px;
                margin-top: 35px;
                }
                .${page_initials} .hc7-top-card {
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 16px;
                }
                .${page_initials} .hc7-top-card__text {
                    text-align: center;
                    font-size: 12px;
                }
                .${page_initials} .hc7-top-card__icon svg {
                    width: 32px;
                    height: 32px;
                    min-width: 32px;
                    min-height: 32px;
                }
                .${page_initials} .hc7-form-col--full #contact-form {
                padding: 30px 20px 25px 30px !important;
                }
                .${page_initials} #contact-form .hc7-last-grid {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 10px !important;
                }
                .${page_initials} .hc7-info-card--moved {
                    width: 100% !important;
                }
                .${page_initials} .hc7-form-header {
                    max-width: 100%;
                }
                .${page_initials} .hc7-form-header__title {
                    font-size: 24px !important;
                }
                .${page_initials} .hc7-form-header__sub {
                    max-width: 100%;
                    font-size: 12px !important;
                    line-height: 22px;
                }
                .${page_initials} #contact-form label {
                font-size: 12px;
             }
                .${page_initials} .hc7-bottom-info-cards {
                    margin-top: 40px;
                }
                .${page_initials} .hc7-bottom-info-cards .mantine-Stack-root div:has(.hc7-replaced) {
                border-radius:5px;
                }
                .${page_initials} .hc7-info-cards-wrapper {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 25px !important;
                }
                .${page_initials} .hc7-info-cards-wrapper .mantine-Card-root {
                    width: 100% !important;
                    flex: 0 0 auto !important;
                    padding: var(--mantine-spacing-md) 16px !important;
                    text-align: left;
                    margin-top: 0 !important;
                    margin-bottom: 0 !important;
                }
                .${page_initials} .hc7-info-cards-wrapper .mantine-Stack-root {
                    margin-top: 0 !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    gap: 16px !important;
                    font-family: "Roboto Serif", serif;
                }
                .${page_initials} .hc7-info-cards-wrapper .mantine-Stack-root > div:first-child {
                    position: relative;
                    top: auto;
                    left: auto;
                    transform: none;
                    flex-shrink: 0;
                    margin: 0;
                }
                .${page_initials} .hc7-info-cards-wrapper .mantine-Stack-root > div:last-child {
                    text-align: left;
                    flex: 1;
                }
                .${page_initials} .hc7-btn--updated {
                    font-size: 14px;
                    height: 60px;
                    margin-top: 25px;
                }
                .${page_initials} .hc7-fifty-badge {
                    max-width: 68vw;
                    padding-bottom: 30px !important;
                    margin: 0 auto !important;
                }
                .${page_initials} .hc7-fifty-badge__icon {
                    flex: 0 0 auto;
                }
                .${page_initials} .hc7-fifty-badge__icon img {
                    width: 50px;
                    height: 56px;
                    min-width: 50px;
                }
                .${page_initials} .hc7-fifty-badge__text {
                  font-size: 12px;
                }
            }
                        @media (max-width: 400px) {
            .${page_initials} .hc7-top-section p{
                        font-size: 14px !important;
                    }
                   .${page_initials} .hc7-btn--updated {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

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

    function init() {
        if (document.body.classList.contains("hc7-init")) return;

        const formExists = q(SELECTORS_LIST.contactForm);
        if (!formExists) return;

        document.body.classList.add("hc7-init");

        logInfo("Initializing...");

        injectStyles();
        applyCoreClasses();

        setTimeout(() => {
            modifyTopSection();
            modifyFormPadding();
            groupEmailAndPhone();
            moveInfoCardsBelowForm();
            addFormHeader();
            updateButton();
            addFiftyYearsBadge();
            replaceInfoCardIcons();
            fixThirdInfoCardAddress();
            fireGA4Event("HC7_ViewContactPage");
        }, 200);
    }

    function observePageChanges() {
        const observer = new MutationObserver(() => {
            const formExists = q(SELECTORS_LIST.contactForm);

            if (formExists && !document.body.classList.contains("hc7-init")) {
                logInfo("Observer triggered init");
                init();
            } else if (!formExists) {
                const mainEl = q("main");
                if (mainEl && mainEl.classList.contains("hc7-main")) {
                    mainEl.classList.remove("hc7-main");
                    document.body.classList.remove("hc7-init");
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function isCorrectPage() {
        return !!document.querySelector("#contact-form");
    }

    observePageChanges();
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            document.body.classList.remove("hc7-init");
            setTimeout(() => init(), 100);
        }
    });

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
