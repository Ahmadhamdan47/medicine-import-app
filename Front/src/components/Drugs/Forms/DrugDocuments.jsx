/* eslint-disable react/prop-types */
import React from "react";
import ImageUploading from "react-images-uploading";

import { useDrugDocumentsContext } from "../../../Contexts/DrugDocumentsContext";

const DrugDocuments = (props) => {
  const { formDataStep12, handleInputChange } = props;
  const {
    drugImagesList,
    loading,
    selectedImage,
    setImageToRemoveIndex,
    onChange,
    openImageModal,
    closeImageModal,
    uploadImages,
    uploadSuccess,
  } = useDrugDocumentsContext();
  const maxNumber = 1;

  const labels = [
    "Registration request application",
    "Drug certificate or Free selling certificate",
    "Profile of the responsibile party",
    "Plant profile",
    "GMP certificate",
    "Statement of origin of primary resources",
    "Drug subs & finished prod list",
    "Patents",
    "Study warranty and guarantee",
    "Pricing documents",
    "Certificate of analysis",
    "Other documents",
  ];

  return (
    <div className="image-uploader-cont flex flex-col justify-items-center items-center text-gray-700 dark:text-white-text">
      <h1 className="py-6 text-center text-xl sm:py-10 pb-10 font-medium">
        3- Medicine Documents
      </h1>
      <div className="grid  grid-cols-2 justify-items-center gap-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 rounded-2xl border-2 border-dashed dark:border-[#474747] p-10">
        {drugImagesList.map((drugImages, index) => (
          <div key={index} className="flex flex-col gap-4 items-center">
            <ImageUploading
              value={drugImages}
              onChange={(drugImageList) => onChange(drugImageList, index)}
              maxNumber={maxNumber}
              dataURLKey="data_url"
              formDataStep12={formDataStep12}
              handleInputChange={handleInputChange}
            >
              {({ onImageUpload, isDragging, dragProps, onImageRemove }) => (
                <div className="uploader-container h-32 w-32 gap-10 rounded-xl border-2 border-dotted p-2 pt-4 text-xs text-gray-900 border-[#727272c4] dark:border-[#474747] dark:text-gray-400 sm:h-20 sm:w- 2xl:h-28 2xl:w- flex items-center justify-center">
                  {drugImages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <button
                        className={`${
                          isDragging
                            ? "border border-[#54daba] text-[#54daba]"
                            : "h-44 w-32 sm:h-20 sm:w-20 2xl:h-24 2xl:w-24 "
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
                              className="h-20 w-full object-contain sm:h-20"
                            />
                          )}
                          <div className="btns-cont mt-0 flex w-full justify-end">
                            {image && (
                              <button
                                className="text-sm text-green-pri"
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
                        className="max-h-[80%] max-w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div
                        className="absolute right-4 top-0 cursor-pointer text-6xl text-green-pri hover:text-green-pri sm:right-14 sm:top-2"
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
          className="med-btn-3rd border-2 border-green-pri hover:bg-green-pri text-white font-medium py-2 px-4 rounded-xl"
          onClick={uploadImages}
          disabled={loading || uploadSuccess}
        >
          {loading
            ? "Uploading... please wait"
            : uploadSuccess
            ? "Done ✔"
            : "Upload Medicine Docs"}
        </button>
      </div>
    </div>
  );
};

export default DrugDocuments;

// /////////////////////////////////////////////////////////////////////////////
