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
      const response = await axios.post(`/drugs/upload/${drugID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const newImagePath = response.data.imagePath;
      
      // Get current images from state
      const currentDrug = tableData.find(drug => drug.DrugID === drugID);
      const currentImages = currentDrug?.ImagePath === 'No Image' ? '' : currentDrug?.ImagePath || '';
      
      let updatedImagePath: string;
      if (currentImages.includes('drug.jpg') || currentImages === 'drug.jpg') {
        // Replace drug.jpg with new image
        const imageArray = currentImages.split(',').map((path: string) => path.trim());
        const filteredImages = imageArray.filter((path: string) => path !== 'drug.jpg');
        updatedImagePath = filteredImages.length > 0 
          ? `${filteredImages.join(',')},${newImagePath}`
          : newImagePath;
      } else {
        // Add to existing images
        updatedImagePath = currentImages 
          ? `${currentImages},${newImagePath}`
          : newImagePath;
      }

      // Update backend with complete image path list
      await axios.put(`/drugs/${drugID}/images`, {
        imagePath: updatedImagePath
      });
  
      // Update the table data locally
      setTableData((prevData) =>
        prevData.map((drug) => {
          if (drug.DrugID === drugID) {
            return { ...drug, ImagePath: updatedImagePath };
          }
          return drug;
        })
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteImage = async (drugID: number, imageToDelete: string) => {
    try {
      const currentDrug = tableData.find(drug => drug.DrugID === drugID);
      const currentImages = currentDrug?.ImagePath || '';
      
      const imageArray = currentImages.split(',').map((path: string) => path.trim());
      const updatedImageArray = imageArray.filter((path: string) => path !== imageToDelete);
      const updatedImagePath = updatedImageArray.length > 0 ? updatedImageArray.join(',') : 'No Image';

      // Update backend
      await axios.put(`/drugs/${drugID}/images`, {
        imagePath: updatedImagePath
      });

      // Update local state
      setTableData((prevData) =>
        prevData.map((drug) => {
          if (drug.DrugID === drugID) {
            return { ...drug, ImagePath: updatedImagePath };
          }
          return drug;
        })
      );
    } catch (error) {
      console.error('Error deleting image:', error);
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
