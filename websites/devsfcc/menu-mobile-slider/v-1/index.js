(() => {
    console.log("Script loaded at:", document.readyState);
    const css = `
        #mfk-slider-section {
            width: 100%;
            background: #fff;
            padding: 0 0 18px 0;
            overflow: hidden;
            box-sizing: border-box;
            font-family:inherit;
        }

        #mfk-slider-track-wrapper {
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            cursor: grab;
        }

        #mfk-slider-track-wrapper::-webkit-scrollbar {
            display: none;
        }

        #mfk-slider-track-wrapper.is-dragging {
            cursor: grabbing;
            user-select: none;
        }

        #mfk-slider-track {
            display: flex;
            flex-direction: row;
            gap: 0;
            padding: 0 0 0 16px;
            width: max-content;
        }

        .mfk-slide-item {
            flex-shrink: 0;
            width: calc((100vw - 16px) / 3.4);
            margin-right: 8px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-decoration: none;
            color: inherit;
        }

        .mfk-slide-item:last-child {
            margin-right: 16px;
        }

        .mfk-slide-img-wrap {
            width: 100%;
            aspect-ratio: 1 / 1;
            overflow: hidden;
            background: #f0ece8;
        }

        .mfk-slide-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.3s ease;
        }

        .mfk-slide-item:active .mfk-slide-img-wrap img {
            transform: scale(1.03);
        }

        .mfk-slide-label {
            margin-top: 8px;
            font-size: 11px;
            line-height: 1.3;
            color: #1a1a1a;
            letter-spacing: 0.01em;
            font-weight: 400;
            text-align: left;
            max-width: 100%;
        }

        #mfk-progress-bar-container {
            width: calc(100% - 32px);
            margin: 14px 16px 0;
            height: 1.5px;
            background: #e0dbd6;
            position: relative;
            overflow: hidden;
        }

        #mfk-progress-bar {
            height: 100%;
            background: #1a1a1a;
            width: 50%;
            transition: width 0.1s linear;
            transform-origin: left center;
        }
    `;

    if (!document.getElementById("mfk-slider-style")) {
        const style = document.createElement("style");
        style.id = "mfk-slider-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // --- DATA ---
    const sliderData = [
        {
            image: "https://assets-manager.abtasty.com/ccc1f2059a7465d76a98aa279cbc277f/account/br540_repush25-kv_air-all_triptych_square_1080x1080.jpg",
            urls: {
                "eu-fr": {label: "Baccarat Rouge 540", url: "/eu-fr/collection-baccarat-rouge-540/landing-BaccaratRouge540.html"},
                "eu-en": {label: "Baccarat Rouge 540", url: "/eu-en/baccarat-rouge-540-collection/landing-BaccaratRouge540.html"},
                "eu-de": {label: "Baccarat Rouge 540", url: "/eu-de/kollektion-baccarat-rouge-540/landing-BaccaratRouge540.html"},
                "eu-it": {label: "Baccarat Rouge 540", url: "/eu-it/collezione-baccarat-rouge-540/landing-BaccaratRouge540.html"},
                "eu-es": {label: "Baccarat Rouge 540", url: "/eu-es/coleccion-baccarat-rouge-540/landing-BaccaratRouge540.html"},
                "int-fr": {label: "Baccarat Rouge 540", url: "/int-fr/collection-baccarat-rouge-540/landing-BaccaratRouge540.html"},
                "int-en": {label: "Baccarat Rouge 540", url: "/int-en/baccarat-rouge-540-collection/landing-BaccaratRouge540.html"},
                "int-es": {label: "Baccarat Rouge 540", url: "/int-es/coleccion-baccarat-rouge-540/landing-BaccaratRouge540.html"},
                "uk-en": {label: "Baccarat Rouge 540", url: "/uk-en/baccarat-rouge-540-collection/landing-BaccaratRouge540.html"},
                "us-en": {label: "Baccarat Rouge 540", url: "/us-en/baccarat-rouge-540-collection/landing-BaccaratRouge540.html"},
            },
        },
        {
            image: "https://assets-manager.abtasty.com/ccc1f2059a7465d76a98aa279cbc277f/account/alr-26_alr-solo_all_triptych_square_desktop_mobile_1080x1080_.jpg",
            urls: {
                "eu-fr": {label: "Parfums Femme", url: "/eu-fr/parfums/parfums-femme/"},
                "eu-en": {label: "Women's fragrances", url: "/eu-en/fragrances/womens-fragrances/"},
                "eu-de": {label: "Parfum Damen", url: "/eu-de/parfum/parfum-damen/"},
                "eu-it": {label: "Profumi femminili", url: "/eu-it/profumi/profumi-femminili/"},
                "eu-es": {label: "Perfumes de mujer", url: "/eu-es/perfumes/perfumes-de-mujer/"},
                "int-fr": {label: "Parfums Femme", url: "/int-fr/parfums/parfums-femme/"},
                "int-en": {label: "Women's fragrances", url: "/int-en/fragrances/womens-fragrances/"},
                "int-es": {label: "Perfumes de mujer", url: "/int-es/perfumes/perfumes-de-mujer/"},
                "uk-en": {label: "Women's fragrances", url: "/uk-en/fragrances/womens-fragrances/"},
                "us-en": {label: "Women's fragrances", url: "/us-en/fragrances/womens-fragrances/"},
            },
        },
        {
            image: "https://assets-manager.abtasty.com/ccc1f2059a7465d76a98aa279cbc277f/account/referent_-_visuel_amyris_-_format_carre_-_v44.jpg",
            urls: {
                "eu-fr": {label: "Parfums Homme", url: "/eu-fr/parfums/parfums-homme/"},
                "eu-en": {label: "Men's fragrances", url: "/eu-en/fragrances/mens-fragrances/"},
                "eu-de": {label: "Parfum Herren", url: "/eu-de/parfum/parfum-herren/"},
                "eu-it": {label: "Profumi maschili", url: "/eu-it/profumi/profumi-maschili/"},
                "eu-es": {label: "Perfumes de hombre", url: "/eu-es/perfumes/perfumes-de-hombre/"},
                "int-fr": {label: "Parfums Homme", url: "/int-fr/parfums/parfums-homme/"},
                "int-en": {label: "Men's fragrances", url: "/int-en/fragrances/mens-fragrances/"},
                "int-es": {label: "Perfumes de hombre", url: "/int-es/perfumes/perfumes-de-hombre/"},
                "uk-en": {label: "Men's fragrances", url: "/uk-en/fragrances/mens-fragrances/"},
                "us-en": {label: "Men's fragrances", url: "/us-en/fragrances/mens-fragrances/"},
            },
        },
        {
            image: "https://assets-manager.abtasty.com/ccc1f2059a7465d76a98aa279cbc277f/account/oud-26_osam_huile-70ml_all_triptych_square_desktop_mobile_1080x1080.jpg",
            urls: {
                "eu-fr": {label: "Huile corps", url: "/eu-fr/bain-corps/huile-corps/"},
                "eu-en": {label: "Body oil", url: "/eu-en/bath-body/body-oil/"},
                "eu-de": {label: "Parfümierte Körperöl", url: "/eu-de/bad-korper/parfumierte-korperol/"},
                "eu-it": {label: "Olio profumato per il corpo", url: "/eu-it/bagno-corpo/olio-profumato-per-il-corpo/"},
                "eu-es": {label: "Aceite corporal perfumado", url: "/eu-es/bagno-corpo/olio-profumato-per-il-corpo/"},
                "int-fr": {label: "Huile corps", url: "/int-fr/bain-corps/huile-corps/"},
                "int-en": {label: "Body oil", url: "/int-en/bath-body/body-oil/"},
                "int-es": {label: "Aceite corporal perfumado", url: "/int-es/bagno-corpo/olio-profumato-per-il-corpo/"},
                "uk-en": {label: "Body oil", url: "/uk-en/bath-body/body-oil/"},
                "us-en": {label: "Body oil", url: "/us-en/bath-body/body-oil/"},
            },
        },
        {
            image: "https://assets-manager.abtasty.com/ccc1f2059a7465d76a98aa279cbc277f/account/gift_ideas__v-g_boite_br540_duo-70ml_bougie-300g_new_all_triptych_square_desktop_mobile_1080x1080.jpg",
            urls: {
                "eu-fr": {label: "Duo & Trio", url: "/eu-fr/duo-trio/duo_trio.html"},
                "eu-en": {label: "Duo & Trio", url: "/eu-en/duo-trio/duo_trio.html"},
                "eu-de": {label: "Duo & Trio", url: "/eu-de/duo-trio/duo_trio.html"},
                "eu-it": {label: "Duo & Trio", url: "/eu-it/duo-trio/duo_trio.html"},
                "eu-es": {label: "Dúo & Trío", url: "/eu-es/duo-trio/duo_trio.html"},
                "int-fr": {label: "Duo & Trio", url: "/int-fr/duo-trio/duo_trio.html"},
                "int-en": {label: "Duo & Trio", url: "/int-en/duo-trio/duo_trio.html"},
                "int-es": {label: "Dúo & Trío", url: "/int-es/duo-trio/duo_trio.html"},
                "uk-en": {label: "Duo & Trio", url: "/uk-en/duo-trio/duo_trio.html"},
                "us-en": {label: "Duo & Trio", url: "/us-en/duo-trio/duo_trio.html"},
            },
        },
        {
            image: "https://assets-manager.abtasty.com/ccc1f2059a7465d76a98aa279cbc277f/account/courtesy-vive-arts-and-atlas-v_no_logo_1080x1080.jpg",
            urls: {
                "eu-fr": {label: "Conversations Artistiques", url: "/eu-fr/playing-with-fire/PDAC38.html"},
                "eu-en": {label: "Artistic Conversations", url: "/eu-en/playing-with-fire/PDAC38.html"},
                "eu-de": {label: "Künstlerdiskurse", url: "/eu-de/playing-with-fire/PDAC38.html"},
                "eu-it": {label: "Dialoghi artistici", url: "/eu-it/playing-with-fire/PDAC38.html"},
                "eu-es": {label: "Conversaciones artísticas", url: "/eu-es/playing-with-fire/PDAC38.html"},
                "int-fr": {label: "Conversation Artistique", url: "/int-fr/playing-with-fire/PDAC38.html"},
                "int-en": {label: "Artistic Conversations", url: "/int-en/playing-with-fire/PDAC38.html"},
                "int-es": {label: "Conversaciones artísticas", url: "/int-es/playing-with-fire/PDAC38.html"},
                "uk-en": {label: "Artistic Conversations", url: "/uk-en/playing-with-fire/PDAC38.html"},
                "us-en": {label: "Artistic Conversations", url: "/us-en/playing-with-fire/PDAC38.html"},
            },
        },
    ];

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    // --- LANGUAGE DETECTION ---
    function detectLanguage() {
        const segment = window.location.pathname.split("/")[1];
        return segment?.toLowerCase() || "int-en";
    }

    // --- BUILD SLIDER ---
    function buildSlider(lang) {
        if (!isMobile()) return;
        const section = document.createElement("div");
        section.id = "mfk-slider-section";

        // Track wrapper (scrollable)
        const trackWrapper = document.createElement("div");
        trackWrapper.id = "mfk-slider-track-wrapper";

        const track = document.createElement("div");
        track.id = "mfk-slider-track";

        sliderData.forEach((item) => {
            const langData = item.urls[lang] || item.urls["int-en"];

            const anchor = document.createElement("a");
            anchor.className = "mfk-slide-item";
            anchor.href = langData.url;
            anchor.setAttribute("aria-label", langData.label);

            const imgWrap = document.createElement("div");
            imgWrap.className = "mfk-slide-img-wrap";

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = langData.label;
            img.loading = "lazy";

            imgWrap.appendChild(img);

            const label = document.createElement("span");
            label.className = "mfk-slide-label";
            label.textContent = langData.label;

            anchor.appendChild(imgWrap);
            anchor.appendChild(label);
            track.appendChild(anchor);
        });

        trackWrapper.appendChild(track);
        section.appendChild(trackWrapper);

        // Progress bar
        const progressContainer = document.createElement("div");
        progressContainer.id = "mfk-progress-bar-container";

        const progressBar = document.createElement("div");
        progressBar.id = "mfk-progress-bar";
        progressContainer.appendChild(progressBar);
        section.appendChild(progressContainer);

        return {section, trackWrapper, progressBar};
    }

    // --- SCROLL PROGRESS ---
    function bindProgress(trackWrapper, progressBar) {
        trackWrapper.addEventListener(
            "scroll",
            () => {
                const shownImage = 3;
                const maxScroll = trackWrapper.scrollWidth - trackWrapper.clientWidth;
                const progress = maxScroll > 0 ? (trackWrapper.scrollLeft / maxScroll) * 100 : 0;
                const shown = (shownImage / sliderData.length) * 100;
                progressBar.style.width = progress + shown + "%";
            },
            {passive: true}
        );
    }

    // --- DRAG TO SCROLL ---
    function bindDrag(trackWrapper) {
        // Detect mouse down
        let isDown = false;
        let startX;
        let scrollLeftStart;

        trackWrapper.addEventListener("mousedown", (e) => {
            console.log("e in cli: ", e);
            isDown = true;
            trackWrapper.classList.add("is-dragging");
            startX = e.pageX - trackWrapper.offsetLeft;
            scrollLeftStart = trackWrapper.scrollLeft;
        });

        document.addEventListener("mouseup", () => {
            isDown = false;
            trackWrapper.classList.remove("is-dragging");
        });

        trackWrapper.addEventListener("mouseleave", () => {
            isDown = false;
            trackWrapper.classList.remove("is-dragging");
        });

        trackWrapper.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - trackWrapper.offsetLeft;
            // Control drag sensitivity
            const walk = (x - startX) * 1.2;
            trackWrapper.scrollLeft = scrollLeftStart - walk;
        });

        // Prevent link clicks when dragging
        trackWrapper.addEventListener(
            "click",
            (e) => {
                // If scrolled more than 5px
                if (Math.abs(trackWrapper.scrollLeft - scrollLeftStart) > 5) {
                    e.preventDefault();
                }
            },
            true
        );
    }

    // --- INIT ---
    const init = () => {
        if (!isMobile()) return;

        // Avoid duplicate injection
        if (document.getElementById("mfk-slider-section")) return;

        const lang = detectLanguage();
        const {section, trackWrapper, progressBar} = buildSlider(lang);

        // Bind behaviors
        bindProgress(trackWrapper, progressBar);
        bindDrag(trackWrapper);

        // Insert slider before nav
        const nav = document.querySelector("#menuMobile");
        if (nav) {
            nav.prepend(section);
        }
    };

    const trigger = document.querySelector("[data-target='#menuMobile']");

    if (trigger) {
        trigger.addEventListener("click", () => {
            setTimeout(init, 50);
        });
    }
})();
