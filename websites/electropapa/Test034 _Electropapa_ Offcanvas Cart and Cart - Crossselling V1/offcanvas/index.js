(() => {
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
  
  const cartRecommendationsApiUrl =
    "/de/widgets/elio-data-discovery/cart-recommendations";
  const offcanvasCartRecommendationsApiUrl =
    "/de/widgets/elio-data-discovery/cart-recommendations?offcanvas=1";

  async function fetchCartRecommendations(apiUrl, label) {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json",
        },
      });

      
      console.log("response Test034: ", response);
      if (!response.ok) {
        console.error(`[Test034] ${label} request failed:`, response.status);
        return;
      }

      const raw = await response.text();
      console.log("raw Test034: ", raw);

      if (!raw.trim()) {
        console.log(`[Test034] ${label}: empty response (no recommendations)`);
        return;
      }

      // Response may be JSON or a rendered HTML widget snippet
      try {
        const data = JSON.parse(raw);
        console.log(`[Test034] ${label} products (JSON):`, data);
      } catch (_) {
        const doc = new DOMParser().parseFromString(raw, "text/html");
        const products = doc.querySelectorAll(
          ".product-box, .card.product-box, [data-product-id]"
        );
        console.log(`[Test034] ${label} products (HTML):`, products);
        console.log(`[Test034] ${label} raw HTML:`, doc.body);
      }
    } catch (error) {
      console.error(`[Test034] ${label} fetch error:`, error);
    }
  }

  function mainJs([body]) {
    fetchCartRecommendations(cartRecommendationsApiUrl, "Cart");
    fetchCartRecommendations(
      offcanvasCartRecommendationsApiUrl,
      "Offcanvas cart"
    );
  }

  waitForElem("body", mainJs);
})();
