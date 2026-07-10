(() => {
  const TEST_ID = "GRD-PLP-Banner";
  const VARIANT_ID = "V1";
  const NS = "ab-plp-banner";
  const BODY_CLASS = NS;

  function logInfo(message) {
    console.log(
      `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
      "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      message
    );
  }

  logInfo("fired");

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

  function mainJs() {
    const body = document.body;
    if (body.classList.contains(BODY_CLASS)) return;

    body.classList.add(BODY_CLASS);
    logInfo("applied");
  }

  waitForElem(
    ".collection-banner__text-container-wrapper .collectionimagesection .collection-banner__text-container-heading",
    mainJs
  );
})();
