/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
 
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect, useContext, createContext } from "react";

import { makeStyles } from "@mui/styles";
import { Step, Stepper, StepLabel } from "@mui/material";

import Axios from "../../../../../api/axios";

// Create the context
const DrugContext = createContext();

// Function to generate GUID
const generateGUID = () => uuidv4();

// Function to generate initial form data
const generateInitialFormData = () => ({
    Guid: generateGUID(),
    ATCGuid: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    // ATCGuid: null,
    // ATCCodes: null,
    DosageGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA6",
    // DosageGuid: generateGUID(),
    PresentationGuid: "91C44FF9-D234-4306-BF87-AE8894D0CF0C",
    // PresentationGuid: generateGUID(),
    FormGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA6",
    // FormGuid: generateGUID(),
    RouteGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA7",
    // RouteGuid: generateGUID(),
    StratumGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA7",
    // StratumGuid: generateGUID(),
    StratumTypeGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA6",
    // StratumTypeGuid: generateGUID(),
    // AgentGuid: generateGUID(),
    AgentGuid: "91647149-F532-488F-ACDF-C1FBC9A0945C",
    BrandGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA7",
    // BrandGuid: generateGUID(),
    ManufacturerGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA8",
    // ManufacturerGuid: generateGUID(),
    CountryGuid: "5920751D-3EDB-44B9-AA13-BD6B30AB8B65",
    // CountryGuid: generateGUID(),
    ResponsiblePartyGuid: "5920751D-3EDB-44B9-AA13-BD6B30AB8B66",
    // ResponsiblePartyGuid: generateGUID(),
    DrugLabelGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA2",
    // DrugLabelGuid: generateGUID(),
    LASTCurrencyGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA1",
    // LASTCurrencyGuid: generateGUID(),
    ATCName: "atc1",
    DosageName: "mg",
    PresentationName: "34",
    FormName: "Tablet",
    RouteName: "oral",
    StratumName: "Strat1",
    StratumTypeName: "StartType1",
    AgentName: "Mersaco",
    BrandName: "Nexium",
    ManufacturerName: "Bayer",
    CountryName: "germany",
    ResponsiblePartyName: "",
    DrugLabelName: "",
    Code: "1234",
    RegistrationNumber: "1234",
    CIF_FOB: "CIF",
    B_G: "Brand",
    Seq: "seq1",
    NM: true,
    REP_date: "2024-02-01",
    SubsidyPercentage: "10",
    LJ_FOB_ValueUSD: "1",
    LASTPublicABP: "1",
    LASTEffective_Date: "2024-02-01",
    WEBCIF_FOB: "FOB",
    WEBPublicABP: "1",
    WEBCurrency: "dollar",
    Date_dc: "2024-02-01",
    GTIN: "1234567891111",
    Notes: "Note for test",
    Description: "desc1",
    ActiveInactiveIngredient: "Para",
    Indication: "Ind1",
    Posology: "Pos1",
    WJ_Leb_PubPriceHos: "1",
    HospPricing: true,
    MethodOfAdministration: "meth1",
    Contraindications: "cont",
    PrecautionForUse: "precau",
    EffectOnFGN: "effe",
    SideEffect: "sideeffe",
    Toxicity: "Tox1",
    StorageCondition: "good",
    ShelfLife: "36",
    IngredientLabel: "Ingedient Label 1",
    IsDouanes: true,
    IsBiological: true,
    IsNarcotis: true,
    IsOTC: true,
    IsNSSF: true,
    PriceForeign: "",
    currencyForeign: "",
    PriceUSD: "2",
    PriceLBP: "180000",
    ImagesPath: "",
    ImageDefault: "",
    InteractionIngredientName: "int drug 1",
    UpdatedDate: "2024-02-01",
  });

const useStyles = makeStyles((theme) => ({
  stepperPaper: {
    boxShadow: "none",
    backgroundColor: "transparent",
  },
}));

function FormStepper({ currentStep, steps }) {
  const classes = useStyles();

  return (
    <Stepper
      activeStep={currentStep}
      alternativeLabel
      style={{ background: "transparent", boxShadow: "none" }}
    >
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel
            className={`dot  ${currentStep === index ? "active" : ""}`}
          />
        </Step>
      ))}
    </Stepper>
  );
}

