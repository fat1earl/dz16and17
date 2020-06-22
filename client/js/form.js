import { List } from "./list";
import { resetForm } from "./reset-form";

export class Form {
  constructor(form) {
    this.form = form;
    this.idField = document.querySelector('[name="id"]');
    this.dateField = document.querySelector('[name="date"]');

    this.btnSubmit = document.querySelector('[type="submit"]');
    this.listContainer = document.querySelector("#list");
    this.list = new List(this.listContainer);

    this.handleSubmit = this._submit.bind(this);

    this._init();
  }

  _init() {
    this.btnSubmit.addEventListener("click", this.handleSubmit);
  }

  // Добавить ноль перед числом
  _parseNumber(num) {
    const parsedNum = num;

    return parsedNum < 10 ? `0${parsedNum}` : parsedNum;
  }

  _parseStringToHtml(content) {
    const resultContent = content
      .replace(/(#{1})(.+)/gim, "<h1>$2</h1>")
      .replace(/(#{2})(.+)/gim, "<h2>$2</h2>")
      .replace(/(#{3})(.+)/gim, "<h3>$2</h3>")
      .replace(/(#{4})(.+)/gim, "<h4>$2</h4>")
      .replace(/(\~{2})(.+)(\~{2})/gim, "<strike>$2</strike>")
      .replace(/(\+375){1}(\d{2})(\d{3})(\d{2})(\d{2})/gim, "$1 ($2) $3-$4-$5")
      .replace(/(\+{2})(.+)(\+{2})/gim, "<span class='text-success'>$2</span>")
      .replace(/(\-{2})(.+)(\-{2})/gim, "<span class='text-danger'>$2</span>")
      .replace(
        /(^(https):\/\/[a-z]+\.[a-z]+)/gim,
        '<a href="$1" target="blank" rel="noopener">$1</a>'
      )
      .replace(/-{3}/gim, "<hr>")
      .replace(/-\|{3}/gim, "<br>");

    return resultContent;
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
    let url = "/api/data";

    if (method == "PUT") url += `/${data.id}`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        this.list.render(data.list);
      })
      .catch((error) => console.error(error));
  }

  _setMetaData(id, date) {
    // Если мы редактируем, то метаданные уже есть и менять их не будем
    if (this.idField.value && this.dateField.value) return;

    this.idField.value = id;
    this.dateField.value = date;
  }

  _submit(event) {
    event.preventDefault();
    const currentMethod = this.form.getAttribute("data-method");

    const currentDate = new Date();
    this._setMetaData(currentDate.getTime(), this._buildDate(currentDate));

    const formData = new FormData(this.form);
    const data = {};

    if (!this.form.checkValidity()) {
      this.form.classList.add("invalid");
    } else {
      this.form.classList.remove("invalid");

      for (const [name, value] of formData) {
        data[name] = value;
      }
    }
    // data.content = this._parseStringToHtml(data.content);
    data.name = this._parseStringToHtml(data.name);
    data.date = this._parseStringToHtml(data.date);
    data.number = this._parseStringToHtml(data.number);
    data.lastName = this._parseStringToHtml(data.lastName);
    data.surName = this._parseStringToHtml(data.surName);
    data.work = this._parseStringToHtml(data.work);
    data.mail = this._parseStringToHtml(data.mail);
    data.content = this._parseStringToHtml(data.content);

    this._send(data, currentMethod);

    resetForm(this.form);
    $("#formModal").modal("hide");
    // Открыть модальное окно
  }
}
