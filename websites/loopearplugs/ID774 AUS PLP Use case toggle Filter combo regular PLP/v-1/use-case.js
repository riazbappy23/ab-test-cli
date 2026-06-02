​(() => {
  var testData = {
    testName:
      "ID722_AUS_PLP_Categorize_by_Use_Case_instead_of_Product_Type_at_all_PLP",
    handle: "looptest722",
    testVariant: "v1",
    testSite: "Loop Earplug AU",
    testVersion: 0.000001,
    useCaseIndex: 0,
  };

  const tid = testData.handle;

  var waitForElem = (
    waitFor,
    callback,
    minElements = 1,
    isVariable = false,
    timer = 30000,
    frequency = 25
  ) => {
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
  };

  const hf = {
    query: (selector) => document.querySelector(selector),
    queryAll: (selector) => document.querySelectorAll(selector),
    classAdd: (seletor, className) =>
      hf.query(seletor)?.classList.add(className),
    classRemove: (seletor, className) =>
      hf.query(seletor + "." + className)?.classList.remove(className),
    forcePush: (func, limit, frequency) => {
      func();
      let cnt = 0;
      let intervalPush = setInterval(() => {
        cnt += frequency;
        func();
        cnt > limit || func() == true ? clearInterval(intervalPush) : null;
      }, frequency);
    },
  };

  waitForElem(
    "head",
    () => {
      function addStyle() {
        if (!hf.query(".looptest722-css")) {
          var style = document.createElement("style");
          style.classList.add("looptest722-css");
          style.innerHTML = `:root{--looptest722-v1: 0.000001}body.looptest722-codeInject .p-event-none{pointer-events:none !important}body.looptest722-codeInject facets-filters[type-filter=looptest722-type-bundles] button[looptest722-data="Playtime & schooltime"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-bundles] button[looptest722-data=Case],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-bundles] button[looptest722-data="Eartips & mutes"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-bundles] button[looptest722-data=Link],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-earplug] button[looptest722-data=Case],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-earplug] button[looptest722-data="Eartips & mutes"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-earplug] button[looptest722-data=Link],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-limited] button[looptest722-data=Case],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-limited] button[looptest722-data="Eartips & mutes"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-limited] button[looptest722-data=Link],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-limited] button[looptest722-data="Playtime & schooltime"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-collaboration] button[looptest722-data="Playtime & schooltime"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-collaboration] button[looptest722-data=Case],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-collaboration] button[looptest722-data="Eartips & mutes"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-collaboration] button[looptest722-data=Link],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-new] button[looptest722-data="Playtime & schooltime"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-new] button[looptest722-data=Case],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-new] button[looptest722-data="Eartips & mutes"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-new] button[looptest722-data=Link],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-accessories] div[data-filter-param="filter.p.m.custom.filter_use_case"] button[looptest722-data],body.looptest722-codeInject facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button[aria-checked=false]>span[data-filter-count],body.looptest722-codeInject facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button.count-hidden>span[data-filter-count],body.looptest722-codeInject #ProductGridContainer>.collection,body.looptest722-codeInject .hidden-type-filter{display:none !important}body.looptest722-codeInject facets-filters[type-filter=looptest722-type-accessories] div[data-filter-param="filter.p.m.custom.filter_use_case"] button[looptest722-data=Case],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-accessories] div[data-filter-param="filter.p.m.custom.filter_use_case"] button[looptest722-data="Eartips & mutes"],body.looptest722-codeInject facets-filters[type-filter=looptest722-type-accessories] div[data-filter-param="filter.p.m.custom.filter_use_case"] button[looptest722-data=Link]{display:flex !important}body.looptest722-codeInject .looptest722-section .collection.display-block{display:block !important}body.looptest722-codeInject .looptest722-section .swiper-wrapper{scrollbar-width:none;-ms-overflow-style:none}body.looptest722-codeInject .looptest722-section .swiper-wrapper::-webkit-scrollbar{display:none}body.looptest722-codeInject .looptest722-section .swiper-footer{overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none}body.looptest722-codeInject .looptest722-section .swiper-footer::-webkit-scrollbar{display:none}body.looptest722-codeInject .looptest722-section .swiper-footer .looptest722-pagination{display:flex;justify-content:center;min-width:fit-content;height:41px;align-items:center}body.looptest722-codeInject .looptest722-section .swiper-footer .looptest722-pagination .looptest722-pagination-itemwrap{width:24px;height:24px;display:flex;align-items:center;justify-content:center}body.looptest722-codeInject .looptest722-section .swiper-footer .looptest722-pagination .looptest722-pagination-itemwrap .looptest722-pagination-item{display:inline-block}body.looptest722-codeInject .looptest722-section .swiper-footer .looptest722-pagination .looptest722-pagination-itemwrap .looptest722-pagination-item.active:before{opacity:1 !important}body.looptest722-codeInject .looptest722-section .swiper-footer .looptest722-pagination .looptest722-pagination-itemwrap .looptest722-pagination-item:before{content:"";width:10px;height:10px;border-radius:50%;background-color:#252427;opacity:.5;display:inline-block}body.looptest722-codeInject .looptest722-section .swiper-footer .swiper-pagination{min-width:fit-content}body.looptest722-codeInject .looptest722-section .swiper-footer.scroll-enabled{max-width:70%;justify-content:flex-start;margin:0 auto}body.looptest722-codeInject .looptest722-section .heading-section{font-size:32px}body.looptest722-codeInject .looptest722-byob-wrap{height:500px}`;
          document?.head?.appendChild(style);
        } else {
          return true;
        }
      }
      hf.forcePush(addStyle, 10000, 50);
    },
    1,
    false,
    30000,
    25
  );

  const typeObj = {
    "type-all": [],
    "type-earplug": [
      "switch",
      "dream",
      "quiet",
      "engage",
      "engage-plus",
      "experience",
      "experience-plus",
      "engage-kids",
      "experience-2-tomorrowland",
      "mclaren",
    ],
    "type-bundles": [
      "full-coverage-bundle",
      "tomorrowland-festival-bundle",
      "festival-bundle",
      "mclaren-f1-team-bundle",
      "earplug-bundle",
      "daily-calm-bundle",
      "dreamville-bundle",
      "deluxe-bundle",
    ],
    "type-accessories": [
      "link-tomorrowland",
      "link",
      "carry-case-black",
      "carry-case-switch",
      "extra-carry-case-dream",
      "carry-case-sublime",
      "carry-case-switch-2",
      "loop-cleaning-kit",
      "silicone-eartips-switch-2-multicolor",
      "dream-double-tips",
      "loop-dream-ear-tips",
      "tips-foam",
      "loop-dream-ear-tips",
      "silicone-ear-tips",
      "quiet-2-ear-tips-4-pack-black",
      "quiet-2-ear-tips-4-pack-multi",
      "mute-style-pack-sublime",
      "mute-style-pack-essentials",
      "tips-silicone-mute",
      "dream-ear-tips-black",
    ],
    "type-limited": [
      "experience-2-tomorrowland",
      "mclaren",
      "swarovski",
      "tomorrowland-festival-bundle",
      "mclaren-f1-team-bundle",
      "dreamville-bundle",
    ],
    "type-collaboration": [
      "experience-2-tomorrowland",
      "mclaren",
      "swarovski",
      "link-tomorrowland",
      "tomorrowland-festival-bundle",
      "dreamville-bundle",
      "mclaren-f1-team-bundle",
    ],
    "type-new": [
      "experience-2-tomorrowland",
      "mclaren",
      "swarovski",
      "tomorrowland-festival-bundle",
      "mclaren-f1-team-bundle",
      "dreamville-bundle",
      "dream-double-tips",
      "mute-style-pack-essentials",
    ],
            "type-mask":["eclipse"],
  };

  const useCaseObj = {
    "Noise sensitivity": {
      items: [
        "switch",
        "switch",
        "dream",
        "quiet",
        "engage",
        "engage-plus",
        "experience",
        "experience-plus",
        "engage-kids",
        "experience-2-tomorrowland",
        "mclaren",
        "full-coverage-bundle",
        "tomorrowland-festival-bundle",
        "festival-bundle",
        "mclaren-f1-team-bundle",
        "earplug-bundle",
        "daily-calm-bundle",
        "dreamville-bundle",
        "deluxe-bundle",
      ],
    },
    Sleep: {
      items: [
        "dream",
        "quiet",
        "full-coverage-bundle",
        "daily-calm-bundle",
        "dreamville-bundle",
      ],
    },
    "Music & events": {
      items: [
        "switch",
        "experience",
        "experience-plus",
        "experience-2-tomorrowland",
        "mclaren",
        "link",
        "link-tomorrowland",
        "full-coverage-bundle",
        "tomorrowland-festival-bundle",
        "festival-bundle",
        "mclaren-f1-team-bundle",
        "earplug-bundle",
        "dreamville-bundle",
        "deluxe-bundle",
      ],
    },
    Focus: {
      items: [
        "switch",
        "quiet",
        "experience",
        "experience-plus",
        "experience-2-tomorrowland",
        "mclaren",
        "full-coverage-bundle",
        "tomorrowland-festival-bundle",
        "mclaren-f1-team-bundle",
        "earplug-bundle",
        "dreamville-bundle",
        "deluxe-bundle",
      ],
    },
    Conversation: {
      items: [
        "engage",
        "engage-plus",
        "mclaren",
        "full-coverage-bundle",
        "mclaren-f1-team-bundle",
        "earplug-bundle",
        "daily-calm-bundle",
        "deluxe-bundle",
      ],
    },
    "Social gatherings": {
      items: [
        "switch",
        "engage",
        "engage-plus",
        "mclaren",
        "full-coverage-bundle",
        "mclaren-f1-team-bundle",
        "earplug-bundle",
        "daily-calm-bundle",
        "deluxe-bundle",
      ],
    },
    "Playtime & schooltime": {
      items: ["engage-kids", "link", "link-tomorrowland"],
    },
    Parenting: {
      items: [
        "switch",
        "engage",
        "engage-plus",
        "mclaren",
        "full-coverage-bundle",
        "mclaren-f1-team-bundle",
        "earplug-bundle",
        "daily-calm-bundle",
        "deluxe-bundle",
        "link",
        "link-tomorrowland",
      ],
    },
    Travel: {
      items: [
        "switch",
        "quiet",
        "mclaren",
        "full-coverage-bundle",
        "mclaren-f1-team-bundle",
        "earplug-bundle",
        "deluxe-bundle",
        "link",
        "link-tomorrowland",
      ],
    },
    Motorcycling: {
      items: [
        "experience",
        "experience-plus",
        "experience-2-tomorrowland",
        "tomorrowland-festival-bundle",
        "dreamville-bundle",
        "link",
        "link-tomorrowland",
      ],
    },
  };

  const useCaseObjExtra = {
    Case: {
      items: [
        "carry-case-black",
        "carry-case-switch",
        "extra-carry-case-dream",
        "carry-case-sublime",
        "carry-case-switch-2",
      ],
    },
    "Eartips & mutes": {
      items: [
        "silicone-eartips-switch-2-multicolor",
        "dream-double-tips",
        "dream-ear-tips-black",
        "loop-dream-ear-tips",
        "silicone-ear-tips",
        "quiet-2-ear-tips-4-pack-black",
        "quiet-2-ear-tips-4-pack-multi",
        "tips-foam",
        "mute-style-pack-sublime",
        "tips-silicone-mute",
        "mute-style-pack-essentials",
      ],
    },
    Link: {
      items: ["link", "link-tomorrowland"],
    },
  };

  function removeCollection() {
    hf.queryAll(".collection h2").forEach((elm) => {
      elm
        .closest(".collection")
        ?.querySelector(".product-grid")
        ?.setAttribute("id", "");
      elm.querySelector("span")?.remove();
      if (elm.textContent.toLowerCase() == "limited editions") {
        elm.closest(".collection")?.remove();
        hf.classAdd(`body`, `le-removed`);
      }
    });
  }

  function getSlideInView(swiperElem) {
    if (!swiperElem) return 0;
    let slides = [
      ...swiperElem?.querySelectorAll(".swiper-slide:not(.hidden-type-filter)"),
    ];
    if (!slides || slides.length == 0) return;
    let closestIndex = 0;
    slides.forEach((slide, i) => {
      let sliderLeft = slide.offsetLeft;
      let sliderRight = slide.offsetLeft + slide.offsetWidth;
      let viewableBoxLeft = swiperElem.scrollLeft;
      let viewableBoxRight = swiperElem.scrollLeft + swiperElem.offsetWidth;
      if (
        sliderLeft <= viewableBoxLeft + 16 ||
        sliderRight == viewableBoxRight - 16 ||
        sliderRight == viewableBoxRight - 15 ||
        sliderRight == viewableBoxRight - 17
      ) {
        closestIndex = slide.getAttribute(`pagination-value`);
        return closestIndex;
      }
    });
    return closestIndex;
  }

  function filterClick() {
    waitForElem(
      `facets-filters div[data-filter-group="use-case"], facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"]`,
      (elm) => {
        hf.classAdd("facets-filters", "p-event-none");
        hf.query("facets-filters").addEventListener("click", (ev) => {
          if (ev.target.closest("button")) {
            let butttonValue = ev.target
              .closest("button")
              .getAttribute(`${tid}-data`);

            if (ev.target.closest('div[data-filter-group="use-case"]')) {
              hf.queryAll(`.${tid}-section`).forEach((elm) => {
                ev.target.closest('button[aria-checked="true"]')
                  ? elm.classList.contains("hidden")
                    ? elm.classList.remove("hidden")
                    : ""
                  : elm.classList.add("hidden");
                hf.forcePush(
                  () => {
                    isScrollableX(elm.querySelector(`.swiper .swiper-footer`))
                      ? elm
                          .querySelector(`.swiper .swiper-footer`)
                          .classList.add("scroll-enabled")
                      : elm
                          .querySelector(
                            `.swiper .swiper-footer.scroll-enabled`
                          )
                          ?.classList.remove("scroll-enabled");
                  },
                  200,
                  200
                );
              });

              if (ev.target.closest('button[aria-checked="true"]')) {
                ev.target
                  .closest('button[aria-checked="true"]')
                  .setAttribute("aria-checked", "false");
                window.sessionStorage.setItem(`${tid}-filter-usecase`, "");
              } else {
                hf.query(
                  `.${tid}-section.hidden[usecase-name="${butttonValue}"]`
                )?.classList.remove("hidden");
                hf.query(
                  `facets-filters div[data-filter-group="use-case"] button[aria-checked="true"]`
                )?.setAttribute("aria-checked", "false");
                ev.target
                  .closest("button")
                  .setAttribute("aria-checked", "true");
                window.sessionStorage.setItem(
                  `${tid}-filter-usecase`,
                  butttonValue
                );
                let url =
                  window.location.pathname +
                  "?queryadded=true" +
                  window.location.hash;
                window.history.replaceState({}, "", url);
              }
            } else if (
              ev.target.closest(
                'div[data-filter-param="filter.p.m.custom.filter_product_type"]'
              )
            ) {
              hf.query(
                `facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button[aria-checked="true"]`
              )?.setAttribute("aria-checked", "false");
              window.sessionStorage.setItem(`${tid}-filter-type`, butttonValue);
              ev.target.closest("button").setAttribute("aria-checked", "true");
              hf.query("#ProductGridContainer").setAttribute(
                "type-filter",
                `${tid}-${butttonValue}`
              );
              hf.query("facets-filters").setAttribute(
                "type-filter",
                `${tid}-${butttonValue}`
              );

              hf.queryAll(`.${tid}-section`).forEach((elm, index) => {
                elm.querySelectorAll(".card-wrapper").forEach((card) => {
                  if (butttonValue == "type-all") {
                    card
                      .closest(".swiper-slide")
                      .classList.remove("hidden-type-filter");
                    card
                      .closest(`.${tid}-section`)
                      .querySelector(
                        `.${tid}-pagination-item[pagination-value="${card
                          .closest(".swiper-slide")
                          .getAttribute("pagination-value")}"]`
                      )
                      ?.closest(`.${tid}-pagination-itemwrap`)
                      ?.classList.remove("hidden-type-filter");
                  } else {
                    if (
                      butttonValue == "type-accessories" &&
                      (card.closest(
                        '.swiper-section[usecase-name="Eartips & mutes"]'
                      ) ||
                        card.closest('.swiper-section[usecase-name="Case"]') ||
                        card.closest('.swiper-section[usecase-name="Link"]'))
                    ) {
                      card
                        .closest(".swiper-slide")
                        .classList.remove("hidden-type-filter");
                      card
                        .closest(`.${tid}-section`)
                        .querySelector(
                          `.${tid}-pagination-item[pagination-value="${card
                            .closest(".swiper-slide")
                            .getAttribute("pagination-value")}"]`
                        )
                        ?.closest(`.${tid}-pagination-itemwrap`)
                        ?.classList.remove("hidden-type-filter");
                    } else if (
                      card.classList.contains(`${tid}-${butttonValue}`)
                    ) {
                      card
                        .closest(".swiper-slide")
                        .classList.remove("hidden-type-filter");
                      card
                        .closest(`.${tid}-section`)
                        .querySelector(
                          `.${tid}-pagination-item[pagination-value="${card
                            .closest(".swiper-slide")
                            .getAttribute("pagination-value")}"]`
                        )
                        ?.closest(`.${tid}-pagination-itemwrap`)
                        ?.classList.remove("hidden-type-filter");
                    } else {
                      card
                        .closest(".swiper-slide")
                        .classList.add("hidden-type-filter");
                      card
                        .closest(`.${tid}-section`)
                        .querySelector(
                          `.${tid}-pagination-item[pagination-value="${card
                            .closest(".swiper-slide")
                            .getAttribute("pagination-value")}"]`
                        )
                        ?.closest(`.${tid}-pagination-itemwrap`)
                        ?.classList.add("hidden-type-filter");
                    }
                  }
                });
                if (
                  elm.querySelectorAll(".swiper-slide:not(.hidden-type-filter)")
                    .length == 0
                ) {
                  elm
                    .closest(`.${tid}-section`)
                    ?.classList.add("hidden-type-filter");
                  hf.query(
                    `facets-filters div[data-filter-group="use-case"] button[aria-checked="true"][${tid}-data="${elm
                      .closest(`.${tid}-section`)
                      .getAttribute("usecase-name")}"]`
                  )?.click();
                } else
                  elm
                    .closest(`.${tid}-section.hidden-type-filter`)
                    ?.classList.remove("hidden-type-filter");
                waitForElem(
                  `.swiper.swiper-initialized.swiper-section-${index} .swiper-wrapper`,
                  () => {
                    elm
                      .querySelector(
                        `.swiper.swiper-initialized.swiper-section-${index}`
                      )
                      ?.swiper?.update();
                    let activeIndex = getSlideInView(
                      elm.querySelector(
                        `.swiper.swiper-initialized.swiper-section-${index} .swiper-wrapper`
                      )
                    );
                    hf.query(
                      `.${tid}-section .swiper-section-${index} .${tid}-pagination-item.active`
                    )?.classList.remove("active");
                    hf.query(
                      `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .${tid}-pagination-item[pagination-value="${activeIndex}"]`
                    )?.classList.add("active");
                    isScrollableX(
                      hf.query(
                        `.${tid}-section .swiper-section-${index} .swiper-footer`
                      )
                    )
                      ? hf.classAdd(
                          `.${tid}-section .swiper-section-${index} .swiper-footer`,
                          "scroll-enabled"
                        )
                      : hf.classRemove(
                          `.${tid}-section .swiper-section-${index} .swiper-footer`,
                          "scroll-enabled"
                        );
                  }
                );
              });
            }
            if (document.readyState === "complete") {
              hf.forcePush(
                () => {
                  filteredItemCount();
                  hf.queryAll(`.${tid}-section .swiper-wrapper`).forEach(
                    (elm) => {
                      elm.scrollLeft = 200;
                      elm.scrollLeft = 0;
                      elm
                        .closest(`.${tid}-section`)
                        .querySelectorAll(
                          `.${tid}-pagination-itemwrap:not(.hidden-type-filter)`
                        )[0]
                        ?.click();
                    }
                  );
                },
                500,
                250
              );
            }
          }
        });

        hf.classRemove("facets-filters", "p-event-none");
      },
      2
    );
  }

  function filteredItemCount() {
    hf.forcePush(
      () => {
        let count = 0;
        hf.queryAll(`.${tid}-section:not(.hidden)`).forEach(
          (elm) =>
            (count += elm.querySelectorAll(
              ".swiper-slide:not(.hidden-type-filter)"
            ).length)
        );
        waitForElem(
          `facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button[aria-checked="true"]>span[data-filter-count]`,
          (elm) => {
            elm[0].textContent = "(" + count + ")";
            elm[0].closest("button").classList.contains("count-hidden")
              ? elm[0].closest("button").classList.remove("count-hidden")
              : null;
          }
        );
      },
      200,
      200
    );
  }

  function findKeysByItem(obj, item) {
    return Object.keys(obj).filter((key) => obj[key].includes(item));
  }

  function addNewCard(itemObject, extraItems = false) {
    Object.keys(itemObject).forEach((usecaseItem, index) => {
      testData.useCaseIndex > index
        ? (index = testData.useCaseIndex + 1 + index)
        : (testData.useCaseIndex = index);
      if (
        !hf.query(
          `#ProductGridContainer .${tid}-section[usecase-name="${usecaseItem}"]`
        )
      ) {
        hf.query("#ProductGridContainer").insertAdjacentHTML(
          "beforeend",
          `
                    <section class="${tid}-section ${tid}-section-${index}" usecase-name="${usecaseItem}">
    <div class="collection py-6 md-py-12 display-block">
        <div class="collection__title container-xxl">
            <h2 class="heading-section">${usecaseItem}</h2>
            <swiper-products class="pb-6 swiper swiper-section-${index}">
                <div class="swiper-wrapper">
                </div>
                <div class="swiper-footer">
                <div class="${tid}-pagination hidden"></div>
                <div class="swiper-pagination"></div>
                </div>
            </swiper-products>
        </div>
    </div>
</section>`
        );
      }
      itemObject[usecaseItem]["items"].forEach(
        (productHandle, productIndex) => {
          if (productHandle) {
            waitForElem(
              `.le-removed .product-card .card__link[href="${Shopify.routes.root}products/${productHandle}"], .le-removed .product-card .card__link[href^="${Shopify.routes.root}products/${productHandle}?"]`,
              (elm) => {
                let itemSelector = elm[0]
                  .closest(".product-card")
                  .querySelector(".card__link");
                itemSelector
                  .closest(".product-card")
                  .classList.add(`${tid}-${productHandle}-oldcard`);
                waitForElem(
                  `.${tid}-${productHandle}-oldcard.product-card form[data-type="add-to-cart-form"]`,
                  () => {
                    let cloneCard = itemSelector
                      .closest(".product-card")
                      .cloneNode(true);
                    let itemTypes = findKeysByItem(typeObj, productHandle);
                    if (
                      cloneCard.classList.contains(
                        `${tid}-${productHandle}-oldcard`
                      )
                    )
                      cloneCard.classList.remove(
                        `${tid}-${productHandle}-oldcard`
                      );
                    itemTypes.forEach((itemType) => {
                      cloneCard
                        .querySelector(".card-wrapper")
                        .classList.add(`${tid}-${itemType}`);
                    });

                    if (
                      !hf.query(
                        `.${tid}-section .swiper-section-${index} .swiper-wrapper .swiper-slide[data-handle="${productHandle}"]`
                      ) &&
                      hf
                        .query(`.${tid}-section.${tid}-section-${index}`)
                        ?.getAttribute("usecase-name") === usecaseItem
                    ) {
                      hf.query(
                        `.${tid}-section .swiper-section-${index} .swiper-wrapper`
                      ).insertAdjacentHTML(
                        "beforeend",
                        `<div class="swiper-slide" data-handle="${productHandle}" pagination-value="${
                          productIndex + 1
                        }">${cloneCard.innerHTML}</div>`
                      );
                      if (itemObject[usecaseItem]["items"].length > 6) {
                        hf.query(
                          `.${tid}-section .swiper-section-${index} .${tid}-pagination`
                        ).insertAdjacentHTML(
                          "beforeend",
                          `<div class="${tid}-pagination-itemwrap"><span class="${tid}-pagination-item ${tid}-pagination-${productIndex}" pagination-value="${
                            productIndex + 1
                          }"></span></div>`
                        );

                        window.addEventListener("load", () => {
                          isScrollableX(
                            hf.query(
                              `.${tid}-section .swiper-section-${index} .swiper-footer`
                            )
                          )
                            ? hf.classAdd(
                                `.${tid}-section .swiper-section-${index} .swiper-footer`,
                                "scroll-enabled"
                              )
                            : hf.classRemove(
                                `.${tid}-section .swiper-section-${index} .swiper-footer`,
                                "scroll-enabled"
                              );
                        });
                      }
                    } else if (
                      hf.query(
                        `.${tid}-section .swiper-section-${index} .swiper-wrapper .swiper-slide[data-handle="${productHandle}"]`
                      ) &&
                      hf
                        .query(`.${tid}-section.${tid}-section-${index}`)
                        ?.getAttribute("usecase-name") === usecaseItem
                    ) {
                      hf.query(
                        `.${tid}-section .swiper-section-${index} .swiper-wrapper .swiper-slide[data-handle="${productHandle}"]`
                      ).innerHTML = cloneCard.innerHTML;
                    }
                  }
                );
              }
            );
          }
        }
      );

      hf.queryAll(`.${tid}-section variant-swatches fieldset`).forEach(
        (elm, index) => {
          let oldDatablockId = elm
            .querySelector(`div[data-variant-swatch]`)
            .getAttribute("data-block-id");

          elm
            .querySelector(`div[data-variant-swatch]`)
            .setAttribute("data-block-id", `${tid}-swatches-${index + 1}`);
          elm.setAttribute(
            "aria-labelledby",
            elm
              .getAttribute("aria-labelledby")
              .replace(oldDatablockId, `${tid}-swatches-${index + 1}`)
          );
          elm.querySelector(`.variant-swatch__label legend`).setAttribute(
            "id",
            elm
              .querySelector(`.variant-swatch__label legend`)
              .getAttribute("id")
              .replace(oldDatablockId, `${tid}-swatches-${index + 1}`)
          );
          elm.querySelector(`.variant-swatch__label span`).setAttribute(
            "id",
            elm
              .querySelector(`.variant-swatch__label legend`)
              .getAttribute("id")
              .replace(oldDatablockId, `${tid}-swatches-${index + 1}`)
          );

          elm
            .querySelectorAll("input, label")
            .forEach((swatchElm, swatchIndex) => {
              if (swatchElm.tagName == "INPUT") {
                swatchElm.setAttribute(
                  "id",
                  swatchElm
                    .getAttribute("id")
                    .replace(oldDatablockId, `${tid}-swatches-${index + 1}`)
                );
                swatchElm.setAttribute(
                  "name",
                  swatchElm
                    .getAttribute("name")
                    .replace(oldDatablockId, `${tid}-swatches-${index + 1}`)
                );
                swatchIndex == 0 ? swatchElm.setAttribute("checked", true) : "";
              } else if (swatchElm.tagName == "LABEL") {
                swatchElm.setAttribute(
                  "for",
                  swatchElm
                    .getAttribute("for")
                    .replace(oldDatablockId, `${tid}-swatches-${index + 1}`)
                );
              }
            });
        }
      );

      waitForElem(
        `.${tid}-section .swiper-section-${index} .swiper-pagination .swiper-pagination-bullet-active`,
        () => {
          if (
            hf.queryAll(
              `.${tid}-section .swiper-section-${index} .swiper-slide:not(.hidden-type-filter)`
            ).length > 6
          ) {
            hf.query(
              `.${tid}-section .swiper-section-${index} .${tid}-pagination.hidden`
            )?.classList.remove("hidden");
            hf.query(
              `.${tid}-section .swiper-section-${index} .swiper-pagination`
            )?.classList.add("hidden");
          }
        }
      );

      waitForElem(
        `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized`,
        () => {
          let itemWrapper = hf.query(
            `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .swiper-wrapper`
          );

          let activeIndex = getSlideInView(itemWrapper);
          hf.query(
            `.${tid}-section .swiper-section-${index} .${tid}-pagination-item.active`
          )?.classList.remove("active");
          hf.query(
            `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .${tid}-pagination-item[pagination-value="${activeIndex}"]`
          )?.classList.add("active");

          itemWrapper.addEventListener("scroll", () => {
            let activeIndex = getSlideInView(itemWrapper);
            hf.query(
              `.${tid}-section .swiper-section-${index} .${tid}-pagination-item.active`
            )?.classList.remove("active");
            hf.query(
              `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .${tid}-pagination-item[pagination-value="${activeIndex}"]`
            )?.classList.add("active");

            let activeDot = hf
              .query(
                `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .${tid}-pagination-item.active`
              )
              ?.closest(`.${tid}-pagination-itemwrap`);
            if (activeDot) {
              if (activeDot.offsetLeft < activeDot.offsetWidth * 8) {
                hf.query(
                  `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .swiper-footer`
                ).scrollTo({
                  left: 0,
                  behavior: "smooth",
                });
              } else if (activeDot.offsetLeft > activeDot.offsetWidth * 11) {
                hf.query(
                  `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .swiper-footer`
                ).scrollTo({
                  left: 1000,
                  behavior: "smooth",
                });
              }
            }
          });
        },
        1,
        false,
        50000,
        500
      );

      waitForElem(
        `facets-filters div[data-filter-group="use-case"] button`,
        (elm) => {
          elm = elm[0].closest('div[data-filter-group="use-case"]');
          if (
            extraItems &&
            !elm.querySelector(`button[accessories-filters="${usecaseItem}"]`)
          ) {
            elm.insertAdjacentHTML(
              "beforeend",
              `<button class="group text-system-primary shrink-0 cursor-pointer snap-start appearance-none rounded-full border-none bg-neutral-200 px-4 py-2 text-sm transition-colors aria-checked:bg-inverse-primary aria-checked:text-inverse inline-flex items-center gap-2" accessories-filters="${usecaseItem}" role="radio" aria-checked="false" tabindex="0" data-filter-param="" data-filter-value="" type="button">${usecaseItem}</button>`
            );
          }
          elm
            .querySelectorAll("button")
            [index]?.setAttribute("data-filter-value", "");
          elm
            .querySelectorAll("button")
            [index]?.setAttribute(`${tid}-data`, `${usecaseItem}`);
        },
        10
      );

      waitForElem(
        `facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button`,
        (elm) => {
          elm = elm[0].closest(
            'div[data-filter-param="filter.p.m.custom.filter_product_type"]'
          );
          Object.keys(typeObj).forEach((typeItem, typeIndex) => {
            elm
              .querySelectorAll("button")
              [typeIndex]?.setAttribute("data-filter-param", "");
            elm
              .querySelectorAll("button")
              [typeIndex]?.setAttribute("data-filter-value", "");
            elm
              .querySelectorAll("button")
              [typeIndex]?.setAttribute(`${tid}-data`, `${typeItem}`);
          });
        }
      );
    });
  }

  function filterPreSelect() {
    if (window.location.search.includes("queryadded=true")) {
      if (
        window.sessionStorage.getItem(`${tid}-filter-type`) != null &&
        window.sessionStorage.getItem(`${tid}-filter-type`) != ""
      ) {
        waitForElem(
          `facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button[${tid}-data="${window.sessionStorage.getItem(
            `${tid}-filter-type`
          )}"]`,
          () => {
            hf.query(
              `facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button[aria-checked="true"]`
            )?.setAttribute("aria-checked", "false");
            hf.query(
              `facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button[${tid}-data="${window.sessionStorage.getItem(
                `${tid}-filter-type`
              )}"]`
            )?.click();
          }
        );
      }
      if (
        window.sessionStorage.getItem(`${tid}-filter-usecase`) != null &&
        window.sessionStorage.getItem(`${tid}-filter-usecase`) != ""
      ) {
        waitForElem(
          `facets-filters div[data-filter-group="use-case"] button[${tid}-data="${window.sessionStorage.getItem(
            `${tid}-filter-usecase`
          )}"][aria-checked="false"]`,
          () => {
            hf.query(
              `facets-filters div[data-filter-group="use-case"] button[${tid}-data="${window.sessionStorage.getItem(
                `${tid}-filter-usecase`
              )}"][aria-checked="false"]`
            )?.click();
          }
        );
      }
    }
  }

  function isScrollableX(el) {
    return el.scrollWidth > el.clientWidth + 16;
  }

  window.addEventListener("load", () => {
    addNewCard(useCaseObj);
    addNewCard(useCaseObjExtra, true);
  });

  let testCode = {
    init: () => {
      waitForElem("body", () => {
        if (!hf.query(`body.${testData.handle}-codeInject`)) {
          hf.classAdd("body", `${testData.handle}-codeInject`);

          testCode.mainCode();
        }
      });
    },
    mainCode: () => {
      waitForElem(
        `facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button[aria-checked="true"]>span[data-filter-count]`,
        (elm) => {
          elm[0].closest("button").classList.add("count-hidden");
        }
      );
      waitForElem("#ProductGridContainer", () => {
        removeCollection();
        addNewCard(useCaseObj);
        addNewCard(useCaseObjExtra, true);

        waitForElem(
          "#ProductGridContainer > .collection",
          () => {
            removeCollection();
          },
          5
        );

        hf.query(`#ProductGridContainer`).addEventListener("click", (ev) => {
          if (ev.target.closest(`.${tid}-pagination-item`)) {
            let cardwidth = ev.target
              .closest(`.${tid}-section`)
              .querySelector(
                ".swiper-slide:not(.hidden-type-filter)"
              ).offsetWidth;
            let cardIndex = parseInt(
              ev.target
                .closest(`.${tid}-pagination-item`)
                .getAttribute("pagination-value")
            );
            ev.target
              .closest(`.${tid}-section`)
              .querySelectorAll(
                `.swiper-wrapper .swiper-slide:not(.hidden-type-filter)`
              )
              .forEach((element, index) => {
                parseInt(element.getAttribute("pagination-value")) == cardIndex
                  ? (cardIndex = index + 1)
                  : null;
              });
            ev.target
              .closest(`.${tid}-pagination`)
              .querySelector(`.${tid}-pagination-item.active`)
              ?.classList.remove("active");
            ev.target
              .closest(`.${tid}-pagination-item`)
              .classList.add("active");
            ev.target
              .closest(`.${tid}-section`)
              .querySelector(`.swiper-wrapper`)
              ?.scrollTo({
                left: cardwidth * (cardIndex - 1) + 16 * (cardIndex - 1),
                behavior: "smooth",
              });
          }
        });

        hf.query("#ProductGridContainer").insertAdjacentHTML(
          "beforeend",
          `
          <div class="cta__card ${tid}-byob-wrap">
<div class="card-wrapper">
  <div class="card card--text cta-card color-" style="background-image: url('//www.loopearplugs.com/cdn/shop/files/background-image.jpg?v=1767704841&amp;width=334');background-size: cover; background-position: 50.0% 50.0%">
    <div class="card__content" style="align-items: flex-end">
      <div class="card__information">
        <div class="card__text">
          <h3 class="card-title">Build your bundle</h3>
          <div class="card-text">Make a set. Save up to 20%.</div>
        </div>
        <div class="quick-add">
          <div class="card__interactive">
  <a tabindex="-1" href="/products/build-your-bundle" class="button button--primary button--md circle--md button--primary">
<svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M8.66 11.16L7.46 10.04L10.9 6.38H0V4.76H10.9L7.46 1.1L8.66 0L13.82 5.58L8.66 11.16Z" fill="#FFFFFF"></path>
</svg>
  </a>
</div>
        </div>
      </div>
    </div>
    <a class="cta-card_anchor" href="/products/build-your-bundle" aria-label=""></a>
  </div>
</div>
</div>`
        );

        filterClick();

        if (document.readyState === "loading") {
          window.addEventListener("load", () => {
            hf.query(
              `facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button[aria-checked="true"]`
            )?.click();

            filteredItemCount();
            hf.queryAll(
              `.${tid}-section div[data-variant-swatch] input[id$="-0"]`
            ).forEach((elm) => elm.click());
          });
          window.sessionStorage.getItem(`${tid}-filter-type`) ==
          `type-accessories`
            ? window.addEventListener("load", filterPreSelect)
            : window.addEventListener("DOMContentLoaded", filterPreSelect);
        } else {
          window.sessionStorage.getItem(`${tid}-filter-type`) ==
          `type-accessories`
            ? null
            : filterPreSelect();
          filteredItemCount();
        }
      });
    },
  };
  testCode.init();
})();
