const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_URL = "https://apiv2.medleb.org/drugs/all";
const FILTERED_API_URL = "https://apiv2.medleb.org/drugs/paginated-filtered";

// Provided by user
const DELETED_CODES = [5220, 8838, 7401, 3755, 6768, 7441, 7442, 12465, 7577];

// Provided by user
const INSERTED_CODES = [
  12674, 12685, 12686, 12665, 12666, 12681, 12680, 12668, 12669, 12670, 12687,
  12650, 12684, 12641, 12642, 12640, 12639, 12638, 12659, 12645, 2647, 12662,
  12663, 12664, 12675, 12671, 12672, 12677, 12676, 12658, 12678, 12683, 12647,
  12648, 12646, 12673, 12679, 12667, 12660, 12661, 12688, 12643, 12644, 12682,
  12652, 12653, 12654, 12655, 12656, 12657, 12649,
];

// Provided by user
const PRICE_CHANGES = [
  { oldPrice: 10068071.0, newPrice: 9742118.0, codes: [9117] },
  { oldPrice: 100838212.0, newPrice: 97573579.0, codes: [7533] },
  { oldPrice: 120946.0, newPrice: 151854.0, codes: [10046] },
  { oldPrice: 1254159941.0, newPrice: 1213556561.0, codes: [9659] },
  { oldPrice: 13516410.0, newPrice: 13078816.0, codes: [5116] },
  { oldPrice: 151399262.0, newPrice: 112547132.0, codes: [11624] },
  { oldPrice: 154115122.0, newPrice: 149125651.0, codes: [5897] },
  { oldPrice: 1720118.0, newPrice: 1568264.0, codes: [10456] },
  { oldPrice: 17256739.0, newPrice: 16698053.0, codes: [12446] },
  { oldPrice: 178442955.0, newPrice: 172665871.0, codes: [11837] },
  { oldPrice: 19038230.0, newPrice: 18421868.0, codes: [9717] },
  { oldPrice: 2011300.0, newPrice: 1946184.0, codes: [12456] },
  { oldPrice: 20200153.0, newPrice: 19546174.0, codes: [5117] },
  { oldPrice: 221857193.0, newPrice: 214674575.0, codes: [6930] },
  { oldPrice: 256154857.0, newPrice: 247861853.0, codes: [6207] },
  { oldPrice: 28030805.0, newPrice: 27123309.0, codes: [11704] },
  { oldPrice: 323240243.0, newPrice: 312775353.0, codes: [6562] },
  { oldPrice: 324819838.0, newPrice: 314303808.0, codes: [5120] },
  { oldPrice: 34237996.0, newPrice: 33129543.0, codes: [9718] },
  { oldPrice: 3429486.0, newPrice: 3006176.0, codes: [10509] },
  { oldPrice: 352121341.0, newPrice: 340721426.0, codes: [11838, 11839] },
  { oldPrice: 38.714286, newPrice: 11489853.0, codes: [2647] },
  { oldPrice: 39355784.0, newPrice: 38081642.0, codes: [5848] },
  { oldPrice: 45903895.0, newPrice: 44417758.0, codes: [9184] },
  { oldPrice: 52168478.0, newPrice: 50479525.0, codes: [4041] },
  { oldPrice: 59034407.0, newPrice: 57123171.0, codes: [5849] },
  { oldPrice: 627079971.0, newPrice: 606778281.0, codes: [10293] },
  { oldPrice: 6534634.0, newPrice: 6323076.0, codes: [8918] },
  { oldPrice: 680450.0, newPrice: 658420.0, codes: [6675] },
  { oldPrice: 705284.0, newPrice: 682450.0, codes: [6599] },
  { oldPrice: 74428960.0, newPrice: 72019326.0, codes: [6306] },
  { oldPrice: 7516596.0, newPrice: 7273246.0, codes: [9116] },
  { oldPrice: 75701015.0, newPrice: 56272182.0, codes: [11625] },
  { oldPrice: 890710.0, newPrice: 861874.0, codes: [6676] },
  { oldPrice: 9968705.0, newPrice: 9645968.0, codes: [9716] },
];

// Provided by user
const AGENT_CHANGES = [
  { code: 12649, oldAgent: "Avicenna Pharm SARL", newAgent: "Avicenna Pharm SARL" },
  { code: 12620, oldAgent: "Droguerie de l'Union", newAgent: "UPO S.A.L." },
];

function unwrapDrugs(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.drugs)) return payload.drugs;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

function firstPresentation(drug) {
  if (Array.isArray(drug.DrugPresentations) && drug.DrugPresentations.length > 0) {
    return drug.DrugPresentations[0] || {};
  }
  return {};
}

function normalizeText(value) {
  return String(value || "").trim().toUpperCase();
}

