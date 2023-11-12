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

    if (analyticsData[guild] && analyticsData[guild].enabled) return res.status(400).send({ error: 'Analytics already enabled for this guild' });

    // If the analytics already exists but is disabled, enable it
    if (analyticsData[guild] && !analyticsData[guild].enabled) {
        analyticsData[guild].enabled = true;
        fs.writeFileSync(path.resolve(`./data/analytics.json`), JSON.stringify(analyticsData, null, 4));
        return res.json({ success: true });
    }

    // If the analytics doesn't exist, create it
    setTimeout(() => { // Rate limits are rate limits...
        const guildData = client.guilds.cache.get(guild);

        if (!guildData) return res.send({ error: 'Invalid guild' }); // Should NEVER happen but intellisense is a bit dumb with possible undefined values

        const guildChannels = guildData.channels.cache.filter(c => c.type === ChannelType.GuildText);
        const guildChannelIDs = guildChannels.map(c => c.id);

        analyticsData[guild] = {
            enabled: true
        }

        guildChannelIDs.forEach(channelID => {
            analyticsData[guild][channelID] = [] // Empty array for each channel to store analytics
        })

        fs.writeFileSync(path.resolve(`./data/analytics.json`), JSON.stringify(analyticsData, null, 4));

        res.json({ success: true });
    }, 2 * 1000);
}