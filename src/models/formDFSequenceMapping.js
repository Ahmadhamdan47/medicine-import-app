// Form to DF Sequence Mapping Model
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const FormDFSequenceMapping = sequelize.define('FormDFSequenceMapping', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    formName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'form_name'
    },
    dfSequence: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'df_sequence'
    },
    sequenceNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sequence_number'
    }
}, {
    tableName: 'form_df_sequence_mapping',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'idx_form_name',
            fields: ['form_name']
        },
        {
            name: 'idx_df_sequence',
            fields: ['df_sequence']
        },
        {
            name: 'idx_sequence_number',
            fields: ['sequence_number']
        },
        {
            name: 'unique_form_df',
            unique: true,
            fields: ['form_name', 'df_sequence']
        }
    ]
});

module.exports = FormDFSequenceMapping;
