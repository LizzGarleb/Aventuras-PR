const express = require('express');
const router = express.Router();
const pool = require('../config/db_connection');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const initializePassport = require('../config/passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

async function sendVerificationEmail(email, verificationToken) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'puertoricoaventuras@gmail.com',
      pass: 'nierbvcxlciyjfew'
    },
  });

  const mailOptions = {
    from: 'puertoricoaventuras@gmail.com',
    to: email,
    subject: 'Email Verification - Aventuras PR',
    html: `
        <h3>Welcome to Aventuras PR!</h3>
        <p>To verify your email address, please click the link below:</p>
        <a href="${process.env.APP_URL}/verify-email?token=${verificationToken}">Verify Email Address</a>
        `,
  }

  try {
    await transport.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

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

router.get('/login', (req, res) => {
  res.render('login');
});

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

router.get('/signup', (req, res) => {
  res.render('login');
});

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.Contrasena, 10);
    const { Nombre, Apellido, Email } = req.body;
    const verificationToken = crypto.randomBytes(64).toString('hex');
    const query = 'INSERT INTO users (name, last_name, email, password) VALUES (?, ?, ?, ?)';
    
    pool.query(query, [Nombre, Apellido, Email, hashedPassword], async (error, result) => {
      if (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error saving data');
      } else {
        await sendVerificationEmail(Email, verificationToken);
        res.status(200).send('Registration successful! Please check your email for verification.');
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

router.get('/verify-email', async (req, res) => {
  const verificationToken = req.query.token;
  
  const query = 'UPDATE users SET verified = 1 WHERE verification_token = ?';
  pool.query(query, [verificationToken], (error, result) => {
    if (error) {
      console.error('Error verifying email:', error);
      res.status(500).send('Error verifying email');
    } else {
      if (result.affectedRows === 1) {
        res.status(200).send('Email verification successful! You can now log in.');
      } else {
        res.status(400).send('Invalid verification token');
      }
    }
  });
});


module.exports = router