// Import.js
import React from 'react';
import { useDrugOrder } from '../Contexts/DrugOrderContext';

export const Import = () => {
  const { handleChange, handleSubmit, formData = {}, setFormData = () => { } } = useDrugOrder(); // Ensure default values are provided

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Drug ID:
        <input className='text-black-text' type="text" name="drugId" value={formData.drugId} onChange={handleChange} />
      </label>
      <label>
        Brand Name:
        <input className='text-black-text' type="text" name="brandName" value={formData.brandName} onChange={handleChange} />
      </label>
      <label>
        Quantity Requested:
        <input className='text-black-text't type="number" name="quantityRequested" value={formData.quantityRequested} onChange={handleChange} />
      </label>
      {/* Add checkboxes for boolean fields */}
      {/* For simplicity, I'm assuming they're all optional */}
      <label>
        RFI:
        <input className='text-black-text' type="checkbox" name="RFI" checked={formData.RFI} onChange={() => setFormData(prevState => ({ ...prevState, RFI: !formData.RFI }))} />
      </label>
      <label>
        Result:
        <input className='text-black-text' type="checkbox" name="Result" checked={formData.Result} onChange={() => setFormData(prevState => ({ ...prevState, Result: !formData.Result }))} />
      </label>
      {/* Add other boolean fields similarly */}
      <button type="submit">Submit Order</button>
    </form>
  );
};


