// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
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

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // Dynamic files will be in views folder, powered by EJS engine

// Where the app is gonna moved around
app.use(authRoutes);
app.use(activitysRoutes);
app.use(restaurantRoutes);
app.use(stayRoutes);
app.use(subscribeRoutes);

app.use(session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static('public')); // Any static file will be in public folder

// Local host 
app.listen(port, hostname, () => {
  console.log(`Server started at http://${hostname}:${port}`);
});

module.exports = app;