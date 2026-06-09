(async () => {
    const TEST_CONFIG = {
        client: "ROI Revolutions",
        project: "Brecks.com",
        site_url: "https://www.brecks.com/",
        test_name: "PLP - Add Filter Chips [DTM]",
        page_initials: "AB-FILTER-CHIPS",
        test_variation: 1,
        test_version: 0.0007,
    };

    const { page_initials, test_variation, test_version } = TEST_CONFIG;

    const LAYOUT_CONFIG = {
        collections: {
            "(max-width: 990.5px)": {
                insertElementSelector: ".section-inner.section-inner--full-width:has(>.collection__inner)",
                insertPosition: "afterbegin",
                mutationObserverSelector: ".filter-sidebar",
                zoneSelector: 'ul#filter-form__list-zone--sidebar input[type="checkbox"]',
                shippingSeasonSelector: 'ul#filter-form__list-shipping-season--sidebar input[type="checkbox"][value="Fall"]',
                usageSelector: 'ul#filter-form__list-usage--sidebar input[type="checkbox"]',
            },
            "(min-width: 991px)": {
                insertElementSelector: ".filter-topbar__sidebar-toggle-wrapper",
                insertPosition: "afterend",
                mutationObserverSelector: ".filter-sidebar",
                zoneSelector: 'ul#filter-form__list-zone--sidebar input[type="checkbox"]',
                shippingSeasonSelector: 'ul#filter-form__list-shipping-season--sidebar input[type="checkbox"][value="Fall"]',
                usageSelector: 'ul#filter-form__list-usage--sidebar input[type="checkbox"]',
            },
        },
        search: {
            "(max-width: 990.5px)": {
                insertElementSelector: "",
                mutationObserverSelector: "",
                insertPosition: "afterbegin",
                zoneSelector: "",
                shippingSeasonSelector: "",
                usageSelector: "",
            },
            "(min-width: 991px)": {
                insertElementSelector: "main.search-results-page .snize-horizontal-right",
                mutationObserverSelector: "main.search-results-page .snize-filters-sidebar",
                insertPosition: "afterend",
                zoneSelector: "main.search-results-page input[data-se-facet-default-title='Zone'][type='checkbox']",
                shippingSeasonSelector: "main.search-results-page input[data-se-facet-default-title='Bloom Time'][type='checkbox'][value='Fall']",
                usageSelector: "main.search-results-page input[data-se-facet-default-title='Usage'][type='checkbox']",
            },
        },
    };

    let CURRENT_LAYOUT_CONFIG = null;

    function getLayoutConfig() {
        const currentPath = window.location.pathname;

        if (!(currentPath.includes("/collections/") || currentPath.includes("/search-results-page"))) {
            return null;
        }

        const pathConfig = LAYOUT_CONFIG[currentPath.includes("collections") ? "collections" : "search"] ?? {};
        const matchedQuery = Object.keys(pathConfig).find((query) => window.matchMedia(query).matches);
        return pathConfig[matchedQuery] ?? null;
    }

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

    function qq(s, o) {
        return o ? [...s.querySelectorAll(o)] : [...document.querySelectorAll(s)];
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

    function getCookie(key) {
        try {
            if (!key || typeof key !== "string") {
                // console.error("Invalid key provided to getCookie");
                return null;
            }

            // Encode the key to handle special characters
            const encodedKey = encodeURIComponent(key);
            const cookies = `; ${document.cookie}`;

            // Find the cookie value
            const parts = cookies.split(`; ${encodedKey}=`);

            if (parts.length === 2) {
                const value = parts.pop().split(";").shift();
                return value ? decodeURIComponent(value) : null;
            }

            return null;
        } catch (error) {
            // console.error(`Error reading cookie "${key}":`, error);
            return null;
        }
    }

    function isSafari() {
        const userAgent = navigator.userAgent;
        return /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    }

    function isTouchEnabled() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    function getFilterData() {
        const { zoneSelector, shippingSeasonSelector, usageSelector } = CURRENT_LAYOUT_CONFIG;
        const PlantingZone = getCookie("PlantingZone");

        const data = [];

        const matchingFilterNodeValue = qq(zoneSelector).find((item) => PlantingZone && PlantingZone.includes(item.value))?.value ?? null;

        if (PlantingZone && matchingFilterNodeValue) {
            data.push({
                label: "Shop Your Zone: " + PlantingZone.toUpperCase(),
                controlNodeSelector: `${zoneSelector}[value="${matchingFilterNodeValue}"]`,
            });
        }

        if (q(shippingSeasonSelector)) {
            data.push({
                label: "Ships Now",
                controlNodeSelector: shippingSeasonSelector,
            });
        }

        qq(usageSelector)?.forEach((item) =>
            data.push({
                label: item.getAttribute("value"),
                controlNodeSelector: `${usageSelector}[value="${item.getAttribute("value")}"]`,
            }),
        );

        return data;
    }

    function createLayout() {
        const filterData = getFilterData();
        if (!filterData.length) return;

        const { insertElementSelector, insertPosition } = CURRENT_LAYOUT_CONFIG;

        q(insertElementSelector).insertAdjacentHTML(
            insertPosition,
            /* HTML */ `
                <div class="ab--filter-chips-wrap">
                    <div class="ab--filter-chips">
                        ${filterData
                            .map(
                                ({ label, controlNodeSelector }) => /* HTML */ `
                                    <button
                                        type="button"
                                        class="ab--filter-chip ${q(controlNodeSelector)?.checked && !q(controlNodeSelector)?.disabled ? "ab--chip-active" : ""} ${q(controlNodeSelector)
                                            ?.disabled
                                            ? "ab--chip-disabled"
                                            : ""}"
                                        data-selector="${encodeURIComponent(controlNodeSelector)}"
                                    >
                                        <span class="ab--chip-label">${label}</span>
                                    </button>
                                `,
                            )
                            .join("")}
                    </div>
                    <div class="ab--scrollbar" aria-hidden="true">
                        <div class="ab--scrollbar-thumb"></div>
                    </div>
                </div>
            `,
        );
    }

    async function recreateInnerLayout() {
        await waitForElementAsync(() => q(".ab--filter-chips"));

        const filterData = getFilterData();

        if (!filterData.length) return;

        q(".ab--filter-chips").innerHTML = /* HTML */ filterData
            .map(
                ({ label, controlNodeSelector }) => /* HTML */ `
                    <button
                        type="button"
                        class="ab--filter-chip ${q(controlNodeSelector)?.checked && !q(controlNodeSelector)?.disabled ? "ab--chip-active" : ""} ${q(controlNodeSelector)?.disabled
                            ? "ab--chip-disabled"
                            : ""}"
                        data-selector="${encodeURIComponent(controlNodeSelector)}"
                    >
                        <span class="ab--chip-label">${label}</span>
                    </button>
                `,
            )
            .join("");
    }

    function isFilterChipsScrollable(scroller) {
        return Math.ceil(scroller.scrollWidth) > Math.floor(scroller.clientWidth);
    }

    function syncFilterChipsScrollbar() {
        const scroller = q(".ab--filter-chips");
        if (!scroller) return;

        const scrollable = isFilterChipsScrollable(scroller);
        scroller.classList.toggle("ab--has-overflow-x", scrollable);

        const thumb = q(".ab--scrollbar-thumb");
        const track = q(".ab--scrollbar");
        if (!thumb || !track) return;

        track.classList.toggle("ab--scrollbar--hidden", !scrollable);

        if (!scrollable) {
            thumb.style.width = "";
            thumb.style.transform = "";
            return;
        }

        const trackWidth = track.clientWidth;
        const thumbWidth = Math.max((scroller.clientWidth / scroller.scrollWidth) * trackWidth, 24);
        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        const maxThumbOffset = trackWidth - thumbWidth;
        const thumbOffset = maxScrollLeft > 0 ? (scroller.scrollLeft / maxScrollLeft) * maxThumbOffset : 0;

        thumb.style.width = `${thumbWidth}px`;
        thumb.style.height = "5px";
        thumb.style.transform = `translate3d(${thumbOffset}px, 0, 0)`;
    }

    function scheduleFilterChipsScrollbarSync() {
        syncFilterChipsScrollbar();
        requestAnimationFrame(() => {
            syncFilterChipsScrollbar();
            requestAnimationFrame(syncFilterChipsScrollbar);
        });
    }

    function filterChipsScrollbarFunction() {
        const scroller = q(".ab--filter-chips");
        if (!scroller) return;

        scroller.addEventListener("scroll", syncFilterChipsScrollbar, { passive: true });
        const resizeObserver = new ResizeObserver(scheduleFilterChipsScrollbarSync);
        resizeObserver.observe(scroller);
        if (scroller.parentElement) resizeObserver.observe(scroller.parentElement);

        scheduleFilterChipsScrollbarSync();
        document.fonts?.ready?.then(scheduleFilterChipsScrollbarSync);
        window.addEventListener("load", scheduleFilterChipsScrollbarSync, { once: true });
        window.matchMedia("(min-width: 991px)").addEventListener("change", scheduleFilterChipsScrollbarSync);
    }

    function customScrollbarDragFunction() {
        const wrap = q(".ab--filter-chips-wrap");
        if (!wrap || wrap.dataset.abScrollbarDrag === "1") return;
        wrap.dataset.abScrollbarDrag = "1";

        let dragging = false;
        let dragStartX = 0;
        let dragStartThumbOffset = 0;

        function getScrollbarElements() {
            return {
                scroller: q(".ab--filter-chips"),
                track: q(".ab--scrollbar"),
                thumb: q(".ab--scrollbar-thumb"),
            };
        }

        function canDragCustomScrollbar() {
            const { track } = getScrollbarElements();
            return track && !track.classList.contains("ab--scrollbar--hidden");
        }

        function getScrollbarMetrics() {
            const { scroller, track, thumb } = getScrollbarElements();
            if (!scroller || !track || !thumb) return null;

            const trackWidth = track.clientWidth;
            const thumbWidth = thumb.offsetWidth;
            const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
            const maxThumbOffset = Math.max(0, trackWidth - thumbWidth);

            return { scroller, thumb, maxScrollLeft, maxThumbOffset };
        }

        function getThumbOffsetFromScroll() {
            const metrics = getScrollbarMetrics();
            if (!metrics || metrics.maxScrollLeft <= 0) return 0;
            return (metrics.scroller.scrollLeft / metrics.maxScrollLeft) * metrics.maxThumbOffset;
        }

        function scrollFromThumbOffset(thumbOffset) {
            const metrics = getScrollbarMetrics();
            if (!metrics || metrics.maxThumbOffset <= 0 || metrics.maxScrollLeft <= 0) return;

            const clampedOffset = Math.max(0, Math.min(metrics.maxThumbOffset, thumbOffset));
            metrics.scroller.scrollLeft = (clampedOffset / metrics.maxThumbOffset) * metrics.maxScrollLeft;
        }

        function startThumbDrag(clientX) {
            const { thumb } = getScrollbarElements();
            if (!thumb) return;

            dragging = true;
            dragStartX = clientX;
            dragStartThumbOffset = getThumbOffsetFromScroll();
            thumb.classList.add("ab--scrollbar-thumb--dragging");
            document.body.classList.add("ab--scrollbar-dragging");
        }

        function endThumbDrag() {
            if (!dragging) return;
            dragging = false;
            q(".ab--scrollbar-thumb")?.classList.remove("ab--scrollbar-thumb--dragging");
            document.body.classList.remove("ab--scrollbar-dragging");
        }

        wrap.addEventListener("mousedown", (e) => {
            if (!canDragCustomScrollbar()) return;

            const thumb = e.target.closest(".ab--scrollbar-thumb");
            if (thumb) {
                e.preventDefault();
                startThumbDrag(e.clientX);
                return;
            }

            const track = e.target.closest(".ab--scrollbar");
            if (track) {
                const metrics = getScrollbarMetrics();
                if (!metrics) return;

                const clickX = e.clientX - track.getBoundingClientRect().left;
                scrollFromThumbOffset(clickX - metrics.thumb.offsetWidth / 2);
                scheduleFilterChipsScrollbarSync();
            }
        });

        wrap.addEventListener(
            "touchstart",
            (e) => {
                if (!canDragCustomScrollbar() || !e.target.closest(".ab--scrollbar-thumb")) return;
                startThumbDrag(e.touches[0].clientX);
            },
            { passive: true },
        );

        document.addEventListener("mousemove", (e) => {
            if (!dragging) return;
            e.preventDefault();
            scrollFromThumbOffset(dragStartThumbOffset + (e.clientX - dragStartX));
        });

        document.addEventListener("mouseup", endThumbDrag);

        document.addEventListener(
            "touchmove",
            (e) => {
                if (!dragging) return;
                e.preventDefault();
                scrollFromThumbOffset(dragStartThumbOffset + (e.touches[0].clientX - dragStartX));
            },
            { passive: false },
        );

        document.addEventListener("touchend", endThumbDrag);
        document.addEventListener("touchcancel", endThumbDrag);
    }

    function mutationObserverFunction() {
        const { mutationObserverSelector } = CURRENT_LAYOUT_CONFIG;
        const targetNode = q(mutationObserverSelector);
        const debouncedUpdate = debounce(() => {
            recreateInnerLayout();
            scheduleFilterChipsScrollbarSync();
        }, 250);
        return new MutationObserver(debouncedUpdate).observe(targetNode, { childList: true, subtree: true, attributes: false });
    }

    function dragScrollFunction() {
        if (!window.matchMedia("(min-width: 991px)").matches) return;
        if (isTouchEnabled()) return;

        const el = q(".ab--filter-chips");
        if (!el) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let hasDragged = false;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let rafId = null;

        const DRAG_THRESHOLD = 5;
        const FRICTION = 0.92; // velocity multiplier per frame (~60fps decay)
        const MIN_VELOCITY = 0.3; // px/frame below which momentum stops
        const VELOCITY_SCALE = 16; // normalise raw px/ms to px/frame at ~60fps

        function cancelMomentum() {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        function applyMomentum() {
            velocity *= FRICTION;
            if (Math.abs(velocity) < MIN_VELOCITY) {
                velocity = 0;
                rafId = null;
                return;
            }
            el.scrollLeft -= velocity;
            rafId = requestAnimationFrame(applyMomentum);
        }

        function endDrag() {
            isDown = false;
            el.classList.remove("ab--is-dragging");
            if (hasDragged && Math.abs(velocity) > MIN_VELOCITY) {
                rafId = requestAnimationFrame(applyMomentum);
            }
        }

        el.addEventListener("mousedown", (e) => {
            cancelMomentum();
            isDown = true;
            hasDragged = false;
            velocity = 0;
            startX = e.pageX - el.getBoundingClientRect().left;
            scrollLeft = el.scrollLeft;
            lastX = e.pageX;
            lastTime = performance.now();
            el.classList.add("ab--is-dragging");
        });

        el.addEventListener("mouseleave", () => {
            if (!isDown) return;
            endDrag();
        });

        el.addEventListener("mouseup", () => {
            if (!isDown) return;
            endDrag();
        });

        el.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();

            const now = performance.now();
            const dt = now - lastTime;
            const dx = e.pageX - lastX;

            // EMA keeps velocity smooth — downweights noisy single-frame spikes
            if (dt > 0) {
                const raw = (dx / dt) * VELOCITY_SCALE;
                velocity = velocity * 0.4 + raw * 0.6;
            }

            lastX = e.pageX;
            lastTime = now;

            const x = e.pageX - el.getBoundingClientRect().left;
            const delta = x - startX;
            if (Math.abs(delta) > DRAG_THRESHOLD) hasDragged = true;
            el.scrollLeft = scrollLeft - delta;
        });

        // Suppress chip clicks that were actually drag gestures
        el.addEventListener(
            "click",
            (e) => {
                if (hasDragged) {
                    e.stopImmediatePropagation();
                    hasDragged = false;
                }
            },
            true,
        );
    }

    function clickFunction() {
        q(".ab--filter-chips").addEventListener("click", (e) => {
            const button = e.target.closest(".ab--filter-chip");

            if (button) {
                button.classList.toggle("ab--chip-active");
                const controlNodeSelector = decodeURIComponent(button.dataset.selector);
                const targetNode = q(controlNodeSelector);
                targetNode?.click();
            }
        });
    }

    async function init() {
        if (window[page_initials] === true) return;

        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        window[page_initials] = true;
        CURRENT_LAYOUT_CONFIG = getLayoutConfig();

        // console.table(TEST_CONFIG);
        // console.table(CURRENT_LAYOUT_CONFIG);

        createLayout();

        await waitForElementAsync(() => q(".ab--filter-chips-wrap"));

        clickFunction();
        dragScrollFunction();
        filterChipsScrollbarFunction();
        customScrollbarDragFunction();
        mutationObserverFunction();
    }

    function checkForItems() {
        const layoutConfig = getLayoutConfig();
        if (!layoutConfig) return false;

        // console.log("LAYOUT CONFIG", layoutConfig);

        const { insertElementSelector, mutationObserverSelector, zoneSelector, shippingSeasonSelector, usageSelector } = layoutConfig;

        return !!(
            // document.readyState === "complete" &&
            (
                q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) &&
                q(insertElementSelector) &&
                q(mutationObserverSelector) &&
                (q(zoneSelector) || q(shippingSeasonSelector) || q(usageSelector))
            )
        );
    }

    //  ================ MAIN LOGIC ================
    await waitForElementAsync(checkForItems);
    init();
})();