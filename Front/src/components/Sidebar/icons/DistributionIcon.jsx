import React, { useRef, useState, useEffect } from "react";

export default function DistributionIcon() {
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
      fill={
        activeState === "active"
          ? "#00a651" // Active color
          : isHovered === "hovered"
          ? "#00a651" // Hover color
          : "none" // Default color
      }
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        borderRadius: "12px", // Set border radius
      }}
    >
      <rect
        x="1"
        y="1"
        width="60"
        height="60"
        rx="21"
        stroke="#00a651"
        strokeWidth="3"
      />
      <ellipse
        cx="35.0925"
        cy="44.7593"
        rx="3.24074"
        ry="3.24074"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
      />
      <path
        d="M37.2313 43.813C37.6681 43.813 38.0223 44.17 38.0223 44.6102C38.0223 45.0505 37.6681 45.4075 37.2313 45.4075C36.7944 45.4075 37.2312 45.0505 37.2312 44.6102C37.2312 44.17 36.7944 43.813 37.2313 43.813Z"
        fill={
          activeState === "active"
            ? "#00a651" // Active color
            : isHovered === "hovered"
            ? "#00a651" // Hover color
            : "#fff" // Default color
        }
      />
      <circle
        cx="3.24074"
        cy="3.24074"
        r="3.24074"
        transform="matrix(0.692847 -0.721085 0.692847 0.721085 15.2224 44.8101)"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
      />
      <path
        d="M18.8857 42.3753C19.1901 42.0586 19.6835 42.0586 19.9878 42.3753C20.2921 42.6921 20.2921 43.2056 19.9878 43.5223C19.6835 43.839 19.741 43.2656 19.4367 42.9489C19.1324 42.6322 18.5814 42.6921 18.8857 42.3753Z"
        fill={
          activeState === "active"
            ? "#00a651" // Active color
            : isHovered === "hovered"
            ? "#00a651" // Hover color
            : "#fff" // Default color
        }
      />
      <path
        d="M20.5836 27.4078C18.9317 26.7189 18.151 24.8213 18.84 23.1694L20.3369 19.5801L26.319 22.075L24.822 25.6642C24.1331 27.3161 22.2355 28.0968 20.5836 27.4078Z"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      {/* left pill SART */}
      <path
        d="M26.0723 14.2474C24.4204 13.5585 22.5228 14.3391 21.8339 15.991L20.3369 19.5803L26.319 22.0752L27.8159 18.4859C28.5049 16.834 27.7242 14.9364 26.0723 14.2474Z"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M27.3589 17.4185L27.152 18.0327"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M26.1326 20.4172L26.5068 19.5199"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      {/* left pill END */}

      {/* Right pill SART */}
      <path
        d="M34.4472 17.7404C36.0991 18.4293 36.8797 20.3269 36.1908 21.9788L34.6939 25.5681L28.7118 23.0732L30.2087 19.484C30.8977 17.8321 32.7953 17.0514 34.4472 17.7404Z"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M28.9587 30.9008C30.6106 31.5897 32.5082 30.8091 33.1971 29.1572L34.6941 25.5679L28.712 23.073L27.2151 26.6623C26.5261 28.3142 27.3068 30.2118 28.9587 30.9008Z"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        stroke="#00a651"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M27.6721 27.73L27.879 27.1157"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M28.8984 24.731L28.5242 25.6283"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      {/* Right pill END */}

      {/* Carriage body START */}
      <path
        d="M35.0195 38.6017H18.9596C18.9172 38.6017 18.8795 38.575 18.8653 38.535L15.047 27.7165C15.0241 27.6514 15.0723 27.5832 15.1413 27.5832H38.4954L37.3611 31.4721L35.1148 38.5321C35.1016 38.5736 35.063 38.6017 35.0195 38.6017Z"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "none" // Default color
        }
      />
      <path
        d="M50 23.6943H39.7046C39.6602 23.6943 39.6211 23.7237 39.6086 23.7663L38.4954 27.5832M38.4954 27.5832H15.1413C15.0723 27.5832 15.0241 27.6514 15.047 27.7165L18.8653 38.535C18.8795 38.575 18.9172 38.6017 18.9596 38.6017H35.0195C35.063 38.6017 35.1016 38.5736 35.1148 38.5321L37.3611 31.4721L38.4954 27.5832Z"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Carriage body END */}
      <path
        d="M44.4907 23.3704H49.6759"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : isHovered === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
