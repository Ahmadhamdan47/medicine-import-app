import React, { useState } from 'react';
import './inspection.css';
import SubmitButton from '../assets/SubmitButton.svg';

const Inspection: React.FC = () => {
  const [GTIN, setGTIN] = useState('');
  const [BatchNumber, setBatchNumber] = useState('');
  const [SerialNumber, setSerialNumber] = useState('');
  const [ExpiryDate, setExpiryDate] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/drugs/checkMate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ GTIN, BatchNumber, SerialNumber, ExpiryDate }),
      });

      if (!response.ok) {
        throw new Error('Inspection failed. Please check your inputs.');
      }

      const data = await response.json();
      setResult(data.message); // Assuming the response returns a message property
    } catch (error: any) {
      setResult(error.message);
    }
  };

  return (
    <div className="inspection-wrapper">
      <h2>Inspection</h2>
      <form className="inspection-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="GTIN">GTIN:</label>
          <input
            type="text"
            id="GTIN"
            value={GTIN}
            onChange={(e) => setGTIN(e.target.value)}
            required
            className="oval-input large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="BatchNumber">Batch Number:</label>
          <input
            type="text"
            id="BatchNumber"
            value={BatchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            required
            className="oval-input large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="SerialNumber">Serial Number:</label>
          <input
            type="text"
            id="SerialNumber"
            value={SerialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
            className="oval-input large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ExpiryDate">Expiry Date:</label>
          <input
            type="date"
            id="ExpiryDate"
            value={ExpiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
            className="oval-input large"
          />
        </div>
        <button type="submit" className="submit-button">
          <img src={SubmitButton} alt="Submit" />
        </button>
      </form>
      {result && <p className="result">{result}</p>}
    </div>
  );
};

export default Inspection;
