import React, { useState, useContext, createContext } from "react";

const GeoModalProvider = createContext();

export const useGeoModalProvider = () => useContext(GeoModalProvider);

export const ModalFormProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null);
  const [countryGuid, setCountryGuid] = useState("");
  const [formData, setFormData] = useState("");

  return (
    <GeoModalProvider.Provider
      value={{ modalType, setModalType, countryGuid, setCountryGuid }}
    >
      {children}
    </GeoModalProvider.Provider>
  );
};
