const Donation = require('../donation');
const BatchLotTracking = require('../BatchLot');
const Box = require('../box');
const Donor = require('../donor');
const Recipient = require('../recipient');
const UserAccounts = require('../userAccounts');
const Role = require('../roles');


// Associations
Donation.hasMany(Box, { foreignKey: 'DonationId' });
Box.belongsTo(Donation, { foreignKey: 'DonationId' });

Box.hasMany(BatchLotTracking, { foreignKey: 'BoxId' });
BatchLotTracking.belongsTo(Box, { foreignKey: 'BoxId' });

Donation.belongsTo(Donor, { foreignKey: 'DonorId' });
Donation.belongsTo(Recipient, { foreignKey: 'RecipientId' });
Donor.hasMany(Donation, { foreignKey: 'DonorId' });
Recipient.hasMany(Donation, { foreignKey: 'RecipientId' });


Donor.hasOne(UserAccounts, { foreignKey: 'DonorId' });
UserAccounts.belongsTo(Donor, { foreignKey: 'DonorId' });
Donor.hasMany(UserAccounts, { foreignKey: 'DonorId' });
UserAccounts.belongsTo(Donor, { foreignKey: 'DonorId' });

Role.hasMany(UserAccounts, { foreignKey: 'RoleId' });
UserAccounts.belongsTo(Role, { foreignKey: 'RoleId' });