const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


// Port
const port = 3000;

// Init App
const app = express();


// Init MongoClient
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/todosapp';

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Connect to mongodb
MongoClient.connect(url, (err, database) => {
    console.log('MongoDB Connected...');

    if (err) {
        throw err;
    }

    db = database;
    Todos = db.collection('todos');

    // Run Server
    app.listen(port, () => {
        console.log('Server running on port ' + port);
    });

});

app.get('/', (req, res, next) => {
    
    Todos.find({}).toArray((err, todos) => {
        if (err) {
            return console.log(err);
        }

        console.log(todos);
        res.render('index', {
            'todos': todos
        });
    });
});

// Edit Todo

app.get('/todo/edit/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)}
    Todos.find(query).next((err, todo) => {
        if (err) {
            return console.log(err);
        }

        res.render('edit', {
            'todo': todo
        });
    });
});

app.post('/todo/add', (req, res, next) => {
  // Create todo
  const todo = {
    text: req.body.text,
    body: req.body.body
  }

  // Insert todo
  Todos.insert(todo, (err, result) => {
    if(err){
      return console.log(err);
    }
    console.log('Todo Added...');
    res.redirect('/');
  });
});


app.post('/todo/edit/:id', (req, res, next) => {
     const query = {_id: ObjectID(req.params.id)}
 
 // Create todo
  const todo = {
    text: req.body.text,
    body: req.body.body
  }

  // Upload todo
  Todos.updateOne(query, {$set:todo}, (err, result) => {
    if(err){
      return console.log(err);
    }
    console.log('Todo Updated...');
    res.redirect('/');
  });
});

app.delete('/todo/delete/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)}
  Todos.deleteOne(query, (err, response) => {
    if(err){
      return console.log(err);
    }
    console.log('Todo Removed');
    res.send(200);
  });
});