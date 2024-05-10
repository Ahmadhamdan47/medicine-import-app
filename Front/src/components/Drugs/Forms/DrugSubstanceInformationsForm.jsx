
import React from 'react';

import { useStepperContext } from '../../Drugs/StepperContext';


function DrugSubstanceInformationsForm() {
  const { formData, handleInputChange } = useStepperContext();

  return (
    <div className="col-span-1 flex flex-col w-full h-full sm:col-span-1 text-black-text dark:text-white-text justify-center p-6">
      <h1 className="pb-2 pt-2 text-center text-[1.375rem] xs:text-xl sm:py-10 font-medium">
        4- Drug substance & finished product quality informations
      </h1>

      <div className="grid grid-cols-1 items-center gap-10 md:gap-16 sm:grid-cols-2 sm:justify-items-center md:grid-cols-2 lg:grid-cols-3">
        <div className="input-container py- relative mt-4">
          <label htmlFor="IngredientAndStrength" className="labels text-md block text-left">
            Ingredients & Strength
          </label>
          <input
            name="IngredientAndStrength"
            value={formData.IngredientAndStrength}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            autoComplete="off"
            placeholder="enter a value"
          />
        </div>

        <div className="input-container">
          <label htmlFor="form" className="labels text-md mt-4 block text-left">
            Form
          </label>
          <input
            name="form"
            value={formData.form}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            autoComplete="off"
            placeholder="drug form"
          />
        </div>

        <div className="input-container">
          <label htmlFor="primaryContainerPackage" className="labels text-md mt-4 block text-left">
            Primary container / Package
          </label>
          <input
            name="primaryContainerPackage"
            value={formData.primaryContainerPackage}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            autoComplete="off"
            placeholder="container / package"
          />
        </div>

        <div className="input-container">
          <label htmlFor="ManufacturerID" className="labels text-md mt-4 block text-left">
            Manufacturer
          </label>
          <input
            name="ManufacturerID"
            disabled
            value={formData.ManufacturerID}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder=""
          />
        </div>

        <div className="input-container">
          <label htmlFor="manufacturingCountry" className="labels text-md mt-4 block text-left">
            Manufacturing Country
          </label>
          <input
            name="manufacturingCountry"
            disabled
            value={formData.manufacturingCountry}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="Country"
          />
        </div>

        <div className="input-container relative">
          <label htmlFor="AgentGuid" className="labels text-md mt-4 block text-left">
            Agent
          </label>
          <select
            name="AgentGuid"
            value={formData.AgentGuid}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full cursor-pointer border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          >
            <option value="" disabled>
              select an agent
            </option>
            <option value="Omnipharma"> Omnipharma </option>
            <option value="Pharmaline"> Pharmaline </option>
            <option value="Benta SAL"> Benta SAL </option>
            <option value="Mersaco"> Mersaco </option>
          </select>
        </div>

        <div className="input-container mt-4 w-full">
          <label htmlFor="AtcCode" className="labels text-md block text-left">
            ATC Code
          </label>
          <input
            name="AtcCode"
            value={formData.AtcCode}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            autoComplete="off"
            placeholder="enter a value"
          />
        </div>

        <div className="input-container mt-4 w-full">
          <label htmlFor="ATCRelatedIngredient" className="labels text-md block text-left">
            ATC related ingredients
          </label>
          <input
            name="ATCRelatedIngredient"
            disabled
            value={formData.ATCRelatedIngredient}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="enter a value"
          />
        </div>
      </div>
    </div>
  );
}

export default DrugSubstanceInformationsForm;
