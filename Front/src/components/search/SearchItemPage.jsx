import React, { useState } from 'react';

import dummyResultData from './dummyResultData';

const SearchBar = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedData, setSuggestedData] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSearch = (term) => {
    const filteredData = dummyResultData.filter((item) => {
      const includesName = item.name.toLowerCase().includes(term.toLowerCase());
      const includesClassFilter = item.filters.classFilter.toLowerCase().includes(term.toLowerCase());
      const includesATCCode = item.filters.atcCode.some((code) => code.toLowerCase().includes(term.toLowerCase()));
      return includesName || includesClassFilter || includesATCCode;
    });
    const sortedData = filteredData.sort((a, b) => a.name.localeCompare(b.name));
    setSuggestedData(sortedData);
  };

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      setSuggestedData([]);
    } else {
      handleSearch(term);
    }
  };

  const handleFocus = () => {
    setIsInputFocused(true);
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  };

  const handleClick = () => {
    if (!isInputFocused) {
      setIsInputFocused(true);
      handleSearch(searchTerm);
    }
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestedData([]);
  };

  const handleSelect = (selectedItem) => {
    clearSearch();
    onSelect(selectedItem);
  };

  return (
    <div className="mx-auto p-4 max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder={isInputFocused ? '' : 'Search...'}
          value={searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        {searchTerm && (
          <button
            className="absolute top-2 right-3 text-gray-500"
            onClick={clearSearch}
          >
            Clear
          </button>
        )}
      </div>
      <ul className="mt-2">
        {suggestedData.map((item, index) => (
          <li
            key={index}
            className="border-b p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelect(item)}
          >
            <div className="font-semibold text-lg">{item.name}</div>
            <div className="text-sm">
              Class: {item.filters.classFilter}, ATC Code: {item.filters.atcCode.join(', ')}
            </div>
          </li>
        ))}
        {suggestedData.length === 0 && searchTerm && (
          <li className="p-2 text-gray-500">No results found</li>
        )}
      </ul>
    </div>
  );
};

const SearchItemPage = ({ selectedItem }) => (
    <div className="mx-auto p-4 max-w-md">
      {selectedItem ? (
        <div>
          <h2 className="text-2xl font-semibold mb-2">{selectedItem.name}</h2>
          <div>
            <p>Class: {selectedItem.filters.classFilter}</p>
            <p>ATC Code: {selectedItem.filters.atcCode.join(', ')}</p>
          </div>
        </div>
      ) : (
        <p>No item selected</p>
      )}
    </div>
  );

const App = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div>
      <SearchBar onSelect={setSelectedItem} />
      <SearchItemPage selectedItem={selectedItem} />
    </div>
  );
};

export default App;
