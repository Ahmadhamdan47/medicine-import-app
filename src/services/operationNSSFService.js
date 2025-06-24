const { Op } = require('sequelize');
const Operation = require('../models/operation');
const CategoryPricing = require('../models/categoryPricing');
const OperationShare = require('../models/operationShare');
const NSSFOperationCoverage = require('../models/nssfOperationCoverage');
const OperationSystems = require('../models/opeartionsystems');
const Hospital = require('../models/hospital');

class OperationNSSFService {
  
  // Helper functions for NSSF calculations
  static async getNSSFCoverageByOperationId(operationId, isPrivate = false) {
    const nssfCoverage = await NSSFOperationCoverage.findOne({
      where: { 
        operation_id: operationId,
        is_active: true 
      },
      attributes: [
        'id', 'operation_id', 'effective_date',
        'private_operation_cost_lbp', 'private_nssf_coverage_percentage', 
        'private_nssf_coverage_amount_lbp', 'private_patient_share_lbp',
        'public_operation_cost_lbp', 'public_nssf_coverage_percentage',
        'public_nssf_coverage_amount_lbp', 'public_patient_share_lbp',
        'category1_nssf_coverage_lbp', 'category2_nssf_coverage_lbp', 'category3_nssf_coverage_lbp',
        'notes'
      ]
    });

    return nssfCoverage;
  }

  static async getCategoryPricing(operationId) {
    const categoryPricing = await CategoryPricing.findAll({
      where: { OperationId: operationId },
      attributes: ['FirstCategory1', 'FirstCategory2', 'FirstCategory3'],
    });

    return categoryPricing.length > 0 ? categoryPricing[0] : null;
  }

  static async getOperationShare(isPrivate) {
    const operationShares = await OperationShare.findAll({
      where: { isPrivate },
      attributes: ['Share'],
    });

    return operationShares.length > 0 ? operationShares[0] : null;
  }

  static formatAnesthetic(anesthetic) {
    if (anesthetic === 'G') {
      return 'Global Anesthesia';
    } else if (anesthetic === 'L') {
      return 'Local Anesthesia';
    }
    return anesthetic;
  }

  // Main NSSF operation search methods
  static async searchNSSFOperationsBySystemPrivate(systemNameOrNameAR) {
    try {
      // Find the corresponding systemChar from the operationsystems table
      const operationSystem = await OperationSystems.findOne({
        where: {
          [Op.or]: [
            { systemName: systemNameOrNameAR },
            { NameAR: systemNameOrNameAR }
          ]
        }
      });

      if (!operationSystem) {
        throw new Error('No matching operation system found');
      }

      const operations = await Operation.findAll({
        where: { systemChar: operationSystem.systemChar },
        attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
        include: [
          {
            model: NSSFOperationCoverage,
            as: 'nssfCoverage',
            where: { is_active: true },
            required: false
          }
        ]
      });

      // Get operation share for private operations
      const operationShare = await this.getOperationShare(true);
      const operationShareValue = operationShare ? operationShare.Share : 0;

      // Process each operation
      for (let operation of operations) {
        const operationId = operation.ID;
        
        // Get category pricing
        const categoryPricing = await this.getCategoryPricing(operationId);
        operation.dataValues.categoryPricing = categoryPricing;

        // Get NSSF coverage
        const nssfCoverage = await this.getNSSFCoverageByOperationId(operationId, true);
        operation.dataValues.nssfCoverage = nssfCoverage;

        if (categoryPricing && operationShareValue > 0) {
          // Calculate patient shares using category pricing and operation share
          operation.dataValues.patientShareCategory1 = categoryPricing.FirstCategory1 * operationShareValue / 100;
          operation.dataValues.patientShareCategory2 = categoryPricing.FirstCategory2 * operationShareValue / 100;
          operation.dataValues.patientShareCategory3 = categoryPricing.FirstCategory3 * operationShareValue / 100;
        }

        if (nssfCoverage) {
          // Add NSSF-specific calculations for private operations
          operation.dataValues.nssfPrivateCost = nssfCoverage.private_operation_cost_lbp;
          operation.dataValues.nssfPrivateCoveragePercentage = nssfCoverage.private_nssf_coverage_percentage;
          operation.dataValues.nssfPrivateCoverageAmount = nssfCoverage.private_nssf_coverage_amount_lbp;
          operation.dataValues.nssfPrivatePatientShare = nssfCoverage.private_patient_share_lbp;
          
          // Category-specific NSSF coverage
          operation.dataValues.nssfCategory1Coverage = nssfCoverage.category1_nssf_coverage_lbp;
          operation.dataValues.nssfCategory2Coverage = nssfCoverage.category2_nssf_coverage_lbp;
          operation.dataValues.nssfCategory3Coverage = nssfCoverage.category3_nssf_coverage_lbp;
        }

        // Format anesthetic
        operation.dataValues.Anesthetic = this.formatAnesthetic(operation.dataValues.Anesthetic);
      }

      return {
        hospitalType: 'private',
        systemName: systemNameOrNameAR,
        operationShare: operationShareValue,
        totalOperations: operations.length,
        operations: operations
      };

    } catch (error) {
      throw new Error(`Error searching NSSF operations for private system: ${error.message}`);
    }
  }

