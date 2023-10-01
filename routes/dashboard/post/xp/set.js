const express = require('express');
const client = require('../../../../client.js');
const axios = require('axios');
require('dotenv').config();

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = async(req, res) => {
    const guild = req.query.guild
    const user = req.query.user

    if (!user) return res.json({ error: 'Missing user query' })
    if (!req.query.xp) return res.json({ error: 'Missing xp query' })

    const options = {
        method: 'POST',
        url: 'https://bot.daalbot.xyz/post/database/create',
        headers: {
            bot: 'Discord',
            path: `/xp/${guild}/${user}.xp`,
            data: req.query.xp,
            type: 'file',
            authorization: process.env.BotCommunicationKey
        }
    };
      
    try {
        await axios.request(options)

        res.json({ success: true })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}