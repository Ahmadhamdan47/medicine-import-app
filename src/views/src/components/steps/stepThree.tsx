import React, { useState } from 'react';
import './steps.css';
import SubmitButton from '../../assets/SubmitButton.svg';
import AttachButton from '../../assets/AttachButton.svg';
import Flow2 from '../../assets/Flow-2.svg';


interface StepThreeProps {
    onNext: () => void;
  }
  
  const StepThree: React.FC<StepThreeProps> = ({ onNext }) => {
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setAttachedFile(event.target.files[0]);
      }
    };
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      // Mock submission process
      console.log('File submitted:', attachedFile);
      // Proceed to the next step
      onNext();
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
                  {/* Populate days */}
                  {[...Array(31)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select className="oval-input">
                  <option value="month">Month</option>
                  {/* Populate months */}
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month, i) => (
                    <option key={i} value={month}>{month}</option>
                  ))}
                </select>
                <select className="oval-input">
                  <option value="year">Year</option>
                  {/* Populate years */}
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
  
            <div className="input-group flex-group">
              <div className="large-input-group">
                <label>Number:</label>
                <input type="text" value="Approved" readOnly className="oval-input large" />
              </div>
              <div className="large-input-group">
                <label>Date:</label>
                <input type="text" value="15-12-22" readOnly className="oval-input large" />
              </div>
              <div className="large-input-group">
                <label>Amount:</label>
                <input type="text" value="USD 15,000" readOnly className="oval-input large" />
              </div>
              <div className="attach-button large-input-group">
                <label htmlFor="attach-invoice">
                  <img src={AttachButton} alt="Attach" />
                </label>
                <input id="attach-invoice" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
            </div>
  
            <button type="submit" className="submit-button">
              <img src={SubmitButton} alt="Submit" />
            </button>
  
            <div className="input-group">
              <label>2D Barcode:</label>
              <div className="flex-group">
                <input type="text" placeholder="Barcode Number" className="oval-input large" />
                <input type="number" placeholder="Batches" className="oval-input large" />
              </div>
            </div>
  
            <div className="input-group flex-group">
              <div className="batch-group">
                <label>Batch 1:</label>
                <div className="flex-group">
                  <input type="text" placeholder="Batch Number" className="oval-input large" />
                  <input type="text" placeholder="Production Date" className="oval-input large" />
                  <input type="text" placeholder="Expiry Date" className="oval-input large" />
                </div>
                <button type="button" className="add-serials-button">Add Serials</button>
              </div>
            </div>
  
            <div className="input-group flex-group">
              <div className="batch-group">
                <label>Batch 2:</label>
                <div className="flex-group">
                  <input type="text" placeholder="Batch Number" className="oval-input large" />
                  <input type="text" placeholder="Production Date" className="oval-input large" />
                  <input type="text" placeholder="Expiry Date" className="oval-input large" />
                </div>
                <button type="button" className="add-serials-button">Add Serials</button>
              </div>
            </div>
  
            <button type="submit" className="submit-button">
              <img src={SubmitButton} alt="Submit" />
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default StepThree;