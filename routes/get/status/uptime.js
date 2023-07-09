const client = require('../../../client.js');

module.exports = (req, res) => {
    const uptime = client.uptime;
    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(`${Math.floor(uptime / 1000 / 60 / 60)} hours, ${Math.floor(uptime / 1000 / 60) % 60} minutes, ${Math.floor(uptime / 1000) % 60} seconds`)
}