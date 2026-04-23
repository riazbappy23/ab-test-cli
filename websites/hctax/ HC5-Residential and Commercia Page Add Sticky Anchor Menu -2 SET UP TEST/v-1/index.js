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

    function injectStyles() {
        const existing = document.getElementById("hc5-styles");
        if (existing) existing.remove();

        const style = document.createElement("style");
        style.id = "hc5-styles";
        style.textContent = `
            #hc5-anchor-bar {
                background: #3B76B7;
                width: 100%;
                z-index: 1000;
                transition: box-shadow 0.25s;
            }
            #hc5-anchor-bar.hc5-is-sticky {
                position: fixed;
                left: 0;
                right: 0;
                box-shadow: 0 3px 14px rgba(0,0,0,0.22);
            }

            .hc5-anchor-nav {
                display: flex;
                align-items: center;
                justify-content: center;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .hc5-anchor-nav a {
                display: block;
                color: rgba(255,255,255,0.82) !important;
                font-family: Roboto Serif, serif;
                font-size: 15px;
                font-weight: 500;
                letter-spacing: 0.01em;
                padding: 16px 30px;
                text-decoration: none !important;
                border-bottom: 3px solid transparent;
                transition: color 0.18s, border-color 0.18s, background 0.18s;
                white-space: nowrap;
                cursor: pointer;
            }
            .hc5-anchor-nav a:hover {
                color: #fff !important;
                background: rgba(255,255,255,0.06);
                text-decoration: underline;
            }
            .hc5-anchor-nav .hc5-active {
                text-decoration: underline;
            }

            .hc5-anchor-dropdown {
                display: none;
                width: calc(100% - 40px);
                margin: 10px 20px;
                position: relative;
            }
            .hc5-dropdown-toggle {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                background: #3B76B7;
                border: none;
                border-radius: 4px;
                color: #fff;
                font-family: Roboto Serif, serif;
                font-size: 15px;
                font-weight: 500;
                padding: 12px 16px;
                cursor: pointer;
                width: 100%;
                text-align: left;
            }
            .hc5-dropdown-toggle .hc5-toggle-chevron {
                transition: transform 0.2s;
                flex-shrink: 0;
            }
            .hc5-dropdown-toggle.hc5-open .hc5-toggle-chevron {
                transform: rotate(180deg);
            }
            .hc5-dropdown-list {
                display: none;
                position: absolute;
                width: 100%;
                left: 0;
                right: 0;
                top: 100%;
                background: #3B76B7;
                z-index: 1001;
                overflow: hidden;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            .hc5-dropdown-list.hc5-open {
                display: block;
            }
            .hc5-dropdown-list a {
                display: block;
                color: rgba(255,255,255,0.85) !important;
                font-family: Roboto Serif, serif;
                font-size: 15px;
                padding: 13px 18px;
                text-decoration: none !important;
                border-bottom: 1px solid rgba(255,255,255,0.07);
                transition: background 0.14s;
                cursor: pointer;
            }
            .hc5-dropdown-list a:last-child { border-bottom: none; }
            .hc5-dropdown-list a:hover,
            .hc5-dropdown-list a.hc5-active {
                background: rgba(255,255,255,0.1);
                color: #fff !important;
            }

            @media (max-width: 767px) {
                .hc5-anchor-nav      { display: none;  }
                .hc5-anchor-dropdown { display: block; }
            }
        `;
        document.head.appendChild(style);
    }

    function buildBarHTML() {
        const desktopLinks = ANCHOR_ITEMS.map((item) => `<a href="#${item.id}" data-hc5-anchor="${item.id}">${item.label}</a>`).join("");

        const mobileLinks = ANCHOR_ITEMS.map((item) => `<a href="#${item.id}" data-hc5-anchor="${item.id}">${item.label}</a>`).join("");

        const chevronSVG = `<svg class="hc5-toggle-chevron" width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M7 10l5 5 5-5z"/></svg>`;

        return `
            <div id="hc5-anchor-bar">
                <nav class="hc5-anchor-nav" aria-label="Page sections">
                    ${desktopLinks}
                </nav>
                <div class="hc5-anchor-dropdown">
                    <button class="hc5-dropdown-toggle" aria-expanded="false" aria-haspopup="listbox">
                        <span class="hc5-dropdown-label">Jump to: ${ANCHOR_ITEMS[0].label}</span>
                        ${chevronSVG}
                    </button>
                    <div class="hc5-dropdown-list" role="listbox">
                        ${mobileLinks}
                    </div>
                </div>
            </div>
        `;
    }

    function assignSectionIds(mainEl, heroEl) {
        // Overview → first direct child of main (the hero/banner section)
        if (heroEl && !heroEl.id) heroEl.id = "hc5-sec-overview";

        // Walk up from any element to its direct-child-of-main ancestor
        function getMainChild(el) {
            let node = el;
            while (node && node.parentElement !== mainEl) {
                node = node.parentElement;
            }
            return node;
        }

        // Find the main-child section whose h2/h3 contains any of the given keywords
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

                fireGA4Event("HC5_AnchorClick", a.textContent.trim());
            });
        });
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

            injectStyles();

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
                document.getElementById("hc5-styles")?.remove();
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
