// /dashboard/analytics/disable?guild=123
const express = require('express');
const fs = require('fs');
const path = require('path');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    // Data from data url
    const guild = req.query.guild;

    const currentJSON = JSON.parse(fs.readFileSync(path.resolve('./data/analytics.json'), 'utf-8')); // This happens less often and requires auth so a sync read is fine

    // Check if the guild exists in the json
    if (!currentJSON[guild]) return res.status(404).send('Guild Not Found');

    if (!currentJSON[guild].enabled) return res.status(404).send('Analytics Not Enabled');

    currentJSON[guild].enabled = false;

    fs.writeFileSync(path.resolve('./data/analytics.json'), JSON.stringify(currentJSON, null, 4));

    res.json({ success: true });
}