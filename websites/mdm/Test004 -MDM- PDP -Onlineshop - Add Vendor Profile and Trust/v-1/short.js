(() => {
    if (window.__test004VendorTrustInitialized) return;
    window.__test004VendorTrustInitialized = true;

    const selectors = {
        productGrid: "main > .tw-l-container",
    };

    const assets = {};
    const partnerData = {
        title: "Wir sind offizieller Partner staatlicher Prägestätten",
        benefits: [
            {
                img: assets.trustIcon,
                desc: "Mit Echtheitszertifikat/ Herkunftsnachweis",
            },
            {
                img: assets.logo,
                desc: "Größtes Münzhandelshaus der Welt mit über 50 Jahren Erfahrung",
            },
            {
                img: assets.peoples,
                desc: "Über 1 Million+ begeisterte Sammler vertrauen auf MDM",
            },
        ],
        partnershipTitle: "Ein Auszug unserer Partnerschaften mit den wichtigsten Prägestätten der Welt:",
        partnerLogos: {img: "https://res.cloudinary.com/dmlzysqhx/image/upload/v1776867051/Group_31_myei6w.png"},
    };

    const ratingBadges = [
        {
            alt: "Google Rating",
            link: "https://de.trustpilot.com/review/www.mdm.de",
            svg: ``,
        },
        {
            alt: "Trust Rating",
            link: "https://de.trustpilot.com/review/www.mdm.de",
            svg: ``,
        },
    ];

    const createTrustSection = () => {
        const {title, benefits, partnershipTitle, partnerLogos, ratings} = partnerData;

        const html = `
    <div class="test004-vendor-trust-container">
      <h4 class="test004-trust-title">${title}</h4>
      <div class="test004-trust-benefits">
        ${benefits
            .map(
                (item) => `
          <div class="test004-benefit-card">
            <div class="test004-benefit-icon">
              ${item.img}
            </div>
            <p class="test004-benefit-desc">${item.desc}</p>
          </div>
        `
            )
            .join("")}
      </div>

      <div class="test004-partnership-world">
        <h4 class="test004-partnership-title">${partnershipTitle}</h4>
        <div class="test004-partner-logos">
          <img src="${partnerLogos.img}" alt="partner" />
        </div>
        <div class="test004-rating-badges">
  ${ratingBadges
      .map(
          (badge) => `
    <a href="${badge.link}" target="_blank" rel="noopener noreferrer" class="test004-rating-badge-card">
      ${badge.svg}
    </a>
  `
      )
      .join("")}
</div>
      </div>
    </div>
  `;

        return html;
    };

    const processingElements = new WeakSet();
    const activeObservers = new Set();

    function mainJs(elements) {
        const products = elements instanceof NodeList || Array.isArray(elements) ? elements : [elements];

        products.forEach((productGrid) => {
            if (!productGrid || processingElements.has(productGrid)) return;

            productGrid.dataset.test004Observed = "true";

            const inject = () => {
                if (!isPDPPage()) return;
                if (processingElements.has(productGrid)) return;
                processingElements.add(productGrid);

                try {
                    const currentContent = productGrid.querySelector(".dop-product-content, .l-product-content");
                    let container = productGrid.querySelector(".test004-vendor-trust-container");

                    if (currentContent) {
                        currentContent.dataset.test004Observed = "true";

                        if (!container) {
                            currentContent.insertAdjacentHTML("afterbegin", createTrustSection());
                            document.body.classList.add("test004-vendor-trust");
                        } else if (!currentContent.contains(container) || currentContent.firstElementChild !== container) {
                            currentContent.insertAdjacentElement("afterbegin", container);
                        }
                    } else if (!container) {
                        productGrid.insertAdjacentHTML("beforeend", createTrustSection());
                        document.body.classList.add("test004-vendor-trust");
                    }
                } finally {
                    processingElements.delete(productGrid);
                }
            };

            const existing = productGrid.querySelector(".test004-vendor-trust-container");
            if (!existing) inject();

            if (productGrid.dataset.test004ObserverSet) return;
            productGrid.dataset.test004ObserverSet = "true";

            const observer = new MutationObserver((mutations) => {
                let shouldReinject = false;

                for (const mutation of mutations) {
                    if (mutation.type === "childList") {
                        for (const node of mutation.removedNodes) {
                            if (node.nodeType === 1 && node.classList && (node.classList.contains("test004-vendor-trust-container") || node.classList.contains("dop-product-content"))) {
                                shouldReinject = true;
                                break;
                            }
                        }
                        if (shouldReinject) break;

                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1 && node.classList && node.classList.contains("dop-product-content")) {
                                shouldReinject = true;
                                break;
                            }
                        }
                    }
                }

                if (shouldReinject) inject();
            });

            observer.observe(productGrid, {childList: true, subtree: true});
            activeObservers.add(observer);
        });
    }

    async function waitForElem(predicate, timeout = 20000, frequency = 150) {
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

    function onUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                callback();
            }
        }).observe(document, {subtree: true, childList: true});
    }

    function observeElemPersistent(selector, callback) {
        let timeout = null;
        let observer = null;

        const start = () => {
            if (!document.body) {
                setTimeout(start, 10);
                return;
            }

            observer = new MutationObserver((mutations) => {
                const hasRelevantAddition = mutations.some((mutation) => Array.from(mutation.addedNodes).some((node) => node.nodeType === 1 && (node.matches(selector) || node.querySelector(selector))));

                if (hasRelevantAddition) {
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        const elements = document.querySelectorAll(selector);
                        if (elements.length > 0) callback(elements);
                    }, 50);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        };

        start();

        return () => {
            if (observer) observer.disconnect();
            if (timeout) clearTimeout(timeout);
        };
    }

    function isPDPPage() {
        if (document.querySelector('main [data-test-id="category-page"]')) return false;
        return !!document.querySelector('main [data-test-id="product-layout"]');
    }

    function isPLPPage() {
        return !!document.querySelector('main [data-test-id="category-page"]');
    }

    function cleanupTest() {
        activeObservers.forEach((obs) => obs.disconnect());
        activeObservers.clear();
        document.body.classList.remove("test004-vendor-trust");
        document.querySelectorAll(".test004-vendor-trust-container").forEach((el) => el.remove());
        document.querySelectorAll("[data-test004-observed]").forEach((el) => delete el.dataset.test004Observed);
        document.querySelectorAll("[data-test004-observer-set]").forEach((el) => delete el.dataset.test004ObserverSet);
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    (() => {
        let cleanup = null;

        const tryRun = (elements, retries = 60) => {
            if (isPLPPage()) {
                cleanupTest();
                return;
            }
            if (isPDPPage()) {
                mainJs(elements);
                return;
            }
            if (retries > 0) setTimeout(() => tryRun(elements, retries - 1), 100);
        };

        const init = () => {
            if (cleanup) {
                cleanup();
                cleanup = null;
            }

            waitForElem(() => isPDPPage())
                .then(() => {
                    if (!isPDPPage()) return;
                    const elements = document.querySelectorAll(selectors.productGrid);
                    mainJs(elements);
                })
                .catch(() => {});

            cleanup = observeElemPersistent(selectors.productGrid, tryRun);
        };

        const handleLocationChanges = () => {
            cleanupTest();
            init();
        };

        function urlObserver() {
            const debouncedChanges = debounce(handleLocationChanges, 150);

            const originalPushState = history.pushState;
            history.pushState = function () {
                originalPushState.apply(history, arguments);
                window.dispatchEvent(new Event("pushstate"));
            };

            window.addEventListener("popstate", debouncedChanges);
            window.addEventListener("pushstate", debouncedChanges);
        }

        init();
        urlObserver();
    })();
})();
