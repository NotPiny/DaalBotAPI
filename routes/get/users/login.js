const express = require('express');
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

module.exports = (req, res) => {
    if (req.query.code) {
        res.status(200).send('pong');
    } else {
        // res.redirect('https://discord.com/api/oauth2/authorize?client_id=1016086353085222993&redirect_uri=https%3A%2F%2Fapi.daalbot.xyz%2Fget%2Fauth%2Fcallback&response_type=code&scope=guilds%20identify')

        res.redirect('https://discord.com/api/oauth2/authorize?client_id=1016086353085222993&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fget%2Fauth%2Fcallback&response_type=code&scope=identify%20guilds')
    }
}