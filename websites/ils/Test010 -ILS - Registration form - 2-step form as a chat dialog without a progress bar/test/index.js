(function () {
  const globalVariables = {
    testName: "ils-test-001",
    pageInitials: "ab-ils-test-001",
    testVariation: 1,
  };

  function waitForElem(predicate, callback, timer = 25000, frequency = 100) {
    if (timer <= 0) return;
    if (typeof predicate === "function" && predicate()) {
      callback();
    } else {
      setTimeout(
        () => waitForElem(predicate, callback, timer - frequency),
        frequency
      );
    }
  }

  const testAssets = {
    btnArrowSvg: `<svg width="26" height="14" viewBox="0 0 26 14" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="7" x2="20" y2="7" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
      <polyline points="13,1 21,7 13,13" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `
  }

  const init = () => {
    const formItemsContainer = document.querySelector('#sud-formular form div[identifier="form-row"]')
    // control elements
    const genderSelectorEl = formItemsContainer?.querySelector('.field-salutation');
    const firstNameEl = formItemsContainer?.querySelector('.field-firstName');
    const lastNameEl = formItemsContainer?.querySelector('.field-lastName');
    const emailEl = formItemsContainer?.querySelector('.field-email');
    const streetEl = formItemsContainer?.querySelector('.field-street');
    const streetNumberEl = formItemsContainer?.querySelector('.field-streetNumber');
    const countryEl = formItemsContainer?.querySelector('.formkit-outer.field.combobox');
    const zipEl = formItemsContainer?.querySelector('.field-zip')
    const cityEl = formItemsContainer?.querySelector('.field-city')

    //add class names
    genderSelectorEl?.parentElement?.classList?.add("exp-form-row", "exp-form-row--salutation", "exp-form-row--step1")
    formItemsContainer?.querySelector('div[identifier="gridrow-3"]')?.parentElement?.classList?.add("exp-form-row", "exp-form-row--first-n-lastname", "exp-form-row--step1")
    formItemsContainer?.querySelector('div[identifier="gridrow-1"]')?.parentElement?.classList?.add("exp-form-row", "exp-form-row--street-n-streetnumber", "exp-form-row--step2")
    formItemsContainer?.querySelector('div[identifier="location-row-2"]')?.parentElement?.classList?.add("exp-form-row", "exp-form-row--country-zip-city", "exp-form-row--step2")
    emailEl?.parentElement?.classList?.add("exp-form-row", "exp-form-row--email", "exp-form-row--step1")

    //add placeholders
    firstNameEl.querySelector('input').setAttribute('placeholder', 'Vorname*');
    lastNameEl.querySelector('input').setAttribute('placeholder', 'Nachname*');
    emailEl.querySelector('input').setAttribute('placeholder', 'E-Mail-Adresse*');
    streetEl.querySelector('input').setAttribute('placeholder', 'Straße*');
    streetNumberEl.querySelector('input').setAttribute('placeholder', 'Nr*');
    zipEl.querySelector('input').setAttribute('placeholder', 'Postleitzahl*');
    cityEl.querySelector('input').setAttribute('placeholder', 'Ort*');

    //const add button
    const securityHintContainer = formItemsContainer.querySelector('div[data-field="secure-hint-1"]')
    securityHintContainer.parentElement.insertAdjacentHTML('beforebegin', `
      <div type="button" role="button" tabindex="0" class="exp-btn-step-2 exp-btn-orange">Zu den Kontaktangaben ${testAssets.btnArrowSvg}</div>
      <div role="button" tabindex="0" class="exp-btn-final exp-btn-orange">Jetzt Preise einsehen ${testAssets.btnArrowSvg}</div>
      <p class="exp-access-info">Keine Kursbuchung. Der Zugang ist kostenlos & unverbindlich.</p>
      `)

    // step one button event listener
    const toStepTwoBtn = formItemsContainer.querySelector('.exp-btn-step-2')
    toStepTwoBtn.addEventListener('click', () => {
      const firstNameSuccessIcon = firstNameEl.querySelector('.input__icon-state  .icon-success')
      const lastNameSuccessIcon = lastNameEl.querySelector('.input__icon-state  .icon-success')
      const emailSuccessIcon = emailEl.querySelector('.input__icon-state  .icon-success')
      const checkedGenderSelector = genderSelectorEl.querySelector('input[checked]')
      if (firstNameSuccessIcon && lastNameSuccessIcon && emailSuccessIcon && checkedGenderSelector) {
        document.querySelector('#sud-formular').classList.add('exp-step-2');
      } else {
        if (!checkedGenderSelector) {
          genderSelectorEl?.querySelector('.exp-salutation-err-msg')?.classList?.add('show');
        }
        if (!firstNameSuccessIcon) {
          firstNameEl.querySelector('input').focus();
          firstNameEl.querySelector('input').dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        }
        if (!lastNameSuccessIcon) {
          lastNameEl.querySelector('input').focus();
          lastNameEl.querySelector('input').dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        }
        if (!emailSuccessIcon) {
          emailEl.querySelector('input').focus();
          emailEl.querySelector('input').dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        }
      }
    })

    //Blocking the main button in step one
    const formEl = document.querySelector('#sud-formular form#sud-lehrgang-5')

    formEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        console.log('enter is pressed')
        const isStep1Active = !document.querySelector('#sud-formular').classList.contains('exp-step-2');

        if (isStep1Active) {
          e.preventDefault();
          toStepTwoBtn.click();
        }
      }
    }, true);

    // complete

    //step two button event listener
    const finalBtn = formItemsContainer.querySelector('.exp-btn-final')
    finalBtn.addEventListener('click', () => {
      document.querySelector('#sud-formular .formkit-actions button').click();
    })

    // add step indicatior

    formEl.insertAdjacentHTML('beforebegin', `
      <div class="exp-form-step-indicator-container">

        <div class="exp-form-step-indicator">
          <span class="exp-form-step-indicator--step">
            
          </span>
        </div>
        <p class="exp-form-step-indicator-text">Sparen Sie sich das Tippen bei Ihrer zukünftigen Kursbuchung. Wir hinterlegen Ihre Adresse sicher, damit der Versand von Studienmaterialien später reibungslos und schnell für Sie abläuft.</p>

      </div>
      `);

    //add required note
    formItemsContainer.querySelector('div[data-field="dataprotection-link"]')?.insertAdjacentHTML('afterend', `<p class="exp-required-note">* Pflichtfeld</p>`)

    //insert Image
    const outerSection = document.querySelector('#sud-formular >  .container > section');
    outerSection.insertAdjacentHTML('afterbegin', `
      <div class="exp-form-image-wrapper">
        <img src="https://www.ils.de/fileadmin/bilder/testing/frau-lernen-digitale-medien.jpg" />
      </div>
      `)

    //insert salutatation message
    genderSelectorEl.insertAdjacentHTML('beforeend', `<div class="exp-salutation-err-msg "><p class="field__message">Bitte Anrede auswählen</p></div>`)
  }

  const hasAllElements = () => {
    const formItemsContainer = document.querySelector('#sud-formular form div[identifier="form-row"]')

    const genderSelectorEl = formItemsContainer?.querySelector('.field-salutation');
    const firstNameEl = formItemsContainer?.querySelector('.field-firstName');
    const lastNameEl = formItemsContainer?.querySelector('.field-lastName');
    const emailEl = formItemsContainer?.querySelector('.field-email');
    const streetEl = formItemsContainer?.querySelector('.field-street')
    const streetNumberEl = formItemsContainer?.querySelector('.field-streetNumber')
    const countryEl = formItemsContainer?.querySelector('.formkit-outer.field.combobox')
    const zipEl = formItemsContainer?.querySelector('.field-zip');
    const cityEl = formItemsContainer?.querySelector('.field-city');
    const cityInputEl = formItemsContainer?.querySelector('.field-city input');
    const viewPriceBtn = document.querySelector('#sud-formular .formkit-actions button');
    const securityHintContainer = formItemsContainer?.querySelector('div[data-field="secure-hint-1"]')

    if (formItemsContainer && genderSelectorEl && cityInputEl && viewPriceBtn && securityHintContainer && document.readyState === 'complete') {
      return true;
    } else {
      return false;
    }
  };

  const pageInitials = globalVariables.pageInitials;

  waitForElem(
    () => document.querySelector(`body:not(.${pageInitials})`) && hasAllElements(),
    () => {
      document.querySelector("body").classList.add(pageInitials);
      console.log(`${pageInitials} v${globalVariables.testVariation}`);
      init();
    }
  );

})();
