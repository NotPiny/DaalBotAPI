const express = require('express'); // Type declaration for express
const axios = require('axios'); // For interacting with internal API
require('dotenv').config(); // Tokens

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

module.exports = async (req, res) => {
    const guild = req.query.guild;
    const level = req.query.level;

    const ReqURL = `https://bot.daalbot.xyz/delete/database/remove`;
    const ReqOptions = {
        headers: {
            'Authorization': process.env.BotCommunicationKey,
            'bot': 'Discord',
            'path': `/xp/${guild}/rewards/${level}.reward`,
            'type': 'file'
        }
    }

    const response = await axios.delete(ReqURL, ReqOptions);
    const status = response.status; // Data is always the same

    if (status === 200) {
        res.status(200).send('Success')
    } else {
        res.status(500).send('Internal API Error')
    }
}