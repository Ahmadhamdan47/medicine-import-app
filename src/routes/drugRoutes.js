const express = require("express");
const router = express.Router();

const drugController = require("../controllers/drugController");
/**
 * @swagger
 * /drugs/search/atc/{query}:
 *   get:
 *     summary: Search drugs by ATC name
 *     description: Retrieve drugs and their details matching the specified ATC name.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The ATC name to search for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drugs matching the ATC name retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   DrugName:
 *                     type: string
 *                   ATCRelatedIngredient:
 *                     type: string
 *                   ProductType:
 *                     type: string
 *                   Price:
 *                     type: number
 *                   ImageDefault:
 *                     type: string
 *                   SubsidyPercentage:
 *                     type: number
 *                   dosage:
 *                     type: string
 *                   route:
 *                     type: string
 *                   presentation:
 *                     type: object
 *                   priceInLBP:
 *                     type: number
 *                   unitPriceInLBP:
 *                     type: number
 *                   unitPrice:
 *                     type: number
 *       '404':
 *         description: Not Found. No drugs found for the specified ATC name.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/search/atc/:query", drugController.searchDrugByATCName);

/**
 * @swagger
 * /drugs/search/DrugName/{query}:
 *   get:
 *     summary: Search drugs by name
 *     description: Retrieve drugs and their details matching the specified name.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The drug name to search for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drugs matching the name retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   DrugName:
 *                     type: string
 *                   ATCRelatedIngredient:
 *                     type: string
 *                   ProductType:
 *                     type: string
 *                   Price:
 *                     type: number
 *                   ImageDefault:
 *                     type: string
 *                   SubsidyPercentage:
 *                     type: number
 *                   dosage:
 *                     type: string
 *                   route:
 *                     type: string
 *                   presentation:
 *                     type: object
 *                   priceInLBP:
 *                     type: number
 *                   unitPriceInLBP:
 *                     type: number
 *                   unitPrice:
 *                     type: number
 *       '404':
 *         description: Not Found. No drugs found for the specified name.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/search/DrugName/:query", drugController.searchDrugByName);

/**
 * @swagger
 * /drugs/Id/{DrugID}:
 *   get:
 *     summary: Get drug by ID
 *     description: Retrieve a drug and its details by its ID.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: DrugID
 *         required: true
 *         description: The ID of the drug to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: OK. Drug retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 DrugName:
 *                   type: string
 *                 ATCRelatedIngredient:
 *                   type: string
 *                 ProductType:
 *                   type: string
 *                 Price:
 *                   type: number
 *                 ImageDefault:
 *                   type: string
 *                 SubsidyPercentage:
 *                   type: number
 *                 dosage:
 *                   type: string
 *                 route:
 *                   type: string
 *                 presentation:
 *                   type: object
 *                 ATC:
 *                   type: string
 *                 priceInLBP:
 *                   type: number
 *                 unitPriceInLBP:
 *                   type: number
 *                 unitPrice:
 *                   type: number
 *                 Stratum:
 *                   type: string
 *       '404':
 *         description: Not Found. No drug found for the specified ID.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drug.
 */

router.get("/Id/:DrugID", drugController.getDrugById);

/**
 * @swagger
 * /drugs/filter/{query}:
 *   get:
 *     summary: Filter drugs
 *     description: Filter drugs based on the specified criteria.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The filter criteria.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drugs filtered successfully.
 *       '404':
 *         description: Not Found. No drugs found for the specified criteria.
 *       '500':
 *         description: Internal Server Error. Failed to filter drugs.
 */
router.get("/filter/:query", drugController.filterDrugs);

