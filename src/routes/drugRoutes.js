const express = require("express");
const router = express.Router();

const drugController = require("../controllers/drugController");
/**
 * @swagger
 * /drugs/search/atc/{query}:
 *   get:
 *     summary: Search drugs by ATC name
 *     description: Retrieve drugs matching the specified ATC name.
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
 *       '404':
 *         description: Not Found. No drugs found for the specified ATC name.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/search/atc/:query", drugController.searchDrugByATCName);

/**
 * @swagger
 * /drugs/search/brand/{query}:
 *   get:
 *     summary: Search drugs by brand name
 *     description: Retrieve drugs matching the specified brand name.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The brand name to search for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drugs matching the brand name retrieved successfully.
 *       '404':
 *         description: Not Found. No drugs found for the specified brand name.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/search/DrugName/:query", drugController.searchDrugByName);

/**
 * @swagger
 * /drugs/guid/{guid}:
 *   get:
 *     summary: Get drug by GUID
 *     description: Retrieve a drug by its GUID.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: guid
 *         required: true
 *         description: The GUID of the drug to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drug retrieved successfully.
 *       '404':
 *         description: Not Found. Drug not found for the specified GUID.
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
 *     response:
 *       '200':
 *         description: OK. Drugs retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/all", drugController.getAllDrugs); // Add this route definition
/**
 * @swagger
 * /drugs/smartSearch/{query}:
 *   get:
 *     summary: Smart search for drugs
 *     description: Retrieve drugs matching the specified search term using the smart search algorithm.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The search term to use for the smart search.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Drugs matching the search term retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve drugs.
 */
router.get("/smartSearch/:query", drugController.smartSearch);
// Export the router object
module.exports = router;
