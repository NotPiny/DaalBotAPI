const express = require('express');
const axios = require('axios');
require('dotenv').config();
const crypto = require('crypto');
const { createCipheriv, createDecipheriv } = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = (req, res) => {
    if (req.query.code) {
        const code = req.query.code;

        const API_ENDPOINT = 'https://discord.com/api/v10';
        const CLIENT_ID = process.env.CLIENT_ID;
        const CLIENT_SECRET = process.env.CLIENT_SECRET;
        const REDIRECT_URI = 'https://api.daalbot.xyz/get/auth/callback';

        // Exchange the authorization code for an access token
        const data = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        axios.post(`${API_ENDPOINT}/oauth2/token`, new URLSearchParams(data), {
                headers: headers, 
            })
            .then(async(response) => {
                const accessTokenResponse = response.data;
                const accessToken = accessTokenResponse.access_token;

                const userRequest = await axios.get(`${API_ENDPOINT}/users/@me`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                const userResponse = userRequest.data;

                const guildRequest = await axios.get(`${API_ENDPOINT}/users/@me/guilds`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                const guildResponse = guildRequest.data;

                const userInfo = {
                    id: userResponse.id,
                    username: userResponse.username,
                    avatar: userResponse.avatar,
                    guilds: guildResponse,
                    raw: {
                        user: userResponse,
                    }
                }

                const loopBackCode = crypto.randomBytes(64).toString('hex');
                const userID = userInfo.id;

                const hashedCode = crypto.createHash('sha256').update(loopBackCode).digest('hex');

                fs.appendFileSync(path.resolve(`./auth/${userID}.code`), hashedCode);
                fs.appendFileSync(path.resolve(`./auth/${userID}.data`), JSON.stringify(userInfo, null, 4));

                // const buffer = Buffer.from(`${key.toString('hex')}:${iv.toString('hex')}:${loopBackCode}`);
                const buffer = Buffer.from(loopBackCode)

                const authBase64 = buffer.toString('base64');

                res.send(`<script>window.location.href = 'https://daalbot.xyz/transfer/api/callback?auth=${authBase64}&id=${userID}'</script>`);
            })
            .catch((error) => {
                console.error(error);
                res.send('An error occurred while trying to authenticate you.')
            })
    } else {
        res.redirect(`https://api.daalbot.xyz/get/users/login`)
    }
}