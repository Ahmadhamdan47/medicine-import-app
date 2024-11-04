// src/components/DrugTable.tsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Menu } from '@mantine/core';

const DrugTable: React.FC = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25); // Default rows per page
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByATC, setSortByATC] = useState(false); // State to track sorting by ATC
  const [columnPreset, setColumnPreset] = useState<string>('default');

  useEffect(() => {
    fetchDrugs(currentPage, rowsPerPage, sortByATC);
  }, [currentPage, rowsPerPage, sortByATC]);

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

  const fetchDrugs = async (page = 1, limit = rowsPerPage, sortByATC = false) => {
    setIsLoading(true); // Start loading
    try {
      const endpoint = sortByATC ? '/drugs/paginatedByATC' : '/drugs/paginated';
      const response = await axios.get(`${endpoint}?page=${page}&limit=${limit}`);
      const { drugs, totalPages } = response.data;

      const drugsWithDetails = await Promise.all(drugs.map(async (drug: any) => {
        const presentation = await fetchPresentation(drug.DrugID);
        const dosage = await fetchDosage(drug.DrugID);

        return {
          ...drug,
          PresentationDetails: presentation,
          DosageDetails: dosage,
        };
      }));

      const formattedData = drugsWithDetails.map((drug) => ({
        DrugID: drug.DrugID || 'N/A',
        DrugName: drug.DrugName || 'N/A',
        DrugNameAR: drug.DrugNameAR || 'N/A',
        ProductType: drug.ProductType || 'N/A',
        ATC: drug.ATC_Code || 'N/A', // Adjusted here for ATC_Code
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
        FormLNDI: drug.FormLNDI || 'N/A',
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
      setTableData(formattedData.slice((page - 1) * rowsPerPage, page * rowsPerPage));
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching drugs:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleSortByATC = () => {
    setSortByATC(prev => !prev);
  };

  const handleSearch = () => {
    if (searchQuery) {
      const filteredData = allData.filter(drug =>
        Object.values(drug).some((value: unknown) =>
          (value as string).toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setTableData(filteredData.slice(0, rowsPerPage));
    } else {
      setTableData(allData.slice(0, rowsPerPage));
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
    setCurrentPage(1); // Reset to first page when changing rows per page
    fetchDrugs(1, newRowsPerPage, sortByATC);
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchDrugs(newPage, rowsPerPage, sortByATC);
  };

  const renderPaginationControls = () => (
    <div
      className="pagination-controls"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '10px',
        position: 'relative',
      }}
    >
      <label style={{ marginRight: '10px' }}>Rows per page:</label>
      <select value={rowsPerPage} onChange={handleRowsPerPageChange} style={{ marginRight: '10px' }}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={250}>250</option>
        <option value={500}>500</option>
      </select>
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        style={{
          width: '80px',
          padding: '5px 10px',
          margin: '0 5px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Previous
      </button>
      <span
        style={{
          padding: '5px 10px',
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
          margin: '0 5px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Next
      </button>
    </div>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => {
      switch (columnPreset) {
        case 'substitutionCheck':
          return [
            { accessorKey: 'ATC', header: 'ATC', size: 80 },
            { accessorKey: 'DrugName', header: 'Brand Name', size: 100 },
            { accessorKey: 'FormLNDI', header: 'Dosage LNDI', size: 100 },
            { accessorKey: 'DosageNumerator1', header: 'Num1', size: 120 },
            { accessorKey: 'DosageNumerator1Unit', header: 'Num1 Unit', size: 150 },
            { accessorKey: 'DosageDenominator1', header: 'Deno1', size: 150 },
            { accessorKey: 'DosageDenominator1Unit', header: 'Deno1 Unit', size: 150 },
            { accessorKey: 'DFSequence', header: 'D-F Sequence', size: 100 },
            { accessorKey: 'Form', header: 'Form LNDI', size: 100 },
            { accessorKey: 'Route', header: 'Route CLEAN', size: 100 },
            { accessorKey: 'Parentaral', header: 'Parenteral (yes/no)', size: 60 },
          ];
        case 'atcCheck':
          return [
            { accessorKey: 'DrugName', header: 'Brand Name', size: 100 },
            { accessorKey: 'ATC', header: 'ATC', size: 80 },
            { accessorKey: 'ATCRelatedIngredient', header: 'ATC-related Ingredient', size: 150 },
            { accessorKey: 'OtherIngredients', header: 'Ingredients', size: 150 },
            { accessorKey: 'Dosage', header: 'Dosage (Num1, Num1Unit, Deno1, Deno1Unit...)', size: 200 },
            { accessorKey: 'Route', header: 'Route (CLEAN)', size: 100 },
          ];
        case 'presentationCheck':
          return [
            { accessorKey: 'DrugName', header: 'Brand Name', size: 100 },
            { accessorKey: 'FormLNDI', header: 'Presentation LNDI', size: 100 },
            { accessorKey: 'PresentationUnitQuantity1', header: 'Unit Qtty CLEAN', size: 150 },
            { accessorKey: 'PresentationUnitType1', header: 'Unit Type CLEAN', size: 150 },
            { accessorKey: 'PresentationPackageType1', header: 'Package Type CLEAN', size: 150 },
            { accessorKey: 'PresentationPackageQuantity2', header: 'PQ2', size: 150 },
            { accessorKey: 'PresentationPackageType2', header: 'PT2', size: 150 },
            { accessorKey: 'PresentationPackageQuantity3', header: 'PQ3', size: 150 },
            { accessorKey: 'PresentationPackageType3', header: 'PT3', size: 150 },
            { accessorKey: 'PresentationDescription', header: 'Description CLEAN', size: 180 },
          ];
        default:
          return [
            { accessorKey: 'DrugID', header: 'DrugID', size: 80 },
            { accessorKey: 'DrugName', header: 'DrugName', size: 100 },
            { accessorKey: 'DrugNameAR', header: 'DrugNameAR', size: 100 },
            { accessorKey: 'ProductType', header: 'ProductType', size: 100 },
            {
              accessorKey: 'ATC',
              header: 'ATC',
              size: 80,
              Cell: ({ cell }) => (
                <span
                  onClick={handleSortByATC}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  {cell.getValue() as string}
                </span>
              ),
            },
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
            { accessorKey: 'FormLNDI', header: 'FormLNDI', size: 100 },
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
            { accessorKey: 'Parent', header: 'Route Parent', size: 100 },
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
          ];
      }
    },
    [columnPreset]
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
      },
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
    <div className="table-container" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <label htmlFor="columnPresetSelect" style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '14px' }}>Select Column Preset:</label>
        <select
          id="columnPresetSelect"
          value={columnPreset}
          onChange={(e) => setColumnPreset(e.target.value)}
          style={{
            padding: '5px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="default">Default</option>
          <option value="substitutionCheck">Substitution Check</option>
          <option value="atcCheck">ATC Check</option>
          <option value="presentationCheck">Presentation Check</option>
        </select>
      </div>
      <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
        <MantineReactTable table={table} />
      </div>
      <div style={{ flexShrink: 0 }}>
        {renderPaginationControls()}
      </div>
    </div>
  );
};

export default DrugTable;
