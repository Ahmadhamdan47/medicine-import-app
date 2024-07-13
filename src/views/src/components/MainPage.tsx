import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    const [allData, setAllData] = useState<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [editingDrug, setEditingDrug] = useState<any | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showDrugsTable, setShowDrugsTable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const drugsPerPage = 100;
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirect to login if no token is found
        }
    }, [navigate]);

    useEffect(() => {
        if (showDrugsTable) {
            fetchDrugs();
        }
    }, [showDrugsTable]);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, allData, currentPage]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const fetchDrugs = async () => {
        try {
            const response = await axios.get('/drugs/all');
            const formattedData = response.data.map((drug: any) => ({
                DrugID: drug.DrugID || 'N/A',
                DrugName: drug.DrugName || 'N/A',
                DrugNameAR: drug.DrugNameAR || 'N/A',
                isOTC: drug.isOTC || false,
                Form: drug.Form || 'N/A',
                Presentation: drug.Presentation || 'N/A',
                Dosage: drug.Dosage || 'N/A',
                Amount: drug.Amount || 'N/A',
                Route: drug.Route || 'N/A',
                Agent: drug.Agent || 'N/A',
                Manufacturer: drug.Manufacturer || 'N/A',
                Country: drug.Country || 'N/A',
                ManufacturerID: drug.ManufacturerID || 'N/A',
                RegistrationNumber: drug.RegistrationNumber || 'N/A',
                GTIN: drug.GTIN || 'N/A',
                Notes: drug.Notes || 'N/A',
                Description: drug.Description || 'N/A',
                IngredientAndStrength: drug.IngredientAndStrength || 'N/A',
                Indication: drug.Indication || 'N/A',
                Posology: drug.Posology || 'N/A',
                MethodOfAdministration: drug.MethodOfAdministration || 'N/A',
                Contraindications: drug.Contraindications || 'N/A',
                PrecautionForUse: drug.PrecautionForUse || 'N/A',
                EffectOnFGN: drug.EffectOnFGN || 'N/A',
                SideEffect: drug.SideEffect || 'N/A',
                Toxicity: drug.Toxicity || 'N/A',
                StorageCondition: drug.StorageCondition || 'N/A',
                ShelfLife: drug.ShelfLife || 'N/A',
                IngredientLabel: drug.IngredientLabel || 'N/A',
                Price: drug.Price || 'N/A',
                ImagesPath: drug.ImagesPath || 'N/A',
                ImageDefault: drug.ImageDefault || false,
                InteractionIngredientName: drug.InteractionIngredientName || 'N/A',
                IsDouanes: drug.IsDouanes || false,
                RegistrationDate: drug.RegistrationDate || 'N/A',
                PublicPrice: drug.PublicPrice || 'N/A',
                SubsidyLabel: drug.SubsidyLabel || 'N/A',
                SubsidyPercentage: drug.SubsidyPercentage || 'N/A',
                HospPricing: drug.HospPricing || false,
                Substitutable: drug.Substitutable || false,
                CreatedBy: drug.CreatedBy || 'N/A',
                CreatedDate: drug.CreatedDate || 'N/A',
                UpdatedBy: drug.UpdatedBy || 'N/A',
                UpdatedDate: drug.UpdatedDate || 'N/A',
                OtherIngredients: drug.OtherIngredients || 'N/A',
                ATCRelatedIngredient: drug.ATCRelatedIngredient || 'N/A',
                ReviewDate: drug.ReviewDate || 'N/A',
                MoPHCode: drug.MoPHCode || 'N/A',
                CargoShippingTerms: drug.CargoShippingTerms || 'N/A',
                ProductType: drug.ProductType || 'N/A',
                NotMarketed: drug.NotMarketed || false,
                DFSequence: drug.DFSequence || 'N/A',
                PriceForeign: drug.PriceForeign || 'N/A',
                CurrencyForeign: drug.CurrencyForeign || 'N/A'
            }));
            setAllData(formattedData);
            setTableData(formattedData.slice(0, drugsPerPage));
        } catch (error) {
            console.error("Error fetching drugs:", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery) {
            const filteredData = allData.filter(drug =>
                Object.values(drug).some((value: unknown) =>
                    (value as string).toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setTableData(filteredData.slice(0, drugsPerPage));
        } else {
            setTableData(allData.slice(0, drugsPerPage));
        }
    };

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        const totalPages = Math.ceil(allData.length / drugsPerPage);
        if (nextPage <= totalPages) {
            setCurrentPage(nextPage);
            const startIndex = (nextPage - 1) * drugsPerPage;
            setTableData(allData.slice(startIndex, startIndex + drugsPerPage));
        }
    };

    const handlePreviousPage = () => {
        const prevPage = currentPage - 1;
        if (prevPage > 0) {
            setCurrentPage(prevPage);
            const startIndex = (prevPage - 1) * drugsPerPage;
            setTableData(allData.slice(startIndex, startIndex + drugsPerPage));
        }
    };

    const addDrug = async (drug: any) => {
        try {
            await axios.post('/drugs/add', drug);
            fetchDrugs();
        } catch (error) {
            console.error("Error adding drug:", error);
        }
    };

    const updateDrug = async (drug: any) => {
        try {
            await axios.put(`/drugs/update/${drug.DrugID}`, drug);
            fetchDrugs();
            setEditingDrug(null);
            setEditIndex(null);
        } catch (error) {
            console.error("Error updating drug:", error);
        }
    };

    const deleteDrug = async (drugID: number) => {
        try {
            await axios.delete(`/drugs/delete/${drugID}`);
            fetchDrugs();
        } catch (error) {
            console.error("Error deleting drug:", error);
        }
    };

    const handleAddDrug = () => {
        setEditingDrug({
            DrugID: '',
            DrugName: '',
            DrugNameAR: '',
            isOTC: false,
            Form: '',
            Presentation: '',
            Dosage: '',
            Amount: '',
            Route: '',
            Agent: '',
            Manufacturer: '',
            Country: '',
            ManufacturerID: '',
            RegistrationNumber: '',
            GTIN: '',
            Notes: '',
            Description: '',
            IngredientAndStrength: '',
            Indication: '',
            Posology: '',
            MethodOfAdministration: '',
            Contraindications: '',
            PrecautionForUse: '',
            EffectOnFGN: '',
            SideEffect: '',
            Toxicity: '',
            StorageCondition: '',
            ShelfLife: '',
            IngredientLabel: '',
            Price: '',
            ImagesPath: '',
            ImageDefault: false,
            InteractionIngredientName: '',
            IsDouanes: false,
            RegistrationDate: '',
            PublicPrice: '',
            SubsidyLabel: '',
            SubsidyPercentage: '',
            HospPricing: false,
            Substitutable: false,
            CreatedBy: '',
            CreatedDate: '',
            UpdatedBy: '',
            UpdatedDate: '',
            OtherIngredients: '',
            ATCRelatedIngredient: '',
            ReviewDate: '',
            MoPHCode: '',
            CargoShippingTerms: '',
            ProductType: '',
            NotMarketed: false,
            DFSequence: '',
            PriceForeign: '',
            CurrencyForeign: ''
        });
        setEditIndex(null);
    };

    const handleSaveDrug = (event: React.FormEvent) => {
        event.preventDefault();
        if (editingDrug.DrugID) {
            updateDrug(editingDrug);
        } else {
            addDrug(editingDrug);
        }
    };

    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value, type, checked } = event.target;
        const newTableData = [...tableData];
        newTableData[index] = {
            ...newTableData[index],
            [name]: type === 'checkbox' ? checked : value,
        };
        setTableData(newTableData);
        if (editIndex === index) {
            setEditingDrug(newTableData[index]);
        }
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setEditingDrug({ ...tableData[index] });
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setEditingDrug(null);
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
                            <button onClick={() => setShowDrugsTable(true)} style={{ color: 'black' }}>Drugs</button>
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
                        <input 
                            type="text" 
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div>
                    <div className="profile-section">
                        <img src={networkIcon} alt="User" className="icon" />
                        <img src={listIcon} alt="Settings" className="icon" />
                    </div>
                </div>
                <div className="main-content">
                    <h1>Home Page</h1>
                    {showDrugsTable ? (
                        <div>
                            <button className="small-button" onClick={handleAddDrug}>Add Drug</button>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>DrugID</th>
                                            <th>DrugName</th>
                                            <th>DrugNameAR</th>
                                            <th>isOTC</th>
                                            <th>Form</th>
                                            <th>Presentation</th>
                                            <th>Dosage</th>
                                            <th>Amount</th>
                                            <th>Route</th>
                                            <th>Agent</th>
                                            <th>Manufacturer</th>
                                            <th>Country</th>
                                            <th>ManufacturerID</th>
                                            <th>RegistrationNumber</th>
                                            <th>GTIN</th>
                                            <th>Notes</th>
                                            <th>Description</th>
                                            <th>IngredientAndStrength</th>
                                            <th>Indication</th>
                                            <th>Posology</th>
                                            <th>MethodOfAdministration</th>
                                            <th>Contraindications</th>
                                            <th>PrecautionForUse</th>
                                            <th>EffectOnFGN</th>
                                            <th>SideEffect</th>
                                            <th>Toxicity</th>
                                            <th>StorageCondition</th>
                                            <th>ShelfLife</th>
                                            <th>IngredientLabel</th>
                                            <th>Price</th>
                                            <th>ImagesPath</th>
                                            <th>ImageDefault</th>
                                            <th>InteractionIngredientName</th>
                                            <th>IsDouanes</th>
                                            <th>RegistrationDate</th>
                                            <th>PublicPrice</th>
                                            <th>SubsidyLabel</th>
                                            <th>SubsidyPercentage</th>
                                            <th>HospPricing</th>
                                            <th>Substitutable</th>
                                            <th>CreatedBy</th>
                                            <th>CreatedDate</th>
                                            <th>UpdatedBy</th>
                                            <th>UpdatedDate</th>
                                            <th>OtherIngredients</th>
                                            <th>ATCRelatedIngredient</th>
                                            <th>ReviewDate</th>
                                            <th>MoPHCode</th>
                                            <th>CargoShippingTerms</th>
                                            <th>ProductType</th>
                                            <th>NotMarketed</th>
                                            <th>DFSequence</th>
                                            <th>PriceForeign</th>
                                            <th>CurrencyForeign</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((drug, index) => (
                                            <tr key={drug.DrugID}>
                                                {editIndex === index ? (
                                                    <>
                                                        <td><input type="text" name="DrugID" value={drug.DrugID} onChange={(e) => handleEditChange(e, index)} disabled /></td>
                                                        <td><input type="text" name="DrugName" value={drug.DrugName} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="DrugNameAR" value={drug.DrugNameAR} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="checkbox" name="isOTC" checked={drug.isOTC} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Form" value={drug.Form} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Presentation" value={drug.Presentation} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Dosage" value={drug.Dosage} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Amount" value={drug.Amount} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Route" value={drug.Route} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Agent" value={drug.Agent} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Manufacturer" value={drug.Manufacturer} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Country" value={drug.Country} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="ManufacturerID" value={drug.ManufacturerID} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="RegistrationNumber" value={drug.RegistrationNumber} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="GTIN" value={drug.GTIN} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Notes" value={drug.Notes} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Description" value={drug.Description} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="IngredientAndStrength" value={drug.IngredientAndStrength} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Indication" value={drug.Indication} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Posology" value={drug.Posology} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="MethodOfAdministration" value={drug.MethodOfAdministration} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Contraindications" value={drug.Contraindications} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="PrecautionForUse" value={drug.PrecautionForUse} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="EffectOnFGN" value={drug.EffectOnFGN} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="SideEffect" value={drug.SideEffect} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Toxicity" value={drug.Toxicity} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="StorageCondition" value={drug.StorageCondition} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="ShelfLife" value={drug.ShelfLife} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="IngredientLabel" value={drug.IngredientLabel} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="Price" value={drug.Price} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="ImagesPath" value={drug.ImagesPath} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="checkbox" name="ImageDefault" checked={drug.ImageDefault} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="InteractionIngredientName" value={drug.InteractionIngredientName} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="checkbox" name="IsDouanes" checked={drug.IsDouanes} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="RegistrationDate" value={drug.RegistrationDate} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="PublicPrice" value={drug.PublicPrice} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="SubsidyLabel" value={drug.SubsidyLabel} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="SubsidyPercentage" value={drug.SubsidyPercentage} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="checkbox" name="HospPricing" checked={drug.HospPricing} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="checkbox" name="Substitutable" checked={drug.Substitutable} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="CreatedBy" value={drug.CreatedBy} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="CreatedDate" value={drug.CreatedDate} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="UpdatedBy" value={drug.UpdatedBy} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="UpdatedDate" value={drug.UpdatedDate} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="OtherIngredients" value={drug.OtherIngredients} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="ATCRelatedIngredient" value={drug.ATCRelatedIngredient} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="ReviewDate" value={drug.ReviewDate} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="MoPHCode" value={drug.MoPHCode} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="CargoShippingTerms" value={drug.CargoShippingTerms} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="ProductType" value={drug.ProductType} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="checkbox" name="NotMarketed" checked={drug.NotMarketed} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="DFSequence" value={drug.DFSequence} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="PriceForeign" value={drug.PriceForeign} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td><input type="text" name="CurrencyForeign" value={drug.CurrencyForeign} onChange={(e) => handleEditChange(e, index)} /></td>
                                                        <td>
                                                            <button className="small-button" onClick={handleSaveDrug}>Save</button>
                                                            <button className="small-button" onClick={handleCancelEdit}>Cancel</button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{drug.DrugID}</td>
                                                        <td>{drug.DrugName}</td>
                                                        <td>{drug.DrugNameAR}</td>
                                                        <td>{drug.isOTC ? 'Yes' : 'No'}</td>
                                                        <td>{drug.Form}</td>
                                                        <td>{drug.Presentation}</td>
                                                        <td>{drug.Dosage}</td>
                                                        <td>{drug.Amount}</td>
                                                        <td>{drug.Route}</td>
                                                        <td>{drug.Agent}</td>
                                                        <td>{drug.Manufacturer}</td>
                                                        <td>{drug.Country}</td>
                                                        <td>{drug.ManufacturerID}</td>
                                                        <td>{drug.RegistrationNumber}</td>
                                                        <td>{drug.GTIN}</td>
                                                        <td>{drug.Notes}</td>
                                                        <td>{drug.Description}</td>
                                                        <td>{drug.IngredientAndStrength}</td>
                                                        <td>{drug.Indication}</td>
                                                        <td>{drug.Posology}</td>
                                                        <td>{drug.MethodOfAdministration}</td>
                                                        <td>{drug.Contraindications}</td>
                                                        <td>{drug.PrecautionForUse}</td>
                                                        <td>{drug.EffectOnFGN}</td>
                                                        <td>{drug.SideEffect}</td>
                                                        <td>{drug.Toxicity}</td>
                                                        <td>{drug.StorageCondition}</td>
                                                        <td>{drug.ShelfLife}</td>
                                                        <td>{drug.IngredientLabel}</td>
                                                        <td>{drug.Price}</td>
                                                        <td>{drug.ImagesPath}</td>
                                                        <td>{drug.ImageDefault ? 'Yes' : 'No'}</td>
                                                        <td>{drug.InteractionIngredientName}</td>
                                                        <td>{drug.IsDouanes ? 'Yes' : 'No'}</td>
                                                        <td>{drug.RegistrationDate}</td>
                                                        <td>{drug.PublicPrice}</td>
                                                        <td>{drug.SubsidyLabel}</td>
                                                        <td>{drug.SubsidyPercentage}</td>
                                                        <td>{drug.HospPricing ? 'Yes' : 'No'}</td>
                                                        <td>{drug.Substitutable ? 'Yes' : 'No'}</td>
                                                        <td>{drug.CreatedBy}</td>
                                                        <td>{drug.CreatedDate}</td>
                                                        <td>{drug.UpdatedBy}</td>
                                                        <td>{drug.UpdatedDate}</td>
                                                        <td>{drug.OtherIngredients}</td>
                                                        <td>{drug.ATCRelatedIngredient}</td>
                                                        <td>{drug.ReviewDate}</td>
                                                        <td>{drug.MoPHCode}</td>
                                                        <td>{drug.CargoShippingTerms}</td>
                                                        <td>{drug.ProductType}</td>
                                                        <td>{drug.NotMarketed ? 'Yes' : 'No'}</td>
                                                        <td>{drug.DFSequence}</td>
                                                        <td>{drug.PriceForeign}</td>
                                                        <td>{drug.CurrencyForeign}</td>
                                                        <td>
                                                            <button className="small-button" onClick={() => handleEdit(index)}>Edit</button>
                                                            <button className="small-button" onClick={() => deleteDrug(drug.DrugID)}>Delete</button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination">
                                <button
                                    className="small-button"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage}</span>
                                <button
                                    className="small-button"
                                    onClick={handleNextPage}
                                    disabled={currentPage === Math.ceil(allData.length / drugsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        renderStep()
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
