const brandService = require("../services/brandService");

const addBrand = async (req, res) => {
  try {
    const brand = await brandService.addBrand(req.body);
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await brandService.getBrandById(req.params.BrandId);
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const brand = await brandService.getAllBrands();
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const editBrand = async (req, res) => {
  try {
    const brand = await brandService.editBrand(req.params.BrandId, req.body);
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const deleteBrand = async (req, res) => {
  try {
    await brandService.deleteBrand(req.params.BrandId);
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  addBrand,
  getBrandById,
  getAllBrands,
  editBrand,
  deleteBrand,
};
