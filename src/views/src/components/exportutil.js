import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const exportToExcel = (tableData) => {
  const workbook = new ExcelJS.Workbook()

  // Preset column configurations
  const headers = {
    default: [
      "DrugID", "DrugName", "DrugNameAR", "Seq", "ProductType", "ATC",
      "ATCRelatedIngredient", "OtherIngredients", "Dosage", "DosageNumerator1",
      "DosageNumerator1Unit", "DosageDenominator1", "DosageDenominator1Unit",
      "DosageNumerator2", "DosageNumerator2Unit", "DosageDenominator2",
      "DosageDenominator2Unit", "DosageNumerator3", "DosageNumerator3Unit",
      "DosageDenominator3", "DosageDenominator3Unit", "isOTC", "DFSequence",
      "Form", "FormRaw", "FormLNDI", "RouteLNDI", "Route", "RouteRaw",
      "Parent", "PresentationLNDI", "PresentationUnitQuantity1", 
      "PresentationUnitType1", "PresentationUnitQuantity2", "PresentationUnitType2",
      "PresentationPackageQuantity1", "PresentationPackageType1",
      "PresentationPackageQuantity2", "PresentationPackageType2",
      "PresentationPackageQuantity3", "PresentationPackageType3",
      "PresentationDescription", "Stratum", "Amount", "Agent", "Manufacturer",
      "Country", "RegistrationNumber", "Notes", "Description", "Indication",
      "Posology", "MethodOfAdministration", "Contraindications", "PrecautionForUse",
      "EffectOnFGN", "SideEffect", "Toxicity", "StorageCondition", "ShelfLife",
      "IngredientLabel", "ImagesPath", "ImageDefault", "InteractionIngredientName",
      "IsDouanes", "RegistrationDate", "PublicPrice", "SubsidyLabel",
      "SubsidyPercentage", "HospPricing", "Substitutable", "CreatedBy",
      "CreatedDate", "UpdatedBy", "UpdatedDate", "ReviewDate", "MoPHCode",
      "CargoShippingTerms", "NotMarketed", "PriceForeign", "CurrencyForeign"
    ],
    substitutionCheck: [
      "ATC", "ATCRelatedIngredient", "DrugName", "Seq", 
      "OtherIngredients", "FormLNDI", "Form", "FormRaw", 
      "RouteLNDI", "Route", "RouteRaw", "Parent", 
      "DosageNumerator1", "DosageNumerator1Unit"
    ],
    presentationCheck: [
      "DrugName", "Seq", "FormLNDI", "Form", "FormRaw",
      "PresentationLNDI", "PresentationDescription",
      "PresentationUnitQuantity1", "PresentationUnitType1",
      "PresentationPackageQuantity1", "PresentationPackageType1"
    ],
    atcCheck: [
      "DrugName", "ATC", "ATCRelatedIngredient", "Dosage", "Route"
    ]
  }

  // Loop through each preset and create a sheet
  Object.entries(headers).forEach(([presetName, selectedHeaders]) => {
    const worksheet = workbook.addWorksheet(presetName)

    // Define Headers
    worksheet.columns = selectedHeaders.map((header) => ({
      header,
      key: header,
      width: Math.max(15, header.length + 5)
    }))

    // Add table data rows
    tableData.forEach((drug) => {
      const rowData = selectedHeaders.reduce((acc, header) => {
        acc[header] = drug[header] ?? "N/A"
        return acc
      }, {})
      worksheet.addRow(rowData)
    })

    // Enable Filters
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: selectedHeaders.length }
    }

    // Style the header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '007bff' }
      }
      cell.alignment = { horizontal: 'center' }
    })
  })

  // Export the workbook
  workbook.xlsx.writeBuffer().then((buffer) => {
    const date = new Date().toISOString().split('T')[0] // e.g., 2025-03-14
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `DrugTable_All_Presets_${date}.xlsx`)
  })
}


export default exportToExcel;