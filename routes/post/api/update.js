const express = require('express');
const execSync = require('child_process').execSync;
require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = (req, res) => {
    if (req.query.auth !== process.env.ActionCommunicationKey) return res.status(401).send('Unauthorized');

    execSync('sh update.sh');

    res.status(200).send('OK');

    fs.writeFileSync('./Release.id', crypto.randomBytes(8).toString('hex')); // Generate a new Release ID
}