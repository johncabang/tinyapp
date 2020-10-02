const express = require('express');
const app = express();
const PORT = 8080;
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

const { generateRandomString, verifyEmail, verifyPassword, urlsForUser } = require('./helpers');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: [ '9671111711aefasdv44c4cfcfr5', 'sfggfdgrg43534gdfd987678875456' ],
}));



// urlsForUser(urlDatabase, 'abcd')

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "abc34d" },
  s34edr: { longURL: "https://www.yahoo.ca", userID: "f43faf" }

};

const users = {
  'userRandomID': {
    id: 'aJ48lW',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
};

// Urls = key
app.get('/urls', (req, res) => {
  // console.log(urlDatabase['b6UTxQ'].longURL);
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(urlDatabase, req.session.user_id)
  };
  res.render('urls_index', templateVars);
});

// GET route to show the form, then renders(server side) page
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    ursl: urlDatabase
    // urls: urlsForUser(urlDatabase, req.session.user_id)
  };
  if (templateVars.user) {
    res.render('urls_new', templateVars);
  } else
    res.redirect('/login');
});

// Displays a single URL and its shortened form
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render('urls_show', templateVars);
});

// Redirect shortURL to longURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].long;
  res.redirect(longURL);
});

// Registration page
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('urls_register', templateVars);
});

// Login page
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('urls_login', templateVars);
});

// Post route, form submission - creates a new shortURL, add to database, redirects to /urls/:shortURL
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

// Registration page
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
    console.log(users[userId].email);
    console.log(users[userId]);
    res.redirect('/urls');
  }
});

// Login page
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // let user = verifyEmail(users, email);
  let userPassword = verifyPassword(users, email, password);
  // console.log('***' + user);
  console.log('^^^' + JSON.stringify(userPassword));

  if (userPassword) {
    req.session.user_id = userPassword.id;
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send('Email and password is not valid');
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
});

// Update
app.post('/urls/:shortURL/update', (req, res) => {
  // console.log(req.body.updatedLongURL)
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = {
    longURL: urlDatabase[req.params.shortURL],
    userID: req.session.user_id
  };
  console.log('***    ' + urlDatabase[req.params.shortURL]);
  res.redirect(`/urls`);
});

// Delete
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});