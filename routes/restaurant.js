const express = require('express');
const router = express.Router();
const pool = require('../config/db_connection');

router.get('/restaurant', (req, res) => {
    const query = 'SELECT * FROM restaurants';
    pool.query(query, (error, result) => {
        if (error) {
            console.error('Error querying data:', error);
            res.status(500).send('Error retrieving data');
        } else {
            res.render('cards', { data: result });
        }
    });
});

router.get('/restaurant/mapdata', (req, res) => {
    const query = 'SELECT * FROM restaurants';
    pool.query(query, (error, result) => {
      if (error) {
        console.error('Error querying data:', error);
        res.status(500).send('Error retrieving data');
      } else {
        res.json(result);
      }
    });
  });

  router.get('/restaurant/map', (req, res) => {
    res.render('map', {dataType: 'restaurant'});
  });

module.exports = router;