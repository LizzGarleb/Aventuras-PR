const express = require('express');
const router = express.Router();
const pool = require('../config/db_connection');

// Show the list version
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

// Get the data from db to render to the map
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

// Render the map version
router.get('/stay/map', (req, res) => {
  res.render('map', {dataType: 'stay', routePrefix: '/stay'});
});

// Open the card the user tapped
router.get('/stay/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM stay WHERE id = ?';
  pool.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error querying data:', error);
      res.status(500).send('Error querying data');
    } else {
      const information = result[0];
      const businessHours = JSON.parse(information.business_hours);
      const carouselImages = JSON.parse(information['carousel_images']);

      Array.isArray(carouselImages) && carouselImages.lenght > 0;

      res.render('info', { information, businessHours, carouselImages });
    }
  });
});

module.exports = router;