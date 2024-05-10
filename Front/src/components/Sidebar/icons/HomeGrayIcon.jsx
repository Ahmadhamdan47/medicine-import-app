import React, { useRef, useState, useEffect } from "react";

export default function HomeGrayIcon() {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.267 1.79364L27.4923 3.55144L27.4932 3.55225L29.2666 1.79564L54.2719 27.0412L52.4966 28.7996H52.5032L54.2761 27.0436L54.9999 27.7744L54.9999 28.7996V56.8874L54.9999 59.3849H52.4999L32.5596 59.3849V56.8905H32.5595V59.3849H30.0595V56.8905V56.8849V38.6905H24.9405V56.8905L24.9404 59.3849H22.4404L2.50011 59.3849V56.8874H2.5V59.3849H0V56.8874V56.8849V28.8026V28.7996V27.7743L0.72343 27.0436L2.49703 28.7996H2.50022L0.724158 27.0412L25.7174 1.79715L25.7142 1.79402L27.4904 0L29.267 1.79364ZM49.9999 54.3849V29.8333L27.4932 7.11023L5 29.8291V54.3849H19.9405V36.1905V33.6905H22.4405H32.5501V36.1905L32.5596 36.1905V33.6905H35.0596V36.1905L35.0595 36.1905V54.3849H49.9999Z"
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
