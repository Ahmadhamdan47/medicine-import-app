// src/models/index.js
const Drug = require('./drug');
const Substitute = require('./substitute');

Drug.hasMany(Substitute, { foreignKey: 'Drug' });
Drug.hasMany(Substitute, { foreignKey: 'Substitute' });
Substitute.belongsTo(Drug, { foreignKey: 'Drug' });
Substitute.belongsTo(Drug, { foreignKey: 'Substitute' });

module.exports = {
    Drug,
    Substitute
};