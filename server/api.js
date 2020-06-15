const express = require('express');
const data = require('../data');

const router = express.Router();
const fs = require('fs');

router.get('/', (req, res, next) => {
  res.json(data);
});

router.post('/', (req, res, next) => {
  const newItem = req.body;

  const arr = [...data.list];
  arr.push(newItem);
  data.list = arr;
  fs.writeFile('./data.json', JSON.stringify(data), (err) => {
    if (err) throw err;
    res.send(JSON.stringify(data));
  });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const updatedItem = req.body;

  const arr = [...data.list];
  const newArr = arr.map((item) => {
    if (item.id == id) {
      return updatedItem;
    }

    return item;
  });
  data.list = newArr;

  fs.writeFile('./data.json', JSON.stringify(data), (err) => {
    if (err) throw err;
    res.send(JSON.stringify(data));
  });
});

module.exports = router;
