// src/components/DrugImageTable.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Button, Menu } from '@mantine/core';

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
      const response = await axios.post(`/drugs/upload/${drugID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const newImagePath = response.data.imagePath;
  
      // Update the table data locally - append to existing images
      setTableData((prevData) =>
        prevData.map((drug) => {
          if (drug.DrugID === drugID) {
            const currentImages = drug.ImagePath === 'No Image' ? '' : drug.ImagePath;
            const updatedImagePath = currentImages 
              ? `${currentImages},${newImagePath}`
              : newImagePath;
            return { ...drug, ImagePath: updatedImagePath };
          }
          return drug;
        })
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
        Cell: ({ cell }) => {
          const imagePath = cell.getValue<string>();
          if (imagePath === 'No Image') {
            return <span>No Image</span>;
          }
          
          // Split by comma and create links for each image
          const imagePathArray = imagePath.split(',').map(path => path.trim());
          return (
            <div>
              {imagePathArray.map((path, index) => (
                <span key={index}>
                  <a href={`/img/${path}`} target="_blank" rel="noopener noreferrer">
                    {path}
                  </a>
                  {index < imagePathArray.length - 1 && ', '}
                </span>
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
