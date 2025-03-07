const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/bannedDrugs.json');

class BannedDrugsService {
    static getBannedDrugs() {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data).bannedDrugs;
    }

    static addBannedDrug(criteria) {
        const data = fs.readFileSync(filePath);
        const jsonData = JSON.parse(data);
        jsonData.bannedDrugs.push(criteria);
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
        return criteria;
    }

    static removeBannedDrug(cisId) {
        const data = fs.readFileSync(filePath);
        const jsonData = JSON.parse(data);
        jsonData.bannedDrugs = jsonData.bannedDrugs.filter(drug => drug.cisId !== cisId);
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    }

    static isDrugBanned(drug) {
        const bannedDrugs = this.getBannedDrugs();
        return bannedDrugs.some(banned => 
            (banned.cisId && banned.cisId === drug.cisId) ||
            (banned.format && banned.format === drug.format) ||
            (banned.owner && banned.owner === drug.owner) ||
            (banned.type && banned.type === drug['@type'])
        );
    }
}

module.exports = BannedDrugsService;