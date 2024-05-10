import axios from 'axios';
import React, { useState, useEffect } from 'react';

const MyFormComponent = () => {
  const [formData, setFormData] = useState({
    // Add form fields here
    code: '',
    levelName: '',
    levelNameAr: '',
    atcRelatedLabel: '',
    enabled: true,
    atcGuid: '', // This is for the relation to Drug_ATC table
    // Add more fields as needed
  });

  const [atcList, setAtcList] = useState([]);

  useEffect(() => {
    // Fetch Drug_ATC records to populate dropdown
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/atc');
        setAtcList(response.data);
      } catch (error) {
        console.error('Error fetching ATC data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform API call to create a new record in Drug_ATCCodes table
      await axios.post('/api/atccodes', formData);
      // Reset form fields after successful submission
      setFormData({
        code: '',
        levelName: '',
        levelNameAr: '',
        atcRelatedLabel: '',
        enabled: true,
        atcGuid: '',
      });
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add form fields here */}
      <label>
        Code:
        <input type="text" name="code" value={formData.code} onChange={handleInputChange} />
      </label>
      {/* Add more input fields as needed */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyFormComponent;
