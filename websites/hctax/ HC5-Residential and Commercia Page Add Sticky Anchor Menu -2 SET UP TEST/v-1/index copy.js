(async () => {
    const TEST_ID = "HC5";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        page_initials: "AB-HC5",
        test_variation: VARIANT_ID === "V1" ? 1 : 2,
        test_version: 0.0001,
        variant: VARIANT_ID,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

    const ANCHOR_ITEMS = [
        {label: "Overview", id: "hc5-sec-overview"},
        {label: "Why Appeal", id: "hc5-sec-why-appeal"},
        {label: "Our Process", id: "hc5-sec-our-process"},
        {label: "Pricing & Benefits", id: "hc5-sec-pricing"},
    ];

    const CHEVRON_SVG = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.135 6.47893L10.0299 13.584C9.74093 13.873 9.28384 13.8908 8.97375 13.6379L8.91359 13.584L1.80859 6.47893L2.92492 5.36261L9.47173 11.9095L16.0186 5.36261L17.135 6.47893Z" fill="white"/>
</svg>
`;

    const q = (s, r = document) => r.querySelector(s);

    async function waitForElementAsync(predicate, timeout = 20000, frequency = 150) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            if (typeof predicate === "function" && predicate()) return resolve(true);
            const interval = setInterval(() => {
                if (Date.now() - startTime >= timeout) {
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

    function isExpectedPage() {
        const path = window.location.pathname.toLowerCase();
        return path.includes("/commercial") || path.includes("/residential");
    }
    function getNavHeight() {
        const header = q("header") || q('[class*="header"]') || q("nav");
        return header ? header.getBoundingClientRect().height : 0;
    }

    function getHeroSection() {
        const mainEl = q("main");
        if (!mainEl) return null;
        return mainEl.querySelector(":scope > div:first-of-type") || null;
    }

    function debounce(func, wait) {
        let t;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => func(...args), wait);
        };
    }

    function buildBarHTML() {
        const desktopLinks = ANCHOR_ITEMS.map((item) => `<a href="#${item.id}" data-hc5-anchor="${item.id}">${item.label}</a>`).join("");

        const mobileLinks = ANCHOR_ITEMS.map((item) => `<a href="#${item.id}" data-hc5-anchor="${item.id}">${item.label}</a>`).join("");


        return `
            <div id="hc5-anchor-bar">
                <nav class="hc5-anchor-nav" aria-label="Page sections">
                    ${desktopLinks}
                </nav>
                <div class="hc5-anchor-dropdown">
                    <button class="hc5-dropdown-toggle" aria-expanded="false" aria-haspopup="listbox">
                        <span class="hc5-dropdown-label">Jump to: ${ANCHOR_ITEMS[0].label}</span>
                        ${CHEVRON_SVG}
                    </button>
                    <div class="hc5-dropdown-list" role="listbox">
                        ${mobileLinks}
                    </div>
                </div>
            </div>
        `;
    }

    function assignSectionIds(mainEl, heroEl) {
        if (heroEl && !heroEl.id) heroEl.id = "hc5-sec-overview";

        function getMainChild(el) {
            let node = el;
            while (node && node.parentElement !== mainEl) {
                node = node.parentElement;
            }
            return node;
        }

        function findSectionByHeading(...keywords) {
            const headings = mainEl.querySelectorAll("h2, h3");
            for (const h of headings) {
                const text = h.textContent.toLowerCase();
                if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
                    return getMainChild(h);
                }
            }
            return null;
        }

        const keywordMap = [
            {id: "hc5-sec-why-appeal", keywords: ["why"]},
            {id: "hc5-sec-our-process", keywords: ["process"]},
            {id: "hc5-sec-pricing", keywords: ["pricing", "benefits"]},
        ];

        keywordMap.forEach(({id, keywords}) => {
            const el = findSectionByHeading(...keywords);
            if (!el) return;
            if (!el.id) {
                el.id = id;
            } else if (el.id !== id) {
                const item = ANCHOR_ITEMS.find((i) => i.id === id);
                if (item) item.id = el.id;
            }
        });
    }

    function updateActiveState(activeId) {
        document.querySelectorAll("[data-hc5-anchor]").forEach((link) => {
            link.classList.toggle("hc5-active", link.dataset.hc5Anchor === activeId);
        });
        const activeItem = ANCHOR_ITEMS.find((item) => item.id === activeId);
        if (activeItem) {
            const label = q(".hc5-dropdown-label");
            if (label) label.textContent = `Jump to: ${activeItem.label}`;
        }
    }

    function setupSectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) updateActiveState(entry.target.id);
                });
            },
            {rootMargin: "-38% 0px -57% 0px", threshold: 0}
        );
        ANCHOR_ITEMS.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });
    }

    function setupStickyBehavior(heroEl, barEl) {
        let navH = getNavHeight();

        const header = q("header") || q('[class*="header"]') || q("nav");
        if (header) {
            new ResizeObserver(() => {
                navH = getNavHeight();
                if (barEl.classList.contains("hc5-is-sticky")) {
                    barEl.style.top = navH + "px";
                }
            }).observe(header);
        }

        const sentinel = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    const barH = barEl.getBoundingClientRect().height;
                    barEl.style.top = navH + "px";
                    barEl.classList.add("hc5-is-sticky");

                    let ph = document.getElementById("hc5-bar-placeholder");
                    if (!ph) {
                        ph = document.createElement("div");
                        ph.id = "hc5-bar-placeholder";
                        ph.style.height = barH + "px";
                        barEl.parentNode.insertBefore(ph, barEl.nextSibling);
                    }
                } else {
                    barEl.classList.remove("hc5-is-sticky");
                    barEl.style.top = "";
                    document.getElementById("hc5-bar-placeholder")?.remove();
                }
            },
            {threshold: 0}
        );
        sentinel.observe(heroEl);
    }

    function bindDropdown(barEl) {
        const toggle = barEl.querySelector(".hc5-dropdown-toggle");
        const list = barEl.querySelector(".hc5-dropdown-list");
        if (!toggle || !list) return;

        toggle.addEventListener("click", () => {
            const open = list.classList.toggle("hc5-open");
            toggle.classList.toggle("hc5-open", open);
            toggle.setAttribute("aria-expanded", open);
        });

        list.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () => {
                list.classList.remove("hc5-open");
                toggle.classList.remove("hc5-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (e) => {
            if (!barEl.contains(e.target)) {
                list.classList.remove("hc5-open");
                toggle.classList.remove("hc5-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    function bindAnchorClicks(barEl) {
        barEl.querySelectorAll("[data-hc5-anchor]").forEach((a) => {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                const targetEl = document.getElementById(a.dataset.hc5Anchor);
                if (!targetEl) return;

                const barH = document.getElementById("hc5-anchor-bar")?.getBoundingClientRect().height || 0;
                const navH = getNavHeight();
                const offset = targetEl.getBoundingClientRect().top + window.scrollY - navH - barH - 4;
                window.scrollTo({top: offset, behavior: "smooth"});

                fireGA4Event("HC5_AnchormenuClick", "Copy for the titles");
            });
        });
    }

    function setupScrollDepthTracking() {
        const thresholds = [25, 50, 75, 100];
        const fired = new Set();

        const onScroll = () => {
            const totalHeight = document.documentElement.scrollHeight;
            if (totalHeight <= 0) return;
            const topPct = (window.scrollY / totalHeight) * 100;

            thresholds.forEach((pct) => {
                if (!fired.has(pct) && topPct >= pct) {
                    fired.add(pct);
                    fireGA4Event("HC5_Scrolldepth", String(pct));
                }
            });

            if (fired.size === thresholds.length) {
                window.removeEventListener("scroll", onScroll);
            }
        };

        window.addEventListener("scroll", onScroll, {passive: true});
        onScroll();
    }

    function applyAnchorBar(heroEl, mainEl) {
        document.getElementById("hc5-anchor-bar")?.remove();
        document.getElementById("hc5-bar-placeholder")?.remove();

        assignSectionIds(mainEl, heroEl);

        heroEl.insertAdjacentHTML("afterend", buildBarHTML());
        const barEl = document.getElementById("hc5-anchor-bar");
        if (!barEl) return;

        bindDropdown(barEl);
        bindAnchorClicks(barEl);
        setupStickyBehavior(heroEl, barEl);
        setupSectionObserver();
        setupScrollDepthTracking();
        updateActiveState(ANCHOR_ITEMS[0].id);

        logInfo("Anchor bar applied");
    }

    function checkForItems() {
        if (!isExpectedPage()) return false;
        if (!q("main > div:first-of-type")) return false;
        if (document.readyState !== "complete") return false;
        return true;
    }

    async function init_HC5() {
        if (window[page_initials] === true) return;
        if (!isExpectedPage()) return;

        try {
            await waitForElementAsync(checkForItems);

            window[page_initials] = true;
            document.body.classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version-${test_version}`);

            const mainEl = q("main");
            console.log("mainEl: ", mainEl);
            const heroEl = getHeroSection();
            console.log("heroEl: ", heroEl);

            if (!mainEl || !heroEl) {
                logInfo("Required elements not found");
                return;
            }

            applyAnchorBar(heroEl, mainEl);
            logInfo("All modifications applied");
        } catch (error) {
            logInfo(`Init failed: ${error.message}`);
        }
    }

    function handleLocationChanges() {
        if (!isExpectedPage()) {
            if (document.getElementById("hc5-anchor-bar")) {
                document.getElementById("hc5-anchor-bar")?.remove();
                document.getElementById("hc5-bar-placeholder")?.remove();
document.body.classList.remove(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version-${test_version}`);
                window[page_initials] = false;
            }
            return;
        }

        if (document.getElementById("hc5-anchor-bar")) return;

        document.body.classList.remove(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version-${test_version}`);
        window[page_initials] = false;
        init_HC5();
    }

    function urlObserver() {
        const debouncedChanges = debounce(handleLocationChanges, 150);

        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(history, arguments);
            window.dispatchEvent(new Event("pushstate"));
        };

        window.addEventListener("popstate", debouncedChanges);
        window.addEventListener("pushstate", debouncedChanges);
    }

    init_HC5();
    urlObserver();
})();
