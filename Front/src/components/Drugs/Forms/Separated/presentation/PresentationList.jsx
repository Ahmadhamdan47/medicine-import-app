import React, { useState, useEffect } from "react";

import Axios from "../../../../../api/axios";
// import axios from 'axios';

const PresentationList = () => {
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "/api/presentation/v1.0/Presentations?Enabled=true&sortOrder=desc"
        );
        setPresentations(response.data);
      } catch (error) {
        console.error("Error fetching presentations:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Presentation List</h2>
      {presentations &&
      presentations.data &&
      presentations.data.length === 0 ? (
        <p className="text-gray-500">No presentations available.</p>
      ) : (
        <ul>
          {presentations.data &&
            presentations.data.map((presentation, index) => (
              <li key={index} className="mb-4 p-4 border rounded">
                <div>
                  <strong>Name:</strong> {presentation.name}
                </div>
                <div>
                  <strong>Name Arabic:</strong> {presentation.nameAr}
                </div>
                <div>
                  <strong>Unit Number 1:</strong> {presentation.unitNumber1}
                </div>
                <div>
                  <strong>Unit Type Code 1:</strong>{" "}
                  {presentation.unitTypeCode1}
                </div>
                <div>
                  <strong>Unit Number 2:</strong> {presentation.unitNumber2}
                </div>
                <div>
                  <strong>Unit Type Code 2:</strong>{" "}
                  {presentation.unitTypeCode2}
                </div>
                <div>
                  <strong>Unit Number 3:</strong> {presentation.unitNumber3}
                </div>
                <div>
                  <strong>Unit Type Code 3:</strong>{" "}
                  {presentation.unitTypeCode3}
                </div>
                <div>
                  <strong>Package Number 1:</strong>{" "}
                  {presentation.packageNumber1}
                </div>
                <div>
                  <strong>Package Type Code 1:</strong>{" "}
                  {presentation.packageTypeCode1}
                </div>
                <div>
                  <strong>Package Number 2:</strong>{" "}
                  {presentation.packageNumber2}
                </div>
                <div>
                  <strong>Package Type Code 2:</strong>{" "}
                  {presentation.packageTypeCode2}
                </div>
                <div>
                  <strong>Package Number 3:</strong>{" "}
                  {presentation.packageNumber3}
                </div>
                <div>
                  <strong>Package Type Code 3:</strong>{" "}
                  {presentation.packageTypeCode3}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default PresentationList;