/**
 * @swagger
 * /drugs/add:
 *   post:
 *     summary: Add a new drug
 *     description: Add a new drug to the database.
 *     tags: [Drug]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DrugName:
 *                 type: string
 *               ManufacturerID:
 *                 type: integer
 *               RegistrationNumber:
 *                 type: string
 *               GTIN:
 *                 type: string
 *               Notes:
 *                 type: string
 *               Description:
 *                 type: string
 *               IngredientAndStrength:
 *                 type: string
 *               Indication:
 *                 type: string
 *               Posology:
 *                 type: string
 *               MethodOfAdministration:
 *                 type: string
 *               Contraindications:
 *                 type: string
 *               PrecautionForUse:
 *                 type: string
 *               EffectOnFGN:
 *                 type: string
 *               SideEffect:
 *                 type: string
 *               Toxicity:
 *                 type: string
 *               StorageCondition:
 *                 type: string
 *               ShelfLife:
 *                 type: string
 *               IngredientLabel:
 *                 type: string
 *               Price:
 *                 type: number
 *               ImagesPath:
 *                 type: string
 *               ImageDefault:
 *                 type: boolean
 *               InteractionIngredientName:
 *                 type: string
 *               IsDouanes:
 *                 type: boolean
 *               RegistrationDate:
 *                 type: string
 *                 format: date
 *               PublicPrice:
 *                 type: number
 *               SubsidyLabel:
 *                 type: string
 *               SubsidyPercentage:
 *                 type: number
 *               HospPricing:
 *                 type: boolean
 *               Substitutable:
 *                 type: boolean
 *               CreatedBy:
 *                 type: string
 *                 format: uuid
 *               CreatedDate:
 *                 type: string
 *                 format: date-time
 *               UpdatedBy:
 *                 type: string
 *                 format: uuid
 *               UpdatedDate:
 *                 type: string
 *                 format: date-time
 *               OtherIngredients:
 *                 type: string
 *               ATCRelatedIngredient:
 *                 type: string
 *               ReviewDate:
 *                 type: string
 *                 format: date
 *               MoPHCode:
 *                 type: string
 *               CargoShippingTerms:
 *                 type: string
 *               ProductType:
 *                 type: string
 *               NotMarketed:
 *                 type: boolean
 *               DFSequence:
 *                 type: string
 *               PriceForeign:
 *                 type: number
 *               CurrencyForeign:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       '200':
 *         description: OK. Drug added successfully.
 *       '500':
 *         description: Internal Server Error. Failed to add drug.
 */
router.post("/add", drugController.addDrug);

/**
 * @swagger
 * /drugs/addPharmacy:
 *   post:
 *     summary: Add a new patient to pharmacy
 *     description: Add a new patient to the pharmacy database.
 *     tags: [Drug]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *               Gender:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               Email:
 *                 type: string
 *               Address:
 *                 type: string
 *               IsActive:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: OK. Patient added to pharmacy successfully.
 *       '500':
 *         description: Internal Server Error. Failed to add patient to pharmacy.
 */
router.post("/addPharmacy", drugController.addPharmacyDrug);

/**
 * @swagger
 * /drugs/all:
 *   get:
 *     summary: Get all drugs
 *     description: Retrieve all drugs available in the system.
 *     tags: [Drug]
 *     responses:
 *       '200':
 *         description: OK. Drugs retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/all", drugController.getAllDrugs);

/**
 * @swagger
 * /drugs/smartSearch/{query}:
 *   get:
 *     summary: Smart search for drugs
 *     description: Retrieve drugs and their details matching the specified query in either the drug name or ATC name.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The query to search for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drugs matching the query retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   DrugName:
 *                     type: string
 *                   ATCRelatedIngredient:
 *                     type: string
 *                   ProductType:
 *                     type: string
 *                   Price:
 *                     type: number
 *                   ImageDefault:
 *                     type: string
 *                   SubsidyPercentage:
 *                     type: number
 *                   dosage:
 *                     type: string
 *                   route:
 *                     type: string
 *                   presentation:
 *                     type: object
 *                   priceInLBP:
 *                     type: number
 *                   unitPriceInLBP:
 *                     type: number
 *                   unitPrice:
 *                     type: number
 *       '404':
 *         description: Not Found. No drugs found for the specified query.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/smartSearch/:query", drugController.smartSearch);
/**
 * @swagger
 * /drugs/atc/{query}:
 *  get:
 *   summary: Get drug by ATC level
 *  description: Retrieve drugs and their details matching the specified ATC level.
 * tags: [Drug]
 * parameters:
 *  - in: path
 *   name: query
 *  required: true
 * description: The ATC level to search for.
 * schema:
 * type: string
 * responses:
 * '200':
 * description: OK. Drugs matching the ATC level retrieved successfully.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * DrugName:
 * type: string
 * ATCRelatedIngredient:
 * type: string
 * ProductType:
 * type: string
 * Price:
 * type: number
 * ImageDefault:
 * type: string
 * SubsidyPercentage:
 * type: number
 * dosage:
 * type: string
 * route:
 * type: string
 * presentation:
 * type: object
 * priceInLBP:
 * type: number
 * unitPriceInLBP:
 * type: number
 * unitPrice:
 * type: number
 * '404':
 * description: Not Found. No drugs found for the specified ATC level.
 * '500': 
 * description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/atc/:query", drugController.getDrugByATCLevel);

/**
 * @swagger
 * /drugs/addDrugATC:
 *   post:
 *     summary: Add drug to ATC mapping
 *     description: Add a drug to the Anatomical Therapeutic Chemical (ATC) classification mapping.
 *     tags: [Drug]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DrugID:
 *                 type: string
 *                 description: The ID of the drug.
 *               ATC_ID:
 *                 type: string
 *                 description: The ID of the ATC classification.
 *     responses:
 *       '200':
 *         description: OK. Drug mapped to ATC successfully.
 *       '400':
 *         description: Bad Request. Drug is already a substitute.
 *       '500':
 *         description: Internal Server Error. Failed to map drug to ATC.
 */
