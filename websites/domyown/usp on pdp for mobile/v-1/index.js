(() => {
    const css = `
          .pdp-usp-section-container {
          font-size:14px;
          }
          .pdp-usp-icon {
          flex-shrink:0;
          }
          .pdp-usp-icon svg{
          width:24px;
          height:24px;
          }
          .pdp-usp-text {
          font-size:13px;
          font-weight:500;
          }
          .pdp-usp-phone {
          font-size:12px;
          }
            .usp-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                opacity: 0;
                visibility: hidden;
                transition: opacity .3s ease;
                z-index: 9998;
            }
            .usp-backdrop.active {
                opacity: 1;
                visibility: visible;
            }
            .usp-modal {
                position: fixed;
                left: 50%;
                bottom: 0;
                transform: translate(-50%, 100%);
                width: 100%;
                max-width: 480px;
                height: 80vh;
                background: white;
                border-radius: 16px 16px 0 0;
                transition: transform .35s ease;
                z-index: 9999;
                display: flex;
                flex-direction: column;
            }
            .usp-modal.active {
                transform: translate(-50%, 0%);
            }
        `;

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function addUSP() {
        const AB_TEST = 1;

        // CSS INJECTION
        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);

        // DATA

        const buttonData = [
            {
                key: "shipping",
                text: "Fast Free Shipping*",
                svg: `<svg width="20" height="20" class="align-text-top fill-current text-2xl stroke-2" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24.62">
  <path d="M38.73,19.35H37.37l-1.23-.94h2.58v0.94Zm-6.36,4h0a2.47,2.47,0,1,1,2.47-2.47,2.47,2.47,0,0,1-2.47,2.47Zm-17.63-4-1.23-.94h16a3.75,3.75,0,0,0-.61.94H14.74Zm-5.21,4h0A2.47,2.47,0,1,1,12,20.88,2.47,2.47,0,0,1,9.53,23.35Zm-7.85-4a0.4,0.4,0,0,1-.4-0.4V18.42H6.72a3.75,3.75,0,0,0-.61.94H1.68ZM1.27,1.27H27.92V17.14H3.25a2,2,0,0,1-2-2V1.27ZM37.41,6.15l1.31,7.9v3.09h-9v-11h7.7ZM40,14a0.63,0.63,0,0,0,0-.1L38.58,5.41A0.64,0.64,0,0,0,38,4.88H29.72V3.65a0.9,0.9,0,0,0-.53-0.82V0.64A0.64,0.64,0,0,0,28.55,0H0.64A0.64,0.64,0,0,0,0,.64V15.17a3.23,3.23,0,0,0,.67,2h0a0.64,0.64,0,0,0-.64.64V19a1.68,1.68,0,0,0,1.68,1.68H5.8c0,0.08,0,.17,0,0.25a3.74,3.74,0,0,0,7.48,0c0-.09,0-0.17,0-0.25H28.64c0,0.08,0,.17,0,0.25a3.74,3.74,0,0,0,7.48,0c0-.09,0-0.17,0-0.25h3.27A0.64,0.64,0,0,0,40,20V14Z"></path>
  <circle cx="9.53" cy="20.88" r="1.09"></circle>
  <circle cx="32.37" cy="20.88" r="1.09"></circle>
  <path d="M33.27,13.11V10.66l3,2.16v0.28h-3Zm-0.64,1.27h4.22a0.64,0.64,0,0,0,.64-0.64V12.43a0.63,0.63,0,0,0,0-.1l-0.78-4.7a0.64,0.64,0,0,0-.63-0.53H32.64a0.64,0.64,0,0,0-.64.64v6A0.64,0.64,0,0,0,32.64,14.38Z"></path>
</svg>`,
            },
            {
                key: "returns",
                text: "90 Day Returns*",
                svg: `<svg width="20" height="20" class="align-text-top fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
  <path data-name="90 Day Return Icon" d="M841.5,746.75a0.917,0.917,0,0,1-1.833,0v-1.833a0.917,0.917,0,1,1,1.833,0v1.833Zm12.833-1.833a0.917,0.917,0,1,0-1.833,0v1.833a0.917,0.917,0,0,0,1.833,0v-1.833Zm1.834,6.416H837.833v12.834h18.334V751.333Zm1.833-5.5V766H836V745.833h2.75v0.917a1.834,1.834,0,0,0,3.667,0v-0.917h9.167v0.917a1.833,1.833,0,1,0,3.666,0v-0.917H858Zm-14.667,7.334h-3.666v3.666h3.666v-3.666Zm5.5,5.5h-3.666v3.666h3.666v-3.666Zm-5.5,0h-3.666v3.666h3.666v-3.666Zm11-5.5h-3.666v3.666h3.666v-3.666Zm-5.5,0h-3.666v3.666h3.666v-3.666Zm5.5,9.166h-3.666v-3.666h3.666v3.666Z" transform="translate(-836 -744)"></path>
</svg>`,
            },
            {
                key: "expert",
                text: "Free Expert Advice*",
                svg: `<svg width="20" height="20" class="align-text-bottom fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
  <path data-name="Expert Icon" d="M275.606,758.791a9.739,9.739,0,0,0,4.909,3.261c3.719,0.776,6.247-4.425,10.338-2.717C286.242,756.307,280.44,756.773,275.606,758.791Zm11.826,2.717-0.075-.077c-4.462,3.8-9.073,3.1-13.015-1.32-0.818.233-2.529,1.475-3.2,1.32a1.151,1.151,0,0,1-.67-0.777A10.94,10.94,0,0,1,270.1,756c0.744-4.968,5.5-8,10.115-8a8.348,8.348,0,0,1,8.479,8.85c1.859,0.621,6.843,3.261,4.834,6.289a1.341,1.341,0,0,1-.3.388C291.522,765,288.473,762.673,287.432,761.508Z" transform="translate(-270 -748)"></path>
</svg>`,
            },
        ];

        if (AB_TEST === 2) {
            buttonData[1].text = "Professional Grade Products";
        }

        // REUSABLE BUTTON FUNCTION
        function createUSPButton(text, svg, key) {
            const btn = document.createElement("button");
            btn.className = "flex flex-col items-center justify-center flex-1 p-4 border boprder-r border-gray-200 text-center gap-2 bg-white";
            btn.innerHTML = `
                <span class="pdp-usp-icon">${svg}</span>
                <span class="pdp-usp-text">${text}</span>
            `;
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(key);
            });
            return btn;
        }

        // CONTAINER
        const container = document.createElement("div");
        container.className = "pdp-usp-section-container py-6";

        const uspSection = document.createElement("div");
        uspSection.className = "flex justify-between items-center bg-white border-t border-b border-gray-200";

        buttonData.forEach((item) => {
            uspSection.appendChild(createUSPButton(item.text, item.svg, item.key));
        });
        container.appendChild(uspSection);

        const phoneSection = document.createElement("div");
        phoneSection.innerHTML = `<p class="pdp-usp-phone font-medium text-gray-800 flex-wrap text-center pt-2">For large order quotes, please call us at <span class="font-semibold text-dark">866-5817378</span></p>`;
        container.appendChild(phoneSection);

        document.querySelector("#add-to-cart-area").insertAdjacentElement("afterEnd", container);

        // MODAL

        const backdrop = document.createElement("div");
        backdrop.className = "usp-backdrop";

        const modal = document.createElement("div");
        modal.className = "usp-modal";

        modal.innerHTML = `
            <div class="flex items-center justify-between p-4 border-b">
                <h2 class="text-lg font-semibold">Why Choose DoMyOwn.com?</h2>
                <button id="usp-close" class="text-xl">&times;</button>
            </div>

            <div class="overflow-y-auto p-4 space-y-6 flex-1">

                <!-- Section 1 -->
                <div>
                    <h3 class="font-semibold text-blue-600 mb-2">Free Expert Advice</h3>
                    <p class="text-sm text-gray-700">
                        Our team of experts is here to guide you to the right products and solutions.
                    </p>
                </div>

                <!-- Section 2 -->
                <div>
                    <h3 class="font-semibold text-blue-600 mb-2">Fast Free Shipping</h3>
                    <p class="text-sm text-gray-700">
                        We offer fast, free shipping on most orders within the continental US.
                    </p>
                </div>

                <!-- Section 3 -->
                <div>
                    <h3 class="font-semibold text-blue-600 mb-2">90 Day No Hassle Returns</h3>
                    <p class="text-sm text-gray-700">
                        Easy returns within 90 days if items are unopened and in re-sellable condition.
                    </p>
                </div>

                <!-- Section 4 -->
                <div>
                    <h3 class="font-semibold text-blue-600 mb-2">Professional Grade Products</h3>
                    <p class="text-sm text-gray-700">
                        We sell the same products used by professional pest control companies.
                    </p>
                </div>

            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        // OPEN / CLOSE
        function openModal() {
            backdrop.classList.add("active");
            requestAnimationFrame(() => {
                modal.classList.add("active");
            });
            document.body.style.overflow = "hidden";
        }

        function closeModal() {
            modal.classList.remove("active");
            backdrop.classList.remove("active");
            document.body.style.overflow = "";
        }

        backdrop.addEventListener("click", closeModal);
        modal.querySelector("#usp-close").addEventListener("click", closeModal);
    }

    waitForElem("#purchasing #totals", addUSP);
})();
