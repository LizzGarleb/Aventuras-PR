const express = require('express');
const router = express.Router();
const pool = require('../db_connection');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('../passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

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

router.post('/login', (req, res) => {
  const { Email, Contrasena } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  
  pool.query(query, [Email], async (error, result) => {
    if (error) {
      console.error('Error querying data:', error);
      res.status(500).send('Error retrieving data');
    } else {
      if (result.length === 1) {
        const user = result[0];
        const isPasswordMatch = await bcrypt.compare(Contrasena, user.password);
  
        if (isPasswordMatch) {
          res.status(200).send('Log in successful!'); // Redirect to dashboard if login is successful
        } else {
          res.status(401).send('Invalid email or password'); // Return an error message if login is unsuccessful
        }
      } else {
        res.status(401).send('Invalid email or password'); // Return an error message if login is unsuccessful
      }
    }
  });
  
});

router.post('/signup', async (req, res) => {
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


module.exports = router