const express = require('express');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

function generateRandomString() {
  let randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
}

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.ca'
};

const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
}

// urls = key
app.get('/urls', (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// GET route to show the form, then renders(server side) page
app.get('/urls/new', (req, res) => {
  const templateVars = { username: req.cookies["username"]}
  res.render('urls_new', templateVars);
});

// displays a single URL and its shortened form
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

// redirect shortURL to longURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// registration page
app.get('/register', (req, res) => {
  const templateVars = { username: req.cookies["username"]}
  res.render('urls_register', templateVars);
})

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });

// Post route, form submission - creates a new shortURL, add to database, redirects to /urls/:shortURL
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  // console.log(req.body); // Log the Post request body to the console
  // shortURL-longURL key-value pair saved to urlDatabase
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// const users = {
//   'userRandomID': {
//     id: 'userRandomID',
//     email: 'user@example.com',
//     password: 'purple-monkey-dinosaur'
//   },
//   'user2RandomID': {
//     id: 'user2RandomID',
//     email: 'user2@example.com',
//     password: 'dishwasher-funk'
//   }
// }

// register
app.post('/register', (req, res) => {  
  const userId = generateRandomString();
  res.cookie('user_id', userId);
  users[userId] = {
    id: userId,
    email: req.body.email,
    passowrd: req.body.passowrd
  }
// console.log(users);
  res.redirect('/urls');
})

// login
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

// logout
app.post('/logout', (req, res) => {
  res.clearCookie('username', req.body.username)
  res.redirect('/urls');
});

// update
app.post('/urls/:shortURL/update', (req, res) => {
  // console.log(req.body.updatedLongURL)
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.updatedLongURL;
  res.redirect(`/urls`);
});

// delete
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});