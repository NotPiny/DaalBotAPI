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
        const REDIRECT_URI = 'https://396e-2a09-bac5-3784-ed2-00-17a-44.ngrok-free.app/get/auth/callback';

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

                // Encrypt the code and save it to a file
                const key = crypto.randomBytes(32);
                const iv = crypto.randomBytes(16);
                const cipher = createCipheriv('aes-256', key, iv);

                const encryptedCode = cipher.update(loopBackCode, 'utf-8', 'hex')
                    + cipher.final('hex');

                fs.appendFileSync(path.resolve(`./auth/${userID}.code`), encryptedCode);

                const buffer = Buffer.from(`${key.toString('hex')}:${iv.toString('hex')}:${loopBackCode}`);

                const authBase64 = buffer.toString('base64');

                res.set('X-DaalBot-Auth', authBase64);

                res.redirect(302, 'https://daalbot.xyz/transfer/api/callback');
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send(error);
            })
    } else {
        res.redirect(`https://api.daalbot.xyz/get/users/login`)
    }
}