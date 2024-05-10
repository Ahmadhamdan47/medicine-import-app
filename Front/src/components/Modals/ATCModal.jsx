import React, { useState } from "react";

import Axios from "../../api/axios";

const ATCModal = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    code: "",
    levelName: "",
    levelNameAr: "",
    atcRelatedLabel: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.put("/api/atc/v1.0", formData);
      console.log("Data updated successfully:", formData);
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <label className="flex flex-col">
            ATC:
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </label>
          <label className="flex flex-col">
            Level Name:
            <input
              type="text"
              name="levelName"
              value={formData.levelName}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col">
            Level Name (Arabic):
            <input
              type="text"
              name="levelNameAr"
              value={formData.levelNameAr}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col">
            ATC Related Label:
            <input
              type="text"
              name="atcRelatedLabel"
              value={formData.atcRelatedLabel}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ATCModal;
