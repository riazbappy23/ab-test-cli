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
        test_version: 0.0006,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

    const STYLE_ID = `${page_initials}-styles`;

    const CSS = `
:root {
    --primary-color: #0056b3;
    --primary-light: #cce4f7;
    --text-dark: #333333;
    --text-muted: #666666;
    --border-color: #939393;
    --bg-white: #ffffff;
    --bg-light: #f6f5f3;
    --transition-speed: 0.3s;
}
.benefits-slider-section { padding: 20px 0 0; background: var(--bg-light); margin-bottom: 0; }
.benefits-slider-title { font-size: 32px; font-weight: 700; line-height: 23.4px; color: var(--primary-color); margin: 0 0 40px 0; letter-spacing: 0%; font-family: inherit; }
.benefits-slider-wrapper { position: relative; margin-bottom: 18px; }
.benefits-slider-wrapper::after { content: ""; position: absolute; right: 0px !important; top: 0; bottom: 0; width: 80px; background: linear-gradient(to right, transparent 0%, var(--bg-light) 100%); pointer-events: none; z-index: 5; }
.benefits-slider-wrapper--at-end::after { display: none; }
.benefits-slider-wrapper::before { content: ""; position: absolute; left: 0px; top: 0; bottom: 0; width: 80px; background: linear-gradient(to left, transparent 0%, var(--bg-light) 100%); pointer-events: none; z-index: 5; display: none; }
.benefits-slider-wrapper--scrolled::before { display: block; }
.benefits-swiper { overflow: visible; clip-path: inset(0px 0px 0px -9999px); padding-bottom: 1px; }
.benefits-swiper .swiper-wrapper { align-items: stretch; }
.benefits-swiper .swiper-slide { height: auto; min-width: 210px !important; max-width: 210px !important; }
.benefits-slide-card { background: #ffffff; border: 1px solid #939393 !important; border-radius: 10px; padding: 9px 14px 8px; transition: all var(--transition-speed) ease; height: 100%; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box; justify-content: flex-start; }
.benefits-card-header { display: flex; align-items: flex-start; gap: 10px; font-weight: 700; color: var(--primary-color); font-family: inherit; margin: 0; padding-top: 0; }
.benefits-slide-card .benefits-card-title,
.benefits-slide-card h3.benefits-card-title { padding-top: 0 !important; margin-top: 0 !important; }
.benefits-card-number { font-size: 32px; line-height: 23px; flex-shrink: 0; color: var(--primary-color); font-weight: 700; margin: 0; margin-top: 3px; padding: 0; }
.benefits-card-title { font-size: 16px; margin: 0; font-weight: 600; color: var(--primary-color); line-height: 23px; flex: 1; }
.benefits-card-description { margin: 0; color: var(--primary-color); flex: 1; font-family: Noto Sans; font-weight: 400; font-size: 16px; line-height: 23px; letter-spacing: -0.8px; }
.benefits-next-btn { width: 44px; height: 44px; position: absolute; top: 50%; right: -52px; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; background: #bcd8fa; border: none; border-radius: 50%; cursor: pointer; z-index: 10; padding: 0; }
.benefits-next-btn:hover { background: #add2ff; }
.benefits-next-btn:active { transform: translateY(-50%) scale(0.95); }
.benefits-next-btn svg { width: 20px; height: 15px; display: block; }
.benefits-prev-btn { display: none; width: 44px; height: 44px; position: absolute; top: 50%; left: -52px; transform: translateY(-50%); align-items: center; justify-content: center; background: #bcd8fa; border: none; border-radius: 50%; cursor: pointer; z-index: 10; padding: 0; }
.benefits-prev-btn:hover { background: #add2ff; }
.benefits-prev-btn:active { transform: translateY(-50%) scale(0.95); }
.benefits-prev-btn svg { width: 20px; height: 15px; display: block; }
.benefits-slider-source { font-family: Noto Sans !important; font-size: 16px; font-weight: 400; line-height: 23.4px; letter-spacing: 0%; margin: 0; text-align: left; font-family: inherit; display: block; text-decoration: underline; color: var(--primary-color); }
.benefits-slider-source-label { font-family: Noto Sans; font-weight: 400; font-size: 16px; line-height: 23.4px; letter-spacing: 0%; color: var(--primary-color); }
@media (max-width: 768px) {
    .benefits-slider-section { padding: 21px 0 30px 0; }
    .benefits-slider-title { font-size: 20px; margin-bottom: 32px; }
    .benefits-swiper .swiper-slide { max-width: unset !important; }
    .benefits-slider-wrapper { display: flex; align-items: center; margin-bottom: 30px; position: relative; }
    .benefits-slider-wrapper::after,
    .benefits-slider-wrapper::before { display: none !important; }
    .benefits-swiper { flex: 1; min-width: 0; overflow: hidden; clip-path: none; }
    .benefits-prev-btn { position: absolute; top: auto; left: 0; }
    .benefits-next-btn { position: absolute; top: auto; right: 0; }
    .benefits-prev-btn,
    .benefits-next-btn { display: flex; transform: none; width: 30px; height: 30px; flex-shrink: 0; }
    .benefits-prev-btn:active,
    .benefits-next-btn:active { transform: scale(0.95); }
    .benefits-prev-btn:disabled,
    .benefits-next-btn:disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
    .benefits-prev-btn svg,
    .benefits-next-btn svg { width: 16px; }
    .benefits-slide-card { min-height: max-content; max-width: calc(100% - 75px); margin: 0 auto; }
    .benefits-card-number { font-size: 24px; }
    .benefits-card-title { font-size: 14px; line-height: 1.3; }
    .benefits-card-description { max-width: 97%; font-size: 12px; line-height: 1.5; }
    .benefits-slider-source { font-size: 16px; }
}
`;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = CSS;
        (document.head || document.documentElement).appendChild(style);
    }

    injectStyles();

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
            description: "Eine Weiterbildung ist ein Karriere-Sprungbrett. 47 % der Fortbildungs- absolventen übernehmen später Personal-verantwortung, im Vergleich zu nur 39 % bei Hochschulabsolventen.",
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
    const ArrowLeftSvg = '<svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform:scaleX(-1)"><path d="M21.7309 8.07112C22.1214 7.6806 22.1214 7.04743 21.7309 6.65691L15.3669 0.292946C14.9764 -0.0975785 14.3433 -0.0975785 13.9527 0.292946C13.5622 0.68347 13.5622 1.31664 13.9527 1.70716L19.6096 7.36401L13.9527 13.0209C13.5622 13.4114 13.5622 14.0446 13.9527 14.4351C14.3433 14.8256 14.9764 14.8256 15.3669 14.4351L21.7309 8.07112ZM0 7.36401V8.36401H21.0238V7.36401V6.36401H0V7.36401Z" fill="#09479B" /></svg>';

    function injectSwiperAssets() {
        return new Promise((resolve) => {
            if (!document.querySelector('link[href*="swiper-bundle"]')) {
                const swiperCSS = document.createElement("link");
                swiperCSS.rel = "stylesheet";
                swiperCSS.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
                document.head.appendChild(swiperCSS);
            }

            if (!window.Swiper) {
                const swiperScript = document.createElement("script");
                swiperScript.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
                swiperScript.onload = () => resolve(true);
                swiperScript.onerror = () => resolve(false);
                (document.body || document.documentElement).appendChild(swiperScript);
            } else {
                resolve(true);
            }
        });
    }

    const swiperReady = injectSwiperAssets();

    function createBenefitsHTML() {
        let slidesHTML = "";
        benefitsData.forEach((benefit) => {
            slidesHTML += `
                <div class="swiper-slide">
                    <div class="benefits-slide-card">
                        <div class="benefits-card-header">
                            <span class="benefits-card-number">${benefit.number}</span>
                            <h3 class="benefits-card-title">${benefit.title}</h3>
                        </div>
                        <p class="benefits-card-description">${benefit.description}</p>
                    </div>
                </div>
            `;
        });

        return `
            <section class="benefits-slider-section">
                <div class="container">
                    <h2 class="benefits-slider-title">6 gute Gründe diese Weiterbildung zu starten</h2>
                    <div class="benefits-slider-wrapper">
                        <button class="benefits-prev-btn" type="button" aria-label="Previous slide">${ArrowLeftSvg}</button>
                        <div class="swiper benefits-swiper">
                            <div class="swiper-wrapper">
                                ${slidesHTML}
                            </div>
                        </div>
                        <button class="benefits-next-btn" type="button" aria-label="Next slide">${ArrowSvg}</button>
                    </div>
                    <div>
                        <span class="benefits-slider-source-label">Quelle:</span>
                        <a class="benefits-slider-source" href="https://www.ihk-akademie-schwaben.de/ueber-uns/bildungsmacher-hub/mehr-gehalt-weiterbildung-karriere-ohne-studium/" target="_blank"> <span class="benefits-slider-source-url"> IHK Schwaben </span></a>
                    </div>
                </div>
            </section>
        `;
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function initSlider() {
        const targetSection = document.querySelector("section:has(.container .accordion)");
        if (!targetSection) {
            logInfo("Target section not found");
            return;
        }

        targetSection.insertAdjacentHTML("afterend", createBenefitsHTML());

        const swiperEl = q(".benefits-swiper");
        const prevBtn = q(".benefits-prev-btn");
        const nextBtn = q(".benefits-next-btn");

        if (!swiperEl || !window.Swiper) {
            logInfo("Swiper element or library not found");
            return;
        }

        const getSlidesPerView = () => (isMobile() ? 1 : 4.5);

        let resizeTimeout;

        const swiper = new window.Swiper(swiperEl, {
            slidesPerView: getSlidesPerView(),
            spaceBetween: isMobile() ? 13 : 59,
            speed: 300,
            watchOverflow: true,
            grabCursor: true,
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 13,
                },
                769: {
                    slidesPerView: 4.4,
                    spaceBetween: 59,
                },
            },
            on: {
                afterInit: function () {
                    updateArrow(this, prevBtn, nextBtn);
                },
                slideChange: function () {
                    updateArrow(this, prevBtn, nextBtn);
                },
            },
        });

        window.addEventListener("resize", function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                if (swiper && !swiper.destroyed) {
                    updateArrow(swiper, prevBtn, nextBtn);
                }
            }, 150);
        });

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                swiper.slidePrev();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                swiper.slideNext();
            });
        }

        logInfo("Swiper initialized successfully");
    }

    function updateArrow(swiperInstance, prevBtn, nextBtn) {
        const wrapper = q(".benefits-slider-wrapper");
        if (isMobile()) {
            if (nextBtn) {
                nextBtn.style.display = "";
                nextBtn.disabled = swiperInstance.isEnd;
            }
            if (prevBtn) {
                prevBtn.style.display = "";
                prevBtn.disabled = swiperInstance.isBeginning;
            }
        } else {
            if (nextBtn) {
                nextBtn.style.display = swiperInstance.isEnd ? "none" : "flex";
                nextBtn.disabled = false;
            }
            if (prevBtn) {
                prevBtn.style.display = swiperInstance.isBeginning ? "none" : "flex";
                prevBtn.disabled = false;
            }
        }
        if (wrapper) {
            wrapper.classList.toggle("benefits-slider-wrapper--at-end", swiperInstance.isEnd);
            wrapper.classList.toggle("benefits-slider-wrapper--scrolled", !swiperInstance.isBeginning);
        }
    }

    function init() {
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        injectStyles();
        swiperReady.then((loaded) => {
            if (loaded) {
                initSlider();
            } else {
                logInfo("Failed to load Swiper assets");
            }
        });
    }

    function checkForItems() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q("main"));
    }

    try {
        await waitForElementAsync(checkForItems);
        init();
    } catch (error) {
        logInfo(`Error: ${error.message}`);
        return false;
    }
})();
