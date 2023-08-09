const express = require('express')
const axios = require('axios')
require('dotenv').config()

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = async (req, res) => {
    const guild = req.query.guild;
    const data = {
        file: req.headers.file,
        category: req.headers.category,
        subcategory: req.headers.subcategory,
    }

    const options = {
        method: 'DELETE',
        url: 'https://bot.daalbot.xyz/delete/database/remove',
        headers: {
            'Authorization': process.env.BotCommunicationKey,
            'bot': 'Discord',
            'path': `/${data.category}/${guild}/${data.subcategory}/${data.file}`,
            'type': 'file'
        }
    }

    const response = await axios.request(options);
    const status = response.status; // Data is always the same

    if (status === 200) {
        res.status(200).send('Success')
    } else {
        res.status(500).send('Internal API Error')
    }
}