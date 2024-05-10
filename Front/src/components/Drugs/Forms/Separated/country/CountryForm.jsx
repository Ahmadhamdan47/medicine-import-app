import React from "react";

const CountryForm = ({
  countryCode,
  setCountryCode,
  countryEnglishName,
  setCountryEnglishName,
  countryArabicName,
  setCountryArabicName,
  handleCountrySubmit,
}) => (
    <form className="country-form" onSubmit={handleCountrySubmit}>
      <div>
        <label htmlFor="code">Country Code:</label>
        <input
          type="text"
          id="code"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="englishName">Country English Name:</label>
        <input
          type="text"
          id="englishName"
          value={countryEnglishName}
          onChange={(e) => setCountryEnglishName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="arabicName">Country Arabic Name:</label>
        <input
          type="text"
          id="arabicName"
          value={countryArabicName}
          onChange={(e) => setCountryArabicName(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );

export default CountryForm;
