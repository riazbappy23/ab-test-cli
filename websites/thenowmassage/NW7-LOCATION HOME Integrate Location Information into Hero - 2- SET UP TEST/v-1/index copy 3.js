(async () => {
  const TEST_ID = "NW7";

  const test_variation = 2;

  const VARIANT_ID = `V${test_variation}`;

  function logInfo(message) {
    console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color:white;background:rgb(0,0,57);font-weight:700;padding:2px 4px;border-radius:2px;", "margin-left:8px;color:white;background:rgb(0,57,57);font-weight:700;padding:2px 4px;border-radius:2px;", message);
  }

  logInfo("fired");

  const TEST_CONFIG = {
    page_initials: "AB-NW7",
    test_version: 0.0001,
  };

  const { page_initials, test_version } = TEST_CONFIG;

  function fireGA4Event(eventName, eventLabel = "") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "GA4event",
      "ga4-event-name": "cro_event",
      "ga4-event-p1-name": "event_category",
      "ga4-event-p1-value": eventName,
      "ga4-event-p2-name": "event_label",
      "ga4-event-p2-value": eventLabel,
    });
    logInfo(`Event fired: ${eventName}${eventLabel ? ` - ${eventLabel}` : ""}`);
  }

  function q(selector) {
    return document.querySelector(selector);
  }

  function waitForElement(predicate, timeout = 20000, interval = 150) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      if (predicate()) return resolve(true);
      const id = setInterval(() => {
        if (Date.now() - start >= timeout) {
          clearInterval(id);
          reject(new Error("waitForElement timed out"));
          return;
        }
        if (predicate()) {
          clearInterval(id);
          resolve(true);
        }
      }, interval);
    });
  }

  const ICONS = Object.freeze({
    clock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_56_1097)">
<path d="M12.588 12.4621C12.4617 12.3577 12.1522 12.0967 12.0259 11.9923C11.9607 11.7433 11.8956 11.3939 11.8548 10.9642C11.6186 8.5987 12.2703 6.81558 12.0055 6.72321C11.9526 6.70313 11.8426 6.75534 11.6023 7.1208V11.9762C11.6023 12.0927 11.6552 12.2051 11.7489 12.2814L16.2985 15.924C16.323 15.9441 16.4167 16.0083 16.5511 16.0083C16.6855 16.0083 16.8484 15.8838 16.8606 15.8637" fill="white"/>
<path d="M18.6935 4.9C13.5248 -0.00761008 5.02835 1.43014 2.58451 8.32971C-0.250351 16.5546 7.70843 24.6068 16.0704 21.1329C22.8317 18.2012 23.9559 9.7795 18.6935 4.89599V4.90402V4.9ZM12.144 21.0807C7.04045 21.3096 2.33198 17.2494 2.32383 12.1209C2.24644 4.13294 12.7061 -0.606001 18.6283 4.96828C24.5302 10.6389 20.2779 20.8076 12.144 21.0726V21.0807Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_56_1097">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,

    pin: `<svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_34_24)">
<mask id="mask0_34_24" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="19" height="24">
<path d="M18.4072 0H0.952698V24H18.4072V0Z" fill="white"/>
</mask>
<g mask="url(#mask0_34_24)">
<path d="M0.995725 9.22937C1.01007 9.43097 1.01964 9.62777 1.03398 9.82937C1.04355 10.0166 1.0818 10.2038 1.10571 10.391C1.15353 10.7654 1.23005 11.1398 1.31612 11.5094C1.39742 11.8454 1.47871 12.1862 1.59348 12.5174C1.7226 12.8918 1.8565 13.2614 1.99996 13.6262C2.1243 13.9478 2.26775 14.2598 2.42078 14.5718C2.76987 15.2918 3.18112 15.9782 3.60673 16.655C3.9893 17.2646 4.43403 17.8406 4.86442 18.4262C6.23209 20.2886 7.82451 22.0742 9.4026 23.7878C9.42172 23.807 9.44086 23.831 9.45998 23.8502C9.48867 23.8838 9.52215 23.9126 9.56519 23.9318C9.60823 23.951 9.6704 23.951 9.71821 23.9414C9.79951 23.9222 9.8569 23.8454 9.9095 23.7878C11.4876 22.079 13.08 20.2886 14.4477 18.4262C14.8781 17.8454 15.318 17.2646 15.7054 16.655C16.131 15.9782 16.5422 15.287 16.8913 14.5718C17.0444 14.2598 17.1878 13.9478 17.3121 13.6262C17.4555 13.2566 17.5895 12.8918 17.7186 12.5174C17.8333 12.1862 17.9147 11.8502 17.996 11.5094C18.0821 11.1398 18.1585 10.7654 18.2064 10.391C18.2303 10.2038 18.2638 10.0166 18.2781 9.82937C18.2925 9.62777 18.302 9.43097 18.3164 9.22937C18.3594 8.56217 18.2542 7.89498 18.1442 7.23737C18.0869 6.90137 17.996 6.56537 17.9051 6.23417C17.8046 5.87418 17.6804 5.51417 17.5321 5.16857C17.4222 4.91418 17.3217 4.65497 17.1878 4.41017C16.9678 3.99738 16.6953 3.60857 16.4036 3.23417C16.0927 2.84057 15.7675 2.45657 15.385 2.12057C13.8021 0.723775 11.7267 0.0373743 9.65605 0.0469743C7.58542 0.0373743 5.51 0.723775 3.92235 2.12057C3.53978 2.45657 3.21461 2.84537 2.90377 3.23417C2.61206 3.60377 2.34427 3.99738 2.11951 4.41017C1.98561 4.65497 1.88519 4.91418 1.7752 5.16857C1.63174 5.51417 1.50741 5.87418 1.4022 6.23417C1.31134 6.56537 1.22048 6.89657 1.1631 7.23737C1.05311 7.89498 0.947905 8.56217 0.990943 9.22937H0.995725ZM3.86975 3.59417C5.18482 2.10617 6.99722 1.27577 8.86701 1.09817C9.13003 1.07417 9.39303 1.06457 9.66083 1.05977C9.92385 1.05977 10.1869 1.07417 10.4499 1.09817C12.3197 1.27097 14.1321 2.10137 15.4472 3.58937C17.1018 5.46617 17.6995 8.48057 17.1113 10.8758C16.504 13.3574 15.4519 15.5414 13.9694 17.6486C12.9557 19.0886 11.9036 20.5046 10.8037 21.8774C10.5886 22.1462 10.3686 22.415 10.139 22.679C10.0338 22.799 9.92385 22.919 9.8043 23.0198C9.6704 23.135 9.64648 23.1446 9.51736 23.039C9.34043 22.895 9.19219 22.703 9.04394 22.5302C8.54661 21.959 8.07319 21.3638 7.60932 20.7686C6.82507 19.7606 6.0169 18.743 5.34741 17.6486C4.00365 15.4502 2.80813 13.3574 2.20559 10.8758C1.62218 8.48057 2.21516 5.46617 3.86975 3.58937V3.59417Z" fill="white"/>
<path d="M13.0657 8.64374C13.0226 11.7685 9.3835 13.4581 7.06898 11.2453C5.59132 9.88694 5.54829 7.37174 6.95421 5.92214C9.34046 3.45014 13.1805 5.31734 13.0657 8.64374ZM12.97 8.64374C12.9414 5.98454 9.39784 4.84694 7.6237 6.59894C5.65349 8.39414 7.02595 11.7349 9.66086 11.7733C11.3585 11.8837 13.0561 10.4245 12.97 8.64374Z" fill="white"/>
</g>
</g>
<defs>
<clipPath id="clip0_34_24">
<rect width="17.4545" height="24" fill="white" transform="translate(0.952698)"/>
</clipPath>
</defs>
</svg>
`,
    phone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_34_34)">
