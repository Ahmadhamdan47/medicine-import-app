/* eslint-disable react/prop-types */
 
import React, { useState, useContext, createContext } from 'react';

// Create Context
const DrugImageContext = createContext();

// Provider Component
export const DrugImageProvider = ({ children, handleImageUpload }) => {
  const [drugImagesList, setImagesList] = useState(Array(6).fill([]));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [imageToRemoveIndex, setImageToRemoveIndex] = useState(null);

  const maxNumber = 1;

  const onChange = (drugImageList, index) => {
    if (drugImageList.length > maxNumber) {
      setConfirmationModalOpen(true);
      setImageToRemoveIndex(null);
      setSelectedImage(null);
      return;
    }

    setImagesList((prevImagesList) => {
      const newImagesList = [...prevImagesList];
      newImagesList[index] = drugImageList;
      return newImagesList;
    });
  };

  const openImageModal = (index) => {
    setSelectedImage(drugImagesList[index][0]?.data_url);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const uploadImages = async (event) => {
    try {
      event.preventDefault(); // Prevent default form submission behavior

      setLoading(true);

      // Create an array to store image URLs
      const newUploadedImages = [];

      drugImagesList.forEach((drugImages) => {
        drugImages.forEach((image) => {
          // Save image data to local storage
          localStorage.setItem(`image_${new Date().getTime()}`, image.data_url);
          // Push image URL to the array
          newUploadedImages.push({
            imageUrl: image.data_url,
          });
        });
      });

      // Set upload success to true
      setUploadSuccess(true);

      // Notify the parent component about the uploaded images if needed
      handleImageUpload(newUploadedImages);

      // Log success message
      console.log('Images uploaded successfully to local storage');
    } catch (error) {
      console.error('Error uploading images', error);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  // Context value
  const value = {
    drugImagesList,
    loading,
    success,
    setSuccess,
    selectedImage,
    setSelectedImage,
    confirmationModalOpen,
    imageToRemoveIndex,
    setImageToRemoveIndex,
    onChange,
    openImageModal,
    closeImageModal,
    uploadImages,
    uploadSuccess,
    setUploadSuccess,
  };

  return <DrugImageContext.Provider value={value}>{children}</DrugImageContext.Provider>;
};

// Custom Hook to consume context
export const useDrugImageContext = () => useContext(DrugImageContext);
