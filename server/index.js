const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const apiRout = require('./api');

module.exports = (url) => {
  const app = express();
  const baseUrl = path.join(__dirname, '../');

  app.use(express.static(path.join(baseUrl, 'public')));
  app.use(bodyParser.json());
  app.use('/api/data', apiRout);

  app.listen(url, () => {
    console.log('Project', 'started on', url);
  });

  app.get('*', (req, res) => {
    res.send(fs.readFileSync(`${baseUrl}/public/index.html`, 'utf8'));
  });
};
