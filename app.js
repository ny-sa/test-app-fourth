const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://nysa:12345@cluster0-cz3ei.mongodb.net/todolistDB', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

const entrySchema = {
  text: String
};

const Entry = mongoose.model('Entry', entrySchema);

const entry1 = new Entry({
  text: 'Welcome to your todolist!'
});

const entry2 = new Entry({
  text: 'Hit the + button to add a new entry.'
});

const entry3 = new Entry({
  text: '<-- Hit this to delete an entry.'
})

const entry4 = new Entry({
  text: 'Entries and custom lists no longer reset.'
})

const defaultItems = [entry1, entry2, entry3, entry4];

const listSchema = {
  name: String,
  entries: [entrySchema]
};

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {
  let day = date.getDate();
  Entry.find({}, (err, entries) => {
    if (!err){
      if (entries.length === 0) Entry.insertMany(defaultItems, (err) => {
        if (!err) res.redirect('/');
      });
      else res.render('list', {listTitle: day, newEntries: entries});
    }
  });
});

app.post('/', (req, res) => {
  const listName = req.body.list;
  const newEntry = new Entry({
    text: req.body.entry
  })
  if (listName === date.getDate()) {
    newEntry.save();
    res.redirect('/');
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      if (!err) {
        foundList.entries.push(newEntry);
        foundList.save();
        res.redirect(`/${listName}`);
      }
    })
  }
});

app.get('/:customListName', (req, res) => {
  const listName = _.capitalize(req.params.customListName);
  List.findOne({name: listName}, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          entries: defaultItems   
        })
        list.save();
        res.redirect(`/${listName}`);
      } else {
        res.render('list', {listTitle: foundList.name, newEntries: foundList.entries});
      }
    } 
  });
});

app.get('/about', (req, res) => {
  res.render('about');
})

app.post('/delete', (req, res) => {
  const checkedID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === date.getDate()) {
    Entry.findByIdAndRemove(checkedID, (err) => {
      if (!err) console.log('Successfully deleted entry');
    });
    res.redirect('/');
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {entries: {_id: checkedID}}}, (err, foundList) => {
      if (!err) {
        console.log('Successfully deleted entry');
        res.redirect(`/${listName}`);
      }
    });
  }
});

app.post('/search', (req, res) => {
  res.redirect(`/${req.body.search}`);
})

app.listen(process.env.PORT || 2020, () => {
  console.log('Server started on port 2020.');
});

