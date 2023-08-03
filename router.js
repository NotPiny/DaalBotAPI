const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const fs = require('fs');
let https;
const client = require('./client.js');
const axios = require('axios');

if (process.env.HTTP == 'true') {
  https = require('http');
} else {
  https = require('https');
}

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/dashboard/:category/:action', async(req, res) => {
    const authorization = req.headers.authorization;

    try {
        const guildsReq = await axios.get(`https://discord.com/api/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        })
    
        const guilds = guildsReq.data;

        const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
    
        if (manageableGuilds.filter(guild => guild.id == req.query.guild) != []) {
            // User has permission to manage this guild
            const category = req.params.category;
            const action = req.params.action;
    
            try {
                const route = require(`./routes/dashboard/get/${category}/${action}.js`);
                route(req, res);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        if (`${error}`.includes('401')) {
            res.status(401).send('Unauthorized');
        } else {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
});

app.post('/dashboard/:category/:action', async(req, res) => {
    const authorization = req.headers.authorization;

    try {
        const guildsReq = await axios.get(`https://discord.com/api/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        })
    
        const guilds = guildsReq.data;

        const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
    
        if (manageableGuilds.filter(guild => guild.id == req.query.guild) != []) {
            // User has permission to manage this guild
            const category = req.params.category;
            const action = req.params.action;
    
            try {
                const route = require(`./routes/dashboard/post/${category}/${action}.js`);
                route(req, res);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        if (`${error}`.includes('401')) {
            res.status(401).send('Unauthorized');
        } else {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
})

app.delete('/dashboard/:category/:action', async(req, res) => {
    const authorization = req.headers.authorization;

    try {
        const guildsReq = await axios.get(`https://discord.com/api/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        })
    
        const guilds = guildsReq.data;

        const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
    
        if (manageableGuilds.filter(guild => guild.id == req.query.guild) != []) {
            // User has permission to manage this guild
            const category = req.params.category;
            const action = req.params.action;
    
            try {
                const route = require(`./routes/dashboard/delete/${category}/${action}.js`);
                route(req, res);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        if (`${error}`.includes('401')) {
            res.status(401).send('Unauthorized');
        } else {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
})

app.get('/get/:category/:item', (req, res) => {
    console.log(`GET ${req.params.category}/${req.params.item} (${req.headers['user-agent']})`);
    let category = req.params.category;
    let item = req.params.item;
  
    try {
        const route = require(`./routes/get/${category}/${item}.js`);
        route(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/post/:category/:item', (req, res) => {
    console.log(`POST ${req.params.category}/${req.params.item} (${req.headers['user-agent']})`);
    const category = req.params.category;
    const item = req.params.item;
    try {
        const route = require(`./routes/post/${category}/${item}.js`);
        route(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

if (process.env.HTTP == 'true') {
    https.createServer({
        // key: fs.readFileSync('/etc/letsencrypt/live/api.daalbot.xyz/privkey.pem'),
        // cert: fs.readFileSync('/etc/letsencrypt/live/api.daalbot.xyz/fullchain.pem')
     }, app).listen(port, () => {
         console.log(`Server listening on port ${port}`);
     });
} else {
    https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/api.daalbot.xyz/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/api.daalbot.xyz/fullchain.pem')
     }, app).listen(port, () => {
         console.log(`Server listening on port ${port}`);
     });
}

client.login(process.env.TOKEN);