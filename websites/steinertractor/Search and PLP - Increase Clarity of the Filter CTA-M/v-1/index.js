
(() => {
  const TEST_ID = "SEARCH_AND_PLP";
  const VERSION = "v-01";
  const BODY_CLASS = `AB--${TEST_ID}--${VERSION}`;

  console.log("SEARCH AND PLP -fired");

  function waitForElem(
    waitFor,
    callback,
    minElements = 1,
    isVariable = false,
    timer = 10000,
    frequency = 25
  ) {
    let elements = isVariable
      ? window[waitFor]
      : document.querySelectorAll(waitFor);
    if (timer <= 0) return;
    (!isVariable && elements.length >= minElements) ||
    (isVariable && typeof window[waitFor] !== "undefined")
      ? callback(elements)
      : setTimeout(
          () =>
            waitForElem(
              waitFor,
              callback,
              minElements,
              isVariable,
              timer - frequency
            ),
          frequency
        );
  }

  const filterSVG = `<svg class="AB--SEARCH-AND_PLP--icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="16" y2="18"/><circle cx="18" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="6" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="18" cy="18" r="2" fill="currentColor" stroke="none"/></svg>`;

  function updatePLPFilterBtn() {
    if (!document.body.classList.contains(BODY_CLASS)) return;
    waitForElem("#shop .filter-actions div", ([btn]) => {
      if (btn.classList.contains("AB--SEARCH-AND_PLP--filter-btn")) return;
      btn.classList.add("AB--SEARCH-AND_PLP--filter-btn");
      btn.innerHTML = `${filterSVG}<span class="AB--SEARCH-AND_PLP--label">Filter</span>`;
    });
  }

  function mainJs([body]) {
    console.log(
      "%cname: v-01",
      "background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px"
    );

    body.classList.add(BODY_CLASS);

    updatePLPFilterBtn();
  }

  waitForElem("body", mainJs);
})();
