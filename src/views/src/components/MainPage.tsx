import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsGrid from 'jsgrid';
import $ from 'jquery';
import 'jsgrid/dist/jsgrid.min.css';
import 'jsgrid/dist/jsgrid-theme.min.css';
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
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDrugsGrid, setShowDrugsGrid] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirect to login if no token is found
        }
    }, [navigate]);

    useEffect(() => {
        if (showDrugsGrid) {
            console.log("showDrugsGrid is true, calling loadDrugsGrid...");
            loadDrugsGrid();
        }
    }, [showDrugsGrid]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        console.log("Dropdown toggled:", !showDropdown);
    };

    const loadDrugsGrid = async () => {
        try {
            console.log("Fetching drugs data...");
            const response = await axios.get('/drugs/all');
            const drugs = response.data;
            console.log("Fetched drugs data:", drugs);
            $("#jsGrid").jsGrid({
                width: "100%",
                height: "400px",
                inserting: true,
                editing: true,
                sorting: true,
                paging: true,
                data: drugs,

                controller: {
                    loadData: async () => {
                        console.log("Loading data...");
                        const response = await axios.get('/drugs/all');
                        return response.data;
                    },
                    insertItem: async (item: any) => {
                        console.log("Inserting item:", item);
                        const response = await axios.post('/drugs/add', item);
                        return response.data;
                    },
                    updateItem: async (item: any) => {
                        console.log("Updating item:", item);
                        const response = await axios.put(`/drugs/update/${item.DrugID}`, item);
                        return response.data;
                    },
                    deleteItem: async (item: any) => {
                        console.log("Deleting item:", item);
                        const response = await axios.delete(`/drugs/delete/${item.DrugID}`);
                        return response.data;
                    }
                },

                fields: [
                    { name: "DrugID", type: "number", width: 50, editing: false },
                    { name: "DrugName", type: "text", width: 150 },
                    { name: "DrugNameAR", type: "text", width: 150 },
                    { name: "isOTC", type: "checkbox", width: 50 },
                    { name: "Form", type: "text", width: 100 },
                    { name: "Presentation", type: "text", width: 100 },
                    { name: "Dosage", type: "text", width: 100 },
                    { name: "Amount", type: "number", width: 50 },
                    { name: "Route", type: "text", width: 100 },
                    { name: "Agent", type: "text", width: 100 },
                    { name: "Manufacturer", type: "text", width: 100 },
                    { name: "Country", type: "text", width: 100 },
                    { name: "ManufacturerID", type: "number", width: 50 },
                    { name: "RegistrationNumber", type: "text", width: 100 },
                    { name: "GTIN", type: "text", width: 100 },
                    { name: "Notes", type: "text", width: 100 },
                    { name: "Description", type: "text", width: 100 },
                    { name: "IngredientAndStrength", type: "text", width: 100 },
                    { name: "Indication", type: "text", width: 100 },
                    { name: "Posology", type: "text", width: 100 },
                    { name: "MethodOfAdministration", type: "text", width: 100 },
                    { name: "Contraindications", type: "text", width: 100 },
                    { name: "PrecautionForUse", type: "text", width: 100 },
                    { name: "EffectOnFGN", type: "text", width: 100 },
                    { name: "SideEffect", type: "text", width: 100 },
                    { name: "Toxicity", type: "text", width: 100 },
                    { name: "StorageCondition", type: "text", width: 100 },
                    { name: "ShelfLife", type: "text", width: 100 },
                    { name: "IngredientLabel", type: "text", width: 100 },
                    { name: "Price", type: "number", width: 50 },
                    { name: "ImagesPath", type: "text", width: 100 },
                    { name: "ImageDefault", type: "checkbox", width: 50 },
                    { name: "InteractionIngredientName", type: "text", width: 100 },
                    { name: "IsDouanes", type: "checkbox", width: 50 },
                    { name: "RegistrationDate", type: "text", width: 100 },
                    { name: "PublicPrice", type: "number", width: 50 },
                    { name: "SubsidyLabel", type: "text", width: 100 },
                    { name: "SubsidyPercentage", type: "number", width: 50 },
                    { name: "HospPricing", type: "checkbox", width: 50 },
                    { name: "Substitutable", type: "checkbox", width: 50 },
                    { name: "CreatedBy", type: "text", width: 100 },
                    { name: "CreatedDate", type: "text", width: 100 },
                    { name: "UpdatedBy", type: "text", width: 100 },
                    { name: "UpdatedDate", type: "text", width: 100 },
                    { name: "OtherIngredients", type: "text", width: 100 },
                    { name: "ATCRelatedIngredient", type: "text", width: 100 },
                    { name: "ReviewDate", type: "text", width: 100 },
                    { name: "MoPHCode", type: "text", width: 100 },
                    { name: "CargoShippingTerms", type: "text", width: 100 },
                    { name: "ProductType", type: "text", width: 100 },
                    { name: "NotMarketed", type: "checkbox", width: 50 },
                    { name: "DFSequence", type: "text", width: 100 },
                    { name: "PriceForeign", type: "number", width: 50 },
                    { name: "CurrencyForeign", type: "text", width: 100 },
                    { type: "control" }
                ]
            });
        } catch (error) {
            console.error("Error loading drugs:", error);
        }
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
                    <a href="#" className="icon" onClick={toggleDropdown}>
                        <img src={networkIcon} alt="Dashboard" />
                        <span>Dashboard</span>
                    </a>
                    {showDropdown && (
                        <div className="dropdown">
                            <button onClick={() => {
                                setShowDrugsGrid(true);
                                console.log("Drugs button clicked, setShowDrugsGrid(true)");
                            }}>Drugs</button>
                        </div>
                    )}
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
                    {showDrugsGrid && <div id="jsGrid"></div>}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