<g clip-path="url(#clip1_34_34)">
<path d="M21.3783 15.9166C21.0399 15.3544 20.5242 14.8765 19.8837 14.5672C19.0257 14.1576 18.0427 14.1054 17.1243 14.2701C17.1041 14.2701 17.08 14.2821 17.0518 14.2861H17.0558C16.661 14.3584 16.2743 14.4709 15.9117 14.6074C15.7063 14.6837 15.5089 14.768 15.3155 14.8604H15.3195C14.965 15.0211 14.6508 15.2379 14.3849 15.495C14.0264 15.8564 13.6397 16.5271 13.8653 17.0371C14.0788 17.5311 14.6871 17.5833 15.102 17.3383C15.4928 17.1094 15.7788 16.764 16.0044 16.4026C16.2501 15.9849 16.4555 15.519 16.5925 15.0652C16.5925 15.0492 16.5925 15.0452 16.6086 15.0291C16.6086 15.013 16.6368 15.017 16.6409 15.013C16.9631 14.8925 17.5029 14.7439 18.1676 14.7962C18.2724 14.8002 20.1697 14.9929 21.052 16.6676C21.6482 17.8042 21.4065 18.9086 21.3299 19.2098C21.2655 19.4307 21.1527 19.7239 20.9593 20.0291C20.8183 20.258 20.6652 20.4347 20.5363 20.5753C19.7105 21.3584 18.7517 21.507 18.4295 21.5351C17.8212 21.5873 17.6681 21.5351 16.8664 21.3624C16.6811 21.3263 16.1454 21.1616 16.1454 21.1616C16.0366 21.1335 15.9439 21.1134 15.8755 21.0893L15.1463 20.8604C11.988 19.8363 9.97787 18.6074 7.69779 16.3062C5.09946 13.748 3.53644 10.2741 2.70256 6.80018C2.4528 5.76805 2.87578 4.73592 3.76606 4.16564L5.98571 2.75198C6.11462 2.66363 6.2677 2.62749 6.42078 2.62749C6.57386 2.62749 6.58997 2.64355 6.67054 2.66363C6.90016 2.73994 7.07741 2.91263 7.16604 3.14154L8.75726 7.37046C8.84991 7.61544 8.82171 7.86443 8.68072 8.0813L7.75821 9.50299C7.45608 9.97287 7.44803 10.5512 7.75419 11.0291C8.41082 12.0693 9.1883 13.0371 10.0665 13.9086C10.8279 14.6676 11.6537 15.3504 12.544 15.9448C12.6044 15.9809 12.6688 15.9086 12.6205 15.8564L12.3184 15.5351L11.2307 14.507C11.2307 14.507 10.7755 14.0692 10.135 13.3383C9.35346 12.4387 8.91437 11.6998 8.28191 10.6958C8.11271 10.4267 8.11271 10.1054 8.28191 9.84034L9.20441 8.41865C9.45417 8.03311 9.50252 7.57929 9.34138 7.15359L7.75016 2.92468C7.59708 2.52307 7.27883 2.20982 6.86391 2.07327C6.45704 1.93672 6.00988 1.99295 5.64733 2.22588L3.42767 3.63953C2.30375 4.35038 1.78005 5.65158 2.08621 6.94074C3.34711 12.1978 7.48831 16.4588 7.48831 16.4588C10.9165 19.7078 14.6629 21.1616 17.0356 21.8443C17.4868 21.9568 18.8122 22.2339 19.9562 21.5833C20.2987 21.3865 20.5806 21.1375 20.6854 21.0371C20.8707 20.8684 21.4024 20.3102 21.7368 19.4829C22.2041 18.3343 22.0309 17.0251 21.3622 15.9006L21.3783 15.9166ZM15.0416 16.7721C14.9288 16.8604 14.7878 16.9166 14.6387 16.9327H14.6347C14.1392 16.9809 14.3849 16.499 14.5098 16.2941C14.5461 16.246 14.5743 16.1978 14.6146 16.1496C14.9288 15.7279 15.4444 15.3905 15.956 15.1857C15.8311 15.7761 15.5814 16.4026 15.0456 16.7761L15.0416 16.7721Z" fill="white"/>
</g>
</g>
<defs>
<clipPath id="clip0_34_34">
<rect width="24" height="24" fill="white"/>
</clipPath>
<clipPath id="clip1_34_34">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
`,
    caret: `<svg class="nw7-caret-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.651 16.4459L4.15097 8.94597C4.05161 8.83934 3.99752 8.6983 4.00009 8.55258C4.00267 8.40685 4.0617 8.26781 4.16476 8.16475C4.26782 8.06169 4.40686 8.00266 4.55258 8.00009C4.69831 7.99752 4.83935 8.05161 4.94598 8.15097L12.0485 15.2525L19.151 8.15097C19.2576 8.05161 19.3987 7.99752 19.5444 8.00009C19.6901 8.00266 19.8292 8.0617 19.9322 8.16475C20.0353 8.26781 20.0943 8.40685 20.0969 8.55258C20.0995 8.69831 20.0454 8.83934 19.946 8.94597L12.446 16.4459C12.3405 16.5513 12.1976 16.6104 12.0485 16.6104C11.8994 16.6104 11.7565 16.5513 11.651 16.4459Z" fill="white"/>
