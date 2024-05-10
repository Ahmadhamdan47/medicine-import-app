import { useState, useEffect } from "react";
// import "./styles.css";
// import { useDrugContext } from "./DrugContext";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  addDrugRequest,
  updateDrugRequest,
} from "../../../../../app/actions/AddDrugAndImportActions";

const DrugRegistryFormTest = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.drugs);

  // const {
  //   formData,
  //   handleSubmit,
  //   handleInputChange,
  //   priceUSD,
  //   priceLBP,
  //   exchangeRates,
  // } = useDrugContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // If formData has an ID, update the drug
      dispatch(updateDrugRequest(formData));
    } else {
      // If formData doesn't have an ID, add a new drug
      dispatch(addDrugRequest(formData));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FORM_DATA", payload: { [name]: value } });
  };

  const currencySymbols = {
    USD: "$",
    CAD: "C$",
    EUR: "€",
    CHF: "CHF",
    DKK: "kr",
    GBP: "£",
    SAR: "SAR",
    JOD: "JD",
    LBP: "LBP",
  };

  const [atcCodes, setAtcCodes] = useState([]);
  const [selectedATC, setSelectedATC] = useState("");
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const atcResponse = await axios.get(
          "http://localhost/:3000/api/atc/v1.0"
        );
        const atcItems = Array.isArray(atcResponse.data)
          ? atcResponse.data
          : [];
        const atcCodeData = await Promise.all(
          atcItems.map(async (atcItem) => {
            const atcCodeResponse = await axios.get(
              `http://localhost/:3000/api/atccodes/v1.0/codes/${atcItem.guid}`
            );
            return atcCodeResponse.data;
          })
        );
        setAtcCodes(atcCodeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleATCChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedATC(selectedValue);
    console.log("Selected ATC:", selectedValue); // Log the selected ATC code
  };

  useEffect(() => {
    const convertToUSD = () => {
      if (formData.PriceForeign && formData.currencyForeign) {
        const priceForeign = parseFloat(formData.PriceForeign);
        const exchangeRate = parseFloat(
          exchangeRates[formData.currencyForeign]
        );
        if (
          !isNaN(priceForeign) &&
          !isNaN(exchangeRate) &&
          exchangeRate !== 0
        ) {
          const convertedPrice = priceForeign / exchangeRate;
          console.log("Converted Price USD:", convertedPrice);
          return convertedPrice.toFixed(2);
        }
      }
      return "";
    };

    const convertToLBP = () => {
      if (formData.PriceForeign && formData.currencyForeign) {
        const priceInUSD = convertToUSD();
        const convertedPrice = priceInUSD * exchangeRates.LBP;
        console.log("Converted Price LBP:", convertedPrice);
        return convertedPrice.toFixed(2);
      }
      return "";
    };

    // Calculate converted prices
    const newPriceUSD = convertToUSD();
    const newPriceLBP = convertToLBP();

    //   // Update formData.PriceUSD and formData.PriceLBP
    //   handleInputChange({ target: { name: "PriceUSD", value: newPriceUSD } });
    //   handleInputChange({ target: { name: "PriceLBP", value: newPriceLBP } });
    // }, [formData.PriceForeign, formData.currencyForeign]); // Update only when PriceForeign or currencyForeign change
  });

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-spinner">Loading...</div>}

      <div
        onSubmit={handleSubmit}
        className="w-full pb-14 p-10 h-screen text-black-text dark:text-white-text "
      >
        <h1 className="pb-2 pt-2 text-center text-[1.375rem] xs:text-xl font-medium">
          1 - Drug Registry Informations
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-10 pt-6">
          {/* <label htmlFor="atc" className="labels text-md block text-left">
            ATC
          </label>
          <select value={selectedATC} onChange={handleATCChange}>
            <option value="">Select ATC Code</option>
            {atcCodes.map((atcCode, index) => (
              <option key={index} value={atcCode.code}>
                {atcCode.code}
              </option>
            ))}
          </select> */}

          <div className="input-container relative">
            <label
              htmlFor="BrandName"
              className="labels text-md block text-left"
            >
              Drug Name
            </label>
            <input
              name="BrandName"
              value={formData.BrandName}
              onChange={handleInputChange}
              type="text"
              autoComplete="off"
              placeholder="name"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="inline-">
              <label
                htmlFor="PriceForeign"
                className="labels text-md block text-left"
              >
                Foreign Price
              </label>
              <input
                name="PriceForeign"
                type="number"
                value={formData.PriceForeign}
                onChange={handleInputChange}
              />

              <select
                name="currencyForeign"
                // className="w-fit h-10"
                value={formData.currencyForeign}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select currency
                </option>
                {/* Iterate over currencySymbols to generate options */}
                {Object.entries(currencySymbols).map(([currency, symbol]) => (
                  <option key={currency} value={currency}>
                    {`${symbol} ${currency}`}{" "}
                    {/* Display symbol and currency code */}
                  </option>
                ))}
              </select>
            </div>

            {/* Converted price inputs */}
            <div className="input-container flex">
              <label className="labels text-md block text-left">
                Foreign Price in USD
                <input
                  name="PriceUSD"
                  value={priceUSD}
                  readOnly /* Make the input read-only */
                />
              </label>

              <label className="labels text-md block text-left">
                Foreign Price in LBP
                <input name="PriceLBP" value={priceLBP} readOnly />
              </label>
            </div>
          </div>

          <div className="col-1">
            <label className="font-medium block mb-2" htmlFor="Code">
              Code
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="Code"
              name="Code"
              value={formData.Code}
              onChange={handleInputChange}
              // required
            />

            <label
              className="font-medium block mb-2"
              htmlFor="RegistrationNumber"
            >
              Registration Number
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="RegistrationNumber"
              name="RegistrationNumber"
              value={formData.RegistrationNumber}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="SubsidyPercentage">
              Subsidy Percentage
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="SubsidyPercentage"
              name="SubsidyPercentage"
              value={formData.SubsidyPercentage}
              onChange={handleInputChange}
              // required
            />

            <div className="col-2 flex flex-col">
              <label className="font-medium block" htmlFor="REP_date">
                repDate
              </label>
              <input
                className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                type="date"
                id="REP_date"
                name="REP_date"
                value={formData.REP_date}
                onChange={handleInputChange}
                // required
              />
            </div>

            <label className="font-medium block" htmlFor="B_G">
              B/G
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="B_G"
              name="B_G"
              value={formData.B_G}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="ResponsiblePartyName">
              Responsible Party
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="ResponsiblePartyName"
              name="ResponsiblePartyName"
              value={formData.ResponsiblePartyName}
              onChange={handleInputChange}
              // required
            />
          </div>

          <div className="col-2">
            <label className="font-medium block" htmlFor="Date_dc">
              Date dc
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="date"
              id="Date_dc"
              name="Date_dc"
              value={formData.Date_dc}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="LASTEffective_Date">
              Last effective Date
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="date"
              id="LASTEffective_Date"
              name="LASTEffective_Date"
              value={formData.LASTEffective_Date}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="UpdatedDate">
              Updated Date
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="date"
              id="UpdatedDate"
              name="UpdatedDate"
              value={formData.UpdatedDate}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="CIF_FOB">
              CIF/FOB
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="CIF_FOB"
              name="CIF_FOB"
              value={formData.CIF_FOB}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="LASTPublicABP">
              Last public Abp
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="LASTPublicABP"
              name="LASTPublicABP"
              value={formData.LASTPublicABP}
              onChange={handleInputChange}
              // required
            />
          </div>

          <div className="col-3">
            <label className="font-medium block" htmlFor="LJ_FOB_ValueUSD">
              lj Fob Value Usd
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="number"
              id="LJ_FOB_ValueUSD"
              name="LJ_FOB_ValueUSD"
              value={formData.LJ_FOB_ValueUSD}
              onChange={handleInputChange}
              // required
            />

            <label
              className="font-medium block mt-3"
              htmlFor="WJ_Leb_PubPriceHos"
            >
              wjLeb Pub Price Hos
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="WJ_Leb_PubPriceHos"
              name="WJ_Leb_PubPriceHos"
              value={formData.WJ_Leb_PubPriceHos}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="Seq">
              Seq
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="Seq"
              name="Seq"
              value={formData.Seq}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="EffectOnFGN">
              Effect on FGN
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="EffectOnFGN"
              name="EffectOnFGN"
              value={formData.EffectOnFGN}
              onChange={handleInputChange}
              // required
            />
            <label className="font-medium block" htmlFor="SideEffect">
              Side Effect
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="SideEffect"
              name="SideEffect"
              value={formData.SideEffect}
              onChange={handleInputChange}
              // required
            />
          </div>

          <div className="col-">
            <label className="font-medium block" htmlFor="WEBCIF_FOB">
              Web cif/Fob
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="WEBCIF_FOB"
              name="WEBCIF_FOB"
              value={formData.WEBCIF_FOB}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="WEBPublicABP">
              Web public Abp
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="number"
              id="WEBPublicABP"
              name="WEBPublicABP"
              value={formData.WEBPublicABP}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="WEBCurrency">
              Web currency
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              id="WEBCurrency"
              name="WEBCurrency"
              value={formData.WEBCurrency}
              onChange={handleInputChange}
              // required
            />

            <label className="font-medium block" htmlFor="Posology">
              Posology
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="Posology"
              name="Posology"
              value={formData.Posology}
              onChange={handleInputChange}
              // required
            />
          </div>

          <div className="col-2 flex flex-col">
            <label className="font-medium block" htmlFor="GTIN">
              GTIN
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="GTIN"
              name="GTIN"
              value={formData.GTIN}
              onChange={handleInputChange}
              // required
            />
            <label className="font-medium block" htmlFor="Notes">
              Notes
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="Notes"
              name="Notes"
              value={formData.Notes}
              onChange={handleInputChange}
              // required
            />
            <label className="font-medium block" htmlFor="IngredientLabel">
              Ingredient Label
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="IngredientLabel"
              name="IngredientLabel"
              value={formData.IngredientLabel}
              onChange={handleInputChange}
              // required
            />
          </div>

          <div className="col-5">
            <label className="font-medium block" htmlFor="Description">
              Description
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              // required
            />
            <label
              className="font-medium block"
              htmlFor="ActiveInactiveIngredient"
            >
              Active Inactive Ingredient
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="ActiveInactiveIngredient"
              name="ActiveInactiveIngredient"
              value={formData.ActiveInactiveIngredient}
              onChange={handleInputChange}
              // required
            />
            <label className="font-medium block" htmlFor="Indication">
              Indication
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="Indication"
              name="Indication"
              value={formData.Indication}
              onChange={handleInputChange}
              // required
            />
          </div>

          <div className="col-">
            <label
              className="font-medium block"
              htmlFor="MethodOfAdministration"
            >
              Method Of Administration
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="MethodOfAdministration"
              name="MethodOfAdministration"
              value={formData.MethodOfAdministration}
              onChange={handleInputChange}
              // required
            />
            <label className="font-medium block" htmlFor="Contraindications">
              Contraindications
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="Contraindications"
              name="Contraindications"
              value={formData.Contraindications}
              onChange={handleInputChange}
              // required
            />
            <label className="font-medium block" htmlFor="PrecautionForUse">
              Precaution For Use
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="PrecautionForUse"
              name="PrecautionForUse"
              value={formData.PrecautionForUse}
              onChange={handleInputChange}
              // required
            />
          </div>

          <div className="col-">
            <label className="font-medium block" htmlFor="Toxicity">
              Toxicity
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="Toxicity"
              name="Toxicity"
              value={formData.Toxicity}
              onChange={handleInputChange}
              // required
            />
            <label className="font-medium block" htmlFor="StorageCondition">
              Storage Condition
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="StorageCondition"
              name="StorageCondition"
              value={formData.StorageCondition}
              onChange={handleInputChange}
              // required
            />
            <label className="font-medium block" htmlFor="ShelfLife">
              Shelf Life
            </label>
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
              type="text"
              id="ShelfLife"
              name="ShelfLife"
              value={formData.ShelfLife}
              onChange={handleInputChange}
              // required
            />
          </div>
        </div>

        <div className="checkboxes flex flex-wrap border-2 w-fit mb-4 justify-center gap-10 p-4">
          <div>
            <label className="font-medium block" htmlFor="HospPricing">
              Hosp Pricing
            </label>
            <input
              className="mb-4 cursor-pointer border rounded"
              type="checkbox"
              id="HospPricing"
              name="HospPricing"
              value={formData.HospPricing}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label className="font-medium block" htmlFor="IsDouanes">
              is Douanes:
            </label>
            <input
              className="mb-4 border cursor-pointer rounded"
              type="checkbox"
              id="IsDouanes"
              name="IsDouanes"
              value={formData.IsDouanes}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label className="font-medium block" htmlFor="NM">
              None Marketed
            </label>
            <input
              className="cursor-pointer border rounded"
              type="checkbox"
              id="NM"
              name="NM"
              value={formData.NM}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label className="font-medium block" htmlFor="isOtc">
              is Otc
            </label>
            <input
              className="border cursor-pointer rounded"
              type="checkbox"
              id="isOtc"
              name="isOtc"
              value={formData.isOtc}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label className="font-medium block" htmlFor="isNssf">
              is Nssf
            </label>
            <input
              className="border cursor-pointer rounded"
              type="checkbox"
              id="isNssf"
              name="isNssf"
              value={formData.isNssf}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label className="font-medium block" htmlFor="isNarcotis">
              is Narcotis
            </label>
            <input
              className="border cursor-pointer rounded"
              type="checkbox"
              id="isNarcotis"
              name="isNarcotis"
              value={formData.isNarcotis}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label className="font-medium block" htmlFor="isBiological">
              is Biological
            </label>
            <input
              className="border cursor-pointer rounded"
              type="checkbox"
              id="isBiological"
              name="isBiological"
              value={formData.isBiological}
              onChange={handleInputChange}
              // required
            />
          </div>{" "}
          <button type="submit" className="submit-button med-btn-pri-sm ">
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default DrugRegistryFormTest;
