import React, { useRef, useState, useEffect } from "react";

export default function InspectionIcon() {
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
      <path
        d="M30.5001 40.375C32.6171 40.375 34.3184 40.1601 35.8595 38.9925C36.1794 40.1765 36.6652 41.1512 37.2456 41.9273C35.2612 42.9272 32.8261 43.75 30.6314 43.75C25.3024 43.75 21.0185 40.5883 18.0326 37.3486C16.5453 35.7349 15.3965 34.1191 14.6195 32.9061C14.2313 32.3001 13.9368 31.7959 13.7399 31.4446C13.6685 31.3171 13.6099 31.2097 13.5645 31.125C13.6099 31.0403 13.6685 30.9329 13.7399 30.8054C13.9368 30.4541 14.2313 29.9499 14.6195 29.3439C15.3965 28.1309 16.5453 26.5151 18.0326 24.9014C21.0185 21.6617 25.3024 18.5 30.6314 18.5C35.8254 18.5 40.0431 21.6575 42.9986 24.8994C44.4701 26.5134 45.611 28.1296 46.3842 29.3429C46.7705 29.9491 47.0641 30.4534 47.2606 30.8049C47.3304 30.9299 47.3879 31.0355 47.4329 31.1195C47.3667 31.2378 47.2747 31.3993 47.1581 31.5974C46.8926 32.0483 46.4998 32.6882 45.9924 33.4403C45.0359 34.8584 43.6782 36.6668 42.0064 38.357C41.1467 37.5447 39.9942 36.6835 38.501 35.7895C39.2962 34.4216 39.7501 32.8283 39.7501 31.125C39.7501 26.038 35.6341 21.875 30.5001 21.875C25.4115 21.875 21.2501 26.0364 21.2501 31.125C21.2501 36.259 25.4131 40.375 30.5001 40.375ZM42.3643 43.1023C41.5652 43.4694 40.108 43.3028 38.8377 42.2002C38.8562 42.1893 38.8747 42.1785 38.8932 42.1676L38.9281 42.1471L38.9592 42.1212L40.4632 40.8703L41.9475 39.7303C42.3795 40.22 42.6725 40.6674 42.8533 41.0647C43.118 41.6464 43.1281 42.0871 43.029 42.3963C42.9314 42.7011 42.7069 42.945 42.3643 43.1023ZM26.6251 31.125C26.6251 28.9949 28.37 27.25 30.5001 27.25C30.5405 27.25 30.5806 27.2514 30.6204 27.2541C30.2418 27.6995 30.0001 28.276 30.0001 28.9375C30.0001 30.4386 31.1865 31.625 32.6876 31.625C33.3483 31.625 33.9241 31.3839 34.3693 31.0061C34.3731 31.0463 34.3751 31.0858 34.3751 31.125C34.3751 33.2551 32.6302 35 30.5001 35C28.37 35 26.6251 33.2551 26.6251 31.125Z"
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
      />
    </svg>
  );
}
