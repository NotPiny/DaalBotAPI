const express = require('express'); // Type declaration for express
const axios = require('axios'); // For interacting with internal API
require('dotenv').config(); // Tokens

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

module.exports = async (req, res) => {
    const guild = req.query.guild;
    
    if (!guild) return res.status(400).json({ error: 'Missing guild query' });

    const response = await axios.get(`https://bot.daalbot.xyz/get/database/readDir`, {
        headers: {
            'Authorization': process.env.BotCommunicationKey,
            'bot': 'Discord',
            'path': `/xp/${guild}/rewards`
        },
    })

    const data = response.data;

    res.status(200).send(data); // Send the data back to the client
}