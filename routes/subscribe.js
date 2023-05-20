const express = require('express');
const router = express.Router();
const pool = require('../config/db_connection');

// Subscription form at the footer
router.post('/subscribe', (req, res) => {
    const email = req.body.email
    const query = 'INSERT INTO newsletter (email) VALUES (?)';

    pool.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error saving data');
        } else {
            res.send(`
                <script>
                    alert("Subscribed with email: ${email}");
                    window.location.href="/";
                </script>
            `);
        }
    });
});

module.exports = router