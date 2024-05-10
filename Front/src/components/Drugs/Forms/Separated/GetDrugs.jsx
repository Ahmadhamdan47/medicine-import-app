import axios from "axios";
import React, { useState, useEffect } from "react";

const GetDrugs = () => {
  const [drugsData, setDrugsData] = useState([]);
  const apiUrl = "https://2b5a-85-112-70-8.ngrok-free.app/api/drugs/v1.0";
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..8v24TYpg8vhkhe2ClnZXQLQf-UcPXbDV9BmGwt_iiYc";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setDrugsData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]); // Include accessToken in the dependency array if it changes dynamically

  return (
    <div className="flex w-full justify-center">
      <h1>Drugs Data</h1>
      <ul>
        {drugsData.map((drug) => (
          <li key={drug.guid}>
            <h3>{drug.drugLabelName}</h3>
            <p>ATC name: {drug.atcname}</p>
            <p>Dosage name: {drug.dosageName}</p>
            {/* Add more fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetDrugs;
