const DrugsUnderProcessService = require('../services/drugsUnderProcessService');

class DrugsUnderProcessController {
  static async getAllDrugsUnderProcess(req, res) {
    try {
      const drugs = await DrugsUnderProcessService.getAllDrugsUnderProcess();
      res.status(200).json(drugs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDrugUnderProcessById(req, res) {
    try {
      const { id } = req.params;
      const drug = await DrugsUnderProcessService.getDrugUnderProcessById(id);
      res.status(200).json(drug);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async createDrugUnderProcess(req, res) {
    try {
      // Pass the complete multi-step form data (including new variables)
      const drug = await DrugsUnderProcessService.createDrugUnderProcess(req.body);
      res.status(201).json(drug);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateDrugUnderProcess(req, res) {
    try {
      const { id } = req.params;
      const drug = await DrugsUnderProcessService.updateDrugUnderProcess(id, req.body);
      res.status(200).json(drug);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteDrugUnderProcess(req, res) {
    try {
      const { id } = req.params;
      const result = await DrugsUnderProcessService.deleteDrugUnderProcess(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = DrugsUnderProcessController;