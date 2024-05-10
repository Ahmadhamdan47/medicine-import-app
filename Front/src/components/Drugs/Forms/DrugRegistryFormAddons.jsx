/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import './styles.css';
import { useStepperContext } from '../../Drugs/StepperContext';

const DrugRegistryFormAddons = () => {
  const { formData, handleInputChange } = useStepperContext();

  return (
    <div className="col-span-1 flex flex-col w-full h-full sm:col-span-1 text-black-text dark:text-white-text justify-center p-6">
      <h1 className="pb-2 pt-2 text-center text-[1.375rem] xs:text-xl sm:py-10 font-medium">
        3 - Drug Registry Additional Info
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 pt-6">
        <div className="input-container flex flex-col">
          <label htmlFor="Description" className="labels text-md block text-left">
            Product Description
          </label>
          <input
            id="Description"
            name="Description"
            type="text"
            value={formData.Description}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>
        
        <div className="input-container flex flex-col">
          <label htmlFor="PrimaryContainerPackage" className="labels text-md block text-left">
            Primary Container Package
          </label>
          <input
            id="PrimaryContainerPackage"
            name="PrimaryContainerPackage"
            type="text"
            value={formData.PrimaryContainerPackage}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="Indication" className="labels text-md block text-left">
            Indication
          </label>
          <input
            id="Indication"
            name="Indication"
            type="text"
            value={formData.Indication}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="ActiveInactiveIngredient" className="labels text-md block text-left">
            Active/Inactive Ingredients
          </label>
          <input
            id="ActiveInactiveIngredient"
            name="ActiveInactiveIngredient"
            type="text"
            value={formData.ActiveInactiveIngredient}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="Posology" className="labels text-md block text-left">
            Posology
          </label>
          <input
            id="Posology"
            name="Posology"
            type="text"
            value={formData.Posology}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="MethodOfAdministration" className="labels text-md block text-left">
            Method of administration
          </label>
          <input
            id="MethodOfAdministration"
            name="MethodOfAdministration"
            type="text"
            value={formData.MethodOfAdministration}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="Contraindications" className="labels text-md block text-left">
            Contraindications
          </label>
          <input
            id="Contraindications"
            name="Contraindications"
            type="text"
            value={formData.Contraindications}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="PrecautionForUse" className="labels text-md block text-left">
            Precautions for use
          </label>
          <input
            id="PrecautionForUse"
            name="PrecautionForUse"
            type="text"
            value={formData.PrecautionForUse}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="EffectOnFGN" className="labels text-md block text-left">
            Effects on FGN
          </label>
          <input
            id="EffectOnFGN"
            name="EffectOnFGN"
            type="text"
            value={formData.EffectOnFGN}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="SideEffect" className="labels text-md block text-left">
            Side Effects
          </label>
          <input
            id="SideEffect"
            name="SideEffect"
            type="text"
            value={formData.SideEffect}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="Toxicity" className="labels text-md block text-left">
            Toxicity
          </label>
          <input
            id="Toxicity"
            name="Toxicity"
            type="text"
            value={formData.Toxicity}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="StorageCondition" className="labels text-md block text-left">
            Storage Conditions
          </label>
          <input
            id="StorageCondition"
            name="StorageCondition"
            type="text"
            value={formData.StorageCondition}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="ShelfLife" className="labels text-md block text-left">
            Shelf Life
          </label>
          <input
            id="ShelfLife"
            name="ShelfLife"
            type="text"
            value={formData.ShelfLife}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
};
export default DrugRegistryFormAddons;
