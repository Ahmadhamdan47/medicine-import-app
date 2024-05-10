// // CompanyList.js
// import React, { useState, useEffect } from 'react';
// import Axios from "../../../../../api/axios";

// function CompanyList() {
//   const [companies, setCompanies] = useState([]);

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   const fetchCompanies = async () => {
//     try {
//       const response = await Axios.get('/api/companies/v1.0/companies');
//       setCompanies(response.data);
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Company List</h2>
//       {companies.map((company) => (
//         <div key={company.id}>
//           <p>Name: {company.name}</p>
//           {/* Display other company data */}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CompanyList;


// ////////////////////////
// ////////////////////////
// ////////////////////////
// ////////////////////////

import React, { useState, useEffect } from "react";

import Axios from "../../../../../api/axios";

const CompanyList = () => {
  const [companyData, setCompanyData] = useState({});
  const [companyTypes, setCompanyTypes] = useState([]);
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    // Fetch Company Types
    Axios.get("/api/CompanyType/v1.0/CompanyTypes")
      .then((response) => {
        setCompanyTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching company types:", error);
      });

    // Fetch Country List
    Axios.get("/api/country/v1.0/countries")
      .then((response) => {
        setCountryList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching country list:", error);
      });

    // Fetch Company Data
    // This assumes you have some logic to fetch company data
    fetchCompanyData();
  }, []);

  // Function to fetch company data
  const fetchCompanyData = () => {
    // Example fetch logic, replace with your actual logic
    Axios.get("/api/companyData")
      .then((response) => {
        setCompanyData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  };

  const renderTableRows = (data, prefix = "") => {
    if (!data || typeof data !== "object") {
      return null;
    }

    return Object.entries(data).map(([key, value]) => {
      const currentKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        return renderTableRows(value, currentKey);
      } 
        return (
          <tr key={currentKey}>
            <td>{currentKey}</td>
            <td>{value}</td>
          </tr>
        );
      
    });
  };

  return (
    <div>
      <h2>Company Data Table</h2>
      <table>
        <tbody>{renderTableRows(companyData)}</tbody>
      </table>
    </div>
  );
};

export default CompanyList;
