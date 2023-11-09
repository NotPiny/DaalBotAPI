const express = require('express');
const client = require('../../../../client.js');
const fs = require('fs');
const path = require('path');
const { ChannelType } = require('discord.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    const guild = req.query.guild;

    const analyticsData = JSON.parse(fs.readFileSync(path.resolve(`./data/analytics.json`)));

    if (analyticsData[guild]) return res.status(400).send({ error: 'Analytics already exists for this guild' });

    setTimeout(() => { // Rate limits are rate limits...
        const guildData = client.guilds.cache.get(guild);

        if (!guildData) return res.send({ error: 'Invalid guild' }); // Should NEVER happen but intellisense is a bit dumb with possible undefined values

        const guildChannels = guildData.channels.cache.filter(c => c.type === ChannelType.GuildText);
        const guildChannelIDs = guildChannels.map(c => c.id);

        analyticsData[guild] = {}

        guildChannelIDs.forEach(channelID => {
            analyticsData[guild][channelID] = [] // Empty array for each channel to store analytics
        })

        fs.writeFileSync(path.resolve(`./data/analytics.json`), JSON.stringify(analyticsData, null, 4));

        res.json({ success: true });
    }, 2 * 1000);
}