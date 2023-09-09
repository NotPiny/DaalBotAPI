const client = require('../../../client.js');

module.exports = (req, res) => {
    const uptime = client.uptime;
    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(`${uptime}`)
}