  static async searchNSSFOperationsBySystemPublic(systemNameOrNameAR) {
    try {
      // Find the corresponding systemChar from the operationsystems table
      const operationSystem = await OperationSystems.findOne({
        where: {
          [Op.or]: [
            { systemName: systemNameOrNameAR },
            { NameAR: systemNameOrNameAR }
          ]
        }
      });

      if (!operationSystem) {
        throw new Error('No matching operation system found');
      }

      const operations = await Operation.findAll({
        where: { systemChar: operationSystem.systemChar },
        attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
        include: [
          {
            model: NSSFOperationCoverage,
            as: 'nssfCoverage',
            where: { is_active: true },
            required: false
          }
        ]
      });

      // Get operation share for public operations
      const operationShare = await this.getOperationShare(false);
      const operationShareValue = operationShare ? operationShare.Share : 0;

      // Process each operation
      for (let operation of operations) {
        const operationId = operation.ID;
        
        // Get category pricing
        const categoryPricing = await this.getCategoryPricing(operationId);
        operation.dataValues.categoryPricing = categoryPricing;

        // Get NSSF coverage
        const nssfCoverage = await this.getNSSFCoverageByOperationId(operationId, false);
        operation.dataValues.nssfCoverage = nssfCoverage;

        if (categoryPricing && operationShareValue > 0) {
          // Calculate patient shares using category pricing and operation share
          operation.dataValues.patientShareCategory1 = categoryPricing.FirstCategory1 * operationShareValue / 100;
          operation.dataValues.patientShareCategory2 = categoryPricing.FirstCategory2 * operationShareValue / 100;
          operation.dataValues.patientShareCategory3 = categoryPricing.FirstCategory3 * operationShareValue / 100;
        }

        if (nssfCoverage) {
          // Add NSSF-specific calculations for public operations
          operation.dataValues.nssfPublicCost = nssfCoverage.public_operation_cost_lbp;
          operation.dataValues.nssfPublicCoveragePercentage = nssfCoverage.public_nssf_coverage_percentage;
          operation.dataValues.nssfPublicCoverageAmount = nssfCoverage.public_nssf_coverage_amount_lbp;
          operation.dataValues.nssfPublicPatientShare = nssfCoverage.public_patient_share_lbp;
          
          // Category-specific NSSF coverage
          operation.dataValues.nssfCategory1Coverage = nssfCoverage.category1_nssf_coverage_lbp;
          operation.dataValues.nssfCategory2Coverage = nssfCoverage.category2_nssf_coverage_lbp;
          operation.dataValues.nssfCategory3Coverage = nssfCoverage.category3_nssf_coverage_lbp;
        }

        // Format anesthetic
        operation.dataValues.Anesthetic = this.formatAnesthetic(operation.dataValues.Anesthetic);
      }

      return {
        hospitalType: 'public',
        systemName: systemNameOrNameAR,
        operationShare: operationShareValue,
        totalOperations: operations.length,
        operations: operations
      };

    } catch (error) {
      throw new Error(`Error searching NSSF operations for public system: ${error.message}`);
    }
  }

