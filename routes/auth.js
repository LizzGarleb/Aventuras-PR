const express = require('express');
const router = express.Router();
const pool = require('../config/db_connection');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const comp_pass = process.env.COMPANY_PASS;
const comp_email = process.env.COMPANY_EMAIL;


const initializePassport = require('../config/passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// Connects to AventurasPR email, to send the verification to user
async function sendVerificationEmail(email, verificationToken) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: comp_email,
      pass: comp_pass
    },
  });

  // Email format that will be sent
  const mailOptions = {
    from: comp_email,
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
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

// Log In functionality
router.get('/login', (req, res) => {
  res.render('login'); // Send the user to the login page
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
          req.session.user = {
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            profileImage: user.profileImage // Add this field in your 'users' table
          }
          res.redirect('dashboard');
        } else {
          res.status(401).send('Invalid email or password'); // Return an error message if login is unsuccessful
        }
      } else {
        res.status(401).send('Invalid email or password'); // Return an error message if login is unsuccessful
      }
    }
  });
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.render('dashboard', { user: req.session.user });
  }
});


// Sign Up functionality
router.get('/signup', (req, res) => {
  res.render('login'); // Send the user to the login page
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
        res.send(`
                <script>
                    alert("Registration sucessfull! Please check your email for verification.");
                    window.location.href="/";
                </script>
            `)};
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});


// Save user verification token in the db & fetch email for Welcome Message
router.get('/verify-email', async (req, res) => {
  const verificationToken = req.query.token;

  const query = 'SELECT email FROM users WHERE verification_token = ?';
  pool.query(query, [verificationToken], (error, result) => {
    if (error) {
      console.error('Error verifying email:', error);
      res.status(500).send('Error verifying email');
    } else {
      if (result.length === 1) {
        const email = result[0].email;
        const updateQuery = 'UPDATE users SET verified = 1 WHERE verification_token = ?';
        pool.query(updateQuery, [verificationToken], (error, result) => {
          if (error) {
            console.error('Error verifying email:', error);
            res.status(500).send('Error verifying email');
          } else {
            if (result.affectedRows === 1) {
              sendWelcomeEmail(email)
                .then(() => {
                  res.status(200).send('Email verification successful! You can now log in.');
                })
                .catch((error) => {
                  console.error('Error:', error);
                  res.status(500).send('Error sending welcome email.');
                });
            } else {
              res.status(400).send('Invalid verification token');
            }
          }
        });
      } else {
        res.status(400).send('Invalid verification token');
      }
    }
  });
});


// Function that sends the Welcome email message
async function sendWelcomeEmail(userEmail) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: comp_email,
      pass: comp_pass
    },
  });

  const info = {
    from: '"Aventuras PR" puertoricoaventuras@gmail.com',
    to: userEmail,
    subject: 'Welcome to Aventuras PR',
    text: 'Welcome to Aventuras PR, we\'re excited to have you onboard!',
  }

  try {
    await transport.sendMail(info);
    console.log('Message sent successfully');
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

module.exports = router