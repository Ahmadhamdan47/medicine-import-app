import Axios from "axios";
import React, { useState, useEffect } from "react";

const CountryDataFetcher = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await Axios.get("https://api.example.com/countries");
        setCountries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
      <h1>Countries of the World</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {countries.map((country) => (
            <li key={country.id}>
              {country.name}
              {/* Here you can fetch and display states/districts/cities for each country */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryDataFetcher;
