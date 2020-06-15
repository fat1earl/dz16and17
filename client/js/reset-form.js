// Скрытые поля не сбрасывают значение при вызове form.reset(),
// делаем очистку формы в отдельной функции
export function resetForm(form) {
  form.reset();

  // Найдём все скрытые поля в форме и сбросим их значение
  [...form.querySelectorAll('[type="hidden"]')].forEach((input) => {
    input.value = '';
  });
}
