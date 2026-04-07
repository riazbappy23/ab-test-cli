(async () => {
    const TEST_ID = "Test002";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cNetzproduzent%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Netzproduzent",
        project: "ils",
        site_url: "https://www.ils.de",
        test_name: "Test002 [ILS] - Course Pages: Vocational Degrees - Showing the Value and Recognition of Degrees",
        page_initials: "AB-TEST002-V1",
        test_variation: 1,
        test_version: 0.0005,
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

    function q(s, o) {
        return o ? s.querySelector(o) : document.querySelector(s);
    }

    const benefitsData = [
        {
            number: "1",
            title: "Direkter Einfluss auf die Karriere",
            description: "Rund 60 % der Absolventen verdienen danach mehr Geld und 57 % übernahmen einen größeren Verantwortungsbereich in ihrem Job.",
        },
        {
            number: "2",
            title: "Enormes Gehaltspotenzial",
            description: "Bei etwa 60 % der Absolventen, die eine Gehaltserhöhung erhielten, stieg der Monatsverdienst um über 500 €, bei mehr als einem Viertel sogar um mindestens 1.000 €",
        },
        {
            number: "3",
            title: "Hervorragende Job-Sicherheit",
            description: "Die Arbeitslosenquote für Absolventen einer höheren Berufsbildung liegt bei nur etwa 1,2 % und ist damit sogar niedriger als bei Akademikern.",
        },
        {
            number: "4",
            title: "Schnellerer Weg in Führungspositionen",
            description: "Eine Weiterbildung ist ein Karriere-Sprungbrett. 47 % der Fortbildungsabsolventen übernehmen später Personalverantwortung, im Vergleich zu nur 39 % bei Hochschulabsolventen.",
        },
        {
            number: "5",
            title: "Gleichstellung mit akademischen Abschlüssen",
            description: "Qualifikationen wie Meister, Fachwirt oder Techniker sind im Deutschen Qualifikationsrahmen dem Bachelor- und Masterabschluss gleichgestellt.",
        },
        {
            number: "6",
            title: "Starkes persönliches Wachstum",
            description: "93 % der Absolventen berichten von einer positiven persönlichen Entwicklung. Sie gewinnen an Selbstvertrauen, Souveränität und erweitern ihren Horizont.",
        },
    ];

    const ArrowSvg = '<svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.7309 8.07112C22.1214 7.6806 22.1214 7.04743 21.7309 6.65691L15.3669 0.292946C14.9764 -0.0975785 14.3433 -0.0975785 13.9527 0.292946C13.5622 0.68347 13.5622 1.31664 13.9527 1.70716L19.6096 7.36401L13.9527 13.0209C13.5622 13.4114 13.5622 14.0446 13.9527 14.4351C14.3433 14.8256 14.9764 14.8256 15.3669 14.4351L21.7309 8.07112ZM0 7.36401V8.36401H21.0238V7.36401V6.36401H0V7.36401Z" fill="#09479B" /></svg>';

    function injectSlickAssets() {
        if (!document.querySelector('link[href*="slick.css"]')) {
            const slickCSS = document.createElement("link");
            slickCSS.rel = "stylesheet";
            slickCSS.type = "text/css";
            slickCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css";
            document.head.appendChild(slickCSS);
        }

        if (!document.querySelector('link[href*="slick-theme.css"]')) {
            const slickThemeCSS = document.createElement("link");
            slickThemeCSS.rel = "stylesheet";
            slickThemeCSS.type = "text/css";
            slickThemeCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.min.css";
            document.head.appendChild(slickThemeCSS);
        }

        if (!window.$) {
            return new Promise((resolve) => {
                const jqueryScript = document.createElement("script");
                jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
                jqueryScript.onload = () => {
                    if (!window.slick) {
                        const slickScript = document.createElement("script");
                        slickScript.src = "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js";
                        slickScript.onload = () => resolve(true);
                        document.body.appendChild(slickScript);
                    } else {
                        resolve(true);
                    }
                };
                document.body.appendChild(jqueryScript);
            });
        } else {
            if (!window.slick) {
                return new Promise((resolve) => {
                    const slickScript = document.createElement("script");
                    slickScript.src = "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js";
                    slickScript.onload = () => resolve(true);
                    document.body.appendChild(slickScript);
                });
            }
            return Promise.resolve(true);
        }
    }

    function createBenefitsHTML() {
        let html = `
            <section class="benefits-slider-section">
              <div class="container">
                <h2 class="benefits-slider-title">6 gute Gründe diese Weiterbildung zu starten</h2>
                <div class="benefits-slider-wrapper">
                    <div class="benefits-slider">
        `;

        benefitsData.forEach((benefit, index) => {
            html += `
                        <div class="benefits-slide ${(index === 0 ? "no-margin-left" : "")}">
                            <div class="benefits-slide-card">
                                <div class="benefits-card-header">
                                    <h3 class="benefits-card-number">${benefit.number}</h3>
                                    <h3 class="benefits-card-title">${benefit.title}</h3>
                                </div>
                                <p class="benefits-card-description">${benefit.description}</p>
                            </div>
                        </div>
            `;
        });

        html += `
                    </div>
                </div>
                <a class="benefits-slider-source" href="https://www.ihk-akademie-schwaben.de/ueber-uns/bildungsmacher-hub/mehr-gehalt-weiterbildung-karriere-ohne-studium/" target="_blank">Quelle: IHK Schwaben</a>
                </div>
            </section>
        `;

        return html;
    }

    function initSlider() {
        const targetSection = q(".section--bg-orange");

        if (!targetSection) {
            logInfo("Target section .section--bg-orange not found");
            return;
        }

        const sliderHTML = createBenefitsHTML();
        targetSection.insertAdjacentHTML("beforebegin", sliderHTML);

        setTimeout(() => {
            const sliderElement = q(".benefits-slider");

            if (sliderElement && window.$ && window.$.fn && window.$.fn.slick) {
                try {
                    window.$(sliderElement).slick({
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        infinite: false,
                        responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                },
                            },
                        ],
                        prevArrow: false,
                        nextArrow: `<button class="slick-next slick-arrow" type="button">${ArrowSvg}</button>`,
                        dots: false,
                        arrows: true,
                        draggable: true,
                        swipe: true,
                        touchMove: true,
                        speed: 300,
                        easing: "ease",
                    });

                    updateArrowVisibility(sliderElement);
                    window.$(sliderElement).on("afterChange", () => {
                        updateArrowVisibility(sliderElement);
                    });

                    logInfo("Slick slider initialized successfully");
                } catch (e) {
                    logInfo(`Error initializing slick: ${e.message}`);
                }
            } else {
                logInfo("Slick not ready or element not found");
            }
        }, 100);
    }

    function updateArrowVisibility(sliderElement) {
        const $slider = window.$(sliderElement);
        const slickInstance = $slider.slick("getSlick");
        const nextArrow = q(".slick-next");

        if (nextArrow) {
            if (slickInstance.currentSlide >= slickInstance.slideCount - slickInstance.options.slidesToShow) {
                nextArrow.style.display = "none";
            } else {
                nextArrow.style.display = "flex";
            }
        }
    }

    function loadSlick() {
        injectSlickAssets()
            .then(() => {
                initSlider();
            })
            .catch((err) => {
                logInfo(`Error loading Slick: ${err}`);
                setTimeout(initSlider, 500);
            });
    }

    function init() {
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        loadSlick();
    }

    function checkForItems() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q(".main"));
    }

    try {
        await waitForElementAsync(checkForItems);
        init();
    } catch (error) {
        logInfo(`Error: ${error.message}`);
        return false;
    }
})();