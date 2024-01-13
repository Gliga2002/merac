export default function createMinMaxProsekElement(
  divElContainer,
  innerText,
  value,
  klasa
) {
  const pEl = document.createElement('p');
  pEl.classList.add(`min-max-prosek`);
  pEl.innerText = innerText;
  const spanEl = document.createElement('span');
  spanEl.classList.add(`${klasa}`);
  spanEl.innerText = Math.round(value);
  pEl.appendChild(spanEl);
  divElContainer.appendChild(pEl);
}
