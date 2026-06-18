(async () => {
    const TEST_CONFIG = {
        client: "Netzproduzenten",
        project: "Electropapa",
        site_url: "https://electropapa.com/de",
        test_name: 'Test029 [Electropapa] - PDP - category "battery" - showing all variants',
        page_initials: "AB-TEST029",
        test_variation: 1,
        test_version: 0.0001,
    };

    const {page_initials, test_variation, test_version} = TEST_CONFIG;

    console.log("fired", TEST_CONFIG);

    async function waitForElementAsync(predicate, timeout = 10000, frequency = 150) {
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

    function init() {
        if (window[page_initials] === true) return;
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        window[page_initials] = true;
        const targetNode = q(".product-detail-upselling");
        targetNode.classList.remove("d-none");
    }

    await waitForElementAsync(() => q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation}) .product-detail-upselling`));
    init();
})();
