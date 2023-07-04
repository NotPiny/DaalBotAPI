const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const fs = require('fs');
const https = require('https');
const client = require('./client.js');

app.use(cors());

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

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/api.daalbot.xyz/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.daalbot.xyz/fullchain.pem')
}, app).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

client.login(process.env.TOKEN);