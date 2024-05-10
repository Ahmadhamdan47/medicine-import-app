import React, { useRef, useState, useEffect } from "react";

export default function ImportIcon() {
  const [activeState, setActiveState] = useState("default");
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setActiveState(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered("hovered");
  };

  const handleMouseLeave = () => {
    setIsHovered("default");
  };

  const handleClick = () => {
    setActiveState(activeState === "active" ? "default" : "active");
  };

  return (
    <svg
      ref={iconRef}
      width="35"
      height="35"
      viewBox="0 0 62 62"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      fill={
        activeState === "active"
          ? "#00a651" // Active color
          : isHovered === "hovered"
          ? "#00a651" // Hover color
          : "none" // Default color
      }
    >
      <rect
        x="1"
        y="1"
        width="60"
        height="60"
        rx="21"
        stroke="#00a651"
        strokeWidth="2"
        fill={
          activeState === "active"
            ? "#00a651" // Active color
            : isHovered === "hovered"
            ? "#00a651" // Hover color
            : "" // Default color
        }
      />

      <path
        d="M17 33.6529L17 40.6651C17 43.1157 18.909 45.1023 21.264 45.1023H26.236H34.764H39.736C42.091 45.1023 44 43.1157 44 40.6651V33.6529"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="5"
        strokeLinecap="round"
        fill={
          activeState === "active"
            ? "#00a651" // Active color
            : isHovered === "hovered"
            ? "#00a651" // Hover color
            : "" // Default color
        }
      />

      <line
        x1="31.1982"
        y1="36.1267"
        x2="31.1982"
        y2="19.5001"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M23 30.176L31.25 37.1729L38.75 30.176"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M30.875 26.0415V20.9529"
        stroke={
          activeState === "active"
            ? "#00a651" // Active color
            : isHovered === "hovered"
            ? "#00a651" // Hover color
            : "#fff" // Default color
        }
        // strokeWidth="1.1"
        strokeWidth={
          activeState === "active"
            ? "0.5" // Active color
            : isHovered === "hovered"
            ? "0.5" // Hover color
            : "1.1" // Default color
        }
        strokeLinecap="round"
      />
    </svg>
  );
}
