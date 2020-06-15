var express = require('express');
var data = require('../data');
var router = express.Router();
var fs = require('fs');

router.get('/', function (req, res, next) {
  res.json(data);
});

router.post('/', function (req, res, next) {
  var newItem = req.body;

  var arr = [...data.list];
  arr.push(newItem);
  data.list = arr;
  fs.writeFile('./data.json', JSON.stringify(data), function (err) {
    if (err) throw err;
    res.send(JSON.stringify(data));
  });
});

router.put('/:id', function (req, res, next) {
  var id = req.params.id;
  var updatedItem = req.body;

  var arr = [...data.list];
  var newArr = arr.map((item) => {
    if (item.id == id) {
      return updatedItem;
    }

    return item;
  });
  data.list = newArr;

  fs.writeFile('./data.json', JSON.stringify(data), function (err) {
    if (err) throw err;
    res.send(JSON.stringify(data));
  });
});

module.exports = router;
