import { v4 as uuidv4 } from "uuid";
// export default CurrencyForm;
import React, { useState } from "react";

import { useCurrenciesContext } from "./CurrenciesContext";

const CurrencyForm = ({ onClose }) => {
  const { addCurrency, addCurrencyRate, currencies } = useCurrenciesContext();
  const [formData, setFormData] = useState({
    currency: {
      guid: uuidv4(),
      code: "",
      name: "",
      nameAr: "",
      enabled: true,
      createdDate: new Date().toISOString(),
    },
    currencyRate: {
      fromCurGuid: "",
      toCurGuid: "",
      fromDate: "",
      toDate: "",
      rate: 0,
    },
    isCurrencyRate: false, // Flag to indicate if it's a currency rate form
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      currencyRate: {
        ...prevFormData.currencyRate,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (formData.isCurrencyRate) {
        await addCurrencyRate({
          ...formData.currencyRate,
          guid: uuidv4(),
          fromCurCode: currencies.find(
            (cur) => cur.guid === formData.currencyRate.fromCurGuid
          ).code,
          toCurCode: currencies.find(
            (cur) => cur.guid === formData.currencyRate.toCurGuid
          ).code,
          createdDate: new Date().toISOString(),
        });
      } else {
        await addCurrency(formData.currency);
      }
      onClose();
    } catch (error) {
      // console.error("Failed to add currency or currency rate:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleForm = () => {
    // Toggle between currency and currency rate forms
    setFormData((prevFormData) => ({
      ...prevFormData,
      isCurrencyRate: !prevFormData.isCurrencyRate,
    }));
  };

  return (
    <div className="flex flex-col items-center">
      {formData.isCurrencyRate ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <select
            name="fromCurGuid"
            value={formData.fromCurGuid}
            onChange={handleChange}
            required
          >
            <option value="">Select From Currency</option>
            {currencies.map((currency) => (
              <option key={currency.guid} value={currency.guid}>
                {currency.code}
              </option>
            ))}
          </select>
          <select
            name="toCurGuid"
            value={formData.toCurGuid}
            onChange={handleChange}
            required
          >
            <option value="">Select To Currency</option>
            {currencies.map((currency) => (
              <option key={currency.guid} value={currency.guid}>
                {currency.code}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="rate"
            value={formData.currencyRate.rate}
            onChange={handleChange}
            placeholder="Rate"
            required
            className="mb-4 p-2 border rounded-md w-full"
          />
          <input
            type="datetime-local"
            name="fromDate"
            value={formData.currencyRate.fromDate}
            onChange={handleChange}
            placeholder="From Date"
            required
            className="mb-4 p-2 border rounded-md w-full"
          />
          <input
            type="datetime-local"
            name="toDate"
            value={formData.currencyRate.toDate}
            onChange={handleChange}
            placeholder="To Date"
            required
            className="mb-4 p-2 border rounded-md w-full"
          />
          <button type="submit" className="med-btn-sec-sm">
            Add Currency Rate
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {/* Currency form fields */}
          <input
            type="text"
            name="code"
            value={formData.currency.code}
            onChange={handleChange}
            placeholder="Code"
            required
            className="mb-4 p-2 border rounded-md w-full"
          />
          <input
            type="text"
            name="name"
            value={formData.currency.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="mb-4 p-2 border rounded-md w-full"
          />
          <input
            type="text"
            name="nameAr"
            value={formData.currency.nameAr}
            onChange={handleChange}
            placeholder="Name Arabic"
            required
            className="mb-4 p-2 border rounded-md w-full"
          />
          <button type="submit" className="med-btn-sec-sm">
            Add Currency
          </button>
        </form>
      )}
      <button
        onClick={handleToggleForm}
        className="mt-4 text-blue-500 font-semibold"
      >
        {formData.isCurrencyRate ? "Add new currency" : "Add new rate"}
      </button>
    </div>
  );
};

export default CurrencyForm;
