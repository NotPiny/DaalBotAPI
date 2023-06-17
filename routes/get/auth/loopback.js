const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/

module.exports = (req, res) => {
    const code = req.headers.code;
    const userID = req.headers.userid;

    if (!code) return res.status(400).send('Bad Request');

    if (fs.existsSync(path.resolve(`./auth/${userID}.code`))) {
        const fileData = fs.readFileSync(path.resolve(`./auth/${userID}.code`), 'utf-8');
        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

        if (fileData === hashedCode) {
            const data = fs.readFileSync(path.resolve(`./auth/${userID}.data`), 'utf-8');
            const userInfo = JSON.parse(data);
            
            res.json(userInfo);
        } else {
            res.status(401).send('Invalid Code');
        }
    }
}