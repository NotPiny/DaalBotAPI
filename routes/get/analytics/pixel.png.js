// /get/analytics/pixel.png?guild=123&channel=123
const express = require('express');
const fs = require('fs');
const path = require('path');
const tools = require('../../../tools.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = async (req, res) => {
    res.sendFile(path.resolve('./pixel.png')) // 1x1 transparent pixel :D

    // Check if the request is coming from the discord proxy
    // For some reason actual discord clients send a Mac OS firefox user agent so if it contains discordbot its the first time the image was sent and discord is grabbing the image or smth idk this worked on my other project
    if (req.headers['user-agent'].toLowerCase().includes('discordbot')) return;

    // Data from image url
    const guild = req.query.guild;
    const channel = req.query.channel;

    // Dont bother even reading the file if the guild or channel is invalid
    if (!guild) return res.status(404).send('Not found.')
    if (!channel) return res.status(404).send('Not found.')

    fs.readFile(path.resolve('./data/analytics.json'), 'utf-8', (err, data) => {
        if (err) tools.handleError(err, req);

        const currentJSON = JSON.parse(data);

        // Check if the guild exists in the json if not return so only valid channels are logged
        if (!currentJSON[guild]) return;
        if (!currentJSON[guild][channel]) return;
        if (!currentJSON[guild].enabled) return;

        // Add a entry for the channel
        currentJSON[guild][channel].push({
            time: `${Date.now()}`
        })

        // Write the new json
        fs.writeFile(path.resolve('./data/analytics.json'), JSON.stringify(currentJSON, null, 4), 'utf-8', (err) => {
            if (err) tools.handleError(err, req);
        });
    });
}