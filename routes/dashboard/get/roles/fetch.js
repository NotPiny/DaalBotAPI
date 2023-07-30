const client = require('../../../../client.js');
const express = require('express');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = async (req, res) => {
    const roleID = req.query.role;
    const guild = client.guilds.cache.get(req.query.guild);

    if (guild === undefined) return res.status(404).send({ error: 'Guild not found' });

    const role = guild.roles.cache.get(roleID);

    if (role === undefined) return res.status(404).send({ error: 'Role not found' });

    res.send(JSON.stringify(role, null, 4))
}