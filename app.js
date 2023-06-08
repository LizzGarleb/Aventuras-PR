require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const hostname = 'localhost';
const port = 3000;
const app = express();
const authRoutes = require('./routes/auth');
const activitysRoutes = require('./routes/activitys');
const restaurantRoutes = require('./routes/restaurant');
const stayRoutes = require('./routes/stay');
const subscribeRoutes = require('./routes/subscribe');
const session = require('express-session');
const session_secret = process.env.SESSION_SECRET;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // Dynamic files will be in views folder, powered by EJS engine

app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: false,
})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(authRoutes);
app.use(activitysRoutes);
app.use(restaurantRoutes);
app.use(stayRoutes);
app.use(subscribeRoutes);
app.use(express.static('public'));

// Local host
app.listen(port, hostname, () => {
  console.log(`Server started at http://${hostname}:${port}`);
});

module.exports = app;