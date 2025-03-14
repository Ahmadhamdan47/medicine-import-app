"use client"

import type React from "react"

import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useHotkeys, useLocalStorage, useViewportSize } from "@mantine/hooks"
import  exportToExcel  from "./exportutil"

import axios from "axios"
import {
  Table,
  Menu,
  Button,
  TextInput,
  Text,
  Select,
  Tooltip,
  Group,
  Box,
  Paper,
  Loader,
  ActionIcon,
  MantineProvider,
  createStyles,
  Checkbox,
  Badge,
  Modal,
  Slider,
  ColorSwatch,
  Switch,
  Divider,
  ScrollArea,
  Notification,
  Tabs,
} from "@mantine/core"
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconPlus,
  IconSearch,
  IconChevronDown,
  IconCheck,
  IconX,
  IconArrowsUpDown,
  IconSettings,
  IconDownload,
  IconMaximize,
  IconMinimize,
  IconTrash,
  IconAlertCircle,
  IconAdjustments,
  IconEye,
} from "@tabler/icons-react"

import  AddDrugModal  from "./AddDrugModal"

// Create styles for the components
const useStyles = createStyles((theme) => ({
  tableContainer: {
    height: "90vh", // Increased from 80vh to 90vh
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
  },
  tableWrapper: {
    flex: "1 1 auto",
    overflowY: "auto",
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.md,
    position: "relative",
  },
  tableHeader: {
    position: "sticky",
    top: 0,
    backgroundColor: theme.white,
    zIndex: 10,
    borderBottom: `1px solid ${theme.colors.gray[3]}`,
  },
  tableHeaderCell: {
    position: "relative",
    padding: theme.spacing.sm,
    fontWeight: 600,
    userSelect: "none",
    "&:hover $resizeHandle": {
      opacity: 1,
    },
  },
  resizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "5px",
    cursor: "col-resize",
    opacity: 0,
    transition: "opacity 0.2s",
    backgroundColor: theme.colors.blue[5],
    "&:hover": {
      opacity: 1,
    },
  },
  tableRow: {
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.colors.blue[1], 0.3),
    },
  },
  tableRowSelected: {
    backgroundColor: theme.fn.rgba(theme.colors.blue[1], 0.5),
    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.colors.blue[1], 0.6),
    },
  },
  tableRowEven: {
    backgroundColor: theme.fn.rgba(theme.colors.gray[0], 0.5),
  },
  tableRowOdd: {
    backgroundColor: theme.white,
  },
  // Color variations for rows
  tableRowBlue: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.fn.rgba(theme.colors.blue[0], 0.5),
    },
    "&:nth-of-type(odd)": {
      backgroundColor: theme.fn.rgba(theme.colors.blue[0], 0.2),
    },
  },
  tableRowGreen: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.fn.rgba(theme.colors.green[0], 0.5),
    },
    "&:nth-of-type(odd)": {
      backgroundColor: theme.fn.rgba(theme.colors.green[0], 0.2),
    },
  },
  tableRowTeal: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.fn.rgba(theme.colors.teal[0], 0.5),
    },
    "&:nth-of-type(odd)": {
      backgroundColor: theme.fn.rgba(theme.colors.teal[0], 0.2),
    },
  },
  tableRowCyan: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.fn.rgba(theme.colors.cyan[0], 0.5),
    },
    "&:nth-of-type(odd)": {
      backgroundColor: theme.fn.rgba(theme.colors.cyan[0], 0.2),
    },
  },
  tableRowIndigo: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.fn.rgba(theme.colors.indigo[0], 0.5),
    },
    "&:nth-of-type(odd)": {
      backgroundColor: theme.fn.rgba(theme.colors.indigo[0], 0.2),
    },
  },
  tableRowGray: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.fn.rgba(theme.colors.gray[0], 0.5),
    },
    "&:nth-of-type(odd)": {
      backgroundColor: theme.fn.rgba(theme.colors.gray[0], 0.2),
    },
  },
  cell: {
    position: "relative",
    padding: theme.spacing.sm,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "all 0.2s",
  },
  cellHighlight: {
    backgroundColor: theme.fn.rgba(theme.colors.blue[5], 0.1),
    border: `2px solid ${theme.colors.blue[5]}`,
  },
  cellPending: {
    backgroundColor: theme.fn.rgba(theme.colors.blue[5], 0.1),
  },
  cellConfirmed: {
    backgroundColor: theme.fn.rgba(theme.colors.green[5], 0.1),
  },
  cellRejected: {
    backgroundColor: theme.fn.rgba(theme.colors.red[5], 0.1),
  },
  cellSelected: {
    backgroundColor: theme.fn.rgba(theme.colors.blue[5], 0.1),
  },
  statusIcon: {
    position: "absolute",
    top: 2,
    right: 2,
    zIndex: 10,
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderTop: `1px solid ${theme.colors.gray[3]}`,
  },
  searchInput: {
    maxWidth: "300px",
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  tipText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[6],
    fontStyle: "italic",
    marginBottom: theme.spacing.sm,
  },
  fullscreenTable: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: theme.white,
    padding: theme.spacing.md,
  },
  settingsModal: {
    ".mantine-Modal-body": {
      paddingTop: 0,
    },
  },
  selectionInfo: {
    position: "absolute",
    bottom: 60,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.fn.rgba(theme.colors.dark[7], 0.8),
    color: theme.white,
    boxShadow: theme.shadows.md,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  columnVisibilityMenu: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  columnVisibilityItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  columnVisibilityCheckbox: {
    marginRight: theme.spacing.xs,
  },
  columnVisibilityLabel: {
    flex: 1,
  },
}))

// Debounce utility function
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout | null
  return function (this: any, ...args: any[]) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Sanitize drug data function
const sanitizeDrugData = (drug: any) => {
  const sanitizedDrug = { ...drug }

  // List of fields that should be integers
  const integerFields = ["ImageDefault", "Amount", "IsDouanes", "NotMarketed"]

  // List of fields that should be dates
  const dateFields = ["RegistrationDate", "CreatedDate", "UpdatedDate", "ReviewDate"]

  // Sanitize integer fields
  integerFields.forEach((field) => {
    if (sanitizedDrug[field] === "N/A" || sanitizedDrug[field] === undefined || sanitizedDrug[field] === "") {
      sanitizedDrug[field] = null
    }
  })

  // Sanitize date fields
  dateFields.forEach((field) => {
    if (
      sanitizedDrug[field] === "Invalid date" ||
      sanitizedDrug[field] === "N/A" ||
      sanitizedDrug[field] === undefined
    ) {
      sanitizedDrug[field] = null
    }
  })

  return sanitizedDrug
}

// Get unique values from data
const getUniqueValues = (data: any[], column: string) => {
  return Array.from(new Set(data.map((row) => row[column])))
    .filter((value) => value !== null && value !== undefined && value !== "" && value !== "N/A")
    .sort()
}

// Export data to CSV
const exportToCSV = (data: any[], columns: any[], filename: string) => {
  // Create header row
  const header = columns.map((col) => `"${col.title}"`).join(",")

  // Create data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = row[col.accessor]
        // Wrap in quotes and escape any quotes inside the value
        return `"${value?.toString().replace(/"/g, '""') || ""}"`
      })
      .join(",")
  })

  // Combine header and rows
  const csv = [header, ...rows].join("\n")

  // Create a blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Cell component with drag and drop support
interface CellProps {
  value: any
  rowId: string
  column: string
  isDragging: boolean
  dragValue: any
  dragColumnId: string | null
  cellStatus: "pending" | "confirmed" | "rejected" | null
  isSelected: boolean
  onMouseDown: (value: any, columnId: string, rowId: string) => void
  onMouseEnter: (rowId: string) => void
  onClick: (rowId: string, columnId: string, ctrlKey: boolean) => void
}

