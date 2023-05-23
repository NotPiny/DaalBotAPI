const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = (req, res) => {
    if (req.query.code) {
        const code = req.query.code;
        const id = req.query.id;

        const correctCode = fs.existsSync(path.resolve(`./temp/loopbackauth/${id}.code`)) ? fs.readFileSync(path.resolve(`./temp/loopbackauth/${id}.code`), 'utf-8') : null;

        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

        if (correctCode == null) {
            res.status(500).send('File not found');
        } else if (hashedCode == correctCode) {
            res.status(200).send('Passed');
        } else {
            res.status(401).send('Failed');
        }
    }
}