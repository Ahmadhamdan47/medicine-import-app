/* eslint-disable react/prop-types */
 
import React, { useState, useContext, createContext } from 'react';
// Create context
const DrugDocumentsContext = createContext();

// Context Provider Component
export const DrugDocumentsProvider = ({ children, handleImageUpload }) => {
    const maxNumber = 1;
    const initialImagesList = Array.from({ length: 12 }, () => []);

    const [drugImagesList, setImagesList] = useState(initialImagesList);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [imageToRemoveIndex, setImageToRemoveIndex] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

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

    const uploadImages = async () => {
        try {
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

    // const uploadImages = async () => {
    //     try {
    //         setLoading(true);

    //         const formData = new FormData();
    //         const newUploadedImages = [];

    //         drugImagesList.forEach((drugImages) => {
    //             drugImages.forEach((image) => {
    //                 formData.append('images', image.file);
    //                 newUploadedImages.push({
    //                     imageUrl: image.data_url,
    //                 });
    //             });
    //         });

    //         // Use axios to post the images to your backend
    //         const response = await axios.post('http://1.1.1.250:3500/upload', formData);

    //         if (response.data) {
    //             setSuccess(true);
    //             setUploadSuccess(true); // Set the state to indicate successful upload
    //             handleImageUpload(newUploadedImages); // Notify the parent component about the uploaded images
    //             console.log('Images uploaded successfully');
    //         }
    //     } catch (error) {
    //         // console.error("Error uploading images", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const contextValue = {
        drugImagesList,
        loading,
        success,
        selectedImage,
        setSelectedImage,
        confirmationModalOpen,
        imageToRemoveIndex,
        setImageToRemoveIndex,
        onChange,
        openImageModal,
        closeImageModal,
        uploadImages,
        maxNumber,
        uploadSuccess,
        setImagesList,
        setLoading,
        setSuccess,
        setConfirmationModalOpen,
        setUploadSuccess,
    };

    return (
        <DrugDocumentsContext.Provider value={contextValue}>{children}</DrugDocumentsContext.Provider>
    );
};

// Custom hook to consume the context
export const useDrugDocumentsContext = () => useContext(DrugDocumentsContext);
