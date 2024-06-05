import React, { useState } from 'react';
import './steps.css';
import SubmitButton from '../../assets/SubmitButton.svg';
import AttachButton from '../../assets/AttachButton.svg';
import Flow1 from '../../assets/Flow-1.svg';

interface StepTwoProps {
    onNext: () => void;
  }
  
  const StepTwo: React.FC<StepTwoProps> = ({ onNext }) => {
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
        <img src={Flow1} alt="Progress Bar" className="progress-bar small" />
        
        <div className="oval-container">
          <h2>2.1 - Result</h2>
          <div className="input-group">
            <label>Pharmacy Service Decision:</label>
            <div className="flex-group">
              <span className="status-label">Status</span>
              <span className="quantity-label">QTY Approved</span>
              <div className="flex-group approval">
                <span>Approved</span>
                <span>50</span>
              </div>
            </div>
          </div>
        </div>
  
        <div className="oval-container">
          <h2>2.2 - Proforma Invoice</h2>
          <form onSubmit={handleSubmit} className="form-group">
            <div className="input-group">
              <div>
                <label>Number:</label>
                <input type="text" value="Approved" readOnly className="oval-input" />
              </div>
              <div>
                <label>Date:</label>
                <input type="text" value="15-12-22" readOnly className="oval-input" />
              </div>
              <div>
                <label>Amount:</label>
                <input type="text" value="USD 15,000" readOnly className="oval-input" />
              </div>
              <div className="attach-button">
                <label htmlFor="attach-invoice">
                  <img src={AttachButton} alt="Attach" />
                </label>
                <input id="attach-invoice" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
            </div>
  
            <button type="submit" className="submit-button">
              <img src={SubmitButton} alt="Submit" />
            </button>
          </form>
        </div>
  
        <div className="oval-container">
          <h2>2.3 - Swift</h2>
          <form onSubmit={handleSubmit} className="form-group">
            <div className="input-group">
              <div>
                <label>Number:</label>
                <input type="text" value="11111111" readOnly className="oval-input" />
              </div>
              <div>
                <label>Date:</label>
                <input type="text" value="15-12-22" readOnly className="oval-input" />
              </div>
              <div>
                <label>Amount:</label>
                <input type="text" value="USD 15,000" readOnly className="oval-input" />
              </div>
              <div>
                <label>Bank Name:</label>
                <input type="text" value="ABC Bank" readOnly className="oval-input" />
              </div>
              <div className="attach-button">
                <label htmlFor="attach-swift">
                  <img src={AttachButton} alt="Attach" />
                </label>
                <input id="attach-swift" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
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
export default StepTwo;