// Create a context provider
export const DrugProvider = ({ children }) => {
  const [formData, setFormData] = useState(generateInitialFormData());
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === 6;
  const [error, setError] = useState(null);
  const [priceUSD, setPriceUSD] = useState("");
  const [priceLBP, setPriceLBP] = useState("");
  const [selectedDrugGuid, setSelectedDrugGuid] = useState(null);
  const [atcCodes, setAtcCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const exchangeRates = {
    USD: 1,
    CAD: 0.72,
    EUR: 1.08,
    CHF: 1.11,
    DKK: 0.72,
    GBP: 1.21,
    SAR: 0.27,
    JOD: 1.41,
    LBP: 90000,
  };

  const steps = [
    "Drug Registry",
    "Drug Registry Addons",
    "Drug Images",
    "Pricing Approval",
    "Marketing Approval",
    "Substance Information",
    "Unified Drug Information",
  ];

  const handleNext = () => {
    console.log("handleNext called");
    setCurrentStep((prevStep) => prevStep + 1);
    console.log("Current step:", currentStep); // Add this line to check the updated currentStep
  };

  const handleBack = () => {
    console.log("handleBack called");
    setCurrentStep((prevStep) => prevStep - 1);
    console.log("Current step:", currentStep); // Add this line to check the updated currentStep
  };

  // const handleNext = () => {
  //   console.log("handleNext called");
  //   if (currentStep === 2) {
  //     // Additional logic for a specific step if needed
  //   }
  //   setCurrentStep(currentStep + 1);
  // };

  // const handleBack = () => {
  //   console.log("handleBack called");
  //   setCurrentStep(currentStep - 1);
  // };

  const convertToUSD = () => {
    if (formData.PriceForeign && formData.currencyForeign) {
      const priceForeign = parseFloat(formData.PriceForeign);
      const exchangeRate = parseFloat(exchangeRates[formData.currencyForeign]);
      if (!isNaN(priceForeign) && !isNaN(exchangeRate) && exchangeRate !== 0) {
        const convertedPrice = priceForeign / exchangeRate;
        // console.log("Converted Price USD:", convertedPrice);
        return convertedPrice.toFixed(2);
      }
    }
    return "";
  };

  const convertToLBP = () => {
    if (formData.PriceForeign && formData.currencyForeign) {
      const priceInUSD = convertToUSD();
      const convertedPrice = priceInUSD * exchangeRates.LBP;
      // console.log("Converted Price LBP:", convertedPrice);
      return convertedPrice.toFixed(0);
    }
    return "";
  };

  useEffect(() => {
    // Calculate and set priceUSD whenever formData changes
    const newPriceUSD = convertToUSD();
    setPriceUSD(newPriceUSD);
  }, [formData]);

  useEffect(() => {
    // Calculate and set priceLBP whenever formData changes
    const newPriceLBP = convertToLBP();
    setPriceLBP(newPriceLBP);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If value is not empty and is a valid decimal, update the state
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }

    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const atcResponse = await Axios.get("http://localhost:3000/api/atc/v1.0");
        console.log("ATC Response:", atcResponse.data);
        const atcItems = Array.isArray(atcResponse.data)
          ? atcResponse.data
          : [];

        // Extract the first ATC item's GUID
        const atcGuid = atcItems.length > 0 ? atcItems[0].guid : null;

        if (atcGuid && isValidGUID(atcGuid)) {
          const atcCodeResponse = await Axios.get(
            `http://localhost:3000/api/atccodes/v1.0/codes/${atcGuid}`
          );
          console.log("ATC Code Response:", atcCodeResponse.data);
          const atcCodesGuid = atcCodeResponse.data.guid;

          setFormData((prevFormData) => ({
            ...prevFormData,
            ATCGuid: atcGuid,
            ATCCodes: atcCodesGuid,
          }));
        } else {
          console.error("Invalid ATCGuid format or empty ATC items array.");
          // Handle the case where ATCGuid is not valid or empty
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      // Calculate and update PriceUSD and PriceLBP in formData
      const PriceUSD = convertToUSD();
      const PriceLBP = convertToLBP();
      setFormData((prevFormData) => ({
        ...prevFormData,
        PriceUSD,
        PriceLBP,
      }));

      // If it's the last step, submit form data
      if (currentStep === steps.length - 1) {
        const response = await axios.post(
          "http://localhost:3000/drugs/add",
          formData
        );

        console.log(response.data); // Handle success response
        setFormData(generateInitialFormData()); // Reset form after successful submission
        setCurrentStep(0); // Reset to the first step after submission
      } else {
        // If it's not the last step, proceed to the next step
        handleNext();
      }
    } catch (error) {
      console.error("Error:", error); // Log any errors
      setError(error.response?.data?.error || "An error occurred"); // Handle error response
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Function to set selected drug
  const selectDrug = (drugData) => {
    setSelectedDrugGuid(drugData);
  };

  // Function to select ATC
  const selectATC = async (atcData) => {
    const { ATCGuid } = atcData; // Destructure ATCGuid from atcData

    try {
      setLoading(true);
      const atcResponse = await Axios.get(`http://localhost:3000/api/atc/v1.0`);
      const atcItems = Array.isArray(atcResponse.data) ? atcResponse.data : [];
      const atcCodeResponse = await Axios.get(
        `http://localhost:3000/api/atccodes/v1.0/codes/${ATCGuid}`
      );

      const atcCodeData = atcCodeResponse.data;

      // Handle ATC data as needed
      console.log("ATC Data:", atcCodeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear selected drug
  const clearselectedDrugGuid = () => {
    setSelectedDrugGuid(null);
  };

  // Context values
  const contextValues = {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handlePrevious,
    handleNext,
    handleBack,
    isLastStep,
    FormStepper,
    steps,
    error,
    exchangeRates,
    convertToUSD,
    convertToLBP,
    priceUSD,
    priceLBP,
    selectedDrugGuid,
    selectDrug,
    selectATC,
    clearselectedDrugGuid,
  };

  return (
    <DrugContext.Provider value={contextValues}>
      {children}
    </DrugContext.Provider>
  );
};

export const useDrugContext = () => useContext(DrugContext);
