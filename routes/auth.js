const express = require('express');
const router = express.Router();
const pool = require('../db_connection');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

router.use(express.urlencoded({ extended: false }));
router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs');
});

router.get('/login', checkAuthenticated, (req, res) => {
  res.render('index.ejs')
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login', 
  failureFlash: true
}))

router.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.Contrasena, 10);
    const { Nombre, Apellido, Email } = req.body;
    const query = 'INSERT INTO users (name, last_name, email, password) VALUES (?, ?, ?, ?)';
    
    pool.query(query, [Nombre, Apellido, Email, hashedPassword], (error, result) => {
      if (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error saving data');
      } else {
        res.status(200).send('Registration successful!');
      }
    });
  } catch {
    res.redirect('/signup')
  }
});

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return res.redirect('/')
  }
  next()
}

module.exports = router