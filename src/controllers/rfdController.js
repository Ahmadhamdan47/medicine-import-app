const rfdService = require('../services/rfdService');

const receiveRFD = async (req, res) => {
    const { id } = req.params;
    await rfdService.receiveRFD(id);
    res.send({ message: 'RFD declaration received successfully' });
}

module.exports = { receiveRFD };