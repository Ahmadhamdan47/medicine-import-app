import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";

import Axios from "../../../../../api/axios";

//   const PresentationForm = () => {
//     const [formData, setFormData] = useState({
//       name: '',
//       nameAr: '',
//       unitNumber1: '',
//       unitTypeCode1: '',
//       unitNumber2: '',
//       unitTypeCode2: '',
//       unitNumber3: '',
//       unitTypeCode3: '',
//       packageNumber1: '',
//       packageTypeCode1: '',
//       packageNumber2: '',
//       packageTypeCode2: '',
//       packageNumber3: '',
//       packageTypeCode3: '',
//     });

//     const handleChange = (e) => {
//       setFormData({
//         ...formData,
//         [e.target.name]: e.target.value,
//       });
//     };

const PresentationForm = () => {
  const [formData, setFormData] = useState({
    guid: uuidv4(), // Function to generate UUID
    name: "",
    nameAr: "",
    unitNumber1: null,
    unitType1: uuidv4(),
    unitTypeCode1: "",
    unitNumber2: null,
    unitType2: uuidv4(),
    unitTypeCode2: "",
    unitNumber3: null,
    unitType3: uuidv4(),
    unitTypeCode3: "",
    packageNumber1: null,
    packageType1: uuidv4(),
    packageTypeCode1: "",
    packageNumber2: null,
    packageType2: uuidv4(),
    packageTypeCode2: "",
    packageNumber3: null,
    packageType3: uuidv4(),
    packageTypeCode3: "",
    createdDate: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("/api/presentation/v1.0", formData)
      .then((response) => {
        if (response.data) {
          console.log("Data submitted successfully:", response.data);
        } else {
          console.log("Data submitted successfully");
        }
        // Reset form after successful submission if needed
        setFormData({
          ...formData,

          name: "",
          nameAr: "",
          unitNumber1: "",
          unitType1: "",
          unitTypeCode1: "",
          unitNumber2: "",
          unitType2: "",
          unitTypeCode2: "",
          unitNumber3: "",
          unitType3: "",
          unitTypeCode3: "",
          packageNumber1: "",
          packageType1: "",
          packageTypeCode1: "",
          packageNumber2: "",
          packageType2: "",
          packageTypeCode2: "",
          packageNumber3: "",
          packageType3: "",
          packageTypeCode3: "",
          createdDate: new Date().toISOString(),
        });
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-6 p-4 py-14 md:p-10"
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="nameAr" className="">
            Name Arabic
          </label>
          <input
            type="text"
            id="nameAr"
            name="nameAr"
            value={formData.nameAr}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {/* Unit fields */}
        {[1, 2, 3].map((index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col">
              <label htmlFor={`unitNumber${index}`} className="">
                Unit Number {index}
              </label>
              <input
                type="number"
                id={`unitNumber${index}`}
                name={`unitNumber${index}`}
                value={formData[`unitNumber${index}`]}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor={`unitTypeCode${index}`} className="">
                Unit Type Code {index}
              </label>
              <input
                type="text"
                id={`unitTypeCode${index}`}
                name={`unitTypeCode${index}`}
                value={formData[`unitTypeCode${index}`]}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </React.Fragment>
        ))}

        {/* Package fields */}
        {[1, 2, 3].map((index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col">
              <label htmlFor={`packageNumber${index}`} className="">
                Package Number {index}
              </label>
              <input
                type="number"
                id={`packageNumber${index}`}
                name={`packageNumber${index}`}
                value={formData[`packageNumber${index}`]}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor={`packageTypeCode${index}`} className="">
                Package Type Code {index}
              </label>
              <input
                type="text"
                id={`packageTypeCode${index}`}
                name={`packageTypeCode${index}`}
                value={formData[`packageTypeCode${index}`]}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </React.Fragment>
        ))}

        <button
          type="submit"
          className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PresentationForm;
