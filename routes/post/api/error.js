const express = require('express');
require('dotenv').config();
const tools = require('../../../tools.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    if (process.env.HTTP !== 'true') return res.status(401).send('Unauthorized');

    res.send('OK'); // Send OK before restarting to prevent insomnia from being dumb

    tools.handleError(`Test error on /post/api/error, (executed by ${req.ip})`, req)
}
