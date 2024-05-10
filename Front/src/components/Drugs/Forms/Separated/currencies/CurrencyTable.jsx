import React, { useState, useEffect } from "react";

import CurrencyForm from "./CurrencyForm";
import { useCurrenciesContext } from "./CurrenciesContext";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black-bg bg-opacity-50">
      <div className="relative p-8 bg-white-bg rounded-lg max-w-md">
        <div
          className="absolute top-0 right-0 p-2 cursor-pointer"
          onClick={onClose}
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
             />
          </svg>
        </div>
        {children}
      </div>
    </div>
  );
};

const CurrencyTable = () => {
  const {
    currencies,
    setCurrencies,
    currencyRates,
    setCurrencyRates,
    editCurrency,
    addCurrency,
    loading,
  } = useCurrenciesContext();
  const [editingRow, setEditingRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({
    code: "",
    name: "",
    nameAr: "",
    enabled: true,
    createdDate: new Date().toISOString(),
  });
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [relatedRateInput, setRelatedRateInput] = useState("");

  useEffect(() => {
    if (!loading) {
      setEditingRow(null); // Reset editing row after loading is finished
    }
  }, [loading]);

  const handleEdit = (currency) => {
    setEditingRow(currency.guid);
    // Set initial values for input fields based on the currency being edited
    setNewCurrency({
      code: currency.code,
      name: currency.name,
      nameAr: currency.nameAr,
      enabled: currency.enabled,
      createdDate: currency.createdDate,
    });

    // Find the related rate for the currency being edited
    const relatedRate = currencyRates.find(
      (rate) => rate.fromCurGuid === currency.guid
    );
    setRelatedRateInput(relatedRate ? relatedRate.rate.toString() : "");
  };

  const handleRelatedRateChange = (e) => {
    setRelatedRateInput(e.target.value);
  };

  const getRelatedRate = (currency) => {
    // Find the related rate for the given currency
    const relatedRate = currencyRates.find(
      (rate) => rate.fromCurGuid === currency.guid
    );
    return relatedRate ? relatedRate.rate.toString() : "";
  };

  const handleSort = (columnName) => {
    if (sortedColumn === columnName) {
      // Reverse sort direction if the same column is clicked again
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Sort by the selected column in ascending order by default
      setSortedColumn(columnName);
      setSortDirection("asc");
    }
  };

  const sortedCurrencies = sortedColumn
    ? currencies.sort((a, b) => {
        const valueA = a[sortedColumn];
        const valueB = b[sortedColumn];

        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      })
    : currencies;

  const handleSave = async (guid, updatedData) => {
    try {
      const updatedCurrencies = currencies.map((currency) => {
        if (currency.guid === guid) {
          return {
            ...currency,
            ...updatedData,
          };
        }
        return currency;
      });

      await editCurrency(guid, updatedData);
      setCurrencies(updatedCurrencies);
      setEditingRow(null);
      //   fetchCurrencies();
    } catch (error) {
      // console.error("Failed to edit currency:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const handleChange = (e, fieldName) => {
    const { value } = e.target;
    setNewCurrency({ ...newCurrency, [fieldName]: value });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white-bg py-4 md:pb-14 px-2 ">
      <div className="w-full flex flex-col items-center">
        <h3 className="text-green-pri">Currency Table</h3>
        <div className="flex justify-end w-full lg:w-[75%] py-4">
          <button onClick={toggleModal} className="med-btn-sec-sm mb-4">
            Add New
          </button>
          <Modal isOpen={isModalOpen} onClose={toggleModal}>
            <CurrencyForm onClose={toggleModal} />
          </Modal>
        </div>
        <table className="w-full lg:w-[75%] mx-auto border border-gray-400 table-auto">
          <thead>
            <tr className="border border-gray-400">
              <th
                className="px-4 py-2 md:w-24 cursor-pointer"
                onClick={() => handleSort("code")}
              >
                Code {sortedColumn === "code" && sortDirection === "asc" && "▲"}
                {sortedColumn === "code" && sortDirection === "desc" && "▼"}
              </th>
              <th
                className="px-4 py-2 md:w-52 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortedColumn === "name" && sortDirection === "asc" && "▲"}
                {sortedColumn === "name" && sortDirection === "desc" && "▼"}
              </th>
              <th
                className="px-4 py-2 md:w-52 text-center cursor-pointer"
                onClick={() => handleSort("nameAr")}
              >
                Name Arabic
                {sortedColumn === "nameAr" && sortDirection === "asc" && "▲"}
                {sortedColumn === "nameAr" && sortDirection === "desc" && "▼"}
              </th>
              <th className="px-4 w-fit py-2">Edit</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {sortedCurrencies.map((currency) => (
              <tr key={currency.guid}>
                <td className="px-4 py-2">
                  {editingRow === currency.guid ? (
                    <input
                      type="text"
                      name="code"
                      value={newCurrency.code}
                      onChange={(e) => handleChange(e, "code")}
                      className="w-full"
                    />
                  ) : (
                    currency.code
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingRow === currency.guid ? (
                    <input
                      type="text"
                      name="name"
                      value={newCurrency.name}
                      onChange={(e) => handleChange(e, "name")}
                      className="w-full"
                    />
                  ) : (
                    currency.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingRow === currency.guid ? (
                    <input
                      type="text"
                      name="nameAr"
                      value={newCurrency.nameAr}
                      onChange={(e) => handleChange(e, "nameAr")}
                      className="w-full"
                    />
                  ) : (
                    currency.nameAr
                  )}
                </td>

                <td className="px-4 py-2 w-16">
                  {editingRow === currency.guid ? (
                    <div className="md:flex justify-center space-x-2">
                      <button
                        onClick={() => handleSave(currency.guid, newCurrency)}
                        className="med-btn-sec-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="med-btn-sec-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(currency)}
                      //   className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="#00a651"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.293 4.293a1 1 0 0 1 1.414 1.414l-10 10a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L5 13.086l9.293-9.293zm-2.829 1.414l3 3L14 9.414l-3-3 1.414-1.414zM17 7.586l-1.293 1.293 1.414 1.414L18.414 9 17 7.586z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrencyTable;
