(async () => {
    const TEST_ID = "Test005";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cNetzproduzent%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Netzproduzent",
        project: "ils",
        site_url: "https://www.ils.de",
        test_name: "Test005 [ILS] - Course Page: School Diplomas - Credibility Through Photos and Terminology",
        page_initials: "AB-TEST005",
        test_variation: 1,
        test_version: 0.0001,
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

    const IMAGES = Object.freeze({
        DESKTOP_HERO: "https://www.ils.de/fileadmin/bilder/testing/ils-headerbild-abitur-desktop.png",
        MOBILE_HERO: "https://www.ils.de/fileadmin/bilder/testing/ils-headerbild-abitur-mobile.png",
        REVIEW: "https://www.ils.de/fileadmin/_processed_/5/e/csm_siegel-fernstudium-direkt_73726858b9.png",
        AWARD: "https://www.ils.de/fileadmin/_processed_/3/9/csm_top-fernschule_488bd5c858.png",
    });

    const CTA_URL = "https://www.ils.de/fernkurse/abitur-nachholen/#sud-formular";

    const checkSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="16" height="16" fill="url(#pattern0_70_49)"/>
<defs>
<pattern id="pattern0_70_49" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_70_49" transform="scale(0.00390625)"/>
</pattern>
<image id="image0_70_49" width="256" height="256" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
`;

    const ctaArrowSvg = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.3738 9.45728L10.5295 2.61292L9.16059 3.98179L13.6683 8.48954H2.59375V10.4251H13.6683L9.16059 14.9328L10.5295 16.3017L17.3738 9.45728Z" fill="#BCD8FA"/>
</svg>
`;

    function createHeroHTML() {
        return `
            <section class="test005-hero">
                <div class="test005-wrapper">
                    <div class="test005-img-wrap">
                        <img class="test005-img test005-img--desktop" src="${IMAGES.DESKTOP_HERO}" alt="Abitur im Fernlehrgang nachholen">
                        <div class="test005-mobile-img-wrap">
                            <div class="test005-badges-overlay">
                                <img class="test005-badge-img" src="${IMAGES.REVIEW}" alt="Sehr Empfehlenswert">
                                <img class="test005-badge-img" src="${IMAGES.AWARD}" alt="Top Fernschule Award 2026">
                            </div>
                            <img class="test005-img test005-img--mobile" src="${IMAGES.MOBILE_HERO}" alt="Abitur im Fernlehrgang nachholen">
                        </div>
                    </div>
                    <div class="test005-card">
                        <h1 class="test005-heading">Abitur im Fernlehrgang nachholen</h1>
                        <ul class="test005-list">
                            <li class="test005-list-item">${checkSvg}<span>Flexibel neben dem Alltag</span></li>
                            <li class="test005-list-item">${checkSvg}<span>Staatlich anerkannter Abschluss</span></li>
                            <li class="test005-list-item">${checkSvg}<span>Jederzeit starten</span></li>
                        </ul>
                        <div class="test005-badges-card">
                            <img class="test005-badge-img" src="${IMAGES.REVIEW}" alt="Sehr Empfehlenswert">
                            <img class="test005-badge-img" src="${IMAGES.AWARD}" alt="Top Fernschule Award 2026">
                        </div>
                        <a href="${CTA_URL}" class="test005-cta  link--with-icon" >
                            <span class="test005-cta-icon">${ctaArrowSvg}</span>
                            <span>kostenloses Infomaterial anfordern</span>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }

    function injectStyles() {
        const STYLE_ID = "test005-styles-v2";
        if (q(`#${STYLE_ID}`)) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            .test005-hero {
                width: 100%;
                font-family: inherit;
                overflow: hidden;
            }
            .test005-wrapper {
                position: relative;
                width: 100%;
            }
            .test005-img-wrap {
                position: relative;
                line-height: 0;
            }
            .test005-img {
                display: block;
                width: 100%;
                height: 800px;
                object-fit: cover;
                object-position: center;
            }
            .test005-img--mobile {
                display: none;
            }
            .test005-mobile-img-wrap {
                display: none;
            }
            .test005-badges-overlay {
                display: none;
            }

            .test005-card {
                position: absolute;
                top: 50%;
                left: 5.5%;
                transform: translateY(-50%);
                background: #ffffff;
                border-radius: 15px;
                padding: 13px 37px 30px;
                width: 492px;
                box-shadow: 0 4px 32px rgba(0, 0, 0, 0.12);
                box-sizing: border-box;
            }

              .test005-hero .btn{
              border: none !importan;
            }

            .test005-heading {
                color: #FA6400;
                margin: 0 0 13px;
                font-family: Noto Sans;
                font-weight: 700;
                font-size: 36px;
                line-height: 45px;
                letter-spacing: 0%;
            }
            .test005-list {
                list-style: none;
                padding: 0;
                margin: 0 0 20px;
            }
            .test005-list-item {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #222;
                font-family: Noto Sans;
                font-weight: 400;
                font-size: 24px;
                line-height: 45px;
                letter-spacing: 0%;

            }
            .test005-list-item:last-child {
                margin-bottom: 0;
            }
            .test005-list-item svg {
                flex-shrink: 0;
            }
            .test005-badges-card {
                display: flex;
                align-items: center;
                gap: 40px;
                margin: 40px 0;
            }
            .test005-badges-card .test005-badge-img {
                max-width: 200px;
                height: 150px;
                object-fit: fit;
            }

            .test005-cta {
                display: flex;
                align-items: center;
                gap: 15px;
                background: #BCD8FA !important;
                color: #09479B !important;
                border-radius: 30px;
                padding: 10px 27px;
                font-family: Noto Sans;
                font-weight: 400;
                font-size: 18px;
                line-height: 27px;
                letter-spacing: 0%;
                text-decoration: none;
                width: 100%;
                box-sizing: border-box;
                justify-content: flex-start;
                transition: background 0.2s;
            }
            .test005-cta:hover,
            .test005-cta:focus {
                background: #4585B8;
                color: #ffffff;
                text-decoration: none;
            }
            .test005-cta-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 27px;
                height: 27px;
                border-radius: 50%;
                background: #09479B;
                flex-shrink: 0;
            }
         @media (max-width: 1200px) {
              .test005-heading {
                font-weight: 700;
                font-size: 26px;
                line-height: 40px;
            }
               .test005-card {
                 width: max-content !important;
               }
            .test005-badges-card .test005-badge-img {
                max-width: 200px !important;
                height: auto !important;
               }
            .test005-badges-card {
                gap: 30px;
                margin: 30px 0;
              }
        }

            @media (max-width: 767px) {
                .test005-hero {
                    overflow: unset;
                    overflow-y:visible !important;
                    padding-bottom:110px;
                }
                .test005-wrapper {
                    display: flex;
                    flex-direction: column;
                }
                .test005-img--desktop {
                    display: none;
                }
                .test005-mobile-img-wrap {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 423px;
                    overflow: hidden;
                }
                .test005-img--mobile {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: top center;
                }
                .test005-badges-overlay {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 12px;
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    z-index: 2;
                }
                .test005-badges-overlay .test005-badge-img {
                    height: auto;
                    max-width: 110px;
                    object-fit: contain;
                }

                .test005-card {
                    position: absolute;
                    left: 16px;
                    top:100%;
                    width: calc(100% - 28px) ;
                    margin: 0 auto; 
                    min-width: unset;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
                    padding: 11px 18px;
                }
                .test005-badges-card {
                    display: none;
                }
                .test005-heading {
                    font-size: 22px !important;
                    font-size: 24px !important;
                    line-height: 24px !important;
                }

                .test005-list-item {
                    font-size: 16px;
                    line-height: 30px;
                }

                .test005-cta {
                    gap:17px;
                    padding: 10px 12px !important;
                    font-size: 16px;
                }
                section:has(nav.breadcrumb) {
                    padding-bottom: 30px;
                }
            }
         @media (max-width: 400px) {
            .test005-cta,
            body.AB-TEST005 .test005-hero .test005-cta {
                gap: 10px !important;
                padding: 8px !important;
                font-size: 12px !important;
            }
        }
            
        `;
        document.head.appendChild(style);
    }

    function initHero() {
        const sliderSection = q("#main section:has(.slider)") || q("main section:has(.slider)");
        if (!sliderSection) {
            logInfo("Slider section not found");
            return;
        }

        injectStyles();
        sliderSection.style.display = "none";
        sliderSection.insertAdjacentHTML("beforebegin", createHeroHTML());

        logInfo("Hero initialized");
    }

    function checkForItems() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && (q("#main section:has(.slider)") || q("main section:has(.slider)")));
    }

    function init() {
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        initHero();
    }

    try {
        await waitForElementAsync(checkForItems);
        init();
    } catch (error) {
        logInfo(`Error: ${error.message}`);
        return false;
    }
})();
