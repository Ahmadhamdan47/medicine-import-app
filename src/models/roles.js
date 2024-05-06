const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Role = sequelize.define('Role', {
    RoleId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    RoleName: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'roles',
    timestamps: false
});

module.exports = Role;