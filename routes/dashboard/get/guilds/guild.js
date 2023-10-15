const express = require('express');
const client = require('../../../../client.js');
const DJS = require('discord.js');
/**
 * @type {DJS.Guild[]}
*/
let guilds = []

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = async(req, res) => {
    const guild = req.query.guild;

    if (guilds.find(g => g.id === guild)) return res.json(guilds.find(g => g.id === guild)) // If the guild is already cached, return it

    const guildObj = client.guilds.cache.get(guild) // Get the guild object

    if (!guildObj) return res.json({ error: 'Guild not found' }) // If the guild is not found, return an error (this should never happen)

    guilds.push(guildObj) // Push the guild object to the cache
    const guildString = JSON.stringify(guilds) // Stringify the cache
    guilds = JSON.parse(guildString) // Parse the cache

    res.json(guildObj) // Return the guild object
}