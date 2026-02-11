(() => {
    // DATA
    const reviewsByProduct = {
        dream: [
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Dream_Testimonial_Maria.jpg?v=1759932514",
                content: "These were the only earplugs that blocked my husbands loud snoring and gave me a great nights sleep. Comfortable and easy to use. Priceless!",
                name: "Femke K.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Dream_Testimonial_Tereza.jpg?v=1759932515",
                content: "I absolutely love them and have the best sleeps again. Thank you for making these so amazing!!!",
                name: "Femke S.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Dream_Testimonial_Merissa.jpg?v=1759932515",
                content: "Great nights sleep without any discomfort!",
                name: "Femke L.",
                verified: true,
            },
        ],
        experience: [
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Experience_Testimonial_Marte.jpg?v=1759932514",
                content: "Completely changes the live music experience.",
                name: "Femke J.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Experience_Testimonial_Maike.jpg?v=1759932515",
                content: "Music sounds awesome.",
                name: "Femke R.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Experience_Testimonial_Sebastian.jpg?v=1759932514",
                content: "Balanced sound, perfect for studio and live.",
                name: "Femke M.",
                verified: true,
            },
        ],
        engage: [
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Engage_Testimonial_Sonia.jpg?v=1759932514",
                content: "Perfect noise reduction for everyday life.",
                name: "Femke P.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Engage_Testimonial_Karen.jpg?v=1759932514",
                content: "Blocks the right amount of background noise.",
                name: "Femke L.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Engage_Testimonial_Yannick.jpg?v=1759932514",
                content: "Much easier to focus on conversation.",
                name: "Femke B.",
                verified: true,
            },
        ],
        quiet: [
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Quiet_Testimonial_Izzy.jpg?v=1759932515",
                content: "Perfect for noisy environments.",
                name: "Femke T.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Quiet_Testimonial_Chloe.jpg?v=1759932515",
                content: "Efficient way of blocking noise.",
                name: "Femke M.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Quiet_Testimonial_Claire.jpg?v=1759932514",
                content: "Helps calm my senses.",
                name: "Femke V.",
                verified: true,
            },
        ],
        switch: [
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Switch_Testimonial_Anna.jpg?v=1759932514",
                content: "Useful to change modes easily.",
                name: "Femke S.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Switch_Testimonial_Mia.jpg?v=1759932514",
                content: "Feels like superpowers!",
                name: "Femke K.",
                verified: true,
            },
            {
                image: "https://cdn.shopify.com/s/files/1/1442/3288/files/Switch_Testimonial_Emese.jpg?v=1759932514",
                content: "Changed my life in a week.",
                name: "Femke P.",
                verified: true,
            },
        ],
    };

    // WAIT FOR ELEMENT POLL FUNCTION
    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    };

    waitForElem("#MainContent", initCustomerReviews);

    // ADD REVIEW SECTION AFTER FIRST SECTION TAG
    function initCustomerReviews() {
        if (document.getElementById("customer-reviews-section")) return;

        const currentProduct = getCurrentProduct();
        if (!currentProduct) return;

        const parent = document.getElementById("MainContent");
        if (!parent) return;

        const firstSection = parent.querySelector("section");
        if (!firstSection) return;

        const reviewsSection = createReviewsSection();
        firstSection.insertAdjacentElement("afterend", reviewsSection);

        loadReviews(currentProduct);
    }

    //CURRENT PRODUCT DETECTION
    function getCurrentProduct() {
        const allowedProducts = ["switch", "dream", "quiet", "engage", "experience"];

        const path = window.location.pathname.toLowerCase();
        const segments = path.split("/").filter(Boolean);

        return allowedProducts.find((p) => segments.some((seg) => seg.includes(p))) || null;
    }

    // REVIEWS SECTION HTML
    function createReviewsSection() {
        const wrapper = document.createElement("div");
        wrapper.id = "customer-reviews-section";
        wrapper.className = "container-md";

        wrapper.innerHTML = `
      <section class="reviews">
        <div class="reviews-container">
          <div class="reviews-header">
            <p class="small">We value our customers authentic opinion on our products.</p>
            <h2>What our customers say</h2>
          </div>

          <div class="slider-container">
            <div class="slider">
              <div class="sliderBody" id="sliderBody"></div>
            </div>
          </div>
        </div>
      </section>
    `;

        return wrapper;
    }

    // CREATE SINGLE REVIEW CARD
    function createSingleReviewCard(r) {
        return `
        <div class="card-img-section">
          <img src="${r.image}" class="review-image"/>
          <div class="badge-container">
            <span class="name">${r.name}</span>
            ${r.verified ? `<span class="check-mark">✔</span><span class="verified-text">Verified buyer</span>` : ""}
          </div>
        </div>
        <div class="card-body">
          <div class="stars">★★★★★</div>
          <p>${r.content}</p>
        </div>
      `;
    }

    // RENDER ALL REVIEWS
    function loadReviews(product) {
        const reviews = reviewsByProduct[product];
        const sliderBody = document.getElementById("sliderBody");

        if (!reviews || !sliderBody) return;

        sliderBody.innerHTML = "";

        reviews.forEach((r) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = createSingleReviewCard(r);

            sliderBody.appendChild(card);
        });

        initializeMobileSlider();
    }

    // MOBILE SLIDER
    function initializeMobileSlider() {
        if (window.innerWidth > 990) return;

        const sliderBody = document.getElementById("sliderBody");
        if (!sliderBody || !sliderBody.children.length) return;

        const slider = sliderBody.closest(".slider");
        if (!slider) return;

        const cards = sliderBody.children;
        const gap = 16;
        const cardWidth = cards[0].offsetWidth + gap;

        let index = 0;
        let startX = 0;

        const dotsWrapper = document.querySelector(".reviews-slider-dots") || createDots(slider, cards.length);

        sliderBody.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            sliderBody.style.transition = "none";
        });

        sliderBody.addEventListener("touchend", (e) => {
            const diff = e.changedTouches[0].clientX - startX;
            if (diff < -50 && index < cards.length - 1) index++;
            if (diff > 50 && index > 0) index--;
            sliderBody.style.transition = "transform 0.3s ease";
            updateSlider({
                sliderBody,
                index,
                cardWidth,
                dotsWrapper,
            });
        });

        updateSlider({
            sliderBody,
            index,
            cardWidth,
            dotsWrapper,
        });
    }

    // UPDATE SLIDER
    function updateSlider({sliderBody, index, cardWidth, dotsWrapper}) {
        const slider = sliderBody.closest(".slider");

        const maxTranslate = sliderBody.scrollWidth - slider.offsetWidth;

        const desiredTranslate = index * cardWidth;

        const clampedTranslate = Math.min(desiredTranslate, maxTranslate);

        sliderBody.style.transform = `translateX(${-clampedTranslate}px)`;

        updateDots(dotsWrapper, index);
    }

    // CREATE DOTS FOR MOBILE SLIDER
    function createDots(slider, count) {
        const dots = document.createElement("div");
        dots.className = "reviews-slider-dots";
        slider.parentElement.appendChild(dots);

        for (let i = 0; i < count; i++) {
            const dot = document.createElement("span");
            dot.className = "reviews-slider-dot" + (i === 0 ? " active" : "");
            dots.appendChild(dot);
        }
        return dots;
    }

    // CHANGE ACTIVE DOTS WHEN SLIDER CHANGS
    function updateDots(wrapper, active) {
        [...wrapper.children].forEach((dot, i) => dot.classList.toggle("active", i === active));
    }

    window.addEventListener("resize", initializeMobileSlider);
})();
