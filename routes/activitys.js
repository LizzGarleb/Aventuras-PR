const express = require('express');
const router = express.Router();
const pool = require('../config/db_connection');

router.get('/activitys', (req, res) => {
  const query = 'SELECT * FROM activitys';
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error querying data:', error);
      res.status(500).send('Error retrieving data');
    } else {
      res.render('cards', { data: result, routePrefix: '/activitys' });
    }
  });
});

router.get('/activitys/mapdata', (req, res) => {
  const query = 'SELECT * FROM activitys';
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error querying data:', error);
      res.status(500).send('Error retrieving data');
    } else {
      res.json(result);
    }
  });
});

router.get('/activitys/map', (req, res) => {
  res.render('map', { dataType: 'activitys', routePrefix: '/activitys' });
});

router.get('/activitys/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM activitys WHERE id = ?';
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