const Cell = ({
  value,
  rowId,
  column,
  isDragging,
  dragValue,
  dragColumnId,
  cellStatus,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onClick,
}: CellProps) => {
  const { classes, cx } = useStyles()

  return (
    <Box
      className={cx(
        classes.cell,
        isDragging && dragColumnId === column && classes.cellHighlight,
        cellStatus === "pending" && classes.cellPending,
        cellStatus === "confirmed" && classes.cellConfirmed,
        cellStatus === "rejected" && classes.cellRejected,
        isSelected && classes.cellSelected,
      )}
      onMouseDown={() => onMouseDown(value, column, rowId)}
      onMouseEnter={() => onMouseEnter(rowId)}
      onClick={(e) => onClick(rowId, column, e.ctrlKey)}
    >
      {value === "N/A" ? <Text color="dimmed">N/A</Text> : <Text>{value}</Text>}

      {cellStatus === "pending" && (
        <Group spacing={4} className={classes.statusIcon}>
          <ActionIcon size="xs" color="green">
            <IconCheck size={12} />
          </ActionIcon>
          <ActionIcon size="xs" color="red">
            <IconX size={12} />
          </ActionIcon>
        </Group>
      )}

      {cellStatus === "confirmed" && (
        <ActionIcon size="xs" color="green" className={classes.statusIcon}>
          <IconCheck size={12} />
        </ActionIcon>
      )}

      {cellStatus === "rejected" && (
        <ActionIcon size="xs" color="red" className={classes.statusIcon}>
          <IconX size={12} />
        </ActionIcon>
      )}
    </Box>
  )
}

// Column resizing interface
interface ColumnResizeProps {
  column: any
  onResize: (columnId: string, width: number) => void
}

const ColumnResizeHandle = ({ column, onResize }: ColumnResizeProps) => {
  const { classes } = useStyles()
  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    startXRef.current = e.clientX
    startWidthRef.current = column.width

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - startXRef.current
    const newWidth = Math.max(50, startWidthRef.current + deltaX)
    onResize(column.accessor, newWidth)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  return <div className={classes.resizeHandle} onMouseDown={handleMouseDown} />
}

// Settings interface
interface TableSettings {
  rowColorScheme: "default" | "blue" | "green" | "teal" | "cyan" | "indigo" | "gray"
  cellSize: number
  enableVirtualization: boolean
  confirmBeforeRefresh: boolean
  autoSaveState: boolean
  visibleColumns: Record<string, boolean>
}

