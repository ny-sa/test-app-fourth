const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let entries = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  let today = new Date(),
    currentDay = today.getDay(),
    options = {
      weekday: "long",
      day: "numeric",
      month: "long"
    },
    day = today.toLocaleDateString("en-US", options);
  res.render('list', {dayType: day, newEntries: entries});
});

app.post('/', (req, res) => {
  entries.push(req.body.entry);
  res.redirect('/');
});

app.listen(2020, () => {
  console.log('Server started on port 2020.');
});
