// /get/analytics/data?guild=123&channel=123?user=123
const express = require('express');
const fs = require('fs');
const path = require('path');
const client = require('../../../client.js');
const { PermissionFlagsBits } = require('discord.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    // Data from image url
    const guild = req.query.guild;
    const channel = req.query.channel;
    const user = req.query.user;

    const currentJSON = JSON.parse(fs.readFileSync(path.resolve('./data/analytics.json'), 'utf-8'));

    // Check if the guild exists in the json
    if (!currentJSON[guild]) return res.status(404).send('Guild Not Found');
    if (!currentJSON[guild][channel]) return res.status(404).send('Channel Not Found');

    // Check if the user has permission
    const allowed = client.guilds.cache.get(guild).members.cache.get(user).permissions.has(PermissionFlagsBits.ManageChannels);

    if (allowed) {
        res.json(currentJSON[guild][channel]);
    } else {
        res.status(401).send('Unauthorized');
    }
}