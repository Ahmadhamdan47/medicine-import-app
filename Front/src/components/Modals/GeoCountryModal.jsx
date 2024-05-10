import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";

import {
  addCity,
  addDistrict,
  addGovernorate,
} from "../../app/slices/geoSlice";

const GeoCountryModal = ({ show, type, onClose, countryId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    nameAr: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    switch (type) {
      case "governorate":
        dispatch(addGovernorate({ ...formData, countryId }));
        break;
      case "district":
        dispatch(addDistrict({ ...formData, countryId }));
        break;
      case "city":
        dispatch(addCity({ ...formData, countryId }));
        break;
      default:
        break;
    }
    onClose();
  };

  const handleAddAnother = () => {
    // Clear the form fields
    setFormData({ code: "", name: "", nameAr: "" });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* Form fields for adding governorate, district, or city */}
          <label>
            Code:
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Arabic Name:
            <input
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleInputChange}
            />
          </label>
          {/* Add more fields as needed */}

          <Button variant="primary" type="submit">
            Add {type}
          </Button>
        </form>

        <Button variant="secondary" onClick={handleAddAnother}>
          Add Another {type}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default GeoCountryModal;
