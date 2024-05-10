import React, { useRef, useState, useEffect } from "react";

function DashboardGrayIcon() {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      ref={iconRef}
      width="35"
      height="35"
      viewBox="0 0 55 60"
      // fill="none"
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
        d="M50 30C50 34.9445 48.5338 39.778 45.7867 43.8893C43.0397 48.0005 39.1352 51.2048 34.5671 53.097C29.9989 54.9892 24.9723 55.4843 20.1227 54.5196C15.2732 53.555 10.8186 51.174 7.32233 47.6777C3.82602 44.1814 1.445 39.7268 0.480368 34.8773C-0.484263 30.0277 0.0108209 25.0011 1.90301 20.4329C3.7952 15.8648 6.99952 11.9603 11.1107 9.21326C15.222 6.46622 20.0555 5 25 5L25 30H50Z"
        fill={
          isActive
            ? "#00a651" // Active color
            : isHovered
            ? "#00a651" // Hover color
            : "#9CA5BF" // Default color
        }
        fillOpacity="0.7"
      />
      <path
        d="M30 0C33.283 0 36.5339 0.646644 39.5671 1.90301C42.6002 3.15938 45.3562 5.00087 47.6777 7.32233C49.9991 9.6438 51.8406 12.3998 53.097 15.4329C54.3534 18.4661 55 21.717 55 25L30 25V0Z"
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

export default DashboardGrayIcon;
