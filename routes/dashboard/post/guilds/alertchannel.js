const express = require('express');
const client = require('../../../../client.js');
require('dotenv').config();
const axios = require('axios');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    const guild = req.query.guild;

    // IDK why its written like this but my code didnt work and insomnia did so i just copied it :D
    const options = {
        method: 'POST',
        url: 'https://bot.daalbot.xyz/post/database/create',
        headers: {
            bot: 'Discord',
            path: `/config/${guild}/channels/alerts.id`,
            data: req.query.channel,
            type: 'file',
            authorization: process.env.BotCommunicationKey
        }
    };
      
    axios.request(options).then(function (response) {
        res.send('OK')
    }).catch(function (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
}