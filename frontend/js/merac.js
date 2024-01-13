import createMinMaxElement from '../util/createMinMaxProsekElement.js';
import CustomError from '../util/CustomError.js';

export default class Merac {
  constructor(
    id,
    naziv,
    max,
    min,
    dg,
    gg,
    boja,
    podeok,
    trenutna,
    srednja,
    liEl = null
  ) {
    this.id = id;
    this.naziv = naziv;
    this.interval = podeok;
    this.max = max;
    this.min = min;
    this.dg = dg;
    this.gg = gg;
    this.vrednost = trenutna;
    this.boja = boja;
    this.prosek = srednja;
    this.liEl = liEl;
  }

  draw(ulElContainer) {
    // dummy error check
    if (!this.naziv) {
      const h1 = document.createElement('h1');
      h1.textContent = 'Desila se greska pri komunikaciji sa serverom';
      container.appendChild(h1);
    }

    this.drawList(ulElContainer);
  }

  drawList(ulElContainer) {
    // li
    const liEl = document.createElement('li');
    liEl.classList.add('item');
    liEl.id = `id-${this.id}`;
    this.liEl = liEl;
    ulElContainer.appendChild(liEl);

    this.drawPodaci(liEl);

    this.drawTermometar(liEl);
  }

  drawPodaci(liEl) {
    // li div(podaci)
    const divEl = document.createElement('div');
    divEl.classList.add('item-data');
    liEl.appendChild(divEl);
    // li div(h3)
    const h3El = document.createElement('h3');
    h3El.classList.add('item-data--h3');
    h3El.textContent = this.naziv;
    divEl.appendChild(h3El);

    // li div(input)
    const inputNumberEl = document.createElement('input');
    inputNumberEl.classList.add(`input-number`);
    inputNumberEl.type = 'number';
    inputNumberEl.name = 'numberValue';
    inputNumberEl.value = this.vrednost;
    divEl.appendChild(inputNumberEl);

    // li div(button)
    const buttonEl = document.createElement('button');
    buttonEl.classList.add('btn');
    buttonEl.addEventListener('click', this.clickEventHandler);
    buttonEl.type = 'button';
    buttonEl.innerText = 'Upisi';
    divEl.appendChild(buttonEl);

    // li div(max)
    createMinMaxElement(divEl, 'Max izmerena vrednost: ', this.max, 'max');
    // li div(min)
    createMinMaxElement(divEl, 'Min izmerena vrednost: ', this.min, 'min');
    // li div(prosek)
    createMinMaxElement(
      divEl,
      'Prosek izmerena vrednost: ',
      this.prosek,
      'prosek'
    );
  }

  drawTermometar(liEl) {
    // li div(termometar)
    const termDivEl = document.createElement('div');
    termDivEl.classList.add('termometar');
    liEl.appendChild(termDivEl);

    // li div(divStub)
    const stubParentDivEl = document.createElement('div');
    const stubChildrenDivEl = document.createElement('div');
    stubChildrenDivEl.classList.add(`children-stub`);
    stubParentDivEl.classList.add('stub');
    stubChildrenDivEl.style.backgroundColor = this.boja;
    const proc = (this.vrednost - this.dg) / (this.gg - this.dg);
    console.log(proc);
    stubChildrenDivEl.style.height = `${proc * 100}%`;
    if (!isFinite(proc)) {
      stubChildrenDivEl.style.height = `${100}%`;
    }
    stubParentDivEl.appendChild(stubChildrenDivEl);

    const podeociDivEl = document.createElement('div');
    podeociDivEl.classList.add('podeoci');
    termDivEl.appendChild(podeociDivEl);
    termDivEl.appendChild(stubParentDivEl);

    // jedna labela vise zato je + 1
    const brLabela = (this.gg - this.dg) / this.interval + 1;

    for (let i = this.gg; i >= this.dg; i -= this.interval) {
      const pEl = document.createElement('p');
      pEl.classList.add('podeok');
      pEl.style.height = `${Math.round(400 / brLabela)}px`;
      stubChildrenDivEl.style.marginBottom = `${Math.round(100 / brLabela)}px`;
      pEl.textContent = i;
      podeociDivEl.appendChild(pEl);
    }
  }

  clickEventHandler = async (event) => {
    const inputEl = this.liEl.querySelector(`.input-number`);
    const value = inputEl.value;

    if (!value) {
      alert('Podatak o temperaturi je pogresan');
      return;
    }

    const response = await fetch(
      `https://localhost:5001/Merac/PromeniVrednost/${Number(this.id)}/${Number(
        value
      )}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      throw new CustomError('Something went wrong', response.statusCode);
    }

    const data = await response.json();
    console.log(data);
    this.min = data.minIzmerena;
    this.max = data.maxIzmerena;
    this.prosek = (this.max - this.min) / 2;
    this.vrednost = data.trenutaVrednost;

    const stubChildrenDivEl = this.liEl.querySelector('.children-stub');
    console.log(stubChildrenDivEl);

    this.liEl.querySelector('.max').textContent = this.max;
    this.liEl.querySelector('.min').textContent = this.min;
    this.liEl.querySelector('.prosek').textContent = this.prosek;

    const proc = (value - this.dg) / (this.gg - this.dg);
    console.log(proc);

    stubChildrenDivEl.style.height = `${proc * 100}%`;
    if (!isFinite(proc)) {
      stubChildrenDivEl.style.height = `${100}%`;
    }
  };
}
