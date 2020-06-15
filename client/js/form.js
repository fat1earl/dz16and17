import { List } from './list';
import { Content } from './content';
import { resetForm } from './reset-form';

export class Form {
  constructor(form) {
    this.form = form;
    this.idField = document.querySelector('[name="id"]');
    this.dateField = document.querySelector('[name="date"]');

    this.btnSubmit = document.querySelector('[type="submit"]');

    this.listContainer = document.querySelector('#list');
    this.contentContainer = document.querySelector('#content');

    this.handleSubmit = this._submit.bind(this);

    this._init();
  }

  _init() {
    this.btnSubmit.addEventListener('click', this.handleSubmit);
  }

  // Добавить ноль перед числом
  _parseNumber(num) {
    const parsedNum = num;

    return parsedNum < 10 ? `0${parsedNum}` : parsedNum;
  }

  _buildDate(date) {
    // dd.mm.YYYY hh:mm
    const day = this._parseNumber(date.getDate());
    const month = this._parseNumber(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = this._parseNumber(date.getHours());
    const minutes = this._parseNumber(date.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  // Метод отправки зависит от аргумента method
  _send(data, method) {
    let url = '/api/data';

    if (method == 'PUT') url += `/${data.id}`;

    const btnNode = document.querySelector('btnEdit');
    const id = btnNode.getAttribute('data-id');

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => new List(this.listContainer, data.list))
      .then((data) => data.list.forEach((item) => {
        if (id == item.id) {
          new Content(this.contentContainer, item);
        }
      }))
      .catch((error) => console.error(error));
  }

  _setMetaData(id, date) {
    // Если мы редактирует, то метаданные уже есть и менять их не будем
    if (this.idField.value && this.dateField.value) return;

    this.idField.value = id;
    this.dateField.value = date;
  }

  _submit(event) {
    event.preventDefault();
    const currentMethod = this.form.getAttribute('data-method');

    const currentDate = new Date();
    this._setMetaData(currentDate.getTime(), this._buildDate(currentDate));

    const formData = new FormData(this.form);
    const data = {};
    if (!this.form.checkValidity()) {
      this.form.classList.add('invalid');
    } else {
      this.form.classList.remove('invalid');

      for (const [name, value] of formData) {
        data[name] = value;
      }

      this._send(data, currentMethod);

      resetForm(this.form);
      $('#formModal').modal('hide'); // Открыть модальное окно
    }
  }
}
