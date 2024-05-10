/* eslint-disable react/prop-types */
 
import React, { useState, useContext } from 'react';

// import AddModal from '../components/Modals/AddModal';

const PricingInformationsContext = React.createContext();

const exchangeRates = {
  USD: 1,
  CAD: 0.72,
  EUR: 1.06,
  CHF: 1.11,
  DKK: 0.72,
  GBP: 1.21,
  SAR: 0.27,
  JOD: 1.41,
  LBP: 900,
};

const currencySymbols = {
  USD: '$',
  CAD: 'C$',
  EUR: '€',
  CHF: 'CHF',
  DKK: 'kr',
  GBP: '£',
  SAR: '﷼',
  JOD: 'JD',
  LBP: 'ل.ل',
};

const subsidizationLabelOptions = {
  'Non subsidized': 'Non subsidized',
  'Non subsidized PP-40%': 'Non subsidized PP-40%',
  'List serum': 'List serum',
  'Non subsidized PP-35%': 'Non subsidized PP-35%',
  'raw material 45% PP-55%': 'raw material 45% PP-55%',
  'Imported A1A2B chronic': 'Imported A1A2B chronic',
  Insulin: 'Insulin',
  'List locally manufactured': 'List locally manufactured',
  'Imported A1A2B B80': 'Imported A1A2B B80',
  'Non subsidized PP-50%': 'Non subsidized PP-50%',
  'Decision 945': 'Decision 945',
  PPX3: 'PPX3',
  'Non subsidized PP-25%': 'Non subsidized PP-25%',
  'Non subsidized PP-53.28%': 'Non subsidized PP-53.28%',
  'Non subsidized PP-30%': 'Non subsidized PP-30%',
  'Imported A1A2B D80': 'Imported A1A2B D80',
  'Imported A1A2B C65': 'Imported A1A2B C65',
  'Imported A1A2B chronic Decision 945': 'Imported A1A2B chronic Decision 945',
  'Decision 945 PPX3': 'Decision 945 PPX3',
  'Non subsidized PP-39%': 'Non subsidized PP-39%',
  'Imported A1A2B chronic Y1': 'Imported A1A2B chronic Y1',
  'Imported A1A2B chronic Y2': 'Imported A1A2B chronic Y2',
};

const subsidizationPercentageOptions = {
  0: 0,
  45: '45',
  60: '60',
  65: '65',
  75: '75',
  80: '80',
  100: '100',
};

export const usePricingInformations = () => useContext(PricingInformationsContext);

