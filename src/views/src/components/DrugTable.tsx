// src/components/DrugTable.tsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
} from 'mantine-react-table';
import { Menu } from '@mantine/core';
import AddDrugModal from './AddDrugModal'; // import our new modal component

const DrugTable: React.FC = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [columnPreset, setColumnPreset] = useState<string>('default');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Options States (for select dropdowns) ---
  const [atcOptions, setAtcOptions] = useState<{ value: string; label: string }[]>([]);
  const [dosageNumerator1UnitOptions, setDosageNumerator1UnitOptions] = useState<string[]>([]);
  const [dosageNumerator2UnitOptions, setDosageNumerator2UnitOptions] = useState<string[]>([]);
  const [dosageNumerator3UnitOptions, setDosageNumerator3UnitOptions] = useState<string[]>([]);
  const [dosageDenominator1UnitOptions, setDosageDenominator1UnitOptions] = useState<string[]>([]);
  const [dosageDenominator2UnitOptions, setDosageDenominator2UnitOptions] = useState<string[]>([]);
  const [dosageDenominator3UnitOptions, setDosageDenominator3UnitOptions] = useState<string[]>([]);
  const [formOptions, setFormOptions] = useState<string[]>([]);
  const [routeOptions, setRouteOptions] = useState<string[]>([]);
  const [stratumOptions, setStratumOptions] = useState<string[]>([]);
  const [agentOptions, setAgentOptions] = useState<string[]>([]);
  const [manufacturerOptions, setManufacturerOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchDrugs();
    fetchAtcOptions();
  }, []);

  const fetchAtcOptions = async () => {
    try {
      const response = await axios.get('/atc/all');
      const formattedOptions = response.data.map((atc: any) => ({
        value: atc.Code,
        label: atc.Name,
      }));
      setAtcOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching ATC options:', error);
    }
  };

  const getUniqueValues = (data: any[], column: string) => {
    return Array.from(new Set(data.map((row) => row[column]))).filter(
      (value) => value !== null && value !== 'N/A'
    );
  };
  const handleAddSuccess = (newDrug: any) => {
    // The backend likely returns the newly created drug record
    // Append to table data
    setTableData((prev) => [...prev, newDrug]);
    setAllData((prev) => [...prev, newDrug]);
  };
  const fetchDrugs = async () => {
    setIsLoading(true); 
    try {
      const response = await axios.get('/drugs/all'); 
      const { drugs } = response.data;

      const formattedData = drugs.map((drug: any) => ({
        DrugID: drug.DrugID || 'N/A',
        DrugName: drug.DrugName || 'N/A',
        DrugNameAR: drug.DrugNameAR || 'N/A', 
        Seq:  drug.Seq || 'N/A',
        ProductType: drug.ProductType || 'N/A',
        ATC: drug.ATC_Code || 'N/A',
        ATCRelatedIngredient: drug.ATCRelatedIngredient || 'N/A',
        OtherIngredients: drug.OtherIngredients || 'N/A',
        Dosage: drug.Dosage || 'N/A',
        // Dosages Fields
        DosageNumerator1: drug.Dosages?.[0]?.Numerator1 || 'N/A',
        DosageNumerator1Unit: drug.Dosages?.[0]?.Numerator1Unit || 'N/A',
        DosageDenominator1: drug.Dosages?.[0]?.Denominator1 || 'N/A',
        DosageDenominator1Unit: drug.Dosages?.[0]?.Denominator1Unit || 'N/A',
        DosageNumerator2: drug.Dosages?.[0]?.Numerator2 || 'N/A',
        DosageNumerator2Unit: drug.Dosages?.[0]?.Numerator2Unit || 'N/A',
        DosageDenominator2: drug.Dosages?.[0]?.Denominator2 || 'N/A',
        DosageDenominator2Unit: drug.Dosages?.[0]?.Denominator2Unit || 'N/A',
        DosageNumerator3: drug.Dosages?.[0]?.Numerator3 || 'N/A',
        DosageNumerator3Unit: drug.Dosages?.[0]?.Numerator3Unit || 'N/A',
        DosageDenominator3: drug.Dosages?.[0]?.Denominator3 || 'N/A',
        DosageDenominator3Unit: drug.Dosages?.[0]?.Denominator3Unit || 'N/A',

        // Drug Presentations Fields
        PresentationLNDI:drug.PresentationLNDI || 'N/A',
        PresentationDescription: drug.DrugPresentations?.[0]?.Description || 'N/A',
        PresentationUnitQuantity1: drug.DrugPresentations?.[0]?.UnitQuantity1 || 'N/A',
        PresentationUnitType1: drug.DrugPresentations?.[0]?.UnitType1 || 'N/A',
        PresentationUnitQuantity2: drug.DrugPresentations?.[0]?.UnitQuantity2 || 'N/A',
        PresentationUnitType2: drug.DrugPresentations?.[0]?.UnitType2 || 'N/A',
        PresentationPackageQuantity1: drug.DrugPresentations?.[0]?.PackageQuantity1 || 'N/A',
        PresentationPackageType1: drug.DrugPresentations?.[0]?.PackageType1 || 'N/A',
        PresentationPackageQuantity2: drug.DrugPresentations?.[0]?.PackageQuantity2 || 'N/A',
        PresentationPackageType2: drug.DrugPresentations?.[0]?.PackageType2 || 'N/A',
        PresentationPackageQuantity3: drug.DrugPresentations?.[0]?.PackageQuantity3 || 'N/A',
        PresentationPackageType3: drug.DrugPresentations?.[0]?.PackageType3 || 'N/A',

        // Additional fields
        isOTC: drug.isOTC || false,
        DFSequence: drug.DFSequence || 'N/A',
        // If you have a field like 'FormLNDI' in DB, map it. Example:
        Form: drug.Form || 'N/A',
        FormLNDI: drug.FormLNDI || 'N/A', // or wherever your LNDI form is stored
        Parent: drug.RouteParent || 'N/A',
        Route: drug.Route || 'N/A',
        // If there's a RouteLNDI field in DB:
        RouteLNDI: drug.RouteLNDI || 'N/A', // only if it exists
        Parentaral: drug.Parentaral || 'N/A',
        Stratum: drug.Stratum || 'N/A',
        Amount: drug.Amount || 0,
        Agent: drug.Agent || 'N/A',
        Manufacturer: drug.Manufacturer || 'N/A',
        Country: drug.Country || 'N/A',
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
        IsDouanes: drug.IsDouanes || 'N/A',
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
        NotMarketed: drug.NotMarketed || 'N/A',
        PriceForeign: drug.PriceForeign || 'N/A',
        CurrencyForeign: drug.CurrencyForeign || 'N/A',
      }));

      // Populate dropdowns
      setDosageNumerator1UnitOptions(getUniqueValues(formattedData, 'DosageNumerator1Unit'));
      setDosageNumerator2UnitOptions(getUniqueValues(formattedData, 'DosageNumerator2Unit'));
      setDosageNumerator3UnitOptions(getUniqueValues(formattedData, 'DosageNumerator3Unit'));
      setDosageDenominator1UnitOptions(getUniqueValues(formattedData, 'DosageDenominator1Unit'));
      setDosageDenominator2UnitOptions(getUniqueValues(formattedData, 'DosageDenominator2Unit'));
      setDosageDenominator3UnitOptions(getUniqueValues(formattedData, 'DosageDenominator3Unit'));
      setFormOptions(getUniqueValues(formattedData, 'Form'));
      setRouteOptions(getUniqueValues(formattedData, 'Route'));
      setStratumOptions(getUniqueValues(formattedData, 'Stratum'));
      setAgentOptions(getUniqueValues(formattedData, 'Agent'));
      setManufacturerOptions(getUniqueValues(formattedData, 'Manufacturer'));

      setTableData(formattedData);
      setAllData(formattedData);
    } catch (error) {
      console.error('Error fetching drugs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRow = async ({
    row,
    values,
    exitEditingMode,
  }: {
    row: any;
    values: any;
    exitEditingMode: () => void;
  }) => {
    try {
      const updatedDrug = { ...row.original, ...values };
      // If ATC was changed in editing:
      if (updatedDrug.ATC) {
        updatedDrug.ATC_Code = updatedDrug.ATC;
      }

      // Dosage sub-payload
      const dosageData = {
        Numerator1: updatedDrug.DosageNumerator1,
        Numerator1Unit: updatedDrug.DosageNumerator1Unit,
        Denominator1: updatedDrug.DosageDenominator1,
        Denominator1Unit: updatedDrug.DosageDenominator1Unit,
        Numerator2: updatedDrug.DosageNumerator2,
        Numerator2Unit: updatedDrug.DosageNumerator2Unit,
        Denominator2: updatedDrug.DosageDenominator2,
        Denominator2Unit: updatedDrug.DosageDenominator2Unit,
        Numerator3: updatedDrug.DosageNumerator3,
        Numerator3Unit: updatedDrug.DosageNumerator3Unit,
        Denominator3: updatedDrug.DosageDenominator3,
        Denominator3Unit: updatedDrug.DosageDenominator3Unit,
      };

      // Presentation sub-payload
      const presentationData = {
        UnitQuantity1: updatedDrug.PresentationUnitQuantity1,
        UnitType1: updatedDrug.PresentationUnitType1,
        UnitQuantity2: updatedDrug.PresentationUnitQuantity2,
        UnitType2: updatedDrug.PresentationUnitType2,
        PackageQuantity1: updatedDrug.PresentationPackageQuantity1,
        PackageType1: updatedDrug.PresentationPackageType1,
        PackageQuantity2: updatedDrug.PresentationPackageQuantity2,
        PackageType2: updatedDrug.PresentationPackageType2,
        PackageQuantity3: updatedDrug.PresentationPackageQuantity3,
        PackageType3: updatedDrug.PresentationPackageType3,
        Description: updatedDrug.PresentationDescription,
      };

      // Debug payload
      console.log('Payload Sent to Backend:', updatedDrug);

      // Update drug main info
      await axios.put(`/drugs/update/${updatedDrug.DrugID}`, updatedDrug);
      // Update dosage info
      await axios.put(`/dosages/updateByDrug/${updatedDrug.DrugID}`, dosageData);
      // Update presentation info
      await axios.put(`/presentations/updateByDrug/${updatedDrug.DrugID}`, presentationData);

      // Update tableData locally
      setTableData((prevData) =>
        prevData.map((drug) => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug))
      );
      setAllData((prevData) =>
        prevData.map((drug) => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug))
      );

      exitEditingMode();
    } catch (error) {
      console.error('Error updating drug:', error);
    }
  };

  const handleDeleteRow = async (row: any) => {
    try {
      if (window.confirm('Are you sure you want to delete this drug?')) {
        await axios.delete(`/drugs/delete/${row.original.DrugID}`);
        setTableData((prevData) =>
          prevData.filter((drug) => drug.DrugID !== row.original.DrugID)
        );
        setAllData((prevData) =>
          prevData.filter((drug) => drug.DrugID !== row.original.DrugID)
        );
      }
    } catch (error) {
      console.error('Error deleting drug:', error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    switch (columnPreset) {
      /* --------------------------------------------------
         Substitution Check Preset
         -------------------------------------------------- */
      case 'substitutionCheck':
        return [
          {
            accessorKey: 'ATC',
            header: 'ATC',
            editVariant: 'select',
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ value }) => ({ value, label: value })),
              searchable: true,
              clearable: true,
              value: row.original.ATC || '',
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID ? { ...drug, ATC: value } : drug
                  )
                );
              },
              placeholder: row.original.ATC || 'Select ATC',
            }),
          },
          {
            accessorKey: 'ATCRelatedIngredient',
            header: 'ATC Related Ingredient',
            editVariant: 'select',
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ label }) => ({ value: label, label })),
              searchable: true,
              clearable: true,
              value: row.original.ATCRelatedIngredient || '',
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID
                      ? { ...drug, ATCRelatedIngredient: value }
                      : drug
                  )
                );
              },
              placeholder: row.original.ATCRelatedIngredient || 'Select Ingredient',
            }),
          },
          { accessorKey: 'DrugName', header: 'Brand Name', size: 100 },
          { accessorKey: 'Seq', header: 'Seq', size: 100 },
          // New columns per request
          { accessorKey: 'OtherIngredients', header: 'All Ingredients', size: 150 },
          {
            accessorKey: 'FormLNDI',
            header: 'Form LNDI',
            size: 100,
          },
          {
            accessorKey: 'Form',
            header: 'Dosage-form (clean)',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
            size: 120,
          },
          {
            accessorKey: 'RouteLNDI',
            header: 'Route LNDI',
            size: 100,
          },
          {
            accessorKey: 'Route',
            header: 'Route (clean)',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'Parent', header: 'Route Parent', size: 100 },

          // Keep the existing dosage columns
          { accessorKey: 'DosageNumerator1', header: 'DosageNumerator1', size: 120 },
          {
            accessorKey: 'DosageNumerator1Unit',
            header: 'Num 1 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageNumerator1UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageDenominator1', header: 'Deno1', size: 150 },
          {
            accessorKey: 'DosageDenominator1Unit',
            header: 'Deno 1 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageDenominator1UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageNumerator2', header: 'Num 2', size: 120 },
          {
            accessorKey: 'DosageNumerator2Unit',
            header: 'Num 2 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageNumerator2UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageDenominator2', header: 'Deno 2', size: 150 },
          {
            accessorKey: 'DosageDenominator2Unit',
            header: 'Deno 2 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageDenominator2UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageNumerator3', header: 'Num 3', size: 120 },
          {
            accessorKey: 'DosageNumerator3Unit',
            header: 'Num 3 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageNumerator3UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageDenominator3', header: 'Deno 3', size: 150 },
          {
            accessorKey: 'DosageDenominator3Unit',
            header: 'Deno 3 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageDenominator3UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DFSequence', header: 'D-F Sequence', size: 100 },

          // The route column remains if needed
         
        ];

      /* --------------------------------------------------
         ATC Check Preset
         -------------------------------------------------- */
      case 'atcCheck':
        return [
          { accessorKey: 'DrugName', header: 'Brand Name', size: 100 },
          {
            accessorKey: 'ATC',
            header: 'ATC',
            editVariant: 'select',
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ value }) => ({ value, label: value })),
              searchable: true,
              clearable: true,
              value: row.original.ATC || '',
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID ? { ...drug, ATC: value } : drug
                  )
                );
              },
              placeholder: row.original.ATC || 'Select ATC',
            }),
          },
          {
            accessorKey: 'ATCRelatedIngredient',
            header: 'ATC Related Ingredient',
            editVariant: 'select',
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ label }) => ({ value: label, label })),
              searchable: true,
              clearable: true,
              value: row.original.ATCRelatedIngredient || '',
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID
                      ? { ...drug, ATCRelatedIngredient: value }
                      : drug
                  )
                );
              },
              placeholder: row.original.ATCRelatedIngredient || 'Select Ingredient',
            }),
          },
          
          { accessorKey: 'OtherIngredients', header: 'All Ingredients', size: 150 },
          { accessorKey: 'Seq', header: 'Seq', size: 100 },

          { accessorKey: 'Dosage', header: 'Dosage (merged)', size: 200 },

          {
            accessorKey: 'Route',
            header: 'Route (clean)',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
        ];

      /* --------------------------------------------------
         Presentation Check Preset
         -------------------------------------------------- */
      case 'presentationCheck':
        return [
          { accessorKey: 'DrugName', header: 'Brand Name', size: 100 },
          { accessorKey: 'Seq', header: 'Seq', size: 100 },

          // Add Form LNDI + Dosage-Dosage-form (clean)
          {
            accessorKey: 'FormLNDI',
            header: 'Form LNDI',
            size: 120,
          },
          {
            accessorKey: 'Form',
            header: 'Dosage-form (clean)',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
            size: 120,
          },

          // The requested "presentation" field => rename your
            // PresentationDescription to "Presentation (clean)"
            {
            accessorKey: 'PresentationLNDI',
            header: 'PresentationLNDI',
            size: 100,
            },
            {
            accessorKey: 'PresentationDescription',
            header: 'Presentation Description',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, 'PresentationDescription').map((value) => ({
              value,
              label: value,
              })),
              searchable: true,
              clearable: true,
            },
            size: 180,
            },
            {
            accessorKey: 'PresentationUnitQuantity1',
            header: 'Unit Qtty 1 ',
            size: 150,
            },
            {
            accessorKey: 'PresentationUnitType1',
            header: 'Unit Type 1 ',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, 'PresentationUnitType1').map((value) => ({
              value,
              label: value,
              })),
              searchable: true,
              clearable: true,
            },
            size: 150,
            },
            {
            accessorKey: 'PresentationPackageQuantity1',
            header: 'Package Qtty 1',
            size: 150,
            },
            {
            accessorKey: 'PresentationPackageType1',
            header: 'Package Type 1 ',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, 'PresentationPackageType1').map((value) => ({
              value,
              label: value,
              })),
              searchable: true,
              clearable: true,
            },
            size: 150,
            },

          // If you want to display the 2nd and 3rd sets as well:
          {
            accessorKey: 'PresentationPackageQuantity2',
            header: 'Package Qtty 2 (clean)',
            size: 150,
          },
          {
            accessorKey: 'PresentationPackageType2',
            header: 'Package Type 2',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, 'PresentationPackageType1').map((value) => ({
              value,
              label: value,
              })),
              searchable: true,
              clearable: true,
            },
            size: 150,
            },
          {
            accessorKey: 'PresentationUnitQuantity2',
            header: 'Unit Qtty 2 (clean)',
            size: 150,
          },
          {
            accessorKey: 'PresentationUnitType2',
            header: 'Unit Type 2 (clean)',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, 'PresentationUnitType2').map((value) => ({
                value,
                label: value,
              })),
              searchable: true,
              clearable: true,
            },
            size: 150,
          },
          {
            accessorKey: 'PresentationPackageQuantity3',
            header: 'Package Qtty 3 ',
            size: 150,
          },
          {
            accessorKey: 'PresentationPackageType3',
            header: 'Package Type 3',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, 'PresentationPackageType1').map((value) => ({
              value,
              label: value,
              })),
              searchable: true,
              clearable: true,
            },
            size: 150,
            },
            {
              accessorKey: 'PresentationUnitType3',
              header: 'Unit Type 3 ',
              editVariant: 'select',
              mantineEditSelectProps: {
                data: getUniqueValues(tableData, 'PresentationUnitType1').map((value) => ({
                value,
                label: value,
                })),
                searchable: true,
                clearable: true,
              },
              size: 150,
              },
        ];

      /* --------------------------------------------------
         Default Preset
         -------------------------------------------------- */
      default:
        return [
          { accessorKey: 'DrugID', header: 'DrugID', size: 80 },
          { accessorKey: 'DrugName', header: 'DrugName', size: 100 },
          { accessorKey: 'DrugNameAR', header: 'DrugNameAR', size: 100 },
          { accessorKey: 'Seq', header: 'Seq', size: 100 },
          { accessorKey: 'ProductType', header: 'ProductType', size: 100 },
          {
            accessorKey: 'ATC',
            header: 'ATC',
            editVariant: 'select',
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ value }) => ({ value, label: value })),
              searchable: true,
              clearable: true,
              value: row.original.ATC || '',
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID ? { ...drug, ATC: value } : drug
                  )
                );
              },
              placeholder: row.original.ATC || 'Select ATC',
            }),
          },
          {
            accessorKey: 'ATCRelatedIngredient',
            header: 'ATC Related Ingredient',
            editVariant: 'select',
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ label }) => ({ value: label, label })),
              searchable: true,
              clearable: true,
              value: row.original.ATCRelatedIngredient || '',
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID
                      ? { ...drug, ATCRelatedIngredient: value }
                      : drug
                  )
                );
              },
              placeholder: row.original.ATCRelatedIngredient || 'Select Ingredient',
            }),
          },
          { accessorKey: 'OtherIngredients', header: 'All Ingredients', size: 150 },
          { accessorKey: 'Dosage', header: 'Dosage (merged)', size: 100 },
          { accessorKey: 'DosageNumerator1', header: 'Num 1', size: 120 },
          {
            accessorKey: 'DosageNumerator1Unit',
            header: 'Num 1 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageNumerator1UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageDenominator1', header: 'Deno1', size: 150 },
          {
            accessorKey: 'DosageDenominator1Unit',
            header: 'Deno1 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageDenominator1UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageNumerator2', header: 'Num2', size: 120 },
          {
            accessorKey: 'DosageNumerator2Unit',
            header: 'Num2 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageNumerator2UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageDenominator2', header: 'Deno 2', size: 150 },
          {
            accessorKey: 'DosageDenominator2Unit',
            header: 'Deno 2 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageDenominator2UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageNumerator3', header: 'Num 3', size: 120 },
          {
            accessorKey: 'DosageNumerator3Unit',
            header: 'Num 3 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageNumerator3UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'DosageDenominator3', header: 'Deno 3', size: 150 },
          {
            accessorKey: 'DosageDenominator3Unit',
            header: 'Deno 3 Unit',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: dosageDenominator3UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'isOTC', header: 'isOTC', size: 60 },
          { accessorKey: 'DFSequence', header: 'DFSequence', size: 100 },
          {
            accessorKey: 'Form',
            header: 'Dosage-form (clean)',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'FormLNDI', header: 'FormLNDI', size: 100 },

          {
            accessorKey: 'RouteLNDI',
            header: 'Route LNDI',
            size: 100,
          },
          {
            accessorKey: 'Route',
            header: 'Route (clean)',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'Parent', header: 'Route Parent', size: 100 },
          { accessorKey: 'PresentationLNDI', header: 'PresentationLNDI', size: 100 },

          { accessorKey: 'PresentationUnitQuantity1', header: 'Presentation Unit Quantity 1', size: 180 },
          { accessorKey: 'PresentationUnitType1', header: 'Presentation Unit Type 1', size: 150 },
          { accessorKey: 'PresentationUnitQuantity2', header: 'Presentation Unit Quantity 2', size: 180 },
          { accessorKey: 'PresentationUnitType2', header: 'Presentation Unit Type 2', size: 150 },
          { accessorKey: 'PresentationPackageQuantity1', header: 'Presentation Package Qtty 1', size: 180 },
          { accessorKey: 'PresentationPackageType1', header: 'Presentation Package Type 1', size: 150 },
          { accessorKey: 'PresentationPackageQuantity2', header: 'Presentation Package Qtty 2', size: 180 },
          { accessorKey: 'PresentationPackageType2', header: 'Presentation Package Type 2', size: 150 },
          { accessorKey: 'PresentationPackageQuantity3', header: 'Presentation Package Qtty 3', size: 180 },
          { accessorKey: 'PresentationPackageType3', header: 'Presentation Package Type 3', size: 150 },
          { accessorKey: 'PresentationDescription', header: 'Presentation Description', size: 120 },
          
          
          {
            accessorKey: 'Stratum',
            header: 'Stratum',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: stratumOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'Amount', header: 'Amount', size: 80 },
          {
            accessorKey: 'Agent',
            header: 'Agent',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: agentOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: 'Manufacturer',
            header: 'Manufacturer',
            editVariant: 'select',
            mantineEditSelectProps: {
              data: manufacturerOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: 'Country', header: 'Country', size: 80 },
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
          { accessorKey: 'ImagesPath', header: 'ImagesPath', size: 100 },
          { accessorKey: 'ImageDefault', header: 'ImageDefault', size: 100 },
          {
            accessorKey: 'InteractionIngredientName',
            header: 'InteractionIngredientName',
            size: 180,
          },
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
  }, [
    columnPreset,
    atcOptions,
    dosageNumerator1UnitOptions,
    dosageNumerator2UnitOptions,
    dosageNumerator3UnitOptions,
    dosageDenominator1UnitOptions,
    dosageDenominator2UnitOptions,
    dosageDenominator3UnitOptions,
    formOptions,
    routeOptions,
    stratumOptions,
    agentOptions,
    manufacturerOptions,
  ]);

  const table = useMantineReactTable({
    columns,
    data: tableData,
    enableColumnResizing: true,
    enableEditing: true,
    editDisplayMode: 'row',
    enableRowActions: true,
    enableStickyHeader: true,
    enablePagination: true,
    enableRowVirtualization: true, //enable row virtualization
    mantinePaginationProps: {
      rowsPerPageOptions: ['100', '250', '500', '1000', '2500', '5000'],
      withEdges: false,
    },
    state: {
      isLoading,
    },
    initialState: {
      density: 'xs',
      pagination: {
        pageSize: 500,
        pageIndex: 0,
      },
      // You can hide or show columns by default here
      columnVisibility: {
        DrugID: false,
        DrugNameAR: false,
        isOTC: false,
        Amount: false,
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
      <Menu.Item key="delete" onClick={() => handleDeleteRow(row)} style={{ color: 'red' }}>
        Delete
      </Menu.Item>,
    ],
  });

  return (
    <div
      className="table-container"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <label
          htmlFor="columnPresetSelect"
          style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '14px' }}
        >
          Select Column Preset:
        </label>
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
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            marginLeft: 'auto',
            width: '80px',
            height: '30px',
            fontSize: '12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Add Drug
        </button>
      </div>

      <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
        <MantineReactTable table={table} />
      </div>
      <AddDrugModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={handleAddSuccess}
        // pass the dropdown options
        atcOptions={atcOptions}
        dosageNumerator1UnitOptions={dosageNumerator1UnitOptions}
        dosageDenominator1UnitOptions={dosageDenominator1UnitOptions}
        formOptions={formOptions}
        routeOptions={routeOptions}
      />
    </div>
  );
};

export default DrugTable;
