/* eslint-disable react/jsx-key */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

import { Step, Stepper, StepLabel } from "@mui/material";
import Paper from "@mui/material/Paper";
import "./styles.css";
import RequestForImporationForm from "./Forms/RequestForImporationForm";
import ResultForm from "./Forms/ResultForm";
import Stack from "@mui/material/Stack";

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  stepperPaper: {
    boxShadow: "none",
    backgroundColor: "transparent",
  },
}));

function CustomStepper({ currentStep, steps }) {
  const classes = useStyles();
  return (
    <Stack sx={{ width: "100%", backgroundColor: "transparent" }} spacing={4}>
      <Stepper
        activeStep={currentStep}
        alternativeLabel
        style={{ background: "none", boxShadow: "none" }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              className={`dot ${currentStep === index ? "active" : ""}`}
            />
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}

function Import(props) {
  const classes = useStyles();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const isLastStep = currentStep === 5;

  const steps = [
    "RequestForImporationForm",
    "ResultForm",
    "ShipmentForm",
    "RFDForm",
    "DistributeForm",
  ];

  const [formDataStep1, setFormDataStep1] = useState({});

  const [formDataStep2, setFormDataStep2] = useState({
    status: "Approved",
    qtyApproved: "50",
    PInumber: "123",
    PIdate: "15-12-2023",
    PIamount: "USD 15,000,000",
    proformaInvoice: "",
    swiftNumber: "12345",
    swiftAmount: "USD 15,000,000",
    swiftDate: "",
    bankName: "",
    swift: "",
  });

  const [formDataStep3, setFormDataStep3] = useState({});
  const [formDataStep4, setFormDataStep4] = useState({});
  const [formDataStep5, setFormDataStep5] = useState({});

  const handleInputChangeStep1 = (name, value) => {
    setFormDataStep1((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleInputChangeStep2 = (name, value) => {
    setFormDataStep2((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleInputChangeStep3 = (name, value) => {
    setFormDataStep3((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleInputChangeStep4 = (name, value) => {
    setFormDataStep4((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleInputChangeStep5 = (name, value) => {
    setFormDataStep5((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const logFormData = () => {
    const finalFormData = {
      ...formDataStep1,
      ...formDataStep2,
      ...formDataStep3,
      ...formDataStep4,
      ...formDataStep5,
    };

    console.log("Final Form Data:", finalFormData);

    // Perform submission or redirection here
    navigate("/import");
    FetchData(finalFormData);
  };

  const handleNext = () => {
    if (currentStep === 2) {
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleArrowButtonClick = () => {
    if (isLastStep) {
      logFormData();
    } else {
      handleNext();
    }
  };

  const forms = [
    <div className="flex justify-center ">
      <RequestForImporationForm
        handleInputChange={handleInputChangeStep1}
        formDataStep1={formDataStep1}
      />
    </div>,

    <div className="flex justify-center">
      <ResultForm
        handleInputChange={handleInputChangeStep2}
        formDataStep2={formDataStep2}
      />
    </div>,
    <div className="flex justify-center"></div>,
    <div className="flex justify-center"></div>,
    <div className="flex justify-center"></div>,
    <div className="flex justify-center"></div>,
  ];

  return (
    /* Page Title Header Container (Outside the Box) Start */
    <div className="text-black-text dark:text-white-text">
      <div className="title py-4 pl-4 flex w-full justify-center items-center">
        <h1 className="text-3xl font-semibold text-center ">Importation</h1>
      </div>

      <div className="flex w-full justify-end pr-2">
        <Link to={`/`} className="text-md  text-green-pri">
          <CloseIcon fontSize="small" className="arrowLeft" />
        </Link>
      </div>

      {/* Content Container Start */}
      <div className="content w-full sm:h-full overflow-auto rounded-t-3xl bg-white text-center dark:bg-black">
        <Paper elevation={3} className={classes.stepperPaper}>
          <CustomStepper currentStep={currentStep} steps={steps} />
        </Paper>
        <form className="flex w-full flex-col">{forms[currentStep]}</form>
      </div>

      {/* Content Container End */}

      {/* Footer Container Start */}
      <div className="footer w-full flex justify-center space-x-20 rounded-b-3xl bg-white py-0 text-center text-2xl dark:bg-black sm:pb-0">
        <div className="flex items-center justify-center space-x-20 pt-0">
          {currentStep > 0 ? (
            <Button
              style={{
                textTransform: "none",
                fontSize: "21px",
                fontFamily: "Roboto Condensed",
                color: "#259F83",
                backgroundColor: "transparent",
                borderRadius: "13px",
                cursor: "pointer",
              }}
              onClick={handleBack}
              type="button"
            >
              <FaArrowLeftLong
                style={{
                  fontSize: "20px",
                  color: "#259F83",
                }}
                className="mr-2 text-[20px] text-[#259F83]"
              />
              Previous
            </Button>
          ) : (
            <div style={{ width: "104px" }}></div> // Placeholder with the width of the button
          )}
        </div>
        <Button
          style={{
            textTransform: "none",
            fontSize: "21px",
            fontFamily: "Roboto Condensed",
            color: isLastStep ? "#fff" : "#259F83",
            backgroundColor: isLastStep ? "#259F83" : "transparent",
            borderRadius: isLastStep ? "13px" : "13px",
          }}
          onClick={handleArrowButtonClick}
          type="button"
        >
          {isLastStep ? "Submit" : "Next"}
          <FaArrowRightLong
            style={{
              fontSize: "20px",
              color: isLastStep ? "text-white" : "text-[#259F83]",
            }}
            className={`ml-2 text-[20px] ${
              isLastStep ? "text-white " : "text-[#259F83]"
            }`}
          />
        </Button>
      </div>
    </div>
  );
}

export default Import;
