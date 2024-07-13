import React from 'react';
import './steps.css';
import Flow3 from '../../assets/Flow-3.svg';

interface StepFourProps {
    onNext: () => void;
  }
  
  const StepFour: React.FC<StepFourProps> = ({ onNext }) => (
    <div className="form-section">
      <img src={Flow3} alt="Progress Bar" className="progress-bar small" />
      <h2>4 - RF Declaration</h2>
      <div className="status-section">
        <span>FULLY RECEIVED</span>
      </div>
      <button onClick={onNext} className="submit-button">
        <img src="../assets/SubmitButton.svg" alt="Submit" />
      </button>

    </div>
  );
export default StepFour;
