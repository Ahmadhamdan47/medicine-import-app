import axios from "axios";
import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";

const CurrenciesContext = createContext();

export const CurrenciesProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState([]);
  const [currencyRates, setCurrencyRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    // Fetch currencies and currency rates
    const fetchCurrenciesAndRates = async () => {
      try {
        // Fetch currencies
        const currenciesResponse = await axios.get(
          "http://localhost:3010/api/currency/v1.0/currencies"
          // "https://2b5a-85-112-70-8.ngrok-free.app/api/currency/v1.0/currencies"
        );
        const currenciesData = currenciesResponse.data;

        // Fetch currency rates
        const currencyRatesResponse = await axios.get(
          "http://localhost:3010/api/currency/v1.0/currencyRate"
          // "https://2b5a-85-112-70-8.ngrok-free.app/api/currency/v1.0/currencyRate"
        );
        const currencyRatesData = currencyRatesResponse.data;

        // Set currencies and currency rates in the context
        setCurrencies(currenciesData);
        setCurrencyRates(currencyRatesData);
        setLoading(false);
      } catch (error) {
        // console.error("Failed to fetch currencies and rates:", error);
        setLoading(false);
      }
    };

    fetchCurrenciesAndRates();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://2b5a-85-112-70-8.ngrok-free.app/api/currency/v1.0/currencies"
      );
      setCurrencies(response.data);
    } catch (error) {
      // console.error("Failed to fetch currencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCurrency = async (currencyData, callback) => {
    try {
      setLoading(true);

      if (!currencyData.code || !currencyData.name) {
        throw new Error("Code and Name are required.");
      }

      const response = await axios.post(
        "https://2b5a-85-112-70-8.ngrok-free.app/api/currency/v1.0",
        currencyData
      );

      if (
        response.data &&
        response.data.message &&
        response.data.message.trim().toLowerCase() ===
          "currency added successfully"
      ) {
        const newCurrency = {
          ...currencyData,
          guid: uuidv4(),
        };

        setCurrencies((prevCurrencies) => [...prevCurrencies, newCurrency]);
        alert("Currency created successfully!");

        if (callback && typeof callback === "function") {
          callback(); // Execute the callback function
        }

        // Fetch currencies after adding a new currency
        fetchCurrencies(); // call fetchCurrencies here
      } else {
        throw new Error("Failed to add currency.");
      }
    } catch (error) {
      // console.error("Error adding currency:", error);
    } finally {
      setLoading(false);
    }
  };

  const editCurrency = async (guid, updatedData) => {
    try {
      setLoading(true);
      setMsg(null);

      // Include the guid in the updatedData object
      updatedData.guid = guid;

      const response = await axios.put(
        `https://2b5a-85-112-70-8.ngrok-free.app/api/currency/v1.0/`,
        updatedData
      );

      if (
        response.data &&
        response.data.message &&
        response.data.message.trim().toLowerCase() ===
          "currency updated successfully"
      ) {
        fetchCurrencies();
        alert("Currency updated successfully!");
      } else {
        throw new Error("Failed to update currency.");
      }
    } catch (error) {
      // console.error("Error editing currency:", error);
      setMsg(error.message || "Failed to update currency.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch currency rates
  const fetchCurrencyRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://2b5a-85-112-70-8.ngrok-free.app/api/currency/v1.0/currencyRate"
      );
      setCurrencyRates(response.data);
    } catch (error) {
      setMsg("Failed to fetch currency rates.");
    } finally {
      setLoading(false);
    }
  };

  const addCurrencyRate = async (currencyRateData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/currency/v1.0/Rate",
        currencyRateData
      );
      setCurrencyRates([...currencyRates, response.data]);
      setMsg("Currency rate added successfully.");
    } catch (error) {
      setMsg("Failed to add currency rate.");
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      currencies,
      setCurrencies,
      currencyRates,
      setCurrencyRates,
      loading,
      msg,
      addCurrency,
      editCurrency,
      addCurrencyRate,
      fetchCurrencyRates,
    }),
    [currencies, currencyRates, loading, msg]
  );

  useEffect(() => {
    fetchCurrencies();
    fetchCurrencyRates(); // Fetch currency rates on component mount
  }, []);

  return (
    <CurrenciesContext.Provider value={contextValue}>
      {children}
    </CurrenciesContext.Provider>
  );
};

export const useCurrenciesContext = () => useContext(CurrenciesContext);