</svg>
`,
    star: `<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 11.2516L12.135 14L10.9088 8.82L15 5.33842L9.6075 4.88158L7.5 0L5.3925 4.88158L0 5.33842L4.09125 8.82L2.865 14L7.5 11.2516Z" fill="#A6917E"/>
</svg>
`,
  });

  const css = `
    .AB-NW7 .location-hero__main-container {
        height:75vh !important;
        padding-top:40px !important;
    }
    .AB-nw7 .location-hero__content h1 {
        font-family: IvyPresto Display;
        font-weight: 400;
        font-style: Regular;
        font-size: 50px !important;
        line-height: 100%;
        letter-spacing: -3% !important;
        text-align: center;
        text-transform: capitalize;
    }
    .nw7-hero-wrap {
      width: max-content;
      margin: 0 auto;
    }

    .nw7-hero-card {
      margin: 30px 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 21px 10px 20px 16px;
      background: linear-gradient(135deg, rgba(254, 252, 245, 0.18), rgba(152, 151, 147, 0.18));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 5px;
      border: 1px solid rgba(255,255,255,0.11);
      color: #fff;
      box-shadow: 0 4px 28px rgba(0,0,0,0.38);
    }

    .nw7-row {
      display: flex;
      align-items: flex-start;
      gap: 11px;
    }

   .nw7-row-address, .nw7-row-phone {
        letter-spacing: 0.5px;
        vertical-align: middle;
    }

    .nw7-row-address {
        line-height: 16px !important;
    }

    .nw7-row-phone {
        line-height: 24px !important;
     }

     .nw7-row-hours .location-info-map__hours-of-operation img {
       color: white !important
     }

    .nw7-row-hours .location-info-map__operation-hours-data {
        background: white !important;
        color: #000 !important;
        right:0 ;
        left:unset !important;
    }
    
    .nw7-row-hours .location-info-map__operation-hours-copy p {
        text-transform: capitalize !important;
        font-family: inherit !important;
        font-weight: 400;
        font-size: 14px;
        letter-spacing: 0.5px;
        vertical-align: middle;
    }
        
     .nw7-row-hours .location-info-map__operation-hours-copy .nw7-caret-svg{
        transition: all 0.3s ease;
    }
    .nw7-row-hours:has(.location-info-map__operation-hours-data.visible)
    .nw7-caret-svg {
      transform: rotate(180deg);
    }

    .nw7-svg {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      fill: rgba(255,255,255,0.75);
      margin-top: 2px;
    }

    .nw7-link {
      font-family: inherit !important;
      font-weight: 400;
      font-size: 14px;
      text-align: start;
      color: #fff;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .nw7-link:hover { opacity: 0.72; }

.AB-NW7 .location-hero__cta a {
    margin-right: 0 !important;
    padding: 18px 58px !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 5%;
    text-align: center;
    text-transform: uppercase;
    min-width: 295px !important;
}

.AB-NW7 .location-hero__cta a:first-of-type {
    background: #fff !important;
    color: #3F5270 !important;

}
.AB-NW7 #location-hero__cta-secondary a {
  background:transparent !important;
  color: #FFF !important;
}

