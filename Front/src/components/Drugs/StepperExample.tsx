import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Paper, Step, StepLabel, Stepper, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { CloseIcon } from '../../utils/icons';
import { useStepperContext } from './StepperContext';
import DrugRegistryForm from './Forms/DrugRegistryForm';
import DrugRegistryFormAddons from './Forms/DrugRegistryFormAddons';
import PricesComparison from './Forms/PricesComparison';
import DrugDocuments from './Forms/DrugDocuments';
import DrugImages from './Forms/DrugImages';
import DrugSubstanceInformationsForm from './Forms/DrugSubstanceInformationsForm';
import UnifiedDrugInformations from './Forms/UnifiedDrugInformations';
import PricingInformations from './Forms/PricingInformations';
import ManufacturingAndImportingInfo from './Forms/ManufacturingAndImportingInfo';
import Box from '@mui/system/Box';

const forms = [
  <DrugRegistryForm />,
  <DrugRegistryFormAddons />,
  <PricesComparison />,
  <>
    <DrugDocuments />
    <DrugImages />
  </>,
  <DrugSubstanceInformationsForm />,
  <UnifiedDrugInformations />,
  <PricingInformations />,
  <ManufacturingAndImportingInfo />,
];

const useStyles = makeStyles(() => ({
  stepperPaper: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
}));

const StepperExample = () => {
  const classes = useStyles();
  const { currentStep, handleNextOrSubmit, prevStep, nextStep } = useStepperContext();
  const [activeStep, setActiveStep] = useState(currentStep);
  const navigate = useNavigate();
  // const context = useStepperContext();
  // console.log(context);

  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  const isLastStep = activeStep === forms.length - 1;

  const handleArrowButtonClick = () => {
    if (isLastStep) {
      // Submit the form
      console.log("Submitting form...");
      handleNextOrSubmit();
      // Navigate to Link="/"
      navigate('/');
    } else {
      // Proceed to the next step
      nextStep();
    }
  };



  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const logFormData = (formData) => {
    console.log("Form Data Submission:", formData);
  };

  const handleFormSubmit = (formData) => {
    logFormData(formData); 
    handleArrowButtonClick();
    handleReset(); 
  };

  return (
    <div className="main-page w-full h-[100svh] flex flex-col dark:text-white-500">
      <div className="title pb-4 lg:mb-[-1rem] 2xl:mb-0 pl-0 flex w-full justify-center items-center">
        <h1 className="text-3xl font-semibold text-center text-[#00a651]">Registration</h1>
      </div>
      <div className="flex w-full justify-end mb-2">
        <Link to={`/`} className="text-md text-[#00a651]">
          <CloseIcon fontSize="small" />
        </Link>
      </div>
      <div className="content flex flex-col w-full sm:h-full overflow-auto rounded-t-3xl text-center">
        <Box sx={{ width: '100%', backgroundColor: 'transparent' }}>
          <Paper elevation={3} className={classes.stepperPaper}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {forms.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{`Step ${index + 1}`}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Box>

        <form className="flex w-full flex-col" onSubmit={handleFormSubmit}>
          {React.cloneElement(forms[activeStep], { onSubmit: handleFormSubmit })}
        </form>

      </div>
      <div className="footer w-full flex justify-center space-x-20 rounded-b-3xl py-0 text-center text-2xl bg-white-contents dark:bg-black-contents sm:pb-0">
        <div className="flex items-center justify-center space-x-20 pt-0">
          {activeStep > 0 ? (
            <Button
              onClick={handleBack}
              variant="text"
              style={{
                textTransform: 'none',
                fontSize: '21px',
                fontFamily: 'Roboto Condensed',
                color: '#00a651',
              }}
            >
              <FaArrowLeftLong style={{ fontSize: '20px', color: '#00a651' }}
                className="mr-2 text-[20px] text-[#00a651]"
              />
              Previous
            </Button>
          ) : (
            <div style={{ width: '104px' }}></div>
          )}
        </div>
        <Button
          style={{
            textTransform: "none",
            fontSize: "21px",
            fontFamily: "Roboto Condensed",
            color: isLastStep ? "#fff" : "#00a651",
            backgroundColor: isLastStep ? "#00a651" : "transparent",
            borderRadius: isLastStep ? "13px" : "13px",
          }}
          onClick={handleArrowButtonClick}
          type="button"
        >
          {isLastStep ? "Submit" : "Next"}
          <FaArrowRightLong
            style={{
              fontSize: "20px",
              color: isLastStep ? "text-white" : "text-[#00a651]",
            }}
            className={`ml-2 text-[20px] ${isLastStep ? "hidden" : "text-[#00a651]"
              }`}
          />
        </Button>
      </div>
    </div>
  );
};

export default StepperExample;
