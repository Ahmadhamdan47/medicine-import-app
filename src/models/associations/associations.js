const Donation = require('../donation');
const BatchLotTracking = require('../batchLot');
const BatchSerialNumber = require('../batchserialnumber');  // Import BatchSerialNumber model
const Box = require('../box');
const Donor = require('../donor');
const Recipient = require('../recipient');
const UserAccounts = require('../userAccounts');
const Role = require('../roles'); // Add Role import
const Agent = require('../agent'); // Add Agent import
const DrugPresentation = require('../drugPresentation');
const Drug = require('../pharmacyDrug');

// Import importation models
const ImportationRequest = require('../importationRequest');
const RFDRequest = require('../rfdRequest');
const ProformaRequest = require('../proformaRequest');
const SwiftPayment = require('../swiftPayment');


// Associations
Donation.hasMany(Box, { foreignKey: 'DonationId' });
Box.belongsTo(Donation, { foreignKey: 'DonationId' });

Box.hasMany(BatchLotTracking, { foreignKey: 'BoxId' });
BatchLotTracking.belongsTo(Box, { foreignKey: 'BoxId' });

// Add this association for BatchSerialNumber and BatchLotTracking
BatchLotTracking.hasMany(BatchSerialNumber, { foreignKey: 'BatchId', as: 'BatchSerialNumbers' });
BatchSerialNumber.belongsTo(BatchLotTracking, { foreignKey: 'BatchId', as: 'BatchLot' });

Donation.belongsTo(Donor, { foreignKey: 'DonorId' });
Donation.belongsTo(Recipient, { foreignKey: 'RecipientId' });
Donor.hasMany(Donation, { foreignKey: 'DonorId' });
Recipient.hasMany(Donation, { foreignKey: 'RecipientId' });

// UserAccounts associations
UserAccounts.belongsTo(Role, { foreignKey: 'RoleId', as: 'role' });
Role.hasMany(UserAccounts, { foreignKey: 'RoleId' });

UserAccounts.belongsTo(Agent, { foreignKey: 'AgentId', as: 'agent' });
Agent.hasMany(UserAccounts, { foreignKey: 'AgentId' });

UserAccounts.belongsTo(Donor, { foreignKey: 'DonorId', as: 'donor' });
UserAccounts.belongsTo(Recipient, { foreignKey: 'RecipientId', as: 'recipient' });

// Importation module associations
ImportationRequest.hasMany(RFDRequest, { foreignKey: 'importationRequestId', as: 'rfdRequests' });
RFDRequest.belongsTo(ImportationRequest, { foreignKey: 'importationRequestId', as: 'importationRequest' });

ImportationRequest.hasMany(ProformaRequest, { foreignKey: 'importationRequestId', as: 'proformaRequests' });
ProformaRequest.belongsTo(ImportationRequest, { foreignKey: 'importationRequestId', as: 'importationRequest' });

ImportationRequest.hasMany(SwiftPayment, { foreignKey: 'importationRequestId', as: 'swiftPayments' });
SwiftPayment.belongsTo(ImportationRequest, { foreignKey: 'importationRequestId', as: 'importationRequest' });
