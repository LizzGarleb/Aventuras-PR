if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const bodyParser = require('body-parser');
const hostname = 'localhost';
const port = 5000;
const app = express();
const authRoutes = require('./routes/auth');
const activitysRoutes = require('./routes/activitys');
const restaurantRoutes = require('./routes/restaurant');
const stayRoutes = require('./routes/stay');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.use(authRoutes);
app.use(activitysRoutes);
app.use(restaurantRoutes);
app.use(stayRoutes);

app.use(express.static('public'));

app.listen(port, hostname, () => {
  console.log(`Server started at http://${hostname}:${port}`);
});

module.exports = app;