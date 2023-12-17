const fs = require('fs').promises;
const path = require('path');
const express = require('express');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = async(req, res) => {
    const { pid } = req.query;
    if (pid.includes('.')) return res.status(400).send('Invalid paste ID.'); // Almost forgot about this one. :D
    const pastePath = path.resolve(`./data/pastes/${pid}.json`);

    try {
        const pasteRaw = await fs.readFile(pastePath, 'utf-8');
        const pasteJSON = JSON.parse(pasteRaw);
        const pasteContent = pasteJSON.content;
        const pasteExpiry = pasteJSON.expiry;
        const pasteType = pasteJSON.type;

        if (pasteExpiry && pasteExpiry < Date.now() && pasteExpiry !== -1) {
            await fs.unlink(pastePath);
            res.status(404).send('This paste has expired.');
            return;
        }

        res.set('Content-Type', pasteType).send(pasteContent);
    } catch (err) {
        res.status(500).send('Paste not found. / Unknown error.');
    }
}