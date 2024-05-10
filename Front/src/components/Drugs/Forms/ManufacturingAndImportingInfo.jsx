 
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

// import { useManufacturingAndImportingInfo } from '../../../context/ManufacturingAndImportingInfoContext';
import { useStepperContext } from '../../Drugs/StepperContext';

function ManufacturingAndImportingInfo(props) {
  const {
    formData,
    handleInputChange,
    handleCheckBoxChange,
    AddModal,
    openModal,
    closeModal,
    handleAdd,
    handleCancel,
    isModalOpen,
  } = useStepperContext();

  return (
    <div className="col-span-1 flex flex-col w-full h-full sm:col-span-1 text-black-text dark:text-white-text justify-center p-6">
      <h1 className="pb-4 pt-2 text-center text-[1.375rem] xs:text-xl sm:py-10 font-medium">
        7 - Manufacturing & Importing Informations
      </h1>
      {/* <div className=" flex h-full w-full flex-col"> */}
      <form className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:justify-items-center md:grid-cols-2 lg:grid-cols-3">
        <div className="input-container relative">
          <label htmlFor="responsibleParty" className="labels text-md block text-left">
            Responsible party
          </label>
          <input
            disabled
            value={formData.responsibleParty}
            onChange={(e) => handleInputChange('responsibleParty', e.target.value)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="bayer Hispania"
          />
        </div>

        <div className="input-container relative">
          <label htmlFor="responsiblePartyID" className="labels text-md block text-left">
            ID
          </label>
          <input
            disabled
            value={formData.responsiblePartyID}
            onChange={(e) => handleInputChange('responsiblePartyID', e.target.value)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder=""
          />
        </div>

        <div className="input-container relative">
          <label htmlFor="responsiblePartyCountry" className="labels text-md block text-left">
            Responsible party country
          </label>
          <input
            disabled
            value={formData.responsiblePartyCountry}
            onChange={(e) => handleInputChange('responsiblePartyCountry', e.target.value)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder=""
          />
        </div>

        <div className="input-container relative">
          <label htmlFor="manufacturer" className="labels text-md block text-left">
            Manufacturer
          </label>
          <input
            disabled
            value={formData.manufacturer}
            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder=""
          />
        </div>

        <div className="input-container relative">
          <label htmlFor="manufacturerID" className="labels text-md block text-left">
            ID
          </label>
          <input
            disabled
            value={formData.manufacturerID}
            onChange={(e) => handleInputChange('manufacturerID', e.target.value)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="auto"
          />
        </div>

        <div className="input-container relative">
          <label htmlFor="manufacturerCountry" className="labels text-md block text-left">
            Country of manufacturing
          </label>
          <input
            disabled
            value={formData.manufacturingCountry}
            // onChange={(e) =>
            //   handleInputChange("manufacturingCountry", e.target.value)
            // }
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder=""
          />
        </div>

        <div className="input-container relative">
          <label htmlFor="agent" className="labels text-md block text-left">
            Agent
          </label>
          <input
            disabled
            value={formData.agent}
            onChange={(e) => handleInputChange('agent', e.target.value)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder=""
          />
        </div>

        <div className="input-container flex flex-col">
          <label htmlFor="Notes" className="labels text-md block text-left">
            Notes
          </label>
          <textarea
            value={formData.Notes}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            name="Notes"
            placeholder=""
          />
        </div>
        <div className="checkboxes-container grid grid-col-span-1">
          <div className="row-1 flex justify-between">
            <div className="checkbox flex items-center justify-center">
              <label htmlFor="IsChronic" className="text-md">
                Chronic
              </label>
              <input
                name="IsChronic"
                type="checkbox"
                id="IsChronic"
                className="ml-2 cursor-pointer rounded"
                checked={formData.IsChronic}
                onChange={(e) => handleCheckBoxChange('IsChronic', e.target.checked)}
              />
            </div>
            <div className="checkbox flex items-center justify-center">
              <label htmlFor="IsAccute" className="text-md">
                Acute
              </label>
              <input
                name="IsAccute"
                type="checkbox"
                id="IsAccute"
                className="ml-2 cursor-pointer rounded"
                checked={formData.IsAccute}
                onChange={(e) => handleCheckBoxChange('IsAccute', e.target.checked)}
              />
            </div>
            <div className="checkbox flex items-center justify-center">
              <label htmlFor="IsEssential" className="text-md">
                Essential
              </label>
              <input
                type="checkbox"
                id="IsEssential"
                className="ml-2 cursor-pointer rounded"
                checked={formData.IsEssential}
                onChange={(e) => handleCheckBoxChange('IsEssential', e.target.checked)}
              />
            </div>
          </div>

          <div className="row-1 flex justify-between">
            <div className="checkbox flex items-center justify-center">
              <label htmlFor="IsDouane" className="text-md">
                Doaune
              </label>
              <input
                name="IsDouane"
                type="checkbox"
                id="IsDouane"
                className="ml-2 cursor-pointer rounded"
                checked={formData.IsDouane}
                onChange={(e) => handleCheckBoxChange('IsDouane', e.target.checked)}
              />
            </div>
            <div className="checkbox flex items-center justify-center">
              <label htmlFor="IsSubstitutable" className="text-md">
                Substitutable
              </label>
              <input
                name="IsSubstitutable"
                type="checkbox"
                id="IsSubstitutable"
                className="ml-2 cursor-pointer rounded"
                checked={formData.IsSubstitutable}
                onChange={(e) => handleCheckBoxChange('IsSubstitutable', e.target.checked)}
              />
            </div>
            <div className="checkbox flex items-center justify-center">
              <label htmlFor="NotMarketed" className="text-md">
                Marketed
              </label>
              <input
                type="checkbox"
                id="NotMarketed"
                className="ml-2 cursor-pointer rounded"
                checked={formData.NotMarketed}
                onChange={(e) => handleCheckBoxChange('NotMarketed', e.target.checked)}
              />
            </div>
          </div>

          <div className="row-1 flex justify-between">
            <div className="checkbox flex items-center justify-center">
              <label htmlFor="IsMentalHealth" className="text-md">
                Mental Health
              </label>
              <input
                type="checkbox"
                id="IsMentalHealth"
                className="ml-2 cursor-pointer rounded"
                checked={formData.IsMentalHealth}
                onChange={(e) => handleCheckBoxChange('IsMentalHealth', e.target.checked)}
              />
            </div>
            <div className="checkbox flex items-center justify-center">
              <label htmlFor="HospPricing" className="text-md">
                Hosp Pricing
              </label>
              <input
                type="checkbox"
                id="HospPricing"
                className="ml-2 cursor-pointer rounded"
                checked={formData.HospPricing}
                onChange={(e) => handleCheckBoxChange('HospPricing', e.target.checked)}
              />
            </div>
            <button
              className="w-fit rounded-xl bg-transparent p-2 text-[#00a651] focus:border-[#00a651] focus:outline-none focus:ring-1"
              onClick={openModal}
            >
              Add
            </button>
          </div>
        </div>
      </form>
      {isModalOpen && (
        <AddModal
          closeModal={closeModal}
          title="Add New Item"
          onAdd={handleAdd}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default ManufacturingAndImportingInfo;
