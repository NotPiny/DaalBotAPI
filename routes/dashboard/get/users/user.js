const express = require('express');
const client = require('../../../../client.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    const guild = req.query.guild

    const user = req.query.user
    if (!user) return res.json({ error: 'No user provided' })

    const userObj = client.users.cache.get(user)
    if (!userObj) return res.json({ error: 'Invalid user' })

    res.status(200).send(userObj)
}