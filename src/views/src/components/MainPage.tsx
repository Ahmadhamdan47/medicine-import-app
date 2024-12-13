// src/pages/MainPage.tsx
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
import AddBatchLot from './addBatchlot';
import DrugTable from './DrugTable';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number | string | null>(1);
  const [drugData, setDrugData] = useState<{ drugName: string; quantityRequested: string } | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDrugsTable, setShowDrugsTable] = useState(false);
  const [showImportPage, setShowImportPage] = useState(false);
  const [showAddBatchLot, setShowAddBatchLot] = useState(false);
  const [showInspection, setShowInspection] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token is found
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
      case 'add':
        return <AddBatchLot />;
      default:
        return <div>Welcome to MedLeb Pharmacy Service</div>;
    }
  };

  return (
    <div className={`main-page ${collapsed ? 'collapsed' : ''}`}>
      <div
        className={`sidebar ${collapsed ? 'collapsed' : ''}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
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
          <a href="#" className="icon" onClick={toggleDropdown}>
            <img src={networkIcon} alt="Dashboard" />
            <span>Dashboard</span>
          </a>
          {showDropdown && (
            <div className="dropdown">
              <button onClick={() => navigate('/drugs')} style={{ color: 'black' }}>Drugs</button>
            </div>
    
          )}
        </div>
        <div className="divider"></div>
        <div className="icon-group drug-group">
          <a href="#" className="icon" onClick={() => { setShowAddBatchLot(true); setShowInspection(false); setShowImportPage(false); }}>
            <img src={addIcon} alt="Add" />
            <span>Add</span>
          </a>
          <button onClick={() => navigate('/drug-images')} style={{ color: 'black' }}>Add Drug Image</button>

          <a href="#" className="icon" onClick={() => { setShowInspection(true); setShowAddBatchLot(false); setShowImportPage(false); }}>
            <img src={heartIcon} alt="Inspect" />
            <span>Inspection</span>
          </a>
          <a href="#" className="icon" onClick={() => setShowImportPage(true)}>
            <img src={uploadIcon} alt="Upload" />
            <span>Import</span>
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
            <input
              type="text"
              placeholder="Search..."

            />
          </div>
          <div className="profile-section">
            {/* Profile section content */}
          </div>
        </div>
        <div className="main-content">
          {showDrugsTable ? (
            <DrugTable />
          ) : showImportPage ? (
            renderStep()
          ) : showAddBatchLot ? (
            <div className="component-wrapper">
              <AddBatchLot />
            </div>
          ) : showInspection ? (
            <div className="component-wrapper">
              <Inspection />
            </div>
          ) : (
            <h1>Welcome to MedLeb Pharmacy Service</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
