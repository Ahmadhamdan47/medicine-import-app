import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { useInspection } from './InspectionContext';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

import ShipmentForm from './Forms/ShipmentForm';
import ShipmentSummary from './Forms/ShipmentSummary';

const useStyles = makeStyles((theme) => ({
  stepperPaper: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
}));

function FormStepper({ currentStep, steps }) {
  return (
    <div className="flex justify-center items-center w-full bg-white-contents dark:bg-black-contents">
      {steps.map((label, index) => (
        <div key={label} className={`relative ${index === 0 ? '' : 'ml-4'}`}>
          <div
            className={`h-8 w-8 flex items-center justify-center rounded-full border-2 ${currentStep >= index ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
            aria-current={currentStep === index ? 'step' : null}
          >
            <span
              className={`text-xs font-semibold ${currentStep >= index ? 'text-white' : 'text-gray-500'}`}
            >
              {index + 1}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`absolute top-4 left-4 h-0.5 w-20 bg-green-500 ${currentStep > index ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          <div
            className={`text-xs text-center mt-2 ${currentStep >= index ? 'text-green-500' : 'text-gray-500'}`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Inspection() {
  const {
    batchComponents,
    shipmentFormData,
    // steps,
    // currentStep,
    batchesQty,
    handleShipmentFormChange,
    handleBatchesQtyChange,
    handleBatchComponentChange,
    numSerials,
    setNumSerials,
    serialValues,
    setSerialValues,
    handleInputChange,
    handleNumSerialsChange,
    handleAdd,
    handlePaste,
    handleSubmit,
  } = useInspection();

  // const [batchComponents, setBatchComponents] = useState([]);
  // const [shipmentFormData, setShipmentFormData] = useState({});
  const steps = ['Shipment', 'Declaration Status & Agent Stock'];
  const classes = useStyles();
  const [currentStep, setCurrentStep] = useState(0);
  // const [batchesQty, setBatchesQty] = useState(0);
  const isLastStep = currentStep === steps.length - 1;

  // const handleShipmentFormChange = (data) => {
  //   setShipmentFormData((prevData) => ({
  //     ...prevData,
  //     ...data, // Merge new form data with existing form data
  //   }));
  // };

  // const handleBatchesQtyChange = (qty) => {
  //   setBatchesQty(qty);

  //   // Update batch components state based on the new quantity
  //   setBatchComponents((prevBatchComponents) => {
  //     const updatedBatchComponents = [...prevBatchComponents];

  //     // Remove excess batch components if decreasing quantity
  //     if (qty < updatedBatchComponents.length) {
  //       updatedBatchComponents.splice(qty);
  //     }

  //     // Add new batch components if increasing quantity
  //     if (qty > updatedBatchComponents.length) {
  //       for (let i = updatedBatchComponents.length; i < qty; i++) {
  //         updatedBatchComponents.push({});
  //       }
  //     }

  //     return updatedBatchComponents;
  //   });
  // };

  // const handleBatchComponentChange = (index, newData) => {
  //   const updatedBatchComponents = [...batchComponents];
  //   updatedBatchComponents[index] = newData;
  //   setBatchComponents(updatedBatchComponents);
  // };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="main-page items-center w-full h-[100svh] bg-white-bg dark:bg-black-bg flex flex-col pb-[4.5em] sm:pb-4 px-2 sm:px-6 dark:text-white-500">
      <div className="title py-4 pb-0 pl-0 flex w-full justify-center items-center">
        <h1 className="text-3xl font-semibold text-center text-[#00a651]">Inspection</h1>
      </div>

      <div className="flex w-full justify-end pr-2">
        <Link to="/list" className="text-md  text-[#00a651]">
          Close
          <CloseIcon fontSize="small" />
        </Link>
      </div>

      <div className="content w-full sm:h-full overflow-auto rounded-t-3xl pt-4 pb-10 text-center bg-white-contents dark:bg-black-contents px-2">
        <Paper elevation={3} className={classes.stepperPaper}>
          <FormStepper currentStep={currentStep} steps={steps} />
        </Paper>

        {/* Render step content based on currentStep */}
        {currentStep === 0 && (
          <div className="flex justify-center w-full pt-6 ">
            <ShipmentForm
              formData={shipmentFormData}
              onFormChange={handleShipmentFormChange}
              batchesQty={batchesQty}
              onBatchesQtyChange={handleBatchesQtyChange}
              batchComponents={batchComponents}
              onBatchComponentChange={handleBatchComponentChange}
            />
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <ShipmentSummary
              formData={shipmentFormData} // Pass shipmentFormData to the second step component
              onBack={handleBack}
              onNext={handleNext}
            />
          </div>
        )}
      </div>

      <div className="footer w-full flex justify-center space-x-20 rounded-b-3xl py-0 text-center text-2xl bg-white-contents dark:bg-black-contents sm:pb-0">
        <div className="flex items-center justify-center space-x-20 pt-0">
          {currentStep > 0 && (
            <Button
              style={{
                textTransform: 'none',
                fontSize: '21px',
                fontFamily: 'Roboto Condensed',
                color: '#00a651',
                backgroundColor: 'transparent',
                borderRadius: '13px',
                cursor: 'pointer',
              }}
              onClick={handleBack}
              type="button"
            >
              <FaArrowLeftLong
                style={{
                  fontSize: '20px',
                  color: '#00a651',
                }}
                className="mr-2 text-[20px] text-[#00a651]"
              />
              Previous
            </Button>
          )}
        </div>
        <Button
          style={{
            textTransform: 'none',
            fontSize: '21px',
            fontFamily: 'Roboto Condensed',
            color: isLastStep ? '#fff' : '#00a651',
            backgroundColor: isLastStep ? '#00a651' : 'transparent',
            borderRadius: isLastStep ? '13px' : '13px',
          }}
          onClick={handleNext}
          type="button"
        >
          {isLastStep ? 'Submit' : 'Next'}
          <FaArrowRightLong
            // onClick={handleArrowButtonClick}
            style={{
              fontSize: '20px',
              color: isLastStep ? 'text-white' : 'text-[#00a651]',
            }}
            className={`ml-2 text-[20px] ${isLastStep ? 'hidden' : 'text-[#00a651]'}`}
          />
        </Button>
      </div>
    </div>
  );
}

export default Inspection;
