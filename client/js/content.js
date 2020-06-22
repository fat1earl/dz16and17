export class Content {
  constructor(container) {
    this.container = container;
    this.data = {};
    this.updateList = null;

    this.handleClickTrashBtn = this._clickTrashBtn.bind(this);
  }

  _clear() {
    this.container.innerHTML = "";
  }

  _createEditButton(id) {
    const btnNode = document.createElement("button");

    btnNode.classList.value = "btn btn-warning";
    btnNode.textContent = "Редактировать";
    btnNode.setAttribute("data-id", id);

    btnNode.addEventListener("click", this._clickEditBtn);

    return btnNode;
  }

  _createTrashButton(id) {
    const btnNode = document.createElement("button");

    btnNode.classList.value = "btn btn-danger ml-2";
    btnNode.textContent = "Удалить";
    btnNode.setAttribute("data-id", id);

    btnNode.addEventListener("click", this.handleClickTrashBtn);

    return btnNode;
  }

  _clickEditBtn(event) {
    const id = event.currentTarget.getAttribute("data-id");
    const form = document.querySelector("#form");
    const nameField = form.querySelector('[name="name"]');
    const contentField = form.querySelector('[name="content"]');
    const idField = form.querySelector('[name="id"]');
    const dateField = form.querySelector('[name="date"]');

    const numberField = form.querySelector('[name="number"]');
    const lastNameField = form.querySelector('[name="lastName"]');
    const surNameField = form.querySelector('[name="surName"]');
    const workField = form.querySelector('[name="work"]');
    const mailField = form.querySelector('[name="mail"]');

    form.setAttribute("data-method", "PUT");

    fetch("/api/data", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        data.list.forEach((item) => {
          if (item.id == id) {
            nameField.value = item.name;

            contentField.value = item.content;
            idField.value = item.id;
            dateField.value = item.date;

            numberField.value = item.number;
            lastNameField.value = item.lastName;
            surNameField.value = item.surName;
            workField.value = item.work;
            mailField.value = item.mail;

            $("#formModal").modal("show");
          }
        });
      })
      .catch((error) => console.error(error));
  }

  _clickTrashBtn(event) {
    const id = event.currentTarget.getAttribute("data-id");
    const isConfirm = confirm("Вы уверены, что хотите удалить пост?");

    if (!isConfirm) return;

    fetch(`/api/data/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        // Очистить контент послу удаления
        this._clear();
        // Если метод для обновления списка передали в этот класс, то можно запустить
        if (this.updateList) {
          this.updateList(data.list);
        }
      })
      .catch((error) => console.error(error));
  }

  render(data, updateList) {
    this.data = data;
    this.updateList = updateList;
    const btnEdit = this._createEditButton(this.data.id);
    const btnTrash = this._createTrashButton(this.data.id);

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
    this._clear();
    this.container.innerHTML = this.container.innerHTML + template;

    const btnWrap = document.createElement("div");
    btnWrap.classList.value = "mt-auto";
    btnWrap.append(btnEdit, btnTrash);
    this.container.append(btnWrap);
  }
}
