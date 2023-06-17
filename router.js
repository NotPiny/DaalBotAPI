const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/get/:category/:item', (req, res) => {
  console.log(`GET ${req.params.category}/${req.params.item} (${req.headers['user-agent']})`);
  let category = req.params.category;
  let item = req.params.item;
  
  try {
    const route = require(`./routes/get/${category}/${item}.js`);
    route(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/post/:category/:item', (req, res) => {
  console.log(`POST ${req.params.category}/${req.params.item} (${req.headers['user-agent']})`);
  const category = req.params.category;
  const item = req.params.item;
  try {
    const route = require(`./routes/post/${category}/${item}.js`);
    route(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
