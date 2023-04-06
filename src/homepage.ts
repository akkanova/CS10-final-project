// Global readonly Variables
let hours: HTMLSpanElement;
let minutes: HTMLSpanElement;
let seconds: HTMLSpanElement;

/** Will Always Run */
(() => {
  hours = document.getElementById("hours") as HTMLSpanElement;
  minutes = document.getElementById("minutes") as HTMLSpanElement;
  seconds = document.getElementById("seconds") as HTMLSpanElement;

  const selector = document.getElementById("phone-selector-1") as HTMLInputElement;
  selector.addEventListener("change", () => {
    (document.getElementById("selecter-output-1") as HTMLSpanElement).innerText = formatPhoneNumber(selector.value);
  });

  (document.getElementById("random-phone-num-btn") as HTMLAnchorElement).addEventListener("click", () => {
    (document.getElementById("random-phone-num") as HTMLSpanElement).innerText = formatPhoneNumber(
      Math.floor(Math.random() * 9999999999).toString()
    );
  });

  updateClock();
  setupDropDownMenu();
})();

/**
 * This Function runs every second to update the live clock
 * P.S. Do not put heavy functions here!
 */
function updateClock() {
  setTimeout(updateClock, 1000);

  const date = new Date();
  hours.innerHTML = parseNumber(date.getHours());
  minutes.innerHTML = parseNumber(date.getMinutes());
  seconds.innerHTML = parseNumber(date.getSeconds());
}

function parseNumber(num: number, digit = 2) {
  let str = String(num);
  if (str.length < digit) {
    for (let i = 0; i < digit - String(num).length; i++) str = "0" + str;
  }
  return str;
}

/** Formats 10 digit numbers to a recognizable phone-number string*/
function formatPhoneNumber(val: string) {
  const b = parseNumber(Number(val), 10);
  return `+1 (${b.substring(0, 3)}) ${b.substring(3, 6)}-${b.substring(6)}`;
}

/**
 * Function to automatically add options to the drop down menus
 * P.S. Saved me a lot of time and resources
 */
function setupDropDownMenu() {
  const areaCodeSelector = document.getElementById("area-code") as HTMLSelectElement;
  const exchangeCodeSelector = document.getElementById("exchange-code") as HTMLSelectElement;
  const lineCodeSelector = document.getElementById("line-num") as HTMLSelectElement;
  for (let i = 0; i < 10000; i++) {
    const option = document.createElement("option");
    option.setAttribute("value", i.toString());
    option.innerText = parseNumber(i, 4);
    lineCodeSelector.appendChild(option);

    if (i < 1000) {
      const optionClone = option.cloneNode(true);
      optionClone.textContent = parseNumber(i, 3);

      areaCodeSelector.appendChild(optionClone);
      exchangeCodeSelector.appendChild(optionClone.cloneNode(true));
    }
  }
}
