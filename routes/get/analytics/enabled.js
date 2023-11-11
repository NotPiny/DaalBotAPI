const express = require('express');
const fs = require('fs');
const path = require('path');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    // Too lazy to add fancy checks for if the guild has analytics enabled or not using the data route so i made this
    const guild = req.query.guild;

    const analyticsData = JSON.parse(fs.readFileSync(path.resolve(`./data/analytics.json`)));

    if (analyticsData[guild]) return res.status(400).send({ enabled: true });

    res.json({ enabled: false });
}