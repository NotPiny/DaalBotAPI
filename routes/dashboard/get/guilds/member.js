const express = require('express');
const client = require('../../../../client.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    const guild = req.query.guild

    const member = req.query.member
    if (!member) return res.json({ error: 'No member provided' })

    const guildObj = client.guilds.cache.get(guild)
    if (!guildObj) return res.json({ error: 'Invalid guild' })

    const memberObj = guildObj.members.cache.get(member)
    if (!memberObj) return res.json({ error: 'Invalid member' })

    res.status(200).send(memberObj)
}