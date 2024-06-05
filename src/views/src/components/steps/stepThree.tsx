import React, { useState } from 'react';
import './steps.css';
import SubmitButton from '../../assets/SubmitButton.svg';
import AttachButton from '../../assets/AttachButton.svg';
import Flow2 from '../../assets/Flow-2.svg';
import { useEffect } from 'react';


interface StepThreeProps {
  onNext: () => void;
  drugData: { drugName: string; quantityRequested: string } | null;
}

const StepThree: React.FC<StepThreeProps> = ({ onNext, drugData }) => {
  const [GTIN, setGTIN] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [productionDate, setProductionDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [presentation, setPresentation] = useState('');
  const [form, setForm] = useState('');
  const [laboratory, setLaboratory] = useState('');
  const [laboratoryCountry, setLaboratoryCountry] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (drugData) {
      setQuantity(drugData.quantityRequested);
    }
  }, [drugData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/donation/batchlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          DonationId: null,  // Example DonationId, replace with actual value
          DrugName: drugData?.drugName,
          GTIN,
          LOT: batchNumber,
          ProductionDate: productionDate,
          ExpiryDate: expiryDate,
          Quantity: quantity,
          Presentation: presentation,
          Form: form,
          Laboratory: laboratory,
          LaboratoryCountry: laboratoryCountry,
          SerialNumber: serialNumber
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add batch lot. Please check your inputs.');
      }

      // Update the Drug table with the GTIN
      await fetch('/drugs/updateGTIN', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drugName: drugData?.drugName, GTIN }),
      });

      const data = await response.json();
      setResult('Batch lot added successfully!');
      onNext();
    } catch (error: any) {
      setResult(error.message);
    }
  };

  return (
    <div className="form-section">
      <img src={Flow2} alt="Progress Bar" className="progress-bar small" />
      
      <div className="oval-container">
        <h2>3 - Shipment</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Expected Date of Arrival:</label>
            <div className="flex-group">
              <select className="oval-input">
                <option value="day">Day</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select className="oval-input">
                <option value="month">Month</option>
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((month, i) => (
                  <option key={i} value={month}>{month}</option>
                ))}
              </select>
              <select className="oval-input">
                <option value="year">Year</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={2024 + i}>{2024 + i}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Border Crossing:</label>
            <select className="oval-input">
              <option value="airport">Airport</option>
              <option value="seaport">Seaport</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div className="input-group">
            <label>Drug Name:</label>
            <input
              type="text"
              value={drugData?.drugName || ''}
              readOnly
              className="oval-input large"
            />
          </div>

          <div className="input-group">
            <label>GTIN:</label>
            <input
              type="text"
              value={GTIN}
              onChange={(e) => setGTIN(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Batch Number:</label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Expiry Date:</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Production Date:</label>
            <input
              type="date"
              value={productionDate}
              onChange={(e) => setProductionDate(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Presentation:</label>
            <input
              type="text"
              value={presentation}
              onChange={(e) => setPresentation(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Form:</label>
            <input
              type="text"
              value={form}
              onChange={(e) => setForm(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Laboratory:</label>
            <input
              type="text"
              value={laboratory}
              onChange={(e) => setLaboratory(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Laboratory Country:</label>
            <input
              type="text"
              value={laboratoryCountry}
              onChange={(e) => setLaboratoryCountry(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="input-group">
            <label>Serial Number:</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="oval-input large"
              required
            />
          </div>

          <div className="attach-button large-input-group">
            <label htmlFor="attach-invoice">
              <img src={AttachButton} alt="Attach" />
            </label>
            <input id="attach-invoice" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          <button type="submit" className="submit-button">
            <img src={SubmitButton} alt="Submit" />
          </button>

        </form>
        {result && <p className="result">{result}</p>}
      </div>
    </div>
  );
};

export default StepThree;