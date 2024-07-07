const  Drug  = require('../models/drug'); // Adjust the path to where your models are located
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const images = [
  'images.jpeg',
  '47b0d3102550727.5f39872bc803f.jpg',
  'london-uk-october-th-packet-ibuprofen-painkillers-closeup-blister-pack-tablets-bell-s-healthcare-london-uk-162660294.webp'
];

async function updateDrugImages() {
  try {
    const drugs = await Drug.findAll({
      where: {
        imagesPath: {
          [Op.eq]: null // or [Op.eq]: '' if your column defaults to an empty string instead of null
        }
      }
    });

    for (const drug of drugs) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      await drug.update({
        imagesPath: randomImage
      });
    }

    console.log(`${drugs.length} rows have been updated.`);
  } catch (error) {
    console.error('Error updating drug images:', error);
  }
}

updateDrugImages();