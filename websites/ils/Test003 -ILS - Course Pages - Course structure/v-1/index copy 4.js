(async () => {
    const TEST_ID = "Test003";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cNetzproduzent%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        client: "Netzproduzent",
        project: "ils",
        site_url: "https://www.ils.de",
        test_name: "Test003 [ILS] - Course Pages: Course Structure",
        page_initials: "AB-TEST003",
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

    const ICONS = Object.freeze({
        START: "https://i.postimg.cc/j5QzzfFb/start-1.png",
        ONLINE_LEARNING: "https://i.postimg.cc/bJHQQnBP/online-learning-(1)-1.png",
        PERSONAL_SUPPORT: "https://i.postimg.cc/MTbyyBFq/community-1.png",
        FEEDBACK: "https://i.postimg.cc/FRgjjSBm/test-1.png",
        CERTIFICATE: "https://i.postimg.cc/wvchhNGY/certificate-(2)-1.png",
    });

    const stepsData = [
        {
            icon: ICONS.START,
            title: "Start jederzeit möglich und 4 Wochen gratis testen",
            description: "Das passt in Ihren Alltag: Sie lernen in Ihrem Tempo und teilen sich die Zeit ein.",
        },
        {
            icon: ICONS.ONLINE_LEARNING,
            title: "Flexibel online lernen - wann und wo Sie möchten",
            description: "Sie erhalten alle Studienhefte und Zugang zu den Online-Videoinhalten",
        },
        {
            icon: ICONS.PERSONAL_SUPPORT,
            title: "Ihre persönliche Lernbetreuung, Lerngruppen & KI-Hilfe",
            description: "Fragen Sie Ihren pers. Ansprechpartner, in den Studiengruppen oder in der KI-Lernbegleitung",
        },
        {
            icon: ICONS.FEEDBACK,
            title: "Aufgaben lösen, einschicken & Feedback erhalten",
            description: "Lösen Sie die Aufgaben in Ihrer Zeiteinteilung und erhalten dazu eine wertvolle Rückmeldung",
        },
        {
            icon: ICONS.CERTIFICATE,
            title: "Zur Prüfung anmelden und Ihren anerkannten Abschluss erwerben",
            description: "Alle Abschlüsse sind praxisrelevant, von Arbeitgebern geschätzt und bestätigen Ihre Fähigkeiten",
        },
    ];

    const ArrowRightSvg = `<svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L9 8L1 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const ArrowLeftSvg = `<svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1 8L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    function getJobTitle() {
        const h1 = document.querySelector(".stage-course-details h1");
        if (!h1) return "BERUFSBEZEICHNUNG";
        const clone = h1.cloneNode(true);
        clone.querySelectorAll("span").forEach((s) => s.remove());
        return clone.textContent.trim() || "BERUFSBEZEICHNUNG";
    }

    function createStepsHTML() {
        const jobTitle = getJobTitle();
        let stepsHTML = "";
        stepsData.forEach((step, i) => {
            stepsHTML += `
                <div class="test003-step">
                    <div class="test003-step-icon"><img src="${step.icon}" alt="" /></div>
                    <h3 class="test003-step-title">${step.title}</h3>
                    <p class="test003-step-desc">${step.description}</p>
                </div>
            `;
            if (i < stepsData.length - 1) {
                stepsHTML += `<span class="test003-step-sep" aria-hidden="true">
                ${
                    isMobile()
                        ? `<svg width="40" height="2" viewBox="0 0 40 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<line y1="1" x2="40" y2="1" stroke="black" stroke-width="2"/>
</svg>
`
                        : `<svg width="96" height="2" viewBox="0 0 96 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<line y1="1" x2="96" y2="1" stroke="black" stroke-width="2"/>
</svg>`
                }

</span>`;
            }
        });

        return `
            <section class="test003-section">
                <div class="test003-container">
                    <h2 class="test003-title">Starten Sie Ihre Karriere als "${jobTitle}"</h2>
                    <div class="test003-outer">
                        <button class="test003-arrow test003-arrow--left" aria-label="Vorherige" style="display:none">${ArrowLeftSvg}</button>
                        <div class="test003-scroll">
                            <div class="test003-track">
                                ${stepsHTML}
                            </div>
                        </div>
                        <button class="test003-arrow test003-arrow--right" aria-label="Nächste" style="display:none">${ArrowRightSvg}</button>
                    </div>
                </div>
            </section>
        `;
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function initCourseSteps() {
        const target = document.querySelector("#main section:has(.btn-group)");
        if (!target) {
            logInfo("Target section not found");
            return;
        }

        target.insertAdjacentHTML("afterend", createStepsHTML());

        const scrollEl = q(".test003-scroll");
        const leftBtn = q(".test003-arrow--left");
        const rightBtn = q(".test003-arrow--right");

        if (!scrollEl || !leftBtn || !rightBtn) {
            logInfo("Course steps elements not found");
            return;
        }

        function getStepDistance() {
            const step = scrollEl.querySelector(".test003-step");
            const sep = scrollEl.querySelector(".test003-step-sep");
            const stepWidth = step ? step.offsetWidth : 140;
            const sepWidth = sep ? sep.offsetWidth : 44;
            return stepWidth + sepWidth;
        }

        function updateArrows() {
            if (!isMobile()) {
                leftBtn.style.display = "none";
                rightBtn.style.display = "none";
                q(".test003-outer").classList.remove("test003-outer--at-end");
                return;
            }
            const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
            const atStart = scrollEl.scrollLeft <= 10;
            const atEnd = maxScroll > 10 && scrollEl.scrollLeft >= maxScroll - 10;
            leftBtn.style.display = atStart ? "none" : "";
            rightBtn.style.display = atEnd ? "none" : "";
            q(".test003-outer").classList.toggle("test003-outer--at-end", atEnd);
        }

        leftBtn.addEventListener("click", () => {
            scrollEl.scrollBy({left: -getStepDistance(), behavior: "smooth"});
        });

        rightBtn.addEventListener("click", () => {
            scrollEl.scrollBy({left: getStepDistance(), behavior: "smooth"});
        });

        scrollEl.addEventListener("scroll", updateArrows);

        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateArrows, 150);
        });

        if (typeof ResizeObserver !== "undefined") {
            const track = scrollEl.querySelector(".test003-track");
            const ro = new ResizeObserver(updateArrows);
            if (track) ro.observe(track);
            ro.observe(scrollEl);
        }

        requestAnimationFrame(updateArrows);
        setTimeout(updateArrows, 300);
        logInfo("Course steps initialized");
    }

    function init() {
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        initCourseSteps();
    }

    function checkForItems() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q("#main section:has(.btn-group)"));
    }

    try {
        await waitForElementAsync(checkForItems);
        init();
    } catch (error) {
        logInfo(`Error: ${error.message}`);
        return false;
    }
})();
