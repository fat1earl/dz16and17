import { Content } from "./content";

export class List {
  constructor(container) {
    this.container = container;
    this.data = [];

    this.activeItemId = null;
    this.deleteItemId = null;

    this.contentContainer = document.querySelector("#content");
    this.content = new Content(document.querySelector("#content"));

    this.handleClickList = this._clickList.bind(this);

    this.handleClickTrashListBtn = this._clickTrashListBtn.bind(this);

    this._init();
  }

  _init() {
    this.container.addEventListener("click", this.handleClickList);
    this.container.addEventListener("click", this.handleClickTrashListBtn);
  }

  _removeActive() {
    const target = this.container.querySelector(
      `[data-id="${this.activeItemId}"]`
    );
    if (target) {
      target.classList.remove("active");
    } else {
      this.activeItemId = null;
    }
  }

  _selectListItem(id) {
    const target = this.container.querySelector(`[data-id="${id}"]`);

    if (target) {
      this._removeActive();
      this.activeItemId = id;
      target.classList.add("active");
    } else {
      this.activeItemId = null;
    }

    this.data.forEach((item) => {
      if (id == item.id) {
        this.content.render(item, this.render.bind(this));
      }
    });
  }

  _clickList(event) {
    const target = event.target;
    if (target.classList.value.includes("list-item")) {
      const id = target.getAttribute("data-id");

      this._selectListItem(id);
    }
  }

  _selectDelBtn(idBtnDel) {
    const target = this.container.querySelector(`[data-id="${idBtnDel}"]`);

    if (target) {
      this.deleteItemId = idBtnDel;

      fetch(`/api/data/${idBtnDel}`, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => {
          this.render(data.list);
          this.content._clear();
        })
        .catch((error) => console.error(error));
    } else {
      this.idBtnDel = null;
    }
  }

  _clickTrashListBtn(event) {
    const target = event.target;

    if (target.classList.value.includes("btn-delete")) {
      const idBtnDel = target.getAttribute("data-id");

      this._selectDelBtn(idBtnDel);
    }
  }

  _clear() {
    this.container.innerHTML = "";
  }

  render(data) {
    this.data = data;
    this._clear();

    this.data.forEach((item) => {
      const template = `
        <div class="list-item p-3" data-id="${item.id}">
          <h5>${item.name}</h5>
          <small>${item.date} </small>
          <button class='btn btn-danger btn-delete w-100' data-id="${item.id}">удалить</button>
          
        </div>
        
      `;

      this.container.innerHTML = this.container.innerHTML + template;
    });

    if (this.activeItemId) {
      this._selectListItem(this.activeItemId);
    }

    if (this.deleteItemId) {
      this._selectDelBtn(this.activeItemId);
    }
  }
}
