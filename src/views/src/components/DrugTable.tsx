"use client"

import type React from "react"

import { useEffect, useState, useMemo, useRef } from "react"
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef, type MRT_Row } from "mantine-react-table"
import { Menu, ActionIcon, Button as MantineButton, MantineProvider } from "@mantine/core"
import { IconCheck, IconX, IconArrowBackUp, IconPlus } from "@tabler/icons-react"
import AddDrugModal from "./AddDrugModal" // import our modal component
import { useHotkeys } from "@mantine/hooks"
import axios from "axios"

// Update the custom styles for the table to make scrollbars bigger
const tableStyles = {
  tableContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  controlsContainer: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  selectLabel: {
    marginRight: "10px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  select: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
    cursor: "pointer",
    minWidth: "180px",
  },
  addButton: {
    marginLeft: "auto",
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  undoButton: {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#f8f9fa",
    color: "#333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tipText: {
    marginBottom: "10px",
    fontSize: "12px",
    color: "#666",
    fontStyle: "italic",
  },
  tableWrapper: {
    flex: "1 1 auto",
    overflowY: "auto" as const,
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
  },
  cellHighlight: {
    backgroundColor: "rgba(0, 123, 255, 0.2)",
    border: "2px solid #007bff",
  },
  confirmIcon: {
    position: "absolute" as const,
    top: "2px",
    right: "2px",
    zIndex: 10,
  },
  cellConfirmed: {
    position: "relative" as const,
    backgroundColor: "rgba(40, 167, 69, 0.1)",
  },
  cellRejected: {
    position: "relative" as const,
    backgroundColor: "rgba(220, 53, 69, 0.1)",
  },
  cellPending: {
    position: "relative" as const,
    backgroundColor: "rgba(0, 123, 255, 0.1)",
  },
}

// Update the row color generator to make colors more distinct
const getRowColor = (index: number) => {
  // Generate different shades of the same color family
  const baseHue = 210 // Blue family
  const saturation = 95
  const lightness = 98 - (index % 5) * 3 // Alternate between 5 shades (98%, 95%, 92%, 89%, 86%)

  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`
}

const DrugTable: React.FC = () => {
  const [allData, setAllData] = useState<any[]>([])
  const [tableData, setTableData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [columnPreset, setColumnPreset] = useState<string>("default")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // History for undo functionality
  const [history, setHistory] = useState<any[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Drag and drop functionality
  const [isDragging, setIsDragging] = useState(false)
  const [dragValue, setDragValue] = useState<any>(null)
  const [dragColumnId, setDragColumnId] = useState<string | null>(null)

  // Confirmation indicators
  const [changedCells, setChangedCells] = useState<Record<string, "pending" | "confirmed" | "rejected">>({})

  // Refs for scrolling
  const tableWrapperRef = useRef<HTMLDivElement>(null)

  // --- Options States (for select dropdowns) ---
  const [atcOptions, setAtcOptions] = useState<{ value: string; label: string }[]>([])
  const [dosageNumerator1UnitOptions, setDosageNumerator1UnitOptions] = useState<string[]>([])
  const [dosageNumerator2UnitOptions, setDosageNumerator2UnitOptions] = useState<string[]>([])
  const [dosageNumerator3UnitOptions, setDosageNumerator3UnitOptions] = useState<string[]>([])
  const [dosageDenominator1UnitOptions, setDosageDenominator1UnitOptions] = useState<string[]>([])
  const [dosageDenominator2UnitOptions, setDosageDenominator2UnitOptions] = useState<string[]>([])
  const [dosageDenominator3UnitOptions, setDosageDenominator3UnitOptions] = useState<string[]>([])
  const [formOptions, setFormOptions] = useState<string[]>([])
  const [routeOptions, setRouteOptions] = useState<string[]>([])
  const [stratumOptions, setStratumOptions] = useState<string[]>([])
  const [agentOptions, setAgentOptions] = useState<string[]>([])
  const [manufacturerOptions, setManufacturerOptions] = useState<string[]>([])

  // Hotkeys for undo (Ctrl+Z)
  useHotkeys([["ctrl+z", () => handleUndo()]])

  useEffect(() => {
    fetchDrugs()
    fetchAtcOptions()
  }, [])

  // Add to history when tableData changes
  useEffect(() => {
    if (
      tableData.length > 0 &&
      (history.length === 0 || JSON.stringify(tableData) !== JSON.stringify(history[historyIndex]))
    ) {
      // Create a deep copy of the current state
      const newHistoryEntry = JSON.parse(JSON.stringify(tableData))

      // If we're not at the end of the history, remove future states
      const newHistory =
        historyIndex < history.length - 1
          ? [...history.slice(0, historyIndex + 1), newHistoryEntry]
          : [...history, newHistoryEntry]

      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [tableData])

  // Update the fetchAtcOptions function to properly handle API responses
  const fetchAtcOptions = async () => {
    try {
      const response = await axios.get("atc/all")

      // Check if response.data exists and is an array
      if (response.data && Array.isArray(response.data)) {
        const formattedOptions = response.data
          .filter((atc: any) => atc.Code && atc.Code.trim() !== "" && atc.Name && atc.Name.trim() !== "")
          .map((atc: any) => ({
            value: atc.Code,
            label: atc.Name,
          }))
        setAtcOptions(formattedOptions)
      } else {
        // Handle case where response.data is not an array
        console.error("Invalid ATC data format:", response.data)
        setAtcOptions([])
      }
    } catch (error) {
      console.error("Error fetching ATC options:", error)
      setAtcOptions([])
    }
  }

  // Updated getUniqueValues function to filter out empty values and ensure uniqueness
  const getUniqueValues = (data: any[], column: string) => {
    return Array.from(new Set(data.map((row) => row[column])))
      .filter((value) => value !== null && value !== undefined && value !== "" && value !== "N/A")
      .sort()
  }

  const handleAddSuccess = (newDrug: any) => {
    // The backend likely returns the newly created drug record
    // Append to table data
    setTableData((prev) => [...prev, newDrug])
    setAllData((prev) => [...prev, newDrug])
  }

  // Update the fetchDrugs function to properly handle API responses
  const fetchDrugs = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("drugs/all")

      // Check if response.data and response.data.drugs exist
      if (response.data && response.data.drugs && Array.isArray(response.data.drugs)) {
        const { drugs } = response.data

        const formattedData = drugs.map((drug: any) => ({
          DrugID: drug.DrugID || "N/A",
          DrugName: drug.DrugName || "N/A",
          DrugNameAR: drug.DrugNameAR || "N/A",
          Seq: drug.Seq || "N/A",
          ProductType: drug.ProductType || "N/A",
          ATC: drug.ATC_Code || "N/A",
          ATCRelatedIngredient: drug.ATCRelatedIngredient || "N/A",
          OtherIngredients: drug.OtherIngredients || "N/A",
          Dosage: drug.Dosage || "N/A",
          // Dosages Fields
          DosageNumerator1: drug.Dosages?.[0]?.Numerator1 || "N/A",
          DosageNumerator1Unit: drug.Dosages?.[0]?.Numerator1Unit || "N/A",
          DosageDenominator1: drug.Dosages?.[0]?.Denominator1 || "N/A",
          DosageDenominator1Unit: drug.Dosages?.[0]?.Denominator1Unit || "N/A",
          DosageNumerator2: drug.Dosages?.[0]?.Numerator2 || "N/A",
          DosageNumerator2Unit: drug.Dosages?.[0]?.Numerator2Unit || "N/A",
          DosageDenominator2: drug.Dosages?.[0]?.Denominator2 || "N/A",
          DosageDenominator2Unit: drug.Dosages?.[0]?.Denominator2Unit || "N/A",
          DosageNumerator3: drug.Dosages?.[0]?.Numerator3 || "N/A",
          DosageNumerator3Unit: drug.Dosages?.[0]?.Numerator3Unit || "N/A",
          DosageDenominator3: drug.Dosages?.[0]?.Denominator3 || "N/A",
          DosageDenominator3Unit: drug.Dosages?.[0]?.Denominator3Unit || "N/A",

          // Drug Presentations Fields
          PresentationLNDI: drug.PresentationLNDI || "N/A",
          PresentationDescription: drug.DrugPresentations?.[0]?.Description || "N/A",
          PresentationUnitQuantity1: drug.DrugPresentations?.[0]?.UnitQuantity1 || "N/A",
          PresentationUnitType1: drug.DrugPresentations?.[0]?.UnitType1 || "N/A",
          PresentationUnitQuantity2: drug.DrugPresentations?.[0]?.UnitQuantity2 || "N/A",
          PresentationUnitType2: drug.DrugPresentations?.[0]?.UnitType2 || "N/A",
          PresentationPackageQuantity1: drug.DrugPresentations?.[0]?.PackageQuantity1 || "N/A",
          PresentationPackageType1: drug.DrugPresentations?.[0]?.PackageType1 || "N/A",
          PresentationPackageQuantity2: drug.DrugPresentations?.[0]?.PackageQuantity2 || "N/A",
          PresentationPackageType2: drug.DrugPresentations?.[0]?.PackageType2 || "N/A",
          PresentationPackageQuantity3: drug.DrugPresentations?.[0]?.PackageQuantity3 || "N/A",
          PresentationPackageType3: drug.DrugPresentations?.[0]?.PackageType3 || "N/A",

          // Additional fields
          isOTC: drug.isOTC || false,
          DFSequence: drug.DFSequence || "N/A",
          Form: drug.Form || "N/A",
          FormRaw: drug.FormRaw || "N/A",
          FormLNDI: drug.FormLNDI || "N/A",
          Parent: drug.RouteParent || "N/A",
          Route: drug.Route || "N/A",
          RouteRaw: drug.RouteRaw || "N/A",
          RouteLNDI: drug.RouteLNDI || "N/A",
          Parentaral: drug.Parentaral || "N/A",
          Stratum: drug.Stratum || "N/A",
          Amount: drug.Amount || 0,
          Agent: drug.Agent || "N/A",
          Manufacturer: drug.Manufacturer || "N/A",
          Country: drug.Country || "N/A",
          RegistrationNumber: drug.RegistrationNumber || "N/A",
          Notes: drug.Notes || "N/A",
          Description: drug.Description || "N/A",
          Indication: drug.Indication || "N/A",
          Posology: drug.Posology || "N/A",
          MethodOfAdministration: drug.MethodOfAdministration || "N/A",
          Contraindications: drug.Contraindications || "N/A",
          PrecautionForUse: drug.PrecautionForUse || "N/A",
          EffectOnFGN: drug.EffectOnFGN || "N/A",
          SideEffect: drug.SideEffect || "N/A",
          Toxicity: drug.Toxicity || "N/A",
          StorageCondition: drug.StorageCondition || "N/A",
          ShelfLife: drug.ShelfLife || "N/A",
          IngredientLabel: drug.IngredientLabel || "N/A",
          ImagesPath: drug.ImagesPath || "N/A",
          ImageDefault: drug.ImageDefault || "N/A",
          InteractionIngredientName: drug.InteractionIngredientName || "N/A",
          IsDouanes: drug.IsDouanes || "N/A",
          RegistrationDate: drug.RegistrationDate || "N/A",
          PublicPrice: drug.PublicPrice || "N/A",
          SubsidyLabel: drug.SubsidyLabel || "N/A",
          SubsidyPercentage: drug.SubsidyPercentage || "N/A",
          HospPricing: drug.HospPricing || "N/A",
          Substitutable: drug.Substitutable || "N/A",
          CreatedBy: drug.CreatedBy || "N/A",
          CreatedDate: drug.CreatedDate || "N/A",
          UpdatedBy: drug.UpdatedBy || "N/A",
          UpdatedDate: drug.UpdatedDate || "N/A",
          ReviewDate: drug.ReviewDate || "N/A",
          MoPHCode: drug.MoPHCode || "N/A",
          CargoShippingTerms: drug.CargoShippingTerms || "N/A",
          NotMarketed: drug.NotMarketed || "N/A",
          PriceForeign: drug.PriceForeign || "N/A",
          CurrencyForeign: drug.CurrencyForeign || "N/A",
        }))

        // Populate dropdowns with unique, non-empty values
        setDosageNumerator1UnitOptions(getUniqueValues(formattedData, "DosageNumerator1Unit"))
        setDosageNumerator2UnitOptions(getUniqueValues(formattedData, "DosageNumerator2Unit"))
        setDosageNumerator3UnitOptions(getUniqueValues(formattedData, "DosageNumerator3Unit"))
        setDosageDenominator1UnitOptions(getUniqueValues(formattedData, "DosageDenominator1Unit"))
        setDosageDenominator2UnitOptions(getUniqueValues(formattedData, "DosageDenominator2Unit"))
        setDosageDenominator3UnitOptions(getUniqueValues(formattedData, "DosageDenominator3Unit"))
        setFormOptions(getUniqueValues(formattedData, "Form"))
        setRouteOptions(getUniqueValues(formattedData, "Route"))
        setStratumOptions(getUniqueValues(formattedData, "Stratum"))
        setAgentOptions(getUniqueValues(formattedData, "Agent"))
        setManufacturerOptions(getUniqueValues(formattedData, "Manufacturer"))

        setTableData(formattedData)
        setAllData(formattedData)

        // Initialize history with the first state
        setHistory([JSON.parse(JSON.stringify(formattedData))])
        setHistoryIndex(0)
      } else {
        // Handle case where response.data.drugs is not an array
        console.error("Invalid drug data format:", response.data)
        setTableData([])
        setAllData([])
        setHistory([[]])
        setHistoryIndex(0)
      }
    } catch (error) {
      console.error("Error fetching drugs:", error)
      setTableData([])
      setAllData([])
      setHistory([[]])
      setHistoryIndex(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setTableData(JSON.parse(JSON.stringify(history[newIndex])))
      // Clear changed cells when undoing
      setChangedCells({})
    }
  }
  // Cell drag and drop handlers
  const handleCellMouseDown = (value: any, columnId: string, rowId: string) => {
    if (value && value !== "N/A") {
      setDragValue(value)
      setDragColumnId(columnId)
      setIsDragging(true)
      // Prevent text selection during drag
      document.body.style.userSelect = "none"
    }
  }
  
  const handleCellMouseUp = () => {
    setIsDragging(false)
    setDragValue(null)
    setDragColumnId(null)
    // Restore text selection
    document.body.style.userSelect = ""
  }
  
  const handleCellMouseEnter = (row: MRT_Row<any>) => {
    if (isDragging && dragValue && dragColumnId) {
      const cellKey = `${row.id}-${dragColumnId}`
  
      // Update the data with the dragged value
      setTableData((prevData) =>
        prevData.map((drug) => {
          if (drug.DrugID === row.original.DrugID) {
            // Only mark as changed if the value is actually different
            if (drug[dragColumnId] !== dragValue) {
              setChangedCells((prev) => ({
                ...prev,
                [cellKey]: "pending",
              }))
              return { ...drug, [dragColumnId]: dragValue }
            }
          }
          return drug
        }),
      )
    }
  }
  // Confirm or reject cell changes
  const handleConfirmChange = (rowId: string, columnId: string) => {
    const cellKey = `${rowId}-${columnId}`
    setChangedCells((prev) => ({
      ...prev,
      [cellKey]: "confirmed",
    }))

    // After a short delay, remove the confirmation indicator
    setTimeout(() => {
      setChangedCells((prev) => {
        const newState = { ...prev }
        delete newState[cellKey]
        return newState
      })
    }, 2000)
  }

  const handleRejectChange = (rowId: string, columnId: string, originalValue: any) => {
    const cellKey = `${rowId}-${columnId}`

    // Mark as rejected
    setChangedCells((prev) => ({
      ...prev,
      [cellKey]: "rejected",
    }))

    // Revert the change in the data
    setTableData((prev) =>
      prev.map((drug) => {
        if (drug.DrugID === rowId) {
          return { ...drug, [columnId]: originalValue }
        }
        return drug
      }),
    )

    // After a short delay, remove the rejection indicator
    setTimeout(() => {
      setChangedCells((prev) => {
        const newState = { ...prev }
        delete newState[cellKey]
        return newState
      })
    }, 2000)
  }

  // Update the handleSaveRow function to properly handle API calls
  const handleSaveRow = async ({
    row,
    values,
    exitEditingMode,
  }: {
    row: any
    values: any
    exitEditingMode: () => void
  }) => {
    try {
      const updatedDrug = { ...row.original, ...values }
      // If ATC was changed in editing:
      if (updatedDrug.ATC) {
        updatedDrug.ATC_Code = updatedDrug.ATC
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
      }

      // Presentation sub-payload
      const presentationData = {
        UnitQuantity1: updatedDrug.PresentationUnitQuantity1,
        UnitType1: updatedDrug.PresentationUnitType1,
        UnitQuantity2: updatedDrug.PresentationUnitQuantity2,
        UnitType2: updatedDrug.PresentationUnitType2,
        PackageQuantity1: updatedDrug.PresentationPackageQuantity1,
        PackageType1: updatedDrug.PresentationPackageType1,
        PackageQuantity2: updatedDrug.PresentationPackageType2,
        PackageType2: updatedDrug.PresentationPackageType2,
        PackageQuantity3: updatedDrug.PresentationPackageQuantity3,
        PackageType3: updatedDrug.PresentationPackageType3,
        Description: updatedDrug.PresentationDescription,
      }

      // Debug payload
      console.log("Payload Sent to Backend:", updatedDrug)

      try {
        // Make the API calls
        await axios.put(`drugs/update/${updatedDrug.DrugID}`, updatedDrug)
        await axios.put(`dosages/updateByDrug/${updatedDrug.DrugID}`, dosageData)
        await axios.put(`presentations/updateByDrug/${updatedDrug.DrugID}`, presentationData)
      } catch (apiError) {
        console.error("API error during save, continuing with local update:", apiError)
        // Continue with local update even if API fails
      }

      // Update tableData locally
      setTableData((prevData) => prevData.map((drug) => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug)))
      setAllData((prevData) => prevData.map((drug) => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug)))

      exitEditingMode()
    } catch (error) {
      console.error("Error updating drug:", error)
      // Still exit editing mode to prevent UI from being stuck
      exitEditingMode()
    }
  }

  // Update the handleDeleteRow function to properly handle API calls
  const handleDeleteRow = async (row: any) => {
    try {
      if (window.confirm("Are you sure you want to delete this drug?")) {
        try {
          await axios.delete(`drugs/delete/${row.original.DrugID}`)
        } catch (apiError) {
          console.error("API error during delete, continuing with local update:", apiError)
          // Continue with local update even if API fails
        }

        // Update local data regardless of API success
        setTableData((prevData) => prevData.filter((drug) => drug.DrugID !== row.original.DrugID))
        setAllData((prevData) => prevData.filter((drug) => drug.DrugID !== row.original.DrugID))
      }
    } catch (error) {
      console.error("Error deleting drug:", error)
    }
  }

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    switch (columnPreset) {
      /* --------------------------------------------------
         Substitution Check Preset
         -------------------------------------------------- */
      case "substitutionCheck":
        return [
          {
            accessorKey: "ATC",
            header: "ATC",
            editVariant: "select",
            size: 120,
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ value }) => ({ value, label: value })),
              searchable: true,
              clearable: true,
              value: row.original.ATC || "",
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) => (drug.DrugID === row.original.DrugID ? { ...drug, ATC: value } : drug)),
                )
              },
              placeholder: row.original.ATC || "Select ATC",
            }),
          },
          {
            accessorKey: "ATCRelatedIngredient",
            header: "ATC Related Ingredient",
            size: 180,
            editVariant: "select",
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ label }) => ({ value: label, label })),
              searchable: true,
              clearable: true,
              value: row.original.ATCRelatedIngredient || "",
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID ? { ...drug, ATCRelatedIngredient: value } : drug,
                  ),
                )
              },
              placeholder: row.original.ATCRelatedIngredient || "Select Ingredient",
            }),
          },
          { accessorKey: "DrugName", header: "Brand Name", size: 150 },
          { accessorKey: "Seq", header: "Seq", size: 80 },
          // New columns per request
          { accessorKey: "OtherIngredients", header: "All Ingredients", size: 180 },
          {
            accessorKey: "FormLNDI",
            header: "Form LNDI",
            size: 120,
          },
          {
            accessorKey: "Form",
            header: "Dosage-form (clean)",
            size: 150,
            editVariant: "select",
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "FormRaw",
            header: "Form Raw",
            size: 120,
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
          },
        },
          {
            accessorKey: "RouteLNDI",
            header: "Route LNDI",
            size: 120,
          },
          {
            accessorKey: "Route",
            header: "Route (clean)",
            size: 130,
            editVariant: "select",
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "RouteRaw",
            header: "Route Raw",
            size: 120,
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),

          }
        },
          { accessorKey: "Parent", header: "Route Parent", size: 120 },

          // Keep the existing dosage columns
          { accessorKey: "DosageNumerator1", header: "DosageNumerator1", size: 150 },
          {
            accessorKey: "DosageNumerator1Unit",
            header: "Num 1 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageNumerator1UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageDenominator1", header: "Deno1", size: 100 },
          {
            accessorKey: "DosageDenominator1Unit",
            header: "Deno 1 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageDenominator1UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageNumerator2", header: "Num 2", size: 100 },
          {
            accessorKey: "DosageNumerator2Unit",
            header: "Num 2 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageNumerator2UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageDenominator2", header: "Deno 2", size: 100 },
          {
            accessorKey: "DosageDenominator2Unit",
            header: "Deno 2 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageDenominator2UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageDenominator3", header: "Deno 3", size: 100 },
          {
            accessorKey: "DosageDenominator3Unit",
            header: "Deno 3 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageDenominator3UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DFSequence", header: "D-F Sequence", size: 120 },
        ]

      /* --------------------------------------------------
         ATC Check Preset
         -------------------------------------------------- */
      case "atcCheck":
        return [
          { accessorKey: "DrugName", header: "Brand Name", size: 150 },
          {
            accessorKey: "ATC",
            header: "ATC",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ value }) => ({ value, label: value })),
              searchable: true,
              clearable: true,
              value: row.original.ATC || "",
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) => (drug.DrugID === row.original.DrugID ? { ...drug, ATC: value } : drug)),
                )
              },
              placeholder: row.original.ATC || "Select ATC",
            }),
          },
          {
            accessorKey: "ATCRelatedIngredient",
            header: "ATC Related Ingredient",
            size: 180,
            editVariant: "select",
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ label }) => ({ value: label, label })),
              searchable: true,
              clearable: true,
              value: row.original.ATCRelatedIngredient || "",
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID ? { ...drug, ATCRelatedIngredient: value } : drug,
                  ),
                )
              },
              placeholder: row.original.ATCRelatedIngredient || "Select Ingredient",
            }),
          },

          { accessorKey: "OtherIngredients", header: "All Ingredients", size: 180 },
          { accessorKey: "Seq", header: "Seq", size: 80 },

          { accessorKey: "Dosage", header: "Dosage (merged)", size: 200 },

          {
            accessorKey: "Route",
            header: "Route (clean)",
            size: 130,
            editVariant: "select",
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "RouteRaw",
            header: "Route Raw",
            size: 120,
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),

          }
        },
        ]

      /* --------------------------------------------------
         Presentation Check Preset
         -------------------------------------------------- */
      case "presentationCheck":
        return [
          { accessorKey: "DrugName", header: "Brand Name", size: 150 },
          { accessorKey: "Seq", header: "Seq", size: 80 },

          // Add Form LNDI + Dosage-Dosage-form (clean)
          {
            accessorKey: "FormLNDI",
            header: "Form LNDI",
            size: 120,
          },
          {
            accessorKey: "Form",
            header: "Dosage-form (clean)",
            size: 150,
            editVariant: "select",
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "FormRaw",
            header: "Form Raw",
            size: 120,
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
          },
        },

          // The requested "presentation" field => rename your
          // PresentationDescription to "Presentation (clean)"
          {
            accessorKey: "PresentationLNDI",
            header: "PresentationLNDI",
            size: 150,
          },
          {
            accessorKey: "PresentationDescription",
            header: "Presentation Description",
            size: 180,
            editVariant: "select",
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, "PresentationDescription").map((value) => ({
                value,
                label: value,
              })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "PresentationUnitQuantity1",
            header: "Unit Qtty 1 ",
            size: 120,
          },
          {
            accessorKey: "PresentationUnitType1",
            header: "Unit Type 1 ",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, "PresentationUnitType1").map((value) => ({
                value,
                label: value,
              })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "PresentationPackageQuantity1",
            header: "Package Qtty 1",
            size: 120,
          },
          {
            accessorKey: "PresentationPackageType1",
            header: "Package Type 1 ",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, "PresentationPackageType1").map((value) => ({
                value,
                label: value,
              })),
              searchable: true,
              clearable: true,
            },
          },

          // If you want to display the 2nd and 3rd sets as well:
          {
            accessorKey: "PresentationPackageQuantity2",
            header: "Package Qtty 2 (clean)",
            size: 150,
          },
          {
            accessorKey: "PresentationPackageType2",
            header: "Package Type 2",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, "PresentationPackageType1").map((value) => ({
                value,
                label: value,
              })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "PresentationUnitQuantity2",
            header: "Unit Qtty 2 (clean)",
            size: 150,
          },
          {
            accessorKey: "PresentationUnitType2",
            header: "Unit Type 2 (clean)",
            size: 150,
            editVariant: "select",
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, "PresentationUnitType2").map((value) => ({
                value,
                label: value,
              })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "PresentationPackageQuantity3",
            header: "Package Qtty 3 ",
            size: 120,
          },
          {
            accessorKey: "PresentationPackageType3",
            header: "Package Type 3",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: getUniqueValues(tableData, "PresentationPackageType1").map((value) => ({
                value,
                label: value,
              })),
              searchable: true,
              clearable: true,
            },
          },
        ]

      /* --------------------------------------------------
         Default Preset
         -------------------------------------------------- */
      default:
        return [
          { accessorKey: "DrugID", header: "DrugID", size: 80 },
          { accessorKey: "DrugName", header: "DrugName", size: 150 },
          { accessorKey: "DrugNameAR", header: "DrugNameAR", size: 150 },
          { accessorKey: "Seq", header: "Seq", size: 80 },
          { accessorKey: "ProductType", header: "ProductType", size: 120 },
          {
            accessorKey: "ATC",
            header: "ATC",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ value }) => ({ value, label: value })),
              searchable: true,
              clearable: true,
              value: row.original.ATC || "",
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) => (drug.DrugID === row.original.DrugID ? { ...drug, ATC: value } : drug)),
                )
              },
              placeholder: row.original.ATC || "Select ATC",
            }),
          },
          {
            accessorKey: "ATCRelatedIngredient",
            header: "ATC Related Ingredient",
            size: 180,
            editVariant: "select",
            mantineEditSelectProps: ({ row }) => ({
              data: atcOptions.map(({ label }) => ({ value: label, label })),
              searchable: true,
              clearable: true,
              value: row.original.ATCRelatedIngredient || "",
              onChange: (value: any) => {
                setTableData((prevData) =>
                  prevData.map((drug) =>
                    drug.DrugID === row.original.DrugID ? { ...drug, ATCRelatedIngredient: value } : drug,
                  ),
                )
              },
              placeholder: row.original.ATCRelatedIngredient || "Select Ingredient",
            }),
          },
          { accessorKey: "OtherIngredients", header: "All Ingredients", size: 180 },
          { accessorKey: "Dosage", header: "Dosage (merged)", size: 150 },
          { accessorKey: "DosageNumerator1", header: "Num 1", size: 100 },
          {
            accessorKey: "DosageNumerator1Unit",
            header: "Num 1 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageNumerator1UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageDenominator1", header: "Deno1", size: 100 },
          {
            accessorKey: "DosageDenominator1Unit",
            header: "Deno1 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageDenominator1UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageNumerator2", header: "Num2", size: 100 },
          {
            accessorKey: "DosageNumerator2Unit",
            header: "Num2 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageNumerator2UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageDenominator2", header: "Deno 2", size: 100 },
          {
            accessorKey: "DosageDenominator2Unit",
            header: "Deno 2 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageDenominator2UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageNumerator3", header: "Num 3", size: 100 },
          {
            accessorKey: "DosageNumerator3Unit",
            header: "Num 3 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageNumerator3UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "DosageDenominator3", header: "Deno 3", size: 100 },
          {
            accessorKey: "DosageDenominator3Unit",
            header: "Deno 3 Unit",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: dosageDenominator3UnitOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "isOTC", header: "isOTC", size: 80 },
          { accessorKey: "DFSequence", header: "DFSequence", size: 100 },
          {
            accessorKey: "Form",
            header: "Dosage-form (clean)",
            size: 150,
            editVariant: "select",
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "FormRaw",
            header: "Form Raw",
            size: 120,
            mantineEditSelectProps: {
              data: formOptions.map((value) => ({ value, label: value })),
          },
        },
          { accessorKey: "FormLNDI", header: "FormLNDI", size: 120 },

          {
            accessorKey: "RouteLNDI",
            header: "Route LNDI",
            size: 120,
          },
          {
            accessorKey: "Route",
            header: "Route (clean)",
            size: 130,
            editVariant: "select",
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "RouteRaw",
            header: "Route Raw",
            size: 120,
            mantineEditSelectProps: {
              data: routeOptions.map((value) => ({ value, label: value })),

          }
        },
          { accessorKey: "Parent", header: "Route Parent", size: 120 },
          { accessorKey: "PresentationLNDI", header: "PresentationLNDI", size: 150 },

          { accessorKey: "PresentationUnitQuantity1", header: "Presentation Unit Quantity 1", size: 180 },
          { accessorKey: "PresentationUnitType1", header: "Presentation Unit Type 1", size: 150 },
          { accessorKey: "PresentationUnitQuantity2", header: "Presentation Unit Quantity 2", size: 180 },
          { accessorKey: "PresentationUnitType2", header: "Presentation Unit Type 2", size: 150 },
          { accessorKey: "PresentationPackageQuantity1", header: "Presentation Package Qtty 1", size: 180 },
          { accessorKey: "PresentationPackageType1", header: "Presentation Package Type 1", size: 150 },
          { accessorKey: "PresentationPackageQuantity2", header: "Presentation Package Type 2", size: 180 },
          { accessorKey: "PresentationPackageType2", header: "Presentation Package Type 2", size: 150 },
          { accessorKey: "PresentationPackageQuantity3", header: "Presentation Package Qtty 3", size: 180 },
          { accessorKey: "PresentationPackageType3", header: "Presentation Package Type 3", size: 150 },
          { accessorKey: "PresentationDescription", header: "Presentation Description", size: 180 },

          {
            accessorKey: "Stratum",
            header: "Stratum",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: stratumOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "Amount", header: "Amount", size: 100 },
          {
            accessorKey: "Agent",
            header: "Agent",
            size: 120,
            editVariant: "select",
            mantineEditSelectProps: {
              data: agentOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          {
            accessorKey: "Manufacturer",
            header: "Manufacturer",
            size: 150,
            editVariant: "select",
            mantineEditSelectProps: {
              data: manufacturerOptions.map((value) => ({ value, label: value })),
              searchable: true,
              clearable: true,
            },
          },
          { accessorKey: "Country", header: "Country", size: 120 },
          { accessorKey: "RegistrationNumber", header: "RegistrationNumber", size: 150 },
          { accessorKey: "Notes", header: "Notes", size: 120 },
          { accessorKey: "Description", header: "Description", size: 150 },
          { accessorKey: "Indication", header: "Indication", size: 120 },
          { accessorKey: "Posology", header: "Posology", size: 120 },
          { accessorKey: "MethodOfAdministration", header: "MethodOfAdministration", size: 180 },
          { accessorKey: "Contraindications", header: "Contraindications", size: 150 },
          { accessorKey: "PrecautionForUse", header: "PrecautionForUse", size: 150 },
          { accessorKey: "EffectOnFGN", header: "EffectOnFGN", size: 120 },
          { accessorKey: "SideEffect", header: "SideEffect", size: 120 },
          { accessorKey: "Toxicity", header: "Toxicity", size: 100 },
          { accessorKey: "StorageCondition", header: "StorageCondition", size: 150 },
          { accessorKey: "ShelfLife", header: "ShelfLife", size: 120 },
          { accessorKey: "IngredientLabel", header: "IngredientLabel", size: 150 },
          { accessorKey: "ImagesPath", header: "ImagesPath", size: 120 },
          { accessorKey: "ImageDefault", header: "ImageDefault", size: 120 },
          {
            accessorKey: "InteractionIngredientName",
            header: "InteractionIngredientName",
            size: 180,
          },
          { accessorKey: "IsDouanes", header: "IsDouanes", size: 120 },
          { accessorKey: "RegistrationDate", header: "RegistrationDate", size: 150 },
          { accessorKey: "PublicPrice", header: "PublicPrice", size: 120 },
          { accessorKey: "SubsidyLabel", header: "SubsidyLabel", size: 120 },
          { accessorKey: "SubsidyPercentage", header: "SubsidyPercentage", size: 150 },
          { accessorKey: "HospPricing", header: "HospPricing", size: 120 },
          { accessorKey: "Substitutable", header: "Substitutable", size: 120 },
          { accessorKey: "CreatedBy", header: "CreatedBy", size: 120 },
          { accessorKey: "CreatedDate", header: "CreatedDate", size: 150 },
          { accessorKey: "UpdatedBy", header: "UpdatedBy", size: 120 },
          { accessorKey: "UpdatedDate", header: "UpdatedDate", size: 150 },
          { accessorKey: "ReviewDate", header: "ReviewDate", size: 120 },
          { accessorKey: "MoPHCode", header: "MoPHCode", size: 100 },
          { accessorKey: "CargoShippingTerms", header: "CargoShippingTerms", size: 150 },
          { accessorKey: "NotMarketed", header: "NotMarketed", size: 120 },
          { accessorKey: "PriceForeign", header: "PriceForeign", size: 120 },
          { accessorKey: "CurrencyForeign", header: "CurrencyForeign", size: 120 },
        ]
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
    tableData,
  ])

  const table = useMantineReactTable({
    columns,
    data: tableData,
    enableColumnResizing: true,
    enableEditing: true,
    editDisplayMode: "row",
    enableRowActions: true,
    enableStickyHeader: true,
    enablePagination: true,
    enableRowVirtualization: true, // Enable row virtualization for better performance
    mantinePaginationProps: {
      rowsPerPageOptions: ["100", "250", "500", "1000", "2500", "5000"],
      withEdges: false,
    },
    state: {
      isLoading,
    },
    initialState: {
      density: "xs",
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
      <Menu.Item key="delete" onClick={() => handleDeleteRow(row)} style={{ color: "red" }}>
        Delete
      </Menu.Item>,
    ],
    mantineTableBodyRowProps: ({ row }) => ({
      style: {
        backgroundColor: getRowColor(Number(row.index)),
      },
    }),
    mantineTableBodyCellProps: ({ cell }) => {
      const cellKey = `${cell.row.original.DrugID}-${cell.column.id}`
      const cellStatus = changedCells[cellKey]
  
      return {
        onMouseDown: () => handleCellMouseDown(cell.getValue<any>(), cell.column.id, cell.row.original.DrugID),
        onMouseUp: handleCellMouseUp,
        onMouseEnter: () => handleCellMouseEnter(cell.row),
        "data-row-id": cell.row.original.DrugID,
        "data-column-id": cell.column.id,
        style: {
          cursor: isDragging ? "cell" : "default",
          userSelect: "none",
          position: "relative" as const,
          ...(isDragging && dragColumnId === cell.column.id ? tableStyles.cellHighlight : {}),
          ...(cellStatus === "pending" ? tableStyles.cellPending : {}),
          ...(cellStatus === "confirmed" ? tableStyles.cellConfirmed : {}),
          ...(cellStatus === "rejected" ? tableStyles.cellRejected : {}),
        },
        children: (
          <>
            {cell.renderValue()}
          </>
        ),
      }
    },
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      withBorder: true,
      withColumnBorders: true,
    },
  })

  // Hotkeys for undo (Ctrl+Z)
  useHotkeys([["ctrl+z", () => handleUndo()]])

  // Remove the renderDetailPanel since we're showing confirmations directly on cells
  // and update the CSS for bigger scrollbars
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <div style={tableStyles.tableContainer}>
        <div style={tableStyles.controlsContainer}>
          <label htmlFor="columnPresetSelect" style={tableStyles.selectLabel}>
            Select Column Preset:
          </label>
          <select
            id="columnPresetSelect"
            value={columnPreset}
            onChange={(e) => setColumnPreset(e.target.value)}
            style={tableStyles.select}
          >
            <option value="default">Default</option>
            <option value="substitutionCheck">Substitution Check</option>
            <option value="atcCheck">ATC Check</option>
            <option value="presentationCheck">Presentation Check</option>
          </select>

          <MantineButton
            leftIcon={<IconArrowBackUp size={16} />}
            variant="outline"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            style={tableStyles.undoButton}
          >
            Undo
          </MantineButton>

          <MantineButton
            leftIcon={<IconPlus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
            style={tableStyles.addButton}
          >
            Add Drug
          </MantineButton>
        </div>

        <div style={tableStyles.tipText}>
          <i>
            Tip: Click and drag a cell value to fill other cells with the same value. Use the check/x icons to confirm
            or reject changes.
          </i>
        </div>

        <div style={tableStyles.tableWrapper} ref={tableWrapperRef}>
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

        {/* Custom CSS for scrollbars */}
        <style>{`
        /* Enhanced scrollbars */
        ::-webkit-scrollbar {
          width: 16px;
          height: 16px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 8px;
          border: 3px solid #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .cell-highlight {
          background-color: rgba(0, 123, 255, 0.2) !important;
          border: 2px solid #007bff !important;
        }

        /* Make sure rows have distinct colors */
        .mantine-Table-root tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.02);
        }
      `}</style>
      </div>
    </MantineProvider>
  )
}

export default DrugTable

