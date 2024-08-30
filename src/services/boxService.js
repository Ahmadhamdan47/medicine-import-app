const  Box  = require('../models/box'); // Adjust the path as needed

const BoxService = {
    addBox: async (boxData) => {
        try {
          // Log the received data
          console.log('Attempting to add a new box with data:', boxData);
    
          if (!boxData.DonationId || !boxData.BoxLabel) {
            console.error('Invalid data: DonationId or BoxLabel is missing');
            throw new Error('Invalid data: DonationId or BoxLabel is missing');
          }
    
          // Log before attempting to create a new box
          console.log('Creating a new box with DonationId:', boxData.DonationId, 'and BoxLabel:', boxData.BoxLabel);
    
          const newBox = await Box.create({
            DonationId: boxData.DonationId,
            BoxLabel: boxData.BoxLabel,
          });
    
          // Log the successfully created box
          console.log('Successfully added new box:', newBox);
    
          return newBox;
        } catch (error) {
          // Log the error with more details
          console.error('Error adding box:', error.message, error.stack);
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
