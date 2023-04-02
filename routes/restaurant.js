const express = require('express');
const router = express.Router();
const pool = require('../db_connection');

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

module.exports = router;