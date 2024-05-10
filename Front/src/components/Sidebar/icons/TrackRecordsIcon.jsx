import React, { useState,useEffect } from "react";

export default function TrackRecordsIcon() {
  const [activeState, setActiveState] = useState("default");

  const handleMouseEnter = () => {
    setActiveState("hovered");
  };

  const handleMouseLeave = () => {
    setActiveState("default");
  };

  const handleClick = () => {
    setActiveState(activeState === "active" ? "default" : "active");
  };

  // Reset active state when the component unmounts
  useEffect(() => () => {
      setActiveState("default");
    }, []);

  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        backgroundColor: activeState === "hovered" ? "#00a651" : "transparent",
        borderRadius: "12px",
      }}
    >
      <path
        d="M20.5144 17.9197H42.6154"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M13 17.9198C13 16.8447 13.8447 16 14.9198 16C15.9949 16 16.8397 16.8447 16.8397 17.9198C16.8397 18.9949 15.9949 19.8397 14.9198 19.8397C13.8447 19.8397 13 18.9949 13 17.9198Z"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
      />
      <path
        d="M20.5144 24.9922H42.6154"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M13 24.9921C13 23.917 13.8447 23.0723 14.9198 23.0723C15.9949 23.0723 16.8397 23.917 16.8397 24.9921C16.8397 26.0672 15.9949 26.9119 14.9198 26.9119C13.8447 26.9119 13 26.0672 13 24.9921Z"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
      />
      <path
        d="M20.5144 32.0645H42.6154"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M13 32.0646C13 30.9895 13.8447 30.1448 14.9198 30.1448C15.9949 30.1448 16.8397 30.9895 16.8397 32.0646C16.8397 33.1397 15.9949 33.9844 14.9198 33.9844C13.8447 33.9844 13 33.1397 13 32.0646Z"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
      />
      <path
        d="M20.5144 39.1367H42.6154"
        stroke={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M13 39.1369C13 38.0618 13.8447 37.217 14.9198 37.217C15.9949 37.217 16.8397 38.0618 16.8397 39.1369C16.8397 40.212 15.9949 41.0567 14.9198 41.0567C13.8447 41.0567 13 40.212 13 39.1369Z"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
      />
      <ellipse
        cx="36.2214"
        cy="33.8366"
        rx="7.06731"
        ry="7.06731"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        d="M36.5627 25.5981H36.6249L36.6497 25.5733C41.3661 25.6067 45.1926 29.4538 45.1926 34.178C45.1926 35.6504 44.7754 37.0516 44.1106 38.2579L44.0435 38.3797L44.1599 38.4558C44.2955 38.5445 44.4216 38.6469 44.5361 38.7615L44.5362 38.7615L47.0376 41.2629L47.0374 41.2631L47.044 41.269C47.2886 41.4864 47.4862 41.7515 47.6247 42.048C47.7631 42.3445 47.8395 42.6662 47.8491 42.9933C47.8588 43.3204 47.8014 43.6461 47.6807 43.9502C47.5599 44.2544 47.3782 44.5306 47.1468 44.762C46.9154 44.9935 46.6391 45.1751 46.335 45.2959C46.0308 45.4167 45.7052 45.474 45.3781 45.4644C45.051 45.4547 44.7293 45.3783 44.4328 45.2399C44.1362 45.1014 43.8711 44.9038 43.6537 44.6592L43.6539 44.659L43.6477 44.6528L41.1463 42.1514L41.1467 42.151L41.1361 42.1421C41.025 42.0498 40.9227 41.9475 40.8304 41.8364L40.7512 41.7411L40.6427 41.8009C39.4411 42.463 38.0156 42.8079 36.5627 42.8079C31.8179 42.8079 27.9579 38.9478 27.9579 34.203C27.9579 29.4581 31.8179 25.5981 36.5627 25.5981ZM36.5627 27.7995H36.5006L36.4753 27.8248C32.9448 27.8578 30.1342 30.6891 30.1342 34.228C30.1342 37.7878 32.9779 40.6315 36.5377 40.6315C38.1988 40.6315 39.7362 40.0436 40.866 39.0166L40.8737 39.0095L40.8804 39.0015C40.9727 38.8904 41.0751 38.7881 41.1861 38.6958L41.1865 38.6963L41.1963 38.6865L41.2338 38.649L41.2714 38.6114L41.2714 38.6115L41.275 38.6077C42.3525 37.4533 42.9662 35.8904 42.9662 34.203C42.9662 30.6432 40.1225 27.7995 36.5627 27.7995Z"
        // fill="#00a651"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#00a651" // Default color
        }
        stroke="white"
        strokeWidth="0.3"
      />

      <path
        d="M35.2727 17.5908H41.6363"
        stroke={
          activeState === "active"
            ? "#00a651" // Active color
            : activeState === "hovered"
            ? "#00a651" // Hover color
            : "#fff" // Default color
        }
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      <path
        d="M35.2727 24.4319H41.6363"
        fill={
          activeState === "active"
            ? "#fff" // Active color
            : activeState === "hovered"
            ? "#fff" // Hover color
            : "#fff" // Default color
        }
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      <rect
        x="1"
        y="1"
        width="60"
        height="60"
        rx="21"
        stroke="#00a651"
        strokeWidth="3"
      />
    </svg>
  );
}
