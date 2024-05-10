import React from "react";

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function AlphabetButtons({ activeFilter, handleFilterClick }) {
  return (
    <div className="alphabet-container">
      {alphabet.map((letter) => (
        <button
          key={letter}
          className={`letter-button ${
            activeFilter === letter
              ? "active bg-white-bg rounded-full py-2 px-4 ml-1 mr-1"
              : "border border-green-pri rounded-full py-2 px-4 ml-1 mr-1"
          }`}
          onClick={() => handleFilterClick(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

export default AlphabetButtons;
