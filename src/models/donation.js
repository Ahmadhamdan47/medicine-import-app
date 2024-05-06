// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/databasePharmacy');

// const Donation = sequelize.define('Donation', {
//     DonationId: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     DonorId: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'Donor',
//             key: 'DonorId'
//         }
//     },
//     RecipientId: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'Recipient',
//             key: 'RecipientId'
//         }
//     },
//     DonationDate: {
//         type: DataTypes.DATE
//     },
//     Quantity: {
//         type: DataTypes.INTEGER
//     },
//     DonationPurpose: {
//         type: DataTypes.STRING(255)
//     },
//     // CreatedDate: {
//     //     type: DataTypes.DATE,
//     //     allowNull: false
//     // },
//     UpdatedDate: {
//         type: DataTypes.DATE
//     },
//     Laboratory: {
//         type: DataTypes.STRING(255)
//     },
//     LaboratoryCountry: {
//         type: DataTypes.STRING(255)
//     }
// }, {
//     tableName: 'Donation',
//     timestamps: false
// });

// module.exports = Donation;

// /////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/databasePharmacy");
const BatchLotTracking = require('./BatchLot');

const Donation = sequelize.define(
  "Donation",
  {
    DonationId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    DonorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Donor",
        key: "DonorId",
      },
    },
    RecipientId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Recipient",
        key: "RecipientId",
      },
    },
    DonationDate: {
      type: DataTypes.DATE,
    },
    Quantity: {
      type: DataTypes.INTEGER,
    },
    DonationPurpose: {
      type: DataTypes.STRING(255),
    },
    // CreatedDate: {
    //     type: DataTypes.DATE,
    //     allowNull: false
    // },
    UpdatedDate: {
      type: DataTypes.DATE,
    },
    Laboratory: {
      type: DataTypes.STRING(255),
    },
    LaboratoryCountry: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "donation",
    timestamps: false,
  }
);

module.exports = Donation;
