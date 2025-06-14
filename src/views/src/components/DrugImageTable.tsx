// src/components/DrugImageTable.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Button } from '@mantine/core';

const DrugImageTable: React.FC = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/drugs/all'); // Adjust endpoint to your backend API
      const { drugs } = response.data;

      const formattedData = drugs.map((drug: any) => ({
        DrugID: drug.DrugID || 'N/A',
        DrugName: drug.DrugName || 'N/A',
        Dosage: drug.Dosage || '',
        DrugNameWithDosage: `${drug.DrugName || 'N/A'}${drug.Dosage ? ` - ${drug.Dosage}` : ''}`,
        ImagePath: drug.ImagesPath || 'No Image',
      }));

      setTableData(formattedData);
    } catch (error) {
      console.error('Error fetching drugs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async (drugID: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 1️⃣  Upload the file – the API responds with its relative path
      const { data } = await axios.post(`/drugs/upload/${drugID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newImagePath: string = data.imagePath;            // e.g. "17497-front.png"

      // 2️⃣  Get the *freshest* copy of this row from state
      setTableData(prev => {
        const next = prev.map(drug => {
          if (drug.DrugID !== drugID) return drug;

          // Current CSV (if any) – treat “No Image” or empty the same
          const currentCSV = drug.ImagePath === 'No Image' ? '' : drug.ImagePath;
          const appendedCSV = currentCSV
            ? `${currentCSV},${newImagePath}`
            : newImagePath;

          // 3️⃣  Persist the full CSV back to the DB
          axios.put(`/drugs/${drugID}/images`, {
            ImagesPath: appendedCSV,          // 🟢 use correct column name
          }).catch(console.error);

          // 4️⃣  Optimistically update UI
          return { ...drug, ImagePath: appendedCSV };
        });

        return next;
      });
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  const handleDeleteImage = async (drugID: number, imageToDelete: string) => {
    setTableData(prev => {
      const next = prev.map(drug => {
        if (drug.DrugID !== drugID) return drug;

        const csv          = drug.ImagePath === 'No Image' ? '' : drug.ImagePath;
        const newArray     = csv.split(',').filter((p: string) => p.trim() !== imageToDelete);
        const updatedCSV   = newArray.length ? newArray.join(',') : 'No Image';

        // Persist change (fire & forget to keep UI snappy)
        axios.put(`/drugs/${drugID}/images`, { ImagesPath: updatedCSV })
             .catch(console.error);

        return { ...drug, ImagePath: updatedCSV };
      });

      return next;
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>, drugID: number) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadImage(drugID, file);
    }
  };

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { 
        accessorKey: 'DrugNameWithDosage', 
        header: 'Drug Name + Dosage', 
        size: 200,
        enableGlobalFilter: true,
      },
      {
        accessorKey: 'ImagePath',
        header: 'Image Path',
        size: 300,
        Cell: ({ cell, row }) => {
          const imagePath = cell.getValue<string>();
          const drugID = row.original.DrugID;
          
          if (imagePath === 'No Image') {
            return <span>No Image</span>;
          }
          
          // Split by comma and create links for each image
          const imagePathArray = imagePath.split(',').map(path => path.trim());
          return (
            <div>
              {imagePathArray.map((path, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <a href={`/img/${path}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: '8px' }}>
                    {path}
                  </a>
                  <Button
                    size="xs"
                    color="red"
                    variant="outline"
                    onClick={() => handleDeleteImage(drugID, path)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 200,
        Cell: ({ row }) => {
          const drugID = row.original.DrugID;
          return (
            <div>
              <input
                type="file"
                accept="image/*"
                id={`upload-${drugID}`}
                style={{ display: 'none' }}
                onChange={(e) => handleFileInputChange(e, drugID)}
              />
              <label htmlFor={`upload-${drugID}`}>
                <Button component="span" color="blue">
                  Upload Image
                </Button>
              </label>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: tableData,
    state: {
      isLoading,
    },
    enableColumnResizing: true,
    enableStickyHeader: true,
    enablePagination: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
  });

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '10px' }}>Drug Image Table</h2>
      <div style={{ flex: 1 }}>
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};

export default DrugImageTable;
