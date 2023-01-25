const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const axios = require('axios');
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();
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

client.login(process.env.DJSTOKEN);