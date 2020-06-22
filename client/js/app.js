import { Form } from "./form";
import { List } from "./list";
import { resetForm } from "./reset-form";
import "./regexp";

const formNode = document.querySelector("#form");
new Form(formNode);

// ---------------------------------------------------

const createBtnNode = document.querySelector("#createBtn");
createBtnNode.addEventListener("click", () => {
  formNode.setAttribute("data-method", "POST");
  resetForm(formNode);
  $("#formModal").modal("show");
});

const listNode = document.querySelector("#list");
const list = new List(listNode);

fetch("/api/data", { method: "GET" })
  .then((response) => response.json())
  .then((data) => list.render(data.list))
  .catch((error) => console.error(error));
