import React, { useRef, useState, useEffect } from "react";

export function AddIcon() {
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
      width="50"
      height="50"
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.6167 26.3833H41C42.2331 26.37 43.4202 26.8505 44.2968 27.7177C45.1735 28.585 45.6667 29.7669 45.6667 31C45.6826 32.2441 45.2029 33.4434 44.3333 34.3333C43.8784 34.7455 43.3458 35.0628 42.7667 35.2667C42.2072 35.5007 41.6064 35.6198 41 35.6167H35.6167V41C35.6167 43.5497 33.5497 45.6167 31 45.6167C28.4503 45.6167 26.3833 43.5497 26.3833 41V35.6167H21C18.4503 35.6167 16.3833 33.5497 16.3833 31C16.3833 28.4503 18.4503 26.3833 21 26.3833H26.3833V21C26.3833 18.4503 28.4503 16.3833 31 16.3833C33.5497 16.3833 35.6167 18.4503 35.6167 21V26.3833ZM34.6 30.05H41.5667C41.7667 30.0615 41.9635 29.9959 42.1167 29.8667C42.2526 29.7219 42.3298 29.5318 42.3333 29.3333C42.3323 29.1294 42.255 28.9332 42.1167 28.7833C41.9697 28.6405 41.7716 28.5625 41.5667 28.5667H34.6C34.3951 28.5625 34.197 28.6405 34.05 28.7833C33.9116 28.9332 33.8343 29.1294 33.8333 29.3333C33.8343 29.1294 33.9116 28.9332 34.05 28.7833C34.197 28.6405 34.3951 28.5625 34.6 28.5667H41.5667C41.7716 28.5625 41.9697 28.6405 42.1167 28.7833C42.255 28.9332 42.3323 29.1294 42.3333 29.3333C42.3298 29.5318 42.2526 29.7219 42.1167 29.8667Z"
        fill="#00a651"
      />
      <path
        d="M42.1167 29.8667C41.9714 30.0141 41.7736 30.0981 41.5667 30.1002H34.6C34.3972 30.1013 34.2034 30.0166 34.0667 29.8668C33.9203 29.7277 33.8361 29.5353 33.8333 29.3333C33.8343 29.1294 33.9116 28.9332 34.05 28.7833C34.197 28.6405 34.3951 28.5625 34.6 28.5667H41.5667C41.7716 28.5625 41.9697 28.6405 42.1167 28.7833C42.255 28.9332 42.3323 29.1294 42.3333 29.3333C42.3298 29.5318 42.2526 29.7219 42.1167 29.8667Z"
        fill="#fff"
        fillOpacity="0.5"
      />
    </svg>
  );
}
