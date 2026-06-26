(() => {
    const TEST_ID = "SEARCH_AND_PLP";
    const VERSION = "control";
    const BODY_CLASS = `AB--${TEST_ID}`;

    console.log(`%c${TEST_ID} - ${VERSION}`, "background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px");

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function adddClassTobutton() {
        if (!document.body.classList.contains(BODY_CLASS)) return;
        waitForElem("#shop .filter-actions div.btn", ([btn]) => {
            if (btn.classList.contains("AB--SEARCH-AND_PLP--filter-btn")) return;
            btn.classList.add("AB--SEARCH-AND_PLP--filter-btn");
        });

         waitForElem(".sli_facets .filters .filter-actions div.btn", ([btn]) => {
            if (btn.classList.contains("AB--SEARCH-AND_PLP--filter-btn")) return;
            btn.classList.add("AB--SEARCH-AND_PLP--filter-btn");
            btn.innerHTML = `${filterSVG}<span class="AB--SEARCH-AND_PLP--label">Filter</span>`;
        });
    }

    function mainJs([body]) {
        if (window[TEST_ID] === true) return;
        window[TEST_ID] = true;

        body.classList.add(BODY_CLASS);

        adddClassTobutton();
    }

    waitForElem("body", mainJs);
})();
