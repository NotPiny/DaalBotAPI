// Route used to validate if bearer is still valid otherwise it will return 401 Unauthorized
module.exports = (req, res) => {
    res.status(200).send('Pong!')
}