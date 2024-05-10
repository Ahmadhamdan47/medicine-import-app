import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { Step, Stepper, StepLabel } from "@mui/material";

import "./styles.css";
import RFImporationForm from "./test/RFIForm";
import ImportationProcessForm from "./Forms/ImportationProcessForm";

const useStyles = makeStyles((theme) => ({
  stepperPaper: {
    boxShadow: "none",
    backgroundColor: "transparent",
  },
}));

function ImportFormStepper({ currentStep, steps }) {
  const classes = useStyles();
  const getDotClassName = (index) =>
    `dot ${currentStep === index ? "active" : ""}`;
  return (
    <Stepper
      activeStep={currentStep}
      alternativeLabel
      style={{ background: "transparent", boxShadow: "none" }}
    >
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel className={getDotClassName(index)} />
        </Step>
      ))}
    </Stepper>
  );
}

const validateCurrentForm = (
  currentStep,
  rfiFormData,
  importProcessPFIData,
  importProcessSWIFTData
) => {
  if (currentStep === 0) {
    // Validate the first form (RFI form)
    return rfiFormData.RequestedDrug !== "" && true;
  } if (currentStep === 1) {
    // Validate the second form (Importation Process form)
    return (
      importProcessPFIData.PFInumber !== "" &&
      importProcessSWIFTData.swiftNumber !== "" &&
      true
    );
  }
  // Default to true if no specific validation is required
  return true;
};

const steps = ["Fill Request for Importation (RFI)", "Importation Process"];

function ImportDrug(props) {
  const classes = useStyles();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const isLastStep = currentStep === 1;
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isRFISubmitted, setIsRFISubmitted] = useState(false);

  const [rfiFormData, setRfiFormData] = useState({
    RequestedDrug: "",
    quantityRequested: "",
    offerType: "",
    offerPercentage: "",
    notes: "",
  });

  const [importProcessPFIData, setImportProcessPFIData] = useState({
    PFInumber: "",
    PFIdate: "",
    PFIamount: "",
    PFIdoc: "",
  });

  const [importProcessSWIFTData, setImportProcessSWIFTData] = useState({
    swiftNumber: "",
    swiftDate: "",
    swiftAmount: "",
    bankName: "",
    SWIFTdoc: "",
  });

  const handleInputChange = (name, value) => {
    // Update the state for the current form
    if (currentStep === 0) {
      setRfiFormData((prevData) => ({ ...prevData, [name]: value }));
    } else if (currentStep === 1) {
      if (
        name === "PFIdoc" ||
        name === "PFInumber" ||
        name === "PFIdate" ||
        name === "PFIamount"
      ) {
        setImportProcessPFIData((prevData) => ({ ...prevData, [name]: value }));
      } else {
        setImportProcessSWIFTData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }

    // Check form validity and update the state
    const isCurrentFormValid = validateCurrentForm(
      currentStep,
      rfiFormData,
      importProcessPFIData,
      importProcessSWIFTData
    );
    setIsNextButtonDisabled(!isCurrentFormValid);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setIsFormSubmitted(false);
    }

    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  // RFI form submission function (logging to console)
  const submitRFIForm = async () => {
    try {
      if (rfiFormData) {
        const formDataEntries = Object.entries(rfiFormData || {});
      }

      console.log("RFI Form submitted successfully");
    } catch (error) {
      console.error("Error submitting RFI form:", error.message);
      throw error;
    }
  };

  const handleArrowButtonClick = async () => {
    if (currentStep === 0) {
      // Handle submit logic for the first step
      if (!isRFISubmitted) {
        const isRFIFormValid = validateCurrentForm(
          0,
          rfiFormData,
          importProcessPFIData,
          importProcessSWIFTData
        );

        if (isRFIFormValid) {
          // Submit the RFI form
          await submitRFIForm();
          setIsRFISubmitted(true);
        } else {
          return;
        }
      }
    } else if (currentStep === 1) {
      // Handle other steps if needed
    }

    // Move to the next step
    setCurrentStep(currentStep + 1);
  };

  const forms = [
    <div className="flex justify-center">
      {currentStep === 0 && !isFormSubmitted && (
        <RFImporationForm
          handleInputChange={handleInputChange}
          rfiFormData={rfiFormData}
          handleBack={handleBack}
        />
      )}
    </div>,

    <div className="flex justify-center">
      {currentStep === 1 && (
        <div className="flex justify-center w-[80%]">
          <ImportationProcessForm
            currentStep={currentStep}
            handleInputChange={handleInputChange}
            importProcessPFIData={importProcessPFIData}
            importProcessSWIFTData={importProcessSWIFTData}
            isFormSubmitted={isFormSubmitted}
          />
        </div>
      )}
    </div>,
  ];

  return (
    <div className="main-page items-center w-full h-[100svh] bg-white-bg dark:bg-black-bg flex flex-col pb-[4.5em] sm:pb-2 px-2 sm:px-6 dark:text-white-500">
      <div className="title py-4 pb-0 lg:mb-[-0rem] 2xl:mb-0 pl-0 flex w-full justify-center items-center">
        <h1 className="text-3xl font-semibold text-center text-[#00a651]">
          Importation
        </h1>
      </div>

      <div className="flex w-full justify-end pr-2">
        <Link to="/list" className="text-md  text-[#00a651]">
          Close
          <CloseIcon fontSize="small" />
        </Link>
      </div>

      {/* Content Container Start */}
      <div className="content w-full sm:h-full overflow-auto rounded-t-3xl px-2 py-6 text-center bg-white-contents dark:bg-black-contents">
        <Paper elevation={3} className={classes.stepperPaper}>
          <ImportFormStepper currentStep={currentStep} steps={steps} />
        </Paper>
        <form className="flex w-full flex-col">{forms[currentStep]}</form>
      </div>

      {/* Content Container End */}

      {/* Footer Container Start */}
      <div className="footer w-full flex justify-center space-x-20 rounded-b-3xl py-0 text-center text-2xl bg-white-contents dark:bg-black-contents sm:pb-0">
        <div className="flex items-center justify-center space-x-20 pt-0">
          {currentStep > 0 && (
            <div className="flex items-center justify-center space-x-20 pt-0">
              <Button
                style={{
                  textTransform: "none",
                  fontSize: "21px",
                  fontFamily: "Roboto Condensed",
                  color: "#00a651",
                  backgroundColor: "transparent",
                  borderRadius: "13px",
                  cursor: "pointer",
                }}
                onClick={handleBack}
                type="button"
              >
                Previous
              </Button>
            </div>
          )}

          {!isLastStep && (
            <Button
              disabled={isNextButtonDisabled}
              style={{
                textTransform: "none",
                fontSize: "21px",
                fontFamily: "Roboto Condensed",
                color: "#00a651",
                backgroundColor: "transparent",
                borderRadius: "13px",
                cursor: isNextButtonDisabled ? "not-allowed" : "pointer",
              }}
              onClick={handleArrowButtonClick}
              type="button"
            >
              {currentStep === 0 ? "Submit" : null}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImportDrug;
