import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';



const Modal = ({ isOpen, onClose, onSubmit }) => {
  const { formData, handleChange, handleSubmit } = useState();

  const modalTitle =
    formData.mode === 'create' ? 'Create New Entry' : `Edit "${formData.drugName}"`;
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div style={{ width: '100%', height: '80%' }} className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card" style={{ width: '700px', height: '400px' }}>
        {/* <header className="modal-card-head"> */}
        <p className="modal-card-title">{modalTitle}</p>
        <button className="delete" aria-label="close" onClick={onClose} />
        {/* </header> */}
        <section className="modal-card-body">
          <form className="" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 overflow-y-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 w-full xl:w-fit items-center gap-8 mx-auto px-8 bg-white rounded">
              <div className="col-1">
                <label className="font-medium block mb-2" htmlFor="registrationNumber">
                  Registration Number
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  // required
                />

                <div className="col-2 flex flex-col">
                  <label className="font-medium block" htmlFor="repDate">
                    repDate
                  </label>
                  <input
                    className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                    type="date"
                    id="repDate"
                    name="repDate"
                    value={formData.repDate}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <label className="font-medium block" htmlFor="bg">
                  B/G
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="bg"
                  name="bg"
                  value={formData.bg}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div className="col-2">
                <label className="font-medium block" htmlFor="dateDc">
                  dateDc
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="date"
                  id="dateDc"
                  name="dateDc"
                  value={formData.dateDc}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block" htmlFor="lasteffectiveDate">
                  Last effective Date
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="date"
                  id="lasteffectiveDate"
                  name="lasteffectiveDate"
                  value={formData.lasteffectiveDate}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block" htmlFor="cifFob">
                  CIF/FOB
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="cifFob"
                  name="cifFob"
                  value={formData.cifFob}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block" htmlFor="lastpublicAbp">
                  Last public Abp
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="number"
                  id="lastpublicAbp"
                  name="lastpublicAbp"
                  value={formData.lastpublicAbp}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div className="col-3">
                <label className="font-medium block" htmlFor="ljFobValueUsd">
                  lj Fob Value Usd
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="number"
                  id="ljFobValueUsd"
                  name="ljFobValueUsd"
                  value={formData.ljFobValueUsd}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block mt-3" htmlFor="wjLebPubPriceHos">
                  wjLeb Pub Price Hos
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="wjLebPubPriceHos"
                  name="wjLebPubPriceHos"
                  value={formData.wjLebPubPriceHos}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block" htmlFor="seq">
                  Seq
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="seq"
                  name="seq"
                  value={formData.seq}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block" htmlFor="sideEffect">
                  Side Effect
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="sideEffect"
                  name="sideEffect"
                  value={formData.sideEffect}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div className="col-">
                <label className="font-medium block" htmlFor="webcifFob">
                  Web cif/Fob
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="webcifFob"
                  name="webcifFob"
                  value={formData.webcifFob}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block" htmlFor="webpublicAbp">
                  Web public Abp
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="number"
                  id="webpublicAbp"
                  name="webpublicAbp"
                  value={formData.webpublicAbp}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block" htmlFor="webcurrency">
                  Web currency
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  id="webcurrency"
                  name="webcurrency"
                  value={formData.webcurrency}
                  onChange={handleChange}
                  // required
                />

                <label className="font-medium block" htmlFor="posology">
                  Posology
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="posology"
                  name="posology"
                  value={formData.posology}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div className="col-2 flex flex-col">
                <label className="font-medium block" htmlFor="gtin">
                  GTIN
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="gtin"
                  name="gtin"
                  value={formData.gtin}
                  onChange={handleChange}
                  // required
                />
                <label className="font-medium block" htmlFor="notes">
                  Notes
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  // required
                />
                <label className="font-medium block" htmlFor="ingredientLabel">
                  Ingredient Label
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="ingredientLabel"
                  name="ingredientLabel"
                  value={formData.ingredientLabel}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div className="col-5">
                <label className="font-medium block" htmlFor="description">
                  Description
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  // required
                />
                <label className="font-medium block" htmlFor="activeInactiveIngredient">
                  Active Inactive Ingredient
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="activeInactiveIngredient"
                  name="activeInactiveIngredient"
                  value={formData.activeInactiveIngredient}
                  onChange={handleChange}
                  // required
                />
                <label className="font-medium block" htmlFor="indication">
                  Indication
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="indication"
                  name="indication"
                  value={formData.indication}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div className="col-">
                <label className="font-medium block" htmlFor="methodOfAdministration">
                  Method Of Administration
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="methodOfAdministration"
                  name="methodOfAdministration"
                  value={formData.methodOfAdministration}
                  onChange={handleChange}
                  // required
                />
                <label className="font-medium block" htmlFor="contraindications">
                  Contraindications
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="contraindications"
                  name="contraindications"
                  value={formData.contraindications}
                  onChange={handleChange}
                  // required
                />
                <label className="font-medium block" htmlFor="precautionForUse">
                  Precaution For Use
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="precautionForUse"
                  name="precautionForUse"
                  value={formData.precautionForUse}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div className="col-">
                <label className="font-medium block" htmlFor="toxicity">
                  Toxicity
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="toxicity"
                  name="toxicity"
                  value={formData.toxicity}
                  onChange={handleChange}
                  // required
                />
                <label className="font-medium block" htmlFor="storageCondition">
                  Storage Condition
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="storageCondition"
                  name="storageCondition"
                  value={formData.storageCondition}
                  onChange={handleChange}
                  // required
                />
                <label className="font-medium block" htmlFor="shelfLife">
                  Shelf Life
                </label>
                <input
                  className="w-full mb-4 px-3 py-2 border rounded bg-white-bg dark:bg-black-input"
                  type="text"
                  id="shelfLife"
                  name="shelfLife"
                  value={formData.shelfLife}
                  onChange={handleChange}
                  // required
                />
              </div>
            </div>

            <div className="checkboxes flex flex-wrap border-2 w-fit mb-4 justify-center gap-10 p-4">
              <div>
                <label className="font-medium block" htmlFor="hospPricing">
                  Hosp Pricing
                </label>
                <input
                  className="mb-4 cursor-pointer border rounded"
                  type="checkbox"
                  id="hospPricing"
                  name="hospPricing"
                  value={formData.hospPricing}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div>
                <label className="font-medium block" htmlFor="isDouanes">
                  isDouanes:
                </label>
                <input
                  className="mb-4 border cursor-pointer rounded"
                  type="checkbox"
                  id="isDouanes"
                  name="isDouanes"
                  value={formData.isDouanes}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div>
                <label className="font-medium block" htmlFor="nm">
                  None Marketed
                </label>
                <input
                  className="cursor-pointer border rounded"
                  type="checkbox"
                  id="nm"
                  name="nm"
                  value={formData.nm}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  // required
                />
              </div>
            </div>
            <div className="btn-col flex-shrink">
              <button className="med-btn-pri" type="submit">
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Modal;
