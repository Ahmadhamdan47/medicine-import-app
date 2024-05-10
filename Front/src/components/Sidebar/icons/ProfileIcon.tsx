// export default function ProfileIcon() {
//   return (
// <svg
//   width="24"
//   height="24"
//   viewBox="0 0 56 27"
//   fill="none"
//   xmlns="http://www.w3.org/2000/svg"
// >
//   <path
//     strokeLinecap="round"
//     stroke-linejoin="round"
//     strokeWidth="2"
//     d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 7a3 3 0 100 6 3 3 0 000-6z"
//   />
// </svg>
//   );
// }

import React, { useState } from "react";

export default function ProfileIcon() {
const [isHovered, setIsHovered] = useState(false);
const [isActive, setIsActive] = useState(false);

const handleMouseEnter = () => {
  setIsHovered(true);
};

const handleMouseLeave = () => {
  setIsHovered(false);
};
const handleClick = () => {
  setIsActive(!isActive);
};
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 27"
      stroke={
        isActive
          ? "#00a651" // Active color
          : isHovered
          ? "#00a651" // Hover color
          : "#9CA5BF" // Default color
      }
      fill={
        isActive
          ? "#00a651" // Active color
          : isHovered
          ? "#00a651" // Hover color
          : "#9CA5BF" // Default color
      }
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 7a3 3 0 100 6 3 3 0 000-6z"
        stroke={
          isActive
            ? "#00a651" // Active color
            : isHovered
            ? "#00a651" // Hover color
            : "#9CA5BF" // Default color
        }
        fill={
          isActive
            ? "#00a651" // Active color
            : isHovered
            ? "#00a651" // Hover color
            : "#9CA5BF" // Default color
        }
      />
    </svg>
  );
}