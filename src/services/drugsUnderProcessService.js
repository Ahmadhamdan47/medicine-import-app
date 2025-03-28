const DrugsUnderProcess = require('../models/drugsUnderProcess');

class DrugsUnderProcessService {
  static async getAllDrugsUnderProcess() {
    try {
      return await DrugsUnderProcess.findAll();
    } catch (error) {
      console.error('Error fetching drugs under process:', error);
      throw new Error('Failed to fetch drugs under process');
    }
  }

  static async getDrugUnderProcessById(id) {
    try {
      const drug = await DrugsUnderProcess.findByPk(id);
      if (!drug) {
        throw new Error(`Drug under process with ID ${id} not found`);
      }
      return drug;
    } catch (error) {
      console.error('Error fetching drug under process by ID:', error);
      throw new Error('Failed to fetch drug under process');
    }
  }

  static async createDrugUnderProcess(data) {
    try {
      return await DrugsUnderProcess.create(data);
    } catch (error) {
      console.error('Error creating drug under process:', error);
      throw new Error('Failed to create drug under process');
    }
  }

  static async updateDrugUnderProcess(id, data) {
    try {
      const drug = await DrugsUnderProcess.findByPk(id);
      if (!drug) {
        throw new Error(`Drug under process with ID ${id} not found`);
      }
      await drug.update(data);
      return drug;
    } catch (error) {
      console.error('Error updating drug under process:', error);
      throw new Error('Failed to update drug under process');
    }
  }

  static async deleteDrugUnderProcess(id) {
    try {
      const drug = await DrugsUnderProcess.findByPk(id);
      if (!drug) {
        throw new Error(`Drug under process with ID ${id} not found`);
      }
      await drug.destroy();
      return { message: 'Drug under process deleted successfully' };
    } catch (error) {
      console.error('Error deleting drug under process:', error);
      throw new Error('Failed to delete drug under process');
    }
  }
}

module.exports = DrugsUnderProcessService;