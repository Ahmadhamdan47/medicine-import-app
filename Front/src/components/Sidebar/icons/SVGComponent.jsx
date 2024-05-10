// SVGComponent.jsx
import React, { useState } from "react";

const SVGComponent = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Your SVG path or elements */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill={isHovered ? "#F00" : "#00F"} // Dynamic fill color based on hover state
      />
    </svg>
  );
};

export default SVGComponent;
