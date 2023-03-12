const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const DJS = require('discord.js');
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
}, app).listen(port)

app.use(cors())

app.get('/', (RQ, RS) => {
	RS.sendFile('./Client/about.html', { root: '.' });
})

app.get('/get/test/ping', (req, res) => {
    res.status(418)
    res.send('Pong!')
})

app.get('/get/general/serverAmount', (req, res) => {
    res.send(`${client.guilds.cache.size}`)
})

app.get('/get/users/secret', (req, res) => {
    // Check if user exists
    const { id, password } = req.headers;

    if (!id || !password) {
        res.status(400)
        res.send({
            code: 400,
            error: 'Missing parameters'
        })
    }

    if (fs.existsSync(`../data/users/${id}.json`)) {
        const fileText = fs.readFileSync(`../data/users/${id}.json`, 'utf8');
        const json = JSON.parse(fileText);

        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        if (json.password === passwordHash) {
            const userSecret = crypto.randomBytes(64).toString('hex');
            const userSecretHash = crypto.createHash('sha256').update(userSecret).digest('hex');

            const newJson = {
                password: `${json.password}`,
                secret: userSecretHash
            }

            fs.writeFileSync(`../data/users/${id}.json`, JSON.stringify(newJson));

            res.send({
                code: 200,
                secret: userSecret
            })
        } else {
            res.status(401)
            res.send({
                code: 401,
                error: 'Invalid credentials'
            })
        }
    } else {
        res.status(404)
        res.send({
            code: 404,
            error: 'User not found'
        })
    }
})

app.post('/post/users/create', (req, res) => {
    const user = req.query.id;
    const { password, createkey } = req.headers;

    if (createkey === undefined) {
        res.status(400)
        return res.send({
            error: 'Hey bud, you forgot to send the create key',
            code: 400
        })
    }
    
    if (process.env.BotCommunicationKey === undefined) {
        res.status(500)
        return res.send({
            error: 'Oops we messed up :/',
            code: 500
        })
    }

    if (createkey !== process.env.BotCommunicationKey) {
        res.status(401)
        return res.send({
            error: 'Invalid create key',
            code: 401
        })
    }

    if (fs.existsSync(`../data/users/${user}.json`)) {
        res.status(400)
        res.send({
            error: 'User already exists',
            code: 400
        })
    } else {
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        fs.appendFileSync(`../data/users/${user}.json`, JSON.stringify({
            password: passwordHash
        }));

        res.send({
            message: 'User created',
            code: 200
        })
    }
})

app.post('/post/users/password/reset', (req, res) => {
    const { id, newpassword, secret, communicationkey } = req.headers;

    if (!id || !newpassword || !secret || !communicationkey) {
        res.status(400)
        return res.send({
            code: 400,
            error: 'Missing parameters'
        })
    }

    if (communicationkey !== process.env.BotCommunicationKey) {
        res.status(401)
        return res.send({
            code: 401,
            error: 'Invalid communication key'
        })
    }

    if (fs.existsSync(`../data/users/${id}.json`)) {
        const fileText = fs.readFileSync(`../data/users/${id}.json`, 'utf8');
        const json = JSON.parse(fileText);

        const secretHash = crypto.createHash('sha256').update(secret).digest('hex');

        if (secretHash === json.secret) {
            // Replace the password on the object with the new password
            const passwordHash = crypto.createHash('sha256').update(newpassword).digest('hex');

            const newJson = {
                password: passwordHash,
                secret: json.secret
            }

            fs.writeFileSync(`../data/users/${id}.json`, JSON.stringify(newJson));

            res.send({
                code: 200,
                message: 'Password changed'
            })
        } else {
            res.status(401)
            res.send({
                code: 401,
                error: 'Invalid secret'
            })
        }
    } else {
        res.status(404)
        res.send({
            code: 404,
            error: 'User not found'
        })
    }
})

app.get('/get/users/servers', (req, res) => {

    // To future me:
    // Maybe change the usersecret header to one just called secret
    const id = req.query.id;
    const { secret } = req.headers;

    if (!id) {
        res.status(400)
        return res.send({
            code: 400,
            error: 'Missing id'
        })
    }

    if (secret === undefined) {
        res.status(400)
        return res.send({
            code: 400,
            error: 'Secret is undefined'
        })
    }

    if (fs.existsSync(`../data/users/${id}.json`)) {
        // User exists
        const fileText = fs.readFileSync(`../data/users/${id}.json`, 'utf8');
        const json = JSON.parse(fileText);

        const userSecretHash = crypto.createHash('sha256').update(secret).digest('hex');

        if (json.secret === userSecretHash) {
            // User secret is correct
            const servers = [];
            client.guilds.cache.filter(guild => guild.members.cache.has(id)).forEach(guild => {
                if (guild.members.cache.get(id).permissions.has('ManageGuild')) {
                    servers.push({
                        id: guild.id,
                        name: guild.name,
                        icon: guild.iconURL()
                    })
                }
            });

            res.send({
                code: 200,
                servers: servers
            });
        } else {
            res.status(401)
            res.send({
                code: 401,
                error: 'Invalid credentials'
            })
        }
    }
})

app.post('/guilds/channels/messages', (req, res) => {
    const { guild, channel } = req.query;
    const { user } = req.headers;
    const secret = crypto.createHash('sha256').update(req.headers.secret).digest('hex');

    const message = JSON.parse(req.body)
        .then(() => {
            console.log('Message was received correctly')
        })
        .catch(err => {
            console.log(err)
        })
    
    if (!guild || !channel || !user || !secret || !message) {
        res.status(400)
        return res.send({
            code: 400,
            error: 'Missing parameters'
        })
    }

    if (fs.existsSync(`../data/users/${user}.json`)) {
        const fileText = fs.readFileSync(`../data/users/${user}.json`, 'utf8');
        const json = JSON.parse(fileText);
        const correctSecret = json.secret;

        if (secret === correctSecret) {
            const guildObject = client.guilds.cache.get(guild);
            if (guildObject) {
                const channelObject = guildObject.channels.cache.get(channel);
                if (channelObject) {
                    channelObject.send(message)
                        .then(() => {
                            return res.send({
                                code: 200,
                                message: 'Message sent'
                            })
                        })
                        .catch(err => {
                            res.status(500)
                            return res.send({
                                code: 500,
                                error: err
                            })
                        })
                } else {
                    res.status(404)
                    return res.send({
                        code: 404,
                        error: 'Channel not found'
                    })
                }
            } else {
                res.status(404)
                return res.send({
                    code: 404,
                    error: 'Guild not found'
                })
            }
        } else {
            res.status(401)
            return res.send({
                code: 401,
                error: 'Invalid credentials',

                request: {
                    user: {
                        id: user,

                        secret: {
                            raw: req.headers.secret,
                            hashed: secret
                        }
                    }
                }
            })
        }
    } else {
        res.status(404)
        return res.send({
            code: 404,
            error: 'User not found'
        })
    }
})

client.login(process.env.DJSTOKEN);