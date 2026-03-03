(() => {
    // CSS
    const css = `
        .pdp-usp-section-container { font-size: 14px; }
        .pdp-usp-icon { flex-shrink: 0; }
        .pdp-usp-icon svg { width: 28px; height: 28px; }
        .pdp-usp-text { font-size: 13px; font-weight: 500; }
        .pdp-usp-phone { font-size: 12px; }

        .usp-backdrop {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5);
            opacity: 0; visibility: hidden;
            transition: opacity .3s ease;
            z-index: 9998;
        }
        .usp-backdrop.active { opacity: 1; visibility: visible; }

        .usp-modal {
            position: fixed;
            left: 50%; bottom: 0;
            transform: translate(-50%, 100%);
            width: 100%; max-width: 480px; height: 85vh;
            background: white;
            border-radius: 16px 16px 0 0;
            transition: transform .35s ease;
            z-index: 9999;
            display: flex; flex-direction: column;
        }
        .usp-modal.active { transform: translate(-50%, 0%); }

        .usp-modal-content-icon svg {
            width: 28px; height: 28px;
            fill: #cc0000;
        }
        .usp-modal-content-title {
            font-size: 16px;
            font-weight: 700;
            color: #111;
            margin: 0;
            color:#0066cc;
        }
        .usp-modal-title {
            color:#0066cc; 
            }
        #usp-close {
        font-size:24px; 
        line-height:1; 
        background:none; 
        border:none; 
        cursor:pointer;
        }
        .usp-modal-sections-body-warpper{
            padding-bottom:100px;
            display:flex;
            flex-direction:column; 
            gap:0;
        }
        .usp-modal-content-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
        }
        .usp-modal-content-body {
            font-size: 13px;
            color: #444;
            line-height: 1.5;
            margin-left: 38px;
        }
        .usp-modal-content-body a {
            color: #0066cc;
            text-decoration: underline;
        }
        .usp-modal-divider {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 16px 0;
        }

        .pdp-usp-cta-section-container{
            display:flex;
            justify-content:space-between;
            align-items:center;
        }
    `;

    // SVGs
    const vanSvg = `<svg width="20" height="20" class="align-text-top fill-current text-2xl stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24.62">
        <path d="M38.73,19.35H37.37l-1.23-.94h2.58v0.94Zm-6.36,4h0a2.47,2.47,0,1,1,2.47-2.47,2.47,2.47,0,0,1-2.47,2.47Zm-17.63-4-1.23-.94h16a3.75,3.75,0,0,0-.61.94H14.74Zm-5.21,4h0A2.47,2.47,0,1,1,12,20.88,2.47,2.47,0,0,1,9.53,23.35Zm-7.85-4a0.4,0.4,0,0,1-.4-0.4V18.42H6.72a3.75,3.75,0,0,0-.61.94H1.68ZM1.27,1.27H27.92V17.14H3.25a2,2,0,0,1-2-2V1.27ZM37.41,6.15l1.31,7.9v3.09h-9v-11h7.7ZM40,14a0.63,0.63,0,0,0,0-.1L38.58,5.41A0.64,0.64,0,0,0,38,4.88H29.72V3.65a0.9,0.9,0,0,0-.53-0.82V0.64A0.64,0.64,0,0,0,28.55,0H0.64A0.64,0.64,0,0,0,0,.64V15.17a3.23,3.23,0,0,0,.67,2h0a0.64,0.64,0,0,0-.64.64V19a1.68,1.68,0,0,0,1.68,1.68H5.8c0,0.08,0,.17,0,0.25a3.74,3.74,0,0,0,7.48,0c0-.09,0-0.17,0-0.25H28.64c0,0.08,0,.17,0,0.25a3.74,3.74,0,0,0,7.48,0c0-.09,0-0.17,0-0.25h3.27A0.64,0.64,0,0,0,40,20V14Z"/>
        <circle cx="9.53" cy="20.88" r="1.09"/>
        <circle cx="32.37" cy="20.88" r="1.09"/>
        <path d="M33.27,13.11V10.66l3,2.16v0.28h-3Zm-0.64,1.27h4.22a0.64,0.64,0,0,0,.64-0.64V12.43a0.63,0.63,0,0,0,0-.1l-0.78-4.7a0.64,0.64,0,0,0-.63-0.53H32.64a0.64,0.64,0,0,0-.64.64v6A0.64,0.64,0,0,0,32.64,14.38Z"/>
    </svg>`;

    const calendarSvg = `<svg width="20" height="20" class="align-text-top fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
        <path d="M841.5,746.75a0.917,0.917,0,0,1-1.833,0v-1.833a0.917,0.917,0,1,1,1.833,0v1.833Zm12.833-1.833a0.917,0.917,0,1,0-1.833,0v1.833a0.917,0.917,0,0,0,1.833,0v-1.833Zm1.834,6.416H837.833v12.834h18.334V751.333Zm1.833-5.5V766H836V745.833h2.75v0.917a1.834,1.834,0,0,0,3.667,0v-0.917h9.167v0.917a1.833,1.833,0,1,0,3.666,0v-0.917H858Zm-14.667,7.334h-3.666v3.666h3.666v-3.666Zm5.5,5.5h-3.666v3.666h3.666v-3.666Zm-5.5,0h-3.666v3.666h3.666v-3.666Zm11-5.5h-3.666v3.666h3.666v-3.666Zm-5.5,0h-3.666v3.666h3.666v-3.666Zm5.5,9.166h-3.666v-3.666h3.666v3.666Z" transform="translate(-836 -744)"/>
    </svg>`;

    const capSvg = `<svg width="20" height="20" class="align-text-bottom fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
        <path d="M275.606,758.791a9.739,9.739,0,0,0,4.909,3.261c3.719,0.776,6.247-4.425,10.338-2.717C286.242,756.307,280.44,756.773,275.606,758.791Zm11.826,2.717-0.075-.077c-4.462,3.8-9.073,3.1-13.015-1.32-0.818.233-2.529,1.475-3.2,1.32a1.151,1.151,0,0,1-.67-0.777A10.94,10.94,0,0,1,270.1,756c0.744-4.968,5.5-8,10.115-8a8.348,8.348,0,0,1,8.479,8.85c1.859,0.621,6.843,3.261,4.834,6.289a1.341,1.341,0,0,1-.3.388C291.522,765,288.473,762.673,287.432,761.508Z" transform="translate(-270 -748)"/>
    </svg>`;

    const roundedCheckSvg = `<svg width="20" height="20" class="align-text-top fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M1163.75,759.958l-3.75-3.637,1.55-1.548,2.2,2.089,4.7-4.82,1.55,1.548ZM1165,764.5a8.5,8.5,0,1,1,8.5-8.5A8.5,8.5,0,0,1,1165,764.5Zm11.87-10.69a2.254,2.254,0,0,0,.13-0.763,2.423,2.423,0,0,0-1.05-1.982c-2.16-1.492-1.87-1.117-2.68-3.543a2.542,2.542,0,0,0-2.43-1.7h0c-2.66.01-2.2,0.152-4.34-1.353a2.624,2.624,0,0,0-3,0c-2.16,1.515-1.69,1.363-4.34,1.353h0a2.52,2.52,0,0,0-2.42,1.7c-0.82,2.431-.54,2.054-2.68,3.543a2.41,2.41,0,0,0-1.06,1.983,2.249,2.249,0,0,0,.13.762c0.83,2.428.83,1.961,0,4.38a2.245,2.245,0,0,0-.13.762,2.412,2.412,0,0,0,1.06,1.983c2.14,1.49,1.86,1.113,2.68,3.543a2.519,2.519,0,0,0,2.42,1.7h0c2.66-.009,2.2-0.152,4.34,1.353a2.624,2.624,0,0,0,3,0c2.14-1.5,1.68-1.362,4.34-1.353h0a2.541,2.541,0,0,0,2.43-1.7c0.81-2.427.52-2.052,2.68-3.543a2.423,2.423,0,0,0,1.05-1.982,2.25,2.25,0,0,0-.13-0.763C1176.04,755.761,1176.05,756.227,1176.87,753.81Z" transform="translate(-1153 -744)"/>
    </svg>`;

    // USP bar buttons
    const USP_BUTTONS = [
        {key: "shipping", text: "Fast Free Shipping*", svg: vanSvg},
        {key: "pro", text: "Pro Grade Products*", svg: roundedCheckSvg},
        {key: "expert", text: "Free Expert Advice*", svg: capSvg},
    ];

    // Modal sections
    const MODAL_SECTIONS = [
        {
            svg: capSvg,
            title: "Free Expert Advice",
            body: `At DoMyOwn, we are committed to providing <strong>outstanding customer service</strong>. Our team of experts are here to answer your questions and guide you to the products that are right for you. Check out our <a href="#">Q&A page</a> with thousands of questions and answers asked by other DIYers, or <a href="#">contact our support team</a>.`,
        },
        {
            svg: vanSvg,
            title: "Fast Free Shipping",
            body: `We always offer <strong>Fast, Free</strong> standard shipping on all orders to the continental United States, and most orders leave our warehouse within one business day. If you need your order sooner, we also offer expedited shipping options during checkout. Please see our <a href="#">Shipping Policy</a> for complete details.`,
        },
        {
            svg: calendarSvg,
            title: "90 Day No Hassle Return Policy",
            body: `We make returns <strong>easy</strong>. If your products are unopened and in a re-sellable condition, we'll be glad to take a return as long as we receive your items within 90 days of the date of purchase. You can even <a href="#">initiate the return online</a>! Please see our full <a href="#">no hassle return policy</a> for complete details.`,
        },
        {
            svg: roundedCheckSvg,
            title: "Professional Grade Products",
            body: `We sell the same products used by professional pest control companies, giving you access to the most effective solutions available — no license required for most products.`,
        },
    ];

    // UTILITIES
    function injectStyles(css) {
        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function waitForElem(selector, callback, {minElements = 1, timer = 10000, frequency = 25} = {}) {
        if (timer <= 0) return;
        const elements = document.querySelectorAll(selector);
        if (elements.length >= minElements) {
            callback(elements);
        } else {
            setTimeout(() => waitForElem(selector, callback, {minElements, timer: timer - frequency, frequency}), frequency);
        }
    }

    // Reusable: builds one modal section
    function createModalSection({svg, title, body}) {
        const section = document.createElement("div");

        const header = document.createElement("div");
        header.className = "usp-modal-content-header";
        header.innerHTML = `
            <span class="usp-modal-content-icon">${svg}</span>
            <h3 class="usp-modal-content-title">${title}</h3>
        `;

        const bodyEl = document.createElement("p");
        bodyEl.className = "usp-modal-content-body";
        bodyEl.innerHTML = body;

        section.appendChild(header);
        section.appendChild(bodyEl);
        return section;
    }

    // Builds the full scrollable modal content area
    function createModalContent() {
        const content = document.createElement("div");
        content.className = "overflow-y-auto p-4 flex-1 usp-modal-sections-body-warpper";

        MODAL_SECTIONS.forEach((sectionData, i) => {
            content.appendChild(createModalSection(sectionData));
            if (i < MODAL_SECTIONS.length - 1) {
                const hr = document.createElement("hr");
                hr.className = "usp-modal-divider";
                content.appendChild(hr);
            }
        });

        return content;
    }

    // Builds the modal header bar
    function createModalHeader() {
        const header = document.createElement("div");
        header.className = "flex items-center justify-between p-4 border-b";
        header.innerHTML = `
            <h2 class="text-lg font-semibold usp-modal-title">Why Choose DoMyOwn.com?</h2>
            <button id="usp-close">&times;</button>
        `;
        return header;
    }

    // Builds the full modal + backdrop DOM
    function createModal() {
        const backdrop = document.createElement("div");
        backdrop.className = "usp-backdrop";

        const modal = document.createElement("div");
        modal.className = "usp-modal";
        modal.appendChild(createModalHeader());
        modal.appendChild(createModalContent());

        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        return {modal, backdrop};
    }

    // Builds a single USP bar button
    function createUSPButton({text, svg, key}, onClickFn) {
        const btn = document.createElement("button");
        btn.className = "flex flex-col items-center justify-center flex-1 p-4 border border-r border-gray-200 text-center gap-2 bg-white";
        btn.innerHTML = `
            <span class="pdp-usp-icon">${svg}</span>
            <span class="pdp-usp-text">${text}</span>
        `;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClickFn(key);
        });
        return btn;
    }

    // Builds the full USP bar section
    function createUSPBar(onButtonClick) {
        const container = document.createElement("div");
        container.className = "pdp-usp-section-container py-6";

        const strip = document.createElement("div");
        strip.className = "flex justify-between items-center bg-white border-t border-b border-gray-200";

        USP_BUTTONS.forEach((item) => {
            strip.appendChild(createUSPButton(item, onButtonClick));
        });

        const phone = document.createElement("div");
        phone.innerHTML = `<p class="pdp-usp-phone font-medium text-gray-800 flex-wrap text-center pt-2">For large order quotes, please call us at <span class="font-semibold text-dark">866-5817378</span></p>`;

        container.appendChild(strip);
        container.appendChild(phone);
        return container;
    }

    // MODAL OPEN / CLOSE
    function openModal(modal, backdrop) {
        backdrop.classList.add("active");
        requestAnimationFrame(() => modal.classList.add("active"));
        document.body.style.overflow = "hidden";
    }

    function closeModal(modal, backdrop) {
        modal.classList.remove("active");
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
    }

    // ADD TO LIST AND AUTOSHIP SECTION
    const redesignCTABtn = () => {
        const addToListBtn = document.querySelector("#add-to-list");
        const autoshipable = document.querySelector("#autoshipable");
        const uspSection = document.querySelector(".pdp-usp-section-container");

        if (addToListBtn && autoshipable && uspSection) {
            addToListBtn.classList.remove("mt-4");
            addToListBtn.classList.add("mt-2");

            const container = document.createElement("div");
            container.className = "pdp-usp-cta-section-container";

            container.appendChild(addToListBtn);
            container.appendChild(autoshipable);

            uspSection.insertAdjacentElement("afterend", container);
        }
    };

    // INIT
    function addUSP() {
        if (document.querySelector(".pdp-usp-section-container")) return;
        injectStyles(css);

        const {modal, backdrop} = createModal();
        const uspBar = createUSPBar(() => openModal(modal, backdrop));

        document.querySelector("#add-to-cart-area").insertAdjacentElement("afterEnd", uspBar);
        redesignCTABtn();

        backdrop.addEventListener("click", () => closeModal(modal, backdrop));
        modal.querySelector("#usp-close").addEventListener("click", () => closeModal(modal, backdrop));
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeModal(modal, backdrop);
        });
    }

    waitForElem("#purchasing #totals", addUSP);
})();