function buildAtcIndexes(drugs) {
  const byBrand = new Map();
  const byIngredient = new Map();

  for (const drug of drugs) {
    const atc = drug?.ATC_Code;
    if (!atc) continue;

    const brandKey = normalizeText(drug.DrugName);
    if (brandKey) {
      if (!byBrand.has(brandKey)) byBrand.set(brandKey, new Set());
      byBrand.get(brandKey).add(atc);
    }

    const ingredientA = normalizeText(drug.ATCRelatedIngredient);
    const ingredientB = normalizeText(drug.OtherIngredients);
    if (ingredientA) {
      if (!byIngredient.has(ingredientA)) byIngredient.set(ingredientA, new Set());
      byIngredient.get(ingredientA).add(atc);
    }
    if (ingredientB) {
      if (!byIngredient.has(ingredientB)) byIngredient.set(ingredientB, new Set());
      byIngredient.get(ingredientB).add(atc);
    }
  }

  return { byBrand, byIngredient };
}

function resolveAtc(drug, atcIndexes) {
  if (!drug) return { atc: "", inferred: false, source: "missing-drug" };
  if (drug.ATC_Code) return { atc: drug.ATC_Code, inferred: false, source: "direct" };

  const brandKey = normalizeText(drug.DrugName);
  if (brandKey && atcIndexes.byBrand.has(brandKey)) {
    const candidates = Array.from(atcIndexes.byBrand.get(brandKey));
    if (candidates.length === 1) {
      return { atc: candidates[0], inferred: true, source: "brand" };
    }
  }

  const ingredientA = normalizeText(drug.ATCRelatedIngredient);
  if (ingredientA && atcIndexes.byIngredient.has(ingredientA)) {
    const candidates = Array.from(atcIndexes.byIngredient.get(ingredientA));
    if (candidates.length === 1) {
      return { atc: candidates[0], inferred: true, source: "ingredient" };
    }
  }

  const ingredientB = normalizeText(drug.OtherIngredients);
  if (ingredientB && atcIndexes.byIngredient.has(ingredientB)) {
    const candidates = Array.from(atcIndexes.byIngredient.get(ingredientB));
    if (candidates.length === 1) {
      return { atc: candidates[0], inferred: true, source: "ingredient" };
    }
  }

  return { atc: "", inferred: false, source: "unresolved" };
}

function templateRowFromDrug(code, drug, atcIndexes) {
  if (!drug) {
    return {
      MoPHCode: String(code),
      BrandName: "",
      Ingredients: "",
      ATC: "",
      Dosage: "",
      Strength: "",
      Form: "",
      DosageForm: "",
      Route: "",
      Presentation: "",
      ProductType: "",
      Stratum: "",
      Agent: "",
      Manufacturer: "",
      recordMissingFromAPI: true,
    };
  }

  const p = firstPresentation(drug);
  const atcResolution = resolveAtc(drug, atcIndexes);
  const dosage = drug.Dosage || "";
  const form = drug.Form || "";
  const presentation = p.Description || drug.Presentation || "";

  return {
    MoPHCode: String(drug.MoPHCode || code),
    BrandName: drug.DrugName || "",
    Ingredients: drug.OtherIngredients || drug.ATCRelatedIngredient || "",
    ATC: atcResolution.atc,
    Dosage: dosage,
    Strength: dosage,
    Form: form,
    DosageForm: form,
    Route: drug.Route || drug.RouteLNDI || "",
    Presentation: presentation,
    ProductType: drug.ProductType || "",
    Stratum: drug.Stratum || "",
    Agent: drug.Agent || "",
    Manufacturer: drug.Manufacturer || "",
    PublicPrice: drug.PublicPrice ?? null,
    ATCInferred: atcResolution.inferred,
    ATCSource: atcResolution.source,
  };
}

function buildDrugMap(drugs) {
  const map = new Map();
  for (const drug of drugs) {
    if (drug && drug.MoPHCode !== undefined && drug.MoPHCode !== null) {
      map.set(String(drug.MoPHCode), drug);
    }
  }
  return map;
}

async function fetchNotMarketedDrugs(codes) {
  if (!codes.length) return [];

  const response = await axios.get(FILTERED_API_URL, {
    params: {
      NotMarketed: true,
      MoPHCode: codes.join(","),
      page: 1,
      limit: Math.max(codes.length, 100),
    },
    timeout: 180000,
  });

  return unwrapDrugs(response.data);
}

function mergeDrugsIntoMap(drugMap, drugs) {
  for (const drug of drugs) {
    if (drug && drug.MoPHCode !== undefined && drug.MoPHCode !== null) {
      drugMap.set(String(drug.MoPHCode), drug);
    }
  }
}