export function DrugTable() {
  const { classes, cx } = useStyles()
  const { height: viewportHeight } = useViewportSize()

  // Main data state
  const [allData, setAllData] = useState<any[]>([])
  const [tableData, setTableData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [columnPreset, setColumnPreset] = useState<string>("default")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  // Column state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})

  // Settings state
  const [settings, setSettings] = useLocalStorage<TableSettings>({
    key: "drug-table-settings",
    defaultValue: {
      rowColorScheme: "default",
      cellSize: 25, // Changed from 35 to 25
      enableVirtualization: true,
      confirmBeforeRefresh: true,
      autoSaveState: false, // Changed from true to false
      visibleColumns: {},
    },
  })

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [lastSelectedRow, setLastSelectedRow] = useState<string | null>(null)

  // History for undo/redo functionality
  const [history, setHistory] = useState<any[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Drag and drop functionality
  const [isDragging, setIsDragging] = useState(false)
  const [dragValue, setDragValue] = useState<any>(null)
  const [dragColumnId, setDragColumnId] = useState<string | null>(null)

  // Confirmation indicators
  const [changedCells, setChangedCells] = useState<Record<string, "pending" | "confirmed" | "rejected">>({})

  // Refs for scrolling
  const [pendingChanges, setPendingChanges] = useState<
    Array<{
      rowId: string
      columnId: string
      oldValue: any
      newValue: any
    }>
  >([])

  // Add state for save results
  const [saveResults, setSaveResults] = useState<
    Array<{
      rowId: string
      columnId: string
      success: boolean
      message: string
    }>
  >([])

  // Add state for showing save results modal
  const [showSaveResultsModal, setShowSaveResultsModal] = useState(false)
  const tableContainerRef = useRef<HTMLDivElement>(null)

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

  // Debounced save function
  const debouncedSaveChange = useCallback(
    debounce((updatedDrug) => {
      // Make the API call
      axios
        .put(`drugs/update/${updatedDrug.DrugID}`, updatedDrug)
        .then(() => {
          console.log(`Successfully saved change for drug ${updatedDrug.DrugID}`)
        })
        .catch((error) => {
          console.error("API error during drag save:", error)
        })
    }, 500), // 500ms debounce time
    [],
  )

  // Hotkeys for undo (Ctrl+Z) and redo (Ctrl+Y)
  useHotkeys([
    ["mod+Z", handleUndo],
    ["mod+Y", handleRedo],
    ["mod+S", () => saveTableState()],
  ])

  // Prevent refresh without confirmation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (settings.confirmBeforeRefresh && hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?"
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [settings.confirmBeforeRefresh, hasUnsavedChanges])

  // Auto-save table state
  useEffect(() => {
    if (settings.autoSaveState && tableData.length > 0) {
      const saveStateTimer = setTimeout(() => {
        saveTableState()
      }, 30000) // Auto-save every 30 seconds

      return () => clearTimeout(saveStateTimer)
    }
  }, [tableData, settings.autoSaveState])

  // Load data on mount
  useEffect(() => {
    fetchDrugs()
    fetchAtcOptions()

    // Try to load saved state
    const savedState = localStorage.getItem("drug-table-state")
    if (savedState) {
      try {
        const {
          tableData: savedTableData,
          history: savedHistory,
          historyIndex: savedHistoryIndex,
        } = JSON.parse(savedState)
        if (savedTableData && savedTableData.length > 0) {
          setTableData(savedTableData)
          if (savedHistory) setHistory(savedHistory)
          if (savedHistoryIndex !== undefined) setHistoryIndex(savedHistoryIndex)

          showNotification("Table state restored from last session", "info")
        }
      } catch (error) {
        console.error("Error loading saved table state:", error)
      }
    }
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
      setHasUnsavedChanges(true)
    }
  }, [tableData])

  // Save table state to localStorage
  const saveTableState = () => {
    saveAllChanges()
  }

  // Show notification
  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Fetch ATC options
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

  const handleAddSuccess = (newDrug: any) => {
    // The backend likely returns the newly created drug record
    // Append to table data
    setTableData((prev) => [...prev, newDrug])
    setAllData((prev) => [...prev, newDrug])
    showNotification("Drug added successfully", "success")
  }

  // Fetch drugs data
  const fetchDrugs = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("https://apiv2.medleb.org/drugs/all")

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
          ImageDefault: drug.ImageDefault === "N/A" ? null : drug.ImageDefault,
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

        // Set the full dataset directly to tableData
        setTableData(formattedData)
        setAllData(formattedData)

        // Initialize history with the first state
        setHistory([JSON.parse(JSON.stringify(formattedData))])
        setHistoryIndex(0)

        // Initialize column visibility if not already set
        if (Object.keys(settings.visibleColumns).length === 0) {
          const initialVisibility: Record<string, boolean> = {}
          Object.keys(formattedData[0] || {}).forEach((key) => {
            initialVisibility[key] = true
          })
          setSettings({ ...settings, visibleColumns: initialVisibility })
        }

        showNotification(`Loaded ${formattedData.length} drugs successfully`, "success")
      } else {
        // Handle case where response.data.drugs is not an array
        console.error("Invalid drug data format:", response.data)
        setTableData([])
        setAllData([])
        setHistory([[]])
        setHistoryIndex(0)
        showNotification("Failed to load drugs: Invalid data format", "error")
      }
    } catch (error) {
      console.error("Error fetching drugs:", error)
      setTableData([])
      setAllData([])
      setHistory([[]])
      setHistoryIndex(0)
      showNotification("Failed to load drugs: Server error", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Undo functionality
  function handleUndo() {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setTableData(JSON.parse(JSON.stringify(history[newIndex])))
      // Clear changed cells when undoing
      setChangedCells({})
      setHasUnsavedChanges(true)
      showNotification("Undo successful", "info")
    } else {
      showNotification("Nothing to undo", "info")
    }
  }

  // Redo functionality
  function handleRedo() {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setTableData(JSON.parse(JSON.stringify(history[newIndex])))
      // Clear changed cells when redoing
      setChangedCells({})
      setHasUnsavedChanges(true)
      showNotification("Redo successful", "info")
    } else {
      showNotification("Nothing to redo", "info")
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

  // Add a new function to save all pending changes
  const saveAllChanges = async () => {
    if (pendingChanges.length === 0) {
      showNotification("No changes to save", "info")
      return
    }

    setIsLoading(true)
    const results = []

    // Process changes sequentially
    for (const change of pendingChanges) {
      const { rowId, columnId, newValue } = change

      try {
        const payload = {
          DrugID: rowId,
          [columnId]: newValue,
        }

        // Handle 'N/A' values for integer fields
        const integerFields = ["ImageDefault", "Amount", "IsDouanes", "NotMarketed"]
        if (integerFields.includes(columnId) && payload[columnId] === "N/A") {
          payload[columnId] = null
        }

        await axios.put(`https://apiv2.medleb.org/drugs/update/${rowId}`, payload)

        // Mark as successful
        results.push({
          rowId,
          columnId,
          success: true,
          message: `Successfully updated ${columnId} for drug ${rowId}`,
        })

        // Update cell status
        setChangedCells((prev) => ({
          ...prev,
          [`${rowId}-${columnId}`]: "confirmed",
        }))

        // After a delay, remove the confirmation indicator
        setTimeout(() => {
          setChangedCells((prev) => {
            const newState = { ...prev }
            delete newState[`${rowId}-${columnId}`]
            return newState
          })
        }, 2000)
      } catch (error) {
        console.error(`Error saving change for ${columnId} on row ${rowId}:`, error)

        // Mark as failed
        results.push({
          rowId,
          columnId,
          success: false,
          message: `Failed to update ${columnId}: ${(error as any).message || "Unknown error"}`,
        })

        // Update cell status
        setChangedCells((prev) => ({
          ...prev,
          [`${rowId}-${columnId}`]: "rejected",
        }))
      }
    }

    setIsLoading(false)
    setSaveResults(results)
    setShowSaveResultsModal(true)

    // Clear pending changes that were successful
    const successfulRowColumns = results.filter((r) => r.success).map((r) => `${r.rowId}-${r.columnId}`)

    setPendingChanges((prev) =>
      prev.filter((change) => !successfulRowColumns.includes(`${change.rowId}-${change.columnId}`)),
    )

    // Show summary notification
    const successCount = results.filter((r) => r.success).length
    const failCount = results.length - successCount

    if (failCount === 0) {
      showNotification(`Successfully saved all ${successCount} changes`, "success")
      setHasUnsavedChanges(false)
    } else {
      showNotification(`Saved ${successCount} changes, but ${failCount} failed. See details.`, "info")
    }
  }

  // Modify the handleCellMouseEnter function to track changes instead of saving immediately
  const handleCellMouseEnter = (rowId: string) => {
    if (isDragging && dragValue && dragColumnId) {
      const row = tableData.find((row) => row.DrugID === rowId)

      if (!row) return

      // Only proceed if the value is actually different
      if (row[dragColumnId] !== dragValue) {
        // Track the change
        const existingChangeIndex = pendingChanges.findIndex(
          (change) => change.rowId === rowId && change.columnId === dragColumnId,
        )

        if (existingChangeIndex === -1) {
          // Add new change
          setPendingChanges((prev) => [
            ...prev,
            {
              rowId,
              columnId: dragColumnId,
              oldValue: row[dragColumnId],
              newValue: dragValue,
            },
          ])
        } else {
          // Update existing change
          setPendingChanges((prev) => {
            const newChanges = [...prev]
            newChanges[existingChangeIndex].newValue = dragValue
            return newChanges
          })
        }

        // Create a minimal payload with just the changed field and DrugID
        const payload: any = {
          DrugID: row.DrugID,
          [dragColumnId]: dragValue,
        }

        // If Form is being dragged, also update DFSequence
        if (dragColumnId === "Form") {
          const matchingDrug = allData.find(
            (d) => d.DrugID !== row.DrugID && d.Form === dragValue && d.DFSequence && d.DFSequence !== "N/A",
          )

          if (matchingDrug) {
            payload.DFSequence = matchingDrug.DFSequence

            // Also update the local state with the DFSequence
            setTableData((prevData) =>
              prevData.map((drug) =>
                drug.DrugID === row.DrugID
                  ? { ...drug, [dragColumnId]: dragValue, DFSequence: matchingDrug.DFSequence }
                  : drug,
              ),
            )
          } else {
            // Just update the local state with the dragged value
            setTableData((prevData) =>
              prevData.map((drug) => (drug.DrugID === row.DrugID ? { ...drug, [dragColumnId]: dragValue } : drug)),
            )
          }
        } else {
          // Update local state with the dragged value
          setTableData((prevData) =>
            prevData.map((drug) => (drug.DrugID === row.DrugID ? { ...drug, [dragColumnId]: dragValue } : drug)),
          )
        }

        // Mark cell as pending
        setChangedCells((prev) => ({
          ...prev,
          [`${rowId}-${dragColumnId}`]: "pending",
        }))
      }
    }
  }

  // Handle saving row changes
  const handleSaveRow = async (rowId: string, values: any) => {
    try {
      const rowIndex = tableData.findIndex((row) => row.DrugID === rowId)
      if (rowIndex === -1) return

      let updatedDrug = { ...tableData[rowIndex], ...values }

      // Sanitize the updated drug data
      updatedDrug = sanitizeDrugData(updatedDrug)

      // If Form (DosageForm Clean) was changed, find a matching DFSequence
      if (values.Form && values.Form !== tableData[rowIndex].Form) {
        // Find another drug with the same Form value to get its DFSequence
        const matchingDrug = allData.find(
          (drug) =>
            drug.DrugID !== updatedDrug.DrugID &&
            drug.Form === values.Form &&
            drug.DFSequence &&
            drug.DFSequence !== "N/A",
        )

        if (matchingDrug) {
          updatedDrug.DFSequence = matchingDrug.DFSequence
          console.log(`Auto-selected DFSequence ${matchingDrug.DFSequence} based on Form ${values.Form}`)
        }
      }

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
        PackageQuantity2: updatedDrug.PresentationPackageQuantity2,
        PackageType2: updatedDrug.PresentationPackageType2,
        PackageQuantity3: updatedDrug.PresentationPackageQuantity3,
        PackageType3: updatedDrug.PresentationPackageType3,
        Description: updatedDrug.PresentationDescription,
      }

      // Debug payload
      console.log("Payload Sent to Backend:", updatedDrug)

      try {
        // Make the API calls
        await axios.put(`https://apiv2.medleb.org/drugs/update/${updatedDrug.DrugID}`, updatedDrug)
        await axios.put(`https://apiv2.medleb.org/dosages/updateByDrug/${updatedDrug.DrugID}`, dosageData)
        await axios.put(`https://apiv2.medleb.org/presentations/updateByDrug/${updatedDrug.DrugID}`, presentationData)
        showNotification("Drug updated successfully", "success")
      } catch (apiError) {
        console.error("API error during save, continuing with local update:", apiError)
        showNotification("API error during save, continuing with local update", "error")
        // Continue with local update even if API fails
      }

      // Update tableData locally
      setTableData((prevData) => prevData.map((drug) => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug)))
      setAllData((prevData) => prevData.map((drug) => (drug.DrugID === updatedDrug.DrugID ? updatedDrug : drug)))
      setHasUnsavedChanges(true)
    } catch (error) {
      console.error("Error updating drug:", error)
      showNotification("Error updating drug", "error")
    }
  }

  // Handle deleting a row
  const handleDeleteRow = async (rowId: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this drug?")) {
        try {
          await axios.delete(`https://apiv2.medleb.org/drugs/delete/${rowId}`)
          showNotification("Drug deleted successfully", "success")
        } catch (apiError) {
          console.error("API error during delete, continuing with local update:", apiError)
          showNotification("API error during delete, continuing with local update", "error")
          // Continue with local update even if API fails
        }

        // Update local data regardless of API success
        setTableData((prevData) => prevData.filter((drug) => drug.DrugID !== rowId))
        setAllData((prevData) => prevData.filter((drug) => drug.DrugID !== rowId))
        setHasUnsavedChanges(true)
      }
    } catch (error) {
      console.error("Error deleting drug:", error)
      showNotification("Error deleting drug", "error")
    }
  }

  // Handle column resize
  const handleColumnResize = (columnId: string, width: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnId]: width,
    }))
  }

  // Toggle column visibility
  const toggleColumnVisibility = (columnId: string) => {
    setSettings({
      ...settings,
      visibleColumns: {
        ...settings.visibleColumns,
        [columnId]: !settings.visibleColumns[columnId],
      },
    })
  }

  // Export current view to CSV
  const handleExportCSV = () => {
    const visibleColumns = columns.filter((col) => settings.visibleColumns[col.accessor] !== false)
    const dataToExport = filteredData.map((row) => {
      const exportRow: Record<string, any> = {}
      visibleColumns.forEach((col) => {
        exportRow[col.accessor] = row[col.accessor]
      })
      return exportRow
    })

    exportToCSV(dataToExport, visibleColumns, `drug-data-export-${new Date().toISOString().slice(0, 10)}.csv`)
    showNotification("Data exported to CSV successfully", "success")
  }

  // Define columns based on the selected preset
  const columns = useMemo(() => {
    let columnsList = []

    switch (columnPreset) {
      /* --------------------------------------------------
         Substitution Check Preset
         -------------------------------------------------- */
      case "substitutionCheck":
        columnsList = [
          { accessor: "ATC", title: "ATC", width: columnWidths["ATC"] || 120 },
          {
            accessor: "ATCRelatedIngredient",
            title: "ATC Related Ingredient",
            width: columnWidths["ATCRelatedIngredient"] || 180,
          },
          { accessor: "DrugName", title: "Brand Name", width: columnWidths["DrugName"] || 150 },
          { accessor: "Seq", title: "Seq", width: columnWidths["Seq"] || 60 },
          { accessor: "OtherIngredients", title: "All Ingredients", width: columnWidths["OtherIngredients"] || 180 },
          { accessor: "FormLNDI", title: "Form LNDI", width: columnWidths["FormLNDI"] || 120 },
          { accessor: "Form", title: "Dosage-form (clean)", width: columnWidths["Form"] || 150 },
          { accessor: "FormRaw", title: "Form Raw", width: columnWidths["FormRaw"] || 120 },
          { accessor: "RouteLNDI", title: "Route LNDI", width: columnWidths["RouteLNDI"] || 120 },
          { accessor: "Route", title: "Route (clean)", width: columnWidths["Route"] || 130 },
          { accessor: "RouteRaw", title: "Route Raw", width: columnWidths["RouteRaw"] || 120 },
          { accessor: "Parent", title: "Route Parent", width: columnWidths["Parent"] || 120 },
          { accessor: "DosageNumerator1", title: "DosageNumerator1", width: columnWidths["DosageNumerator1"] || 60 },
          { accessor: "DosageNumerator1Unit", title: "Num 1 Unit", width: columnWidths["DosageNumerator1Unit"] || 60 },
          { accessor: "DosageDenominator1", title: "Deno1", width: columnWidths["DosageDenominator1"] || 100 },
          {
            accessor: "DosageDenominator1Unit",
            title: "Deno 1 Unit",
            width: columnWidths["DosageDenominator1Unit"] || 60,
          },
          { accessor: "DosageNumerator2", title: "Num 2", width: columnWidths["DosageNumerator2"] || 100 },
          { accessor: "DosageNumerator2Unit", title: "Num 2 Unit", width: columnWidths["DosageNumerator2Unit"] || 60 },
          { accessor: "DosageDenominator2", title: "Deno 2", width: columnWidths["DosageDenominator2"] || 100 },
          {
            accessor: "DosageDenominator2Unit",
            title: "Deno 2 Unit",
            width: columnWidths["DosageDenominator2Unit"] || 60,
          },
          { accessor: "DosageDenominator3", title: "Deno 3", width: columnWidths["DosageDenominator3"] || 100 },
          {
            accessor: "DosageDenominator3Unit",
            title: "Deno 3 Unit",
            width: columnWidths["DosageDenominator3Unit"] || 60,
          },
          { accessor: "DFSequence", title: "D-F Sequence", width: columnWidths["DFSequence"] || 120 },
        ]
        break

      /* --------------------------------------------------
         ATC Check Preset
         -------------------------------------------------- */
      case "atcCheck":
        columnsList = [
          { accessor: "DrugName", title: "Brand Name", width: columnWidths["DrugName"] || 60 },
          { accessor: "ATC", title: "ATC", width: columnWidths["ATC"] || 100 },
          {
            accessor: "ATCRelatedIngredient",
            title: "ATC Related Ingredient",
            width: columnWidths["ATCRelatedIngredient"] || 180,
          },
          { accessor: "OtherIngredients", title: "All Ingredients", width: columnWidths["OtherIngredients"] || 180 },
          { accessor: "Seq", title: "Seq", width: columnWidths["Seq"] || 80 },
          { accessor: "Dosage", title: "Dosage (merged)", width: columnWidths["Dosage"] || 200 },
          { accessor: "Route", title: "Route (clean)", width: columnWidths["Route"] || 130 },
          { accessor: "RouteRaw", title: "Route Raw", width: columnWidths["RouteRaw"] || 120 },
        ]
        break

      /* --------------------------------------------------
         Presentation Check Preset
         -------------------------------------------------- */
      case "presentationCheck":
        columnsList = [
          { accessor: "DrugName", title: "Brand Name", width: columnWidths["DrugName"] || 60 },
          { accessor: "Seq", title: "Seq", width: columnWidths["Seq"] || 80 },
          { accessor: "FormLNDI", title: "Form LNDI", width: columnWidths["FormLNDI"] || 120 },
          { accessor: "Form", title: "Dosage-form (clean)", width: columnWidths["Form"] || 60 },
          { accessor: "FormRaw", title: "Form Raw", width: columnWidths["FormRaw"] || 120 },
          { accessor: "PresentationLNDI", title: "PresentationLNDI", width: columnWidths["PresentationLNDI"] || 60 },
          {
            accessor: "PresentationDescription",
            title: "Presentation Description",
            width: columnWidths["PresentationDescription"] || 180,
          },
          {
            accessor: "PresentationUnitQuantity1",
            title: "Unit Qtty 1",
            width: columnWidths["PresentationUnitQuantity1"] || 60,
          },
          {
            accessor: "PresentationUnitType1",
            title: "Unit Type 1",
            width: columnWidths["PresentationUnitType1"] || 60,
          },
          {
            accessor: "PresentationPackageQuantity1",
            title: "Package Qtty 1",
            width: columnWidths["PresentationPackageQuantity1"] || 60,
          },
          {
            accessor: "PresentationPackageType1",
            title: "Package Type 1",
            width: columnWidths["PresentationPackageType1"] || 100,
          },
          {
            accessor: "PresentationPackageQuantity2",
            title: "Package Qtty 2 (clean)",
            width: columnWidths["PresentationPackageQuantity2"] || 60,
          },
          {
            accessor: "PresentationPackageType2",
            title: "Package Type 2",
            width: columnWidths["PresentationPackageType2"] || 100,
          },
          {
            accessor: "PresentationUnitQuantity2",
            title: "Unit Qtty 2 (clean)",
            width: columnWidths["PresentationUnitQuantity2"] || 100,
          },
          {
            accessor: "PresentationUnitType2",
            title: "Unit Type 2 (clean)",
            width: columnWidths["PresentationUnitType2"] || 100,
          },
          {
            accessor: "PresentationPackageQuantity3",
            title: "Package Qtty 3",
            width: columnWidths["PresentationPackageQuantity3"] || 60,
          },
          {
            accessor: "PresentationPackageType3",
            title: "Package Type 3",
            width: columnWidths["PresentationPackageType3"] || 60,
          },
        ]
        break

      /* --------------------------------------------------
         Default Preset
         -------------------------------------------------- */
      default:
        columnsList = [
          { accessor: "DrugName", title: "DrugName", width: columnWidths["DrugName"] || 60 },
          { accessor: "MoPHCode", title: "MoPHCode", width: columnWidths["MoPHCode"] || 120 },
          { accessor: "DrugNameAR", title: "DrugNameAR", width: columnWidths["DrugNameAR"] || 60 },
          { accessor: "Seq", title: "Seq", width: columnWidths["Seq"] || 80 },
          { accessor: "ProductType", title: "ProductType", width: columnWidths["ProductType"] || 120 },
          { accessor: "ATC", title: "ATC", width: columnWidths["ATC"] || 100 },
          {
            accessor: "ATCRelatedIngredient",
            title: "ATC Related Ingredient",
            width: columnWidths["ATCRelatedIngredient"] || 180,
          },
          // Add more columns for the default preset as needed
          { accessor: "OtherIngredients", title: "All Ingredients", width: columnWidths["OtherIngredients"] || 180 },
          { accessor: "Dosage", title: "Dosage (merged)", width: columnWidths["Dosage"] || 200 },
          { accessor: "PresentationLNDI", title: "PresentationLNDI", width: columnWidths["PresentationLNDI"] || 60 },
          {
            accessor: "PresentationDescription",
            title: "Presentation Description",
            width: columnWidths["PresentationDescription"] || 180,
          },
          {
            accessor: "PresentationUnitQuantity1",
            title: "Unit Qtty 1",
            width: columnWidths["PresentationUnitQuantity1"] || 60,
          },
          {
            accessor: "PresentationUnitType1",
            title: "Unit Type 1",
            width: columnWidths["PresentationUnitType1"] || 60,
          },
          {
            accessor: "PresentationPackageQuantity1",
            title: "Package Qtty 1",
            width: columnWidths["PresentationPackageQuantity1"] || 60,
          },
          {
            accessor: "PresentationPackageType1",
            title: "Package Type 1",
            width: columnWidths["PresentationPackageType1"] || 100,
          },
          {
            accessor: "PresentationPackageQuantity2",
            title: "Package Qtty 2 (clean)",
            width: columnWidths["PresentationPackageQuantity2"] || 60,
          },
          {
            accessor: "PresentationPackageType2",
            title: "Package Type 2",
            width: columnWidths["PresentationPackageType2"] || 100,
          },
          {
            accessor: "PresentationUnitQuantity2",
            title: "Unit Qtty 2 (clean)",
            width: columnWidths["PresentationUnitQuantity2"] || 100,
          },
          {
            accessor: "PresentationUnitType2",
            title: "Unit Type 2 (clean)",
            width: columnWidths["PresentationUnitType2"] || 100,
          },
          {
            accessor: "PresentationPackageQuantity3",
            title: "Package Qtty 3",
            width: columnWidths["PresentationPackageQuantity3"] || 60,
          },
          {
            accessor: "PresentationPackageType3",
            title: "Package Type 3",
            width: columnWidths["PresentationPackageType3"] || 60,
          },
          { accessor: "Form", title: "Dosage-form (clean)", width: columnWidths["Form"] || 60 },
          { accessor: "FormRaw", title: "Form Raw", width: columnWidths["FormRaw"] || 120 },
          { accessor: "FormLNDI", title: "Form LNDI", width: columnWidths["FormLNDI"] || 120 },
          { accessor: "Parent", title: "Route Parent", width: columnWidths["Parent"] || 120 },
          { accessor: "Route", title: "Route (clean)", width: columnWidths["Route"] || 130 },
          { accessor: "RouteRaw", title: "Route Raw", width: columnWidths["RouteRaw"] || 120 },
          { accessor: "RouteLNDI", title: "Route LNDI", width: columnWidths["RouteLNDI"] || 120 },
          { accessor: "Parentaral", title: "Parentaral", width: columnWidths["Parentaral"] || 120 },
          { accessor: "Stratum", title: "Stratum", width: columnWidths["Stratum"] || 120 },
          { accessor: "Amount", title: "Amount", width: columnWidths["Amount"] || 60 },
          { accessor: "Agent", title: "Agent", width: columnWidths["Agent"] || 120 },
          { accessor: "Manufacturer", title: "Manufacturer", width: columnWidths["Manufacturer"] || 120 },
          { accessor: "Country", title: "Country", width: columnWidths["Country"] || 120 },
          {
            accessor: "RegistrationNumber",
            title: "RegistrationNumber",
            width: columnWidths["RegistrationNumber"] || 120,
          },
          { accessor: "Notes", title: "Notes", width: columnWidths["Notes"] || 120 },
          { accessor: "Description", title: "Description", width: columnWidths["Description"] || 120 },
          { accessor: "Indication", title: "Indication", width: columnWidths["Indication"] || 120 },
          { accessor: "Posology", title: "Posology", width: columnWidths["Posology"] || 120 },
          {
            accessor: "MethodOfAdministration",
            title: "MethodOfAdministration",
            width: columnWidths["MethodOfAdministration"] || 120,
          },
          {
            accessor: "Contraindications",
            title: "Contraindications",
            width: columnWidths["Contraindications"] || 120,
          },
          { accessor: "PrecautionForUse", title: "PrecautionForUse", width: columnWidths["PrecautionForUse"] || 120 },
          { accessor: "EffectOnFGN", title: "EffectOnFGN", width: columnWidths["EffectOnFGN"] || 120 },
          { accessor: "SideEffect", title: "SideEffect", width: columnWidths["SideEffect"] || 120 },
          { accessor: "Toxicity", title: "Toxicity", width: columnWidths["Toxicity"] || 120 },
          { accessor: "StorageCondition", title: "StorageCondition", width: columnWidths["StorageCondition"] || 120 },
          { accessor: "ShelfLife", title: "ShelfLife", width: columnWidths["ShelfLife"] || 120 },
          { accessor: "IngredientLabel", title: "IngredientLabel", width: columnWidths["IngredientLabel"] || 120 },
          { accessor: "ImagesPath", title: "ImagesPath", width: columnWidths["ImagesPath"] || 120 },
          { accessor: "ImageDefault", title: "ImageDefault", width: columnWidths["ImageDefault"] || 120 },
          {
            accessor: "InteractionIngredientName",
            title: "InteractionIngredientName",
            width: columnWidths["InteractionIngredientName"] || 120,
          },
          { accessor: "IsDouanes", title: "IsDouanes", width: columnWidths["IsDouanes"] || 120 },
          { accessor: "RegistrationDate", title: "RegistrationDate", width: columnWidths["RegistrationDate"] || 120 },
          { accessor: "PublicPrice", title: "PublicPrice", width: columnWidths["PublicPrice"] || 120 },
          { accessor: "SubsidyLabel", title: "SubsidyLabel", width: columnWidths["SubsidyLabel"] || 120 },
          {
            accessor: "SubsidyPercentage",
            title: "SubsidyPercentage",
            width: columnWidths["SubsidyPercentage"] || 120,
          },
          { accessor: "HospPricing", title: "HospPricing", width: columnWidths["HospPricing"] || 120 },
          { accessor: "Substitutable", title: "Substitutable", width: columnWidths["Substitutable"] || 120 },
          { accessor: "CreatedBy", title: "CreatedBy", width: columnWidths["CreatedBy"] || 120 },
          { accessor: "CreatedDate", title: "CreatedDate", width: columnWidths["CreatedDate"] || 120 },
          { accessor: "UpdatedBy", title: "UpdatedBy", width: columnWidths["UpdatedBy"] || 120 },
          { accessor: "UpdatedDate", title: "UpdatedDate", width: columnWidths["UpdatedDate"] || 120 },
          { accessor: "ReviewDate", title: "ReviewDate", width: columnWidths["ReviewDate"] || 120 },
          {
            accessor: "CargoShippingTerms",
            title: "CargoShippingTerms",
            width: columnWidths["CargoShippingTerms"] || 120,
          },
          { accessor: "NotMarketed", title: "NotMarketed", width: columnWidths["NotMarketed"] || 120 },
          { accessor: "PriceForeign", title: "PriceForeign", width: columnWidths["PriceForeign"] || 120 },
          { accessor: "CurrencyForeign", title: "CurrencyForeign", width: columnWidths["CurrencyForeign"] || 120 },
        ]
    }

    // Filter columns based on visibility settings
    return columnsList.filter((col) => settings.visibleColumns[col.accessor] !== false)
  }, [
    columnPreset,
    columnWidths,
    settings.visibleColumns,
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

  // Filter data based on global filter
  const filteredData = useMemo(() => {
    if (!globalFilter) return tableData

    return tableData.filter((row) => {
      return Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(globalFilter.toLowerCase()),
      )
    })
  }, [tableData, globalFilter])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredData.slice(start, end)
  }, [filteredData, page, pageSize])

  // Increase overscan for smoother virtualization
  const rowVirtualizer = useVirtualizer({
    count: paginatedData.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => settings.cellSize,
    overscan: 50, // Increased from 20 to 50 for smoother scrolling
  })

  // Get virtualized rows
  const virtualRows = settings.enableVirtualization
    ? rowVirtualizer.getVirtualItems()
    : paginatedData.map((_, index) => ({
        index,
        start: index * settings.cellSize,
        end: (index + 1) * settings.cellSize,
      }))

  const totalSize = settings.enableVirtualization
    ? rowVirtualizer.getTotalSize()
    : paginatedData.length * settings.cellSize

  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start || 0 : 0
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1].end || 0) : 0

  // Handle document-wide mouse up event to stop dragging
  useEffect(() => {
    const handleMouseUp = () => {
      handleCellMouseUp()
    }

    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  // Add a new component for the column visibility panel
  const ColumnVisibilityPanel = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [groupedColumns, setGroupedColumns] = useState<Record<string, any[]>>({})
    const { classes } = useStyles()

    // Group columns by category
    useEffect(() => {
      const groups: Record<string, any[]> = {
        "Basic Info": [],
        Dosage: [],
        "Form & Route": [],
        Presentation: [],
        Other: [],
      }

      columns.forEach((col) => {
        if (
          col.accessor.includes("Dosage") ||
          col.accessor.includes("Numerator") ||
          col.accessor.includes("Denominator")
        ) {
          groups["Dosage"].push(col)
        } else if (col.accessor.includes("Form") || col.accessor.includes("Route")) {
          groups["Form & Route"].push(col)
        } else if (col.accessor.includes("Presentation")) {
          groups["Presentation"].push(col)
        } else if (
          ["DrugName", "DrugNameAR", "ATC", "ATCRelatedIngredient", "OtherIngredients", "Seq", "ProductType"].includes(
            col.accessor,
          )
        ) {
          groups["Basic Info"].push(col)
        } else {
          groups["Other"].push(col)
        }
      })

      setGroupedColumns(groups)
    }, [columns])

    // Filter columns by search term
    const filteredColumns = useMemo(() => {
      if (!searchTerm) return columns

      return columns.filter(
        (col) =>
          col.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          col.accessor.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }, [columns, searchTerm])

    // Toggle all columns in a group
    const toggleGroup = (groupName: string, value: boolean) => {
      const newVisibility = { ...settings.visibleColumns }

      groupedColumns[groupName].forEach((col) => {
        newVisibility[col.accessor] = value
      })

      setSettings({
        ...settings,
        visibleColumns: newVisibility,
      })
    }

    return (
      <Box>
        <TextInput
          placeholder="Search columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<IconSearch size={16} />}
          mb="md"
        />

        {searchTerm ? (
          // Show search results
          <ScrollArea h={300}>
            {filteredColumns.map((column) => (
              <Box key={column.accessor} mb="xs">
                <Checkbox
                  label={column.title}
                  checked={settings.visibleColumns[column.accessor] !== false}
                  onChange={() => toggleColumnVisibility(column.accessor)}
                />
              </Box>
            ))}
          </ScrollArea>
        ) : (
          // Show grouped columns
          <Tabs defaultValue="Basic Info">
            <Tabs.List>
              {Object.keys(groupedColumns).map((group) => (
                <Tabs.Tab key={group} value={group}>
                  {group}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {Object.entries(groupedColumns).map(([group, cols]) => (
              <Tabs.Panel key={group} value={group} pt="xs">
                <Group position="apart" mb="sm">
                  <Text size="sm">Toggle all in this group:</Text>
                  <Group spacing="xs">
                    <Button compact size="xs" onClick={() => toggleGroup(group, true)}>
                      Show All
                    </Button>
                    <Button compact size="xs" onClick={() => toggleGroup(group, false)}>
                      Hide All
                    </Button>
                  </Group>
                </Group>

                <ScrollArea h={250}>
                  {cols.map((column) => (
                    <Box key={column.accessor} mb="xs">
                      <Checkbox
                        label={column.title}
                        checked={settings.visibleColumns[column.accessor] !== false}
                        onChange={() => toggleColumnVisibility(column.accessor)}
                      />
                    </Box>
                  ))}
                </ScrollArea>
              </Tabs.Panel>
            ))}
          </Tabs>
        )}
      </Box>
    )
  }

  // Add a Save Results Modal component
  const SaveResultsModal = () => {
    return (
      <Modal
        opened={showSaveResultsModal}
        onClose={() => setShowSaveResultsModal(false)}
        title="Save Results"
        size="lg"
      >
        <ScrollArea h={400}>
          <Table>
            <thead>
              <tr>
                <th>Row ID</th>
                <th>Field</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {saveResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.rowId}</td>
                  <td>{result.columnId}</td>
                  <td>{result.success ? <Badge color="green">Success</Badge> : <Badge color="red">Failed</Badge>}</td>
                  <td>{result.message}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>

        <Group position="right" mt="md">
          <Button onClick={() => setShowSaveResultsModal(false)}>Close</Button>
        </Group>
      </Modal>
    )
  }

  // Cell selection handler
  const handleCellClick = (rowId: string, columnId: string, ctrlKey: boolean) => {
    const cellKey = `${rowId}-${columnId}`

    if (ctrlKey) {
      // Multi-select mode
      setSelectedCells((prev) => {
        const newSelection = new Set(prev)
        if (newSelection.has(cellKey)) {
          newSelection.delete(cellKey)
        } else {
          newSelection.add(cellKey)
        }
        return newSelection
      })
    } else {
      // Single select mode
      setSelectedCells(new Set([cellKey]))
    }
  }

  // Row selection handler
  const handleRowSelect = (rowId: string, ctrlKey: boolean, shiftKey: boolean) => {
    if (ctrlKey) {
      // Toggle selection of this row
      setSelectedRows((prev) => {
        const newSelection = new Set(prev)
        if (newSelection.has(rowId)) {
          newSelection.delete(rowId)
        } else {
          newSelection.add(rowId)
        }
        return newSelection
      })
      setLastSelectedRow(rowId)
    } else if (shiftKey && lastSelectedRow) {
      // Range selection
      const allRowIds = paginatedData.map((row) => row.DrugID)
      const startIdx = allRowIds.indexOf(lastSelectedRow)
      const endIdx = allRowIds.indexOf(rowId)

      if (startIdx !== -1 && endIdx !== -1) {
        const start = Math.min(startIdx, endIdx)
        const end = Math.max(startIdx, endIdx)
        const rangeIds = allRowIds.slice(start, end + 1)

        setSelectedRows(new Set(rangeIds))
      }
    } else {
      // Single selection
      setSelectedRows(new Set([rowId]))
      setLastSelectedRow(rowId)
    }
  }

  // Clear all selections
  const clearSelections = () => {
    setSelectedRows(new Set())
    setSelectedCells(new Set())
    setLastSelectedRow(null)
  }

  // Delete selected rows
  const deleteSelectedRows = async () => {
    if (selectedRows.size === 0) return

    if (window.confirm(`Are you sure you want to delete ${selectedRows.size} selected drug(s)?`)) {
      setIsLoading(true)

      try {
        // Delete each selected row
        const promises = Array.from(selectedRows).map((rowId) =>
          axios.delete(`https://apiv2.medleb.org/drugs/delete/${rowId}`).catch((error) => {
            console.error(`Error deleting drug ${rowId}:`, error)
            return { error, rowId }
          }),
        )

        const results = await Promise.all(promises)
        const failedDeletes = results.filter((result) => "error" in result)

        // Update local data
        setTableData((prevData) => prevData.filter((drug) => !selectedRows.has(drug.DrugID)))
        setAllData((prevData) => prevData.filter((drug) => !selectedRows.has(drug.DrugID)))

        // Clear selection
        clearSelections()

        if (failedDeletes.length > 0) {
          showNotification(
            `Deleted ${selectedRows.size - failedDeletes.length} drugs, but ${failedDeletes.length} failed`,
            "info",
          )
        } else {
          showNotification(`Successfully deleted ${selectedRows.size} drugs`, "success")
        }
      } catch (error) {
        console.error("Error during batch delete:", error)
        showNotification("Error during batch delete operation", "error")
      } finally {
        setIsLoading(false)
      }
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

  // Add state for column visibility modal
  const [isColumnVisibilityModalOpen, setIsColumnVisibilityModalOpen] = useState(false)

  // Add temporary settings state and apply function
  const [tempSettings, setTempSettings] = useState<TableSettings>({ ...settings })

  // Reset temp settings when modal opens
  useEffect(() => {
    if (isSettingsModalOpen) {
      setTempSettings({ ...settings })
    }
  }, [isSettingsModalOpen, settings])

  // Function to apply settings
  const applySettings = () => {
    setSettings(tempSettings)
    setIsSettingsModalOpen(false)
    showNotification("Settings applied successfully", "success")
  }

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <Box className={cx(classes.tableContainer, isFullscreen && classes.fullscreenTable)}>
        <Box className={classes.controlsContainer}>
          <Group>
            <Text weight={500}>Column Preset:</Text>
            <Select
              value={columnPreset}
              onChange={(value) => setColumnPreset(value || "default")}
              data={[
                { value: "default", label: "Default" },
                { value: "substitutionCheck", label: "Substitution Check" },
                { value: "atcCheck", label: "ATC Check" },
                { value: "presentationCheck", label: "Presentation Check" },
              ]}
              style={{ width: 180 }}
            />

            <Modal
              opened={isColumnVisibilityModalOpen}
              onClose={() => setIsColumnVisibilityModalOpen(false)}
              title="Manage Columns"
              size="lg"
            >
              <ColumnVisibilityPanel />

              <Group position="right" mt="xl">
                <Button onClick={() => setIsColumnVisibilityModalOpen(false)}>Close</Button>
              </Group>
            </Modal>
          </Group>

          <Group>
            <Tooltip label="Settings">
              <Button variant="outline" onClick={() => setIsSettingsModalOpen(true)}>
                <IconSettings size={16} />
              </Button>
            </Tooltip>

            <Tooltip label="Undo last change (Ctrl+Z)">
              <Button
                variant="outline"
                leftIcon={<IconArrowBackUp size={16} />}
                onClick={handleUndo}
                disabled={historyIndex <= 0}
              >
                Undo
              </Button>
            </Tooltip>

            <Tooltip label="Redo last change (Ctrl+Y)">
              <Button
                variant="outline"
                leftIcon={<IconArrowForwardUp size={16} />}
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                Redo
              </Button>
            </Tooltip>

            <Tooltip label="Save Table State">
              <Button variant="outline" onClick={saveTableState} disabled={!hasUnsavedChanges}>
                Save
              </Button>
            </Tooltip>

            <Tooltip label="Export to CSV">
              <Button variant="outline" leftIcon={<IconDownload size={16} />} onClick={handleExportCSV}>
                Export
              </Button>
            </Tooltip>

            <Tooltip label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
              </Button>
            </Tooltip>

            <Button leftIcon={<IconPlus size={16} />} onClick={() => setIsAddModalOpen(true)}>
              Add Drug
            </Button>

            <Button
  leftIcon={<IconDownload size={16} />}
  onClick={() => exportToExcel(tableData)}

>
  Export to Excel
</Button>
          </Group>
        </Box>

        <Group position="apart" mb="md">
          <TextInput
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            icon={<IconSearch size={16} />}
            className={classes.searchInput}
          />

          {selectedRows.size > 0 && (
            <Group>
              <Badge size="lg" color="blue">
                {selectedRows.size} row(s) selected
              </Badge>
              <Button variant="outline" color="red" leftIcon={<IconTrash size={16} />} onClick={deleteSelectedRows}>
                Delete Selected
              </Button>
              <Button variant="outline" onClick={clearSelections}>
                Clear Selection
              </Button>
            </Group>
          )}
        </Group>

        <Text className={classes.tipText}>
          Tip: Click and drag a cell value to fill other cells with the same value. Use Ctrl+Click for multiple
          selection.
        </Text>

        <Paper className={classes.tableWrapper} ref={tableContainerRef}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <Loader size="lg" />
              <Text ml="md">Loading data...</Text>
            </Box>
          ) : (
            <Table striped highlightOnHover withBorder withColumnBorders>
              <thead className={classes.tableHeader}>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th style={{ width: 40 }}>
                    <Checkbox
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setSelectedRows(new Set(paginatedData.map((row) => row.DrugID)))
                        } else {
                          setSelectedRows(new Set())
                        }
                      }}
                      checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                      indeterminate={selectedRows.size > 0 && selectedRows.size < paginatedData.length}
                    />
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.accessor}
                      style={{ width: column.width, position: "relative" }}
                      className={classes.tableHeaderCell}
                    >
                      <Group position="apart" noWrap>
                        <Text weight={500}>{column.title}</Text>
                        <ActionIcon size="xs" variant="subtle">
                          <IconArrowsUpDown size={14} />
                        </ActionIcon>
                      </Group>
                      <ColumnResizeHandle column={column} onResize={handleColumnResize} />
                    </th>
                  ))}
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 3} style={{ textAlign: "center", padding: "2rem" }}>
                      No results found.
                    </td>
                  </tr>
                ) : (
                  <>
                    {paddingTop > 0 && (
                      <tr>
                        <td style={{ height: `${paddingTop}px` }} colSpan={columns.length + 3} />
                      </tr>
                    )}
                    {virtualRows.map((virtualRow) => {
                      const row = paginatedData[virtualRow.index]
                      const isSelected = selectedRows.has(row.DrugID)
                      const rowNumber = (page - 1) * pageSize + virtualRow.index + 1

                      return (
                        <tr
                          key={row.DrugID}
                          className={cx(
                            isSelected ? classes.tableRowSelected : null,
                            virtualRow.index % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd,
                            classes[
                              `tableRow${settings.rowColorScheme.charAt(0).toUpperCase() + settings.rowColorScheme.slice(1)}` as keyof typeof classes
                            ],
                          )}
                        >
                          <td className={classes.cell}>
                            <Text align="center">{rowNumber}</Text>
                          </td>
                          <td>
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) => {
                                if ((e.nativeEvent as MouseEvent).shiftKey) {
                                  handleRowSelect(row.DrugID, false, true)
                                } else {
                                  handleRowSelect(row.DrugID, (e.nativeEvent as MouseEvent).ctrlKey, false)
                                }
                              }}
                            />
                          </td>
                          {columns.map((column) => (
                            <td key={`${row.DrugID}-${column.accessor}`}>
                              <Cell
                                value={row[column.accessor]}
                                rowId={row.DrugID}
                                column={column.accessor}
                                isDragging={isDragging}
                                dragValue={dragValue}
                                dragColumnId={dragColumnId}
                                cellStatus={changedCells[`${row.DrugID}-${column.accessor}`] || null}
                                isSelected={selectedCells.has(`${row.DrugID}-${column.accessor}`)}
                                onMouseDown={handleCellMouseDown}
                                onMouseEnter={() => handleCellMouseEnter(row.DrugID)}
                                onClick={handleCellClick}
                              />
                            </td>
                          ))}
                          <td>
                            <Menu position="bottom-end" withinPortal>
                              <Menu.Target>
                                <ActionIcon>
                                  <IconChevronDown size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item onClick={() => console.log("Edit row", row)}>Edit</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item color="red" onClick={() => handleDeleteRow(row.DrugID)}>
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </td>
                        </tr>
                      )
                    })}
                    {paddingBottom > 0 && (
                      <tr>
                        <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length + 3} />
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </Table>
          )}
        </Paper>

        <Box className={classes.paginationContainer}>
          <Text size="sm" color="dimmed">
            {filteredData.length} row(s) total
          </Text>
          <Group spacing="xs">
            <Text size="sm">Rows per page:</Text>
            <Select
              value={pageSize.toString()}
              onChange={(value) => {
                setPageSize(Number(value))
                setPage(1) // Reset to first page when changing page size
              }}
              data={[
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "50", label: "50" },
                { value: "100", label: "100" },
                { value: "500", label: "500" },
                { value: "1000", label: "1000" },
                { value: "2000", label: "2000" },
                { value: "5000", label: "5000" },
              ]}
              style={{ width: 80 }}
            />
            <Group spacing={5}>
              <Button variant="subtle" compact disabled={page === 1} onClick={() => setPage(1)}>
                First
              </Button>
              <Button variant="subtle" compact disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
              </Button>
              <Text size="sm">
                Page {page} of {Math.max(1, Math.ceil(filteredData.length / pageSize))}
              </Text>
              <Button
                variant="subtle"
                compact
                disabled={page >= Math.ceil(filteredData.length / pageSize)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
              <Button
                variant="subtle"
                compact
                disabled={page >= Math.ceil(filteredData.length / pageSize)}
                onClick={() => setPage(Math.ceil(filteredData.length / pageSize))}
              >
                Last
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Settings Modal */}
        <Modal
          opened={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          title="Table Settings"
          size="lg"
          className={classes.settingsModal}
        >
          <Tabs defaultValue="appearance">
            <Tabs.List>
              <Tabs.Tab value="appearance" icon={<IconEye size={14} />}>
                Appearance
              </Tabs.Tab>
              <Tabs.Tab value="performance" icon={<IconAdjustments size={14} />}>
                Performance
              </Tabs.Tab>
              <Tabs.Tab value="behavior" icon={<IconSettings size={14} />}>
                Behavior
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="appearance" pt="xs">
              <Box mt="md">
                <Text weight={500} mb={5}>
                  Row Color Scheme
                </Text>
                <Group spacing="md">
                  {["default", "blue", "green", "teal", "cyan", "indigo", "gray"].map((color) => (
                    <Box
                      key={color}
                      onClick={() => setTempSettings((prev) => ({ ...prev, rowColorScheme: color as any }))}
                      sx={(theme) => ({
                        cursor: "pointer",
                        padding: theme.spacing.xs,
                        borderRadius: theme.radius.sm,
                        border: `2px solid ${tempSettings.rowColorScheme === color ? theme.colors.blue[5] : "transparent"}`,
                      })}
                    >
                      <ColorSwatch
                        color={color === "default" ? "#f8f9fa" : `var(--mantine-color-${color}-0)`}
                        size={30}
                      />
                      <Text align="center" size="xs" mt={5} transform="capitalize">
                        {color}
                      </Text>
                    </Box>
                  ))}
                </Group>
              </Box>

              <Box mt="xl">
                <Text weight={500} mb={5}>
                  Cell Size
                </Text>
                <Slider
                  min={25}
                  max={60}
                  step={5}
                  value={tempSettings.cellSize}
                  onChange={(value) => setTempSettings((prev) => ({ ...prev, cellSize: value }))}
                  marks={[
                    { value: 25, label: "Small" },
                    { value: 35, label: "Medium" },
                    { value: 45, label: "Large" },
                    { value: 60, label: "XL" },
                  ]}
                  label={(value) => `${value}px`}
                  styles={{ markLabel: { display: "block" } }}
                />
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="performance" pt="xs">
              <Box mt="md">
                <Group position="apart">
                  <Text weight={500}>Enable Virtualization</Text>
                  <Switch
                    checked={tempSettings.enableVirtualization}
                    onChange={(e) =>
                      setTempSettings((prev) => ({ ...prev, enableVirtualization: e.currentTarget.checked }))
                    }
                  />
                </Group>
                <Text size="xs" color="dimmed" mt={5}>
                  Virtualization improves performance with large datasets but may cause some visual glitches.
                </Text>
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="behavior" pt="xs">
              <Box mt="md">
                <Group position="apart">
                  <Text weight={500}>Confirm Before Refresh</Text>
                  <Switch
                    checked={tempSettings.confirmBeforeRefresh}
                    onChange={(e) =>
                      setTempSettings((prev) => ({ ...prev, confirmBeforeRefresh: e.currentTarget.checked }))
                    }
                  />
                </Group>
                <Text size="xs" color="dimmed" mt={5}>
                  Show a confirmation dialog when refreshing the page with unsaved changes.
                </Text>
              </Box>

              <Divider my="md" />

              <Box>
                <Group position="apart">
                  <Text weight={500}>Auto-Save Table State</Text>
                  <Switch
                    checked={tempSettings.autoSaveState}
                    onChange={(e) => setTempSettings((prev) => ({ ...prev, autoSaveState: e.currentTarget.checked }))}
                  />
                </Group>
                <Text size="xs" color="dimmed" mt={5}>
                  Automatically save table state every 30 seconds.
                </Text>
              </Box>
            </Tabs.Panel>
          </Tabs>

          <Group position="right" mt="xl">
            <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applySettings}>Apply Settings</Button>
          </Group>
        </Modal>

        {/* Add Drug Modal */}
        <AddDrugModal
          opened={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddSuccess={handleAddSuccess}
          atcOptions={atcOptions}
          dosageNumerator1UnitOptions={dosageNumerator1UnitOptions}
          dosageDenominator1UnitOptions={dosageDenominator1UnitOptions}
          formOptions={formOptions}
          routeOptions={routeOptions}
        />

        {/* Notification */}
        {notification && (
          <Notification
            title={
              notification.type === "success" ? "Success" : notification.type === "error" ? "Error" : "Information"
            }
            color={notification.type === "success" ? "green" : notification.type === "error" ? "red" : "blue"}
            icon={
              notification.type === "success" ? (
                <IconCheck size={18} />
              ) : notification.type === "error" ? (
                <IconX size={18} />
              ) : (
                <IconAlertCircle size={18} />
              )
            }
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Notification>
        )}

        <SaveResultsModal />

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

          /* Smooth scrolling */
          * {
            scroll-behavior: smooth;
          }

          /* Optimize rendering */
          .mantine-Table-root {
            will-change: transform;
            transform: translateZ(0);
          }

          /* Reduce layout shifts */
          .mantine-Table-root td, .mantine-Table-root th {
            box-sizing: border-box;
            contain: content;
          }
        `}</style>
      </Box>
    </MantineProvider>
  )
}

export default DrugTable

