const Brand = require('../models/brand');

const addBrand = async (brandData) => {
    try {
        const brand = await Brand.create(brandData);
        return brand;
    } catch (error) {
        console.error(error);
        throw new Error('Error in brandService: ' + error.message);
    }
};

const getBrandById = async (BrandId) => {
    try {
        const brand = await Brand.findByPk(BrandId);
        return brand;
    } catch (error) {
        console.error(error);
        throw new Error('Error in brandService: ' + error.message);
    }
};

const getAllBrands = async () => {
    try {
        const brand = await Brand.findAll();
        return brand;
    } catch (error) {
        console.error(error);
        throw new Error('Error in brandService: ' + error.message);
    }
};



const editBrand = async (BrandId, brandData) => {
    try {
        const brand = await Brand.update(brandData, {
            where: { BrandId: BrandId }
        });
        return brand;
    } catch (error) {
        console.error(error);
        throw new Error('Error in brandService: ' + error.message);
    }
};

const deleteBrand = async (BrandId) => {
    try {
        await Brand.destroy({
            where: { BrandId: BrandId }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in brandService: ' + error.message);
    }
};

module.exports = { addBrand, getBrandById, getAllBrands, editBrand, deleteBrand };