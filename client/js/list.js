import { Content } from './content';

export class List {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.activeListItem = null;

    this.handleClickList = this._clickList.bind(this);

    this._init();
  }

  _init() {
    this._render();
    this.container.addEventListener('click', this.handleClickList);
  }

  _clear() {
    this.container.innerHTML = '';
  }

  _removeActive() {
    if (!this.activeListItem) return;

    this.activeListItem.classList.remove('active');
  }

  _clickList(event) {
    const { target } = event;

    if (target.classList.value.includes('list-item')) {
      const id = target.getAttribute('data-id');

      target.classList.add('active');
      this._removeActive();
      this.activeListItem = target;

      fetch('/api/data', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => data.list.forEach((item) => {
          if (id == item.id) {
            new Content(document.querySelector('#content'), item);
          }
        }))
        .catch((error) => console.error(error));
    }
  }

  _render() {
    this._clear();

    this.data.forEach((item) => {
      const template = `
        <div class="list-item p-3" data-id="${item.id}">
          <h5>${item.name}</h5>
          <small>${item.date}</small>
        </div>
      `;

      this.container.innerHTML = this.container.innerHTML + template;
    });
  }
}
