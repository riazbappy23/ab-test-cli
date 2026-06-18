(() => {
    const TEST_ID = "VC134";
    const VARIANT_ID = "V1";

    const TEST_CONFIG = {
        client: "Acadia",
        project: "vicicollection",
        site_url: "https://www.vicicollection.com/",
        test_name: "VC134: [CART] Show Hide Klarna Shop pay Afterpay - Set Up Test",
        page_initials: "AB-VC134",
        test_version: 0.0001,
    };

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;", message);
    }

    logInfo("fired")

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function removePaymentOptions([body]) {
        document.querySelector(".cart-drawer .bag__product-installments").remove();
    }

    function mainJs([body]) {
        console.log("name: v-01");

        body.classList.add(`AB-${TEST_ID}-${VARIANT_ID}`);

        waitForElem(`.AB-${TEST_ID}-${VARIANT_ID}`, removePaymentOptions);
    }

    waitForElem("body", mainJs);
})();
