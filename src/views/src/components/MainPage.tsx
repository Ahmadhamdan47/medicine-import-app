import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Menu } from '@mantine/core';
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
  const [totalPages, setTotalPages] = useState(1);
  const drugsPerPage = 100; // Number of drugs per page
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportPage, setShowImportPage] = useState(false);
  const [showAddBatchLot, setShowAddBatchLot] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25); // Default rows per page

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token is found
    }
  }, [navigate]);

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

  const fetchPresentation = async (drugID: number) => {
    try {
      const response = await axios.get(`/drugs/presentation/id/${drugID}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching presentation for DrugID ${drugID}:`, error);
      return null;
    }
  };

  const fetchDosage = async (drugID: number) => {
    try {
      const response = await axios.get(`/drugs/dosage/id/${drugID}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dosage for DrugID ${drugID}:`, error);
      return null;
    }
  };

  const fetchDrugs = async (page = 1, limit = rowsPerPage) => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`/drugs/paginated?page=${page}&limit=${limit}`);
      const { drugs, totalPages } = response.data;
  
      const drugsWithDetails = await Promise.all(drugs.map(async (drug: any) => {
        const atcCode = await fetchATC(drug.DrugID);
        const presentation = await fetchPresentation(drug.DrugID);
        const dosage = await fetchDosage(drug.DrugID);
  
        return {
          ...drug,
          ATC: atcCode,
          PresentationDetails: presentation,
          DosageDetails: dosage,
        };
      }));
  
      const formattedData = drugsWithDetails.map((drug) => ({
        DrugID: drug.DrugID || 'N/A',
        DrugName: drug.DrugName || 'N/A',
        DrugNameAR: drug.DrugNameAR || 'N/A',
        ProductType: drug.ProductType || 'N/A',
        ATC: drug.ATC || 'N/A',
        ATCRelatedIngredient: drug.ATCRelatedIngredient || 'N/A',
        OtherIngredients: drug.OtherIngredients || 'N/A',
        Dosage: drug.Dosage || 'N/A',
        DosageNumerator1: drug.DosageDetails?.Numerator1 || 'N/A',
        DosageNumerator1Unit: drug.DosageDetails?.Numerator1Unit || 'N/A',
        DosageDenominator1: drug.DosageDetails?.Denominator1 || 'N/A',
        DosageDenominator1Unit: drug.DosageDetails?.Denominator1Unit || 'N/A',
        DosageNumerator2: drug.DosageDetails?.Numerator2 || 'N/A',
        DosageNumerator2Unit: drug.DosageDetails?.Numerator2Unit || 'N/A',
        DosageDenominator2: drug.DosageDetails?.Denominator2 || 'N/A',
        DosageDenominator2Unit: drug.DosageDetails?.Denominator2Unit || 'N/A',
        DosageNumerator3: drug.DosageDetails?.Numerator3 || 'N/A',
        DosageNumerator3Unit: drug.DosageDetails?.Numerator3Unit || 'N/A',
        DosageDenominator3: drug.DosageDetails?.Denominator3 || 'N/A',
        DosageDenominator3Unit: drug.DosageDetails?.Denominator3Unit || 'N/A',
        isOTC: drug.isOTC || false,
        DFSequence: drug.DFSequence || 'N/A',
        Form: drug.Form || 'N/A',
        Presentation: drug.Presentation || 'N/A',
        PresentationUnitQuantity1: drug.PresentationDetails?.UnitQuantity1 || 'N/A',
        PresentationUnitType1: drug.PresentationDetails?.UnitType1 || 'N/A',
        PresentationUnitQuantity2: drug.PresentationDetails?.UnitQuantity2 || 'N/A',
        PresentationUnitType2: drug.PresentationDetails?.UnitType2 || 'N/A',
        PresentationPackageQuantity1: drug.PresentationDetails?.PackageQuantity1 || 'N/A',
        PresentationPackageType1: drug.PresentationDetails?.PackageType1 || 'N/A',
        PresentationPackageQuantity2: drug.PresentationDetails?.PackageQuantity2 || 'N/A',
        PresentationPackageType2: drug.PresentationDetails?.PackageType2 || 'N/A',
        PresentationPackageQuantity3: drug.PresentationDetails?.PackageQuantity3 || 'N/A',
        PresentationPackageType3: drug.PresentationDetails?.PackageType3 || 'N/A',
        PresentationDescription: drug.PresentationDetails?.Description || 'N/A',
        Parent: drug.RouteParent || 'N/A',
        Route: drug.Route || 'N/A',
        Parentaral: drug.Parentaral || 'N/A',
        Stratum: drug.Stratum || 'N/A',
        Amount: drug.Amount || 0,
        Agent: drug.Agent || 'N/A',
        Manufacturer: drug.Manufacturer || 'N/A',
        Country: drug.Country || 'N/A',
        Price: drug.Price || 'N/A',
      }));
  
      setAllData(formattedData);
      setTableData(formattedData);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching drugs:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };
  
  const handleFetchDrugs = () => {
    setShowDrugsTable(true);
    setShowImportPage(false);
    fetchDrugs(currentPage);
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

  const handleSaveRow = async ({ row, values, exitEditingMode }: { row: any, values: any, exitEditingMode: () => void }) => {
    try {
      const updatedDrug = { ...row.original, ...values };
      await axios.put(`/drugs/update/${updatedDrug.DrugID}`, updatedDrug);
      
      // Update the table data locally
      setTableData(prevData => prevData.map(drug => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug)));
      setAllData(prevData => prevData.map(drug => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug)));
      
      exitEditingMode(); // Required to exit editing mode and close the editor
    } catch (error) {
      console.error("Error updating drug:", error);
    }
  };
  const handleRowsPerPageChange = (event: any) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    fetchDrugs(currentPage, newRowsPerPage);
  };
  
  const handleDeleteRow = async (row: any) => {
    try {
      if (window.confirm('Are you sure you want to delete this drug?')) {
        await axios.delete(`/drugs/delete/${row.original.DrugID}`);
        
        // Update the table data locally
        setTableData(prevData => prevData.filter(drug => drug.DrugID !== row.original.DrugID));
        setAllData(prevData => prevData.filter(drug => drug.DrugID !== row.original.DrugID));
      }
    } catch (error) {
      console.error("Error deleting drug:", error);
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

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
    fetchDrugs(newPage);
  };

  const renderPaginationControls = () => (
    <div
      className="pagination-controls"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        bottom: '20px',
        right: '20px',
      }}
    >
      <label style={{ marginRight: '10px' }}>Rows per page:</label>
      <select value={rowsPerPage} onChange={handleRowsPerPageChange} style={{ marginRight: '20px' }}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        style={{
          width: '80px',
          padding: '5px 10px',
          margin: '5px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Previous
      </button>
      <span
        style={{
          padding: '5px 10px',
          margin: '5px',
          fontSize: '14px',
        }}
      >
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        style={{
          width: '80px',
          padding: '5px 10px',
          margin: '5px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Next
      </button>
    </div>
  );
  
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
      { accessorKey: 'DrugID', header: 'DrugID', size: 80 },
      { accessorKey: 'DrugName', header: 'DrugName', size: 100 },
      { accessorKey: 'DrugNameAR', header: 'DrugNameAR', size: 100 },
      { accessorKey: 'ProductType', header: 'ProductType', size: 100 },
      { accessorKey: 'ATC', header: 'ATC', size: 80 },
      { accessorKey: 'ATCRelatedIngredient', header: 'ATCRelatedIngredient', size: 150 },
      { accessorKey: 'OtherIngredients', header: 'OtherIngredients', size: 150 },
      { accessorKey: 'Dosage', header: 'Dosage', size: 100 },
      { accessorKey: 'DosageNumerator1', header: 'Dosage Numerator 1', size: 120 },
      { accessorKey: 'DosageNumerator1Unit', header: 'Dosage Numerator 1 Unit', size: 150 },
      { accessorKey: 'DosageDenominator1', header: 'Dosage Denominator 1', size: 150 },
      { accessorKey: 'DosageDenominator1Unit', header: 'Dosage Denominator 1 Unit', size: 150 },
      { accessorKey: 'DosageNumerator2', header: 'Dosage Numerator 2', size: 120 },
      { accessorKey: 'DosageNumerator2Unit', header: 'Dosage Numerator 2 Unit', size: 150 },
      { accessorKey: 'DosageDenominator2', header: 'Dosage Denominator 2', size: 150 },
      { accessorKey: 'DosageDenominator2Unit', header: 'Dosage Denominator 2 Unit', size: 150 },
      { accessorKey: 'DosageNumerator3', header: 'Dosage Numerator 3', size: 120 },
      { accessorKey: 'DosageNumerator3Unit', header: 'Dosage Numerator 3 Unit', size: 150 },
      { accessorKey: 'DosageDenominator3', header: 'Dosage Denominator 3', size: 150 },
      { accessorKey: 'DosageDenominator3Unit', header: 'Dosage Denominator 3 Unit', size: 150 },
      { accessorKey: 'isOTC', header: 'isOTC', size: 60 },
      { accessorKey: 'DFSequence', header: 'DFSequence', size: 100 },
      { accessorKey: 'Form', header: 'Form', size: 100 },
      { accessorKey: 'Presentation', header: 'Presentation', size: 120 },
      { accessorKey: 'PresentationUnitQuantity1', header: 'Presentation Unit Quantity 1', size: 180 },
      { accessorKey: 'PresentationUnitType1', header: 'Presentation Unit Type 1', size: 150 },
      { accessorKey: 'PresentationUnitQuantity2', header: 'Presentation Unit Quantity 2', size: 180 },
      { accessorKey: 'PresentationUnitType2', header: 'Presentation Unit Type 2', size: 150 },
      { accessorKey: 'PresentationPackageQuantity1', header: 'Presentation Package Quantity 1', size: 180 },
      { accessorKey: 'PresentationPackageType1', header: 'Presentation Package Type 1', size: 150 },
      { accessorKey: 'PresentationPackageQuantity2', header: 'Presentation Package Quantity 2', size: 180 },
      { accessorKey: 'PresentationPackageType2', header: 'Presentation Package Type 2', size: 150 },
      { accessorKey: 'PresentationPackageQuantity3', header: 'Presentation Package Quantity 3', size: 180 },
      { accessorKey: 'PresentationPackageType3', header: 'Presentation Package Type 3', size: 150 },
      { accessorKey: 'PresentationDescription', header: 'Presentation Description', size: 180 },
      { accessorKey: 'Parent', header: 'Route Parent', size: 100},
      { accessorKey: 'Route', header: 'Route', size: 100 },
      { accessorKey: 'Parentaral', header: 'Parentaral', size: 60 },
      { accessorKey: 'Stratum', header: 'Stratum', size: 100 },
      { accessorKey: 'Amount', header: 'Amount', size: 80 },
      { accessorKey: 'Agent', header: 'Agent', size: 100 },
      { accessorKey: 'Manufacturer', header: 'Manufacturer', size: 120 },
      { accessorKey: 'Country', header: 'Country', size: 80 },
      { accessorKey: 'ManufacturerID', header: 'ManufacturerID', size: 120 },
      { accessorKey: 'RegistrationNumber', header: 'RegistrationNumber', size: 150 },
      { accessorKey: 'Notes', header: 'Notes', size: 100 },
      { accessorKey: 'Description', header: 'Description', size: 120 },
      { accessorKey: 'Indication', header: 'Indication', size: 100 },
      { accessorKey: 'Posology', header: 'Posology', size: 100 },
      { accessorKey: 'MethodOfAdministration', header: 'MethodOfAdministration', size: 180 },
      { accessorKey: 'Contraindications', header: 'Contraindications', size: 150 },
      { accessorKey: 'PrecautionForUse', header: 'PrecautionForUse', size: 150 },
      { accessorKey: 'EffectOnFGN', header: 'EffectOnFGN', size: 120 },
      { accessorKey: 'SideEffect', header: 'SideEffect', size: 100 },
      { accessorKey: 'Toxicity', header: 'Toxicity', size: 80 },
      { accessorKey: 'StorageCondition', header: 'StorageCondition', size: 150 },
      { accessorKey: 'ShelfLife', header: 'ShelfLife', size: 100 },
      { accessorKey: 'IngredientLabel', header: 'IngredientLabel', size: 150 },
      { accessorKey: 'Price', header: 'Price', size: 80 },
      { accessorKey: 'ImagesPath', header: 'ImagesPath', size: 100 },
      { accessorKey: 'ImageDefault', header: 'ImageDefault', size: 100 },
      { accessorKey: 'InteractionIngredientName', header: 'InteractionIngredientName', size: 180 },
      { accessorKey: 'IsDouanes', header: 'IsDouanes', size: 100 },
      { accessorKey: 'RegistrationDate', header: 'RegistrationDate', size: 150 },
      { accessorKey: 'PublicPrice', header: 'PublicPrice', size: 100 },
      { accessorKey: 'SubsidyLabel', header: 'SubsidyLabel', size: 100 },
      { accessorKey: 'SubsidyPercentage', header: 'SubsidyPercentage', size: 150 },
      { accessorKey: 'HospPricing', header: 'HospPricing', size: 100 },
      { accessorKey: 'Substitutable', header: 'Substitutable', size: 120 },
      { accessorKey: 'CreatedBy', header: 'CreatedBy', size: 100 },
      { accessorKey: 'CreatedDate', header: 'CreatedDate', size: 150 },
      { accessorKey: 'UpdatedBy', header: 'UpdatedBy', size: 100 },
      { accessorKey: 'UpdatedDate', header: 'UpdatedDate', size: 150 },
      { accessorKey: 'ReviewDate', header: 'ReviewDate', size: 100 },
      { accessorKey: 'MoPHCode', header: 'MoPHCode', size: 80 },
      { accessorKey: 'CargoShippingTerms', header: 'CargoShippingTerms', size: 150 },
      { accessorKey: 'NotMarketed', header: 'NotMarketed', size: 100 },
      { accessorKey: 'PriceForeign', header: 'PriceForeign', size: 100 },
      { accessorKey: 'CurrencyForeign', header: 'CurrencyForeign', size: 100 },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: tableData,
    enableColumnResizing: true,
    enableEditing: true,
    enableStickyHeader: true,
    manualPagination: true,
    enablePagination: false,
    state: {
      isLoading,
    },
    initialState: {
      density: 'xs',
      columnVisibility: {
        DrugID: false,
        DrugNameAR: false,
        isOTC: false,
        PresentationUnitQuantity1: false,
        PresentationUnitType1: false,
        PresentationUnitQuantity2: false,
        PresentationUnitType2: false,
        PresentationPackageQuantity1: false,
        PresentationPackageType1: false,
        PresentationPackageQuantity2: false,
        PresentationPackageType2: false,
        PresentationPackageQuantity3: false,
        PresentationPackageType3: false,
        PresentationDescription: false,
        DosageNumerator1: false,
        DosageNumerator1Unit: false,
        DosageDenominator1: false,
        DosageDenominator1Unit: false,
        DosageNumerator2: false,
        DosageNumerator2Unit: false,
        DosageDenominator2: false,
        DosageDenominator2Unit: false,
        DosageNumerator3: false,
        DosageNumerator3Unit: false,
        DosageDenominator3: false,
        DosageDenominator3Unit: false,
        Amount: false,
        ManufacturerID: false,
        RegistrationNumber: false,
        Notes: false,
        Description: false,
        Indication: false,
        Posology: false,
        MethodOfAdministration: false,
        Contraindications: false,
        PrecautionForUse: false,
        EffectOnFGN: false,
        SideEffect: false,
        Toxicity: false,
        StorageCondition: false,
        ShelfLife: false,
        IngredientLabel: false,
        ImagesPath: false,
        ImageDefault: false,
        InteractionIngredientName: false,
        IsDouanes: false,
        RegistrationDate: false,
        PublicPrice: false,
        SubsidyLabel: false,
        SubsidyPercentage: false,
        HospPricing: false,
        Substitutable: false,
        CreatedBy: false,
        CreatedDate: false,
        UpdatedBy: false,
        UpdatedDate: false,
        ReviewDate: false,
        MoPHCode: false,
        CargoShippingTerms: false,
        NotMarketed: false,
        PriceForeign: false,
        CurrencyForeign: false,
      }
    },
    onEditingRowSave: handleSaveRow,
    renderRowActionMenuItems: ({ row }) => [
      <Menu.Item
        key="delete"
        onClick={() => handleDeleteRow(row)}
        style={{ color: 'red' }}
      >
        Delete
      </Menu.Item>,
    ],
  });

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
              <button onClick={handleFetchDrugs} style={{ color: 'black' }}>Drugs</button>
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
            {/* Profile section content */}
          </div>
        </div>
        <div className="main-content">
          {showDrugsTable ? (
            <div className="table-container">
              <MantineReactTable table={table} />
              {renderPaginationControls()}
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
