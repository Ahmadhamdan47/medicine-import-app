import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; 
import homeIcon from '../assets/Home.svg'; 
import searchIcon from '../assets/Search.svg'; 
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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number | string | null>(1);
  const [drugData, setDrugData] = useState<{ drugName: string; quantityRequested: string } | null>(null);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token is found
    }
  }, [navigate]);

  const handleNextStep = (data?: { drugName: string; quantityRequested: string }) => {
    if (data) {
      setDrugData(data);
    }
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
        return <StepThree onNext={handleNextStep} drugData={drugData} />;
      case 4:
        return <StepFour onNext={handleNextStep} />;
      case 'inspection':
        return <Inspection />;
      default:
        return <div>Welcome to MedLeb Pharmacy Service</div>;
    }
  };

  return (
    <div className={`main-page ${collapsed ? 'collapsed' : ''}`}>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} 
           onMouseEnter={() => setCollapsed(false)} 
           onMouseLeave={() => setCollapsed(true)}>
        <div className="header">
          <img src={logoIcon} alt="MedLeb Logo" className="logo" />
        </div>
        <div className="icon-group">
          <a href="#" className="icon">
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </a>
          <a href="#" className="icon">
            <img src={searchIcon} alt="Search" />
            <span>Search</span>
          </a>
          <a href="#" className="icon">
            <img src={networkIcon} alt="Dashboard" />
            <span>Dashboard</span>
          </a>
        </div>
        <div className="divider"></div>
        <div className="icon-group drug-group">
          <a href="#" className="icon" onClick={() => setCurrentStep(1)}>
            <img src={addIcon} alt="Add" />
            <span>Add</span>
          </a>
          <a href="#" className="icon" onClick={() => setCurrentStep(1)}>
            <img src={uploadIcon} alt="Upload" />
            <span>Import</span>
          </a>
          <a href="#" className="icon" onClick={() => setCurrentStep('inspection')}>
            <img src={heartIcon} alt="Inspect" />
            <span>Inspect</span>
          </a>
          <a href="#" className="icon">
            <img src={listIcon} alt="Track Records" />
            <span>Track Records</span>
          </a>
        </div>
      </div>
      <div className="content">
        <div className="top-bar">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="profile-section">
            <img src={networkIcon} alt="User" className="icon" />
            <img src={listIcon} alt="Settings" className="icon" />
          </div>
        </div>
        <div className="main-content">
          <h1>Home Page</h1>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
