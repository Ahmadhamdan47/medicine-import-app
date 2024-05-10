/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import './styles.css';
// import { usePricingInformations } from '../../../context/PricingInformationsContext';
import { useStepperContext } from '../../Drugs/StepperContext';

function PricingInformations(props) {
  const {
    formData,
    handleInputChange,
    convertToLBP,
    convertToUSD,
    currencySymbols,
    exchangeRates,

    // SubsidyPercentageOptions,
  } = useStepperContext();

  const SubsidyLabelOptions = {
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

  const SubsidyPercentageOptions = {
    0: 0,
    45: '45',
    60: '60',
    65: '65',
    75: '75',
    80: '80',
    100: '100',
  };

  return (
    <div className="col-span-1 flex flex-col w-full h-full sm:col-span-1 text-black-text dark:text-white-text justify-center p-6">
      <h1 className="pb-4 pt-2 text-center text-[1.375rem] xs:text-xl sm:py-10 font-medium">
        6 - Pricing Informations
      </h1>
      <div className=" flex h-full w-full flex-col">
        <form className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:justify-items-center md:grid-cols-2 lg:grid-cols-3">
          <div className="input-container relative">
            <label htmlFor="PriceForeign" className="labels text-md mb-2 block text-left">
              Foreign Price
            </label>
            <div className="relative" style={{ borderColor: 'transparent' }}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-bold">
                <span className="text-green-pri">{currencySymbols[formData.CurrencyForeign]}</span>
              </div>
              <input
                name="PriceForeign"
                type="number"
                id="price"
                disabled
                className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-14 py-2 font-semibold shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                placeholder="0.00"
                autoComplete="off"
                value={formData.PriceForeign || ''}
                // value={formData?.PriceForeign}
                onChange={(e) => handleInputChange(e)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <label htmlFor="CurrencyForeign" className="sr-only ">
                  Foreign Currency
                </label>
                <select
                  id="currency"
                  name="CurrencyForeign"
                  disabled
                  className="w-20 appearance-none rounded-r-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow pr-2 py-2 font-normal shadow outline-none focus:border-green-pri focus:outline-none focus:ring-1 focus:ring-green-pri dark:focus:ring-1 dark:focus:ring-green-pri sm:w-20"
                  onChange={(e) => handleInputChange(e)}
                  value={formData.CurrencyForeign || ''}
                  // value={formData.CurrencyForeign}
                >
                  {Object.keys(exchangeRates).map((CurrencyForeign) => (
                    <option key={CurrencyForeign} value={CurrencyForeign}>
                      {CurrencyForeign}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="input-container relative">
            <label className="labels text-md block text-left">Foreign Price in USD</label>
            <input
              name="convertToUSD"
              disabled
              className="converted-price-usd mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              value={` ${convertToUSD()}`}
            />
          </div>
          <div className="input-container relative">
            <label className="labels text-md block text-left">Foreign Price in LBP</label>
            <input
              name="convertToLBP"
              disabled
              className="converted-price-usd mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              value={
                ` ${parseFloat(convertToLBP().replace('.', '')).toLocaleString(
                  'en-LB'
                )}` /* Add thousands separator */
              }
            />
          </div>

          <div className="input-container w-full">
            <label htmlFor="stratum" className="labels text-md block text-left">
              Stratum
            </label>
            <input
              name="stratum"
              disabled
              value={formData.stratum}
              onChange={(e) => handleInputChange(e)}
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              type="text"
              placeholder="E1"
            />
          </div>

          <div className="input-container relative">
            <label htmlFor="cargoShippingTerms" className="labels text-md block text-left">
              Cargo & Shipping Terms
            </label>
            <input
              name="cargoShippingTerms"
              disabled
              value={formData.cargoShippingTerms}
              onChange={(e) => handleInputChange(e)}
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            />
          </div>

          <div className="input-container relative">
            <label htmlFor="cargoShipping" className="labels text-md block text-left">
              Cargo & Shipping
            </label>
            <input
              name="cargoShipping"
              disabled
              value={formData.cargoShipping}
              onChange={(e) => handleInputChange(e)}
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            />
          </div>

          <div className="input-container relative">
            <label htmlFor="douanes" className="labels text-md block text-left">
              Douanes
            </label>
            <select
              name="douanes"
              value={formData.douanes}
              onChange={(e) => handleInputChange(e)}
              className="mt-1 w-full rounded-full cursor-pointer border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            >
              <option selected disabled value="">
                select a value
              </option>
              <option value="0%"> 0% </option>
              <option value="5%"> 5% </option>
            </select>
          </div>

          <div className="input-container relative">
            <label htmlFor="SubsidyLabel" className="labels text-md block text-left">
              Subsidization Label
            </label>
            <select
              id="SubsidyLabel"
              name="SubsidyLabel"
              className="mt-1 w-full rounded-full cursor-pointer border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              onChange={(e) => handleInputChange(e)}
              value={formData.SubsidyLabel}
            >
              <option selected disabled value="">
                Select a unit
              </option>
              {Object.keys(SubsidyLabelOptions).map((SubsidyLabel) => (
                <option key={SubsidyLabel} value={SubsidyLabel}>
                  {SubsidyLabel}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container relative">
            <label htmlFor="SubsidyPercentage" className="labels text-md block text-left">
              Subsidization Percentage
            </label>
            <select
              id="SubsidyPercentage"
              name="SubsidyPercentage"
              className="mt-1 w-full rounded-full cursor-pointer border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              onChange={(e) => handleInputChange(e)}
              value={formData.SubsidyPercentage}
            >
              <option selected disabled value="">
                Select a %
              </option>
              {Object.keys(SubsidyPercentageOptions).map((SubsidyPercentage) => (
                <option key={SubsidyPercentage} value={SubsidyPercentage}>
                  {SubsidyPercentage}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container relative">
            <label htmlFor="agentProfitMargin" className="labels text-md block text-left">
              Agent profit margin
            </label>
            <input
              name="agentProfitMargin"
              disabled
              value={formData.agentProfitMargin}
              onChange={(e) => handleInputChange(e)}
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              type="text"
              placeholder="0"
            />
          </div>

          <div className="input-container relative">
            <label htmlFor="pharmacistProfitMargin" className="labels text-md block text-left">
              Pharmacist profit margin
            </label>
            <input
              name="pharmacistProfitMargin"
              disabled
              value={formData.pharmacistProfitMargin}
              onChange={(e) => handleInputChange(e)}
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              type="text"
              placeholder="0"
            />
          </div>

          <div className="input-container relative">
            <label htmlFor="DrugName" className="labels text-md block text-left">
              Drug Name
            </label>
            <input
              name="DrugName"
              disabled
              value={formData.DrugName}
              onChange={(e) => handleInputChange(e)}
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              type="text"
              placeholder="name"
            />
          </div>

          <div className="input-container relative">
            <label htmlFor="hospitalPriceLBP" className="labels text-md block text-left">
              Hospital Price - LBP
            </label>
            <input
              name="hospitalPriceLBP"
              disabled
              value={formData.hospitalPriceLBP}
              onChange={(e) => handleInputChange(e)}
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              type="text"
              placeholder="0"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PricingInformations;
