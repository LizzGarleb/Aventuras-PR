const express = require('express');
const router = express.Router();
const pool = require('../db_connection');

router.get('/cards', (req, res) => {
    // Fetch all data from the database using a query
    const query = 'SELECT * FROM activitys';
    pool.query(query, (error, result) => {
        if (error) {
            console.error('Error querying data:', error);
            res.status(500).send('Error retrieving data');
        } else {
            // Pass the data to the template engine as variables
            res.render('cards', { data: result });
        }
    });
});

module.exports = router;