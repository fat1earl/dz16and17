export class Content {
  constructor(container, data) {
    this.container = container;
    this.data = data;

    this._init();
  }

  _init() {
    this._render();
    this.container.addEventListener('click', this.handleClickList);
  }

  _clear() {
    this.container.innerHTML = '';
  }

  _createEditButton(id) {
    const btnNode = document.createElement('btnEdit');

    btnNode.classList.value = 'btn btn-warning mt-auto';
    btnNode.textContent = 'Редактировать';
    btnNode.setAttribute('data-id', id);

    btnNode.addEventListener('click', this._clickEditBtn);

    return btnNode;
  }

  _clickEditBtn(event) {
    const id = event.currentTarget.getAttribute('data-id');
    const form = document.querySelector('#form');
    const nameField = form.querySelector('[name="name"]');
    const contentField = form.querySelector('[name="content"]');
    const idField = form.querySelector('[name="id"]');
    const dateField = form.querySelector('[name="date"]');

    const numberField = form.querySelector('[name="number"]');
    const lastNameField = form.querySelector('[name="lastName"]');
    const surNameField = form.querySelector('[name="surName"]');
    const workField = form.querySelector('[name="work"]');
    const mailField = form.querySelector('[name="mail"]');

    form.setAttribute('data-method', 'PUT');

    fetch('/api/data', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        data.list.forEach((item) => {
          if (id == item.id) {
            nameField.value = item.name;

            contentField.value = item.content;
            idField.value = item.id;
            dateField.value = item.date;

            numberField.value = item.number;
            lastNameField.value = item.lastName;
            surNameField.value = item.surName;
            workField.value = item.work;
            mailField.value = item.mail;

            $('#formModal').modal('show');
          }
        });
      })
      .catch((error) => console.error(error));
  }

  _render() {
    this._clear();

    const btEdit = this._createEditButton(this.data.id);

    const template = `
    <div class="header_content">
      <h3>${this.data.name}</h3></div>
      <h6 class="text-muted">Создано/Изменено ${this.data.date}</h6>
      <div>Телефон: ${this.data.number}</div>
      <div>Фамилия: ${this.data.lastName}</div>
      <div>Отчество: ${this.data.surName}</div>
      <div>Должность: ${this.data.work}</div>
      <div>Емайл: ${this.data.mail}</div>
      <div>Заметка: ${this.data.content}</div>
    `;
    this.container.innerHTML = this.container.innerHTML + template;
    this.container.append(btEdit);
  }
}
