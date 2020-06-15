const path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  apiRout = require('./api'),
  fs = require('fs');

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
