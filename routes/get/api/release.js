const fs = require('fs');
const express = require('express');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = (req, res) => {
    res.send(fs.readFileSync('./Release.id', 'utf8'))
}