export const PricingInformationsContextProvider = ({ children }) => {
  // State for form data
  const [formDataStep4, setFormDataStep4] = useState({
    priceForeign: '',
    currencyForeign: '',
    stratum: '',
    cargoShippingTerms: '',
    cargoShipping: '',
    douanes: '',
    subsidizationLabel: '',
    subsidizationPercentage: '',
    agentProfitMargin: '',
    pharmacistProfitMargin: '',
    drugName: '',
    hospitalPriceLBP: '',
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataStep4((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  function convertToUSD() {
    if (formDataStep4 && formDataStep4.priceForeign && formDataStep4.currencyForeign) {
      const convertedPrice =
        formDataStep4.priceForeign / exchangeRates[formDataStep4.currencyForeign];
      return convertedPrice.toFixed(2); // Display with 2 decimal places
    }
    return '';
  }

  function convertToLBP() {
    if (formDataStep4 && formDataStep4.priceForeign && formDataStep4.currencyForeign) {
      const priceInUSD = convertToUSD();
      const convertedPrice = (priceInUSD / exchangeRates.USD) * exchangeRates.LBP;
      return convertedPrice.toFixed(2); // Display with 2 decimal places
    }
    return '';
  }

  // Function to submit the form data
  const handleSubmit = () => {
    // Add your submission logic here
    console.log('Form submitted:', formDataStep4);
  };

  return (
    <PricingInformationsContext.Provider
      value={{
        formDataStep4,
        handleInputChange,
        handleSubmit,
        convertToLBP,
        convertToUSD,
        currencySymbols,
        exchangeRates,
        subsidizationLabelOptions,
        subsidizationPercentageOptions,
      }}
    >
      {children}
    </PricingInformationsContext.Provider>
  );
};


// ///////////////////////////////////////////////////



 
 
// import React, { useState, useContext } from 'react';

// import AddModal from '../components/Modals/AddModal';

// const PricingInformationsContext = React.createContext();

// const exchangeRates = {
//   USD: 1,
//   CAD: 0.72,
//   EUR: 1.06,
//   CHF: 1.11,
//   DKK: 0.72,
//   GBP: 1.21,
//   SAR: 0.27,
//   JOD: 1.41,
//   LBP: 900,
// };

// const currencySymbols = {
//   USD: '$',
//   CAD: 'C$',
//   EUR: '€',
//   CHF: 'CHF',
//   DKK: 'kr',
//   GBP: '£',
//   SAR: '﷼',
//   JOD: 'JD',
//   LBP: 'ل.ل',
// };

// const subsidizationLabelOptions = {
//   'Non subsidized': 'Non subsidized',
//   'Non subsidized PP-40%': 'Non subsidized PP-40%',
//   'List serum': 'List serum',
//   'Non subsidized PP-35%': 'Non subsidized PP-35%',
//   'raw material 45% PP-55%': 'raw material 45% PP-55%',
//   'Imported A1A2B chronic': 'Imported A1A2B chronic',
//   Insulin: 'Insulin',
//   'List locally manufactured': 'List locally manufactured',
//   'Imported A1A2B B80': 'Imported A1A2B B80',
//   'Non subsidized PP-50%': 'Non subsidized PP-50%',
//   'Decision 945': 'Decision 945',
//   PPX3: 'PPX3',
//   'Non subsidized PP-25%': 'Non subsidized PP-25%',
//   'Non subsidized PP-53.28%': 'Non subsidized PP-53.28%',
//   'Non subsidized PP-30%': 'Non subsidized PP-30%',
//   'Imported A1A2B D80': 'Imported A1A2B D80',
//   'Imported A1A2B C65': 'Imported A1A2B C65',
//   'Imported A1A2B chronic Decision 945': 'Imported A1A2B chronic Decision 945',
//   'Decision 945 PPX3': 'Decision 945 PPX3',
//   'Non subsidized PP-39%': 'Non subsidized PP-39%',
//   'Imported A1A2B chronic Y1': 'Imported A1A2B chronic Y1',
//   'Imported A1A2B chronic Y2': 'Imported A1A2B chronic Y2',
// };

// const subsidizationPercentageOptions = {
//   0: 0,
//   45: '45',
//   60: '60',
//   65: '65',
//   75: '75',
//   80: '80',
//   100: '100',
// };

// export const usePricingInformations = () => useContext(PricingInformationsContext);

// export const PricingInformationsContextProvider = ({ children }) => {
//   const [formDataStep4, setFormDataStep4] = useState({
//     priceForeign: '',
//     currencyForeign: '',
//     stratum: '',
//     cargoShippingTerms: '',
//     cargoShipping: '',
//     douanes: '',
//     subsidizationLabel: '',
//     subsidizationPercentage: '',
//     agentProfitMargin: '',
//     pharmacistProfitMargin: '',
//     drugName: '',
//     hospitalPriceLBP: '',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormDataStep4((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const convertToUSD = () => {
//     if (formDataStep4.priceForeign && formDataStep4.currencyForeign) {
//       const convertedPrice =
//         formDataStep4.priceForeign / exchangeRates[formDataStep4.currencyForeign];
//       return convertedPrice.toFixed(2);
//     }
//     return '';
//   };

//   const convertToLBP = () => {
//     if (formDataStep4.priceForeign && formDataStep4.currencyForeign) {
//       const priceInUSD = convertToUSD();
//       const convertedPrice = (priceInUSD / exchangeRates.USD) * exchangeRates.LBP;
//       return convertedPrice.toFixed(2);
//     }
//     return '';
//   };

//   const handleSubmit = () => {
//     // Here, you can implement your submission logic, such as sending data to an API
//     console.log('Form submitted:', formDataStep4);
//     // Reset the form after submission
//     setFormDataStep4({
//       priceForeign: '',
//       currencyForeign: '',
//       stratum: '',
//       cargoShippingTerms: '',
//       cargoShipping: '',
//       douanes: '',
//       subsidizationLabel: '',
//       subsidizationPercentage: '',
//       agentProfitMargin: '',
//       pharmacistProfitMargin: '',
//       drugName: '',
//       hospitalPriceLBP: '',
//     });
//   };

//   return (
//     <PricingInformationsContext.Provider
//       value={{
//         formDataStep4,
//         handleInputChange,
//         handleSubmit,
//         convertToLBP,
//         convertToUSD,
//         currencySymbols,
//         exchangeRates,
//         subsidizationLabelOptions,
//         subsidizationPercentageOptions,
//       }}
//     >
//       {children}
//     </PricingInformationsContext.Provider>
//   );
// };
