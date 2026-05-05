(function () {
    const config = {
        testName: "ils-test-010",
        pageInitials: "AB-TEST-010-V1",
        testVariation: 1,
    };

    function waitForElem(predicate, callback, timer = 25000, frequency = 100) {
        if (timer <= 0) return;
        if (typeof predicate === "function" && predicate()) {
            callback();
        } else {
            setTimeout(() => waitForElem(predicate, callback, timer - frequency), frequency);
        }
    }

    const init = () => {
        const container = document.querySelector('#sud-formular form div[identifier="form-row"]');
        if (container) {
            const formSection = container.closest("#sud-formular section");
            const formWrapper = container.closest("#sud-formular section > div");

            if (formSection || formWrapper) {
                formSection.classList.add("test010-form-section");
                formWrapper.classList.add("test010-form-wrapper");
            }

            const salutation = container.querySelector(".field-salutation");
            const firstName = container.querySelector(".field-firstName");
            const lastName = container.querySelector(".field-lastName");
            const email = container.querySelector(".field-email");
            const gridrow3 = container.querySelector('div[identifier="gridrow-3"]');
            const gridrow1 = container.querySelector('div[identifier="gridrow-1"]');
            const locationRow = container.querySelector('div[identifier="location-row-2"]');

            salutation?.parentElement?.classList.add("test010-row", "test010-row--step1", "test010-row--salutation");
            gridrow3?.parentElement?.classList.add("test010-row", "test010-row--step1", "test010-row--names");
            email?.parentElement?.classList.add("test010-row", "test010-row--step1", "test010-row--email");
            gridrow1?.parentElement?.classList.add("test010-row", "test010-row--step2", "test010-row--street");
            locationRow?.parentElement?.classList.add("test010-row", "test010-row--step2", "test010-row--location");

            container.insertAdjacentHTML("afterbegin", `<div class="col-12 test010-chat test010-chat--step1"><p>Gerne stellen wir Ihnen alle Infos zusammen. Wie lauten Ihre Kontaktangaben?</p></div>`);
            gridrow1?.parentElement?.insertAdjacentHTML("beforebegin", `<div class="col-12 test010-chat test010-chat--step2"><p>Vielen Dank. Damit wir Ihnen auch das gedruckte Handbuch schicken können, wie lautet Ihre Adresse?</p></div>`);

            const listEl = document.querySelector(".test010-form-wrapper .list.list--unordered-with-icon");
            if (listEl) {
                listEl.classList.remove("list--unordered-with-icon");
                listEl.classList.add("test010-list-marker");
            } 
            const formRoot = document.querySelector("#sud-formular");

            const checkStep1 = () => {
                const fn = firstName?.querySelector('[data-complete="true"]') || firstName?.querySelector(".icon-success");
                const ln = lastName?.querySelector('[data-complete="true"]') || lastName?.querySelector(".icon-success");
                const em = email?.querySelector('[data-complete="true"]') || email?.querySelector(".icon-success");

                if (fn && ln && em) {
                    formRoot?.classList.add("test010-step-2");
                } else {
                    formRoot?.classList.remove("test010-step-2");
                }
            };

            [firstName, lastName, email].forEach((field) => {
                if (field) {
                    const input = field.querySelector("input");
                    input?.addEventListener("input", checkStep1);
                    input?.addEventListener("blur", checkStep1);
                    input?.addEventListener("change", checkStep1);
                }
            });

            const observer = new MutationObserver(checkStep1);
            [firstName, lastName, email].forEach((field) => {
                if (!field) return;
                observer.observe(field, {attributes: true, subtree: true, attributeFilter: ["data-complete", "class"]});
            });

            const form = container.closest("form");
            if (form) {
                const actionsWrapper = form.querySelector(".formkit-actions");
                const originalButton = actionsWrapper?.querySelector("button");

                if (originalButton && actionsWrapper) {
                    const fakeButton = originalButton.cloneNode(true);
                    fakeButton.classList.add("test010-fake-action");
                    fakeButton.type = "button";
                    originalButton.classList.add("test010-original-action");
                    originalButton.style.display = "none";
                    actionsWrapper.insertBefore(fakeButton, originalButton);
                    fakeButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const textInputs = form.querySelectorAll(".test010-row--step1 input:not([type='hidden']):not([type='radio'])");

                        textInputs.forEach((input) => {
                            input.dispatchEvent(new Event("blur", {bubbles: true}));
                        });

                        const salutationField = form.querySelector(".field-salutation");

                        if (salutationField) {
                            const isChecked = salutationField.querySelector("input[type='radio']:checked");

                            if (!isChecked) {
                                salutationField.setAttribute("data-invalid", "true");
                                salutationField.setAttribute("data-touched", "true");

                                let messages = salutationField.querySelector(".formkit-messages");
                                let existingCustomMsg = salutationField.querySelector(".test010-custom-msg");

                                if (!existingCustomMsg) {
                                    if (!messages) {
                                        messages = document.createElement("ul");
                                        messages.className = "formkit-messages field__messages";
                                        salutationField.appendChild(messages);
                                    }

                                    const message = document.createElement("li");
                                    message.className = "formkit-message field__message test010-custom-msg";
                                    message.textContent = "Bitte Anrede auswählen";

                                    messages.appendChild(message);
                                }
                            }
                        }
                    });

                    form.addEventListener("submit", () => {
                        const customMsgs = form.querySelectorAll(".test010-custom-msg");

                        customMsgs.forEach((msg) => {
                            const parent = msg.closest(".formkit-messages");

                            msg.remove();

                            if (parent && parent.children.length === 0) {
                                parent.remove();
                            }
                        });
                    });

                    const swapActionButton = () => {
                        const step2IsOpen = formRoot?.classList.contains("test010-step-2");
                        if (step2IsOpen) {
                            fakeButton.style.display = "none";
                            originalButton.style.display = "";
                        } else {
                            fakeButton.style.display = "";
                            originalButton.style.display = "none";
                        }
                    };

                    const buttonStepObserver = new MutationObserver(swapActionButton);
                    buttonStepObserver.observe(formRoot, {
                        attributes: true,
                        attributeFilter: ["class"],
                    });

                    swapActionButton();
                }
            }

            checkStep1();
        }
    };

    const isReady = () => {
        const container = document.querySelector('#sud-formular form div[identifier="form-row"]');
        if (!container) return false;
        const hasFields = container.querySelector(".field-salutation") && container.querySelector(".field-firstName") && container.querySelector(".field-lastName") && container.querySelector(".field-email") && container.querySelector(".field-city input");
        return hasFields && document.readyState === "complete";
    };

    waitForElem(
        () => !document.body.classList.contains(config.pageInitials.toLowerCase()) && isReady(),
        () => {
            document.body.classList.add(config.pageInitials.toLowerCase());
            console.log(`%c${config.pageInitials} v${config.testVariation}`, "background: #269b11; color: white; padding: 4px 8px; border-radius: 2px;");
            init();
        }
    );
})();
