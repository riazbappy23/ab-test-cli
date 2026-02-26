(() => {
    const css = `
     /* layout shift */
    header.page-header {
        min-width: 100vw;
        overflow-x: hidden;
        transition: transform 0.3s ease-in-out;
    }
    header.page-header.sidebar-open {
        transform: translateX(16rem);
        transition: transform 0.3s ease-in-out;
    }
        main{
        min-width: 100vw;
        overflow-x: hidden;
        transition: transform 0.3s ease-in-out;
    }
    main.sidebar-open {
        transform: translateX(16rem);
        transition: transform 0.3s ease-in-out;
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

         /* New sidebar */
      #bd-mobile-sidebar-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.45);
        z-index: 99998;
        opacity: 0;
        pointer-events: none;
      }
      #bd-mobile-sidebar-overlay.bd-mobile-visible {
        opacity: 1;
        pointer-events: auto;
      }

      #bd-mobile-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 256px;
        background: #fff;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        transform: translateX(-100%);
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        overflow: hidden;
        font-family: inherit;
      }
      #bd-mobile-sidebar.bd-mobile-open {
        transform: translateX(0);
      }

      /* Header */
      #bd-mobile-sidebar .bd-mobile-header{
        color:white;
        background: #cc0000;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 14px;
        flex-shrink: 0;
      }
    #bd-mobile-sidebar .bd-mobile-footer{
    padding:10px;
    color:white;
    height: max-content;
    display:fixed;
    bottom:0;
    left:0;
    background: rgb(33 33 44)
    }
      #bd-mobile-sidebar .bd-mobile-close-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.15s;
        padding: 0;
      }

      /* Panels container */
      #bd-mobile-sidebar .bd-mobile-panels {
        position: relative;
        flex: 1;
        overflow-y: auto;
        max-height: calc(100vh - 120px);
        overflow-x: hidden
      }

      /* Panel base */
      #bd-mobile-sidebar .bd-mobile-panel {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        overflow-y: auto;
         max-height: calc(100vh - 120px);
        will-change: transform, opacity;
        transition: transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.32s cubic-bezier(0.4,0,0.2,1);
      }
      #bd-mobile-sidebar .bd-mobile-panel::-webkit-scrollbar { width: 3px; }
      #bd-mobile-sidebar .bd-mobile-panel::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

      /* Main panel */
      #bd-mobile-sidebar .bd-mobile-main-panel {
        transform: translateX(0);
        opacity: 1;
      }
      #bd-mobile-sidebar .bd-mobile-main-panel.bd-mobile-slide-out {
        transform: translateX(-100%);
        opacity: 0;
        pointer-events: none;
      }

      /* Sub panel */
      #bd-mobile-sidebar .bd-mobile-sub-panel {
        transform: translateX(100%);
        opacity: 0;
        pointer-events: none;
      }
      #bd-mobile-sidebar .bd-mobile-sub-panel.bd-mobile-slide-in {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
      }

      /* Main menu items */
      #bd-mobile-sidebar .bd-mobile-main-list {
        list-style: none;
        margin: 0;
        padding: 4px 0;
      }
      #bd-mobile-sidebar .bd-mobile-main-item {
        position: relative;
      }
 

      #bd-mobile-sidebar .bd-mobile-main-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        transition: background 0.15s;
        font-family: inherit;
      }
      #bd-mobile-sidebar .bd-mobile-main-btn:hover { background: #fafafa; }
      #bd-mobile-sidebar .bd-mobile-main-btn:active { background: #f5f5f5; }

        #bd-mobile-sidebar .bd-mobile-main-btn a:focus {
        text-decoration: underline;
        }
        #bd-mobile-sidebar .bd-mobile-main-btn a:active {
        text-decoration: underline;
        }

      #bd-mobile-sidebar .bd-mobile-main-btn-label {
        flex: 1;
        text-align: left;
      }
      #bd-mobile-sidebar .bd-mobile-arrow-icon {
        flex-shrink: 0;
        margin-left: 8px;
        transition: transform 0.2s ease;
        display: flex;
        align-items: center;
      }
      #bd-mobile-sidebar .bd-mobile-main-btn:hover .bd-mobile-arrow-icon {
        transform: translateX(3px);
      }

      /* Sub panel header row */
      #bd-mobile-sidebar .bd-mobile-sub-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-bottom: 1px solid #f0f0f0;
        flex-shrink: 0;
      }
      #bd-mobile-sidebar .bd-mobile-back-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 13px;
        font-weight: 700;
        color: #1a1a1a;
        padding: 4px 6px 4px 4px;
        border-radius: 4px;
        transition: background 0.15s;
        font-family: inherit;
      }
      #bd-mobile-sidebar .bd-mobile-back-btn:hover { background: #f5f5f5; }

      #bd-mobile-sidebar .bd-mobile-view-all-link {
        font-size: 11.5px;
        font-weight: 700;
        color: #cc0000;
        text-decoration: none;
        letter-spacing: 0.01em;
      }
      #bd-mobile-sidebar .bd-mobile-view-all-link:hover { text-decoration: underline; }

      /* Sub menu list */
      #bd-mobile-sidebar .bd-mobile-sub-list {
        list-style: none;
        margin: 4px 0;
        padding: 0;
      }
      #bd-mobile-sidebar .bd-mobile-sub-item {
        position: relative;
        transition: background 0.15s;
      }
      #bd-mobile-sidebar .bd-mobile-sub-item::after {
        content: '';
        position: absolute;
        left: 16px; right: 16px; bottom: 0;
        height: 1px;
        background: #f0f0f0;
      }
      #bd-mobile-sidebar .bd-mobile-sub-item:last-child::after { display: none; }
      #bd-mobile-sidebar .bd-mobile-sub-item:hover { background: #fafafa; }
      #bd-mobile-sidebar .bd-mobile-sub-item:active { background: #f5f5f5; }

      #bd-mobile-sidebar .bd-mobile-sub-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 16px;
        text-decoration: none;
      }
      #bd-mobile-sidebar .bd-mobile-sub-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #bd-mobile-sidebar .bd-mobile-sub-icon svg {
        width: 28px;
        height: 28px;
      }
      #bd-mobile-sidebar .bd-mobile-sub-label {
        font-size: 13px;
        font-weight: 500;
        color: #222;
        line-height: 1.35;
      }`;

    // INJECT STYLES
    function injectStyles() {
        if (document.getElementById("bd-mobile-sidebar-styles")) return;
        const style = document.createElement("style");
        style.id = "bd-mobile-sidebar-styles";
        style.textContent = css;
        document.head.appendChild(style);
    }

    const SELECTORS = {
        pageHeader: document.querySelector("header.page-header"),
        sidebar: document.querySelector("[x-ref='mobileMenuNavLinks']"),
        triggerBtn: document.querySelector("[x-ref='mobileMenuTrigger']"),
        main: document.querySelector("main"),
        stickyFooter: document.querySelector(".pdp-sticky-footer-new"),
        breadcrumbs: document.querySelector(".breadcrumbs-wrapper"),
        uspHeader: document.querySelector("#usp-header"),
    };
    const {pageHeader, sidebar, triggerBtn, main, stickyFooter, breadcrumbs, uspHeader} = SELECTORS || {};

    // HELPER FUNCTION TO GET SLUG
    const getFirstSlug = (url = "") => {
        try {
            return new URL(url).pathname.split("/").filter(Boolean)[0] || "";
        } catch {
            return "";
        }
    };

    // BUILD SIDEBAR DOM
    function buildSidebar() {
        if (document.getElementById("bd-mobile-sidebar")) return;

        // Backdrop
        const backdrop = document.createElement("div");
        backdrop.id = "bd-mobile-sidebar-overlay";
        document.body.appendChild(backdrop);

        // Sidebar shell
        const sidebar = document.createElement("div");
        sidebar.id = "bd-mobile-sidebar";
        sidebar.setAttribute("role", "dialog");
        sidebar.setAttribute("aria-modal", "true");
        sidebar.setAttribute("aria-label", "Navigation menu");
        sidebar.innerHTML = `
      <div class="bd-mobile-header">
        <button class="bd-mobile-close-btn" aria-label="Close menu">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2L14 14M14 2L2 14" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="bd-mobile-panels">
        <div class="bd-mobile-panel bd-mobile-main-panel">
          <ul class="bd-mobile-main-list"></ul>
        </div>
        <div class="bd-mobile-panel bd-mobile-sub-panel">
          <div class="bd-mobile-sub-header">
            <button class="bd-mobile-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
</svg>
              <span class="bd-mobile-sub-title">Menu</span>
            </button>
            <a class="bd-mobile-view-all-link" href="#">View All Products</a>
          </div>
          <ul class="bd-mobile-sub-list"></ul>
        </div>
      </div>
      <div class="bd-mobile-footer">
       <h6 class="pb-5 pt-3 border-b border-white mb-5 text-[18px]">Need help Finding The Right Product?</h6>
       <div class="contact-us-div">
                <a href="tel:0800 0288010" class="contact-us text-[13px] flex">
                    <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class=" p-1" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
</svg>
</span>
                    <span>0800 0288010</span></a>
                <a href="mailto:support@barriersdirect.co.uk" class="contact-us text-[13px] underline flex">
                    <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class=" p-1" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
</svg>
</span>
                    <span>Email Us</span>
                </a>
            </div>
      </div>
    `;
        document.body.appendChild(sidebar);

        return {sidebar, backdrop};
    }

    // EXTRACT MENU DATA
    function extractMenuData() {
        const items = document.querySelectorAll("[x-ref='mobileMenuNavLinks'] > ul > li.level-0");
        const menu = [];

        items.forEach((li) => {
            const link = li.querySelector("a");
            const subUl = li.querySelector("[data-child-id] ul");
            const item = {
                title: link?.innerText.trim(),
                url: link?.href || null,
                children: [],
            };

            if (subUl) {
                subUl.querySelectorAll(":scope > li").forEach((subLi) => {
                    const subLink = subLi.querySelector("a");
                    item.children.push({
                        title: subLink?.innerText.trim(),
                        url: subLink?.href,
                        svg: subLink?.querySelector("svg")?.outerHTML || "",
                    });
                });
            }

            if (item.title) menu.push(item);
        });
        return menu;
    }

    // RENDER MAIN MENU
    function renderMainMenu(menuData, mainList) {
        mainList.innerHTML = "";
        menuData.forEach((item) => {
            const samePage = getFirstSlug(item?.url) === getFirstSlug(window.location.href);

            const li = document.createElement("li");
            li.className = "bd-mobile-main-item";
            li.innerHTML = `
        <div class="bd-mobile-main-btn" type="button">
        <a class="flex items-center w-full cursor-pointer text-sm font-sansopen font-bold bd-mobile-main-btn-label ${samePage ? "underline" : ""}" href="${item.url}" title="Bollards">${item.title}</a>
          <span class="bd-mobile-arrow-icon">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-full h-full p-1" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
</svg>
          </span>
        </div>
      `;
            li.querySelector(".bd-mobile-arrow-icon").addEventListener("click", () => {
                showSubMenu(item);
            });
            mainList.appendChild(li);
        });
    }

    // SHOW SUB MENU
    function showSubMenu(item) {
        const newSidebar = document.getElementById("bd-mobile-sidebar");
        const mainPanel = newSidebar.querySelector(".bd-mobile-main-panel");
        const subPanel = newSidebar.querySelector(".bd-mobile-sub-panel");
        const subTitle = newSidebar.querySelector(".bd-mobile-sub-title");
        const viewAllLink = newSidebar.querySelector(".bd-mobile-view-all-link");
        const subList = newSidebar.querySelector(".bd-mobile-sub-list");

        subTitle.textContent = item.title;
        viewAllLink.href = item.url || "#";

        // Populate sub items
        subList.innerHTML = "";
        (item.children || []).forEach((child) => {
            if (!child.title) return;
            const li = document.createElement("li");
            li.className = "bd-mobile-sub-item";
            li.innerHTML = `
        <a class="bd-mobile-sub-link" href="${child.url || "#"}">
          <span class="bd-mobile-sub-icon">${child.svg || ""}</span>
          <span class="bd-mobile-sub-label">${child.title}</span>
        </a>
      `;
            subList.appendChild(li);
        });

        subPanel.scrollTop = 0;
        mainPanel.classList.add("bd-mobile-slide-out");
        subPanel.classList.add("bd-mobile-slide-in");
    }
    //  SHOW MAIN MENU
    function showMainMenu() {
        const newSidebar = document.getElementById("bd-mobile-sidebar");
        const mainPanel = newSidebar.querySelector(".bd-mobile-main-panel");
        const subPanel = newSidebar.querySelector(".bd-mobile-sub-panel");
        mainPanel.classList.remove("bd-mobile-slide-out");
        subPanel.classList.remove("bd-mobile-slide-in");
        mainPanel.scrollTop = 0;
    }

    // LAYOUT SHIFT
    function setMenuState(isOpen) {
        if (!sidebar) return;

        sidebar.dataset.open = String(isOpen);

        const newSidebar = document.getElementById("bd-mobile-sidebar");
        const backdrop = document.getElementById("bd-mobile-sidebar-overlay");
        newSidebar.classList.toggle("bd-mobile-open", isOpen);
        backdrop.classList.toggle("bd-mobile-visible", isOpen);

        pageHeader?.classList.toggle("sidebar-open", isOpen);
        main?.classList.toggle("sidebar-open", isOpen);
        stickyFooter?.classList.toggle("hidden", isOpen);
        breadcrumbs?.classList.toggle("sidebar-open", isOpen);
        uspHeader?.classList.toggle("sidebar-open", isOpen);
        document.body.classList.toggle("sidebar-is-open", isOpen);

        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            setTimeout(showMainMenu, 360);
            document.body.style.overflow = "";
        }
    }

    // OPEN / CLOSE
    const openSidebar = () => setMenuState(true);
    const closeSidebar = () => setMenuState(false);

    // HOOK TRIGGER BUTTON
    function hookTriggerButton() {
       const newSidebar = document.getElementById("bd-mobile-sidebar");
        if (!triggerBtn && !newSidebar) return false;

        const clone = triggerBtn.cloneNode(true);
        triggerBtn.parentNode.removeAttribute("style");
        triggerBtn.parentNode.replaceChild(clone, triggerBtn);

        clone.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSidebar();
        });

        return true;
    }

    // OBSERVE ORIGINAL SIDEBAR FOR DATA WHEN READY
    function waitForMenuData(callback, timer = 30000, frequency = 200) {
        if (timer <= 0) {
            return;
        }
        const items = document.querySelectorAll("[x-ref='mobileMenuNavLinks'] ul > li");
        if (items.length > 0) {
            callback();
            return;
        }
        setTimeout(() => waitForMenuData(callback, timer - frequency, frequency), frequency);
    }

    // HIDE ORIGINAL SIDEBAR
    function hideOriginalSidebar() {
        if (!sidebar) return;
        sidebar.style.display = "none";
    }

    // INIT
    function init() {
        injectStyles();
        const {sidebar} = buildSidebar();

        // Wire up close btn
        sidebar.querySelector(".bd-mobile-close-btn").addEventListener("click", closeSidebar);

        // Wire up back btn
        sidebar.querySelector(".bd-mobile-back-btn").addEventListener("click", showMainMenu);

        // Wire up backdrop
        document.getElementById("bd-mobile-sidebar-overlay").addEventListener("click", closeSidebar);

        // Keyboard: Escape closes
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && sidebar.classList.contains("bd-mobile-open")) closeSidebar();
        });

        // Wait for original nav data, then extract + render
        waitForMenuData(() => {
            const menuData = extractMenuData();

            if (menuData.length === 0) {
                return;
            }

            const mainList = sidebar.querySelector(".bd-mobile-main-list");
            renderMainMenu(menuData, mainList);

            // Observe for any dynamic changes to the original nav
            const originalNav = document.querySelector("[x-ref='mobileMenuNavLinks']");
            if (originalNav) {
                const observer = new MutationObserver(() => {
                    const freshData = extractMenuData();
                    if (freshData.length > 0) renderMainMenu(freshData, mainList);
                });
                observer.observe(originalNav, {childList: true, subtree: true});
            }

            // Hide original sidebar UI
            hideOriginalSidebar();

            // Hook the trigger button — retry if Alpine hasn't rendered it yet
            const hookWithRetry = (tries = 0) => {
                if (hookTriggerButton()) return;
                if (tries < 50) setTimeout(() => hookWithRetry(tries + 1), 200);
            };
            hookWithRetry();
        });
    }

    // ENTRY POINT
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
