const Donation = require('../donation');
const BatchLotTracking = require('../batchLot');
const BatchSerialNumber = require('../batchserialnumber');  // Import BatchSerialNumber model
const Box = require('../box');
const Donor = require('../donor');
const Recipient = require('../recipient');
const UserAccounts = require('../userAccounts');
const DrugPresentation = require('../drugPresentation');
const Drug = require('../pharmacyDrug');


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
