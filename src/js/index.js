const $addButton = document.querySelector('.work-space__add');
const $todoInput = document.querySelector('.work-space__input');
const $todoList = document.querySelector('.work-space__list');
const $todoItems = document.querySelectorAll('.item');

function requestTodoList(value = '') {
  value = encodeURI(value);
  fetch(`http://localhost:3000${value ? '?value=' + value : ''}`)
    .then((data) => data.json())
    .then((result) => todoCreateList(result));
}

requestTodoList();

//! Добавление нового дела кнопкой
$addButton.addEventListener('click', () => {
  if ($todoInput.value) {
    requestTodoList($todoInput.value);

    $todoInput.value = '';
  }
});
//! Добавление нового дела клавишей Enter
$todoInput.addEventListener('keydown', (event) => {
  if (event.code == 'Enter') {
    if ($todoInput.value) {
      requestTodoList($todoInput.value);

      $todoInput.value = '';
    }
  }
});
//! Удаление дела
$todoList.addEventListener('click', (event) => {
  fetch(`http://localhost:3000/delete?${event.target.dataset.item}`)
    .then((data) => data.json())
    .then((result) => todoCreateList(result));
});

function todoCreateList(items) {
  $todoList.innerHTML = '';
  for (let i = 0; i < items.length; i++) {
    $todoList.innerHTML += `<li class='item' data-item='${i}'>${items[i].value}</li>`;
  }
}
