const express = require('express');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

const generateRandomString = function() {
  let randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
};


// Verify email
const verifyEmail = function(userDatabase, email) {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user];
    }
  }
  return false;
};

// Verify password
const verifyPassword = function(userDatabase, email, password) {
  const userFound = verifyEmail(userDatabase, email);
  if (userFound && userFound.password === password) {
    return userFound;
  } 
  return false;
};



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
};

// Urls = key
app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

// GET route to show the form, then renders(server side) page
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render('urls_new', templateVars);
});

// Displays a single URL and its shortened form
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
});

// Redirect shortURL to longURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Registration page
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render('urls_register', templateVars);
});

// Login page
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render('urls_login', templateVars);
});

// Post route, form submission - creates a new shortURL, add to database, redirects to /urls/:shortURL
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  // console.log(req.body); // Log the Post request body to the console
  // shortURL-longURL key-value pair saved to urlDatabase
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
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
      password: req.body.password
    };
    res.cookie('user_id', userId);
    console.log(users[userId].email)
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
  console.log('^^^' + JSON.stringify(userPassword))

  if (userPassword) {
    res.cookie('user_id', userPassword.id);
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send('Email and password is not valid')
  }
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// Update
app.post('/urls/:shortURL/update', (req, res) => {
  // console.log(req.body.updatedLongURL)
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.updatedLongURL;
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