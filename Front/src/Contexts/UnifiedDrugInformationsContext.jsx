/* eslint-disable react/prop-types */
 
import React, { useState, useContext, createContext } from 'react';

import AddModal from '../components/Modals/AddModal';

const dosageOptions = {
  '%': '%',
  billions: 'billions',
  'billions/g': 'billions/g',
  CCID50: 'CCID50',
  'ELISA units/ml': 'ELISA units/ml',
  g: 'g',
  'g/g': 'g/g',
  'g/L': 'g/L',
  'mg/g': 'mg/g',
  'g/ml': 'g/ml',
  'IR or IC/ml': 'IR or IC/ml',
  IU: 'IU',
  'IU/actuation': 'IU/actuation',
  'IU/drop': 'IU/drop',
  'IU/g': 'IU/g',
  'IU/ml': 'IU/ml',
  LRU: 'LRU',
  LSU: 'LSU',
  mcg: 'mcg',
  'mcg/dose': 'mcg/dose',
  'mcg/g': 'mcg/g',
  'mcg/mcg': 'mcg/mcg',
  'mcg/mg': 'mcg/mg',
  'mcg/ml': 'mcg/ml',
  'mcl/ml': 'mcl/ml',
  mg: 'mg',
  MIU: 'MIU',
  'MIU/ml': 'MIU/ml',
  ml: 'ml',
  'ml/l': 'ml/l',
  'ml/ml': 'ml/ml',
  PFU: 'PFU',
  'U.CEIP': 'U.CEIP',
  'U.CEIP/ml': 'U.CEIP/ml',
  'U/ml': 'U/ml',
  'units LD50': 'units LD50',
};

const dosageFormOptions = {
  Cream: 'Cream',
  CreamGel: 'CreamGel',
  'Drops, concentrated': 'Drops, concentrated',
  Elixir: 'Elixir',
  Spray: 'Spray',
};

const routeOptions = {
  Epidural: 'Epidural',
  Epilesional: 'Epilesional',
  Haemodialysis: 'Haemodialysis',
  Infusion: 'Infusion',
  'Peritoneal Dialysis': 'Peritoneal Dialysis',
  Rectal: 'Rectal',
  Respiratory: 'Respiratory',
  'soft tissue injection': 'soft tissue injection',
  Subcutaneous: 'Subcutaneous',
  Sublingual: 'Sublingual',
  Topical: 'Topical',
  'Topical scalp': 'Topical scalp',
  Transdermal: 'Transdermal',
  Vaginal: 'Vaginal',
  'Varicose vein': 'Varicose vein',
};

const presentationContainerOptions = {
  Ampule: 'Ampule',
  Applicator: 'Applicator',
  Bottle: 'Bottle',
  Box: 'Box',
  Canister: 'Canister',
  Cartridge: 'Cartridge',
  Inhaler: 'Inhaler',
  'Inhaler refill': 'Inhaler refill',
  Kit: 'Kit',
  'Not stated': 'Not stated',
  'Packet/Sachet': 'Packet/Sachet',
  Pack: 'Pack',
  Pen: 'Pen',
  'Pre-filled pen': 'Pre-filled pen',
  Penfill: 'Penfill',
  'Pre-filled syringe': 'Pre-filled syringe',
  Syringe: 'Syringe',
  Tube: 'Tube',
  Vial: 'Vial',
  New: 'New',
};

const prescriptionAndDispensingConditionOptions = {
  Narcotics: 'Narcotics',
  'Biological drugs': 'Biological drugs',
  'Dispensed multiple times from one prescription':
    'Dispensed multiple times from one prescription',
  'Dispensed for the prescription duration': 'Dispensed for the prescription duration',
  'OTC drugs': 'OTC drugs',
};

const UnifiedDrugInformationContext = createContext();

export const useUnifiedDrugInformation = () => useContext(UnifiedDrugInformationContext);

export const UnifiedDrugInformationProvider = ({ children }) => {
  const [formDataStep3, setFormDataStep3] = useState({
    // Initialize your form data here
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataStep3((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAdd = (value) => {
    console.log('Adding value:', value);
    // Perform any other actions with the entered value
  };

  const handleCancel = () => {
    console.log('Modal cancelled');
    // Perform any actions when the modal is cancelled
  };

  const contextValue = {
    formDataStep3,
    handleInputChange,
    isModalOpen,
    AddModal,
    openModal,
    closeModal,
    handleAdd,
    handleCancel,
    routeOptions,
    dosageOptions,
    dosageFormOptions,
    presentationContainerOptions,
    prescriptionAndDispensingConditionOptions,
  };

  return (
    <UnifiedDrugInformationContext.Provider value={contextValue}>
      {children}
    </UnifiedDrugInformationContext.Provider>
  );
};
