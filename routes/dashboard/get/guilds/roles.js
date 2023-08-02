const express = require('express');
const client = require('../../../../client.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = async (req, res) => {
    const guild = client.guilds.cache.get(req.query.guild);

    if (!guild) return res.status(404) && res.json({ error: 'Guild not found' }); // Should never happen but just in case

    const roles = guild.roles.cache.map(role => {
        return {
            id: role.id,
            name: role.name
        }
    })

    res.json(roles);
}