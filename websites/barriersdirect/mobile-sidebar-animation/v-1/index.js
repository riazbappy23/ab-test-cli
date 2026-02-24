(() => {
    const css = `
    [x-ref="mobileMenuNavLinks"] {
        display: flex !important;
        flex-direction: column;
        visibility: hidden;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        position: fixed;
        top: 0;
        left: 0;
        width: 16rem;
        height: 100%;
        z-index: 999 !important;
    }

    [x-ref="mobileMenuNavLinks"][data-open="true"] {
        visibility: visible;
        transform: translateX(0);
    }

    body {
        overflow-x: hidden;
    }

    main {
        transition: transform 0.3s ease-in-out;
    }

    main.sidebar-open {
        transform: translateX(16rem);
    }

    .breadcrumbs-wrapper {
        transition: transform 0.3s ease-in-out;
        min-width: 100vw;
        overflow-x: hidden;
    }

    .breadcrumbs-wrapper.sidebar-open {
        transform: translateX(16rem);
    }

    #usp-header {
        transition: transform 0.3s ease-in-out;
        min-width: 100vw;
        overflow-x: hidden;
    }

    #usp-header.sidebar-open {
        transform: translateX(16rem);
    }

    body.sidebar-is-open .b-header-type {
        z-index: 100 !important;
    }

    .mini-search {
        z-index: 0 !important;
    }
    #sidebar-backdrop {
        display: none;
        position: fixed;
        top: 0;
        left: 16rem;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    #sidebar-backdrop.visible {
        display: block;
    }

    #sidebar-backdrop.active {
        opacity: 1;
    }
`;
    function injectStyles() {
        if (document.getElementById("barriersdirect-new-pdp-page-style")) return;
        const style = document.createElement("style");
        style.id = "barriersdirect-new-pdp-page-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // ─── BACKDROP
    function createBackdrop() {
        if (document.getElementById("sidebar-backdrop")) return;
        const backdrop = document.createElement("div");
        backdrop.id = "sidebar-backdrop";
        document.body.appendChild(backdrop);
        backdrop.addEventListener("click", closeMenu);
    }

    function showBackdrop() {
        const backdrop = document.getElementById("sidebar-backdrop");
        if (!backdrop) return;
        backdrop.classList.add("visible");
        backdrop.classList.add("active");
    }

    function hideBackdrop() {
        const backdrop = document.getElementById("sidebar-backdrop");
        if (!backdrop) return;
        backdrop.classList.remove("active");
        backdrop.addEventListener("transitionend", function handler() {
            backdrop.classList.remove("visible");
            backdrop.removeEventListener("transitionend", handler);
        });
    }

    // ─── LAYOUT SHIFT
    function shiftLayout() {
        const main = document.querySelector("main");
        const stickyFooter = document.querySelector(".pdp-sticky-footer-new");
        const breadcrumbs = document.querySelector(".breadcrumbs-wrapper");
        const uspHeader = document.querySelector("#usp-header");

        if (main) main.classList.add("sidebar-open");
        if (stickyFooter) stickyFooter.classList.add("hidden");
        if (breadcrumbs) breadcrumbs.classList.add("sidebar-open");
        if (uspHeader) uspHeader.classList.add("sidebar-open");
        document.body.classList.add("sidebar-is-open");
    }

    function resetLayout() {
        const main = document.querySelector("main");
        const stickyFooter = document.querySelector(".pdp-sticky-footer-new");
        const breadcrumbs = document.querySelector(".breadcrumbs-wrapper");
        const uspHeader = document.querySelector("#usp-header");

        if (main) main.classList.remove("sidebar-open");
        if (stickyFooter) stickyFooter.classList.remove("hidden");
        if (breadcrumbs) breadcrumbs.classList.remove("sidebar-open");
        if (uspHeader) uspHeader.classList.remove("sidebar-open");
        document.body.classList.remove("sidebar-is-open");
    }

    // ─── OPEN / CLOSE
    function openMenu() {
        const sidebar = document.querySelector("[x-ref='mobileMenuNavLinks']");
        if (!sidebar) return;
        sidebar.dataset.open = "true";
        showBackdrop();
        shiftLayout();
    }

    function closeMenu() {
        const sidebar = document.querySelector("[x-ref='mobileMenuNavLinks']");
        if (!sidebar) return;
        sidebar.dataset.open = "false";
        hideBackdrop();
        resetLayout();
    }

    // ─── OBSERVER
    function setupObserver(sidebar) {
        const observer = new MutationObserver(() => {
            if (sidebar.classList.contains("hidden")) {
                sidebar.classList.remove("hidden");
            }
        });
        observer.observe(sidebar, {attributes: true, attributeFilter: ["class"]});
    }

    // ─── BUTTON BINDINGS
    function bindTriggerButton(triggerBtn) {
        if (!triggerBtn) return;
        const newTrigger = triggerBtn.cloneNode(true);
        newTrigger.addEventListener("click", openMenu);
        triggerBtn.parentNode.replaceChild(newTrigger, triggerBtn);
    }

    function bindCloseButton() {
        document.addEventListener("click", function (e) {
            const closeBtnClicked = e.target.closest("[aria-label='Close menu']");
            if (closeBtnClicked) {
                e.stopPropagation();
                closeMenu();
            }
        });
    }

    // ─── INIT
    function mainJs() {
        const sidebar = document.querySelector("[x-ref='mobileMenuNavLinks']");
        const triggerBtn = document.querySelector("[x-ref='mobileMenuTrigger']");

        if (!sidebar || sidebar.dataset.initialized) return;

        sidebar.dataset.initialized = "true";
        sidebar.dataset.open = "false";

        injectStyles();
        createBackdrop();
        setupObserver(sidebar);
        animationToSidebarMenu();
        bindTriggerButton(triggerBtn);
        bindCloseButton();
    }

    const waitForElement = (selector, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        if (timer <= 0) return;
        const elements = isVariable ? window[selector] : document.querySelectorAll(selector);
        const conditionMet = isVariable ? typeof elements !== "undefined" : elements.length >= minElements;
        if (conditionMet) {
            callback(elements);
            return;
        }
        setTimeout(() => waitForElement(selector, callback, minElements, isVariable, timer - frequency, frequency), frequency);
    };

    waitForElement("body", mainJs);
})();
