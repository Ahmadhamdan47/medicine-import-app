import React from 'react';
import './steps.css';
import SubmitButton from '../../assets/SubmitButton.svg';
import Flow from '../../assets/Flow.svg';
import { useState } from 'react';

interface StepOneProps {
  onNext: (data: { drugName: string; quantityRequested: string }) => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
  const [drugName, setDrugName] = useState('');
  const [quantityRequested, setQuantityRequested] = useState('');
  const [offerType, setOfferType] = useState('');
  const [selectInput, setSelectInput] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/drugs/addPharmacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drugName, quantityRequested, offerType, selectInput, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to add drug. Please check your inputs.');
      }

      const data = await response.json();
      setResult('Drug added successfully!');
      onNext({ drugName, quantityRequested });
    } catch (error: any) {
      setResult(error.message);
    }
  };

  return (
    <div className="form-section">
      <img src={Flow} alt="Progress Bar" className="progress-bar small" />
      <h2>1 - Request for Importation Form:</h2>
      <form className="import-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="drugName">Select Requested Drug:</label>
          <input
            type="text"
            id="drugName"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            required
            className="oval-input large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantityRequested">Quantity Requested:</label>
          <input
            type="text"
            id="quantityRequested"
            value={quantityRequested}
            onChange={(e) => setQuantityRequested(e.target.value)}
            required
            className="oval-input large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="offerType">Offer:</label>
          <div className="flex-group">
            <select
              id="offerType"
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
              required
              className="oval-input"
            >
              <option value="">Type</option>
              <option value="Offer1">Offer1</option>
              <option value="Offer2">Offer2</option>
              {/* Add more options as needed */}
            </select>
            <input
              type="text"
              id="selectInput"
              value={selectInput}
              onChange={(e) => setSelectInput(e.target.value)}
              required
              className="oval-input"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="oval-input large"
          />
        </div>
        <button type="submit" className="submit-button">
          <img src={SubmitButton} alt="Submit" />
        </button>
        {result && <p className="result">{result}</p>}
      </form>
    </div>
  );
};

export default StepOne;