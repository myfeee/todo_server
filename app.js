const express = require('express');
const fs = require('fs');

let todoList = [];

const app = express();

let state = false;

//! Создание дела на сервере методом GET
app.get('/', (req, res) => {
  res.setHeader('Content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  let base = fs.readFileSync('base.json', 'utf8');
  base = JSON.parse(base);
  for (let i = 0; i < base.length; i++) todoList[i] = base[i];

  let flag = false;
  const params = {};
  let paramsKey = '';
  let paramsValue = '';

  if (req.url.length > 1) {
    req.url = decodeURI(req.url);
  }

  //! парсим url до нужного вида (объекта)
  for (let i = 0; i < req.url.length; i++) {
    if (req.url[i] == '?' && !flag) {
      flag = true;
    } else if (flag) {
      while (req.url[i] != '=') {
        paramsKey += req.url[i];
        i++;
        if (i === req.url.length) break;
      }
      i++;
      while (req.url[i] != '&') {
        paramsValue += req.url[i];
        i++;
        if (i === req.url.length) break;
      }
      params[paramsKey] = paramsValue;
      paramsKey = paramsValue = '';
    }
  }
  if (state) todoList = JSON.parse(todoList);
  if (req.url.length > 1) todoList.push(params);

  todoList = JSON.stringify(todoList);
  fs.writeFile('base.json', todoList, (error) => {});

  state = true;
  res.end(todoList);
});

//! удаляем из базы дело
app.get('/delete/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  let index = '';
  for (let i = 8; i < req.url.length; i++) {
    index += req.url[i];
  }

  todoList = JSON.parse(todoList);
  todoList.splice(index, 1);
  todoList = JSON.stringify(todoList);

  fs.writeFile('base.json', todoList, (error) => {});

  res.end(todoList);
});

app.listen(3000);
