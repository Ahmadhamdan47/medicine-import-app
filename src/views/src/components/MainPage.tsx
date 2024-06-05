import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import './MainPage.css'; // Create this CSS file for styling
import homeIcon from '../assets/Home.svg'; // Replace with your actual icon paths
import searchIcon from '../assets/Search.svg'; // Replace with your actual icon paths
import networkIcon from '../assets/Dashboard.svg';
import addIcon from '../assets/Add.svg';
import uploadIcon from '../assets/Import.svg';
import heartIcon from '../assets/Inspect.svg';
import listIcon from '../assets/Distribute.svg';
import logoIcon from '../assets/PSLOGOFINAL.svg';
import StepOne from './steps/stepOne';
import StepTwo from './steps/stepTwo';
import StepThree from './steps/stepThree';
import StepFour from './steps/stepFour';
import Inspection from './Inspection';

const MainPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number| string | null>(1);

  const handleNextStep = () => {
    if (typeof currentStep === 'number') {
      setCurrentStep(currentStep + 1);
    }
  };


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onNext={handleNextStep} />;
      case 2:
        return <StepTwo onNext={handleNextStep} />;
      case 3:
        return <StepThree onNext={handleNextStep} />;
      case 4:
        return <StepFour onNext={handleNextStep} />;
 case 'inspection':
        return <Inspection />;

      default:
        return <div>Welcome to the Dashboard</div>;
    }
  };
  return (
    <div className="main-page">
      <div className="sidebar">
        <img src={logoIcon} alt="Logo" className="logo" />
        <div className="icon-group">
          <img src={homeIcon} alt="Home" className="icon" onClick={() => setCurrentStep(null)} />
          <img src={searchIcon} alt="Search" className="icon" />
          <img src={networkIcon} alt="Network" className="icon" />
        </div>
        <div className="icon-group">
          <img src={addIcon} alt="Add" className="icon" />
          <img src={uploadIcon} alt="Upload" className="icon" onClick={() => setCurrentStep(1)} />
          <img src={heartIcon} alt="Heart" className="icon" onClick={() => setCurrentStep('inspection')} />
          <img src={listIcon} alt="List" className="icon" />
        </div>
      </div>
      <div className="content">
        {renderStep()}
      </div>
      <div className="sidebar right">
        {/* Right sidebar content goes here if needed */}
      </div>
    </div>
  );
};





export default MainPage;
