import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; 
import {
  Box,
  Button,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import { RFIContext } from "../../Contexts/RFIProvider";
import { orderStatus } from "./makeData";

export const RFICreate = ({ control, errors }) => {
  const { rfiData, createRFI, handleDelete, handleEdit } = useContext(RFIContext);
  const [validationErrors, setValidationErrors] = useState({});
  const [editedOrders, setEditedOrders] = useState({});
  const [isUpdatingOrders, setIsUpdatingOrders] = useState(false); 

  const columns = useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "id",
        enableEditing: false,
        size: 100,
      },
      {
        id: "drugid",
        accessorKey: "drugid",
        header: "Drug Name",
        render: ({ row, column }) => (
          <Controller
            name="drugid"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                getOptionLabel={(option) => option.drugname || ""}
                isOptionEqualToValue={(option, value) => option.drugid === value?.drugid}
                onChange={(event, value) => {
                  field.onChange(value ? value.drugid : null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Drug Name"
                    margin="normal"
                    variant="outlined"
                    error={!!errors.drugid}
                    helperText={errors.drugid?.message}
                    required
                  />
                )}
              />
            )}
          />
        ),
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantity",
        muiEditTextFieldProps: {
          type: "number",
        },
      },
      {
        accessorKey: "offertype",
        header: "Offer Type",
        muiEditTextFieldProps: {
          type: "text",
        },
      },
      {
        id: "notes",
        accessorKey: "notes",
        header: "Notes",
        muiEditTextFieldProps: {
          type: "text",
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        editVariant: "select",
        editSelectOptions: orderStatus,
        muiEditTextFieldProps: {
          select: true,
        },
      },
    ],
    [control, errors]
  );

  // CREATE action
  const handleCreateOrder = async ({ values, table }) => {
    try {
      setIsUpdatingOrders(true); // Set isUpdatingOrders to true when saving
      await createRFI(values);
      table.setCreatingRow(null);
      setIsUpdatingOrders(false); // Set isUpdatingOrders to false after saving
    } catch (error) {
      console.error("Error creating order:", error);
      setIsUpdatingOrders(false); // Make sure to set isUpdatingOrders to false in case of error
    }
  };

  // UPDATE action
  const handleSaveOrders = async () => {
    try {
      setIsUpdatingOrders(true); // Set isUpdatingOrders to true when saving
      // Implement the logic to handle updating orders using the editedOrders state
      setIsUpdatingOrders(false); // Set isUpdatingOrders to false after saving
    } catch (error) {
      console.error("Error saving orders:", error);
      setIsUpdatingOrders(false); // Make sure to set isUpdatingOrders to false in case of error
    }
  };

  // DELETE action
  const openDeleteConfirmModal = async (row) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setIsUpdatingOrders(true); // Set isUpdatingOrders to true when saving
        await handleDelete(row.id);
        setIsUpdatingOrders(false); // Set isUpdatingOrders to false after saving
      } catch (error) {
        console.error("Error deleting order:", error);
        setIsUpdatingOrders(false); // Make sure to set isUpdatingOrders to false in case of error
      }
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: rfiData,
    createDisplayMode: "row",
    editDisplayMode: "modal",
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton color="primary" onClick={() => handleEdit(row.id)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),



    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveOrders}
          disabled={
            Object.keys(editedOrders).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {isUpdatingOrders ? <CircularProgress size={25} /> : "Save"}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )}
      </Box>
    ),




    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Order
      </Button>
    ),
  });

  return (
    <MaterialReactTable
      table={table}
      control={control}
      errors={errors}
    />
  );
};

export default RFICreate;
