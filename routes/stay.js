const express = require('express');
const router = express.Router();
const pool = require('../db_connection');

router.get('/stay', (req, res) => {
    const query = 'SELECT * FROM stay';
    pool.query(query, (error, result) => {
        if (error) {
            console.error('Error querying data:', error);
            res.status(500).send('Error retrieving data');
        } else {
            res.render('cards', { data: result });
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

module.exports = router;