  // Search NSSF operations by query (name, code, etc.)
  static async searchNSSFOperationsPrivate(query) {
    try {
      const operations = await Operation.findAll({
        where: {
          [Op.or]: [
            { Code: { [Op.like]: `%${query}%` } },
            { Name: { [Op.like]: `%${query}%` } },
            { NameAR: { [Op.like]: `%${query}%` } }
          ]
        },
        attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
        include: [
          {
            model: NSSFOperationCoverage,
            as: 'nssfCoverage',
            where: { is_active: true },
            required: false
          }
        ]
      });

      // Get operation share for private operations
      const operationShare = await this.getOperationShare(true);
      const operationShareValue = operationShare ? operationShare.Share : 0;

      // Process each operation
      for (let operation of operations) {
        const operationId = operation.ID;
        
        // Get category pricing
        const categoryPricing = await this.getCategoryPricing(operationId);
        operation.dataValues.categoryPricing = categoryPricing;

        // Get NSSF coverage
        const nssfCoverage = await this.getNSSFCoverageByOperationId(operationId, true);
        operation.dataValues.nssfCoverage = nssfCoverage;

        if (categoryPricing && operationShareValue > 0) {
          // Calculate patient shares
          operation.dataValues.patientShareCategory1 = categoryPricing.FirstCategory1 * operationShareValue / 100;
          operation.dataValues.patientShareCategory2 = categoryPricing.FirstCategory2 * operationShareValue / 100;
          operation.dataValues.patientShareCategory3 = categoryPricing.FirstCategory3 * operationShareValue / 100;
        }

        if (nssfCoverage) {
          // Add NSSF-specific data for private operations
          operation.dataValues.nssfPrivateCost = nssfCoverage.private_operation_cost_lbp;
          operation.dataValues.nssfPrivateCoveragePercentage = nssfCoverage.private_nssf_coverage_percentage;
          operation.dataValues.nssfPrivateCoverageAmount = nssfCoverage.private_nssf_coverage_amount_lbp;
          operation.dataValues.nssfPrivatePatientShare = nssfCoverage.private_patient_share_lbp;
          
          // Category-specific NSSF coverage
          operation.dataValues.nssfCategory1Coverage = nssfCoverage.category1_nssf_coverage_lbp;
          operation.dataValues.nssfCategory2Coverage = nssfCoverage.category2_nssf_coverage_lbp;
          operation.dataValues.nssfCategory3Coverage = nssfCoverage.category3_nssf_coverage_lbp;
        }

        // Format anesthetic
        operation.dataValues.Anesthetic = this.formatAnesthetic(operation.dataValues.Anesthetic);
      }

      return {
        hospitalType: 'private',
        searchQuery: query,
        operationShare: operationShareValue,
        totalOperations: operations.length,
        operations: operations
      };

    } catch (error) {
      throw new Error(`Error searching NSSF operations for private query: ${error.message}`);
    }
  }

  static async searchNSSFOperationsPublic(query) {
    try {
      const operations = await Operation.findAll({
        where: {
          [Op.or]: [
            { Code: { [Op.like]: `%${query}%` } },
            { Name: { [Op.like]: `%${query}%` } },
            { NameAR: { [Op.like]: `%${query}%` } }
          ]
        },
        attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
        include: [
          {
            model: NSSFOperationCoverage,
            as: 'nssfCoverage',
            where: { is_active: true },
            required: false
          }
        ]
      });

      // Get operation share for public operations
      const operationShare = await this.getOperationShare(false);
      const operationShareValue = operationShare ? operationShare.Share : 0;

      // Process each operation
      for (let operation of operations) {
        const operationId = operation.ID;
        
        // Get category pricing
        const categoryPricing = await this.getCategoryPricing(operationId);
        operation.dataValues.categoryPricing = categoryPricing;

        // Get NSSF coverage
        const nssfCoverage = await this.getNSSFCoverageByOperationId(operationId, false);
        operation.dataValues.nssfCoverage = nssfCoverage;

        if (categoryPricing && operationShareValue > 0) {
          // Calculate patient shares
          operation.dataValues.patientShareCategory1 = categoryPricing.FirstCategory1 * operationShareValue / 100;
          operation.dataValues.patientShareCategory2 = categoryPricing.FirstCategory2 * operationShareValue / 100;
          operation.dataValues.patientShareCategory3 = categoryPricing.FirstCategory3 * operationShareValue / 100;
        }

        if (nssfCoverage) {
          // Add NSSF-specific data for public operations
          operation.dataValues.nssfPublicCost = nssfCoverage.public_operation_cost_lbp;
          operation.dataValues.nssfPublicCoveragePercentage = nssfCoverage.public_nssf_coverage_percentage;
          operation.dataValues.nssfPublicCoverageAmount = nssfCoverage.public_nssf_coverage_amount_lbp;
          operation.dataValues.nssfPublicPatientShare = nssfCoverage.public_patient_share_lbp;
          
          // Category-specific NSSF coverage
          operation.dataValues.nssfCategory1Coverage = nssfCoverage.category1_nssf_coverage_lbp;
          operation.dataValues.nssfCategory2Coverage = nssfCoverage.category2_nssf_coverage_lbp;
          operation.dataValues.nssfCategory3Coverage = nssfCoverage.category3_nssf_coverage_lbp;
        }

        // Format anesthetic
        operation.dataValues.Anesthetic = this.formatAnesthetic(operation.dataValues.Anesthetic);
      }

      return {
        hospitalType: 'public',
        searchQuery: query,
        operationShare: operationShareValue,
        totalOperations: operations.length,
        operations: operations
      };

    } catch (error) {
      throw new Error(`Error searching NSSF operations for public query: ${error.message}`);
    }
  }

