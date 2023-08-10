const express = require('express');
const axios = require('axios');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = async (req, res) => {
    const Bearer = req.headers.authorization; // Bearer token

    if (!Bearer) return res.status(401).json({ error: 'Unauthorized', message: 'No Bearer token provided' });

    try {
        await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${Bearer}`
            }
        })

        // Valid Bearer
        return res.status(200).json({ message: 'Valid Bearer token' });
    } catch (error) {
        // Invalid Bearer
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid Bearer token' });
    }
}