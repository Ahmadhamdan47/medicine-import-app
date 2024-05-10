// CompanyTypeList.js
import React, { useState, useEffect } from 'react';


function CompanyTypeList() {
  const [companyTypes, setCompanyTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyTypes();
  }, []);

  const fetchCompanyTypes = async () => {
    try {
      const response = await axios.get('/api/CompanyType/v1.0/CompanyTypes');
      setCompanyTypes(response.data);
      setError(null);
    } catch (error) {
      setError(error.response.data.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Company Type List</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {companyTypes.map((companyType) => (
          <li key={companyType.id}>
            <strong>Name:</strong> {companyType.name}
            {/* Display other company type data as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyTypeList;
