(() => {
    const css = `
    [x-ref="mobileMenuNavLinks"] {
        display: flex !important;
        flex-direction: column;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        position: fixed;
        top: 0;
        left: 0;
        width: 16rem;
        height: 100%;
        z-index: 99999 !important;
    }

    [x-ref="mobileMenuNavLinks"][data-open="true"] {
        transform: translateX(0);
    }

    :webkit-scrollbar {
        display: none;
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
        z-index: 99998;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    #sidebar-backdrop.visible {
        display: block;
    }

    #sidebar-backdrop.active {
        opacity: 1;
    }
.mobile-sidebar-menu-ul .empty-div{
        display: none;
}




.mobile-sidebar-menu-items {
    position: relative;
    transition: transform .3s ease-in-out;
}

.mobile-sidebar-menu-sub-items-wrapper {
    position: absolute;
    overflow-y: hidden;
    top: 0;
    right: 0;
    transition: transform .3s ease-in-out;
}
    .mobile-sidebar-menu-sub-items-wrapper.is-active {
        transform: translateX(0);
        transition: transform .3s ease-in-out;
    }

`;
    function injectStyles() {
        if (document.getElementById("barriersdirect-new-pdp-page-style")) return;
        const style = document.createElement("style");
        style.id = "barriersdirect-new-pdp-page-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    //  ALL SELECTORS
    const SELECTORS = {
        sidebar: document.querySelector("[x-ref='mobileMenuNavLinks']"),
        triggerBtn: document.querySelector("[x-ref='mobileMenuTrigger']"),
        main: document.querySelector("main"),
        stickyFooter: document.querySelector(".pdp-sticky-footer-new"),
        breadcrumbs: document.querySelector(".breadcrumbs-wrapper"),
        uspHeader: document.querySelector("#usp-header"),
    };
    const {sidebar, triggerBtn, main, stickyFooter, breadcrumbs, uspHeader} = SELECTORS || {};

    // BACKDROP
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
        requestAnimationFrame(() => {
            requestAnimationFrame(() => backdrop.classList.add("active"));
        });
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

    // LAYOUT SHIFT
    function setMenuState(isOpen) {
        if (!sidebar) return;

        sidebar.dataset.open = String(isOpen);

        main?.classList.toggle("sidebar-open", isOpen);
        stickyFooter?.classList.toggle("hidden", isOpen);
        breadcrumbs?.classList.toggle("sidebar-open", isOpen);
        uspHeader?.classList.toggle("sidebar-open", isOpen);
        document.body.classList.toggle("sidebar-is-open", isOpen);

        isOpen ? showBackdrop() : hideBackdrop();
    }

    // OPEN / CLOSE
    const openMenu = () => setMenuState(true);
    const closeMenu = () => setMenuState(false);

    // HANDLE ANIMATION OF MENU ITEMS
    const getMenuItems = () => {
        if (!sidebar) return;

        const ul = sidebar.querySelector(":scope > ul");
        ul?.classList.add("mobile-sidebar-menu-ul");

        const topLevelItems = sidebar.querySelectorAll(":scope > ul > li");

        topLevelItems.forEach((li) => {
            li?.classList.add("mobile-sidebar-menu-items");
            const toggleBtn = li.querySelector('button[aria-haspopup="true"]');
            const secondDiv = li.querySelector("div[data-child-id]:nth-of-type(2)");
            const menuSubItems = secondDiv?.querySelector(":scope div:nth-of-type(2)");

            if (!menuSubItems) return;

            menuSubItems.classList.add("mobile-sidebar-menu-sub-items");

            const subItemsHeader = menuSubItems.querySelector(":scope > div");
            const subItemsUL = menuSubItems.querySelector(":scope > ul");

            if (subItemsHeader && subItemsUL && !menuSubItems.querySelector(".mobile-sidebar-menu-sub-items-wrapper")) {
                const wrapper = document.createElement("div");
                wrapper.classList.add("mobile-sidebar-menu-sub-items-wrapper");
                wrapper.appendChild(subItemsHeader);
                wrapper.appendChild(subItemsUL);
                menuSubItems.innerHTML = "";
                menuSubItems.appendChild(wrapper);
            }

            // Query wrapper from menuSubItems — not document
            const wrapper = menuSubItems.querySelector(".mobile-sidebar-menu-sub-items-wrapper");

            toggleBtn?.addEventListener("click", () => {
                if (!wrapper) return;
                wrapper.classList.toggle("is-active");
            });
        });

        // topLevelItems.forEach((li) => {
        //     const firstDiv = li.querySelector(":scope > div:nth-of-type(1)");

        //     if (firstDiv) {
        //         firstDiv.classList.remove("transition-transform", "duration-150", "ease-in-out", "transform", "-translate-x-full", "translate-x-0");
        //     }
        // });
    };

    // BUTTON BINDINGS
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

    // INIT
    function mainJs() {
        if (!sidebar || sidebar.dataset.initialized) return;

        sidebar.dataset.initialized = "true";
        sidebar.dataset.open = "false";

        if (sidebar.classList.contains("hidden")) {
            sidebar.classList.remove("hidden");
        }

        injectStyles();
        createBackdrop();
        getMenuItems();
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
 