.AB-NW7 .location-hero__cta:has(#location-hero__cta-secondary a) a:first-of-type {
    margin-right: 20px !important;
}

    .nw7-social-proof {
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #fff;
      font-family: Jost;
      font-weight: 400;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;

    }

    .nw7-stars {
      display: flex;
      gap: 5px;
    }

    .nw7-star-svg {
      width: 16px;
      height: 16px;
      fill: #f0c040;
      margin-top: 0;
    }

    .location-info-map__next-available-appointment-container div img {
      width: 20px !important;
      height: 20px !important;
    }

    .location-info-map__next-available-appointment-container div .location_info_map__item {
      display: flex;
      gap: 16px;
      margin-top: 24px;
      align-items: flex-start;
    }

    @media (max-width: 767px) {
         .AB-NW7 .location-hero__main-container {
            height:90vh !important;
            padding-top:80px !important;
         }
        .AB-NW7 .location-hero__content h1 {
          font-size: 40px;
        }
        .nw7-hero-wrap{
          width: 100% !important;
        }
        .location-info-map__operation-hours-data {
          min-width: max-content !important;
        }
        .AB-NW7 .location-hero__main-container .location-hero__cta a {
          margin-top: 0 !important;
        }
          .AB-NW7 .location-hero__cta:has(#location-hero__cta-secondary a) a:first-of-type {
                margin-right: 0px !important;
        }
        .AB-NW7 #location-hero__cta-secondary a {
            margin-top:15px !important;
        }
        .AB-NW7 .nw7-social-proof {
          margin-top: 15px !important;
        }
   }
  `;

  function injectStyles(cssString) {
    if (document.getElementById("NW7-styles")) return;
    const style = document.createElement("style");
    style.id = "NW7-styles";
    style.textContent = cssString;
    document.head.appendChild(style);
  }

  function getStructuredData() {
    const divs = document.querySelectorAll('div[id*="hs_cos_wrapper_widget_"]');
    for (const div of divs) {
      const script = div.querySelector('script[type="application/ld+json"]');
      if (script) {
        try {
          return JSON.parse(script.textContent);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }



  function buildHeroBlock(data) {
    const ctaEl = q(".location-hero__cta");
    if (ctaEl) {
      const parsed = getHeroData(data);
      const card = createHeroCard(parsed);

      const primaryInfo = document.querySelector('.location-info-map__primary-info');
      if (primaryInfo) {
        const svg = primaryInfo.querySelector('svg');
        if (svg) {
          svg.outerHTML = ICONS.clock;
        }
        const hoursRow = card.querySelector('.nw7-row-hours');
        if (hoursRow) {
          hoursRow.appendChild(primaryInfo);
        }
      }

      const social = createSocial(parsed.starsHTML);

      updateCTA();
      insertHero(ctaEl, card, social);
      attachHeroEvents(card);

      logInfo("Hero block injected.");
    }
  }

  function getHeroData(data) {
    const addr = data.address || {};
    const line1 = addr.streetAddress || "";
    const line2 = [addr.addressLocality, addr.addressRegion, addr.postalCode].filter(Boolean).join(", ");

    const query = [
      line1,
      addr.streetAddress2,
      addr.addressLocality,
      addr.addressRegion,
      addr.postalCode
    ].filter(Boolean).join(" ");
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    const rawPhone = data.telephone || "";
    const digits = rawPhone.replace(/\D/g, "");
    const fmtPhone = digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3");
    const telHref = `tel:+1${digits}`;

    const starsHTML = Array(5).fill(ICONS.star).join("");

    return {
      line1,
      line2,
      mapsUrl,
      fmtPhone,
      telHref,
      starsHTML,
    };
  }

  function createHeroCard(data) {
    const { line1, line2, mapsUrl, fmtPhone, telHref } = data;

    const card = document.createElement("div");
    card.className = "nw7-hero-wrap";

    const primaryInfo = q('.location-info-map__primary-info');
    primaryInfo.classList.remove('lg:mb-5');

    const hoursData = q('.location-info-map__hours-of-operation');
    hoursData.classList.remove('mb-5');

    const clockImg = q('.location-info-map__operation-hours-copy img:first-of-type');
    const caretImg = q('.location-info-map__operation-hours-copy img:last-of-type');

    if (clockImg) {
      clockImg.outerHTML = ICONS.clock;
    }

    if (caretImg) {
      caretImg.outerHTML = ICONS.caret;
    }

    card.innerHTML = `
      <div class="nw7-hero-card">
        <div class="nw7-row nw7-row-hours"></div>
        <div class="nw7-row nw7-row-address">
          ${ICONS.pin}
          <a class="nw7-link nw7-address-link" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">
            ${line1}<br>${line2}
          </a>
        </div>
        <div class="nw7-row nw7-row-phone">
          ${ICONS.phone}
          <a class="nw7-link nw7-phone-link" href="${telHref}">${fmtPhone}</a>
        </div>
      </div>
    `;

    return card;
  }

  function createSocial(starsHTML) {
    const social = document.createElement("div");
    social.className = "nw7-social-proof";
    social.innerHTML = `<span class="nw7-stars">${starsHTML}</span><span>50K+ Members</span>`;
    return social;
  }

  function updateCTA() {
    const originalCTA = document.querySelector(".location-hero__cta a");
    if (originalCTA) {
      originalCTA.textContent = "BOOK APPOINTMENT";
    }
  }

  function insertHero(ctaEl, card, social) {
    ctaEl.parentElement.insertBefore(card, ctaEl);
    ctaEl.parentElement.insertBefore(social, ctaEl.nextSibling);
  }

  function attachHeroEvents(card) {
    const addressLink = card.querySelector(".nw7-address-link");
    if (addressLink) {
      addressLink.addEventListener("click", () => {
        fireGA4Event("NW7_keylocationclicks", "Address");
      });
    }

    const phoneLink = card.querySelector(".nw7-phone-link");
    if (phoneLink) {
      phoneLink.addEventListener("click", () => {
        fireGA4Event("NW7_keylocationclicks", "PhoneNumber");
      });
    }
  }

  function setupHeroCTAEvent() {
    const heroCta = q(".location-hero__cta");
    if (heroCta) {
      heroCta.addEventListener("click", (e) => {
        fireGA4Event("NW7_HeroCTAClick", "CTA Copy");
        logInfo("Hero CTA clicked - event fired");
      });
    } else {
      logInfo("Hero CTA element not found");
    }
  }

  function setupScrollEvent() {
    const heroSection = q(".location-hero__main-container")
    if (!heroSection) {
      logInfo("Hero section not found for scroll event");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          fireGA4Event("NW7_ViewBTF");
          logInfo("User scrolled past hero - BTF event fired");
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(heroSection);
    logInfo("Scroll event listener attached");
  }

  function setupBTFClickEvents() {
    const mapContainer = q(".location-info-map__actions");
    const bookingBtn = mapContainer.querySelector("a:first-child");
    if (bookingBtn) {
      bookingBtn.addEventListener("click", () => {
        fireGA4Event("NW7_BTFClick", "Maps Section");
        logInfo("BTF Maps Section clicked");
      });
    } else {
      logInfo("Map container not found for BTF event");
    }

    const appointmentContainer = q(".location-info-map__appointments-container");
    if (appointmentContainer) {
      const bookingBtn = appointmentContainer.querySelector(".location-info-map__next-appointments__card__cta");
      if (bookingBtn) {
        bookingBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          fireGA4Event("NW7_BTFClick", "Booking Section");
          logInfo("BTF Booking Section clicked");
        });
      } else {
        logInfo("Booking button not found in .location-info-map__actions");
      }
    } else {
      logInfo(".location-info-map__actions parent not found");
    }
  }

  function swapBoutiqueAndBooking() {
    const mapContainer = q(".location-info-map__map-container");
    if (!mapContainer) {
      logInfo("Map container not found — swap skipped");
      return;
    }
    const boutiqueDiv = mapContainer.children[1];
    if (!boutiqueDiv) {
      logInfo("Boutique div not found — swap skipped");
      return;
    }
    const apptContainer = q(".location-info-map__next-available-appointment-container");
    if (!apptContainer) {
      logInfo("Appt container not found — swap skipped");
      return;
    }
    const apptDiv = apptContainer.children[1];
    if (!apptDiv) {
      logInfo("Appt div not found — swap skipped");
      return;
    }

    const phA = document.createComment("nw7-ph-boutique");
    const phB = document.createComment("nw7-ph-appt");
    mapContainer.insertBefore(phA, boutiqueDiv);
    apptContainer.insertBefore(phB, apptDiv);
    mapContainer.replaceChild(apptDiv, phA);
    apptContainer.replaceChild(boutiqueDiv, phB);

    logInfo("V2 swap: Boutique ↔ Book Appointment complete.");
  }

  function init() {
    if (document.body.classList.contains(page_initials)) return;
    q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
    injectStyles(css);

    const businessData = getStructuredData();
    if (businessData) {
      buildHeroBlock(businessData);
    } else {
      logInfo("No structured data — hero block skipped.");
    }

    setupHeroCTAEvent();
    setupScrollEvent();
    setupBTFClickEvents();

    if (test_variation === 2) {
      swapBoutiqueAndBooking();
    }

    logInfo("Initialised - all event listeners attached");
  }

  function isReady() {
    const hasHero = !!q(".location-hero__cta");
    const hasHeroSection = !!q(".location-hero__main-container");
    if (test_variation === 2) {
      return hasHero && hasHeroSection && !!q(".location-info-map__map-container") && !!q(".location-info-map__next-available-appointment-container") && !!q(".location-info-map__actions");
    }
    return hasHero && hasHeroSection;
  }

  try {
    await waitForElement(isReady);
    init();
  } catch (err) {
    logInfo(`Aborted — ${err.message}`);
  }
})();
