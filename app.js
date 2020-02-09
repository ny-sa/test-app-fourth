const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();

const entries = [],
  workEntries = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
  let day = date.getDate();
  res.render('list', {listTitle: day, newEntries: entries});
});

app.post('/', (req, res) => {
  console.log(req.body.list);
  if (req.body.list === 'Work') {
    workEntries.push(req.body.entry);
    res.redirect('/work');
  } else {
    entries.push(req.body.entry);
    res.redirect('/');
  }
});

app.get('/work', (req, res) => {
  res.render("list", {listTitle: 'Work List', newEntries: workEntries});
}) 

app.get('/about', (req, res) => {
  res.render('about');
})

app.listen(process.env.PORT || 2020, () => {
  console.log('Server started on port 2020.');
});