  // Get NSSF operation by ID with both private and public details
  static async getNSSFOperationById(operationId) {
    try {
      const operation = await Operation.findOne({
        where: { ID: operationId },
        attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
        include: [
          {
            model: NSSFOperationCoverage,
            as: 'nssfCoverage',
            where: { is_active: true },
            required: false
          }
        ]
      });

      if (!operation) {
        throw new Error(`Operation with ID ${operationId} not found`);
      }

      // Get both private and public operation shares
      const operationSharePrivate = await this.getOperationShare(true);
      const operationSharePublic = await this.getOperationShare(false);
      
      // Get category pricing
      const categoryPricing = await this.getCategoryPricing(operationId);
      
      // Get NSSF coverage
      const nssfCoverage = await this.getNSSFCoverageByOperationId(operationId);

      // Add all data to operation
      operation.dataValues.categoryPricing = categoryPricing;
      operation.dataValues.nssfCoverage = nssfCoverage;

      // Private operation calculations
      if (operationSharePrivate && categoryPricing) {
        const privateShareValue = operationSharePrivate.Share;
        operation.dataValues.operationSharePrivate = privateShareValue;
        operation.dataValues.patientSharePrivateCategory1 = categoryPricing.FirstCategory1 * privateShareValue / 100;
        operation.dataValues.patientSharePrivateCategory2 = categoryPricing.FirstCategory2 * privateShareValue / 100;
        operation.dataValues.patientSharePrivateCategory3 = categoryPricing.FirstCategory3 * privateShareValue / 100;
      }

      // Public operation calculations
      if (operationSharePublic && categoryPricing) {
        const publicShareValue = operationSharePublic.Share;
        operation.dataValues.operationSharePublic = publicShareValue;
        operation.dataValues.patientSharePublicCategory1 = categoryPricing.FirstCategory1 * publicShareValue / 100;
        operation.dataValues.patientSharePublicCategory2 = categoryPricing.FirstCategory2 * publicShareValue / 100;
        operation.dataValues.patientSharePublicCategory3 = categoryPricing.FirstCategory3 * publicShareValue / 100;
      }

      // NSSF-specific data
      if (nssfCoverage) {
        // Private NSSF data
        operation.dataValues.nssfPrivateCost = nssfCoverage.private_operation_cost_lbp;
        operation.dataValues.nssfPrivateCoveragePercentage = nssfCoverage.private_nssf_coverage_percentage;
        operation.dataValues.nssfPrivateCoverageAmount = nssfCoverage.private_nssf_coverage_amount_lbp;
        operation.dataValues.nssfPrivatePatientShare = nssfCoverage.private_patient_share_lbp;
        
        // Public NSSF data
        operation.dataValues.nssfPublicCost = nssfCoverage.public_operation_cost_lbp;
        operation.dataValues.nssfPublicCoveragePercentage = nssfCoverage.public_nssf_coverage_percentage;
        operation.dataValues.nssfPublicCoverageAmount = nssfCoverage.public_nssf_coverage_amount_lbp;
        operation.dataValues.nssfPublicPatientShare = nssfCoverage.public_patient_share_lbp;
        
        // Category-specific NSSF coverage
        operation.dataValues.nssfCategory1Coverage = nssfCoverage.category1_nssf_coverage_lbp;
        operation.dataValues.nssfCategory2Coverage = nssfCoverage.category2_nssf_coverage_lbp;
        operation.dataValues.nssfCategory3Coverage = nssfCoverage.category3_nssf_coverage_lbp;
      }

      // Format anesthetic
      operation.dataValues.Anesthetic = this.formatAnesthetic(operation.dataValues.Anesthetic);

      return {
        operationId: operationId,
        operation: operation
      };

    } catch (error) {
      throw new Error(`Error getting NSSF operation by ID: ${error.message}`);
    }
  }

  // Get all operations with NSSF coverage
  static async getAllNSSFOperations() {
    try {
      const operations = await Operation.findAll({
        attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
        include: [
          {
            model: NSSFOperationCoverage,
            as: 'nssfCoverage',
            where: { is_active: true },
            required: true // Only operations with active NSSF coverage
          }
        ]
      });

      return {
        totalOperationsWithNSSF: operations.length,
        operations: operations
      };

    } catch (error) {
      throw new Error(`Error getting all NSSF operations: ${error.message}`);
    }
  }
}

module.exports = OperationNSSFService;
