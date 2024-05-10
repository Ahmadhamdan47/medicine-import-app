import axios from "axios";
import React, { useState } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";

const CurrenciesTable = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [editedCurrency, setEditedCurrency] = useState(null);

 

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (currency) => {
    setEditedCurrency(currency);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://192.168.10.88:3010/api/currency/edit/${editedCurrency.Guid}`,
        editedCurrency
      );
      const updatedCurrencyResponse = await axios.get(
        `http://localhost:3000/currencies/${editedCurrency.Guid}`
      );
      const updatedCurrency = updatedCurrencyResponse.data;
      const updatedCurrencies = currencies.map((c) =>
        c.Guid === updatedCurrency.Guid ? updatedCurrency : c
      );
      setCurrencies(updatedCurrencies);
      setEditedCurrency(null);
    } catch (error) {
      // console.error("Error updating currency:", error);
    }
  };

  const handleCancel = () => {
    setEditedCurrency(null);
  };

  const handleDelete = async (currency) => {
    try {
      await axios.delete(`http://localhost:3000/currencies/${currency.Guid}`);
      const updatedCurrencies = currencies.filter(
        (c) => c.Guid !== currency.Guid
      );
      setCurrencies(updatedCurrencies);
    } catch (error) {
      // console.error("Error deleting currency:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto h-screen p-4 text-black-text dark:text-white-text">
      <h2 className="text-[1.750rem] text-center text-green-pri font-medium">
        Currency Data
      </h2>
      <div className="flex justify-between items-center pb-4 py-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/currency/new" className="icon-hovered button-with-icon">
          <AddIcon />
        </Link>
      </div>
      {filteredData.length === 0 ? (
        <div>No data available.</div>
      ) : (
        <div className="overflow-x-auto max-h-[calc(100vh-284px)]">
          <table className="w-full table-auto border border-collapse">
            <thead className="select-none h-10 sticky top-0 z-20 bg-gray-200 dark:bg-black-input font-normal">
              <tr>
                <th className="relative" onClick={() => requestSort("Code")}>
                  Code
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    {sortConfig.key === "Code" &&
                      (sortConfig.direction === "asc" ? (
                        <FaSortDown />
                      ) : (
                        <FaSortUp />
                      ))}
                  </div>
                </th>
                <th className="relative" onClick={() => requestSort("name")}>
                  Name
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <FaSortDown />
                      ) : (
                        <FaSortUp />
                      ))}
                  </div>
                </th>
                <th className="relative" onClick={() => requestSort("NameAr")}>
                  Name Ar
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    {sortConfig.key === "NameAr" &&
                      (sortConfig.direction === "asc" ? (
                        <FaSortDown />
                      ) : (
                        <FaSortUp />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-center overflow-y-auto z-0">
              {filteredData.map((currency, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-white-contents dark:hover:bg-black-contents"
                >
                  <td className="py-2 px-4">
                    {editedCurrency === currency ? (
                      <input
                        type="text"
                        value={currency.Code}
                        onChange={(e) =>
                          setEditedCurrency({
                            ...editedCurrency,
                            Code: e.target.value,
                          })
                        }
                      />
                    ) : (
                      currency.Code
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editedCurrency === currency ? (
                      <input
                        type="text"
                        value={currency.Name}
                        onChange={(e) =>
                          setEditedCurrency({
                            ...editedCurrency,
                            Name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      currency.Name
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editedCurrency === currency ? (
                      <input
                        type="text"
                        value={currency.NameAr}
                        onChange={(e) =>
                          setEditedCurrency({
                            ...editedCurrency,
                            NameAr: e.target.value,
                          })
                        }
                      />
                    ) : (
                      currency.NameAr
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editedCurrency === currency ? (
                      <div>
                        <button
                          onClick={handleSave}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(currency)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(currency)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* <tbody className="text-center overflow-y-auto z-0">
              {filteredData.map((currency, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-white-contents dark:hover:bg-black-contents"
                >
                  <td className="py-2 px-4">{currency.Code}</td>
                  <td className="py-2 px-4">{currency.Name}</td>
                  <td className="py-2 px-4">{currency.NameAr}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleEdit(currency)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(currency)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrenciesTable;
