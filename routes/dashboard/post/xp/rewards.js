const express = require('express')
const axios = require('axios')
require('dotenv').config()

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = async (req, res) => {
    const guild = req.query.guild;
    const data = JSON.parse(req.headers.data)

    const options = {
        method: 'POST',
        url: 'https://bot.daalbot.xyz/post/database/create',
        headers: {
          bot: 'Discord',
          path: `/xp/${guild}/rewards/${data.name}.reward`,
          data: data.value,
          type: 'file',
          authorization: process.env.BotCommunicationKey // Insomnia almost put this in the public repository :skull:
        }
      };
      
    axios.request(options).then(function (response) {
        res.status(200).send('OK')
    }).catch(function (error) {
        res.status(500).send('Internal Server Error')
    });
}