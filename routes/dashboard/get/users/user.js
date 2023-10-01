const express = require('express');
const client = require('../../../../client.js');
let users = [] // Cache users until the api restarts or something idk (bad idea for ram but ill fix that if it becomes a problem)

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    const user = req.query.user
    if (!user) return res.json({ error: 'No user provided' })

    // Check if the user is cached so we don't have to make discord mad by spamming requests
    const cachedUser = users.find(u => u.id === user)

    if (cachedUser) {
        return res.status(200).send(cachedUser)
    } else {
        const userObj = client.users.cache.get(user)
        if (!userObj) return res.status(400).json({ error: 'Invalid user' })

        users.push(userObj)
        const usersString = JSON.stringify(users);
        users = JSON.parse(usersString); // Hacky way to make cache work because .push() doesn't work for some reason

        res.status(200).send(userObj)
    }
}