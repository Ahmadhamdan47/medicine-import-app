const BoxService = require('../services/boxService'); // Adjust the path as needed

const BoxController = {
  async addBox(req, res) {
    try {
      const { DonationId, BoxLabel } = req.body;
      const newBox = await BoxService.addBox(DonationId, BoxLabel);
      res.status(201).json(newBox);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }   
  },

  async deleteBox(req, res) {
    try {
      const { boxId } = req.params;
      const deleted = await BoxService.deleteBox(boxId);
      if (deleted) {
        res.status(200).json({ message: 'Box deleted successfully' });
      } else {
        res.status(404).json({ message: 'Box not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getBoxes(req, res) {
    try {
      const { donationId } = req.params;
      const boxes = await BoxService.getBoxes(donationId);
      res.status(200).json(boxes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateBox(req, res) {
    try {
      const { boxId } = req.params;
      const updateData = req.body;
      const updated = await BoxService.updateBox(boxId, updateData);
      if (updated) {
        res.status(200).json({ message: 'Box updated successfully' });
      } else {
        res.status(404).json({ message: 'Box not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = BoxController;
