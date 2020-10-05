const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const PORT = 8080;

const { generateRandomString, verifyEmail, verifyPassword, urlsForUser } = require('./helpers');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: [ '9671111711aefasdv44c4cfcfr5', 'sfggfdgrg43534gdfd987678875456' ],
}));

// Users & URL database

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "abc34d" },
  s34edr: { longURL: "https://www.yahoo.ca", userID: "f43faf" }
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
};

// Homepage to urls if logged in otherwise to login page
app.get('/', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(urlDatabase, req.session.user_id)
  };
  if (templateVars.user) {
    res.render('urls', templateVars);
  } else
    res.redirect('/login');
});

// Log in account page
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('urls_login', templateVars);
});

// Register account page
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('urls_register', templateVars);
});

// URLs page previewing user created URLs
app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(urlDatabase, req.session.user_id)
  };
  if (templateVars.user) {
    res.render('urls_index', templateVars);
  } else
    res.redirect('/login');
});

// Create a new URL page to generate a short URL
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlDatabase
  };
  if (templateVars.user) {
    res.render('urls_new', templateVars);
  } else
    res.redirect('/login');
});

// Link to long URL when short URL link is clicked
app.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404);
    return res.send('404 Page Not Found');
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    res.render("urls_show", templateVars);
  } else {
    res.send("Permission Denied");
  }
});

// Login page for registered users
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  let userPassword = verifyPassword(users, email, password);
  if (userPassword) {
    req.session.user_id = userPassword.id;
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send('Email and password is not valid');
  }
});

// Registration - Create an account
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  let user = verifyEmail(users, email);
  if ((!email) || (!password)) {
    res.status(400);
    res.send('Please provide a valid email and password');
  } else if (user) {
    res.status(400);
    res.send('Email already exists.');
  } else {
    const userId = generateRandomString();
    users[userId] = {
      id: userId,
      email: req.body.email,
      password: bcrypt.hashSync(password, 10)
    };
    req.session.user_id = userId;
    res.redirect('/urls');
  }
});

// Logout of account
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/login');
});

// Generates a new short URL
app.post('/urls', (req, res) => {
  if (req.session.user_id) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect('/login');
  }
});

// Update URL page
app.post('/urls/:shortURL/update', (req, res) => {
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = {
    longURL: req.body.updatedLongURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls`);
});

// Option to delete URLs
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});