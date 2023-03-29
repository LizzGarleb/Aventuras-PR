const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db_connection'); // Import the connection pool

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.post('/signup', (req, res) => {
  const { Nombre, Apellido, Email, Contrasena } = req.body;

  const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
  
  pool.query(query, [Nombre, Apellido, Email, Contrasena], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).send('Error saving data');
    } else {
      res.status(200).redirect('/success.html');
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
