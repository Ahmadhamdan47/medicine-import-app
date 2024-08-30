const { Box } = require('../models/box'); // Adjust the path as needed

const BoxService = {
  async addBox(donationId, boxLabel) {
    try {
      const newBox = await Box.create({ DonationId: donationId, BoxLabel: boxLabel });
      return newBox;
    } catch (error) {
      throw new Error(`Error adding box: ${error.message}`);
    }
  },

  async deleteBox(boxId) {
    try {
      const deleted = await Box.destroy({ where: { BoxId: boxId } });
      return deleted;
    } catch (error) {
      throw new Error(`Error deleting box: ${error.message}`);
    }
  },

  async getBoxes(donationId) {
    try {
      const boxes = await Box.findAll({ where: { DonationId: donationId } });
      return boxes;
    } catch (error) {
      throw new Error(`Error fetching boxes: ${error.message}`);
    }
  },

  async updateBox(boxId, updateData) {
    try {
      const [updated] = await Box.update(updateData, { where: { BoxId: boxId } });
      return updated;
    } catch (error) {
      throw new Error(`Error updating box: ${error.message}`);
    }
  }
};

module.exports = BoxService;
