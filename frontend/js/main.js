import Application from './application.js';

const bodyEl = document.body;
const sectionEl = document.createElement('section');
sectionEl.classList.add('section');
const ulEl = document.createElement('ul');
ulEl.classList.add('items');

const app = new Application();
app.draw(ulEl);
sectionEl.appendChild(ulEl);
bodyEl.appendChild(sectionEl);
