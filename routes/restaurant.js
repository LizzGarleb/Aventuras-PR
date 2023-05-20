const express = require('express');
const router = express.Router();
const pool = require('../config/db_connection');

// Shows the restaurant list version
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

// Get the restaurant data from db to render to the map
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

// Render the map version
router.get('/restaurant/map', (req, res) => {
  res.render('map', {dataType: 'restaurant', routePrefix: '/restaurant'});
});

// Open the card the user tapped
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
      const carouselImages = JSON.parse(information['carousel_images']);
      
      Array.isArray(carouselImages) && carouselImages.length > 0;

      res.render('info', { information, businessHours, carouselImages });
    }
  });
});

module.exports = router;