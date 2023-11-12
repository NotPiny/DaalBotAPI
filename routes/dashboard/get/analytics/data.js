// /dashboard/analytics/data?guild=123&channel=123
const express = require('express');
const fs = require('fs');
const path = require('path');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    // Data from data url
    const guild = req.query.guild; // Required
    const channel = req.query.channel; // Optional

    const currentJSON = JSON.parse(fs.readFileSync(path.resolve('./data/analytics.json'), 'utf-8'));

    // Check if the guild exists in the json
    if (!currentJSON[guild]) return res.status(404).send('Guild Not Found');
    if (channel && !currentJSON[guild][channel]) return res.status(404).send('Channel Not Found');

    // Send the data
    res.json(channel ? currentJSON[guild][channel] : currentJSON[guild]);
}