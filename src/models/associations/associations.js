const Donation = require('../donation');
const BatchLotTracking = require('../BatchLot');
const Box = require('../box');

// Associations
Donation.hasMany(Box, { foreignKey: 'DonationId' });
Box.belongsTo(Donation, { foreignKey: 'DonationId' });

Box.hasMany(BatchLotTracking, { foreignKey: 'BoxId' });
BatchLotTracking.belongsTo(Box, { foreignKey: 'BoxId' });
