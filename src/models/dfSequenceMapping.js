// DF Sequence Mapping Model
// Maps MoPH codes to their corresponding DFSequence values
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const DFSequenceMapping = sequelize.define('DFSequenceMapping', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mophCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'moph_code'
    },
    dfSequence: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'df_sequence'
    }
}, {
    tableName: 'df_sequence_mapping',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'idx_moph_code',
            fields: ['moph_code']
        },
        {
            name: 'idx_df_sequence',
            fields: ['df_sequence']
        }
    ],
    comment: 'Maps MoPH codes to their corresponding DFSequence values for dosage form classification'
});

module.exports = DFSequenceMapping;
