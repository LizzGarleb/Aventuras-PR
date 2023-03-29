const express = require('express');
const app = express();
const pool = require('./db_connection');

// Set EJS as the templating engine
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Route to display the card with dynamic content
app.get('/card', (req, res) => {
  // Fetch the data from the database using a query
  const query = 'SELECT * FROM activitys WHERE id = 2';
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error querying data:', error);
      res.status(500).send('Error retrieving data');
    } else {
      // Pass the data to the template engine as variables
      res.render('card', { data: result[0] });
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
