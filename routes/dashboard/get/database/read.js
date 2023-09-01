const express = require('express');
const axios = require('axios');
require('dotenv').config();

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
*/
module.exports = async(req, res) => {
    return res.status(501).send('Not implemented');
    const path = req.headers.path;
    const category = req.query.category;
    const guild = req.query.guild;
    const fileType = req.query.ext;

    if (!category || !guild || !fileType || !path) return res.status(400).json({ error: 'Missing data' });

    const DisallowedRegex = new RegExp(/\./g);

    if (path.match(DisallowedRegex)) return res.status(400).json({ error: 'Invalid path' });

    try {
        const data = await axios.get(`https://bot.daalbot.xyz/get/database/read`, {
            headers: {
                'Authorization': process.env.BotCommunicationKey,
                'bot': 'Discord',
                'path': `/${category}/${guild}/${path}.${fileType}`,
            }
        })

        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
        console.error(error);
    }
}