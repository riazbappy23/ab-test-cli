(() => {
  const TEST_ID = "Test014";
  const VARIANT_ID = "V1";
  const NS = "ab-test014"; 
  const BODY_CLASS = NS;

  function logInfo(message) {
    console.log(
      `%cNetzproduzent%c${TEST_ID}-${VARIANT_ID}`,
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

  const BULLETS = [
    "4 Wochen kostenlos testen",
    "Flexible Lernzeit",
    "Anerkannter Abschluss",
  ];

  const CHECK_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.3288 5.30381C20.7132 6.03765 20.4299 6.94417 19.696 7.32856C16.772 8.86021 13.577 12.8979 11.9544 18.4225C11.8034 18.9365 11.3898 19.331 10.8692 19.4574C10.3486 19.5839 9.80007 19.4231 9.43016 19.0355C8.79784 18.3731 8.32464 17.893 7.64689 17.4201C6.96657 16.9453 6.02504 16.4415 4.46477 15.8455C3.69088 15.5499 3.30317 14.6829 3.5988 13.909C3.89442 13.1351 4.76143 12.7474 5.53531 13.043C7.2417 13.6949 8.42139 14.3022 9.36379 14.9599C9.53314 15.0781 9.69304 15.1967 9.84514 15.3158C11.7745 10.347 14.9363 6.4351 18.304 4.67107C19.0379 4.28667 19.9444 4.56996 20.3288 5.30381Z" fill="#FA6400"/>
</svg>
`;

  const ARROW_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M4 12H20M14 6L20 12L14 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SECTION_SELECTOR =
  "section:has(.container > :is(h2.headline, div.pre-headline)):has(.container > .ck-editor):has(.container > .btn-group)";

  function getTargetSection() {
    const section = document.querySelector(SECTION_SELECTOR);
    if (!section) return null;
    const btnGroup = section.querySelector(".btn-group");
    const signup =
      section.querySelector('a.btn--primary[href*="onlineanmeldung"]') ||
      (btnGroup && btnGroup.querySelector("a.btn--primary"));
    if (!btnGroup || !signup) return null;
    return { section, btnGroup, signup };
  }

  function getCourseName(section) {
    const h1 =
      document.querySelector(".stage-course-details h1.headline") ||
      document.querySelector("h1.headline") ||
      document.querySelector("h1");
    if (h1) {
      const clone = h1.cloneNode(true);
      clone.querySelectorAll(".pre-headline").forEach((el) => el.remove());
      const text = clone.textContent.replace(/\s+/g, " ").trim();
      if (text) return text;
    }
    const h2 = section.querySelector(".headline");
    return (h2 && h2.textContent.trim()) || "";
  }

  function buildCard(courseName, signupBtn) {
    const card = document.createElement("div");
    card.className = `${NS}-card`;

    const bulletsHtml = BULLETS.map(
      (text) =>
        `<li class="${NS}-card__item">${CHECK_SVG}<span>${text}</span></li>`
    ).join("");

    card.innerHTML = `
      <h3 class="${NS}-card__title">${courseName}</h3>
      <ul class="${NS}-card__list">${bulletsHtml}</ul>
      <div class="${NS}-card__cta"></div>
    `;

    const cta = signupBtn.cloneNode(true);
    cta.classList.remove(`${NS}-orig-signup`);
    cta.classList.add(`${NS}-card__btn`);
    const label = cta.querySelector(".btn__label");
    if (label) label.textContent = "Zum Lehrgang anmelden";
    cta.addEventListener("click", (e) => {
      e.preventDefault();
      signupBtn.click();
    });

    card.querySelector(`.${NS}-card__cta`).appendChild(cta);
    return card;
  }

  function mainJs() {
    const body = document.body;
    if (body.classList.contains(BODY_CLASS)) return;

    const target = getTargetSection();
    if (!target) return;

    const { section, signup, btnGroup } = target;
    const container = section.querySelector(".container") || section;
    const ckEditor = section.querySelector(".ck-editor");

    body.classList.add(BODY_CLASS);

    if (ckEditor) ckEditor.classList.add(`${NS}-host`);
    signup.classList.add(`${NS}-orig-signup`);
    const preise = section.querySelector(".btn-group .btn--secondary");
    if (preise) {
      preise.classList.add(`${NS}-preise`);
      const preiseSvg =
        preise.querySelector(".icon svg") || preise.querySelector("svg");
      if (preiseSvg) preiseSvg.outerHTML = ARROW_SVG;
    }

    const caption = document.createElement("p");
    caption.className = `${NS}-caption`;
    caption.textContent =
      "Alle Preise, Einblick in Studienmaterial, Förderungen";
    btnGroup.insertAdjacentElement("afterend", caption);

    const courseName = getCourseName(section);
    const card = buildCard(courseName, signup);
    const sync = () => {
      placeCard(card, { ckEditor, caption });
      syncHostHeight(card, ckEditor, container);
    };
    sync();

    let raf;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    });
  }

  function placeCard(card, { ckEditor, caption }) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      if (caption && caption.nextElementSibling !== card) {
        caption.insertAdjacentElement("afterend", card);
      }
    } else if (ckEditor && card.parentElement !== ckEditor) {
      ckEditor.appendChild(card);
    }
  }

  function syncHostHeight(card, ckEditor, container) {
    if (ckEditor) ckEditor.style.minHeight = "";
    if (!container) return;

    container.style.minHeight = "";
    if (window.innerWidth <= 768) return;

    const cardBottom = card.getBoundingClientRect().bottom;
    const containerTop = container.getBoundingClientRect().top;
    const needed = Math.ceil(cardBottom - containerTop);
    if (needed > container.offsetHeight) {
      container.style.minHeight = `${needed}px`;
    }
  }

  waitForElem(`${SECTION_SELECTOR} .btn--primary`, mainJs);
})();
