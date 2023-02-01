const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
    ]
});
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.daalbot.xyz/privkey.pem')
const cert = fs.readFileSync('/etc/letsencrypt/live/api.daalbot.xyz/fullchain.pem')

https.createServer({
    key: privateKey,
    cert: cert
}, app).listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.use(cors())

app.get('/', (RQ, RS) => {
	RS.sendFile('./Client/about.html', { root: '.' });
})

app.get('/get/test/ping', (req, res) => {
    res.send('Pong!')
})

app.get('/get/general/serverAmount', (req, res) => {
    res.send(`${client.guilds.cache.size}`)
})

app.post('/post/users/create', (req, res) => {
    const user = req.query.id;
    const { password } = req.headers;

    if (!user || !password) {
        res.send('Missing parameters')
    }

    if (fs.existsSync(`./data/users/${user}.json`)) {
        console.log('User already exists')
        res.send({
            error: 'User already exists',
            code: 400
        })
    } else {
        const userSecret = crypto.randomBytes(64).toString('hex');
        const userSecretHash = crypto.createHash('sha256').update(userSecret).digest('hex');
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        fs.appendFileSync(`./data/users/${user}.json`, JSON.stringify({
            password: passwordHash,
            secret: userSecretHash
        }));

        res.send({
            secret: userSecret,
            code: 200
        })
    }
})

client.login(process.env.DJSTOKEN);