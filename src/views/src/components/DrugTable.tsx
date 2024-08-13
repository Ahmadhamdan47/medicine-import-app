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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllDrugs();
  }, []);

  const fetchAllDrugs = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get('/drugs/all');
      const drugs = response.data;

      const formattedData = drugs.map((drug: any) => ({
        DrugID: drug.DrugID || 'N/A',
        DrugName: drug.DrugName || 'N/A',
        DrugNameAR: drug.DrugNameAR || 'N/A',
        ProductType: drug.ProductType || 'N/A',
        ATC: drug.ATC_Code || 'N/A',
        ATCRelatedIngredient: drug.ATCRelatedIngredient || 'N/A',
        OtherIngredients: drug.OtherIngredients || 'N/A',
        Dosage: drug.Dosage || 'N/A',
        DosageNumerator1: drug.DosageNumerator1 || 'N/A',
        DosageNumerator1Unit: drug.DosageNumerator1Unit || 'N/A',
        DosageDenominator1: drug.DosageDenominator1 || 'N/A',
        DosageDenominator1Unit: drug.DosageDenominator1Unit || 'N/A',
        DosageNumerator2: drug.DosageNumerator2 || 'N/A',
        DosageNumerator2Unit: drug.DosageNumerator2Unit || 'N/A',
        DosageDenominator2: drug.DosageDenominator2 || 'N/A',
        DosageDenominator2Unit: drug.DosageDenominator2Unit || 'N/A',
        DosageNumerator3: drug.DosageNumerator3 || 'N/A',
        DosageNumerator3Unit: drug.DosageNumerator3Unit || 'N/A',
        DosageDenominator3: drug.DosageDenominator3 || 'N/A',
        DosageDenominator3Unit: drug.DosageDenominator3Unit || 'N/A',
        isOTC: drug.isOTC || false,
        DFSequence: drug.DFSequence || 'N/A',
        Form: drug.Form || 'N/A',
        FormLNDI: drug.FormLNDI || 'N/A',
        Presentation: drug.Presentation || 'N/A',
        PresentationUnitQuantity1: drug.PresentationUnitQuantity1 || 'N/A',
        PresentationUnitType1: drug.PresentationUnitType1 || 'N/A',
        PresentationUnitQuantity2: drug.PresentationUnitQuantity2 || 'N/A',
        PresentationUnitType2: drug.PresentationUnitType2 || 'N/A',
        PresentationPackageQuantity1: drug.PresentationPackageQuantity1 || 'N/A',
        PresentationPackageType1: drug.PresentationPackageType1 || 'N/A',
        PresentationPackageQuantity2: drug.PresentationPackageQuantity2 || 'N/A',
        PresentationPackageType2: drug.PresentationPackageType2 || 'N/A',
        PresentationPackageQuantity3: drug.PresentationPackageQuantity3 || 'N/A',
        PresentationPackageType3: drug.PresentationPackageType3 || 'N/A',
        PresentationDescription: drug.PresentationDescription || 'N/A',
        Parent: drug.RouteParent || 'N/A',
        Route: drug.Route || 'N/A',
        Parentaral: drug.Parentaral || 'N/A',
        Stratum: drug.Stratum || 'N/A',
        Amount: drug.Amount || 0,
        Agent: drug.Agent || 'N/A',
        Manufacturer: drug.Manufacturer || 'N/A',
        Country: drug.Country || 'N/A',
        Price: drug.Price || 'N/A',
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
        ImagesPath: drug.ImagesPath || 'N/A',
        ImageDefault: drug.ImageDefault || 'N/A',
        InteractionIngredientName: drug.InteractionIngredientName || 'N/A',
        IsDouanes: drug.IsDouanes || false,
        RegistrationDate: drug.RegistrationDate || 'N/A',
        PublicPrice: drug.PublicPrice || 'N/A',
        SubsidyLabel: drug.SubsidyLabel || 'N/A',
        SubsidyPercentage: drug.SubsidyPercentage || 'N/A',
        HospPricing: drug.HospPricing || 'N/A',
        Substitutable: drug.Substitutable || 'N/A',
        CreatedBy: drug.CreatedBy || 'N/A',
        CreatedDate: drug.CreatedDate || 'N/A',
        UpdatedBy: drug.UpdatedBy || 'N/A',
        UpdatedDate: drug.UpdatedDate || 'N/A',
        ReviewDate: drug.ReviewDate || 'N/A',
        MoPHCode: drug.MoPHCode || 'N/A',
        CargoShippingTerms: drug.CargoShippingTerms || 'N/A',
        NotMarketed: drug.NotMarketed || false,
        PriceForeign: drug.PriceForeign || 'N/A',
        CurrencyForeign: drug.CurrencyForeign || 'N/A',
      }));

      setAllData(formattedData);
    } catch (error) {
      console.error("Error fetching drugs:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleSaveRow = async ({ row, values, exitEditingMode }: { row: any, values: any, exitEditingMode: () => void }) => {
    try {
      const updatedDrug = { ...row.original, ...values };
      await axios.put(`/drugs/update/${updatedDrug.DrugID}`, updatedDrug);
      
      setAllData(prevData =>
        prevData.map(drug => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug))
      );
      
      exitEditingMode(); // Required to exit editing mode and close the editor
    } catch (error) {
      console.error("Error updating drug:", error);
    }
  };

  const handleDeleteRow = async (row: any) => {
    try {
      if (window.confirm('Are you sure you want to delete this drug?')) {
        await axios.delete(`/drugs/delete/${row.original.DrugID}`);
        
        setAllData(prevData => prevData.filter(drug => drug.DrugID !== row.original.DrugID));
      }
    } catch (error) {
      console.error("Error deleting drug:", error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: 'DrugID', header: 'DrugID', size: 80 },
      { accessorKey: 'DrugName', header: 'DrugName', size: 100 },
      { accessorKey: 'DrugNameAR', header: 'DrugNameAR', size: 100 },
      { accessorKey: 'ProductType', header: 'ProductType', size: 100 },
      { accessorKey: 'ATC', header: 'ATC', size: 80 },
      { accessorKey: 'ATCRelatedIngredient', header: 'ATCRelatedIngredient', size: 110 },
      { accessorKey: 'OtherIngredients', header: 'OtherIngredients', size: 110 },
      { accessorKey: 'Dosage', header: 'Dosage', size: 100 },
      { accessorKey: 'DosageNumerator1', header: 'Dosage Numerator 1', size: 110 },
      { accessorKey: 'DosageNumerator1Unit', header: 'Dosage Numerator 1 Unit', size: 110 },
      { accessorKey: 'DosageDenominator1', header: 'Dosage Denominator 1', size: 110 },
      { accessorKey: 'DosageDenominator1Unit', header: 'Dosage Denominator 1 Unit', size: 110 },
      { accessorKey: 'DosageNumerator2', header: 'Dosage Numerator 2', size: 110 },
      { accessorKey: 'DosageNumerator2Unit', header: 'Dosage Numerator 2 Unit', size: 110 },
      { accessorKey: 'DosageDenominator2', header: 'Dosage Denominator 2', size: 110 },
      { accessorKey: 'DosageDenominator2Unit', header: 'Dosage Denominator 2 Unit', size: 110 },
      { accessorKey: 'DosageNumerator3', header: 'Dosage Numerator 3', size: 110 },
      { accessorKey: 'DosageNumerator3Unit', header: 'Dosage Numerator 3 Unit', size: 110 },
      { accessorKey: 'DosageDenominator3', header: 'Dosage Denominator 3', size: 110 },
      { accessorKey: 'DosageDenominator3Unit', header: 'Dosage Denominator 3 Unit', size: 110 },
      { accessorKey: 'isOTC', header: 'isOTC', size: 60 },
      { accessorKey: 'DFSequence', header: 'DFSequence', size: 100 },
      { accessorKey: 'Form', header: 'Form', size: 100 },
      { accessorKey: 'FormLNDI', header: 'FormLNDI', size: 100 },
      { accessorKey: 'Presentation', header: 'Presentation', size: 110 },
      { accessorKey: 'PresentationUnitQuantity1', header: 'Presentation Unit Quantity 1', size: 150 },
      { accessorKey: 'PresentationUnitType1', header: 'Presentation Unit Type 1', size: 110 },
      { accessorKey: 'PresentationUnitQuantity2', header: 'Presentation Unit Quantity 2', size: 150 },
      { accessorKey: 'PresentationUnitType2', header: 'Presentation Unit Type 2', size: 110 },
      { accessorKey: 'PresentationPackageQuantity1', header: 'Presentation Package Quantity 1', size: 150 },
      { accessorKey: 'PresentationPackageType1', header: 'Presentation Package Type 1', size: 110 },
      { accessorKey: 'PresentationPackageQuantity2', header: 'Presentation Package Quantity 2', size: 150 },
      { accessorKey: 'PresentationPackageType2', header: 'Presentation Package Type 2', size: 110 },
      { accessorKey: 'PresentationPackageQuantity3', header: 'Presentation Package Quantity 3', size: 150 },
      { accessorKey: 'PresentationPackageType3', header: 'Presentation Package Type 3', size: 110 },
      { accessorKey: 'PresentationDescription', header: 'Presentation Description', size: 150 },
      { accessorKey: 'Parent', header: 'Route Parent', size: 100 },
      { accessorKey: 'Route', header: 'Route', size: 100 },
      { accessorKey: 'Parentaral', header: 'Parentaral', size: 60 },
      { accessorKey: 'Stratum', header: 'Stratum', size: 100 },
      { accessorKey: 'Amount', header: 'Amount', size: 80 },
      { accessorKey: 'Agent', header: 'Agent', size: 100 },
      { accessorKey: 'Manufacturer', header: 'Manufacturer', size: 110 },
      { accessorKey: 'Country', header: 'Country', size: 80 },
      { accessorKey: 'ManufacturerID', header: 'ManufacturerID', size: 110 },
      { accessorKey: 'RegistrationNumber', header: 'RegistrationNumber', size: 110 },
      { accessorKey: 'Notes', header: 'Notes', size: 100 },
      { accessorKey: 'Description', header: 'Description', size: 110 },
      { accessorKey: 'Indication', header: 'Indication', size: 100 },
      { accessorKey: 'Posology', header: 'Posology', size: 100 },
      { accessorKey: 'MethodOfAdministration', header: 'MethodOfAdministration', size: 150 },
      { accessorKey: 'Contraindications', header: 'Contraindications', size: 110 },
      { accessorKey: 'PrecautionForUse', header: 'PrecautionForUse', size: 110 },
      { accessorKey: 'EffectOnFGN', header: 'EffectOnFGN', size: 110 },
      { accessorKey: 'SideEffect', header: 'SideEffect', size: 100 },
      { accessorKey: 'Toxicity', header: 'Toxicity', size: 80 },
      { accessorKey: 'StorageCondition', header: 'StorageCondition', size: 110 },
      { accessorKey: 'ShelfLife', header: 'ShelfLife', size: 100 },
      { accessorKey: 'IngredientLabel', header: 'IngredientLabel', size: 110 },
      { accessorKey: 'Price', header: 'Price', size: 80 },
      { accessorKey: 'ImagesPath', header: 'ImagesPath', size: 100 },
      { accessorKey: 'ImageDefault', header: 'ImageDefault', size: 100 },
      { accessorKey: 'InteractionIngredientName', header: 'InteractionIngredientName', size: 150 },
      { accessorKey: 'IsDouanes', header: 'IsDouanes', size: 100 },
      { accessorKey: 'RegistrationDate', header: 'RegistrationDate', size: 110 },
      { accessorKey: 'PublicPrice', header: 'PublicPrice', size: 100 },
      { accessorKey: 'SubsidyLabel', header: 'SubsidyLabel', size: 100 },
      { accessorKey: 'SubsidyPercentage', header: 'SubsidyPercentage', size: 110 },
      { accessorKey: 'HospPricing', header: 'HospPricing', size: 100 },
      { accessorKey: 'Substitutable', header: 'Substitutable', size: 110 },
      { accessorKey: 'CreatedBy', header: 'CreatedBy', size: 100 },
      { accessorKey: 'CreatedDate', header: 'CreatedDate', size: 110 },
      { accessorKey: 'UpdatedBy', header: 'UpdatedBy', size: 100 },
      { accessorKey: 'UpdatedDate', header: 'UpdatedDate', size: 110 },
      { accessorKey: 'ReviewDate', header: 'ReviewDate', size: 100 },
      { accessorKey: 'MoPHCode', header: 'MoPHCode', size: 80 },
      { accessorKey: 'CargoShippingTerms', header: 'CargoShippingTerms', size: 110 },
      { accessorKey: 'NotMarketed', header: 'NotMarketed', size: 100 },
      { accessorKey: 'PriceForeign', header: 'PriceForeign', size: 100 },
      { accessorKey: 'CurrencyForeign', header: 'CurrencyForeign', size: 100 },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: allData,
    enableColumnResizing: true,
    enableEditing: true,
    enableStickyHeader: true,
    enablePagination: true,
    mantinePaginationProps: {
      rowsPerPageOptions: ['10', '25', '50', '100', '250', '500', '1000'], // Added 250, 500, and 1000 options
     
    },
    state: {
      isLoading,
    },
    initialState: {
      density: 'xs',
      pagination: {
        pageSize: 250,
        pageIndex: 0, // Add this to fix the error
      },
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
    <div className="table-container">
      <MantineReactTable table={table} />
    </div>
  );
};

export default DrugTable;
