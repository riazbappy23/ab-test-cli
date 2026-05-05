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

    async function waitForElementAsync(waitFor, timeout = 30000, frequency = 100) {
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
        const track = swiperEl && swiperEl.querySelector(".swiper-wrapper");
        const slides = track ? Array.from(track.querySelectorAll(".swiper-slide")) : [];
        const prevBtn = q(".benefits-prev-btn");
        const nextBtn = q(".benefits-next-btn");

        if (!swiperEl || !track || slides.length === 0) {
            logInfo("Slider elements not found");
            return;
        }

        let currentIndex = 0;
        let slideWidth = 210;
        let gap = 59;

        function measure() {
            const mobile = isMobile();
            gap = mobile ? 13 : 59;
            track.style.gap = gap + "px";

            if (mobile) {
                slideWidth = swiperEl.clientWidth;
                slides.forEach((s) => (s.style.width = slideWidth + "px"));
            } else {
                slideWidth = 210;
                slides.forEach((s) => (s.style.width = ""));
            }
        }

        function maxOffset() {
            const totalWidth = slides.length * slideWidth + (slides.length - 1) * gap;
            return Math.max(0, totalWidth - swiperEl.clientWidth);
        }

        function maxIndex() {
            const step = slideWidth + gap;
            return step > 0 ? Math.ceil(maxOffset() / step) : 0;
        }

        function update(animate) {
            const offset = Math.min(currentIndex * (slideWidth + gap), maxOffset());
            track.style.transition = animate ? "transform 300ms ease" : "none";
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;

            updateArrow(
                {
                    isBeginning: currentIndex <= 0,
                    isEnd: currentIndex >= maxIndex(),
                },
                prevBtn,
                nextBtn
            );
        }

        function go(delta) {
            const next = Math.max(0, Math.min(maxIndex(), currentIndex + delta));
            if (next !== currentIndex) {
                currentIndex = next;
                update(true);
            }
        }

        measure();
        update(false);

        if (prevBtn) prevBtn.addEventListener("click", () => go(-1));
        if (nextBtn) nextBtn.addEventListener("click", () => go(1));

        let resizeTimeout;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                measure();
                currentIndex = Math.min(currentIndex, maxIndex());
                update(false);
            }, 150);
        });

        let startX = 0;
        let deltaX = 0;
        let dragging = false;
        track.addEventListener(
            "touchstart",
            (e) => {
                startX = e.touches[0].clientX;
                deltaX = 0;
                dragging = true;
            },
            {passive: true}
        );
        track.addEventListener(
            "touchmove",
            (e) => {
                if (dragging) deltaX = e.touches[0].clientX - startX;
            },
            {passive: true}
        );
        track.addEventListener("touchend", () => {
            if (!dragging) return;
            dragging = false;
            if (deltaX > 50) go(-1);
            else if (deltaX < -50) go(1);
        });
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
        initSlider();
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
