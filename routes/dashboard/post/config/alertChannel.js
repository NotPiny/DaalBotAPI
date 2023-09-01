const express = require('express');
const axios = require('axios');
require('dotenv').config();
const client = require('../../../../client.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = async(req, res) => {
    const guild = req.query.guild;

    try {
        const channel = client.guilds.cache.get(guild).channels.cache.get(req.query.channel);

        // Should never happen ...unless i mess up the frontend and send undefined or something
        if (!channel) return res.status(404).send('Channel not found');

        const data = await axios.post(`https://bot.daalbot.xyz/post/database/create`, {
            headers: {
                'Authorization': process.env.BotCommunicationKey,
                'bot': 'Discord',
                'path': `/config/${guild}/channels/alerts.id`,
                'data': channel.id,
                'type': 'file'
            }
        })

        res.status(200).send(`${data.data}`);
    } catch (error) {
        res.status(500).send('Internal Server Error');
        console.error(error);
    }
}