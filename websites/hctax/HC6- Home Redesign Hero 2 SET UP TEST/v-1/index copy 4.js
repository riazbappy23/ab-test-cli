(async () => {
    const TEST_ID = "HC6";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        page_initials: "AB-HC6",
        test_variation: VARIANT_ID === "V1" ? 1 : 2,
        test_version: 0.0003,
        variant: VARIANT_ID,
    };

    const {page_initials, test_variation, test_version, variant} = TEST_CONFIG;

    const VIDEO_EMBED_URL = "https://cdn.shopify.com/videos/c/o/v/ac10c153b36a4a42b5c0af9fe438d8fb.mp4";
    const VIDEO_THUMBNAIL_URL = "https://sb.monetate.net/img/1/1723/6081082.png";

    const SELECTORS = {
        hero: "main > div:first-child",
        main: "main",
    };

    const q = (s, r = document) => r.querySelector(s);

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

    function fireGA4Event(eventName, eventLabel = "") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "GA4event",
            "ga4-event-name": "cro_event",
            "ga4-event-p1-value": eventName,
            "ga4-event-p2-name": "event_label",
            "ga4-event-p2-value": eventLabel,
        });
        logInfo(`Event fired: ${eventName}${eventLabel ? ` - ${eventLabel}` : ""}`);
    }

    const ANTI_FLICKER_MS = 3000;
    let _antiFlickerTimer = null;

    function applyAntiFlicker() {
        if (document.getElementById("hc6-anti-flicker")) return;
        const s = document.createElement("style");
        s.id = "hc6-anti-flicker";
        s.innerHTML = `${SELECTORS.hero} { opacity: 0 !important; pointer-events: none !important; }`;
        document.head.appendChild(s);
        _antiFlickerTimer = setTimeout(removeAntiFlicker, ANTI_FLICKER_MS);
    }

    function removeAntiFlicker() {
        clearTimeout(_antiFlickerTimer);
        document.getElementById("hc6-anti-flicker")?.remove();
    }

    function injectStyles() {
        const existing = document.getElementById("hc6-styles");
        if (existing) existing.remove();

        const style = document.createElement("style");
        style.id = "hc6-styles";
        style.textContent = `
            .${page_initials} .hc6-hero {
                width: 100%;
                background-color: #263557;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }

            .${page_initials} .hc6-hero--v1 {
                position: relative;
                background: #263557;
            }
            .${page_initials} .hc6-hero--v1::before {
                content: '';
                position: absolute;
                inset: 0;
                background: var(--hc6-hero-bg) 100% center / 75% auto no-repeat;
                filter: grayscale(100%) brightness(0.9) sepia(100%) hue-rotate(180deg) saturate(180%);
                z-index: 0;
            }
            .${page_initials} .hc6-hero--v1::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(to right, #263557 25%, rgba(38, 53, 87, 0) 50%);
                z-index: 1;
            }
            .${page_initials} .hc6-hero--v1 .hc6-container {
                position: relative;
                z-index: 2;
            }
            .${page_initials} .hc6-hero--v2 {
                background:
                    linear-gradient(rgba(38, 53, 87, 0.94), rgba(38, 53, 87, 0.94)),
                    var(--hc6-hero-bg) center / cover no-repeat;
            }

             .${page_initials} .hc6-hero--v1 .hc6-container {
                position: relative;
                z-index: 2;
                padding: 92px 140px;
            }
            .${page_initials} .hc6-hero--v2 .hc6-container {
                position: relative;
                z-index: 2;
                padding: 92px 80px;
            }
            
            .${page_initials} .hc6-container {
                margin: 0 auto;
            }
            .${page_initials} .hc6-grid {
                display: flex;
                align-items: stretch;
            }

            .${page_initials} .hc6-col-left {
                flex: 0 0 50%;
                max-width: 50%%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: #fff;
            }

            .${page_initials} .hc6-col-right {
                flex: 0 0 52%;
                max-width: 52%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .${page_initials} .hc6-rating {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .${page_initials} .hc6-stars {
                display: flex;
                gap: 2px;
            }
            .${page_initials} .hc6-rating-text {
                font-family: Roboto Serif;
                font-weight: 400;
                font-size: 16px;
                line-height: 100%;
                letter-spacing: 2%;
                text-transform: uppercase;
                color: #fff;
            }

            .${page_initials} .hc6-title {
                font-family: Roboto Serif;
                font-weight: 600;
                font-size: 70px;
                line-height: 75px;
                letter-spacing: 0%;
                text-transform: capitalize;
                margin-top: 30px;
                margin-bottom: 0 ;
                color: #fff;
            }
            .${page_initials} .hc6-highlight {
                display: inline;
                position:relative;
            }
            .${page_initials} .hc6-highlight::before {
                content: "";
                position: absolute;
                left:-10px;
                top:5px;
                background: #4a7fc0;
                transform: skewX(-12deg);
                height: 73px;
                width: 320px;
                z-index: -1;
            }

            .${page_initials} .hc6-desc {
                font-family: Roboto Serif;
                font-weight: 400;
                font-size: 20px;
                line-height: 34px;
                letter-spacing: 0%;
                color: #FFFFFF ; 
                opacity: 0.8;
                max-width: 620px;
                margin: 36px 0 40px 0;
            }

            .${page_initials} .hc6-cta {
                display: inline-block;
                background-color: #FFC200;
                color: #263557 !important;
                font-family: Roboto Serif;
                font-weight: 600;
                font-size: 20px;
                line-height: 100%;
                letter-spacing: 0%;
                text-align: center;
                text-transform: capitalize;
                padding: 23px 36px;
                cursor: pointer;
                text-decoration: none !important;
                transition: background 0.2s, transform 0.1s;
                width: fit-content;
                margin-left: 10px;
                position: relative;
                border: none;
                outline: 1px solid #FFC200;
                outline-offset: 12px;
            }
            .${page_initials} .hc6-cta::before {
                content: '';
                position: absolute;
                top: -12px;
                left: -12px;
                right: -12px;
                bottom: -12px;
                background: #263557;
                opacity:80%;
                backdrop-filter: blur(6px);
                z-index: -1;
                pointer-events: none;
            }
            .${page_initials} .hc6-cta:hover {
                background-color: #e6b800;
                transform: translateY(-1px);
            }

            .${page_initials} .hc6-video-col {
                width: 100%;
                padding-left: 20px;
            }
            .${page_initials} .hc6-video-wrapper {
                position: relative;
                width: 100%;
                overflow: hidden;
                box-shadow: 0 8px 40px rgba(0,0,0,0.45);
                background: #0a1628;
                border-radius:10px;
                aspect-ratio: 1.78/1;
            }
            .${page_initials} .hc6-video-thumbnail {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                cursor: pointer;
                transition: opacity 0.3s;
                z-index:1 !important;
            }
            .${page_initials} .hc6-video-thumbnail.hidden {
                opacity: 0;
                pointer-events: none;
            }
            .${page_initials} .hc6-play-btn {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 72px;
                height: 72px;
                background: linear-gradient(135deg, rgba(254, 252, 245, 0.18), rgba(152, 151, 147, 0.18));
                border: 2px solid rgba(255,255,255,0.55);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                backdrop-filter: blur(4px);
                transition: transform 0.2s, background 0.2s, border-color 0.2s;
                pointer-events: auto;
                z-index: 2;
            }
            .${page_initials} .hc6-video-thumbnail:hover ~ .hc6-play-btn,
            .${page_initials} .hc6-play-btn:hover {
                transform: translate(-50%, -50%) scale(1.08);
                border-color: rgba(255,255,255,0.9);
            }
            .${page_initials} .hc6-play-btn svg {
                margin-left: 4px;
            }
            .${page_initials} .hc6-hero-video {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                display: none;
                border: 5px solid #FFF;
                border-radius:10px;
                overflow: hidden;
            }
            .${page_initials} .hc6-hero-video.active {
                display: block;
            }
            @media (max-width: 1400px) {
                .${page_initials} .hc6-hero--v1::before {
                    background: var(--hc6-hero-bg) 100% center / 110% auto no-repeat;
                }
            }
            @media (max-width: 1200px) {
             .${page_initials} .hc6-hero--v1 .hc6-container {
                padding: 92px 55px;
            }
            .${page_initials} .hc6-hero--v2 .hc6-container {
                padding: 92px 40px;
            }
                 .${page_initials} .hc6-title {
                   font-size: 50px;
                   line-height:60px;
                 }
                 .${page_initials} .hc6-highlight::before {
                    left:-10px;
                    top:0px;
                    height: 60px;
                    width: 220px;
				}
                 .${page_initials} .hc6-cta {
                    font-size: 16px;
                 }
             }
             @media (max-width: 1000px) {
                 .${page_initials} .hc6-title {
                   font-size: 35px;
                   line-height:40px;
                 }
                .${page_initials} .hc6-highlight::before {
                    left:-5px;
                    top:0px;
                    height: 40px;
                    width: 160px;
				}
             }
            
            @media (max-width: 767px) {
            .${page_initials} .hc6-hero--v1::before {
                background: var(--hc6-hero-bg) 40% center / cover no-repeat;
                filter: grayscale(100%);
               }
                @media (max-width: 768px) {
                .${page_initials} .hc6-hero--v1::after {
                    background: linear-gradient(to right, rgba(38, 53, 87, 0.8) , rgba(38, 53, 87, .8) 100%);
                }
            }
                 .${page_initials} .hc6-hero--v1 .hc6-container {
	                 padding: 40px 20px 50px 20px;
	               }
	             .${page_initials} .hc6-hero--v2 .hc6-container {
	                padding: 40px 20px;
	              }
                .hc6-video-thumbnail {
                    border-top: 3px solid white;
                    border-bottom: 3px solid white;
                    border-radius: 10px;
                }
                .${page_initials} .hc6-hero--v1 .hc6-col-left {
                    flex: 0 0 100%;
                    max-width: 100%;
                    min-height: unset;
                }
                .${page_initials} .hc6-hero--v2 .hc6-col-left {
                    padding-bottom:10px;
                }
                .${page_initials} .hc6-hero--v2 .hc6-grid {
                    flex-direction: column;
                }
                .${page_initials} .hc6-col-left {
	                 display: flex;
	                 justify-content:center;
	                 align-items:center;
                     padding: 0;
                }
                
                .${page_initials} .hc6-hero--v2 .hc6-col-left,
                .${page_initials} .hc6-hero--v2 .hc6-col-right {
                    flex: 0 0 100%;
                    max-width: 100%;
                    min-height: unset;
                }
                .${page_initials} .hc6-hero--v2 .hc6-video-col {
                    padding-top:40px;
                    padding-left: 0;
                }
                .${page_initials} .hc6-rating {
                 gap: 10px;
                }
                .${page_initials} .hc6-rating-text {
                    font-size: 14px;
                 }
                .${page_initials} .hc6-title {
                    margin-top: 20px;
                    margin-bottom:0px;
                    font-size: 40px;
                    line-height: 45px;
                    text-align:center;
                }
                 .${page_initials} .hc6-highlight::before {
                    left:-5px;
                    top:5px;
                    width:175px;
				}
                .${page_initials} .hc6-desc {
                    font-size: 16px;
                    line-height: 26px;
                    max-width: 520px;
                    margin: 30px auto;
                    text-align: justify;
                    text-align-last: center; 
               }
               .${page_initials} .hc6-cta {
                    width: calc(100% - 20px) !important;
                    margin-left: 0 !important;
                    padding: 19.5px 0;
              }
            }
            @media (max-width: 400px) {
               .${page_initials} .hc6-title {
                 font-size: 30px;
                 line-height: 35px;
               }
            .${page_initials} .hc6-highlight::before {
                    left:-5px;
                    top:0px;
                    width:135px;
				}
                .${page_initials} .hc6-cta {
                    font-size: 14px;
              }
            }
        `;
        document.head.appendChild(style);
    }

    function createStarSVG() {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="#FFC200" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.9 8.6L22 9.3L16.5 14.1L18.2 21L12 17.3L5.8 21L7.5 14.1L2 9.3L9.1 8.6L12 2Z"/>
        </svg>`;
    }

    function buildLeftColHTML() {
        return `
            <div class="hc6-col-left">
                <div class="hc6-rating">
                    <div class="hc6-stars">${createStarSVG().repeat(5)}</div>
                    <span class="hc6-rating-text">5K+ REVIEWS</span>
                </div>
                <h1 class="hc6-title">
                    Property Tax <br> Consultants You <br> Can <span class="hc6-highlight">Rely On</span>
                </h1>
                <p class="hc6-desc">Our experts handle the entire property tax protest process, helping homeowners and businesses secure fair tax assessments for over 50 years.</p>
                <a href="https://www.hctax.com/contact-us/" class="hc6-cta" data-hc6-cta>
                    Schedule Your Free Consultation
                </a>
            </div>
        `;
    }

    function buildV2RightColHTML() {
        return `
        <div class="hc6-col-right">
            <div class="hc6-video-col">
                <div class="hc6-video-wrapper" data-hc6-video>
                    <img
                        class="hc6-video-thumbnail"
                        src="${VIDEO_THUMBNAIL_URL}"
                        alt="Watch our video"
                    />
                    <div class="hc6-play-btn">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <video
                        class="hc6-hero-video"
                        playsinline
                        controls
                        preload="none"
                    ></video>
                </div>
            </div>
        </div>
    `;
    }

    function bindEvents(heroEl) {
        const cta = heroEl.querySelector("[data-hc6-cta]");
        if (cta) {
            cta.addEventListener("click", () => {
                fireGA4Event("HC6_HeroCTAclick", "CTA Copy");
            });
        }

        const videoWrapper = heroEl.querySelector("[data-hc6-video]");
        if (videoWrapper) {
            const thumbnail = videoWrapper.querySelector(".hc6-video-thumbnail");
            const playBtn = videoWrapper.querySelector(".hc6-play-btn");

            function playVideo() {
                thumbnail.classList.add("hidden");
                playBtn.style.display = "none";

                const video = videoWrapper.querySelector(".hc6-hero-video");
                if (!video.src) {
                    video.src = VIDEO_EMBED_URL;
                }
                video.classList.add("active");
                video.play();

                fireGA4Event("HC6_VideoClick");
            }

            thumbnail.addEventListener("click", playVideo);
            playBtn.addEventListener("click", playVideo);
        }
    }

    function applyHero(heroEl) {
        const isV2 = variant === "V2";

        const existingImgEl = heroEl.querySelector(".blue-scale img") || heroEl.querySelector("img[alt='hero image']");
        const imgUrl = existingImgEl ? existingImgEl.src : "";
        const bgStyle = imgUrl ? `--hc6-hero-bg: url('${imgUrl}')` : "";

        heroEl.outerHTML = `
            <div class="hc6-hero ${isV2 ? "hc6-hero--v2" : "hc6-hero--v1"}" style="${bgStyle}">
                <div class="hc6-container">
                    <div class="hc6-grid">
                        ${buildLeftColHTML()}
                        ${isV2 ? buildV2RightColHTML() : ""}
                    </div>
                </div>
            </div>
        `;

        const newHeroEl = q(".hc6-hero");
        if (newHeroEl) {
            bindEvents(newHeroEl);
            removeAntiFlicker();
            logInfo(`Hero applied — ${variant}`);
        } else {
            logInfo("Post-replacement hero not found.");
        }
    }

    function isHomePage() {
        const path = window.location.pathname;
        return path === "/" || path === "";
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function checkForItems() {
        if (!isHomePage()) return false;
        const heroEl = q(SELECTORS.hero);
        if (!heroEl) return false;
        if (heroEl.classList.contains("hc6-hero")) return false;
        if (document.readyState !== "complete") return false;
        return true;
    }

    async function init_HC6() {
        if (window[page_initials] === true) return;
        if (!isHomePage()) return;

        try {
            await waitForElementAsync(checkForItems);

            window[page_initials] = true;
            document.body.classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version-${test_version}`);

            injectStyles();
            applyHero(q(SELECTORS.hero));

            logInfo("All modifications applied");
        } catch (error) {
            logInfo(`Init failed: ${error.message}`);
            return false;
        }
    }

    function handleLocationChanges() {
        if (q(".hc6-hero")) return;

        document.body.classList.remove(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version-${test_version}`);
        window[page_initials] = false;

        if (!isHomePage()) return;

        init_HC6();
    }

    function urlObserver() {
        const debouncedChanges = debounce(handleLocationChanges, 150);

        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(history, arguments);
            window.dispatchEvent(new Event("pushstate"));
        };

        window.addEventListener("popstate", function () {
            debouncedChanges();
        });

        window.addEventListener("pushstate", function () {
            debouncedChanges();
        });
    }

    if (isHomePage()) applyAntiFlicker();

    init_HC6();
    urlObserver();
})();
