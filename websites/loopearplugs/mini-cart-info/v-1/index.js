(() => {
    const css = `@media screen and (min-width: 767px) {
    .mini-cart-info-wrapper {
        display: none;
    }
}
.mini-cart-info-wrapper {
    ::-webkit-scrollbar {
        width: 0px !important;
    }
    width:calc(100% + 20px);
    margin-left: -10px;
    margin-right: 10px;
    margin-bottom: 12px;
    background: #fff;
    position: relative;
    overflow: visible;
    border: 1px solid #c5c5c5;
    border-radius: 16px;
    background: #fff;

    &.open {
        border-top: 1px solid #c5c5c5;
        border-left: 1px solid #c5c5c5;
        border-right: 1px solid #c5c5c5;
        border-radius: 16px 16px 0 0;
    }
    .mini-cart-info-bar {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        position: relative;
        background: #fff;
        border-radius: 16px;

        p {
            font-weight: 600;
            font-size: 18px;
            margin: 0;
        }

        span {
            font-size: 13px;
            color: #555;
        }
    }

    &.open .mini-cart-info-bar {
        border-radius: 16px 16px 0 0;
    }
    .mini-cart-info-actions {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    .mini-cart-info-btn {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 13px;
        white-space: nowrap;
        &.solid {
            background: #000;
            color: #fff;
        }
    }
    .mini-cart-info-toggle {
        background: none;
        border: none;
        font-size: 30px;
    }
    .mini-cart-info-dropdown {
        position: absolute;
        left: 0;
        top: 100%;
        width: 100%;
        background: #fff;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        z-index: 999;
    }

    &.open .mini-cart-info-dropdown {
        max-height: 390px;
        overflow: auto;
        border-left: 1px solid #c5c5c5;
        border-right: 1px solid #c5c5c5;
        border-bottom: 1px solid #c5c5c5;
        border-top: none;
        border-radius: 0 0 16px 16px;
    }

    .mini-cart-info-item {
        display: flex;
        align-items: center;
        padding: 10px 12px;

        &:not(:first-child) {
            border-top: 1px solid #eee;
        }

        img {
            width: 42px;
            margin-right: 10px;
        }

        .mini-cart-info-qty {
            margin-left: auto;
            font-weight: 600;
        }
    }
}
`;

    if (!document.getElementById("mini-cart-info-style")) {
        const style = document.createElement("style");
        style.id = "mini-cart-info-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // utils
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    // initial state
    let refreshing = false;
    let eventsBound = false;

    // WAIT FOR ELEMENT POLL FUNCTION
    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);

        if (timer <= 0) return;

        const conditionMet = isVariable ? typeof window[waitFor] !== "undefined" : elements.length >= minElements;

        conditionMet ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    };

    // fetch cart data
    const fetchCart = async () => {
        try {
            const res = await fetch("/cart.js");
            return await res.json();
        } catch {
            return null;
        }
    };

    // mini cart info bar
    const getCartInfoBar = (cart) =>
        `<div class="mini-cart-info-bar">
            <div>
                <p>Your saved items are waiting</p>
                <span>
                    ${cart.item_count} items · $${(cart.total_price / 100).toFixed(2)}
                </span>
            </div>

            <div class="mini-cart-info-actions">
                <a href="/cart" class="mini-cart-info-btn outline">
                    View Cart
                </a>
                <a href="/checkout" class="mini-cart-info-btn solid">
                    Checkout
                </a>
                <button class="mini-cart-info-toggle">▾</button>
            </div>
        </div>`;

    // cart items
    const getCartItems = (cart) => {
        if (!cart || cart?.item_count === 0) return "";

        const items = cart?.items
            .slice(0, 4)
            .map(
                (item) => `
    <div class="mini-cart-info-item">
      <img src="${item?.image}" />
      <div>
        <p class="mini-cart-info-title">${item?.product_title}</p>
        <p class="mini-cart-info-variant">${item?.variant_title}</p>
        <p class="mini-cart-info-price">$${(item?.price / 100).toFixed(2)}</p>
      </div>
      <span class="mini-cart-info-qty">${item?.quantity}</span>
    </div>
  `
            )
            .join("");

        return `<div class="mini-cart-info-dropdown">${items}</div>`;
    };

    // render mini cart summary
    const renderCartSummary = (cart) => {
        if (!cart || cart.item_count === 0 || !isMobile()) {
            document.querySelector(".mini-cart-info-wrapper")?.remove();
            return;
        }

        let wrapper = document.querySelector(".mini-cart-info-wrapper");
        if (!wrapper) {
            wrapper = document.createElement("div");
            wrapper.className = "mini-cart-info-wrapper";

            const breadcrumbs = document.querySelector(".breadcrumbs");
            breadcrumbs?.insertAdjacentElement("afterend", wrapper);
        }

        wrapper.innerHTML = `
      ${getCartInfoBar(cart)}
      ${getCartItems(cart)}

  `;
    };

    // listeners
    const bindEvents = () => {
        document.body.addEventListener("click", (e) => {
            if (e.target.closest(".mini-cart-info-toggle")) {
                document.querySelector(".mini-cart-info-wrapper")?.classList.toggle("open");
            }
        });
    };

    const refresh = async () => {
        if (refreshing) return;
        refreshing = true;

        const cart = await fetchCart();
        renderCartSummary(cart);

        // allow next refresh shortly after
        setTimeout(() => {
            refreshing = false;
        }, 100);
    };

    // Trigger refresh after cart updates
    const interceptCartFetch = () => {
        if (window.__cartFetchPatched) return;
        window.__cartFetchPatched = true;

        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            const res = await originalFetch(...args);

            try {
                const url = args[0]?.toString() || "";
                if (url.includes("/cart/")) {
                    setTimeout(refresh, 150);
                }
            } catch {}

            return res;
        };
    };

    // init
    const init = () => {
        if (!isMobile() || eventsBound) return;
        eventsBound = true;
        interceptCartFetch();
        bindEvents();
        refresh();
    };

    waitForElem("#MainContent", init);
})();
