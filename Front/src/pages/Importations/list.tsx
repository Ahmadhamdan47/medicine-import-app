import React, { useContext, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { RFIContext } from "../../Contexts/RFIProvider";
import { RFIEdit } from "./edit"; 



export const RFIList = () => {
  const { rfiData, setRfiData, handleEdit, handleShow, handleDelete, fetchRFIs } = useContext(RFIContext);
  const [selectedRFI, setSelectedRFI] = useState(null); 

  // useEffect(() => {
  //   fetchRFIs();
  // }, [fetchRFIs]);

  const columns = React.useMemo<GridColDef[]>(() => [
    {
      field: "rfiid",
      headerName: "ID",
      type: "number",
      minWidth: 50,
    },
    {
      field: "drugid",
      flex: 1,
      headerName: "Drug ID",
      minWidth: 200,
    },
    {
      field: "quantity",
      flex: 1,
      headerName: "Quantity",
      minWidth: 250,
    },
    {
      field: "offertype",
      flex: 1,
      headerName: "Offer Type",
      minWidth: 300,
    },
    {
      field: "notes",
      flex: 1,
      headerName: "Notes",
      minWidth: 250,
      renderCell: function render({ value }) {
        if (!value) return "-";
        return <div>{value?.slice(0, 80) + "..." || ""}</div>;
      },
    },
    {
      field: "status",
      flex: 1,
      headerName: "Status",
      minWidth: 200,
    },
    {
      field: "created_at",
      flex: 1,
      headerName: "Created at",
      minWidth: 250,
      renderCell: function render({ value }) {
        return <div>{value}</div>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: function render({ row }) {
        return (
          <>
            <button onClick={() => handleEditClick(row.id)}>Edit</button>
            <button onClick={() => handleShow(row.id)}>Show</button>
            <button onClick={() => handleDelete(row.id)}>Delete</button>
          </>
        );
      },
      align: "center",
      headerAlign: "center",
      minWidth: 80,
    },
  ], [handleDelete, handleShow]); // Add handleDelete and handleShow to dependencies array

  // Function to handle editing an RFI
  const handleEditClick = (id) => {
    // Find the selected RFI from the list of RFIs
    const selected = rfiData.find((rfi) => rfi.id === id);
    setSelectedRFI(selected); // Set the selected RFI in state
  };

  // Function to handle closing the edit form
  const handleCloseEdit = () => {
    setSelectedRFI(null); // Clear the selected RFI from state
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rfiData} columns={columns} autoHeight />
      {/* Render the RFIEdit component if a selected RFI exists */}
      {selectedRFI && (
        <RFIEdit initialValues={selectedRFI} onClose={handleCloseEdit} />
      )}
    </div>
  );
};
