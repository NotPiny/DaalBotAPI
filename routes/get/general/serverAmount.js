const client = require('../../../client.js');

module.exports = (req, res) => {
    res.send(`${client.guilds.cache.size}`)
}