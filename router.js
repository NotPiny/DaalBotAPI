const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const fs = require('fs');
let https;
const client = require('./client.js');
const axios = require('axios');

/**
 * @typedef {Object} CachedDashUser
 * @property {string} accesscode - The user's access code.
 * @property {Object[]} guilds - The guilds the user has access to.
 * @property {string} guilds.id - The ID of the guild.
 * @property {number} guilds.permissions - The permissions the user has for the guild.
 * @property {number} cachedTimestamp - The timestamp of when the user was cached. Used for cache invalidation.
*/

/**
 * @type {CachedDashUser[]}
 */
let dashboardUsers = [];

if (process.env.HTTP == 'true') {
  https = require('http');
} else {
  https = require('https');
}

app.use(cors());

app.get('/', (req, res) => {
  res.redirect('https://github.com/NotPiny/DaalBotAPI');
});

app.get('/dashboard/:category/:action', async(req, res) => {
    const authorization = req.headers.authorization;

    // Check if user is cached
    const cachedUser = dashboardUsers.find(user => user.accesscode === authorization);
    if (cachedUser && Date.now() - cachedUser.cachedTimestamp <= 900000) { // 15 minutes
        // Use cached user data
        const guilds = cachedUser.guilds;
        const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
        if (manageableGuilds.filter(guild => guild.id == req.query.guild).length != 0) {
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
    } else {
        // Fetch user data from Discord API
        try {
            const guildsReq = await axios.get(`https://discord.com/api/users/@me/guilds`, {
                headers: {
                    Authorization: `Bearer ${authorization}`
                }
            })
        
            const guilds = guildsReq.data;

            const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
        
            if (manageableGuilds.filter(guild => guild.id == req.query.guild).length != 0) {
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

                // Cache user data
                dashboardUsers.push({
                    accesscode: authorization,
                    guilds: guilds,
                    cachedTimestamp: Date.now()
                });
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

        // Remove expired cache data
        dashboardUsers = dashboardUsers.filter(user => Date.now() - user.cachedTimestamp <= 900000);
    }
});

app.post('/dashboard/:category/:action', async(req, res) => {
    const authorization = req.headers.authorization;

    // Check if user is cached
    const cachedUser = dashboardUsers.find(user => user.accesscode === authorization);
    if (cachedUser && Date.now() - cachedUser.cachedTimestamp <= 900000) {
        // Use cached user data
        const guilds = cachedUser.guilds;
        const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
        if (manageableGuilds.filter(guild => guild.id == req.query.guild).length != 0) {
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
    } else {
        // Fetch user data from Discord API
        try {
            const guildsReq = await axios.get(`https://discord.com/api/users/@me/guilds`, {
                headers: {
                    Authorization: `Bearer ${authorization}`
                }
            })
        
            const guilds = guildsReq.data;

            const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
        
            if (manageableGuilds.filter(guild => guild.id == req.query.guild).length != 0) {
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

                // Cache user data
                dashboardUsers.push({
                    accesscode: authorization,
                    guilds: guilds,
                    cachedTimestamp: Date.now()
                });
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

        // Remove expired cache data
        dashboardUsers = dashboardUsers.filter(user => Date.now() - user.cachedTimestamp <= 900000);
    }
});

app.delete('/dashboard/:category/:action', async(req, res) => {
    const authorization = req.headers.authorization;

    // Check if user is cached
    const cachedUser = dashboardUsers.find(user => user.accesscode === authorization);
    if (cachedUser && Date.now() - cachedUser.cachedTimestamp <= 900000) {
        // Use cached user data
        const guilds = cachedUser.guilds;
        const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
        if (manageableGuilds.filter(guild => guild.id == req.query.guild).length != 0) {
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
    } else {
        // Fetch user data from Discord API
        try {
            const guildsReq = await axios.get(`https://discord.com/api/users/@me/guilds`, {
                headers: {
                    Authorization: `Bearer ${authorization}`
                }
            })
        
            const guilds = guildsReq.data;

            const manageableGuilds = guilds.filter(guild => guild.permissions & 0x20);
        
            if (manageableGuilds.filter(guild => guild.id == req.query.guild).length != 0) {
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

                // Cache user data
                dashboardUsers.push({
                    accesscode: authorization,
                    guilds: guilds,
                    cachedTimestamp: Date.now()
                });
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

        // Remove expired cache data
        dashboardUsers = dashboardUsers.filter(user => Date.now() - user.cachedTimestamp <= 900000);
    }
});

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

// Keep this at the bottom
app.get('*', (req, res) => {
    res.status(404).header('Content-Type', 'image/jpeg').sendFile('./img/404.jpg', { root: __dirname });
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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.TOKEN);