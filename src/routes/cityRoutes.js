const express = require("express");
const router = express.Router();

const cityController = require("../controllers/cityController");

router.post("/", cityController.addCity);
router.get("/:CityId", cityController.getCityById);
router.get("/", cityController.getAllCities);
router.put("/:CityId", cityController.editCity);
router.delete("/:CityId", cityController.deleteCity);

module.exports = router;