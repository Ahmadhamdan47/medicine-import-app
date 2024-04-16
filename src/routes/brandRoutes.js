const express = require("express");
const router = express.Router();

const brandController = require("../controllers/brandController");

router.post("/", brandController.addBrand);
router.get("/:BrandId", brandController.getBrandById);
router.get("/", brandController.getAllBrands);
router.put("/:BrandId", brandController.editBrand);
router.delete("/:BrandId", brandController.deleteBrand);

module.exports = router;