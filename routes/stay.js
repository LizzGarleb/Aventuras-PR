const express = require('express');
const router = express.Router();
const pool = require('../config/db_connection');

router.get('/stay', (req, res) => {
    const query = 'SELECT * FROM stay';
    pool.query(query, (error, result) => {
        if (error) {
            console.error('Error querying data:', error);
            res.status(500).send('Error retrieving data');
        } else {
            res.render('cards', { data: result, routePrefix: '/stay' });
        }
    });
});

router.get('/stay/mapdata', (req, res) => {
    const query = 'SELECT * FROM stay';
    pool.query(query, (error, result) => {
      if (error) {
        console.error('Error querying data:', error);
        res.status(500).send('Error retrieving data');
      } else {
        res.json(result);
      }
    });
});

router.get('/stay/map', (req, res) => {
  res.render('map', {dataType: 'stay'});
});

router.get('/stay/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM stay WHERE id = ?';
  pool.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error querying data:', error);
      res.status(500).send('Error querying data');
    } else {
      res.render('info', { data: result[0] });
    }
  });
});

module.exports = router;