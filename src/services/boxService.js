const  Box  = require('../models/box'); // Adjust the path as needed

const BoxService = {
  addBox: async (boxData) => {
    try {
      const newBox = await Box.create({
        DonationId: boxData.DonationId,
        BoxLabel: boxData.BoxLabel,
      });
      return newBox;
    } catch (error) {
      console.error('Error adding box:', error);
      throw new Error('Error adding box');
    }
  },

  deleteBox: async (boxId) => {
    try {
      const deleted = await Box.destroy({ where: { BoxId: boxId } });
      return deleted;
    } catch (error) {
      console.error('Error deleting box:', error);
      throw new Error(`Error deleting box: ${error.message}`);
    }
  },

  getBoxes: async (donationId) => {
    try {
      const boxes = await Box.findAll({ where: { DonationId: donationId } });
      return boxes;
    } catch (error) {
      console.error('Error fetching boxes:', error);
      throw new Error(`Error fetching boxes: ${error.message}`);
    }
  },

  updateBox: async (boxId, updateData) => {
    try {
      const [updated] = await Box.update(updateData, { where: { BoxId: boxId } });
      return updated;
    } catch (error) {
      console.error('Error updating box:', error);
      throw new Error(`Error updating box: ${error.message}`);
    }
  },
};

module.exports = BoxService;
