/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import AddModal from '../../../components/Modals/AddModal';
import { useUnifiedDrugInformation } from '../../../Contexts/UnifiedDrugInformationsContext';
import { useStepperContext } from '../../Drugs/StepperContext';

function UnifiedDrugInformations() {
  const {
    formData,
    handleInputChange,
    handleCheckBoxChange,
    isModalOpen,
    openModal,
    closeModal,
    handleAdd,
    handleCancel,
    dosageOptions,
    dosageFormOptions,
    routeOptions,
    presentationContainerOptions,
    prescriptionAndDispensingConditionOptions,
  } = useStepperContext();

  return (
    <div className="col-span-1 flex flex-col w-full h-full sm:col-span-1 text-black-text dark:text-white-text justify-center ">
      <h1 className="pb-4 pt-2 text-center text-[1.375rem] xs:text-xl sm:py-10 font-medium">
        5- Unified Drug Informations
      </h1>
      <div className="table-container">
        <table className="whole-table-main-row w-full flex-col overflow-x-hidden ">
          {/* TABLE HEADER START */}
          <thead className="w-full flex justify-center bg-white-input dark:bg-black-shadow">
            <tr className="w-full flex justify-center items-center">
              <td className="AGENT-MAIN-COL w-full flex justify-center border-r border-white-contents dark:border-[#3a3c3d] bg-white-input p-2 text-center text-lg font-bold text-gray-800">
                By the Agent
              </td>
              <td className="IED-MAIN-COL w-full flex justify-center border-l border-white-contents dark:border-[#3a3c3d] bg-white-input p-2 text-center text-lg font-bold text-gray-800">
                By the IED
              </td>
            </tr>
          </thead>

          {/* TABLE HEADER END */}

          <tbody className="flex flex-row border border-white-input dark:border-[#3a3c3d]">
            {/* AGENT COLOMUN START */}
            <tr className="agent-col flex-1 border-r border-white-input dark:border-[#3a3c3d] p-2">
              <td>
                <div className="mt-2 grid grid-cols-1 gap-4  lg:grid-cols-2 xl:grid-cols-3">
                  <div className="input-container relative">
                    <label htmlFor="Type" className="labels text-md block text-left">
                      Type
                    </label>
                    <input
                      name="Type"
                      disabled
                      value={formData.Type}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                    />
                  </div>

                  <div className="input-container relative">
                    <label htmlFor="RegistrationNumber" className="labels text-md block text-left">
                      Registration Number
                    </label>
                    <input
                      name="RegistrationNumber"
                      disabled
                      value={formData.RegistrationNumber}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                      type="text"
                      autoComplete="off"
                      placeholder="reg #"
                    />
                  </div>
                  <div className="input-container sm:col-span-full md:col-span-1 lg:col-span-full xl:col-span-1 2xl:col-span-1 relative">
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
                      autoComplete="off"
                      placeholder="name"
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-6 lg:grid-cols-2">
                  <div className="input-container mt-4 w-full">
                    <label
                      htmlFor="atcRelatedIngredients"
                      className="labels text-md block text-left"
                    >
                      ATC related ingredients
                    </label>
                    <input
                      name="atcRelatedIngredients"
                      disabled
                      value={formData.atcRelatedIngredients}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                      type="text"
                      autoComplete="off"
                      placeholder="enter a value"
                    />
                  </div>
                  <div className="input-container mt-4 w-full">
                    <label htmlFor="atcCode" className="labels text-md block text-left">
                      ATC Code
                    </label>
                    <input
                      name="atcCode"
                      disabled
                      value={formData.atcCode}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                      type="text"
                      autoComplete="off"
                      placeholder="enter a value"
                    />
                  </div>
                </div>

                <div className="mt-4 grid w-full grid-cols-1 gap-6 lg:grid-cols-1 px-4 py-3 border rounded-xl border-[#3a3c3d60]">
                  <div className="input-container relative flex flex-col justify-evenly h-80">
                    <div className="input-container relative">
                      <label
                        htmlFor="IngredientAndStrength"
                        className="labels text-md block text-left mb-1"
                      >
                        Ingredients & Strength
                      </label>
                      <input
                        name="IngredientAndStrength"
                        disabled
                        onChange={(e) => handleInputChange(e)}
                        value={formData.IngredientAndStrength}
                        className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                        type="text"
                        placeholder="enter a value"
                      />
                    </div>

                    <div className="input-container relative">
                      <label htmlFor="Form" className="labels text-md block text-left">
                        Form
                      </label>
                      <input
                        name="Form"
                        disabled
                        value={formData.Form}
                        onChange={(e) => handleInputChange(e)}
                        className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                        type="text"
                        placeholder="drug form"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-evenly border rounded-xl border-[#3a3c3d60] p-4 mt-52">
                  {/* <div className="input-container relative mt-16"> */}
                  <label
                    htmlFor="PrimaryContainerPackage"
                    className="labels text-md block text-left"
                  >
                    Primary container / Package
                  </label>
                  <input
                    name="PrimaryContainerPackage"
                    disabled
                    value={formData.PrimaryContainerPackage}
                    onChange={(e) => handleInputChange(e)}
                    className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                    type="text"
                    placeholder="container / package"
                  />
                </div>
              </td>
            </tr>
            {/* AGENT COLOMUN ENDS */}

            {/* ******************************** COLUMN 2 CONTENTS AND LAYOUTS *********************************************************  */}

            {/* IED COLOMUN START */}
            <tr className="ied-col flex-1  border-white-contents dark:border-[#3a3c3d] p-2">
              <td>
                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  <div className="input-container relative">
                    <label htmlFor="Type" className="labels text-md block text-left">
                      Type
                    </label>
                    <select
                      name="Type"
                      value={formData.Type}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                    >
                      <option value="" disabled>
                        select a type
                      </option>
                      <option value="Brand">Brand</option>
                      <option value="Generic">Generic</option>
                      <option value="Biological Bio-Human">Biological: Bio - Human</option>
                      <option value="Biological Bio-Similar">Biological: Bio - Similar</option>
                    </select>
                  </div>

                  <div className="input-container relative">
                    <label htmlFor="RegistrationNumber" className="labels text-md block text-left">
                      Registration Number
                    </label>
                    <input
                      name="RegistrationNumber"
                      value={formData.RegistrationNumber}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                      type="text"
                      autoComplete="off"
                      placeholder="reg #"
                    />
                  </div>
                  <div className="input-container sm:col-span-full md:col-span-1 lg:col-span-full xl:col-span-1 2xl:col-span-1 relative">
                    <label htmlFor="DrugName" className="labels text-md block text-left">
                      Drug Name
                    </label>
                    <input
                      name="DrugName"
                      value={formData.DrugName}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                      type="text"
                      autoComplete="off"
                      placeholder="name"
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-6 lg:grid-cols-2">
                  <div className="input-container mt-4 w-full">
                    <label
                      htmlFor="atcRelatedIngredients"
                      className="labels text-md block text-left"
                    >
                      ATC related ingredients
                    </label>
                    <input
                      name="atcRelatedIngredients"
                      value={formData.atcRelatedIngredients}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                      type="text"
                      autoComplete="off"
                      placeholder="enter a value"
                    />
                  </div>

                  <div className="input-container mt-4 w-full">
                    <label htmlFor="atcCode" className="labels text-md block text-left">
                      ATC Code
                    </label>
                    <input
                      name="atcCode"
                      value={formData.atcCode}
                      onChange={(e) => handleInputChange(e)}
                      className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                      type="text"
                      autoComplete="off"
                      placeholder="enter a value"
                    />
                  </div>
                </div>

                <div className="py-4 px-2 border rounded-xl border-[#3a3c3d60] mt-4">
                  <div className="mt-4 grid w-full grid-cols-1 gap-6">
                    <div className="input-container mt-2 w-full">
                      <div className="flex w-full items-center justify-between">
                        <label
                          htmlFor="dosageValueN"
                          className="labels text-md block pb-2 text-left "
                        >
                          Dosage Value (N)
                        </label>
                      </div>
                      <div className="relative" style={{ borderColor: 'transparent' }}>
                        <input
                          type="number"
                          name="dosageValueN"
                          autoComplete="off"
                          id="dosageValueN"
                          className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                          placeholder="0"
                          value={formData.dosageValueN}
                          onChange={(e) => handleInputChange(e)}
                        />
                        <div className="absolute  inset-y-0 right-0 flex items-center">
                          <select
                            id="dosageUnitN"
                            autoComplete="off"
                            name="dosageUnitN"
                            className="w-16 cursor-pointer appearance-none rounded-r-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-fg p-2 pr-8 font-normal outline-none focus:border-green-pri focus:outline-none focus:ring-1 focus:ring-green-pri xs:w-24 md:w-44"
                            value={formData.dosageUnitN}
                            onChange={(e) => handleInputChange(e)}
                          >
                            <option value="" disabled>
                              Select a unit
                            </option>
                            {Object.keys(dosageOptions).map((dosageUnitN) => (
                              <option key={dosageUnitN} value={dosageUnitN}>
                                {dosageUnitN}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="input-container w-full">
                      <div className="flex w-full items-center justify-between">
                        <label
                          htmlFor="dosageValueD"
                          className="labels text-md block text-left mt-2"
                        >
                          Value (D)
                        </label>

                        <div className="btn-cont mt-">
                          <button
                            onClick={openModal}
                            type="button"
                            className="w-fit rounded-xl bg-transparent p-2 text-[#00a651]  focus:border-[#00a651] focus:outline-none focus:ring-1"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="dosageValueD"
                          autoComplete="off"
                          id="dosageValueD"
                          className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                          placeholder="0"
                          value={formData?.dosageValueD}
                          onChange={(e) => handleInputChange(e)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <select
                            id="dosageUnitD"
                            name="dosageUnitD"
                            className="w-16 cursor-pointer appearance-none rounded-r-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-fg p-2 pr-8 font-normal outline-none focus:border-green-pri focus:outline-none focus:ring-1 focus:ring-green-pri xs:w-24 md:w-44"
                            onChange={(e) => handleInputChange(e)}
                            value={formData.dosageUnitD}
                          >
                            <option value="" disabled>
                              Select a unit
                            </option>
                            {Object.keys(dosageOptions).map((dosageUnit) => (
                              <option key={dosageUnit} value={dosageUnit}>
                                {dosageUnit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="input-container w-full">
                      <div className="input-child-container flex justify-between items-center">
                        <label htmlFor="doseForm" className="labels text-md mt-2 flex text-left">
                          Dose form
                        </label>

                        <div className="checkbox flex flex-col md:flex-row items-end md:items-center justify-center">
                          <div className="flex justify-between items-center">
                            <label htmlFor="IsScore" className="text-md">
                              Score
                            </label>
                            <input
                              name="IsScore"
                              type="checkbox"
                              id="IsScore"
                              className="ml-2 mr-2 rounded"
                              checked={formData.IsScore}
                              // onChange={(e) => handleInputChange(e)}
                              onChange={(e) => handleCheckBoxChange('IsScore', e.target.checked)}
                            />
                          </div>
                          <button
                            onClick={openModal}
                            type="button"
                            className="w-fit rounded-xl bg-transparent p-2 text-[#00a651]  focus:border-[#00a651] focus:outline-none focus:ring-1"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <select
                          id="doseForm"
                          name="doseForm"
                          autoComplete="off"
                          className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                          value={formData.doseForm}
                          onChange={(e) => handleInputChange(e)}
                        >
                          <option value="" disabled>
                            Select a route
                          </option>
                          {Object.keys(dosageFormOptions).map((doseForm) => (
                            <option key={doseForm} value={doseForm}>
                              {doseForm}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid w-full grid-cols-1 gap-6 pb-4 ">
                  <div className="input-container w-full px-2">
                    <div className="input-child-container flex justify-between items-center">
                      <label htmlFor="route" className="labels text-md mt-2 block text-left">
                        Route
                      </label>

                      <div className="checkbox flex flex-col md:flex-row items-end md:items-center ">
                        <div className="flex justify-between items-center">
                          <label htmlFor="IsParentaral" className="text-md">
                            Parentaral
                          </label>
                          <input
                            name="IsParentaral"
                            type="checkbox"
                            id="IsParentaral"
                            className="ml-2 mr-2 rounded"
                            checked={formData.IsParentaral}
                            // onChange={(e) => handleInputChange(e)}
                            onChange={(e) => handleCheckBoxChange('IsParentaral', e.target.checked)}
                          />
                        </div>

                        <button
                          onClick={openModal}
                          type="button"
                          className="w-fit rounded-xl bg-transparent p-2 text-[#00a651]  focus:border-[#00a651] focus:outline-none focus:ring-1"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        id="route"
                        name="route"
                        autoComplete="off"
                        className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                        value={formData.route}
                        onChange={(e) => handleInputChange(e)}
                      >
                        <option value="" disabled>
                          Select a route
                        </option>
                        {Object.keys(routeOptions).map((route) => (
                          <option key={route} value={route}>
                            {route}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col justify-evenly border rounded-xl border-[#3a3c3d60] py-4 px-2">
                    <div className="input-container w-full">
                      <label htmlFor="dosageUnitForm" className="labels text-lg block text-center">
                        Presentation: Content
                      </label>
                      <div className="flex w-full items-center justify-between">
                        <label
                          htmlFor="presentationContent"
                          className="labels text-md block text-left"
                        >
                          Quantity
                        </label>

                        <div className="btn-cont mt-">
                          <button
                            onClick={openModal}
                            type="button"
                            className="w-fit rounded-xl bg-transparent p-2 text-[#00a651]  focus:border-[#00a651] focus:outline-none focus:ring-1"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="presentationContentQty"
                          autoComplete="off"
                          id="presentationContentQty"
                          className="mt-1 w-full  rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri sm-28"
                          placeholder=""
                          value={formData?.presentationContentQty}
                          onChange={(e) => handleInputChange(e)}
                        />

                        {/* <div className="absolute inset-y-0 -right-14 lg:-right-0 md:right-0 flex items-center"> */}
                        <div className="absolute inset-y-0 top-1 right-0 flex items-center">
                          <select
                            id="contentUnitType"
                            name="contentUnitType"
                            className="w-16 cursor-pointer appearance-none rounded-r-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-fg p-2 pr-8 font-normal outline-none focus:border-green-pri focus:outline-none focus:ring-1 focus:ring-green-pri xs:w-24 md:w-44"
                            value={formData.contentUnitType}
                            onChange={(e) => handleInputChange(e)}
                          >
                            <option value="" disabled>
                              Type
                            </option>
                            {Object.keys(dosageOptions).map((dosageUnit) => (
                              <option key={dosageUnit} value={dosageUnit}>
                                {dosageUnit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="input-container w-full mt-8">
                      <label htmlFor="dosageUnitForm" className="labels text-lg block text-center">
                        Presentation: Container/Package
                      </label>

                      <div className="flex w-full items-center justify-between">
                        <label
                          htmlFor="presentationContainer"
                          className="labels text-md block text-left"
                        >
                          Quantity
                        </label>

                        <div className="btn-cont">
                          <button
                            onClick={openModal}
                            type="button"
                            className="w-fit rounded-xl bg-transparent p-2 text-[#00a651]  focus:border-[#00a651] focus:outline-none focus:ring-1"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="presentationContainerQty"
                          autoComplete="off"
                          id="presentationContainerQty"
                          className="mt-1 w-full  rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri sm-28"
                          placeholder=""
                          value={formData?.presentationContainerQty}
                          onChange={(e) => handleInputChange(e)}
                        />

                        {/* <div className="absolute inset-y-0 -right-[26px] md:right-0 flex items-center"> */}
                        <div className="absolute inset-y-0 top-1 right-0 flex items-center">
                          <select
                            id="containerUnitType"
                            name="containerUnitType"
                            className="w-16 cursor-pointer appearance-none rounded-r-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-fg p-2 pr-8 font-normal outline-none focus:border-green-pri focus:outline-none focus:ring-1 focus:ring-green-pri xs:w-24 md:w-44"
                            value={formData.containerUnitType}
                            onChange={(e) => handleInputChange(e)}
                          >
                            <option value="" disabled>
                              Type
                            </option>
                            {Object.keys(presentationContainerOptions).map((dosageUnit) => (
                              <option key={dosageUnit} value={dosageUnit}>
                                {dosageUnit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="input-container relative px-2">
                    <label
                      htmlFor="prescriptionAndDispensingCondition"
                      className="labels text-md block text-left"
                    >
                      Prescription and dispensing condition
                    </label>
                    <select
                      name="prescriptionAndDispensingCondition"
                      onChange={(e) => handleInputChange(e)}
                      value={formData.prescriptionAndDispensingCondition}
                      className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                    >
                      <option value="" disabled>
                        select a condition
                      </option>
                      {Object.keys(prescriptionAndDispensingConditionOptions).map(
                        (prescriptionAndDispensingCondition) => (
                          <option
                            key={prescriptionAndDispensingCondition}
                            value={prescriptionAndDispensingCondition}
                          >
                            {prescriptionAndDispensingCondition}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                {/* </div> */}
              </td>
            </tr>
            {/* IED COLOMUN ENDS */}
          </tbody>
        </table>
        {isModalOpen && (
          <AddModal
            closeModal={closeModal}
            title="Add New Item"
            onAdd={handleAdd}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default UnifiedDrugInformations;
