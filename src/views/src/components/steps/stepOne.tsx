import React from 'react';
import './steps.css';
import SubmitButton from '../../assets/SubmitButton.svg';
import Flow from '../../assets/Flow.svg';

interface StepOneProps {
    onNext: () => void;
  }
  
  const StepOne: React.FC<StepOneProps> = ({ onNext }) => (
    <div className="form-section">
      <img src={Flow} alt="Progress Bar" className="progress-bar small" />
      <h2>1 - Request for Importation Form:</h2>
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div className="input-group">
          <label>Select Requested Drug:</label>
          <input type="text" placeholder="Search by brand name or ingredient" className="oval-input" />
        </div>
        
        <div className="input-group">
          <label>Quantity Requested:</label>
          <input type="number" placeholder="500" className="oval-input" />
        </div>
  
        <div className="input-group offer-group">
          <label>Offer:</label>
          <div className="offer-inputs">
            <select className="oval-input">
              <option value="type">Type</option>
              {/* Add options here */}
            </select>
            <input type="number" placeholder="50" className="oval-input" />
          </div>
        </div>
  
        <div className="input-group">
          <label>Notes:</label>
          <textarea placeholder="250 max character" className="oval-input"></textarea>
        </div>
  
        <button type="submit" className="submit-button">
          <img src={SubmitButton} alt="Submit" />
        </button>
      </form>
    </div>
  );
  

export default StepOne;
