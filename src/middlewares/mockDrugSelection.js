const mockDrugSelection = (req, res, next) => {
    // Mock the selection of a specific drug
    const selectedDrugGuid = '9637BA88-6C91-4E20-8A1B-B9C4AFB1A2CE';

    // Set the guid on the request object
    req.guid = selectedDrugGuid;

    // Call the next middleware function
    next();
};

module.exports = mockDrugSelection;