const express = require('express');
const crypto = require('crypto');
const fs = require('fs');

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
*/

module.exports = (req, res) => {
    // Check if user exists
    const { id, password } = req.headers;

    if (!id || !password) {
        res.status(400)
        res.send({
            code: 400,
            error: 'Missing parameters'
        })
    }

    if (fs.existsSync(`./data/users/${id}.json`)) {
        const fileText = fs.readFileSync(`./data/users/${id}.json`, 'utf8');
        const json = JSON.parse(fileText);

        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        if (json.password === passwordHash) {
            const userSecret = crypto.randomBytes(64).toString('hex');
            const userSecretHash = crypto.createHash('sha256').update(userSecret).digest('hex');

            const newJson = {
                password: `${json.password}`,
                secret: userSecretHash
            }

            fs.writeFileSync(`./data/users/${id}.json`, JSON.stringify(newJson));

            res.send({
                code: 200,
                secret: userSecret
            })
        } else {
            res.status(401)
            res.send({
                code: 401,
                error: 'Invalid credentials'
            })
        }
    } else {
        res.status(404)
        res.send({
            code: 404,
            error: 'User not found'
        })
    }
}