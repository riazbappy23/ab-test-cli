(() => {
  const BODY_CLASS = "ab-plp-banner";

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
  }

  waitForElem(
    ".collection-banner__text-container-wrapper .collectionimagesection .collection-banner__text-container-heading",
    mainJs
  );
})();