router.post("/addDrugATC", drugController.addDrugATC);

router.get("/dosage/id/:drugId", drugController.getDosageByDrugId);
router.get("/dosage/name/:drugName", drugController.getDosageByDrugName);

router.get("/route/id/:drugId", drugController.getRouteByDrugId);
router.get("/route/name/:drugName", drugController.getRouteByDrugName);

router.get("/presentation/id/:drugId", drugController.getPresentationByDrugId);
router.get(
  "/presentation/name/:drugName",
  drugController.getPresentationByDrugName
);
router.get('/stratum/:DrugID', drugController.getStratumByDrugId);
/**
 * @swagger
 * /drugs/interaction/{drugName}:
 *   get:
 *     summary: Get drug interactions
 *     description: Retrieve drug interactions for the specified drug name.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: drugName
 *         required: true
 *         description: The name of the drug to retrieve interactions for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drug interactions retrieved successfully.
 *       '404':
 *         description: Not Found. No interactions found for the specified drug name.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drug interactions.
 */
router.post("/checkMate", drugController.checkMate);
/**
 * @swagger
 * /drugs/otc/
 *   get:
 *     summary: Get otcDrugs
 *     description: Retrievw a list of OTC drugs.
 *     tags: [Drug]
 *     parameters:
 *       
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. OTC drugs retrieved successfully.
 *       '404':
 *         description: Not Found. No interactions found for the specified drug name.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drug interactions.
 */
router.get('/otc', drugController.getOTCDrugs);

/**
 * @swagger
 * /drugs/disease/{categoryName}:
 *   get:
 *     summary: Get drugs by disease category
 *     description: Retrieve drugs by the specified disease category.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         description: The disease category to search for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drugs retrieved successfully.
 *       '404':
 *         description: Not Found. No drugs found for the specified disease category.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */

router.get('/disease/:categoryName', drugController.getDrugByDiseaseCategoryController);
/**
 * @swagger
 * /drugs/substitutes/{drugName}:
 *  get:
 *  summary: Get drug substitutes
 * description: Retrieve substitutes for the specified drug name.
 * tags: [Drug]
 * parameters:
 * - in: path
 * name: drugNames
 * required: true
 * description: The name of the drug to retrieve substitutes for.
 * schema:
 * type: string
 * responses:
 * '200':
 * description: OK. Substitutes retrieved successfully.
 * '404':
 * description: Not Found. No substitutes found for the specified drug name.
 * '500':
 * description: Internal Server Error. Failed to retrieve substitutes.
 */
router.get('/substitutes/:drugName', drugController.getDrugSubstitutesController);
router.get('/checkDrugNameInAPI/:drugName', drugController.checkDrugNameInAPI);
router.delete('/delete/:DrugID', drugController.deleteDrug);
router.put('/update/:DrugID', drugController.updateDrug);
router.get("/paginated", drugController.getAllDrugsPaginated);
router.get("/paginatedByATC", drugController.getAllDrugsPaginatedByATC);

/**
 * @swagger
 * /drugs/fetch:
 *   get:
 *     summary: Fetch drug data from server
 *     description: Retrieve drug data from the server.
 *     tags: [Drug]
 *     responses:
 *       '200':
 *         description: OK. Drug data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   drugId:
 *                     type: integer
 *                   drugName:
 *                     type: string
 *                   drugNameAr:
 *                     type: string
 *                   manufacturerId:
 *                     type: integer
 *                   price:
 *                     type: number
 *       '500':
 *         description: Internal Server Error. Failed to fetch drug data.
 */
router.get("/fetch", drugController.fetchDrugData);

/**
 * @swagger
 * /drugs/checkUpdates:
 *   get:
 *     summary: Check for drug updates
 *     description: Check if any local drugs need updates by comparing with the server's data.
 *     tags: [Drug]
 *     responses:
 *       '200':
 *         description: OK. Updates needed for the following drug IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *       '500':
 *         description: Internal Server Error. Failed to check for updates.
 */
router.get("/checkUpdates", drugController.checkForUpdates);

/**
 * @swagger
 * /drugs/applyUpdates:
 *   post:
 *     summary: Apply drug updates
 *     description: Fetch and apply updates for the specified drug IDs.
 *     tags: [Drug]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updateDrugIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       '200':
 *         description: OK. Drugs updated successfully.
 *       '400':
 *         description: Bad Request. Invalid drug IDs provided.
 *       '500':
 *         description: Internal Server Error. Failed to update drugs.
 */
router.post("/applyUpdates", drugController.fetchAndApplyUpdates);
router.post("/setPriceUpdateDate", drugController.setPriceUpdateDate);




// Configure multer
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../img')); // Ensure this is the correct path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

const upload = multer({ storage });

router.post("/upload/:DrugID", upload.array("image", 10), drugController.uploadDrugImage);



module.exports = router;
