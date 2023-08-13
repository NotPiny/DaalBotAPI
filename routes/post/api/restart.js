const express = require('express');
const execSync = require('child_process').execSync;
require('dotenv').config();

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = (req, res) => {
    if (req.query.authorization !== process.env.ActionCommunicationKey) return res.status(401).send('Unauthorized');

    execSync('sh restart.sh');

    res.status(200).send('OK');
}