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
            res.render('cards', { data: result, routePrefix: '/restaurant' });
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

router.get('/restaurant/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM restaurants WHERE id = ?';
  pool.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error querying data:', error);
      res.status(500).send('Error querying data');
    } else {
      const information = result[0];
      const businessHours = JSON.parse(information.business_hours);
      res.render('info', { information, businessHours });
    }
  });
});

module.exports = router;