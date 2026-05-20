(async () => {
    const TEST_ID = "Test017";
    const VARIANT_ID = "V1";

    function logInfo(message) {
        console.log(`%cSGD%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    const TEST_CONFIG = {
        project: "sgd",
        site_url: "https://www.sgd.de",
        test_name: "Test017 [SGD] - Course Page - Use the existing, high-quality form from the PDP",
        page_initials: "AB-TEST017",
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

    function initSmoothScroll() {
        const buttons = document.querySelectorAll("button.btn-primary.link-modal-info-package");
        const target = q("#js-card-download");

        if (buttons.length && target) {
            buttons.forEach((btn) => {
                btn.classList.remove("link-modal-info-package");
                btn.setAttribute("type", "button");

                btn.addEventListener(
                    "click",
                    (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const offset = 50;

                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: "smooth",
                        });
                    },
                    true
                );
            });
        }
    }

    function init() {
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        initSmoothScroll();
    }

    function checkForItems() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && document.querySelectorAll("button.btn-primary.link-modal-info-package").length && q("#js-card-download"));
    }

    try {
        await waitForElementAsync(checkForItems);
        init();
    } catch (error) {
        return false;
    }
})();
