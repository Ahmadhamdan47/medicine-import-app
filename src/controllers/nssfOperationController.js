const operationNSSFService = require('../services/operationNSSFService');

/**
 * Search NSSF operations by system for private hospitals
 */
const searchNSSFOperationsBySystemPrivate = async (req, res) => {
  const systemNameOrNameAR = req.params.system;
  try {
    const operations = await operationNSSFService.searchNSSFOperationsBySystemPrivate(systemNameOrNameAR);
    res.status(200).json(operations);
  } catch (error) {
    console.error('Error searching NSSF operations by system (private):', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Search NSSF operations by system for public hospitals
 */
const searchNSSFOperationsBySystemPublic = async (req, res) => {
  const systemNameOrNameAR = req.params.system;
  try {
    const operations = await operationNSSFService.searchNSSFOperationsBySystemPublic(systemNameOrNameAR);
    res.status(200).json(operations);
  } catch (error) {
    console.error('Error searching NSSF operations by system (public):', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Search NSSF operations for private hospitals
 */
const searchNSSFOperationsPrivate = async (req, res) => {
  const query = req.params.query;
  try {
    const operations = await operationNSSFService.searchNSSFOperationsPrivate(query);
    res.status(200).json(operations);
  } catch (error) {
    console.error('Error searching NSSF operations (private):', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Search NSSF operations for public hospitals
 */
const searchNSSFOperationsPublic = async (req, res) => {
  const query = req.params.query;
  try {
    const operations = await operationNSSFService.searchNSSFOperationsPublic(query);
    res.status(200).json(operations);
  } catch (error) {
    console.error('Error searching NSSF operations (public):', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get NSSF operation by ID
 */
const getNSSFOperationById = async (req, res) => {
  const operationId = req.params.operationId;
  const hospitalType = req.query.hospitalType || 'private'; // default to private
  
  try {
    const operation = await operationNSSFService.getNSSFOperationById(operationId, hospitalType);
    if (!operation) {
      return res.status(404).json({ message: 'NSSF operation not found' });
    }
    res.status(200).json(operation);
  } catch (error) {
    console.error('Error getting NSSF operation by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all NSSF operations
 */
const getAllNSSFOperations = async (req, res) => {
  const hospitalType = req.query.hospitalType || 'private'; // default to private
  
  try {
    const operations = await operationNSSFService.getAllNSSFOperations(hospitalType);
    res.status(200).json(operations);
  } catch (error) {
    console.error('Error getting all NSSF operations:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchNSSFOperationsBySystemPrivate,
  searchNSSFOperationsBySystemPublic,
  searchNSSFOperationsPrivate,
  searchNSSFOperationsPublic,
  getNSSFOperationById,
  getAllNSSFOperations
};
