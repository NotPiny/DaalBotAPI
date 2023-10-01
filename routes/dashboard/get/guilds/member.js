const express = require('express')
const client = require('../../../../client.js')
let members = [] // Cache members until the api restarts or something idk

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    const guild = req.query.guild

    const member = req.query.member
    if (!member) return res.json({ error: 'No member provided' })

    // Check if the member for the guild is cached so we don't have to make discord mad by spamming requests
    const cachedMember = members.find(m => m.userId === member && m.guildId === guild)
    if (cachedMember) {
        return res.status(200).send(cachedMember)
    } else {
        const memberObj = client.guilds.cache.get(guild).members.cache.get(member)
        if (!memberObj) return res.status(400).json({ error: 'Invalid member' })

        members.push(memberObj)
        const membersString = JSON.stringify(members);
        members = JSON.parse(membersString); // Hacky way to make cache work because .push() doesn't work for some reason

        res.status(200).send(memberObj)
    }
}