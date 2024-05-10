/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
 
 
// ----------------------------------------------------------------------------
import React from 'react';
import ImageUploading from 'react-images-uploading';

import { useDrugImageContext } from '../../../Contexts/DrugImagesContext';

const DrugImages = (props) => {
  const { formDataStep13, handleInputChange } = props;
  const {
    drugImagesList,
    loading,
    success,
    uploadSuccess,
    selectedImage,
    setImageToRemoveIndex,
    onChange,
    openImageModal,
    closeImageModal,
    uploadImages,
  } = useDrugImageContext();

  const labels = ['Front Side', 'Back Side', 'Right Side', 'Left side', 'Top side', 'Down side'];

  return (
    <div className="image-uploader-cont flex flex-col justify-items-center items-center text-gray-700 dark:text-white-text">
      <h1 className="py-6 text-center text-xl sm:py-10 sm:text-xl ">Medicine Images</h1>
      <div className="grid  sm:w-[50em] grid-cols-2 justify-items-center gap-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
        {drugImagesList.map((drugImages, index) => (
          <div key={index} className="flex flex-col gap-4 items-center">
            <ImageUploading
              value={drugImages}
              onChange={(drugImageList) => onChange(drugImageList, index)}
              maxNumber={1} // maxNumber is defined here
              dataURLKey="data_url"
              formDataStep13={formDataStep13}
              handleInputChange={handleInputChange}
            >
              {({ onImageUpload, isDragging, dragProps, onImageRemove }) => (
                <div className="uploader-container h-32 w-32 gap-10 rounded-xl border-2 border-dotted p-2 pt-4 text-lg text-gray-900 border-[#727272c4] dark:border-[#474747] dark:text-gray-400 sm:h-40 sm:w-40 flex items-center justify-center">
                  {drugImages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <button
                        className={`${
                          isDragging
                            ? 'border border-[#54daba] text-[#54daba]'
                            : 'h-44 w-32 sm:h-32 sm:w-32 '
                        }`}
                        onClick={(e) => {
                          onImageUpload(e);
                          e.preventDefault();
                        }}
                        {...dragProps}
                      >
                        {labels[index]}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-0 grid grid-cols-1 gap-4">
                      {drugImages.map((image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="image-item cursor-pointer"
                          onClick={() => openImageModal(index)}
                        >
                          {image && (
                            <img
                              src={image.data_url}
                              alt=""
                              className="h-20 w-full object-contain sm:h-28"
                            />
                          )}
                          <div className="btns-cont mt-0 flex w-full justify-end">
                            {image && (
                              <button
                                className="text-sm text-[#259F83]"
                                onClick={(e) => {
                                  setImageToRemoveIndex(index);
                                  onImageRemove(imageIndex);
                                  e.stopPropagation();
                                }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedImage && (
                    <div
                      className="fixed z-50 left-0 top-0 flex h-full w-full items-center justify-center bg-[#0000003b] bg-opacity-60"
                      onClick={closeImageModal}
                    >
                      <img
                        src={selectedImage}
                        alt="Selected Image"
                        className="max-h-[80%] max-w-full" // Adjust the Opened image size
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div
                        className="absolute right-4 top-0 cursor-pointer text-6xl text-[#259F83] hover:text-[#25c5a0] sm:right-14 sm:top-2"
                        onClick={closeImageModal}
                      >
                        &times;
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ImageUploading>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <button
          className="med-btn-3rd"
          // onClick={(event) => uploadImages(event)}
          onClick={uploadImages}
          disabled={loading || uploadSuccess}
        >
          {loading ? 'Uploading...' : uploadSuccess ? 'Done ✔' : 'Upload Medicine images'}
        </button>
      </div>
    </div>
  );
};

export default DrugImages;
