const express = require('express');
const router = express.Router();
const pool = require('../db_connection');

router.post('/signup', (req, res) => {
    const { Nombre, Apellido, Email, Contrasena } = req.body;

    const query = 'INSERT INTO users (name, last_name, email, password) VALUES (?, ?, ?, ?)';
    
    pool.query(query, [Nombre, Apellido, Email, Contrasena], (error, result) => {
      if (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error saving data');
      } else {
        res.status(200).send('Registration successful!');
      }
    });
});

router.post('/login', (req, res) => {
    const { Email, Contrasena } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    
    pool.query(query, [Email, Contrasena], (error, result) => {
      if (error) {
        console.error('Error querying data:', error);
        res.status(500).send('Error retrieving data');
      } else {
        if (result.length === 1) {
          res.status(200).send('Log in successful!'); // Redirect to dashboard if login is successful
        } else {
          res.status(401).send('Invalid email or password'); // Return an error message if login is unsuccessful
        }
      }
    });
});

module.exports = router;