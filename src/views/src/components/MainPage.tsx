import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
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
  const drugsPerPage = 5601;
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportPage, setShowImportPage] = useState(false);
  const [showAddBatchLot, setShowAddBatchLot] = useState(false);
  const [showInspection, setShowInspection] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token is found
    }
  }, [navigate]);

  useEffect(() => {
    fetchDrugs(); // Fetch drugs when the component mounts
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, allData, currentPage]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const fetchATC = async (drugID: string) => {
    try {
      const response = await axios.get(`/atc/atc/${drugID}`);
      return response.data.Code || 'N/A';
    } catch (error) {
      console.error(`Error fetching ATC for DrugID ${drugID}:`, error);
      return 'N/A';
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get('/drugs/all');
      const drugs = response.data;
      const drugsWithATC = await Promise.all(drugs.map(async (drug: any) => {
        const atcCode = await fetchATC(drug.DrugID);
        return {
          ...drug,
          ATC: atcCode,
        };
      }));

      const formattedData = drugsWithATC.map((drug: any) => ({
        DrugID: drug.DrugID || 'N/A',
        DrugName: drug.DrugName || 'N/A',
        DrugNameAR: drug.DrugNameAR || 'N/A',
        ATC: drug.ATC || 'N/A',
        isOTC: drug.isOTC || false,
        Form: drug.Form || 'N/A',
        Presentation: drug.Presentation || 'N/A',
        Dosage: drug.Dosage || 'N/A',
        Stratum: drug.Stratum || 'N/A',
        Amount: drug.Amount || 'N/A',
        Route: drug.Route || 'N/A',
        Agent: drug.Agent || 'N/A',
        Manufacturer: drug.Manufacturer || 'N/A',
        Country: drug.Country || 'N/A',
        ManufacturerID: drug.ManufacturerID || 'N/A',
        RegistrationNumber: drug.RegistrationNumber || 'N/A',
        Notes: drug.Notes || 'N/A',
        Description: drug.Description || 'N/A',
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
      Stratum: '',
      Amount: '',
      Route: '',
      Agent: '',
      Manufacturer: '',
      Country: '',
      ManufacturerID: '',
      RegistrationNumber: '',
      Notes: '',
      Description: '',
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
      case 'add':
        return <AddBatchLot />;
      default:
        return <div>Welcome to MedLeb Pharmacy Service</div>;
    }
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: 'DrugID', header: 'DrugID' },
      { accessorKey: 'DrugName', header: 'DrugName' },
      { accessorKey: 'DrugNameAR', header: 'DrugNameAR' },
      { accessorKey: 'ATC', header: 'ATC' },
      { accessorKey: 'isOTC', header: 'isOTC' },
      { accessorKey: 'Form', header: 'Form' },
      { accessorKey: 'Presentation', header: 'Presentation' },
      { accessorKey: 'Dosage', header: 'Dosage' },
      { accessorKey: 'Stratum', header: 'Stratum' },
      { accessorKey: 'Amount', header: 'Amount' },
      { accessorKey: 'Route', header: 'Route' },
      { accessorKey: 'Agent', header: 'Agent' },
      { accessorKey: 'Manufacturer', header: 'Manufacturer' },
      { accessorKey: 'Country', header: 'Country' },
      { accessorKey: 'ManufacturerID', header: 'ManufacturerID' },
      { accessorKey: 'RegistrationNumber', header: 'RegistrationNumber' },
      { accessorKey: 'Notes', header: 'Notes' },
      { accessorKey: 'Description', header: 'Description' },
      { accessorKey: 'Indication', header: 'Indication' },
      { accessorKey: 'Posology', header: 'Posology' },
      { accessorKey: 'MethodOfAdministration', header: 'MethodOfAdministration' },
      { accessorKey: 'Contraindications', header: 'Contraindications' },
      { accessorKey: 'PrecautionForUse', header: 'PrecautionForUse' },
      { accessorKey: 'EffectOnFGN', header: 'EffectOnFGN' },
      { accessorKey: 'SideEffect', header: 'SideEffect' },
      { accessorKey: 'Toxicity', header: 'Toxicity' },
      { accessorKey: 'StorageCondition', header: 'StorageCondition' },
      { accessorKey: 'ShelfLife', header: 'ShelfLife' },
      { accessorKey: 'IngredientLabel', header: 'IngredientLabel' },
      { accessorKey: 'Price', header: 'Price' },
      { accessorKey: 'ImagesPath', header: 'ImagesPath' },
      { accessorKey: 'ImageDefault', header: 'ImageDefault' },
      { accessorKey: 'InteractionIngredientName', header: 'InteractionIngredientName' },
      { accessorKey: 'IsDouanes', header: 'IsDouanes' },
      { accessorKey: 'RegistrationDate', header: 'RegistrationDate' },
      { accessorKey: 'PublicPrice', header: 'PublicPrice' },
      { accessorKey: 'SubsidyLabel', header: 'SubsidyLabel' },
      { accessorKey: 'SubsidyPercentage', header: 'SubsidyPercentage' },
      { accessorKey: 'HospPricing', header: 'HospPricing' },
      { accessorKey: 'Substitutable', header: 'Substitutable' },
      { accessorKey: 'CreatedBy', header: 'CreatedBy' },
      { accessorKey: 'CreatedDate', header: 'CreatedDate' },
      { accessorKey: 'UpdatedBy', header: 'UpdatedBy' },
      { accessorKey: 'UpdatedDate', header: 'UpdatedDate' },
      { accessorKey: 'OtherIngredients', header: 'OtherIngredients' },
      { accessorKey: 'ATCRelatedIngredient', header: 'ATCRelatedIngredient' },
      { accessorKey: 'ReviewDate', header: 'ReviewDate' },
      { accessorKey: 'MoPHCode', header: 'MoPHCode' },
      { accessorKey: 'CargoShippingTerms', header: 'CargoShippingTerms' },
      { accessorKey: 'ProductType', header: 'ProductType' },
      { accessorKey: 'NotMarketed', header: 'NotMarketed' },
      { accessorKey: 'DFSequence', header: 'DFSequence' },
      { accessorKey: 'PriceForeign', header: 'PriceForeign' },
      { accessorKey: 'CurrencyForeign', header: 'CurrencyForeign' },
      {
        accessorKey: 'actions', header: 'Actions', Cell: ({ cell, row }) => (
          <div>
            <button className="small-button" onClick={() => handleEdit(row.index)}>Edit</button>
            <button className="small-button" onClick={() => deleteDrug(row.original.DrugID)}>Delete</button>
          </div>
        )
      }, // Custom cell renderer for actions
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: tableData,
  });

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
              <button onClick={() => { setShowDrugsTable(true); setShowImportPage(false); setTableData(allData.slice(0, drugsPerPage)); }} style={{ color: 'black' }}>Drugs</button>
            </div>
          )}
        </div>
        <div className="divider"></div>
        <div className="icon-group drug-group">
          <a href="#" className="icon" onClick={() => { setShowAddBatchLot(true); setShowInspection(false); setShowImportPage(false); }}>
            <img src={addIcon} alt="Add" />
            <span>Add</span>
          </a>
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
          {showDrugsTable ? (
            <div className="table-container">
              <MantineReactTable table={table} />
            </div>
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
