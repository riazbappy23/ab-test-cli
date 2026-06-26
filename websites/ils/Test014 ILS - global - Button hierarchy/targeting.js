var maxTime = 25000; // 25s
  var intervalTime = 200;
  var elapsed = 0;

  function hasAllElements() {
    var formContainer = document.querySelector(
      '#sud-formular'
    );

    if (!formContainer) return false;
    return true;
  }

  return new Promise(function (resolve) {
    var interval = setInterval(function () {
      if (hasAllElements()) {
        clearInterval(interval);
        resolve(true);
      }

      elapsed += intervalTime;

      if (elapsed >= maxTime) {
        clearInterval(interval);
        resolve(false);
      }
    }, intervalTime);
  });