function toPriceModEntry(code, oldPrice, newPrice, drugMap, atcIndexes) {
  const drug = drugMap.get(String(code));
  return {
    BrandName: drug?.DrugName || "",
    oldPrice,
    newPrice,
    oldStratum: drug?.Stratum || "",
    newStratum: drug?.Stratum || "",
    details: {
      MoPHCode: String(code),
      old: {
        PublicPrice: oldPrice,
      },
      new: {
        PublicPrice: newPrice,
      },
      templateRow: templateRowFromDrug(code, drug, atcIndexes),
    },
  };
}

function toAgentModEntry(change, drugMap, atcIndexes) {
  const drug = drugMap.get(String(change.code));
  return {
    BrandName: drug?.DrugName || "",
    old: change.oldAgent,
    new: change.newAgent,
    details: {
      MoPHCode: String(change.code),
      old: { Agent: change.oldAgent },
      new: { Agent: change.newAgent },
      templateRow: templateRowFromDrug(change.code, drug, atcIndexes),
    },
  };
}

async function main() {
  try {
    console.log(`Fetching live data from ${API_URL} ...`);
    const response = await axios.get(API_URL, { timeout: 180000 });
    const drugs = unwrapDrugs(response.data);

    if (!drugs.length) {
      throw new Error("No drugs returned from API.");
    }

    const drugMap = buildDrugMap(drugs);

    const missingDeletedCodes = DELETED_CODES.filter((code) => !drugMap.has(String(code)));

    if (missingDeletedCodes.length) {
      console.log(
        `Fetching ${missingDeletedCodes.length} non-marketed deleted codes from ${FILTERED_API_URL} ...`
      );
      const notMarketedDrugs = await fetchNotMarketedDrugs(missingDeletedCodes);
      mergeDrugsIntoMap(drugMap, notMarketedDrugs);
    }

    const unresolvedCodes = Array.from(new Set([
      ...INSERTED_CODES,
      ...DELETED_CODES,
      ...PRICE_CHANGES.flatMap((entry) => entry.codes),
      ...AGENT_CHANGES.map((entry) => entry.code),
    ])).filter((code) => !drugMap.has(String(code)));

    if (unresolvedCodes.length) {
      console.log(
        `Fetching ${unresolvedCodes.length} additional non-marketed unresolved codes from ${FILTERED_API_URL} ...`
      );
      const unresolvedNotMarketedDrugs = await fetchNotMarketedDrugs(unresolvedCodes);
      mergeDrugsIntoMap(drugMap, unresolvedNotMarketedDrugs);
    }

    const atcIndexes = buildAtcIndexes(drugs);
    const insertedCodeSet = new Set(INSERTED_CODES.map(String));

    const newlyMarketedRows = INSERTED_CODES.map((code) =>
      templateRowFromDrug(code, drugMap.get(String(code)), atcIndexes)
    );

    const newlyNotMarketedRows = DELETED_CODES.map((code) =>
      templateRowFromDrug(code, drugMap.get(String(code)), atcIndexes)
    );

    const priceStratumChanges = PRICE_CHANGES.flatMap((entry) =>
      entry.codes
        .filter((code) => !insertedCodeSet.has(String(code)))
        .map((code) => toPriceModEntry(code, entry.oldPrice, entry.newPrice, drugMap, atcIndexes))
    );

    const agentChanges = AGENT_CHANGES.map((entry) => toAgentModEntry(entry, drugMap, atcIndexes));

    const output = {
      generatedAt: new Date().toISOString(),
      source: {
        api: API_URL,
        totalRecordsFetched: drugs.length,
      },
      inputSummary: {
        deletedCodes: DELETED_CODES,
        insertedCodes: INSERTED_CODES,
        providedPriceChangeEntries: PRICE_CHANGES.length,
        providedAgentChangeEntries: AGENT_CHANGES.length,
      },
      addedMoPHCodes: INSERTED_CODES.map(String),
      notMarketedTrue: DELETED_CODES.map(String),
      templateReport: {
        section1_newly_marketed: {
          total_newly_marketed_drugs: newlyMarketedRows.length,
          total_atc_codes_newly_marketed_drugs: new Set(
            newlyMarketedRows.map((r) => r.ATC).filter(Boolean)
          ).size,
          rows: newlyMarketedRows,
        },
        section2_newly_not_marketed: {
          total_newly_unmarketed_drugs: newlyNotMarketedRows.length,
          total_atc_codes_newly_unmarketed_drugs: new Set(
            newlyNotMarketedRows.map((r) => r.ATC).filter(Boolean)
          ).size,
          rows: newlyNotMarketedRows,
        },
        section3_modifications: {
          atc_code_changes: [],
          agent_changes: agentChanges,
          manufacturer_changes: [],
          price_stratum_changes: priceStratumChanges,
          other_or_several_modifications: [],
        },
      },
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(
      __dirname,
      `medleb_docx_template_from_live_api_${timestamp}.json`
    );

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
    console.log(`Report file created: ${outputPath}`);
  } catch (error) {
    console.error("Failed to generate report from live API:", error.message);
    process.exitCode = 1;
  }
}

main();
