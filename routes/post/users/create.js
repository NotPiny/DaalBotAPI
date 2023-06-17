const crypto = require('crypto');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = (req, res) => {
    const user = req.query.id;
    const { password, createkey } = req.headers;

    if (createkey === undefined) {
        res.status(400)
        return res.send({
            error: 'Hey bud, you forgot to send the create key',
            code: 400
        })
    }
    
    if (process.env.BotCommunicationKey === undefined) {
        res.status(500)
        return res.send({
            error: 'Oops we messed up :/',
            code: 500
        })
    }

    if (createkey !== process.env.BotCommunicationKey) {
        res.status(401)
        return res.send({
            error: 'Invalid create key',
            code: 401
        })
    }

    if (fs.existsSync(`./data/users/${user}.json`)) {
        res.status(400)
        res.send({
            error: 'User already exists',
            code: 400
        })
    } else {
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        fs.appendFileSync(`./data/users/${user}.json`, JSON.stringify({
            password: passwordHash
        }));

        res.send({
            message: 'User created',
            code: 200
        })
    }
}