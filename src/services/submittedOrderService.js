// src/services/orderService.js

const submittedOrder = require('../models/submittedOrder');
const RFI = require('../models/rfi');
const { getDrugByGuid } = require('./drugService');

const submitOrder = async (guid, quantity) => {
    try {
        const drug = await getDrugByGuid(guid);
        if (!drug) {
            throw new Error('Drug not found');
        }

        const order = await submittedOrder.create({
            brandName: drug.BrandName,
            drugId:drug.DrugId,
            quantityRequested: quantity,
            RFI: false,
            Result: false,
            PI: false,
            swift: false,
            invoice: false,
            rfd: false,
            stock: false

        });
        const rfi = await RFI.create({
            orderId: order.orderId,
            drugId: drug.Guid,
            quantity: quantity,
            offerType: null,
            offerInput: null,
            notes: null,
            isApproved: false,
            quantityApproved: null,
          });
        return order;
    } catch (error) {
        console.error(error);
        throw new Error('Error in orderService: ' + error.message);
    }
};

module.exports = {
    submitOrder,
};